import terser from '@rollup/plugin-terser';

const external = ['phaser'];
const globals = { phaser: 'Phaser' };

export default [
  // Unminified UMD - for debugging / CDN with separate Phaser script tag
  {
    input: 'src/index.js',
    external,
    output: {
      file: 'dist/phaser-plugin-pixelscaler.umd.js',
      format: 'umd',
      name: 'PhaserPluginPixelScaler',
      globals,
      exports: 'named'
    }
  },
  // Minified UMD - for CDN / script-tag production usage
  {
    input: 'src/index.js',
    external,
    output: {
      file: 'dist/phaser-plugin-pixelscaler.min.js',
      format: 'umd',
      name: 'PhaserPluginPixelScaler',
      globals,
      exports: 'named'
    },
    plugins: [terser()]
  },
  // ES module - for bundler usage (Vite, webpack, etc.)
  {
    input: 'src/index.js',
    external,
    output: {
      file: 'dist/phaser-plugin-pixelscaler.esm.js',
      format: 'es'
    }
  }
];
