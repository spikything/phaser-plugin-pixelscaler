import { describe, it, expect, vi } from 'vitest';
import PixelScalerPlugin from '../src/PixelScalerPlugin.js';
import PixelScalePostFx from '../src/PixelScalePostFx.js';

function makePlugin() {
    const addPostPipeline = vi.fn();
    const scene = {
        sys: {
            renderer: {
                gl: {},
                pipelines: { addPostPipeline }
            }
        }
    };
    const plugin = new PixelScalerPlugin(scene, {});
    return { plugin, addPostPipeline, scene };
}

describe('PixelScalerPlugin', () => {
    it('exposes PIPELINE_NAME', () => {
        expect(PixelScalerPlugin.PIPELINE_NAME).toBe('PixelScalePostFx');
    });

    describe('boot', () => {
        it('registers PixelScalePostFx with the pipeline manager', () => {
            const { plugin, addPostPipeline } = makePlugin();
            plugin.boot();
            expect(addPostPipeline).toHaveBeenCalledOnce();
            expect(addPostPipeline).toHaveBeenCalledWith('PixelScalePostFx', PixelScalePostFx);
        });

        it('does not throw when renderer has no WebGL context', () => {
            const scene = {
                sys: {
                    renderer: { gl: null, pipelines: null }
                }
            };
            const plugin = new PixelScalerPlugin(scene, {});
            expect(() => plugin.boot()).not.toThrow();
        });
    });
});
