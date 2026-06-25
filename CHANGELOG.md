# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2026-06-25

### Added

- `snap` mode - nearest-neighbour grid snapping to a virtual pixel grid
- `palette` mode - grid snapping plus nearest-colour quantisation against a user-supplied palette
- Optional 4x4 Bayer ordered dithering in palette mode (`setDither`)
- `setPixelSize(n)` - set virtual pixel size in source pixels
- `setMode('snap' | 'palette')` - switch modes at runtime
- `setPalette(hexColours[])` - load a palette from an array of hex integers; auto-switches to palette mode
- UMD and ESM builds via Rollup
