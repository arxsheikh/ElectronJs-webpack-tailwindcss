const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const HtmlMinimizerPlugin = require('html-minimizer-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  target: 'electron-main',
  entry: {
    main: './main.js',
    render: './src/js/index.js',
  },
  output: {
    filename: '[name].bundle.js', // Use [name] placeholder to generate unique filenames
    path: path.resolve(__dirname, 'dist')
  },
  mode: 'development',
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_console: true
          }
        }
      }),
      new HtmlMinimizerPlugin(), // Minimize HTML files
    ]
  },
  plugins: [
    // new WebpackObfuscator({
    //   identifierNamesGenerator: "mangled",
    //   splitStrings: true,
    //   controlFlowFlattening: true,
    //   deadCodeInjection: true,
    //   debugProtection: true,
    //   stringArrayEncoding: ['rc4'],
    //   selfDefending: true
    //   // Other necessary options
    // }),
    new CopyPlugin({
      patterns: [
        { from: './src/index.html', to: 'index.html' }, // Adjust the source path accordingly
        // You can add more patterns for additional files or directories
      ],
    }),
  ]
  // Other necessary configurations
};
