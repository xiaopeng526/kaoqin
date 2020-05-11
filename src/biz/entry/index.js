import request from "@/utils/requestBiz";

// 获取 直线经理
export function findUser(params) {
  return request({
    url: "/user/findUser",
    method: "get",
    params
  });
}

// 提交入职表单
export function saveUser(data) {
  return request({
    url: "/user/saveUser",
    method: "post",
    data
  });
}
