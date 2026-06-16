# Plan: Add Google OAuth & Email/Password Sign-In to EmDash Admin

## Context

EmDash admin currently uses **passkeys (WebAuthn) only**. The user cannot use passkeys and needs:
1. **Google OAuth** — natively supported by EmDash, config-only
2. **Email/password** — not natively supported, requires a custom `AuthProviderDescriptor`

Both providers coexist alongside the existing passkey auth.

## Design Decisions

- **Password hashing**: Web Crypto PBKDF2 (zero dependencies, works on Cloudflare Workers + Node.js)
- **Credential storage**: EmDash's `_plugin_storage` table via `getAuthProviderStorage()`, namespaced under `auth:email-password`
- **User linking**: By email — auto-provisions new EmDash users on first login
- **Setup**: `SetupStep` component lets first admin create account via email/password during EmDash setup wizard
- **No external dependencies** — everything uses existing packages + Web Crypto

## Files to Create

### 1. `apps/frontend/src/auth/email-password/types.ts`

Type definitions for stored credentials.

```ts
export interface EmailPasswordCredential {
  email: string;
  passwordHash: string;
  salt: string;
  iterations: number;
  userId: string;
  createdAt: string;
}
```

### 2. `apps/frontend/src/auth/email-password/password.ts`

Password hashing and verification using Web Crypto PBKDF2.

- `hashPassword(password: string): Promise<{ hash: string; salt: string; iterations: number }>`
- `verifyPassword(password: string, hash: string, salt: string, iterations: number): Promise<boolean>`

Uses `crypto.subtle.importKey` + `crypto.subtle.deriveBits` with SHA-256.
Salt: 16 random bytes (hex-encoded). Iterations: 100,000.

### 3. `apps/frontend/src/auth/email-password/index.ts`

Provider descriptor:

```ts
import type { AuthProviderDescriptor } from "emdash";

export function emailPassword(): AuthProviderDescriptor {
  return {
    id: "email-password",
    label: "Email & Password",
    adminEntry: "@/auth/email-password/admin",
    routes: [
      {
        pattern: "/_emdash/api/auth/email-password/login",
        entrypoint: "@/auth/email-password/login",
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
```

Note: The `@/` path alias is the project's `src/` alias defined in `tsconfig.json`.

### 4. `apps/frontend/src/auth/email-password/admin.tsx`

React components exported as `AuthProviderAdminExports`:

**`LoginForm`** — rendered on EmDash login page (`/_emdash/admin/login`):
- Email input + password input + submit button
- POSTs to `/_emdash/api/auth/email-password/login`
- Handles error display (wrong password, user not found)
- Calls `window.location.reload()` on success (redirects to admin)

**`SetupStep`** — rendered on EmDash setup wizard (`/_emdash/admin/setup`):
- Email input + name input + password input + confirm password + submit button
- POSTs to `/_emdash/api/auth/email-password/login` with `setup: true` body
- Validates password match
- Calls `onComplete()` prop on success
- Error handling for existing users, validation errors

### 5. `apps/frontend/src/auth/email-password/login.ts`

Astro API route handler:

```
POST /_emdash/api/auth/email-password/login
```

Logic:
1. Parse email + password from request body (JSON or form-encoded)
2. Look up stored credentials by email via `getAuthProviderStorage`
3. If not found: return 401 "Invalid email or password"
4. Verify password hash using `verifyPassword()`
5. Look up or create EmDash user via `createKyselyAdapter`:
   - If `setup: true` and no users exist: create admin user (Role.ADMIN), call `finalizeSetup()`
   - If user exists by email: get existing user
   - If user doesn't exist and setup is complete: return 401 (no self-signup)
6. Set session: `session.set("user", { id: user.id })`
7. Return 200 with redirect URL: `/_emdash/admin`

Imports used:
- `APIRoute` from `astro`
- `createKyselyAdapter` from `@emdash-cms/auth/adapters/kysely`
- `Role` from `@emdash-cms/auth`
- `getAuthProviderStorage`, `finalizeSetup`, `apiError`, `apiSuccess`, `parseBody` from `emdash/api/route-utils`

## Files to Modify

### 6. `apps/frontend/astro.config.mjs`

Add auth providers to the `emdash()` integration call:

```js
import { google } from "emdash/auth/providers/google";
import { emailPassword } from "./src/auth/email-password/index.ts";

// In the emdash() call:
emdash({
  database,
  storage,
  authProviders: [google(), emailPassword()],
}),
```

### 7. `apps/frontend/.env`

Add (placeholder values):

```env
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

### 8. `apps/frontend/.env.example`

Add same placeholder entries.

## Setup Required by User

After implementation, the user must:

1. **Create a Google Cloud OAuth 2.0 project:**
   - Go to https://console.cloud.google.com/apis/credentials
   - Create OAuth 2.0 Client ID (Web application)
   - Add authorized redirect URI: `https://<domain>/_emdash/api/auth/oauth/google/callback`
   - For local dev: `http://localhost:4321/_emdash/api/auth/oauth/google/callback`
   - Copy Client ID and Client Secret

2. **Set environment variables:**
   ```env
   GOOGLE_CLIENT_ID=<client-id>
   GOOGLE_CLIENT_SECRET=<client-secret>
   ```

3. **For production (Cloudflare Workers):**
   - Set secrets via `wrangler secret put GOOGLE_CLIENT_ID`
   - Set secrets via `wrangler secret put GOOGLE_CLIENT_SECRET`
   - Or use Cloudflare Dashboard → Workers → Settings → Variables

## Verification

After deployment:
1. Visit `/_emdash/admin` — should show 3 options: Passkey, Google, Email & Password
2. **First run (setup wizard)**: Create admin account via Google OAuth or email/password SetupStep
3. **Subsequent logins**: Sign in with any configured provider
4. Test email/password login with correct and incorrect credentials
5. Test Google OAuth flow end-to-end
6. Verify session cookie is set and admin dashboard is accessible

## Edge Cases Handled

- **No self-registration after setup**: Login rejects unknown emails after setup is complete
- **Duplicate setup**: Setup step only works when no admin exists
- **Password mismatch**: Clear error message on login form
- **Empty credentials**: Proper validation of email/password fields
- **User disabled**: `createKyselyAdapter` handles disabled users
- **Concurrent login**: Each request handles independently; last session wins
