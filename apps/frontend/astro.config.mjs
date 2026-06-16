import tailwindcss from '@tailwindcss/vite';
// @ts-check
import { defineConfig, sessionDrivers } from 'astro/config';
import react from '@astrojs/react';
import emdash, { local } from 'emdash/astro';
import { google } from 'emdash/auth/providers/google';
import { emailPassword } from './src/auth/email-password/index.ts';
import swup from '@swup/astro';
import { sqlite } from 'emdash/db';

// Cloudflare's git-connected build (Workers Builds / Pages) sets CF_PAGES /
// WORKERS_CI but not our DEPLOY_TARGET, so detect those too — otherwise the
// adapter is skipped and `astro build` fails with NoAdapterInstalled.
const isCloudflare =
	process.env.DEPLOY_TARGET === 'cloudflare' ||
	process.env.CF_PAGES === '1' ||
	process.env.WORKERS_CI === '1';

let adapter;
let database;
let storage;
let session;

if (isCloudflare) {
	const cloudflare = (await import('@astrojs/cloudflare')).default;
	const { d1, r2 } = await import('@emdash-cms/cloudflare');
	adapter = cloudflare({ sessionKVBindingName: 'SESSION' });
	database = d1({ binding: 'DB' });
	storage = r2({ binding: 'MEDIA' });
} else {
	database = sqlite({ url: 'file:./data.db' });
	storage = local({
		directory: './uploads',
		baseUrl: '/_emdash/api/media/file',
	});
	session = { driver: sessionDrivers.fsLite({ base: './.sessions' }) };
}

// In dev, Astro's style crawler leaks @emdash-cms/admin's compiled Tailwind
// bundle (mostly unlayered utilities) onto public pages, where it out-cascades
// the site's layered utilities. Wrap it in the lowest cascade layer so it can
// never override site styles. No-op for the admin route itself (it declares no
// competing layer order). Prod is unaffected — admin CSS isn't imported there.
const emdashAdminCssLayer = {
	name: 'emdash-admin-css-layer',
	enforce: 'pre',
	transform(code, id) {
		if (id.replace(/\\/g, '/').includes('@emdash-cms/admin/dist/styles.css')) {
			return { code: `@layer emdash-admin{\n${code}\n}`, map: null };
		}
	},
};

// https://astro.build/config
export default defineConfig({
	output: 'server',
	...(adapter ? { adapter } : {}),
	...(session ? { session } : {}),
	devToolbar: { enabled: false },
	integrations: [
		react(),
		emdash({
			database,
			storage,
			authProviders: [google(), emailPassword()],
		}),
	],
	vite: {
		plugins: [emdashAdminCssLayer, tailwindcss()],
	},
});
