import legacy from "@vitejs/plugin-legacy";
import vue2 from "@vitejs/plugin-vue2";
import path from "node:path";
import { fileURLToPath, URL } from "node:url";
import { defineConfig, loadEnv } from "vite";
import istanbul from "vite-plugin-istanbul";

import EnvironmentPlugin from "vite-plugin-environment";
import Sitemap from "vite-plugin-sitemap";
// Hack to get the routes from the app-router.js file
// Cannot use @ aliases as the alias is not available in the vite config file
import routes from "./src/router/seoRoutes.json";
export default ({ mode }) => {
  let process = { env: {}, cwd: () => "" };
  // import.meta.env is not available in config files yet so we need to use loadEnv to load the env variables
  //  https://stackoverflow.com/questions/66389043/how-can-i-use-vite-env-variables-in-vite-config-js
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };
  return defineConfig({
    server: {
      host: "localhost",
      port: 8080,
    },
    plugins: [
      vue2(),
      EnvironmentPlugin({
        BUILD: "web",
      }),
      //https://www.npmjs.com/package/vite-plugin-sitemap
      Sitemap({
        hostname: process.env.VITE_HOSTNAME,
        dynamicRoutes: routes
          //to avoid is creating the duplicate path on sitemap as the root path is added by default
          .filter((route) => route.path !== "/")
          .map((route) => route.path),
        robots: [{ userAgent: "*", disallow: "/" }],
      }),
      legacy({
        targets: ["ie >= 11"],
        additionalLegacyPolyfills: ["regenerator-runtime/runtime"],
      }),
      istanbul({
        include: "src/*",
        exclude: ["node_modules", "test/"],
        extension: [".js", ".ts", ".vue"],
      }),
    ],
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
        // eslint-disable-next-line no-undef
        "~bootstrap": path.resolve(__dirname, "node_modules/bootstrap"),
        // eslint-disable-next-line no-undef
        "~bootstrap-vue": path.resolve(__dirname, "node_modules/bootstrap-vue"),
      },
    },
  });
};
