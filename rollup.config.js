/* plugin imports */
// Rollup plugin imports
import copy from 'rollup-plugin-copy-glob';
import includePaths from 'rollup-plugin-includepaths';

/* */
import glob from 'glob';

/* config.plugins */
const copyConfig = [
  { files: 'src/**/*.liquid', dest: 'dist' },
  { files: 'src/**/**/*.liquid', dest: 'dist' },
  { files: 'src/config/*.json', dest: 'dist/config' },
  { files: 'src/locales/*.json', dest: 'dist/locales' },
];

/* config.input */
const inputScripts = {};

for (const filename of glob.sync("src/scripts/templates/*.js")) {
  const bundle = filename.replace('src/scripts/', '').replace('.js', '').replace('/', '.');
  inputScripts[bundle] = filename;
}

export default {
  input: inputScripts,

  output: [
    // ES module version, for modern browsers
    {
      dir: "dist/assets/",
      format: "es",
      sourcemap: true
    },
  ],

  plugins: [
    includePaths('./src/scripts'),
    copy(copyConfig),
  ]
};
