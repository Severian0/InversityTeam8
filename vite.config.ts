import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';
// import devtools from 'solid-devtools/vite';

let useProdContent = false;
let useProdAssets = false;

let proxyObj: any = {};

if (useProdAssets) {
    proxyObj['/auth'] = {
        target: 'http://localhost:8787', // Replace with your actual API server address
        changeOrigin: true,
        rewrite: (path: string) => path,
    };
}

if (useProdContent) {
    proxyObj['/api'] = {
        target: 'http://localhost:8787', // Replace with your actual API server address
        changeOrigin: true,
        rewrite: (path: string) => path,
    };
}

export default defineConfig({
    plugins: [
        /* 
    Uncomment the following line to enable solid-devtools.
    For more info see https://github.com/thetarnav/solid-devtools/tree/main/packages/extension#readme
    */
        // devtools(),
        solidPlugin(),
    ],
    server: {
        port: 3000,
        proxy: proxyObj,
        cors: true,
    },
    build: {
        target: 'esnext',
        minify: 'esbuild',
        cssMinify: 'lightningcss',
    },
    optimizeDeps: {
        exclude: ['solid-highlight', 'highlightjs', 'mathlive'],
    },
});
