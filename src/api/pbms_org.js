import request from '@/utils/requestPbms'

// 组织树 -第一层--行政区划
export function orgTreeRegionOutQuery(options) {
  return request({
    url: '/pbms/tree/regionOutTree',
    method: 'get',
    params: options
  })
}

// 组织树 -里层--行政区划
export function orgTreeRegionInsideQuery(options) {
  return request({
    url: '/pbms/tree/regionOutTrees',
    method: 'get',
    params: options
  })
}

// 组织树 - 第一层 - 行政组织
export function orgTreeOutQuery(options) {
  return request({
    url: '/pbms/tree/organRegionTree',
    method: 'get',
    params: options
  })
}

// 组织树 - 里层- 行政组织
export function orgTreeInsideQuery(options) {
  return request({
    url: '/pbms/tree/organRegionTrees',
    method: 'get',
    params: options
  })
}

// 组织类型--查询
export function orgTypeQuery(options) {
  return request({
    url: '/pbms/organ/type/query',
    method: 'get',
    params: options
  })
}

// 组织类型--新增
export function orgTypeInsert(params) {
  return request({
    url: '/pbms/organ/type/insert',
    method: 'post',
    data: params
  })
}

// 组织类型--更新
export function orgTypeUpdate(params) {
  return request({
    url: '/pbms/organ/type/update',
    method: 'post',
    data: params
  })
}

// 组织类型--删除
export function orgTypeDelete(params) {
  return request({
    url: '/pbms/organ/type/delete',
    method: 'post',
    data: params
  })
}

// 组织岗位--查询
export function orgPostsQuery(options) {
  return request({
    url: '/pbms/organ/post/query',
    method: 'get',
    params: options
  })
}

// 组织岗位--新增
export function orgPostInsert(params) {
  return request({
    url: '/pbms/organ/post/insert',
    method: 'post',
    data: params
  })
}

// 组织岗位--更新
export function orgPostUpdate(params) {
  return request({
    url: '/pbms/organ/post/update',
    method: 'post',
    data: params
  })
}

// 组织岗位--停用
export function orgPostStop(params) {
  return request({
    url: '/pbms/organ/post/stop',
    method: 'post',
    data: params
  })
}

// 组织视图--查询
export function orgViewQuery(options) {
  return request({
    url: '/pbms/organ/view/query',
    method: 'get',
    params: options
  })
}

// 组织视图--新增
export function orgViewInsert(params) {
  return request({
    url: '/pbms/organ/view/insert',
    method: 'post',
    data: params
  })
}

// 组织视图--更新
export function orgViewUpdate(params) {
  return request({
    url: '/pbms/organ/view/update',
    method: 'post',
    data: params
  })
}

// 组织视图--删除
export function orgViewDelete(params) {
  return request({
    url: '/pbms/organ/view/delete',
    method: 'post',
    data: params
  })
}

// 组织区划--查询
export function orgRegionQuery(options) {
  return request({
    url: '/pbms/organ/region/query',
    method: 'get',
    params: options
  })
}

// 组织区划--新增
export function orgRegionInsert(params) {
  return request({
    url: '/pbms/organ/region/insert',
    method: 'post',
    data: params
  })
}

// 组织区划--更新
export function orgRegionUpdate(params) {
  return request({
    url: '/pbms/organ/region/update',
    method: 'post',
    data: params
  })
}

// 组织区划--删除
export function orgRegionDelete(params) {
  return request({
    url: '/pbms/organ/region/delete',
    method: 'post',
    data: params
  })
}

// 机构映射--查询
export function orgCorrespondenceQuery(options) {
  return request({
    url: '/pbms/organ/correspondence/query',
    method: 'get',
    params: options
  })
}

// 机构映射--保存
export function orgCorrespondenceSave(params) {
  return request({
    url: '/pbms/organ/correspondence/save',
    method: 'post',
    data: params
  })
}

// 机构映射--删除
export function orgCorrespondenceDelete(params) {
  return request({
    url: '/pbms/organ/correspondence/delete',
    method: 'post',
    data: params
  })
}

// 组织机构--查询
export function organQuery(options) {
  return request({
    url: '/pbms/organ/query',
    method: 'get',
    params: options
  })
}

// 组织机构--新增
export function organInsert(params) {
  return request({
    url: '/pbms/organ/insert',
    method: 'post',
    data: params
  })
}

// 组织机构--更新
export function organUpdate(params) {
  return request({
    url: '/pbms/organ/update',
    method: 'post',
    data: params
  })
}

// 组织机构--删除
export function organDelete(params) {
  return request({
    url: '/pbms/organ/delete',
    method: 'post',
    data: params
  })
}

// 组织机构--变更
export function organSettingChange(params) {
  return request({
    url: '/pbms/organ/alterSave',
    method: 'post',
    data: params
  })
}
