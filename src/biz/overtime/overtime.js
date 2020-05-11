import request from '@/utils/requestBiz'

// 查询请假列表
export function reqOverTime(data){
    return request({
        url:'/overtime/findPageOvertime',
        method:'get',
        params:data
    })  
}


// 新增&修改请假信息
export function reqUpdateOverTime(data){
    return request({
        url:'/overtime/updateOvertime',
        method:'put',
        data:data
    })
}

// 根据请假编号删除请假信息

export function reqDelOverTimeId(data){
    return request({
        url:`/overtime/deleteOvertime/${data}`,
        method:'delete',
     
    })
}


// 计算时长
export function reqSameDay(data){
    return request({
        url:'/overtime/cntOtLength',
        method:'get',
        params:data
    })
}