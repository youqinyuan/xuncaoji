// pages/invitationCode/invitationCode.js
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hostUrl: app.Util.getUrlImg().hostUrl,
    inputValue: ''
  },
  bindInput: function(e) {
    var that = this
    var inputValue = e.detail.value
    that.setData({
      inputValue: inputValue
    })
  },
  //跳转到选择登录方式
  jumpIndex: function() {
    var that = this
    if (that.data.inputValue == '' || that.data.inputValue.length > 8) {
      wx.showToast({
        title: '请输入正确的邀请码',
        icon: 'none',
        duration:2000
      })
    } else {
      wx.setStorageSync('inviterCode1', that.data.inputValue)
      wx.navigateTo({
        url: '/pages/loginWay/loginWay'
      })
    }
  },
  nextStep: function() {
    var that = this
    wx.navigateTo({
      url: '/pages/login/login?pageNum=' + 3
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    let inviterCode = ''
    wx.setStorageSync("freeBuyStatus",1)
    wx.removeStorage({
      key: 'tips',
      success: function(res) {},
    })
    console.log("options:"+JSON.stringify(options))
    if(options.inviterCode=='undefined'){
      inviterCode = ''
    }else{
      inviterCode = options.inviterCode
    }
    if (options.scene) {
      //扫描小程序码进入 -- 解析携带参数
      var scene = decodeURIComponent(options.scene);
      var arrPara = scene.split("&");
      var arr = [];
      for (var i in arrPara) {
        arr = arrPara[i].split("=");
        if (arr[0] == 'inviterCode') {
          that.setData({
            inputValue: parseInt(arr[1]),
          })
        }
      }
    }
    if(options.type==3){
      that.setData({
        inputValue: app.globalData.cooperateInvitionCode || 17511690
      })
    }else{
      that.setData({
        inputValue: inviterCode || wx.getStorageSync('othersInviterCode') || ''
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var that = this
    var tips = wx.getStorageSync('tips')
    if(tips){
      wx.showToast({
        title: tips,
        icon: 'none',
        duration: 2000
      })
    }
    setTimeout(function () {
      wx.removeStorage({
        key: 'tips',
        success: function(res) {},
      })
    }, 1000);
    // that.onLoad(options)
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    // wx.reLaunch({
    //   url: '/pages/index/index',
    // })
    // var pages = getCurrentPages()
    // console.log(pages[0].route)
    // console.log(JSON.stringify(pages[pages.length-2].route))
    // var loginStatus = wx.getStorageSync('loginStatus')
    // console.log("aaa"+loginStatus)
    // if(loginStatus){

    // }else{
    //   if(pages[0].route == "pages/wishpool/wishpool"||pages[pages.length-2].route == "pages/detail/detail"||pages[0].route == "pages/index/index"){

    //   }else{
    //     wx.navigateBack({
    //       delta: 1
    //     })
    //   }
    // }
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})