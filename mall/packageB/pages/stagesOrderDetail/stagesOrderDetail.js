// packageB/pages/stagesOrderDetail/stagesOrderDetail.js
var utils = require('../../../utils/util.js');
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    success:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      options:options
    })
    this.init()
  },
  init:function(){
    let that = this
    app.Util.ajax('mall/OrderInstallment/queryDetail', {
      orderId:that.data.options.orderId
    }, 'GET').then((res) => { // 使用ajax函数
      if (res.data.messageCode == 'MSG_1001') {
        let arr = res.data.content
        arr.dissipate= utils.formatTimeTwo(arr.dissipate, 'Y-M-D');
        arr.repaymentDate= utils.formatTimeTwo(arr.repaymentDate, 'Y-M-D');
        for (let i of arr.installmentPaymentDetail) {
          i.payTime= utils.formatTimeTwo(i.payTime, 'Y-M-D');
        }
        that.setData({
          content:arr
        })
      } else {
        wx.showToast({
          title: res.data.message,
          icon: 'none'
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
    let that = this
    if(that.data.applyStages){
      that.onLoad(that.data.options)
      setTimeout(function(){
        that.setData({
          success:true
        })
      },500)
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
    let list = that.data.content.transStatementDetail
    wx.navigateTo({
      url: `/pages/paymentorder/paymentorder?id=${list.transId}`,
    })
  },
  cancleSuccess:function(){
    this.setData({
      success:false
    })
  }
})