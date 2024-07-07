import { defineConfig } from "@farmfe/core";
import solidPlugin from "vite-plugin-solid";
import farmJsPluginPostcss from "@farmfe/js-plugin-postcss";

let useProdContent = true;
let useProdAssets = true;

let proxyObj: any = {};

if (useProdAssets) {
  proxyObj["/auth"] = {
    target: "http://localhost:8787", // Replace with your actual API server address
    changeOrigin: true,
    rewrite: (path: string) => path,
  };
}

if (useProdContent) {
  proxyObj["/api"] = {
    target: "http://localhost:8787", // Replace with your actual API server address
    changeOrigin: true,
    rewrite: (path: string) => path,
  };
}

export default defineConfig({
  plugins: [farmJsPluginPostcss()],
  vitePlugins: [
    () => ({ vitePlugin: solidPlugin(), filters: ["\\.jsx$", "\\.tsx$"] }),
  ],
  server: {
    port: 3000,
    proxy: proxyObj,
    cors: true,
  },
  // build: {
  //   target: "esnext",
  //   minify: "esbuild",
  //   cssMinify: "lightningcss",
  // },
  // optimizeDeps: {
  //   exclude: ["solid-highlight", "highlightjs", "mathlive", "dockview-core"],
  // },
});
