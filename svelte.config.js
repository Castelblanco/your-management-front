// import adapter from '@sveltejs/adapter-auto';
import adapter from 'svelte-adapter-bun';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';

const file = fileURLToPath(new URL('package.json', import.meta.url));
const json = readFileSync(file, 'utf8');
const pkg = JSON.parse(json);

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: vitePreprocess(),
	kit: {
		// adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
		// If your environment is not supported or you settled on a specific environment, switch out the adapter.
		// See https://kit.svelte.dev/docs/adapters for more information about adapters.
		adapter: adapter(),
		alias: {
			'$atoms/*': 'src/components/atoms/*',
			'$molecules/*': 'src/components/molecules/*',
			'$organisms/*': 'src/components/organisms/*',
			'$templates/*': 'src/components/templates/*',
			'$stores/*': 'src/stores/*',
			'$lib/*': 'src/lib/*',
			'$constants/*': 'src/constants/*',
			'$directives/*': 'src/directives/*',
			'$common/*': 'src/common/*',
			'$models/*': 'src/models/*',
			'$services/*': 'src/services/*',
			'$tools/*': 'src/tools/*',
			'$helpers/*': 'src/helpers/*'
		},
		version: {
			name: pkg.version
		}
	}
};

export default config;
