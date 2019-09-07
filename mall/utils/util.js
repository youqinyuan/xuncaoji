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
/*获取当前页带参数的url*/
function getUrl() {
  var pages = getCurrentPages() //获取加载的页面
  var currentPage = pages[pages.length - 1] //获取当前页面的对象
  var url = currentPage.route //当前页面url
  wx.setStorageSync('Router', `/${url}`)
  console.log(currentPage)
  var options = currentPage.options //如果要获取url中所带的参数可以查看options

  //参数多时通过&拼接url的参数
  var urlWithArgs = url + '?'
  for (var key in options) {
    var value = options[key]
    urlWithArgs += key + '=' + value + '&'
  }
  urlWithArgs = urlWithArgs.substring(0, urlWithArgs.length - 1)
  wx.setStorageSync('Url', `/${urlWithArgs}`)
}

// 获取当前页面路由
function getRouter() { //此方法跟上面一个方法前四行一致，只是这里是获取路由不是拼接参数的
  var pages = getCurrentPages() //获取加载的页面
  var currentPage = pages[pages.length - 1] //获取当前页面的对象
  var router = currentPage.route //当前页面url
  console.log(currentPage)
  wx.setStorageSync('Router', `/${router}`)
}

const ajax = (url, data, method, config = {}) => {
  let token = wx.getStorageSync('token')
  let baseUrl = "https://xuncaoji.yzsaas.cn/"; //测试环境
  // let baseUrl = 'https://xuncj.yzsaas.cn/'; //正式环境
  let headerConfig = { // 默认header ticket、token、params参数是每次请求需要携带的认证信息
    ticket: '...',
    token: '' || token,
    params: '...',
    'content-type': 'application/json'
  }
  wx.showLoading({
    title: '加载中…',
  })
  return new Promise((resolve, reject) => { // 返回一个promise
    wx.request({
      url: baseUrl + url, // 拼接url
      data,
      header: Object.assign({}, headerConfig, config), // 合并传递进来的配置
      method: method,
      success(res) {
        if (res.data.statusCode == 200) {
            wx.hideLoading()
          if (res.data.messageCode == 'MSG_1001') {
            // console.log('请求成功') 
            resolve(res)
          } else if (res.data.messageCode == 'MSG_2001') {
            // console.log('未授权')
            var pages = getCurrentPages()
            if(pages[pages.length - 1].route == 'pages/index/index'){
              return;
            }
            wx.navigateTo({
              url: '/pages/invitationCode/invitationCode',
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
        wx.hideLoading()
      }
    })
  })
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
  getUrl: getUrl,
  getRouter: getRouter,
  ajax: ajax,
  deepCopy: deepCopy
}