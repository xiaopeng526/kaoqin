/**
 * Created by jiachenpan on 16/11/18.
 */

/* 合法uri*/
export function validateURL(textval) {
  const urlregex = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/;
  return urlregex.test(textval);
}

/* 小写字母*/
export function validateLowerCase(str) {
  const reg = /^[a-z]+$/;
  return reg.test(str);
}

/* 大写字母*/
export function validateUpperCase(str) {
  const reg = /^[A-Z]+$/;
  return reg.test(str);
}

/* 大小写字母*/
export function validatAlphabets(str) {
  const reg = /^[A-Za-z]+$/;
  return reg.test(str);
}

//小写字母转大写
export function toUpperCase(str) {
  str = str.toUpperCase();
  return str;
}

/**
 * 验证邮箱
 * @param str
 * @returns {boolean}
 */
export function validatEmail(str) {
  const reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
  return reg.test(str);
}

// 校验邮箱，非必填
const checkEmailNull = (rule, value, callback) => {
  const emailReg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
  if (!value) {
    return callback();
  }
  // const emailReg = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z]{2,5}$/
  setTimeout(() => {
    if (!emailReg.test(value)) {
      callback(new Error("请输入正确的邮箱"));
    } else {
      callback();
    }
  }, 100);
};

// 校验手机号，非必填
const checkNumPhone = (rule, value, callback) => {
  // console.log(rule, value, callback);
  const phoneReg = /^1[0-9]{10}$/;
  if (!value) {
    // 判断是否为空，非必填
    return callback();
  }
  setTimeout(() => {
    // if (!Number.isInteger(+value)) {
    //   return callback(new Error('请输入数字值'))
    // } else {
    if (!phoneReg.test(value)) {
      callback(new Error("请输入正确的手机号"));
    } else {
      callback();
    }
    // }
  }, 100);
};

// 校验手机号及座机号，必填
const checkRequiredPhone = (rule, value, callback) => {
  const phoneReg = /^1[0-9]{10}$/;
  const mobileReg = /^0\d{2,3}-?\d{7,8}$/;
  if (!value) {
    // 判断是否为空，必填
    return callback(new Error("请输入数字值"));
  }
  setTimeout(() => {
    if (!phoneReg.test(value) || !mobileReg.test(value)) {
      callback(new Error("请输入正确的号码"));
    } else {
      callback();
    }
  }, 100);
};

// 校验邮编
const checkNumber = (rule, value, callback) => {
  const phoneReg = /^[0-9]{6}$/;
  // if (!value) { // 判断是否为空，必填
  //   return callback()
  // }
  setTimeout(() => {
    if (!phoneReg.test(value) && value !== "") {
      callback(new Error("请输入正确的号码"));
    } else {
      callback();
    }
  }, 100);
};
// 校验座机号，非必填
const checkNoRequiredPhone = (rule, value, callback) => {
  // const phoneReg = /^1[0-9]{10}$/
  const mobileReg = /^0\d{2,3}-?\d{7,8}$/;
  if (!value) {
    // 判断是否为空，非必填
    return callback();
  }
  setTimeout(() => {
    // if (!phoneReg.test(value) ) {
    //   callback(new Error('请输入正确的号码'))
    // }else
    if (!mobileReg.test(value)) {
      callback(new Error("请输入正确的座机号码"));
    } else {
      callback();
    }
  }, 100);
};
// 校验名称
function checkName(rule, value, callback, message, maxSize) {
  const reg = new RegExp(`^[\u4e00-\u9fa5A-Za-z0-9]{1,40}$`);
  if (!value) {
    return callback();
  }
  setTimeout(() => {
    if (!reg.test(value)) {
      callback(new Error(`长度40字以内,不能有特殊字符`));
    } else {
      callback();
    }
  }, 100);
}
// 校验地址
function checkAddress(rule, value, callback, message, maxSize) {
  const reg = new RegExp(`^[\u4e00-\u9fa5A-Za-z0-9]{1,8}$`);
  if (!value) {
    return callback();
  }
  setTimeout(() => {
    if (reg.test(value)) {
      callback();
    } else {
      callback(new Error("地址长度20字以内,不能有特殊字符"));
    }
  }, 100);
}

function checkEmail(rule, value, callback) {
  const reg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
  setTimeout(() => {
    if (reg.test(value)) {
      callback();
    } else {
      callback(new Error("请输入正确邮箱地址"));
    }
  }, 100);
}

// 校验金额必填
const checkAmount = (rule, value, callback) => {
  const amountReg = /^(([1-9]\d*)|\d)(\.\d{1,2})?$/;
  if (!value) {
    // 判断是否为空，必填
    return callback(new Error("请输入金额"));
  }
  setTimeout(() => {
    if (!amountReg.test(value)) {
      callback(new Error("请输入正确的金额数"));
    } else {
      callback();
    }
  }, 100);
};

// 校验天数
const checkDay = (rule, value, callback) => {
  // if(value.length<4){
  // const billDay = /^\+?[1-9][0-9]*$/
  const billDay = /^[0-9]*$/;
  if (!value) {
    // 判断是否为空，必填
    return callback(new Error("请输入天数"));
  }
  setTimeout(() => {
    if (!billDay.test(value)) {
      callback(new Error("请输入正确的天数"));
    } else {
      callback();
    }
  }, 100);
  // } else {diz
  //   callback(new Error('最多只能输入三位数'))
  // }
};

/* 合法uri */
const validateUrlAll = (rule, value, callback) => {
  const re_weburl = new RegExp(
    "^" +
      // protocol identifier
      // '(?:(?:https?|ftp)://)' +
      // user:pass authentication
      "(?:\\S+(?::\\S*)?@)?" +
      "(?:" +
      // IP address dotted notation octets
      // excludes loopback network 0.0.0.0
      // excludes reserved space >= 224.0.0.0
      // excludes network & broacast addresses
      // (first & last IP address of each class)
      "(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])" +
      "(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}" +
      "(?:\\.(?:[1-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))" +
      "|" +
      // host name
      "(?:(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)" +
      // domain name
      "(?:\\.(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)*" +
      // TLD identifier
      "(?:\\.(?:[a-z\\u00a1-\\uffff]{2,}))" +
      ")" +
      // port number
      "(?::\\d{2,5})?" +
      // resource path
      "(?:/\\S*)?" +
      "$",
    "i"
  );
  if (re_weburl.test(value)) {
    callback();
  } else {
    callback(new Error("URL不合法"));
  }
};

export {
  checkNumber,
  // checkPhone,
  checkNumPhone,
  checkRequiredPhone,
  checkNoRequiredPhone,
  checkName,
  checkAddress,
  checkEmail,
  checkEmailNull,
  checkAmount,
  checkDay,
  validateUrlAll
};
