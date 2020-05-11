import request from '@/utils/requestAdmin'

export function initData(url, params) {
  return request({
    url: url,
    method: 'get',
    params
  })
}
