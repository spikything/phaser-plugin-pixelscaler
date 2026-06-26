import Phaser from 'phaser';
import PixelScalePostFx from './PixelScalePostFx.js';

const PIPELINE_NAME = 'PixelScalePostFx';

class PixelScalerPlugin extends Phaser.Plugins.ScenePlugin {
    boot() {
        const renderer = this.scene.sys.renderer;
        if (renderer && renderer.gl && renderer.pipelines) {
            renderer.pipelines.addPostPipeline(PIPELINE_NAME, PixelScalePostFx);
        }
    }
}

PixelScalerPlugin.PIPELINE_NAME = PIPELINE_NAME;

export default PixelScalerPlugin;
