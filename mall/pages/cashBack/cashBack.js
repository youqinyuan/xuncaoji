// pages/cashBack/cashBack.js
var time = require('../../utils/util.js');
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    content: {},
    latestStatus: 1,
    options: {},
    showDialog4: false,
    orderId: 1,
    orderGoodsId: 0,   
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    console.log('订单号：' + JSON.stringify(options))
    var latestStatus = options.latestStatus
    console.log(latestStatus)
    var orderId = parseInt(options.orderId)
    console.log('终止的订单号:' + orderId)
    if (options.latestStatus) {
      that.setData({
        options: options,
        orderId: orderId,
        latestStatus: latestStatus
      })
    } else {
      that.setData({
        options: options,
        orderId: orderId,
      })
    }
    that.init();
  },
  init: function() {
    var that = this
    app.Util.ajax('mall/order/queryOrderCashBack', {
      orderId: that.data.orderId
    }, 'GET').then((res) => { // 使用ajax函数
      if (res.data.content) {
        for (var i = 0; i < res.data.content.length; i++) {
          for (var j = 0; j < res.data.content[i].orderGoodsCashBackItem.length; j++) {
            res.data.content[i].orderGoodsCashBackItem[j].returnTime = time.formatTimeTwo(res.data.content[i].orderGoodsCashBackItem[j].returnTime, 'Y-M-D h:m:s');
          }
          for (var a = 0; a < res.data.content[i].orderGoodsStageInterestItem.length; a++) {
            res.data.content[i].orderGoodsStageInterestItem[a].returnTime = time.formatTimeTwo(res.data.content[i].orderGoodsStageInterestItem[a].returnTime, 'Y-M-D h:m:s');
          }
        }
        console.log("bb"+JSON.stringify(res.data.content))
        that.setData({
          content: res.data.content,
          latestStatus: parseInt(that.data.latestStatus)
        })
        console.log(that.data.latestStatus)
      }
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
    var that = this
    that.onLoad(that.data.options)
    wx.stopPullDownRefresh() //停止下拉刷新
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

  },
  stopZero: function(e) {
    var that = this
    console.log("终止零元购订单Id:" + that.data.orderId)
    console.log("终止零元购商品Id:" + e.currentTarget.dataset.ordergoodsid)
    app.Util.ajax('mall/order/queryStopApplyZeroPurchase', {
      orderId: that.data.orderId,
      orderGoodsId: e.currentTarget.dataset.ordergoodsid
    }, 'GET').then((res) => {
      console.log("终止零元购剩余返现:" + JSON.stringify(res))
      that.setData({
        refundAmount: res.data.content.refundAmount,
        orderId: that.data.orderId,
        orderGoodsId: e.currentTarget.dataset.ordergoodsid
      })
    })
    that.setData({
      showDialog4: true
    })
  },
  wait: function(e) {
    var that = this
    that.setData({
      showDialog4: false
    })
  },
  comfireCancel: function(e) {
    var that = this
    app.Util.ajax('mall/order/stopApplyZeroPurchase', {
      orderId: e.currentTarget.dataset.orderid,
      orderGoodsId: that.data.orderGoodsId
    }, 'POST').then((res) => {
      console.log(res)
      if(res.data.messageCode=="MSG_1001"){
      wx.showToast({
        title:'终止成功,钱款已进入余额,可随时体现哦!',
        icon:"none",
        during:2000
      })
      setTimeout(function () {
        that.init();
       }, 2000) //延迟时间 这里是1秒
        
      } else {
        wx.showToast({
          title: '终止失败,请稍后再试',
          icon: 'none'
        })
      }
    })
    that.setData({
      showDialog4: false
    })
  },
})