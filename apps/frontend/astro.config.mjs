import tailwindcss from "@tailwindcss/vite";
// @ts-check
import { defineConfig, envField } from 'astro/config';
import netlify from '@astrojs/netlify';

// https://astro.build/config
export default defineConfig({
	output: 'server',
	adapter: netlify(),
	devToolbar: { enabled: false },
	env: {
		schema: {
			PAYLOAD_API_URL: envField.string({
				context: 'server',
				access: 'secret',
				default: 'http://localhost:3000',
			}),
		},
	},
	vite: {
		plugins: [tailwindcss()],
	},
});
