//app.js
const util = require('./utils/util.js') // 将工具函数导入进来
App({
  onLaunch: function() {
    var that = this;
    wx.login({
      success(res) {
        console.log("获取code成功");
        console.log('res.code:', res.code,res);
        wx.setStorageSync('code', res.code)
        // if (res.code) {
        //   //发起网络请求
        //   wx.request({　　　
        //     url: 'https://api.weixin.qq.com/sns/jscode2session?appid=that.globalData.appid&secret=that.globalData.secret&js_code=' + res.code + '&grant_type=authorization_code', //后台接收code，返回openid的接口
        //     header: {
        //       'content-type': 'application/json'
        //     },
        //     success: function(res) {
        //       console.log(res); //后台数据
        //     }
        //   })
        // }
      }
    })

  },
  Util: {
    ajax: util.ajax,
    deepCopy: util.deepCopy
  },
  globalData: {
    appid: 'wx49f6da054a1eb413',
    secret:'e0dassdadef2424234209bwqqweqw123ccqwa',
    flag: false
  },

  //通用导航方法
  nav: function(e) {
    if (getCurrentPages().length <= 10 && !e.currentTarget.dataset.type) {
      wx.navigateTo({
        url: e.currentTarget.dataset.url
      })
    } else {
      wx.reLaunch({
        url: e.currentTarget.dataset.url
      })
    }
  },
  
  onShow: function () {

  },
})