const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');
const fs = require('fs');

const projectRoot = __dirname;
const config = getDefaultConfig(projectRoot);

/**
 * Only lock Metro to the local node_modules when this project sits inside
 * a larger monorepo that also has React Native / Expo in its root
 * node_modules (i.e. running from the Expo monorepo during development).
 * Outside that case — CI, a normal clone on a user's laptop — leave
 * Metro's default hierarchical lookup on so nested packages like
 * @react-native/virtualized-lists resolve correctly.
 */
const parentNodeModules = path.resolve(projectRoot, '..', 'node_modules');
const runningInsideExpoMonorepo =
  fs.existsSync(path.join(parentNodeModules, 'react-native')) ||
  fs.existsSync(path.resolve(projectRoot, '..', 'pnpm-workspace.yaml'));

if (runningInsideExpoMonorepo) {
  config.resolver.disableHierarchicalLookup = true;
  config.resolver.nodeModulesPaths = [path.resolve(projectRoot, 'node_modules')];
}

module.exports = config;
