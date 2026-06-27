export type PixelScaleMode = 'snap' | 'palette';

export declare class PixelScalePostFx {
    constructor(game: unknown);

    mode: PixelScaleMode;
    pixelSize: number;
    dither: boolean;
    paletteTexture: unknown;
    paletteSize: number;
    fragShader: string;

    /** Switch between 'snap' (pixel grid only) and 'palette' (colour quantisation) mode. */
    setMode(mode: PixelScaleMode): this;

    /** Size of each virtual pixel in screen pixels. */
    setPixelSize(size: number): this;

    /** Enable or disable Bayer 4x4 ordered dithering (palette mode only). */
    setDither(enabled: boolean): this;

    /**
     * Load a colour palette from an array of 24-bit hex integers and switch to
     * palette mode. Each entry is an RGB colour, e.g. `0x1a1c2c`.
     */
    setPalette(hexColours: number[]): this;

    onDraw(renderTarget: unknown): void;
    destroy(): void;
}

export declare class PixelScalerPlugin {
    /** The pipeline key used to register the effect with Phaser's renderer. */
    static PIPELINE_NAME: string;

    constructor(scene: unknown, pluginManager: unknown);

    boot(): void;
}

export default PixelScalerPlugin;
