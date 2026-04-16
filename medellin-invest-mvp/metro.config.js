const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');
const fs = require('fs');

const projectRoot = __dirname;
const config = getDefaultConfig(projectRoot);

/**
 * Only lock Metro to the local node_modules when this project sits inside
 * a larger monorepo that also has React Native installed at the root
 * (i.e. running from inside the Expo monorepo during Expo development).
 * A bare `pnpm-workspace.yaml` alone is not enough: the spearisa/expo
 * fork carries one at the root but does not install RN there, and
 * locking the resolver in that case breaks packages that ship nested
 * transitive deps (e.g. react-native-reanimated's bundled semver@7).
 */
const parentNodeModules = path.resolve(projectRoot, '..', 'node_modules');
const runningInsideExpoMonorepo = fs.existsSync(
  path.join(parentNodeModules, 'react-native')
);

if (runningInsideExpoMonorepo) {
  config.resolver.disableHierarchicalLookup = true;
  config.resolver.nodeModulesPaths = [path.resolve(projectRoot, 'node_modules')];
}

module.exports = config;
