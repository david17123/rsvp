const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const DotenvWebpack = require('dotenv-webpack');

const webpackConfig = (env = {}) => {
  const isProduction = !!env.production

  const config = {
    mode: isProduction ? 'production' : 'development',
    entry: './src/index.tsx',
    output: {
      path: path.resolve(__dirname, 'dist'),
      publicPath: '/',
      filename: '[name].[hash].js',
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          exclude: /node_modules/,
          use: ['ts-loader'],
        },
      ],
    },
    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
    },
    plugins: [
      new CleanWebpackPlugin(),
      new HtmlWebpackPlugin({
        title: 'Login',
        meta: {
          viewport: 'minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no',
        },
      }),
      new DotenvWebpack(),
    ],
  }

  if (!isProduction) {
    config.devtool = 'inline-source-map'
    config.devServer = {
      contentBase: path.join(__dirname, 'dist'),
      host: '0.0.0.0',
      historyApiFallback: {
        index: '/',
      },
    }
  }

  return config
}

module.exports = webpackConfig
