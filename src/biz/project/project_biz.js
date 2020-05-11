import request from '@/utils/requestBiz'
// 项目管理查询接口
export function reqQuery(data){
    return request({
        url:'/project/findPageProject',
        method:'get',
        params:data
    })
}


// 项目管理新增/修改接口
export function reqUpdateProject(data){
    return request({
        url:'/project/updateProject',
        method:'put',
        data:data
    })
}
// 项目管理删除
export function reqDelete(data){
    return request({
        url:`/project/deleteProject/${data}`,
        method:'delete'
    })
}




