const ITERATIONS = 100_000;
const HASH_BYTES = 32;
const SALT_BYTES = 16;

function bytesToBase64(bytes: Uint8Array): string {
	let binary = "";
	for (let i = 0; i < bytes.length; i++) {
		binary += String.fromCharCode(bytes[i]);
	}
	return btoa(binary);
}

function base64ToBytes(base64: string): Uint8Array {
	const binary = atob(base64);
	const bytes = new Uint8Array(binary.length);
	for (let i = 0; i < binary.length; i++) {
		bytes[i] = binary.charCodeAt(i);
	}
	return bytes;
}

export async function hashPassword(
	password: string,
): Promise<{ hash: string; salt: string; iterations: number }> {
	const encoder = new TextEncoder();
	const salt = crypto.getRandomValues(new Uint8Array(SALT_BYTES));
	const keyMaterial = await crypto.subtle.importKey(
		"raw",
		encoder.encode(password),
		"PBKDF2",
		false,
		["deriveBits"],
	);
	const derivedBits = await crypto.subtle.deriveBits(
		{ name: "PBKDF2", salt, iterations: ITERATIONS, hash: "SHA-256" },
		keyMaterial,
		HASH_BYTES * 8,
	);
	return {
		hash: bytesToBase64(new Uint8Array(derivedBits)),
		salt: bytesToBase64(salt),
		iterations: ITERATIONS,
	};
}

export async function verifyPassword(
	password: string,
	storedHash: string,
	storedSalt: string,
	storedIterations: number,
): Promise<boolean> {
	const encoder = new TextEncoder();
	const salt = base64ToBytes(storedSalt);
	const keyMaterial = await crypto.subtle.importKey(
		"raw",
		encoder.encode(password),
		"PBKDF2",
		false,
		["deriveBits"],
	);
	const derivedBits = await crypto.subtle.deriveBits(
		{ name: "PBKDF2", salt, iterations: storedIterations, hash: "SHA-256" },
		keyMaterial,
		HASH_BYTES * 8,
	);
	const computedHash = bytesToBase64(new Uint8Array(derivedBits));
	return computedHash === storedHash;
}
