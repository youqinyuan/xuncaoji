// pages/zeroBuy/zeroBuy.js

let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsItems: [],
    showMask: false,
    shareList:'', //分享数据详情
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (options) {
      if (options.inviterCode) {
        wx.setStorage({
          key: "othersInviterCode",
          data: options.inviterCode
        })
      }
    }
    this.init()
    this.chooseShare()
  },
  init: function() {
    var that = this
    app.Util.ajax(`mall/home/activity/freeShopping?mode=${2}`, null, 'GET').then((res) => { // 使用ajax函数
      if (res.data.content) {
        that.setData({
          goodsItems: res.data.content.goodsItems
        })
      }
    })
  },
  // 获取分享数据详情
  chooseShare: function () {
    var that = this
    app.Util.ajax('mall/weChat/sharing/target', {
      mode: 3
    }, 'GET').then((res) => {
      if (res.data.content) {
        var inviterCode = wx.getStorageSync('inviterCode')
        if (inviterCode) {
          res.data.content.link = res.data.content.link.replace(/{inviterCode}/g, inviterCode)
        } else {
          res.data.content.link = res.data.content.link.replace(/{inviterCode}/g, '')
        }
        that.setData({
          shareList: res.data.content
        })
      }
    })
  },
  //显示或隐藏弹框
  show: function() {
    var token = wx.getStorageSync('token')
    console.log(token)
    if (!token) {
      wx.navigateTo({
        url: '/pages/invitationCode/invitationCode',
      })
      return;
    }else{
      this.setData({
        showMask: !this.data.showMask
      })
    }
  },
  //阻止弹框之后的页面滑动问题
  preventTouchMove: function() {

  },
  //保存公众号二维码图片到相册
  saveImg: function() {
    wx.saveImageToPhotosAlbum({
      filePath: '/assets/images/icon/code.png',
      success(res) {
        wx.showToast({
          title: '图片保存成功',
          icon: 'success',
          duration: 1000
        })
      }
    })
  },
  // 点击分享按钮
  shares: function () {
    this.setData({
      showModalStatus1: true
    })
  },
  // 取消分享
  cancelShare: function () {
    this.setData({
      showModalStatus1: false
    })
  },
  // 分享朋友圈
  shareFriend: function () {
    var that = this
    wx.showToast({
      title: '开发中，敬请期待。',
      icon: 'none',
      duration: 2000
    })
    that.setData({
      showModalStatus1: false
    })
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
  onShareAppMessage: function(ops) {
    var that = this
    if(ops.from === 'button'){
      that.setData({
        showModalStatus1: false
      })
      return {
        title: '「新人福利」全场商品免费领~所有商品均支持0元购~自由买免费拿~',
        path: "/pages/zeroBuy/zeroBuy?inviterCode=" + wx.getStorageSync('inviterCode'),
      }
    }else{
      return {
        title: '「新人福利」全场商品免费领~所有商品均支持0元购~自由买免费拿~',
        path: "/pages/zeroBuy/zeroBuy?inviterCode=" + wx.getStorageSync('inviterCode'),
      }
    }
  }
})