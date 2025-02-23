# vite-solid-svg

[![Coverage Status](https://coveralls.io/repos/github/thednp/vite-solid-svg/badge.svg)](https://coveralls.io/github/thednp/vite-solid-svg)
[![ci](https://github.com/thednp/vite-solid-svg/actions/workflows/ci.yml/badge.svg)](https://github.com/thednp/vite-solid-svg/actions/workflows/ci.yml)
[![NPM Version](https://img.shields.io/npm/v/vite-solid-svg.svg)](https://www.npmjs.com/package/vite-solid-svg)
[![typescript version](https://img.shields.io/badge/typescript-5.7.3-brightgreen)](https://www.typescriptlang.org/)
[![solid-js version](https://img.shields.io/badge/solid--js-1.9.5-brightgreen)](https://github.com/solidjs/solid)
[![vitest version](https://img.shields.io/badge/vitest-3.0.6-brightgreen)](https://www.vitest.dev/)
[![vite version](https://img.shields.io/badge/vite-6.1.1-brightgreen)](https://vite.dev)


A Vite plugin that transforms SVG files into SolidJS components using the [DOMParser](https://github.com/thednp/domparser).
Why this one? Because it's the fastest.


## Features
* 🚀 Fast transformation using [DOMParser](https://github.com/thednp/domparser)
* 🎯 TypeScript support
* 🔧 Configurable transformation options
* 💪 Full props support (className, style, events, etc.)
* 🔥 Hot Module Replacement (HMR) support
* ⚡ Vitest powered tests


## Installation

```bash
npm install -D vite-solid-svg
```

```bash
pnpm add -D vite-solid-svg
```

```bash
yarn add -D vite-solid-svg
```

```bash
deno add npm:vite-solid-svg
```

```bash
bun install vite-solid-svg
```


## Usage
### Configuration
```ts
// vite.config.ts
import { defineConfig } from 'vite'
import solidSVG from 'vite-solid-svg'

export default defineConfig({
  plugins: [
    // other plugins
    solidSVG({
        // optional
    })
  ]
})
```

### Options
While the default options work just fine, for your convenience the plugin allows you to set them all:

```ts
interface VitePluginSolidSvgOptions {
  // esbuild transform options
  esbuildOptions?: EsbuildTransformOPtions;
  // filter options
  include?: string | RegExp | (string | RegExp)[]
  exclude?: string | RegExp | (string | RegExp)[]
}
```

* `esbuildOptions`: [EsbuildTransformOptions](https://esbuild.github.io/api/#transform) esbuild will make sure the plugin will work seamless within the Vite ecosystem and provides some additional options;
* `include`: filter option to **include** one or more RegExp for file IDs; the default value is `["**/*.svg?solid"]`;
* `exclude`: filter option to **exclude** one or more RegExp for file IDs.

**Note** - If you modify or add more include filters and you're using Typescript, you should also define new global modules.


### Typescript
To add typescript support, edit your `src/vite-env.d.ts` (or any global types you have set in your app) as follows:

```ts
/// <reference types="vite/client" />
/// <reference types="vite-solid-svg" />
```


### In Your Code
```ts
import Icon from './icon.svg?solid'

const app = () => {
  return <div>
    <Icon
      class='my-icon'
      width={24} height={24}
      style={{ fill: "currentColor" }}
    />
  </div>
}
```
**Notes**:
 * All properties present in the markup of your SVG files will be used as default values;
 * The `viewBox` and `xmlns` properties are somewhat required in order for the SVG to be rendered properly;
 * The plugin will also resolve SVG files from the `/public` folder or any valid `viteConfig.publicDir` option.


## Contributing
* Fork it!
* Create your feature branch: `git checkout -b my-new-feature`
* Commit your changes: `git commit -am 'Add some feature'`
* Push to the branch: `git push origin 'my-new-feature'`
* Submit a pull request


## Acknowledgments
* [vite-plugin-svgr](https://github.com/pd4d10/vite-plugin-svgr) - For inspiration on the plugin architecture.
* [vite-react-svg](https://github.com/thednp/vite-react-svg) - For a React version.


## License
**vite-solid-svg** is released under [MIT License](LICENSE).
