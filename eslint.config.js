import js from "@eslint/js";
import reactPlugin from "eslint-plugin-react";
import globals from "globals";

export default [
  js.configs.recommended,
  {
    ignores: [
      "**/node_modules/",
      "**/dist/",
      "**/coverage/",
      "**/.venv/",
      "**/build/",
    ],
  },
  // Backend and Simulator - Node.js environment
  {
    files: ["backend/**/*.js", "simulator/**/*.js"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: {
        ...globals.node,
      },
    },
    rules: {
      "no-unused-vars": "warn",
      "no-console": "off",
      "prefer-const": "warn",
    },
  },
  // Backend tests - Jest environment
  {
    files: ["backend/tests/**/*.js"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: {
        ...globals.node,
        ...globals.jest,
      },
    },
    rules: {
      "no-unused-vars": "warn",
    },
  },
  // Frontend - React + browser environment
  {
    files: ["frontend/**/*.{js,jsx}"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
      },
    },
    plugins: {
      react: reactPlugin,
    },
    rules: {
      ...reactPlugin.configs.recommended.rules,
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
      "no-unused-vars": "warn",
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  },
];
