// pages/cashBack/cashBack.js
var time = require('../../utils/util.js');
let app = getApp()
var newCount = true //节流阀-限制购买提交次数
Page({

  /**
   * 页面的初始数据
   */
  data: {
    from: null,
    return_one: null,
    return_two: null,
    return_three: "",
    content: {},
    latestStatus: 1,
    options: {},
    showDialog4: false,
    orderId: 1,
    orderGoodsId: 0,
    newPeopleActivity:1,//新人专区跳转页面状态
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    var latestStatus = options.latestStatus //订单状态
    var orderId = parseInt(options.orderId)
    if(options.whetherAdvanceSale){
      that.setData({
        whetherAdvanceSale:options.whetherAdvanceSale,
        defaultAmountStatus:options.defaultAmountStatus
      })
    }
    if(options.proStatus){
      that.setData({
        proStatus:parseInt(options.proStatus)
      })
    }
      if (options.from) {
        console.log("aa"+options.from,options.orderId,options.orderGoodsId,options.transferId)
       that.setData({
         return_one: options.orderId,
         return_two: options.orderGoodsId,
         return_three: options.transferId,
         from: options.from,
       })
       that.init2()
     } else {
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
     }
    
  },
  init: function () {
    var that = this
    app.Util.ajax('mall/order/queryOrderCashBack', {
      orderId: that.data.orderId
    }, 'GET').then((res) => { // 使用ajax函数
      // console.log("返现明细："+JSON.stringify(res))
      if (res.data.content) {
        for (var i = 0; i < res.data.content.length; i++) {
          for (var j = 0; j < res.data.content[i].orderGoodsCashBackItem.length; j++) {
            res.data.content[i].orderGoodsCashBackItem[j].returnTime = time.formatTimeTwo(res.data.content[i].orderGoodsCashBackItem[j].returnTime, 'Y-M-D');
          }
          for (var a = 0; a < res.data.content[i].orderGoodsStageInterestItem.length; a++) {
            res.data.content[i].orderGoodsStageInterestItem[a].returnTime = time.formatTimeTwo(res.data.content[i].orderGoodsStageInterestItem[a].returnTime, 'Y-M-D');
          }
        }
        // console.log("bb"+JSON.stringify(res.data.content))
        if(res.data.content[0].cashBackType==2){
          that.setData({
            newPeopleActivity:2
          })
        }
        that.setData({
          content2: res.data.content,
          latestStatus: parseInt(that.data.latestStatus)
        })
        // console.log(that.data.latestStatus)
      }
    })
  },
  init2: function () {
    var that = this
    console.log("aaa"+that.data.return_three)
    app.Util.ajax('mall/transfer/queryCashBackDetail', {
      orderId: that.data.return_one,
      orderGoodsId: that.data.return_two,
      transferId:that.data.return_three, 
    }, 'GET').then((res) => { // 使用ajax函数
      if (res.data.content) {
        if(res.data.content.cashBackType==2){
          that.setData({
            newPeopleActivity:2
          })
        }
        that.setData({
          from: that.data.from,
          content: res.data.content
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

  },
  stopZero: function (e) {
    var that = this
    app.Util.ajax('mall/order/queryStopApplyZeroPurchase', {
      orderId: that.data.orderId,
      orderGoodsId: e.currentTarget.dataset.ordergoodsid
    }, 'GET').then((res) => {
      if(res.data.messageCode=="MSG_1001"){
        console.log(111111)
        that.setData({
          refundAmount: res.data.content.refundAmount,
          orderId: that.data.orderId,
          orderGoodsId: e.currentTarget.dataset.ordergoodsid
        })
        that.setData({
          showDialog4: true
        })
      }else{
        wx.showToast({
          title:res.data.message,
          icon:"none"
        })
      }

    })
  },
  wait: function (e) {
    var that = this
    that.setData({
      showDialog4: false
    })
  },
  comfireCancel: function (e) {
    var that = this
    if(newCount){
      newCount = false
      app.Util.ajax('mall/order/stopApplyZeroPurchase', {
        orderId: e.currentTarget.dataset.orderid,
        orderGoodsId: that.data.orderGoodsId
      }, 'POST').then((res) => {
        if (res.data.messageCode == "MSG_1001") {
          wx.showToast({
            title: '终止成功,钱款已进入余额,可随时体现哦!',
            icon: "none",
            during: 2000
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
    }
    setTimeout(function(){
      newCount=true
    },2000)
  },
})