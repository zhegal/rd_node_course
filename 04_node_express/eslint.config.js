import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";

export default defineConfig([
    {
        files: ["**/*.{js,mjs,cjs}"],
        languageOptions: {
            ecmaVersion: 2022,
            globals: {
                ...globals.node,
            },
        },
        ignores: ["/node_modules"],
        plugins: { js },
        extends: ["js/recommended"],
        rules: {
            indent: ["error", 4],
            "no-unused-vars": "warn",
            "no-undef": "warn",
            "object-curly-spacing": ["error", "always"],
            "semi": ["error", "always"],
            "no-trailing-spaces": ["error", { "skipBlankLines": false }],
            "comma-dangle": ["error", "always-multiline"],
        },
    },
]);
