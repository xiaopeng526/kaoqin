import request from '@/utils/requestBiz'

//1、列表搜索
export function fetchList(params) {
  return request({
    url:'/worklog/findWorklog',
    method: 'get',
    params: params
  })
}
//2、查看日报所有内容(查看按钮)
export function fetchContent(params) {
  return request({
    url:'/worklog/findAll',
    method: 'get',
    params:params
  })
}
//3、查看日报COE信息
export function fetchCoe(worklogId) {
  return request({
    url:'/worklog/COE/findCOE/'+worklogId,
    method: 'get',
  })
}

//4、更新日报COE信息（新增&&修改）
export function addCOE(data,worklogDate) {
  return request({
    url: '/worklog/COE/updateCOE?worklogDate='+worklogDate,
    method: 'put',
    data:data
  })
}

//5、根据id删除日报COE信息
export function deleteCEO(Id) {
  return request({
    url: '/worklog/COE/deleteCOE/'+Id,
    method: 'delete',
  })
}
//6、查看日报客户拜访信息
export function fetchCustomer(worklogId) {
  return request({
    url:'/worklog/cus/findCus/'+worklogId,
    method: 'get',
  })
}
//7、更新日报客户拜访信息
export function addCustomer(data,worklogDate) {
  return request({
    url: '/worklog/cus/updateCus?worklogDate='+worklogDate,
    method: 'put',
    data:data
  })
}
//8、根据ID删除日报客户拜访信息
export function deleteCustomer(Id) {
  return request({
    url: '/worklog/cus/deleteCus/'+Id,
    method: 'delete',
  })
}
//9、查看日报研发信息（查看）
export function fetchDevelop(worklogId) {
  return request({
    url:'/worklog/develop/findDev/'+worklogId,
    method: 'get',
  })
}
//10、更新日报研发信息（新增&&修改）
export function addDevelop(data,worklogDate) {
  return request({
    url: '/worklog/develop/updateDev?worklogDate='+worklogDate,
    method: 'put',
    data:data
  })
}
//11、根据ID删除日报研发信息（删除）
export function deleteDevelop(Id) {
  return request({
    url: '/worklog/develop/deleteDev/'+Id,
    method: 'delete',
  })
}
//12、查看日报项目信息（查看）
export function fetchProject(worklogId) {
  return request({
    url:'/worklog/iteam/findIteam/'+worklogId,
    method: 'get',
  })
}
//13、更新日报项目信息（新增&&修改）
export function addItem(data,worklogDate) {
  return request({
    url: '/worklog/iteam/updateIteam?worklogDate='+worklogDate,
    method: 'put',
    data:data
  })
}
//14、根据ID删除日报项目信息（删除）
export function deleteProject(Id) {
  return request({
    url: '/worklog/iteam/deleteIteam/'+Id,
    method: 'delete'
  })
}
//获取当前日期
export function DateExist() {
  return request({
    url: '/worklog/getNowDate',
    method: 'get'
  })
}
//根据日期获取所有信息
export function fetchInfo(worklogDate) {
  return request({
    url:'/worklog/find?worklogDate='+worklogDate,
    method: 'get',
  })
}
