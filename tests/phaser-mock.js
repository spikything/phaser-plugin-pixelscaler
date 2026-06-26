class MockPostFXPipeline {
    constructor(config) {
        this.fragShader = config.fragShader;
    }
    onDraw() {}
    destroy() {}
}

class MockScenePlugin {
    constructor(scene, pluginManager) {
        this.scene = scene;
        this.pluginManager = pluginManager;
    }
    boot() {}
    destroy() {}
}

export default {
    Renderer: {
        WebGL: {
            Pipelines: {
                PostFXPipeline: MockPostFXPipeline
            }
        }
    },
    Display: {
        Color: {
            IntegerToColor: (hex) => ({
                red:   (hex >> 16) & 0xff,
                green: (hex >> 8)  & 0xff,
                blue:   hex        & 0xff
            })
        }
    },
    Plugins: {
        ScenePlugin: MockScenePlugin
    }
};
