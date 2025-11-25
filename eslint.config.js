// eslint.config.js
// https://docs.expo.dev/guides/using-eslint/

const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');
const eslintPluginPrettierRecommended = require('eslint-plugin-prettier/recommended');

module.exports = defineConfig([
  // Config básica de Expo (React Native + TS)
  expoConfig,

  // Integración de Prettier como plugin de ESLint
  eslintPluginPrettierRecommended,

  // Ignorar carpeta de builds (ajuste opcional)
  {
    ignores: ['dist/*'],
  },
]);
