import Phaser from 'phaser';

const FRAG = `
precision mediump float;

uniform sampler2D uMainSampler;
uniform sampler2D uPaletteSampler;
uniform vec2 uResolution;
uniform float uPixelSize;
uniform float uPaletteSize;
uniform float uDither;
uniform float uMode;

varying vec2 outTexCoord;

float bayer4x4(vec2 pos) {
    int x = int(mod(pos.x, 4.0));
    int y = int(mod(pos.y, 4.0));
    int index = x + y * 4;

    float bayer[16];
    bayer[0]=0.0;  bayer[1]=8.0;  bayer[2]=2.0;  bayer[3]=10.0;
    bayer[4]=12.0; bayer[5]=4.0;  bayer[6]=14.0; bayer[7]=6.0;
    bayer[8]=3.0;  bayer[9]=11.0; bayer[10]=1.0; bayer[11]=9.0;
    bayer[12]=15.0;bayer[13]=7.0; bayer[14]=13.0;bayer[15]=5.0;

    for (int i = 0; i < 16; i++) {
        if (i == index) return bayer[i] / 16.0;
    }
    return 0.0;
}

vec3 nearestPaletteColour(vec3 colour) {
    vec3 best = colour;
    float bestDist = 1.0e6;

    for (int i = 0; i < 256; i++) {
        if (float(i) >= uPaletteSize) break;
        float u = (float(i) + 0.5) / uPaletteSize;
        vec3 candidate = texture2D(uPaletteSampler, vec2(u, 0.5)).rgb;
        vec3 diff = colour - candidate;
        float dist = dot(diff, diff);
        if (dist < bestDist) {
            bestDist = dist;
            best = candidate;
        }
    }
    return best;
}

void main() {
    vec2 texel = uPixelSize / uResolution;
    vec2 snapped = floor(outTexCoord / texel) * texel + texel * 0.5;
    vec4 src = texture2D(uMainSampler, snapped);

    if (uMode < 0.5) {
        gl_FragColor = src;
    } else {
        vec3 colour = src.rgb;

        if (uDither > 0.5) {
            vec2 block = floor(outTexCoord / texel);
            float threshold = (bayer4x4(block) - 0.5) * (1.0 / uPaletteSize);
            colour += threshold;
        }

        gl_FragColor = vec4(nearestPaletteColour(colour), src.a);
    }
}
`;

class PixelScalePostFx extends Phaser.Renderer.WebGL.Pipelines.PostFXPipeline {
    constructor(game) {
        super({
            game,
            fragShader: FRAG
        });

        this.mode = 'snap';
        this.pixelSize = 4;
        this.dither = false;
        this.paletteTexture = null;
        this.paletteSize = 0;
    }

    setMode(mode) {
        if (mode !== 'snap' && mode !== 'palette') {
            throw new Error(`PixelScalePostFx: unknown mode "${mode}"`);
        }
        this.mode = mode;
        return this;
    }

    setPixelSize(size) {
        this.pixelSize = size;
        return this;
    }

    setDither(enabled) {
        this.dither = !!enabled;
        return this;
    }

    /**
     * Load a palette from an array of hex colours, e.g.
     * fx.setPalette([0x1a1c2c, 0xf4f4f4, 0xb13e53, ...]);
     *
     * Builds a 1xN RGBA texture, one texel per colour, sampled with
     * NEAREST filtering so lookups never blend between entries.
     * Auto-switches to 'palette' mode.
     */
    setPalette(hexColours) {
        const renderer = this.renderer;
        const gl = this.gl;

        if (this.paletteTexture) {
            renderer.deleteTexture(this.paletteTexture);
            this.paletteTexture = null;
        }

        const n = hexColours.length;
        const data = new Uint8Array(n * 4);

        for (let i = 0; i < n; i++) {
            const c = Phaser.Display.Color.IntegerToColor(hexColours[i]);
            data[i * 4 + 0] = c.red;
            data[i * 4 + 1] = c.green;
            data[i * 4 + 2] = c.blue;
            data[i * 4 + 3] = 255;
        }

        this.paletteTexture = renderer.createTexture2D(
            0, gl.NEAREST, gl.NEAREST, gl.CLAMP_TO_EDGE, gl.CLAMP_TO_EDGE,
            gl.RGBA, data, n, 1, false, false, false
        );
        this.paletteSize = n;

        if (this.mode !== 'palette') this.setMode('palette');
        return this;
    }

    onDraw(renderTarget) {
        this.set2f('uResolution', this.renderer.width, this.renderer.height);
        this.set1f('uPixelSize', this.pixelSize);
        this.set1f('uMode', this.mode === 'palette' ? 1 : 0);
        this.set1f('uPaletteSize', this.paletteSize || 1);
        this.set1f('uDither', this.dither ? 1 : 0);

        if (this.mode === 'palette' && this.paletteTexture) {
            this.bindTexture(this.paletteTexture, 1);
            this.set1i('uPaletteSampler', 1);
        }

        super.onDraw(renderTarget);
    }

    destroy() {
        if (this.paletteTexture) {
            this.renderer.deleteTexture(this.paletteTexture);
            this.paletteTexture = null;
        }
        super.destroy();
    }
}

export default PixelScalePostFx;
