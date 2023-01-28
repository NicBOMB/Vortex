// @ts-check
const webpack = require('webpack');
const semver = require('semver');
const path = require("path");
const nodeExternals = require('webpack-node-externals');
const { ESBuildMinifyPlugin } = require('esbuild-loader');
const CopyPlugin = require("copy-webpack-plugin");
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const tsconfig = require('./release.tsconfig.json');
const vortex_devel = require('./package.json');
/** @type {['development'|'production', 'vortex_devel'|'vortex', 'vortex_devel'|'Vortex']} */
const [ env_mode, name, productName ] = (
  process.env['NODE_ENV'] === 'development' ?
  [ 'development', 'vortex_devel', 'vortex_devel' ] :
  [ 'production', 'vortex', 'Vortex' ]
);
const electron_version = semver.parse(
  semver.coerce(
    vortex_devel.devDependencies.electron
  )
);
if (!electron_version){ // if semver cannot coerce the version, package.json is malformed
  throw `Invalid Electron Semver "vortex_devel.devDependencies.electron": "${
    vortex_devel.devDependencies.electron
  }"`;
}
/** @type {webpack.Configuration} */
const base = {
  context: __dirname,
  devtool: 'source-map',
  // we can't pack any node_modules, otherwise extensions can't load those modules
  externals: nodeExternals(),
  externalsPresets: { node: true },
  mode: env_mode,
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'esbuild-loader',
        exclude: /node_modules/,
        options: {
          loader: 'tsx',
          target: tsconfig.compilerOptions.target
        }
      }
    ]
  },
  node: { __filename: false, __dirname: false },
  optimization: {
    minimizer: env_mode !== 'development' ? [
      new ESBuildMinifyPlugin({
        target: tsconfig.compilerOptions.target, // "esnext" is the default and used in tsconfig already
        css: true, // smol
        keepNames: true // no name mangle
      })
    ] : undefined
  },
  resolve: { extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'] }
}
/** @type {webpack.Configuration} */
const main = { ...base,
  name: "main",
  entry: './src/main.ts',
  target: `electron${electron_version.major}.${electron_version.minor}-main`,
  output: {
    filename: 'main.js',
    libraryTarget: tsconfig.compilerOptions.module,
    path: path.resolve(__dirname, 'app')
  },
  plugins: [
    new CopyPlugin({
      patterns: [ // copy-webpack-plugin replaces the install assets procedure
        { from: "LICENSE.md" },
        { from: "package.json", transform: (buff) => {
          /** @type {vortex_devel} */
          const pack = JSON.parse(buff.toString());
          const {
            version,
            author,
            repository,
            license,
            dependencies,
            optionalDependencies
          } = pack;
          const app_pack = {
            name,
            version,
            productName,
            description: "The elegant, powerful, and open-source mod manager from Nexus Mods.",
            author,
            repository,
            license,
            main: "main.js",
            dependencies,
            optionalDependencies
          };
          app_pack.dependencies['vortex-run'] = "file:../src/util/vortex-run"; // why not?
          return JSON.stringify(app_pack, null, "  ");
        }},
        {
          from: path.posix.join("src",(env_mode === 'development' ? "index.dev.html" : "index.html")),
          to: "index.html"
        },
        {
          from: path.posix.join("src","stylesheets"),
          to: path.posix.join("assets","css")
        },
        {
          from: path.posix.join("node_modules","bootstrap-sass","assets","stylesheets","_bootstrap.scss"),
          to: path.posix.join("assets","css","bootstrap.scss")
        },
        {
          from: path.posix.join("src","splash.html"),
        },
        {
          from: "locales",
          to: "locales"
        },
        {
          from: path.posix.join("assets","**","*"),
          globOptions:{
            ignore: [path.posix.join("**","vcruntime","*")]
          }
        },
        {
          context: path.posix.join("extensions","games"),
          from: path.posix.join("*","**","*"), // globs all files in at least one sub directory
          to: "bundledPlugins",
          globOptions: {
            gitignore: true // .gitignore file(s) exclude node_modules already
          }
        },
        {
          context: "extensions",
          from: path.posix.join("*","dist", "**", "*"),
          to: async ({ context, absoluteFilename }) => new Promise((resolve) => {
            // @ts-expect-error absoluteFilename cannot be undefined.
            const outfile = absoluteFilename.replace(context,"bundledPlugins").split(path.sep);
            outfile.splice(2,1); // remove /dist/
            return resolve(path.posix.join(...outfile));
          })
        }
      ]
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env['NODE_ENV'])
    }),
    new ForkTsCheckerWebpackPlugin({typescript:{configFile: 'release.tsconfig.json'}})
  ]
};
/** @type {webpack.Configuration} */
const renderer = { ...base,
  name: "renderer",
  dependencies: ["main"], // used to mimic the chained "webpack && webpack" scripts used previously, though this may not be necessary
  entry: {
    renderer: './src/renderer.tsx',
    splash: './src/splash.ts'
  },
  target: `electron${electron_version.major}.${electron_version.minor}-renderer`,
  output: {
    filename: '[name].js',
    libraryTarget: tsconfig.compilerOptions.module,
    path: path.resolve(__dirname, 'app')
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env['NODE_ENV'])
    }),
    new ForkTsCheckerWebpackPlugin({typescript:{configFile: 'release.tsconfig.json'}})
  ]
};
module.exports = [main, renderer];
