/*邮编*/
function checkNumber(rule,value,callback){
  const Reg = /^[0-9]{6}$/
  if (!value) { // 判断是否为空，必填
    return callback()
  }
  setTimeout(() => {
    if (!Reg.test(value) && value != '') {
      callback(new Error('请输入正确的号码'))
    } else {
      callback()
    }
  }, 100)
}
/*网址*/
function validateCompareWebsite(rule,value,callback){
  const Reg = /^[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+\.(com$|com\/[\S]*)/i
  // if (!value) { // 判断是否为空，必填
  //   return callback()
  // }
  setTimeout(() => {
    if (!Reg.test(value) && value != '') {
      callback(new Error('请输入正确网址'))
    } else {
      callback()
    }
  }, 100)
}
/* 是否固话*/
 function validateTelphone(rule, value,callback) {
   const reg = /0\d{2}-\d{7,8}/
   // if (!value) { // 判断是否为空，必填
   //   return callback()
   // }
   setTimeout(() => {
     if (!reg.test(value) && value != '') {
       callback(new Error('请输入正确的座机号'))
     } else {
       callback()
     }
   }, 100)
 }
/* 手机号校验*/
function validateMobile(rule, value,callback) {
  const reg =  /^[1][3,4,5,6,7,8,9][0-9]{9}$/
  // if (!value) { // 判断是否为空，必填
  //   return callback()
  // }
  setTimeout(() => {
    if (!reg.test(value) && value != '') {
      callback(new Error('请输入正确的座机号'))
    } else {
      callback()
    }
  }, 100)
}
/*邮箱*/
function checkEmail(rule,value,callback){
  const reg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/
  setTimeout(() => {
    if (reg.test(value)) {
      callback()
    } else {
      callback(new Error('请输入正确邮箱地址'))
    }
  }, 100)
}

export {checkNumber ,
  validateCompareWebsite,
  validateTelphone,
  validateMobile,
  checkEmail

}
