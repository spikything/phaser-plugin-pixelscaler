# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.1] - 2026-06-27

### Added

- `index.d.ts` - TypeScript declaration file covering the full public API:
  `PixelScalePostFx`, `PixelScalerPlugin`, and the `PixelScaleMode` union type.
  Exported via `"types"` field and the package exports map so bundlers and IDEs
  pick it up automatically.

## [0.2.0] - 2026-06-25

### Fixed

- ESM bundle now includes `import Phaser from 'phaser'` - previously the class
  relied on `globalThis.Phaser` being set as a side-effect of Phaser's webpack
  bundle, which is not guaranteed in all environments.
- `phaser` is now declared `external` in the Rollup config, so it is never
  accidentally bundled into the output.

### Added

- `PixelScalerPlugin` - a Phaser Scene Plugin that calls
  `renderer.pipelines.addPostPipeline` in its `boot()` hook. This is the
  required registration step in Phaser 3.60+ before `setPostPipeline` /
  `getPostPipeline` will work. Use the string name `'PixelScalePostFx'` (or
  `PixelScalerPlugin.PIPELINE_NAME`) for all pipeline calls:
  ```js
  this.cameras.main.setPostPipeline('PixelScalePostFx');
  const fx = this.cameras.main.getPostPipeline('PixelScalePostFx');
  ```
- `demo/index.html` - interactive browser demo with plasma/shapes/grid scenes,
  pixel-size slider, mode/palette/dither controls, and a live FPS chart.
  - Plasma scene uses a GLSL fragment shader (GPU-driven, smooth at any
    resolution, zero CPU cost per frame).
  - FPS overlay rendered on a second HUD camera with no post-FX pipeline,
    so the counter stays crisp regardless of pixel size setting.

### Changed

- `src/index.js` now exports both `PixelScalerPlugin` (default) and
  `PixelScalePostFx` (named). UMD global is `PhaserPluginPixelScaler`
  (an object with both names as properties).
- README updated with correct plugin registration pattern.

## [0.1.0] - 2026-06-25

### Added

- `snap` mode - nearest-neighbour grid snapping to a virtual pixel grid
- `palette` mode - grid snapping plus nearest-colour quantisation against a user-supplied palette
- Optional 4x4 Bayer ordered dithering in palette mode (`setDither`)
- `setPixelSize(n)` - set virtual pixel size in source pixels
- `setMode('snap' | 'palette')` - switch modes at runtime
- `setPalette(hexColours[])` - load a palette from an array of hex integers; auto-switches to palette mode
- UMD and ESM builds via Rollup
