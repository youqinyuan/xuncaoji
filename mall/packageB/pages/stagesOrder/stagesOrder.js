// packageB/pages/stagesOrder/stagesOrder.js
var time = require('../../../utils/util.js');
var utils = require('../../../utils/util.js');
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showTab:2,
    pageNumber:1,
    pageSize:20,
    content:{},
    success:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.init()
    this.setData({
      options:options
    })
  },
  init:function(){
    let that = this
    app.Util.ajax('mall/OrderInstallment/queryList', {
      pageNumber: that.data.pageNumber,
      pageSize: that.data.pageSize, 
      type:that.data.showTab==2?1:2
    }, 'GET').then((res) => { // 使用ajax函数
      if (res.data.messageCode == 'MSG_1001') {
        let arr = res.data.content.items
        let arr1 = []
        for (let i of arr) {
          arr1 = i.installmentPaymentDetail
          i.repaymentDate= utils.formatTimeTwo(i.repaymentDate, 'Y-M-D');
          i.dissipate= utils.formatTimeTwo(i.dissipate, 'Y-M-D');
          for (let j of arr1) {
            j.payTime= utils.formatTimeTwo(j.payTime, 'Y-M-D');
          }
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
      that.init()
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
  toDetail:function(e){
    wx.navigateTo({
      url: "/packageB/pages/stagesOrderDetail/stagesOrderDetail?orderId="+ e.currentTarget.dataset.orderid,
    })
  },
  changeTab:function(e){
    let that = this
    let index = e.currentTarget.dataset.index
    if(index==1){
      that.setData({
        showTab:1
      })
    }else{
      that.setData({
        showTab:2
      })
    }
    that.init()
  },
  toIndex:function(){
    wx.switchTab({
      url: '/pages/newIndex/newIndex',
    })
  },
  toPay:function(e){
    let list = e.currentTarget.dataset.list
    console.log(list)
    wx.navigateTo({
      url: `/pages/paymentorder/paymentorder?id=${list.transId}&applyStages=1`,
    })
  },
  cancleSuccess:function(){
    this.setData({
      success:false
    })
  }
})