import request from '@/utils/requestBiz'

//1、节假日接口
export function fetchList(params) {
  return request({
    url:'/holiday/holidayCateDef/findHCD',
    method: 'get',
    params: params
  })
}
//2、节假日新增 、编辑
export function addHoliday(data) {
  return request({
    url: '/holiday/holidayCateDef/updateHCD',
    method: 'put',
    data:data
  })
}
//3、信息维护列表查询
export function findHI(params) {
  return request({
    url:'/holiday/findHI',
    method: 'get',
    params: params
  })
}
//4、编辑维护信息
export function updateHCD(data) {
  return request({
    url: '/holiday/updateHCD',
    method: 'put',
    data:data
  })
}
//5、初始化日期
export function Initholiday(params) {
  return request({
    url: '/holiday/initHoliday',
    method: 'get',
    params:params
  })
}
