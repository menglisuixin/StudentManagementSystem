import { defineConfig, ConfigEnv } from "vite";
import vue from "@vitejs/plugin-vue";
// @ts-ignore
import path from "path";

import { viteMockServe } from "vite-plugin-mock";
// https://vite.dev/config/
export default ({ command }: ConfigEnv) => {
  return {
    plugins: [
      vue(),
      viteMockServe({
        localEnabled: command === "serve",
      }),
    ],
    resolve: {
      alias: {
        "@": path.resolve("./src"),
      },
    },
  };
};
