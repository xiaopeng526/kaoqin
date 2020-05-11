import request from '@/utils/requestBiz'


// 查询外出信息
export function reqOutGoing(data){
    return request({
        url:'/outgoing/findPageOutgoing',
        method:'get',
        params:data
    })
}

// 新增&修改外出信息
export function reqUpdateOutGoing(data){
    return request({
        url:'/outgoing/updateOutgoing',
        method:'put',
        data:data
    })
}
// 根据外出Id删除外出信息
export function reqDeleteOutGoing(data){
    return request({
        url:`/outgoing/deleteOutgoing/${data}`,
        method:'delete'
    })
}

// 计算时长
export function reqDuration(data){
    return request({
        url:'/outgoing/cntOgLength',
        method:'get',
        params:data
    })
}