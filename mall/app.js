//app.js
const util = require('./utils/util.js') // 将工具函数导入进来
App({
  onLaunch: function (options) {
    var that = this;   
    wx.login({
      success(res) {
        console.log('res.code:', res.code, res);
        wx.setStorageSync('code', res.code)
      }
    })
  },
  Util: {
    ajax: util.ajax,
    deepCopy: util.deepCopy
  },
  globalData: {
    appid: 'wx49f6da054a1eb413',
    secret: 'e0dassdadef2424234209bwqqweqw123ccqwa',
    flag: false,
    scene:'',
    share:0
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

  onShow: function (options) {
    this.globalData.scene = options.scene
  },
  onHide:function(){
    
  }
})