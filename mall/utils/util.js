function formatTime(date) {
  var date = new Date(Date.parse(date));
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var day = date.getDate();

  var hour = date.getHours();
  var minute = date.getMinutes();
  var second = date.getSeconds();

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':');
}

function formatNumber(n) {
  n = n.toString();
  return n[1] ? n : '0' + n;
}

/** 
 * 时间戳转化为年 月 日 时 分 秒 
 * number: 传入时间戳 
 * format：返回格式，支持自定义，但参数必须与formateArr里保持一致 
 */
function formatTimeTwo(number, format) {
  var formateArr = ['Y', 'M', 'D', 'h', 'm', 's'];
  var returnArr = [];

  var date = new Date(number);
  returnArr.push(date.getFullYear());
  returnArr.push(formatNumber(date.getMonth() + 1));
  returnArr.push(formatNumber(date.getDate()));
  returnArr.push(formatNumber(date.getHours()));
  returnArr.push(formatNumber(date.getMinutes()));
  returnArr.push(formatNumber(date.getSeconds()));

  for (var i in returnArr) {
    format = format.replace(formateArr[i], returnArr[i]);
  }
  return format;
}

const ajax = (url, data, method, config = {}) => {
  var authLoginStatus = 0
  var authLoginStatus2 = wx.getStorageSync('authLoginStatus')
  if (authLoginStatus2) {
    authLoginStatus = authLoginStatus2
  }
  let token = wx.getStorageSync('token')
  let baseUrl = "https://dev.xuncaoji.net/v2.4/"; //测试环境
  // let baseUrl = 'https://xuncaoji.net/v2.3/'; //正式环境
  let headerConfig = { // 默认header ticket、token、params参数是每次请求需要携带的认证信息
    ticket: '...',
    token: '' || token,
    params: '...',
    'content-type': 'application/json'
  }
  wx.showLoading({
    title: '加载中…',
  })
  return new Promise((resolve, reject) => {
    wx.request({
      url: baseUrl + url,                                                                                  
      data,
      header: Object.assign({}, headerConfig, config),
      method: method,
      success(res) {
        // console.log("接口信息："+JSON.stringify(res))
        var pages = getCurrentPages()
        if (res.data.statusCode == 200 || authLoginStatus == 1) {
          wx.hideLoading()
          if (res.data.messageCode == 'MSG_1001' || authLoginStatus == 1) {
            // console.log('请求成功') 
            resolve(res)
          } else if (res.data.messageCode == 'MSG_2001') {
            console.log(res.data.messageCode)
            wx.removeStorageSync('token')
            if (pages[pages.length - 1].route == "pages/index/index" || pages[pages.length - 1].route == "pages/wishpool/wishpool" || pages[pages.length - 1].route == "packageA/pages/xuncaoji/xuncaoji" || pages[pages.length - 1].route == "pages/mine/mine" || pages[pages.length - 1].route == "packageA/pages/freeBuy/freeBuy") {
              return;
            } else {
              wx.navigateTo({
                url: '/pages/invitationCode/invitationCode',
              })
            }
          } else if (res.data.messageCode == 'MSG_5001') {
            wx.showToast({
              title: '网络开小差了，请稍后再试哦！',
              icon: 'none'
            })
          } else if (res.data.message == '您的请求过于频繁，请稍候再试') {
            wx.showToast({
              title: res.data.message,
              icon: 'none'
            })
          } else {
            resolve(res)
          }
        }
      },
      fail(res) {
        reject(res => console.log(err))
      },
      complete(res) {
        // wx.hideLoading()
      }
    })
  })
}

function getUrlImg() {
  var hostUrl = 'https://xuncaoji.net/_download/img';
  var hostVideo = 'https://xuncaoji.net/_download/';
  var host = 'https://xuncaoji.net/'
  var publicUrl = "https://dev.xuncaoji.net/v2.4/"; //测试环境 
  // var publicUrl = 'https://xuncaoji.net/v2.3/'; //正式环境
  return {
    hostUrl,
    publicUrl,
    host,
    hostVideo
  }
  console.log(url)
}

function deepCopy(o, c) {
  var c = c || {}
  for (var i in o) {
    if (typeof o[i] === 'object') {
      //要考虑深复制问题了
      if (o[i].constructor === Array) {
        //这是数组
        c[i] = []
      } else {
        //这是对象
        c[i] = {}
      }
      deepCopy(o[i], c[i])
    } else {
      c[i] = o[i]
    }
  }
  return c
}
module.exports = {
  formatTime: formatTime,
  formatTimeTwo: formatTimeTwo,
  ajax: ajax,
  getUrlImg: getUrlImg,
  deepCopy: deepCopy
}