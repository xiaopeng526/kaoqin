import request from '@/utils/requestBiz'

//1、列表搜索
  export function fetchList(params) {
    return request({
      url:'/customer/findCustomer',
      method: 'get',
      params: params
    })
}
//2、客户所有信息(查看按钮)
export function fetchForm(params) {
  return request({
    url:'/customer/findAllCus',
    method: 'get',
    params:params
  })
}
//3、查看客户基本信息
export function fetchInfo(id) {
  return request({
    url:'/customer/findCus/'+id,
    method: 'get',
  })
}

  //4、保存客户信息
export function addCustomer(data) {
  return request({
    url: '/customer/updateCustomer',
    method: 'put',
    data:data
  })
}

//5、查看客户地址信息
export function fentchAdress(id) {
  return request({
    url: '/customer/cusAddress/findCusAdd/'+id,
    method: 'get'
  })
}
//6、客户地址的保存及修改
export function adressSaveUpdata(data) {
  return request({
    url: '/customer/cusAddress/updateCusAddress',
    method: 'put',
    data:data
  })
}
//7、删除客户地址
export function deleteAdress(Id) {
  return request({
    url: '/customer/cusAddress/deleteCusAds/'+Id,
    method: 'delete',
  })
}
//8、查询客户开户行信息
export function fetchBank(Id) {
  return request({
    url: '/customer/cusBank/findCusBank/'+Id,
    method: 'get',
  })
}
//9、客户开户行信息的保存及修改
export function bankSaveUpdata(data) {
  return request({
    url: '/customer/cusBank/updateCusBank',
    method: 'put',
    data:data
  })
}
// 10、删除客户开户行
export function deleteBank(Id) {
  return request({
    url: '/customer/cusBank/deleteCusBank/'+Id,
    method: 'delete',
  })
}
//11、查看客户联系方式信息
export function fentchContact(id) {
  return request({
    url: '/customer/cusContact/findCusCon/'+id,
    method: 'get',
  })
}
//12、客户联系信息的保存及修改
export function contactSaveUpdata(data) {
  return request({
    url: '/customer/cusContact/updateCusCont',
    method: 'put',
    data:data
  })
}
// 13、删除客户联系方式
export function deleteContact(Id) {
  return request({
    url: '/customer/cusContact/deleteCusCont/'+Id,
    method: 'delete',
  })
}


