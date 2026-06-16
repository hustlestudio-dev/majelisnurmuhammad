import type { AuthProviderDescriptor } from "emdash";

export function emailPassword(): AuthProviderDescriptor {
	return {
		id: "email-password",
		label: "Email & Password",
		adminEntry: "@/auth/email-password/admin.tsx",
		routes: [
			{
				pattern: "/_emdash/api/auth/email-password/login",
				entrypoint: "./src/auth/email-password/login.ts",
			},
		],
		publicRoutes: ["/_emdash/api/auth/email-password/"],
		storage: {
			credentials: {
				indexes: ["email"],
				uniqueIndexes: ["email"],
			},
		},
	};
}
