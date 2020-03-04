// pages/lovingHeart/lovingHeart.js
const app = getApp()
var time = require('../../utils/util.js');
var newCount = true
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hostUrl: app.Util.getUrlImg().hostUrl,
    show1:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if(wx.getStorageSync('loving')){
      this.setData({
        show1:true
      })
      setTimeout(function(){
        wx.removeStorageSync('loving')
      },1000)
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  toPay:function(){
    if(newCount==true){
      newCount = false
      var token = wx.getStorageSync('token')
    if (token) {
      app.Util.ajax('mall/order/addCharityDonationOrder', null, 'POST').then((res) => {
        if (res.data.content) {
          wx.navigateTo({
            url: `/pages/paymentorder/paymentorder?id=${res.data.content.id}&amount2=${1}`,
          })
        } else {
          wx.showToast({
            title: res.data.message,
            icon: 'none'
          })
        }
      })
    } else {
      wx.navigateTo({
        url: '/pages/invitationCode/invitationCode',
      })
    }
    }
    setTimeout(function(){
      newCount = true
    },1500)
    
  },
  closeShow1:function(){
    this.setData({
      show1:false
    })
  },
  toOther:function(){
    wx.navigateTo({
      url: '/packageA/pages/freeBuy/freeBuy',
    })
  }
})