const { getDefaultConfig, mergeConfig } = require("@react-native/metro-config");

const defaultConfig = getDefaultConfig(__dirname);

/**
 * Metro config for Shilpa-Kala mobile.
 * Adds the shared workspace package to the watchFolders so Metro
 * can resolve @shilpakala/shared from the monorepo root.
 */
const config = {
  watchFolders: [
    require("path").resolve(__dirname, "../../packages/shared"),
    require("path").resolve(__dirname, "../.."),
  ],
  resolver: {
    extraNodeModules: new Proxy(
      {},
      { get: (_, name) => require("path").join(__dirname, "node_modules", String(name)) }
    ),
  },
};

module.exports = mergeConfig(defaultConfig, config);

