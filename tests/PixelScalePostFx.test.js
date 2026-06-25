import { describe, it, expect, vi, beforeEach } from 'vitest';
import PixelScalePostFx from '../src/PixelScalePostFx.js';

function makeFx() {
    const fx = new PixelScalePostFx({});
    fx.renderer = {
        width: 800,
        height: 600,
        deleteTexture: vi.fn(),
        createTexture2D: vi.fn(() => ({ _tex: true }))
    };
    fx.gl = {
        NEAREST: 0x2600,
        CLAMP_TO_EDGE: 0x812f,
        RGBA: 0x1908
    };
    fx.set1f = vi.fn();
    fx.set2f = vi.fn();
    fx.set1i = vi.fn();
    fx.bindTexture = vi.fn();
    return fx;
}

describe('PixelScalePostFx', () => {

    describe('constructor defaults', () => {
        it('starts in snap mode', () => {
            expect(makeFx().mode).toBe('snap');
        });
        it('defaults pixelSize to 4', () => {
            expect(makeFx().pixelSize).toBe(4);
        });
        it('defaults dither to false', () => {
            expect(makeFx().dither).toBe(false);
        });
        it('starts with no palette texture', () => {
            const fx = makeFx();
            expect(fx.paletteTexture).toBeNull();
            expect(fx.paletteSize).toBe(0);
        });
    });

    describe('setMode', () => {
        it('accepts snap', () => {
            const fx = makeFx();
            fx.setMode('snap');
            expect(fx.mode).toBe('snap');
        });
        it('accepts palette', () => {
            const fx = makeFx();
            fx.setMode('palette');
            expect(fx.mode).toBe('palette');
        });
        it('throws on unknown mode', () => {
            expect(() => makeFx().setMode('invalid')).toThrow('unknown mode "invalid"');
        });
        it('returns this for chaining', () => {
            const fx = makeFx();
            expect(fx.setMode('palette')).toBe(fx);
        });
    });

    describe('setPixelSize', () => {
        it('sets pixel size', () => {
            const fx = makeFx();
            fx.setPixelSize(8);
            expect(fx.pixelSize).toBe(8);
        });
        it('returns this for chaining', () => {
            const fx = makeFx();
            expect(fx.setPixelSize(2)).toBe(fx);
        });
    });

    describe('setDither', () => {
        it('enables dithering', () => {
            const fx = makeFx();
            fx.setDither(true);
            expect(fx.dither).toBe(true);
        });
        it('disables dithering', () => {
            const fx = makeFx();
            fx.setDither(false);
            expect(fx.dither).toBe(false);
        });
        it('coerces truthy values to true', () => {
            const fx = makeFx();
            fx.setDither(1);
            expect(fx.dither).toBe(true);
        });
        it('coerces falsy values to false', () => {
            const fx = makeFx();
            fx.setDither(0);
            expect(fx.dither).toBe(false);
        });
        it('returns this for chaining', () => {
            const fx = makeFx();
            expect(fx.setDither(true)).toBe(fx);
        });
    });

    describe('setPalette', () => {
        it('creates a palette texture', () => {
            const fx = makeFx();
            fx.setPalette([0xff0000, 0x00ff00, 0x0000ff]);
            expect(fx.renderer.createTexture2D).toHaveBeenCalledOnce();
            expect(fx.paletteTexture).toBeTruthy();
        });
        it('sets paletteSize to the colour count', () => {
            const fx = makeFx();
            fx.setPalette([0xff0000, 0x00ff00]);
            expect(fx.paletteSize).toBe(2);
        });
        it('switches to palette mode', () => {
            const fx = makeFx();
            fx.setPalette([0xff0000]);
            expect(fx.mode).toBe('palette');
        });
        it('deletes previous texture when called again', () => {
            const fx = makeFx();
            fx.setPalette([0xff0000]);
            fx.setPalette([0x00ff00, 0x0000ff]);
            expect(fx.renderer.deleteTexture).toHaveBeenCalledOnce();
        });
        it('unpacks hex colours correctly', () => {
            const fx = makeFx();
            fx.setPalette([0x1a2b3c]);
            const data = fx.renderer.createTexture2D.mock.calls[0][6];
            expect(data[0]).toBe(0x1a); // red
            expect(data[1]).toBe(0x2b); // green
            expect(data[2]).toBe(0x3c); // blue
            expect(data[3]).toBe(255);  // alpha
        });
        it('returns this for chaining', () => {
            const fx = makeFx();
            expect(fx.setPalette([0xff0000])).toBe(fx);
        });
    });

    describe('onDraw', () => {
        it('sets resolution uniform', () => {
            const fx = makeFx();
            fx.onDraw({});
            expect(fx.set2f).toHaveBeenCalledWith('uResolution', 800, 600);
        });
        it('sets pixel size uniform', () => {
            const fx = makeFx();
            fx.onDraw({});
            expect(fx.set1f).toHaveBeenCalledWith('uPixelSize', 4);
        });
        it('sets uMode to 0 in snap mode', () => {
            const fx = makeFx();
            fx.onDraw({});
            expect(fx.set1f).toHaveBeenCalledWith('uMode', 0);
        });
        it('sets uMode to 1 in palette mode', () => {
            const fx = makeFx();
            fx.setMode('palette');
            fx.onDraw({});
            expect(fx.set1f).toHaveBeenCalledWith('uMode', 1);
        });
        it('binds palette texture in palette mode', () => {
            const fx = makeFx();
            fx.setPalette([0xff0000, 0x00ff00]);
            const tex = fx.paletteTexture;
            fx.onDraw({});
            expect(fx.bindTexture).toHaveBeenCalledWith(tex, 1);
            expect(fx.set1i).toHaveBeenCalledWith('uPaletteSampler', 1);
        });
        it('does not bind texture in snap mode', () => {
            const fx = makeFx();
            fx.onDraw({});
            expect(fx.bindTexture).not.toHaveBeenCalled();
        });
    });

    describe('destroy', () => {
        it('deletes the palette texture if present', () => {
            const fx = makeFx();
            fx.setPalette([0xff0000]);
            const tex = fx.paletteTexture;
            fx.destroy();
            expect(fx.renderer.deleteTexture).toHaveBeenCalledWith(tex);
        });
        it('nulls out paletteTexture after destroy', () => {
            const fx = makeFx();
            fx.setPalette([0xff0000]);
            fx.destroy();
            expect(fx.paletteTexture).toBeNull();
        });
        it('does not throw when there is no palette texture', () => {
            expect(() => makeFx().destroy()).not.toThrow();
        });
    });

    describe('shader source', () => {
        it('declares all expected uniforms', () => {
            const src = makeFx().fragShader;
            for (const u of ['uMainSampler', 'uPaletteSampler', 'uResolution', 'uPixelSize', 'uPaletteSize', 'uDither', 'uMode']) {
                expect(src, `missing uniform ${u}`).toContain(u);
            }
        });
        it('includes bayer4x4 and nearestPaletteColour functions', () => {
            const src = makeFx().fragShader;
            expect(src).toContain('bayer4x4');
            expect(src).toContain('nearestPaletteColour');
        });
    });

});
