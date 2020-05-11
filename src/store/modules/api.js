const adminURL = process.env.ADMIN_URL
const api = {
  state: {
    // 实时控制台
    socketApi: adminURL + '/websocket?token=kl',
    // 图片上传
    imagesUploadApi: adminURL + '/api/pictures',
    // 修改头像
    updateAvatarApi: adminURL + '/api/users/updateAvatar',
    // 上传文件到七牛云
    qiNiuUploadApi: adminURL + '/api/qiNiuContent',
    // Sql 监控
    sqlApi: adminURL + '/druid',
    // swagger
    swaggerApi: adminURL + '/swagger-ui.html',
    // 文件上传
    fileUploadApi: adminURL + '/api/localStorage',
    // baseUrl，
    baseApi: adminURL
  }
}

export default api
