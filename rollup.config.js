/* plugin imports */
import copy from 'rollup-plugin-copy-glob';
import includePaths from 'rollup-plugin-includepaths';
import { nodeResolve } from '@rollup/plugin-node-resolve';

/* misc. imports */
import glob from 'glob';

/* global constants */
const IS_DEV_MODE = !process.env.production;

/* config.plugins */
const copyConfig = [
  { files: 'src/**/*.liquid', dest: 'dist' },
  { files: 'src/**/**/*.liquid', dest: 'dist' },
  { files: 'src/config/*.json', dest: 'dist/config' },
  { files: 'src/locales/*.json', dest: 'dist/locales' },
];

const includePathsConfig = {
  include: {},
  paths: ['src/scripts'],
  external: [],
  extensions: ['.js', '.json', '.html']
}

/* config.input */
const inputScriptMap = {};

for (const filename of glob.sync('src/scripts/templates/*.js')) {
  const bundle = filename.replace('src/scripts/', '').replace('.js', '').replace('/', '.');
  inputScriptMap[bundle] = filename;
}

const config = {
  input: inputScriptMap,

  output: [
    // ES module version, for modern browsers
    {
      dir: 'dist/assets/',
      format: 'es',
      sourcemap: true
    },
  ],

  plugins: [
    includePaths(includePathsConfig),
    copy(copyConfig),
    nodeResolve({ browser: true }),
  ]
}

// Browser support for IE.
const iifeConfigs = [];

if (!IS_DEV_MODE) {
  for (const key in inputScriptMap) {
    iifeConfigs.push({
      input: { [key + '.iife']: inputScriptMap[key] },
      output: {
        dir: 'dist/assets',
        format: 'iife'
      },
      plugins: [
        includePaths(includePathsConfig),
        nodeResolve({ browser: true }),
      ]
    });
  }
}

export default [
  config,
  ...iifeConfigs,
]
