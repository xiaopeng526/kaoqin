"use strict";
const merge = require("webpack-merge");
const prodEnv = require("./prod.env");

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  ENV_CONFIG: '"dev"',
  ADMIN_URL: '"http://47.94.245.198:8014"',
  // BIZ_URL: '"http://192.168.1.206:8024"' // 测试库
   BIZ_URL: '"http://192.168.1.3:8024"'
});
