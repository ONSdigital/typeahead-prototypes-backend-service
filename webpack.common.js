import * as path from 'path';
import { NoEmitOnErrorsPlugin, NamedModulesPlugin } from 'webpack';
import ProgressPlugin from 'webpack/lib/ProgressPlugin';
import CircularDependencyPlugin from 'circular-dependency-plugin';

export const commonConfig = {
  target: 'node',

  node: {
    __dirname: false
  },

  context: `${__dirname}/src`,

  entry: {
    app: ['./index.ts']
  },

  output: {
    path: path.join(process.cwd(), 'build'),
    filename: '[name].js',
    chunkFilename: '[id].js'
  },
  
  resolve: {
    extensions: ['.ts', '.js', '.json'],
    modules: ['./node_modules'],
    symlinks: true
  },

  resolveLoader: {
    modules: ['./node_modules'],
  },
  
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /(node_modules)/,
        use: ['ts-loader']
      }
    ]
  },

  plugins: [
    new NoEmitOnErrorsPlugin(),

    new ProgressPlugin(),

    new CircularDependencyPlugin({
      exclude: /(\\|\/)node_modules(\\|\/)/,
      failOnError: false,
    }),

    new NamedModulesPlugin({})
  ],

  node: {
    fs: 'empty',
    global: true,
    crypto: 'empty',
    tls: 'empty',
    net: 'empty',
    process: true,
    module: false,
    clearImmediate: false,
    setImmediate: false,
  }
};
