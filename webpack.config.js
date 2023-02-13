// @ts-check
import path from "node:path";
import webpack from 'webpack';
import semver from 'semver';
import nodeExternals from 'webpack-node-externals';
import { ESBuildMinifyPlugin } from 'esbuild-loader';
import CopyPlugin from "copy-webpack-plugin";
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
/* "ExperimentalWarning: Importing JSON modules is an experimental feature"
 * require did this and so should import */
import { default as tsconfig } from './tsconfig.json' assert { type: 'json' };
import { default as vortex_devel } from './package.json' assert { type: 'json' };
import { default as externals } from './api/webpack/externals.json' assert { type: 'json' };
const __dirname = new URL('.', import.meta.url).pathname;
/** @type {['development'|'production', 'vortex-devel'|'vortex', 'vortex-devel'|'Vortex']} */
const [ env_mode, name, productName ] = (
  process.env['NODE_ENV'] === 'development' ?
  [ 'development', 'vortex-devel', 'vortex-devel' ] :
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
} else if (vortex_devel['cmake-js'].runtimeVersion != electron_version.version){
  console.warn('The cmake-js runtime version is outdated!');
}
/** rewrites paths from the dist/ of any extension to its
 * corresponding directory in bundledPlugins/
 * @type {CopyPlugin.To}
 */
const dist_to_plugins = async ({ context, absoluteFilename }) => new Promise((resolve) => {
  // @ts-expect-error absoluteFilename cannot be undefined.
  const outfile = absoluteFilename.replace(context,"bundledPlugins").split(path.sep);
  outfile.splice(2,1); // remove /dist/
  return resolve(path.join(...outfile));
});
/** @type {webpack.Configuration} */
const base = {
  context: __dirname,
  output: {
    clean: {
      keep: /generatedSchemas\/|package.json|pnpm-lock.yaml/
    },
    filename: '[name].js',
    library: {
      type: 'module'
    },
    path: path.resolve(__dirname,'app')
  },
  devtool: false,
  experiments:{
    outputModule: true
  },
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
        target: tsconfig.compilerOptions.target,
        css: true,
        keepNames: true
      })
    ] : undefined
  },
  plugins: [
    new CopyPlugin({
      patterns: [ // copy-webpack-plugin replaces the install assets procedure
        { from: "LICENSE.md" },
        {
          from: "package.json",
          to: "package.json",
          transform: {
            transformer: (buff) => {
              /** @type {vortex_devel} */
              const pack = JSON.parse(buff.toString());
              const {
                version,
                author,
                repository,
                license,
                dependencies,
                optionalDependencies,
                resolutions
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
                optionalDependencies,
                resolutions
              };
              app_pack.dependencies['vortex-run'] = "file:../src/util/vortex-run"; // why not?
              return `${JSON.stringify(app_pack, null, "  ")}\n`;
            },
            cache: true
          }
        },
        {
          from: "package.json",
          to: "../api/webpack/externals.json",
          transform: {
            transformer: (buff) => {
              /** @type {vortex_devel} */
              const pack = JSON.parse(buff.toString());
              const {
                dependencies,
                optionalDependencies
              } = pack;
              const extern = {
                'electron': 'electron', // duh
                'util': 'util', // TODO: util provided by Vortex?
                'vortex-api': 'vortex-api' // provided by Vortex
              };
              Object.keys(dependencies).forEach((ext)=>extern[ext]=ext);
              Object.keys(optionalDependencies).forEach((ext)=>extern[ext]=ext);
              const extern_str = JSON.stringify(extern, null, "  ");
              if (extern_str != JSON.stringify(externals, null, "  ")){
                console.warn("vortex-api: Available Externals Updated!");
              }
              return `${extern_str}\n`;
            },
            cache: true
          }
        },
        {
          from: path.posix.join("src",(env_mode === 'development' ? "index.dev.html" : "index.html")),
          to: "index.html"
        },
        {
          from: path.posix.join("src","stylesheets"),
          to: path.join("assets","css")
        },
        {
          from: path.posix.join("node_modules","bootstrap-sass","assets","stylesheets","_bootstrap.scss"),
          to: path.posix.join("assets","css","bootstrap.scss")
        },
        {
          from: path.posix.join("src","splash.html")
        },
        {
          from: path.posix.join("locales","**","*")
        },
        {
          from: path.posix.join("assets","**","*"),
          globOptions:{
            ignore: [path.posix.join("**","vcruntime","*")]
          }
        },
        {
          context: path.posix.join("extensions","games"),
          from: path.posix.join("*","**","*"),
          to: "bundledPlugins",
          globOptions: {
            gitignore: true, // .gitignore file(s) exclude node_modules already
            ignore: [ // exclude a unique submodule
              path.posix.join("**","game-pillarsofeternity2","**","*"),
              path.posix.join("**","*.tsx"), // exclude the components
              path.posix.join("**","*.ts") // exclude the sources
            ]
          }
        },
        {
          context: path.posix.join("extensions","games"),
          from: path.posix.join("game-pillarsofeternity2","dist","**","*"),
          to: dist_to_plugins
        },
        {
          context: "extensions",
          from: path.posix.join("*","dist","**","*"),
          to: dist_to_plugins
        }
      ]
    }),
    new webpack.SourceMapDevToolPlugin(
      { // the devtool: 'source-map' options with some defaults omitted
        columns: true,
        filename: '[name].js.map',
        exclude: ['bundledPlugins'], // bundledPlugins get vortex-api sourcemaps
        module: true,
        noSources: false,
        sourceRoot: env_mode !== 'development' ? undefined : '../src/'
      }
    ),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env['NODE_ENV'])
    }),
    new ForkTsCheckerWebpackPlugin()
  ],
  resolve: { extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'] },
  stats: {
    errorDetails: true
  }
}
/** @type {webpack.Configuration} */
const main = { ...base,
  name: "main",
  entry: {
    main: './src/main.ts'
  },
  target: `electron${electron_version.major}.${electron_version.minor}-main`
};
/** @type {webpack.Configuration} */
const renderer = { ...base,
  name: "renderer",
  dependencies: ["main"], // used to mimic the chained "webpack && webpack" scripts used previously, though this may not be necessary
  output: {
    ...base.output,
    clean: { // renderer will cleanup main.js and main.js.map without this...
      keep: /generatedSchemas\/|package.json|pnpm-lock.yaml|main*/
    }
  },
  entry: {
    renderer: './src/renderer.tsx',
    splash: './src/splash.ts'
  },
  target: `electron${electron_version.major}.${electron_version.minor}-renderer`
};

export default [main, renderer];
