import { defineConfig } from "eslint/config";
import js from "@eslint/js";
import globals from "globals";

export default defineConfig([
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: 2022,
      globals: {
        ...globals.node,
      },
    },
    ignores: ['/node_modules'],
    plugins: { js },
    extends: ["js/recommended"],
    rules: {
      "semi": ["error", "always"],
      "no-unused-vars": "warn",
      "no-undef": "warn",
    },
  },
]);
