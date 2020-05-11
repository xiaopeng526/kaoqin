import appInfoRequest from '../../../utils/requestPbms'

// 应用信息列表查询
export function getAppInfoList(params) {
  return appInfoRequest({
    url: 'pbms/organ/type/query',
    method: 'get',
    params
  })
}
