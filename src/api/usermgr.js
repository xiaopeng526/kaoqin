import request from '@/utils/requestPbms'
/**
 * 用户类型管理接口
 */
// 查询
export function queryUserType(params) {
  return request({
    url: '/pbms/user/type/query',
    method: 'get',
    params
  })
}
// 查询单条数据
export function queryUserTypeById(params) {
  return request({
    url: '/pbms/user/type/show',
    method: 'get',
    params
  })
}
// 删除单条
export function deleteUserTypeById(params) {
  return request({
    url: '/pbms/user/type/delete',
    method: 'get',
    params
  })
}
// 删除多条
// export function deleteUserType(params) {
//   return request({
//     url: '/pbms/user/type/delete',
//     method: 'get',
//     params
//   })
// }
// 新增
export function addUserType(params, data) {
  return request({
    url: '/pbms/user/type/insert',
    method: 'post',
    params,
    data
  })
}
// 修改
export function updateUserType(params, data) {
  return request({
    url: '/pbms/user/type/update',
    method: 'post',
    params,
    data
  })
}
// 查重
export function checkUserType(params) {
  return request({
    url: '/pbms/user/type/check',
    method: 'get',
    params
  })
}

/**
 * 安全日志审计接口
 */
// 查询
export function querySafeLog(params) {
  return request({
    url: '/pbms/user/log/query',
    method: 'get',
    params
  })
}
// 删除
// export function deleteSafeLogById(params) {
//   return request({
//     url: '/pbms/user/log/query',
//     method: 'delete',
//     params
//   })
// }
// 导出Excel
export function exportSafeLogExcel(params) {
  return request({
    url: '/pbms/user/log/exportExcel',
    method: 'get',
    params
  })
}
// // 新增
// export function addSafeLog(data) {
//   return request({
//     url: '/pbms/user/log/query',
//     method: 'post',
//     data
//   })
// }
// // 更新
// export function updateSafeLog(data) {
//   return request({
//     url: '/pbms/user/log/query',
//     method: 'put',
//     data
//   })
// }

/**
 * 用户信息管理接口
 */
// 查询
export function queryUserInfo(params) {
  return request({
    url: '/pbms/user/info/query',
    method: 'get',
    params
  })
}
// 删除多条
export function deleteUserInfo(params) {
  return request({
    url: '/pbms/user/info/del',
    method: 'get',
    params
  })
}
// 停用、启用
export function useUserInfo(params) {
  return request({
    url: '/pbms/user/info/delete',
    method: 'get',
    params
  })
}
// 异步加载用户岗位
export function getUserInfoPost(params) {
  return request({
    url: '/pbms/user/info/getUserPost',
    method: 'get',
    params
  })
}
// 重置用户密码
export function resetUserInfoPwd(params) {
  return request({
    url: '/pbms/user/info/resetPwd',
    method: 'get',
    params
  })
}
// 导入上传的excel数据
export function BatchSaveUserInfo(params) {
  return request({
    url: '/pbms/user/info/batchSaveUser',
    method: 'get',
    params
  })
}
// 下载导入模板
export function downloadUserInfoExcel(params) {
  return request({
    url: '/pbms/user/info/downloadExcel',
    method: 'get',
    params
  })
}
// 导出excel
export function exportUserInfoExcel(params) {
  return request({
    url: '/pbms/user/info/exportExcel',
    method: 'get',
    params
  })
}
// 上传excel
export function uploadUserInfoExcel(params) {
  return request({
    url: '/pbms/user/info/uploadExcel',
    method: 'get',
    params
  })
}

/**
 * 用户账号解锁接口
 */
// 查询
export function queryUserUnlock(params) {
  return request({
    url: '/pbms/user/unlock/query',
    method: 'get',
    params
  })
}
// 解锁
export function changeUserUnlockStatus(params) {
  return request({
    url: '/pbms/user/unlock/changeStatus',
    method: 'get',
    params
  })
}
// // 删除
// export function deleteUserUnlock(params) {
//   return request({
//     url: '/pbms/user/type/query',
//     method: 'delete',
//     params
//   })
// }
// // 新增
// export function addUserUnlock(data) {
//   return request({
//     url: '/pbms/user/type/query',
//     method: 'post',
//     data
//   })
// }
// // 更新
// export function updateUserUnlock(data) {
//   return request({
//     url: '/pbms/user/type/query',
//     method: 'put',
//     data
//   })
// }
