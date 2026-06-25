import terser from '@rollup/plugin-terser';

export default [
  // Unminified UMD — for debugging
  {
    input: 'src/index.js',
    output: {
      file: 'dist/phaser-plugin-pixelscale.umd.js',
      format: 'umd',
      name: 'PhaserPluginPixelScale',
      exports: 'default'
    }
  },
  // Minified UMD — for CDN / script-tag usage
  {
    input: 'src/index.js',
    output: {
      file: 'dist/phaser-plugin-pixelscale.min.js',
      format: 'umd',
      name: 'PhaserPluginPixelScale',
      exports: 'default'
    },
    plugins: [terser()]
  },
  // ES module — for bundler usage (import PixelScalePostFx from '...')
  {
    input: 'src/index.js',
    output: {
      file: 'dist/phaser-plugin-pixelscale.esm.js',
      format: 'es'
    }
  }
];
