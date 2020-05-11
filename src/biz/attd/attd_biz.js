import request from "@/utils/requestBiz";

// 请求月份1-30号的列表信息
export function findMonthList(data) {
  return request({
    url: "/attd/findMonthList",
    method: "get",
    params: data
  });
}
