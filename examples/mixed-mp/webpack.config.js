const path = require( 'path' )
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const RegularLoaderPlugin = require('@megalo/regular-loader/lib/plugin')
const createMegaloTarget = require( '@megalo/target' )
const MiniCssExtractPlugin = require( 'mini-css-extract-plugin' )

module.exports = {

  mode: 'development',

  target: createMegaloTarget( {
    platform: 'wechat',
  } ),

  entry: {
    'app': path.resolve( __dirname, 'src/index.js' ),
    'package/pages/demo/index': path.resolve( __dirname, 'src/package/pages/demo/index.js' ),
    'pages/counter/index': path.resolve( __dirname, 'src/pages/counter/index.js' ),
    'pages/todomvc/index': path.resolve( __dirname, 'src/pages/todomvc/index.js' ),
  },

  output: {
    path: path.resolve( __dirname, 'dist/' ),
    filename: 'static/js/[name].js',
    chunkFilename: 'static/js/[id].js'
  },

  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendor',
          chunks: 'all'
        }
      }
    }
  },

  devServer: {
    // hot: true,
  },

  devtool: 'cheap-source-map',

  resolve: {
    extensions: ['.vue', '.rgl', '.js', '.json'],
    alias: {
      'vue': 'megalo',
      'regularjs': 'mpregular',
    },
  },

  module: {
    rules: [
      // ... other rules
      {
        test: /\.vue$/,
        use: [
          {
            loader: 'vue-loader',
            options: {}
          }
        ]
      },

      {
        test: /\.rgl$/,
        use: [
          {
            loader: '@megalo/regular-loader',
            options: {}
          }
        ]
      },

      {
        test: /\.js$/,
        use: 'babel-loader'
      },

      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader'
        ]
      },

      {
        test: /\.less$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'less-loader',
        ]
      }
    ]
  },

  plugins: [
    new VueLoaderPlugin(),
    new RegularLoaderPlugin(),
    new MiniCssExtractPlugin( {
      filename: 'static/css/[name].wxss',
    } ),
  ]
}
