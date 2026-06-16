/**
 * POST /_emdash/api/auth/email-password/login
 *
 * Handles email+password login and initial admin account setup.
 */
import type { APIRoute } from "astro";

export const prerender = false;

import { createKyselyAdapter } from "@emdash-cms/auth/adapters/kysely";
import { Role } from "@emdash-cms/auth";
import { getAuthProviderStorage } from "emdash/api/route-utils";
import { finalizeSetup } from "emdash/api/route-utils";
import type { EmailPasswordCredential } from "./types";
import { hashPassword, verifyPassword } from "./password";

async function parseBody(request: Request): Promise<Record<string, string> | null> {
	const contentType = request.headers.get("content-type") ?? "";

	if (contentType.includes("application/json")) {
		try {
			return await request.json();
		} catch {
			return null;
		}
	}

	const text = await request.text().catch(() => null);
	if (!text) return null;
	const params = new URLSearchParams(text);
	const data: Record<string, string> = {};
	params.forEach((value, key) => { data[key] = value; });
	return Object.keys(data).length > 0 ? data : null;
}

export const POST: APIRoute = async ({ request, locals, session, redirect }) => {
	const { emdash } = locals;

	if (!emdash?.db) {
		console.log("[email-password] No database");
		return redirect("/_emdash/admin/login?error=server_error&message=" + encodeURIComponent("Database not configured"));
	}

	const body = await parseBody(request);
	console.log("[email-password] parsed body:", JSON.stringify(body));

	if (!body) {
		return redirect("/_emdash/admin/login?error=invalid_request&message=" + encodeURIComponent("Invalid request body"));
	}

	const email = body.email;
	const password = body.password;
	const name = body.name;
	const isSetup = body.setup === "true";

	console.log("[email-password] email:", email, "isSetup:", isSetup, "session:", typeof session !== "undefined");

	if (!email || !password) {
		const target = isSetup ? "/_emdash/admin/setup" : "/_emdash/admin/login";
		return redirect(target + "?error=missing_fields&message=" + encodeURIComponent("Email and password are required"));
	}

	if (password.length < 8) {
		const target = isSetup ? "/_emdash/admin/setup" : "/_emdash/admin/login";
		return redirect(target + "?error=weak_password&message=" + encodeURIComponent("Password must be at least 8 characters"));
	}

	const normalizedEmail = email.toLowerCase().trim();

	const storage = getAuthProviderStorage(emdash.db, "email-password", {
		credentials: {
			indexes: ["email"],
			uniqueIndexes: ["email"],
		},
	});

	const existingCred = await storage.credentials.get(normalizedEmail) as EmailPasswordCredential | undefined;
	console.log("[email-password] existingCred found:", !!existingCred);

	if (isSetup) {
		const adapter = createKyselyAdapter(emdash.db as any);
		const userCount = await adapter.countUsers();
		console.log("[email-password] setup - userCount:", userCount);

		if (userCount > 0) {
			return redirect("/_emdash/admin/login?error=setup_complete&message=" + encodeURIComponent("Setup already complete"));
		}

		if (existingCred) {
			return redirect("/_emdash/admin/setup?error=email_exists&message=" + encodeURIComponent("An account with this email already exists"));
		}

		if (!name) {
			return redirect("/_emdash/admin/setup?error=missing_name&message=" + encodeURIComponent("Name is required for setup"));
		}

		const { hash, salt, iterations } = await hashPassword(password);

		const user = await adapter.createUser({
			email: normalizedEmail,
			name,
			role: Role.ADMIN,
			emailVerified: true,
		});
		console.log("[email-password] setup - created user:", user.id);

		const credential: EmailPasswordCredential = {
			email: normalizedEmail,
			passwordHash: hash,
			salt,
			iterations,
			userId: user.id,
			createdAt: new Date().toISOString(),
		};

		await storage.credentials.put(normalizedEmail, credential as unknown as Record<string, unknown>);

		await finalizeSetup(emdash.db);
		console.log("[email-password] setup - finalized, session.set:", !!session);
		session?.set("user", { id: user.id });
		console.log("[email-password] setup - redirecting to /_emdash/admin");

		return redirect("/_emdash/admin");
	}

	if (!existingCred) {
		return redirect("/_emdash/admin/login?error=invalid_credentials&message=" + encodeURIComponent("Invalid email or password"));
	}

	const valid = await verifyPassword(password, existingCred.passwordHash, existingCred.salt, existingCred.iterations);
	console.log("[email-password] password valid:", valid);

	if (!valid) {
		return redirect("/_emdash/admin/login?error=invalid_credentials&message=" + encodeURIComponent("Invalid email or password"));
	}

	const adapter = createKyselyAdapter(emdash.db as any);
	const user = await adapter.getUserByEmail(normalizedEmail);
	console.log("[email-password] user found:", !!user, user?.id);

	if (!user) {
		return redirect("/_emdash/admin/login?error=account_not_found&message=" + encodeURIComponent("Account not found. Contact an administrator."));
	}

	if (user.disabled) {
		return redirect("/_emdash/admin/login?error=disabled&message=" + encodeURIComponent("Account has been disabled"));
	}

	console.log("[email-password] setting session...");
	session?.set("user", { id: user.id });
	console.log("[email-password] redirecting to /_emdash/admin");

	return redirect("/_emdash/admin");
};
