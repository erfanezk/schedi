import path from 'path';
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin';

const config = {
  entry: './src/index.ts', // Your package's main entry file
  output: {
    path: path.resolve(process.cwd(), 'dist'),
    filename: 'index.js', // Output filename
    libraryTarget: 'module', // Use module for ESM
    globalObject: 'this', // Ensure it works in different environments
  },
  experiments: {
    outputModule: true, // Enables ESM output
  },
  mode: 'development', // Use "development" during development
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
    // Autoload aliases from tsconfig.json
    plugins: [new TsconfigPathsPlugin()],
    modules: [path.resolve(process.cwd(), 'node_modules'), 'node_modules'],
  },
  // externals: {
  //   'core-js': 'core-js',
  //   'dexie': 'dexie',
  //   'uuid': 'uuid',
  // },
  devServer: {
    static: {
      directory: path.join(process.cwd(), 'dist'), // Serve from the 'dist' folder
      publicPath: '/', // Make sure the static files are available from the root
    },
    compress: true,
    port: 9000,
    open: true,
  },
};

export default config;
