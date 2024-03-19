const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  publicPath: process.env.NODE_ENV === 'production' ? '/' : '/',

  transpileDependencies: true,
  devServer: {
    proxy: {
      // Proxy API requests to Functions emulator
      '/api': {
        target: 'http://127.0.0.1:5001',
        pathRewrite: { '^/api/upload': '/dprintprice/us-central1/upload' },
        ws: true,
        changeOrigin: true,
      },
      // Proxy asset requests or specific paths to the Hosting emulator
      // This is an example; adjust paths as needed for your app
      '/assets': {
        target: 'http://localhost:5002',
        changeOrigin: true,
      }
    },
  },

  chainWebpack: config => {
    // Add loader for GLB files
    config.module
      .rule('glb')
      .test(/\.glb$/)
      .use('file-loader')
        .loader('file-loader')
        .options({
          name: 'assets/[name].[hash:8].[ext]'
        });

    // Add loader for HDR files
    config.module
      .rule('hdr')
      .test(/\.hdr$/)
      .use('file-loader')
        .loader('file-loader')
        .options({
          name: 'assets/[name].[hash:8].[ext]'
        });
  }
});