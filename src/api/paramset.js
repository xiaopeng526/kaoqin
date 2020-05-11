import request from '@/utils/requestPbms'
/**
 * 数据字典管理接口
 */
// 数据字典--查询
export function queryDataDictionary(params) {
  return request({
    url: '/pbms/dict/query',
    method: 'get',
    params
  })
}
// 数据字典--删除
export function deleteDataDictionary(params) {
  return request({
    url: '/pbms/dict/delete',
    method: 'delete',
    params
  })
}
// 数据字典--新增
export function insertDataDictionary(data) {
  return request({
    url: '/pbms/dict/insert',
    method: 'post',
    data
  })
}
// 数据字典--更新
export function updateDataDictionary(data) {
  return request({
    url: '/pbms/dict/update',
    method: 'put',
    data
  })
}
// 数据字典树
export function getDictionaryTree(params) {
  return request({
    url: '/pbms/tree/dictTree',
    method: 'get',
    params
  })
}
// 数据字典树--里层
export function getDictionaryTrees(params) {
  return request({
    url: '/pbms/tree/dictTrees',
    method: 'get',
    params
  })
}
// 父级字典
export function getParentDictionary(params) {
  return request({
    url: '/pbms/tree/DictParentTree',
    method: 'get',
    params
  })
}

