import path from 'path';
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin';

const config = {
  entry: './src/index.ts', // Your package's main entry file
  output: {
    path: path.resolve(process.cwd(), 'dist'),
    filename: 'index.js', // Output filename
    libraryTarget: 'module', // Use module for ESM
    globalObject: 'this', // Ensure it works in different environments
    clean: true, // Clean dist folder before building
    module: true, // Enable ESM
  },
  experiments: {
    outputModule: true, // Enables ESM output
  },
  mode: 'production', // Use "development" during development
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: false,
              compilerOptions: {
                declaration: true,
                declarationDir: './dist',
              },
            },
          },
        ],
        exclude: [/node_modules/, /\.d\.ts$/], // Exclude .d.ts files from processing
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
    // Autoload aliases from tsconfig.json
    plugins: [new TsconfigPathsPlugin()],
    modules: [path.resolve(process.cwd(), 'node_modules'), 'node_modules'],
  },
  externals: {
    uuid: 'uuid',
  },
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
