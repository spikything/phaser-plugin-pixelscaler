# phaser-plugin-pixelscale

A WebGL post-FX pipeline for Phaser 3 that snaps a normally-rendered
scene to a virtual pixel grid - so any game can render at full
resolution and still come out looking like native pixel art, without
authoring at a tiny canvas size or paying for a CPU canvas blit.

Companion to [phaser-plugin-crt](https://www.npmjs.com/package/phaser-plugin-crt) -
same `setPostPipeline()` API, can be stacked on the same camera.

## Install

```bash
npm install phaser-plugin-pixelscale
```

Or via CDN script tag:

```html
<script src="https://cdn.jsdelivr.net/npm/phaser-plugin-pixelscale/dist/phaser-plugin-pixelscale.min.js"></script>
```

## Usage

### Basic grid-snap mode

Cheapest mode. Snaps sampling to a virtual pixel grid - no colour
changes, just removes sub-pixel detail so everything reads as chunky
pixel art at whatever your real render resolution is.

```js
import PixelScalePostFx from "phaser-plugin-pixelscale";

// in create()
this.cameras.main.setPostPipeline(PixelScalePostFx);

const fx = this.cameras.main.getPostPipeline(PixelScalePostFx);
fx.setPixelSize(4); // each "virtual pixel" = 4 real screen pixels
```

### Palette mode

Grid-snap plus nearest-colour quantisation against a fixed palette -
the look of an actual limited-colour pixel-art game, regardless of
how many colours your source art/lighting actually uses.

```js
const fx = this.cameras.main.getPostPipeline(PixelScalePostFx);

fx.setPalette([
  0x1a1c2c, 0x5d275d, 0xb13e53, 0xef7d57, 0xffcd75, 0xa7f070, 0x38b764,
  0x257179, 0x29366f, 0x3b5dc9, 0x41a6f6, 0x73eff7, 0xf4f4f4, 0x94b0c2,
  0x566c86, 0x333c57,
]); // e.g. PICO-8 / Endesga-32 style palettes work well

fx.setPixelSize(4);
fx.setDither(true); // optional 4x4 ordered dithering to soften banding
```

### Applying to a single game object instead of the whole camera

```js
sprite.setPostPipeline(PixelScalePostFx);
const fx = sprite.getPostPipeline(PixelScalePostFx);
fx.setPixelSize(2);
```

Useful if you want pixel-art sprites composited against
non-pixelated UI/text in the same scene.

## API

| Method                         | Description                                            |
| ------------------------------ | ------------------------------------------------------ |
| `setMode('snap' \| 'palette')` | Switch quantisation mode at runtime                    |
| `setPixelSize(n)`              | Virtual pixel size, in source pixels                   |
| `setPalette(hexColours[])`     | Array of hex ints; auto-switches to `'palette'` mode   |
| `setDither(bool)`              | Toggle 4x4 Bayer ordered dithering (palette mode only) |

## Notes

- WebGL only, same as `phaser-plugin-crt` - there's no canvas-renderer fallback.
- `pixelSize` is defined in _source_ pixels relative to your actual render
  resolution, not screen pixels - so this works the same whether you're
  rendering at 320x180 or native 4K. No backing-resolution changes needed.
- For non-integer `pixelSize` values you'll get uneven pixel blocks, same
  caveat as any nearest-neighbour scaling approach - pick pixel sizes that
  divide your render resolution evenly if that matters to you.
- Palette mode loops over up to 256 palette entries per fragment; larger
  palettes (>64 colours) will cost more on weaker GPUs - worth profiling
  on actual target hardware rather than desktop.

## License

MIT
