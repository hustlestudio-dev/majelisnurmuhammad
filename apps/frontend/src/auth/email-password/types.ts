export interface EmailPasswordCredential {
	email: string;
	passwordHash: string;
	salt: string;
	iterations: number;
	userId: string;
	createdAt: string;
}
