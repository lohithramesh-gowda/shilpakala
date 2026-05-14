const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const projectRoot = __dirname;
const monorepoRoot = path.resolve(projectRoot, '../..');
const mobileModules = path.resolve(projectRoot, 'node_modules');
const rootModules   = path.resolve(monorepoRoot, 'node_modules');

const config = getDefaultConfig(projectRoot);

// 1. Watch entire monorepo so @shilpakala/shared resolves correctly
config.watchFolders = [monorepoRoot];

// 2. Module lookup order: mobile first, root fallback
config.resolver.nodeModulesPaths = [mobileModules, rootModules];

// 3. BLOCK root copies of React & friends from Metro entirely.
//    This forces every `require('react')` — including from hoisted packages
//    like @tanstack/react-query — to use mobile/node_modules/react only.
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
config.resolver.blockList = [
  new RegExp(`^${esc(rootModules)}/react/.*`),
  new RegExp(`^${esc(rootModules)}/react-dom/.*`),
  new RegExp(`^${esc(rootModules)}/react-native/.*`),
  new RegExp(`^${esc(rootModules)}/react-native-safe-area-context/.*`),
  new RegExp(`^${esc(rootModules)}/react-native-screens/.*`),
  new RegExp(`^${esc(rootModules)}/react-native-reanimated/.*`),
  new RegExp(`^${esc(rootModules)}/react-native-gesture-handler/.*`),
  new RegExp(`^${esc(rootModules)}/@tanstack/.*`),
  new RegExp(`^${esc(rootModules)}/@react-navigation/.*`),
];

// 4. Also pin via extraNodeModules as a second layer of defence
config.resolver.extraNodeModules = {
  'react':                          path.resolve(mobileModules, 'react'),
  'react-native':                   path.resolve(mobileModules, 'react-native'),
  'react-native-safe-area-context': path.resolve(mobileModules, 'react-native-safe-area-context'),
  'react-native-screens':           path.resolve(mobileModules, 'react-native-screens'),
  'react-native-reanimated':        path.resolve(mobileModules, 'react-native-reanimated'),
  'react-native-gesture-handler':   path.resolve(mobileModules, 'react-native-gesture-handler'),
  '@tanstack/react-query':          path.resolve(mobileModules, '@tanstack/react-query'),
  '@react-navigation/native':       path.resolve(mobileModules, '@react-navigation/native'),
  '@react-navigation/bottom-tabs':  path.resolve(mobileModules, '@react-navigation/bottom-tabs'),
  '@react-navigation/native-stack': path.resolve(mobileModules, '@react-navigation/native-stack'),
};

module.exports = config;
