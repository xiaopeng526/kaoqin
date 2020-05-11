import request from '@/utils/requestAdmin'

export function login(username, password, code, uuid) {
  return request({
    url: 'auth/login',
    method: 'post',
    data: {
      username,
      password,
      code,
      uuid
    }
  })
}
export function toBiz() {
  return request({
    url: 'myork/findMyWorks',
    method: 'get'
  })
}
export function toAttd() {
  return request({
    url: 'attd/attd/findAll',
    method: 'get'
  })
}
export function getInfo() {
  return request({
    url: 'auth/info',
    method: 'get'
  })
}

// 调用后端服务生成验证码图片
export function getCodeImg() {
  return request({
    url: 'auth/vCode',
    method: 'get'
  })
}
