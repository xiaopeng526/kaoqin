import request from '@/utils/requestBiz'

/*列表查询-列表*/
export function apiQueryList(data) {
	return request({
		url: '/brief/findBriefs',
		method: 'get',
		params: data
	})
}
/*列表查看-所有*/
export function apiQueryAll(data) {
	return request({
		url: '/brief/findAll',
		method: 'get',
		params: data
	})
}


/*个人信息-查看*/
export function apiQueryInfo(data) {
	return request({
		url: `/brief/findBrief/${data}`,
		method: 'get'
	})
}
/*个人信息-更新*/
export function apiUpdateBrief(data) {
	return request({
		url: '/brief/updateBrief',
		method: 'put',
		data: data
	})
}


/*工作经验-查看*/
export function apiQueryWork(data) {
	return request({
		url: `/brief/briefWork/findWork/${data}`,
		method: 'get'
	})
}
/*工作经验-更新*/
export function apiUpdateWork(data) {
	return request({
		url: '/brief/briefWork/updateWork',
		method: 'put',
		data: data
	})
}
/*工作经验-删除*/
export function apiDelWork(data) {
	return request({
	    url: `/brief/briefWork/deleteWork/${data}`,
	    method: 'delete'
	})
}


/*项目经验-查看*/
export function apiQueryPro(data) {
	return request({
		url: `/brief/briefPro/findPro/${data}`,
		method: 'get'
	})
}
/*项目经验-更新*/
export function apiUpdatePro(data) {
	return request({
		url: '/brief/briefPro/updatePro',
		method: 'put',
		data: data
	})
}
/*项目经验-删除*/
export function apiDelPro(data) {
	return request({
	    url: `/brief/briefPro/deletePro/${data}`,
	    method: 'delete'
	})
}


/*教育经历-查看*/
export function apiQueryEdu(data) {
	return request({
		url: `/brief/briefEdu/findEdu/${data}`,
		method: 'get'
	})
}
/*教育经历-更新*/
export function apiUpdateEdu(data) {
	return request({
		url: '/brief/briefEdu/updateEdu',
		method: 'put',
		data: data
	})
}
/*教育经历-删除*/
export function apiDelEdu(data) {
	return request({
	    url: `/brief/briefEdu/deleteEdu/${data}`,
	    method: 'delete'
	})
}


/*培训经历-查看*/
export function apiQueryTra(data) {
	return request({
		url: `/brief/briefTra/findTra/${data}`,
		method: 'get'
	})
}
/*培训经历-更新*/
export function apiUpdateTra(data) {
	return request({
		url: '/brief/briefTra/updateTra',
		method: 'put',
		data: data
	})
}
/*培训经历-删除*/
export function apiDelTra(data) {
	return request({
	    url: `/brief/briefTra/deleteTra/${data}`,
	    method: 'delete'
	})
}


/*专业技能-查看*/
export function apiQuerySk(data) {
	return request({
		url: `/brief/briefProSk/findProSk/${data}`,
		method: 'get'
	})
}
/*专业技能-更新*/
export function apiUpdateSk(data) {
	return request({
		url: '/brief/briefProSk/updateProSk',
		method: 'put',
		data: data
	})
}
/*专业技能-删除*/
export function apiDelSk(data) {
	return request({
	    url: `/brief/briefProSk/deleteProSk/${data}`,
	    method: 'delete'
	})
}