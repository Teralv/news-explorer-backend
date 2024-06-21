module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
  },
  extends: [
    "eslint:recommended",
    "airbnb-base",
  ],
  parserOptions: {
    ecmaVersion: 12,
  },

  rules: {
    "import/newline-after-import": "error",
    "import/no-named-as-default": "error",
    "no-underscore-dangle": ["error", { allow: ["_id"] }],
    "no-unused-vars": ["error", { argsIgnorePattern: "next" }],
  },
};