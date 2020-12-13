// packageB/pages/applyZeroStages/applyZeroStages.js
let app = getApp()
var utils = require('../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showStages:false,
    buyType:1,//线上购买
    hostUrl: app.Util.getUrlImg().hostUrl,
    rule:'1、我是一段文案我是一段文案我是一段文案我是一段文案；2、我是一段文案我是一段文案我是一段文案我是一段文案；2、我是一段文案我是一段文案我是一段文案我是一段文案；'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      options:options
    })
    this.init()
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
  init:function(){
    let that = this
    app.Util.ajax('mall/freeShopping/request/getInstallmentPeriods', {
      stockId: that.data.options.stockId,
      period: that.data.options.cashBackPeriods, 
      amount:that.data.options.amount  
    }, 'GET').then((res) => { // 使用ajax函数
      if (res.data.messageCode == 'MSG_1001') {
        var arr = res.data.content
        for (let i of arr.payDetails) {
          i.payDate = utils.formatTimeTwo(i.payDate, 'Y-M-D');
        }
        that.setData({
          content:arr,
          choose:res.data.content.installmentPeriods.length-1,
          stagingNumber:res.data.content.installmentPeriods[res.data.content.installmentPeriods.length-1]
        })
      } else {
        wx.showToast({
          title: res.data.message,
          icon: 'none'
        })
      }
    })
  },
  init2:function(){
    let that = this
    app.Util.ajax('mall/freeShopping/request/getInstallmentPeriods', {
      stockId: that.data.options.stockId,
      period: that.data.options.cashBackPeriods, 
      amount:that.data.options.amount,
      stagingNumber:that.data.stagingNumber
    }, 'GET').then((res) => { // 使用ajax函数
      if (res.data.messageCode == 'MSG_1001') {
        let arr = res.data.content
        for (let i of arr.payDetails) {
          i.payDate = utils.formatTimeTwo(i.payDate, 'Y-M-D');
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
  showStages:function(){
    this.setData({
      showStages:true
    })
  },
  cancleStages:function(){
    this.setData({
      showStages:false
    })
  },
  choose:function(e){
    let choose = e.currentTarget.dataset.index
    let that = this
    that.setData({
      choose:choose,
      stagingNumber:that.data.content.installmentPeriods[choose]
    })
    that.init2()
  },
  toPlaceOrder:function(){
    console.log(this.data.options)
    wx.navigateTo({
      url: '/pages/placeorder/placeorder?goodsId=' + this.data.options.goodsId + '&&stockId=' + this.data.options.stockId + '&&quantity=' + this.data.options.quantity + '&&goodsType=applyZero' + '&&needPaymentAmount=' + this.data.options.amount + '&&buyType=' + this.data.buyType  + '&&discountCompute=' + this.data.options.discountCompute+ '&&stagingNumber=' + this.data.stagingNumber+ '&&cashBackPeriods=' + this.data.options.cashBackPeriods+ '&&buymode=2'
    })
  }
})