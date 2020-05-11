import request from '@/utils/requestBiz'

// 查询请假列表
export function reqLeave(data){
    return request({
        url:'/leaves/findPageLeaves',
        method:'get',
        params:data
    })  
}


// 新增&修改请假信息
export function reqUpdateLeave(data){
    return request({
        url:'/leaves/updateLeaves',
        method:'put',
        data:data
    })
}

// 根据请假编号删除请假信息

export function reqDelLeaveId(data){
    return request({
        url:`/leaves/deleteLeaves/${data}`,
        method:'delete'

    })
}
// 计算时长
export function reqCntLeavesLength(data){
    return request({
        url:'/leaves/cntLeavesLength',
        method:'get',
        params:data
    })
}

// 上传文件
export function reqUploadFile(data){
    return request({
        url:'/leaves/fileUpload',
        method:'post',
        params:data
    })
}