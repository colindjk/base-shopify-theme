/* plugin imports */
import copy from 'rollup-plugin-copy-glob';
import includePaths from 'rollup-plugin-includepaths';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';
import typescript from '@rollup/plugin-typescript';

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
  extensions: ['.tsx', '.ts', '.jsx', '.js', '.json', '.html']
}

// Plugins used for all builds
const getBasePlugins = () => [
  includePaths(includePathsConfig),
  nodeResolve({ browser: true }),
  typescript(),
  babel({
    presets: [
      [
        '@babel/preset-react',
        {
          "pragma": "h",
          "pragmaFrag": "Fragment",
          "throwIfNamespace": false,
          "runtime": "classic"
        }
      ]
    ]
  }),
]

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
      sourcemap: 'inline' // FIXME: Why does setting this to "true" break things?
    },
  ],

  plugins: [
    copy(copyConfig),
    ...getBasePlugins(),
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
      plugins: getBasePlugins(),
    });
  }
}

export default [
  config,
  ...iifeConfigs,
]
