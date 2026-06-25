import terser from '@rollup/plugin-terser';

export default [
  // Unminified UMD - for debugging
  {
    input: 'src/index.js',
    output: {
      file: 'dist/phaser-plugin-pixelscaler.umd.js',
      format: 'umd',
      name: 'PhaserPluginPixelScaler',
      exports: 'default'
    }
  },
  // Minified UMD - for CDN / script-tag usage
  {
    input: 'src/index.js',
    output: {
      file: 'dist/phaser-plugin-pixelscaler.min.js',
      format: 'umd',
      name: 'PhaserPluginPixelScaler',
      exports: 'default'
    },
    plugins: [terser()]
  },
  // ES module - for bundler usage (import PixelScalePostFx from '...')
  {
    input: 'src/index.js',
    output: {
      file: 'dist/phaser-plugin-pixelscaler.esm.js',
      format: 'es'
    }
  }
];
