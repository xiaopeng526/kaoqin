import request from '@/utils/requestBiz'

export function apiQuery(data) {
  return request({
    url: '/contract/findPageContract',
    method: 'get',
    params: data
  })
}

export function apiUpdate(data) {
  return request({
    url: '/contract/updateContract',
    method: 'put',
    data: data
  })
}

export function apiDel(data) {
  return request({
    url: `/contract/deleteContract/${data}`,
    method: 'delete'
  })
}

export function apiFindCusId(data) {
  return request({
    url: '/customer/findCusIdList',
    method: 'get'
  })
}