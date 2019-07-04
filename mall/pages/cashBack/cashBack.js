// pages/cashBack/cashBack.js
var time = require('../../utils/util.js');
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    content:{},
    latestStatus:1,
    options:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    var orderId = parseInt(options.orderId)
    this.setData({
      options:options
    })
    app.Util.ajax('mall/order/queryOrderCashBack', { orderId: orderId}, 'GET').then((res) => { // 使用ajax函数
      if (res.data.content) {
        for (var i = 0; i < res.data.content.length;i++){
          for (var j = 0; j < res.data.content[i].orderGoodsCashBackItem.length;j++){
            res.data.content[i].orderGoodsCashBackItem[j].returnTime = time.formatTimeTwo(res.data.content[i].orderGoodsCashBackItem[j].returnTime, 'Y-M-D h:m:s');
          }
        }
        this.setData({
          content:res.data.content,
          latestStatus: parseInt(options.latestStatus)
        })
      }
    })
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
    var that = this
    that.onLoad(that.data.options)
    wx.stopPullDownRefresh() //停止下拉刷新
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

  }
})