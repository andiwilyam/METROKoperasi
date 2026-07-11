const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');
const fs = require('fs');

const config = getDefaultConfig(__dirname);

// Monorepo: include packages/ workspace
config.watchFolders = [
  path.resolve(__dirname, '../../packages'),
];

// Resolve .js imports to .ts files (shared package uses .js extensions for ESM compat)
config.resolver.resolveRequest = (context, moduleName, platform, moduleType, rollout) => {
  // Try .js -> .ts rewrite for relative imports
  if (moduleName.endsWith('.js') && (moduleName.startsWith('./') || moduleName.startsWith('../'))) {
    const tsName = moduleName.replace(/\.js$/, '.ts');
    const basePath = path.dirname(context.originModulePath);
    const candidate = path.resolve(basePath, tsName);
    if (fs.existsSync(candidate)) {
      return {
        filePath: candidate,
        type: 'sourceFile',
      };
    }
  }
  // Delegate to Metro's default resolution
  return context.resolveRequest(context, moduleName, platform, moduleType, rollout);
};

module.exports = config;
