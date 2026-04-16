const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

/**
 * Metro is run from inside the Expo monorepo, but this app intentionally lives
 * outside the workspace. Lock resolution to this folder's node_modules so
 * Metro doesn't accidentally pick up the parent monorepo's React Native or
 * Expo packages, which would break the bundler.
 */
const projectRoot = __dirname;
const config = getDefaultConfig(projectRoot);

config.resolver.disableHierarchicalLookup = true;
config.resolver.nodeModulesPaths = [path.resolve(projectRoot, 'node_modules')];

module.exports = config;
