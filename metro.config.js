const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = {
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
  resolver: {
    alias: {
      '@': './src',
      '@assets': './assets',
      '@components': './src/components',
      '@screens': './src/screens',
      '@navigation': './src/navigation',
      '@utils': './src/utils',
      '@services': './src/services',
      '@context': './src/context',
    },
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
