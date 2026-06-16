import tailwindcss from '@tailwindcss/vite';
// @ts-check
import { defineConfig, sessionDrivers } from 'astro/config';
import react from '@astrojs/react';
import emdash, { local } from 'emdash/astro';
import { google } from 'emdash/auth/providers/google';
import { emailPassword } from './src/auth/email-password/index.ts';
import swup from '@swup/astro';
import { sqlite } from 'emdash/db';

const isCloudflare = process.env.DEPLOY_TARGET === 'cloudflare';

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
		plugins: [tailwindcss()],
	},
});
