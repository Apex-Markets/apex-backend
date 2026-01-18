import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";

export default defineConfig({
  files: ["**/*.{js,mjs,cjs}"],
  languageOptions: {
    globals: globals.node,
    parserOptions: { ecmaVersion: 2020, sourceType: "module" },
  },
  plugins: { js },
  extends: ["js/recommended"],
});
