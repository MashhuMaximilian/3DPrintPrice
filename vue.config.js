const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  publicPath: process.env.NODE_ENV === 'production' ? '/' : '/',

  transpileDependencies: true,

  devServer: {
    proxy: {
      '/api': {
        target: ' http://localhost:8085/ ',
        changeOrigin: true,
        pathRewrite: { '^/api': '' },
      },
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