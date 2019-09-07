// pages/applyZero/applyZero.js
var time = require('../../utils/util.js');
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showPeriod:false,//想要的分期月数
    showDialog:false,//返现明细表
    showModal:false,//利息明细表
    showStop:false,//可随时终止
    showGet:false,//怎么赚的钱
    status:1,//我要平台弹框是否点击自定义
    isFocus:false,//是否自动聚焦
    buttonText:'加入购物车',
    disabled:true,//分期返现月数input是否禁用
    goodsMsg:{},//页面初始化需要传的数据
    cashMsg:{},//页面初始化分期数据
    payMsg:{},//需要支付的金额
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    // var obj = JSON.parse(options.detailObj)
    // that.setData({
    //   goodsMsg:obj
    // })
    that.getInit()
  },
  //请求初始化数据
  getInit:function(){
    var that = this
    app.Util.ajax('mall/freeShopping/request/default', {
      stockId: 3
    }, 'GET').then((res) => {
      if (res.data.messageCode == 'MSG_1001'){
        that.setData({
          cashMsg:res.data.content
        })
        //计算需要支付的金额
        that.compute();
      }
    })
  },
  //分期的月数弹框(出现)
  periodMonth: function () {
    var that = this;
    if(that.data.status == 1){
      that.setData({
        showPeriod: true
      })
    }  
  },
  //分期的月数弹框(隐藏)
  cancelPeriod: function () {
    var that = this;
    that.setData({
      showPeriod: false
    })
  },
  //自定义月数
  custom:function(){
    var that = this;
    that.setData({
      disabled:false,
      showPeriod: false,
      status:0,
      isFocus:true
    })
  },
  //获取分期月数的值
  getMonthText:function(e){
    var that = this
    var cashMsg = that.data.cashMsg
    cashMsg.cashBackPeriods = e.currentTarget.dataset.text
    that.setData({
      showPeriod: false,
      cashMsg: cashMsg,
      buttonText: '计算价格'
    })
  },
  //获取我想花输入框的值
  wantAmount:function(e){
    var that = this
    var cashMsg = that.data.cashMsg
    cashMsg.expectedAmount = e.detail.value
    that.setData({
      buttonText:'计算价格'
    })
  },
  //获取我要平台输入框的值
  needAmount: function (e) {
    var that = this
    var cashMsg = that.data.cashMsg
    cashMsg.expectedAmount = e.detail.value
    that.setData({
      status: 1,
      buttonText: '计算价格'
    })
  },
  //计算支付的金额
  compute:function(){
    var that = this
    app.Util.ajax('mall/freeShopping/request/calculate', {
      stockId: 3,
      // quantity: Number(that.data.goodsMsg.quantity),
      quantity: 2,
      expectedAmount: that.data.cashMsg.expectedAmount,
      cashBackPeriods: that.data.cashMsg.cashBackPeriods
    }, 'POST').then((res) => {
      if (res.data.messageCode == 'MSG_1001') {
        var cashBackDetails = res.data.content.cashBackDetails
        cashBackDetails.forEach((v,i)=>{
          v.cashBackDate = time.formatTimeTwo(v.cashBackDate, 'Y-M-D')
        })
        var interestDetails = res.data.content.interestDetails
        interestDetails.forEach((v, i) => {
          v.cashBackDate = time.formatTimeTwo(v.cashBackDate, 'Y-M-D')
        })      
        that.setData({
          payMsg: res.data.content
        })
      }
    })
  },
  //自定义输入点击计算
  addOrCompute:function(){
    var that = this
    if(that.data.buttonText === '加入购物车'){
      console.log('加入购物车')
    } else if (that.data.buttonText === '计算价格'){
      console.log('计算价格')
      app.Util.ajax('mall/freeShopping/request/calculate', {
        stockId: 3,
        // quantity: Number(that.data.goodsMsg.quantity),
        quantity: 2,
        expectedAmount: that.data.cashMsg.expectedAmount,
        cashBackPeriods: that.data.cashMsg.cashBackPeriods
      }, 'POST').then((res) => {
        if (res.data.messageCode == 'MSG_1001') {
          var cashBackDetails = res.data.content.cashBackDetails
          cashBackDetails.forEach((v, i) => {
            v.cashBackDate = time.formatTimeTwo(v.cashBackDate, 'Y-M-D')
          })
          var interestDetails = res.data.content.interestDetails
          interestDetails.forEach((v, i) => {
            v.cashBackDate = time.formatTimeTwo(v.cashBackDate, 'Y-M-D')
          })
          var cashMsg = that.data.cashMsg
          that.setData({
            cashMsg: cashMsg,
            payMsg: res.data.content,
            buttonText:'加入购物车'
          })
        } else if (res.data.messageCode == 'MSG_4001'){
          wx.showToast({
            title: res.data.message,
            icon:'none',
            duration:2000
          })
        }
      })
    }
  },
  //返现明细弹框(出现)
  returnDetail:function(){
    var that = this;
    that.setData({
      showDialog: true
    })
  },
  //返现明细弹框(隐藏)
  cancelDialog:function(){
    var that = this;
    that.setData({
      showDialog:false
    })
  },
  //利息明细弹框(出现)
  interestDetail: function () {
    var that = this;
    that.setData({
      showModal: true
    })
  },
   //利息明细弹框(隐藏)
  cancelModal:function() {
    var that = this;
    that.setData({
      showModal: false
    })
  },
  //可随时终止(出现)
  stopZero: function () {
    var that = this;
    if (that.data.status == 1) {
      that.setData({
        showStop: true
      })
    }
  },
  //可随时终止(隐藏)
  cancelStop: function () {
    var that = this;
    that.setData({
      showStop: false
    })
  },
  //怎么赚的钱(出现)
  payNum:function(){
    var that = this
    that.setData({
      showGet:true
    })
  },
  //怎么赚的钱(隐藏)
  cancelGet: function () {
    var that = this
    that.setData({
      showGet: false
    })
  },
  understand:function(){
    var that = this
    that.setData({
      showGet: false
    })
  },
  //阻止弹框之后的页面滑动问题
  preventTouchMove: function () {
    
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

  }
})