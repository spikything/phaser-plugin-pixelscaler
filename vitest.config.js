import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
    resolve: {
        alias: {
            phaser: resolve(__dirname, 'tests/phaser-mock.js')
        }
    },
    test: {
        setupFiles: ['./tests/setup.js']
    }
});
