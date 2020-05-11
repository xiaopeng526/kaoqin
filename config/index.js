'use strict'
let  version= '1.2.6'
const path = require('path')
const devEnv = require('./dev.env')
// 获取接口地址
const admin_url = devEnv.ADMIN_URL.replace(/"/g,'')
const biz_url = devEnv.BIZ_URL.replace(/"/g,'')
module.exports = {
  dev: {
    // Paths
    assetsSubDirectory: 'static/'+version,
    assetsPublicPath: '/',
    // 配置代理
    proxyTable: {
      '/auth': {
        target: admin_url,
        secure: true,
        changeOrigin: true,
        pathRewrite: {
          '^/auth': 'auth'
        }
      },
      '/api': {
        target: admin_url,
        secure: true,
        changeOrigin: true,
        pathRewrite: {
          '^/api': 'api'
        }
      },
      '/attd': {
        target: biz_url,
        secure: true,
        changeOrigin: true,
        pathRewrite: {
          '^/attd': 'attd'
        }
      },
      '/mywork': {
        target: biz_url,
        secure: true,
        changeOrigin: true,
        pathRewrite: {
          '^/mywork': '/mywork'
        }
      },
      '/customer': {
        target: biz_url,
        secure: true,
        changeOrigin: true,
        pathRewrite: {
          '^/customer': '/customer'
        }
      },
      '/contract': {
        target: biz_url,
        secure: true,
        changeOrigin: true,
        pathRewrite: {
          '^/contract': '/contract'
        },
      },
      '/project': {
        target: biz_url,
        secure: true,
        changeOrigin: true,
        pathRewrite: {
          '^/project': '/project'
        }
      },
      '/outgoing': {
        target: biz_url,
        secure: true,
        changeOrigin: true,
        pathRewrite: {
          '^/outgoing': '/outgoing'
        }
      },
      '/leave': {
        target: biz_url,
        secure: true,
        changeOrigin: true,
        pathRewrite: {
          '^/leave': '/leave'
        }
      },
      '/overtime': {
        target: biz_url,
        secure: true,
        changeOrigin: true,
        pathRewrite: {
          '^/overtime': '/overtime'
        }
      },
      '/brief': {
        target: biz_url,
        secure: true,
        changeOrigin: true,
        pathRewrite: {
          '^/brief': '/brief'
        }
      },
      '/holiday': {
        target: biz_url,
        secure: true,
        changeOrigin: true,
        pathRewrite: {
          '^/holiday': '/holiday'
        }
      },
      '/worklog': {
        target: biz_url,
        secure: true,
        changeOrigin: true,
        pathRewrite: {
          '^/worklog': '/worklog'
        }
      }
    },

    // Various Dev Server settings
    host: 'localhost', // can be overwritten by process.env.HOST
    port: 8011, // can be overwritten by process.env.PORT, if port is in use, a free one will be determined
    autoOpenBrowser: false,
    errorOverlay: true,
    notifyOnErrors: false,
    poll: false, // https://webpack.js.org/configuration/dev-server/#devserver-watchoptions-

    // Use Eslint Loader?
    // If true, your code will be linted during bundling and
    // linting errors and warnings will be shown in the console.
    useEslint: false,
    // If true, eslint errors and warnings will also be shown in the error overlay
    // in the browser.
    showEslintErrorsInOverlay: false,

    /**
     * Source Maps
     */

    // https://webpack.js.org/configuration/devtool/#development
    devtool: 'cheap-source-map',

    // CSS Sourcemaps off by default because relative paths are "buggy"
    // with this option, according to the CSS-Loader README
    // (https://github.com/webpack/css-loader#sourcemaps)
    // In our experience, they generally work as expected,
    // just be aware of this issue when enabling this option.
    cssSourceMap: false
  },

  build: {
    testEnv:require('./test.env'),
    prodEnv:require('./prod.env'),
    devEnv:require('./dev.env'),
    // Template for index.html
    index: path.resolve(__dirname, '../dist/index.html'),

    // Paths
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'static',

    /**
     * You can set by youself according to actual condition
     * You will need to set this if you plan to deploy your site under a sub path,
     * for example GitHub pages. If you plan to deploy your site to https://foo.github.io/bar/,
     * then assetsPublicPath should be set to "/bar/".
     * In most cases please use '/' !!!
     */
    assetsPublicPath: '/',

    /**
     * Source Maps
     */

    productionSourceMap: false,
    // https://webpack.js.org/configuration/devtool/#production
    devtool: 'source-map',

    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],

    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report || false,

    // `npm run build:prod --generate_report`
    generateAnalyzerReport: process.env.npm_config_generate_report || false
  }
}
