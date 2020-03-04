// pages/dealWithReturn/dealWithReturn.js
const app = getApp()
var utils = require('../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show1: false,
    show2: false,
    show3:false,
    hostUrl: app.Util.getUrlImg().hostUrl,

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    if(options.goodsId){
      app.Util.ajax('mall/orderRefund/queryRefundOrder', {
        orderGoodsId: options.goodsId
      }, 'GET').then((res) => {
        console.log(res.data.content.orderGoodsApplyRefund)
        res.data.content.orderGoodsApplyRefund.createTime = utils.formatTimeTwo(res.data.content.orderGoodsApplyRefund.createTime, 'Y-M-D h:m:s');
        res.data.content.orderGoodsApplyRefund.operateTime = utils.formatTimeTwo(res.data.content.orderGoodsApplyRefund.operateTime, 'Y-M-D h:m:s');
        if(res.data.content.orderGoodsApplyRefund.status==6){
          wx.setNavigationBarTitle({
            title: "退款取消"
          })
        }else if(res.data.content.orderGoodsApplyRefund.status==5){
          wx.setNavigationBarTitle({
            title: "退款成功"
          })
        }else if(res.data.content.orderGoodsApplyRefund.status==4){
          wx.setNavigationBarTitle({
            title: "退款失败"
          })
        }else if(res.data.content.orderGoodsApplyRefund.status==3){
          wx.setNavigationBarTitle({
            title: "退款中"
          })
        }else if(res.data.content.orderGoodsApplyRefund.status==2){
          res.data.content.orderGoodsApplyRefund.trackingNumber = ''
          res.data.content.orderGoodsApplyRefund.logisticsName = ''
          wx.setNavigationBarTitle({
            title: "退款中"
          })
        }else if(res.data.content.orderGoodsApplyRefund.status==1){
          wx.setNavigationBarTitle({
            title: "退款中"
          })
        }
        that.setData({
          allContent:res.data.content,
          orderGoodsApplyRefund: res.data.content.orderGoodsApplyRefund,
          companyName:res.data.content.orderGoodsApplyRefund.logisticsName
        })
        var current = res.data.content.orderGoodsApplyRefund.autoTime
        that.formatDuring(current)
        let interval2 = setInterval(() => {
          if (current > 0) {
            current -= 1000
            that.formatDuring(current)
          } else {
            clearInterval(interval2)
            that.setData({
              day: '00',
              hours1: '00', //小时
              hours: "00",
              minutes: '00', //分钟
              seconds: '00' //秒
            })
          }
        }, 1000)
      })
    //可用物流获取
    app.Util.ajax('mall/orderRefund/getLogisticsCompanyList', null, 'GET').then((res) => {
      if (res.data.messageCode == "MSG_1001") {
        that.setData({
          LogisticsCompanyList:res.data.content
        })
      }
    })
    }else{
      if (wx.getStorageSync("goodsList")) {
        var arr = wx.getStorageSync("goodsList")
        that.setData({
          goodsDetail: arr
        })
      }
      that.init()
    }
  },
  init: function () {
    var that = this
    app.Util.ajax('mall/orderRefund/queryRefundOrder', {
      orderGoodsId: that.data.goodsDetail.id
    }, 'GET').then((res) => {
      console.log(res.data.content.orderGoodsApplyRefund)
      res.data.content.orderGoodsApplyRefund.createTime = utils.formatTimeTwo(res.data.content.orderGoodsApplyRefund.createTime, 'Y-M-D h:m:s');
      res.data.content.orderGoodsApplyRefund.operateTime = utils.formatTimeTwo(res.data.content.orderGoodsApplyRefund.operateTime, 'Y-M-D h:m:s');
      if(res.data.content.orderGoodsApplyRefund.status==6){
        wx.setNavigationBarTitle({
          title: "退款取消"
        })
      }else if(res.data.content.orderGoodsApplyRefund.status==5){
        wx.setNavigationBarTitle({
          title: "退款成功"
        })
      }else if(res.data.content.orderGoodsApplyRefund.status==4){
        wx.setNavigationBarTitle({
          title: "退款失败"
        })
      }else if(res.data.content.orderGoodsApplyRefund.status==3){
        wx.setNavigationBarTitle({
          title: "退款中"
        })
      }else if(res.data.content.orderGoodsApplyRefund.status==2){
        res.data.content.orderGoodsApplyRefund.trackingNumber = ''
        res.data.content.orderGoodsApplyRefund.logisticsName = ''
        wx.setNavigationBarTitle({
          title: "退款中"
        })
      }else if(res.data.content.orderGoodsApplyRefund.status==1){
        wx.setNavigationBarTitle({
          title: "退款中"
        })
      }
      that.setData({
        allContent:res.data.content,
        orderGoodsApplyRefund: res.data.content.orderGoodsApplyRefund,
        companyName:res.data.content.orderGoodsApplyRefund.logisticsName
      })
      var current = res.data.content.orderGoodsApplyRefund.autoTime
      console.log(res.data.content.orderGoodsApplyRefund.autoTime)
      that.formatDuring(current)
      let interval2 = setInterval(() => {
        if (current > 0) {
          current -= 1000
          that.formatDuring(current)
        } else {
          clearInterval(interval2)
          that.setData({
            day: 0,
            hours1: 1, //小时
          })
        }
      }, 1000)
    })
    //可用物流获取
    app.Util.ajax('mall/orderRefund/getLogisticsCompanyList', null, 'GET').then((res) => {
      if (res.data.messageCode == "MSG_1001") {
        that.setData({
          LogisticsCompanyList:res.data.content
        })
      }
    })
  },
  formatDuring(mss) {
    var that = this
    const hours = parseInt(mss /3600000).toString()
    const minutes = parseInt((mss % (1000 * 60 * 60)) / (1000 * 60)).toString() >= 10 ? parseInt((mss % (1000 * 60 * 60)) / (1000 * 60)).toString() : '0' + parseInt((mss % (1000 * 60 * 60)) / (1000 * 60)).toString()
    const seconds = parseInt((mss % (1000 * 60)) / 1000).toString() >= 10 ? parseInt((mss % (1000 * 60)) / 1000).toString() : '0' + parseInt((mss % (1000 * 60)) / 1000).toString()
    const day = parseInt(hours / 24)
    const hours1 = parseInt(hours % 24)
    that.setData({
      day: day,
      hours: hours,
      hours1: hours1,
      minutes: minutes,
      seconds: seconds
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
  cancle: function () {
    var that = this
    console.log("取消申请")
    app.Util.ajax('mall/orderRefund/cancelRefund', {
      refundId: that.data.orderGoodsApplyRefund.id
    }, 'POST').then((res) => {
      if (res.data.messageCode == "MSG_1001") {
        wx.navigateBack()
      }
    })
  },
  cancle1: function () {
    console.log("取消申请")
    var that = this
    that.setData({
      show1: false
    })
  },
  cancle2: function () {
    console.log("取消申请")
    var that = this
    that.setData({
      show2: false
    })
  },
  show1: function () {
    var that = this
    that.setData({
      show1: true
    })
  },
  show2: function () {
    var that = this
    that.setData({
      show2: true
    })
  },
  shenqingAgain: function () {
    var that =this
    wx.setStorageSync("goodsList",that.data.allContent)
    wx.redirectTo({
      url: "/packageA/pages/returnMoney/returnMoney"
    })
  },
  write:function(){
    var that = this
    that.show2()
  },
  show3:function(){
    var that =this
    console.log(111111)
    if(that.data.show3==true){
      console.log(222)
      that.setData({
        show3:false
      })
    }else{
      console.log(333)
      that.setData({
        show3:true
      })
    }
  },
  chooseLogistics:function(e){
    var that =this
    console.log(e.currentTarget.dataset.id,e.currentTarget.dataset.name)
    that.setData({
      logisticsId:e.currentTarget.dataset.id,
      companyName:e.currentTarget.dataset.name,
      show3:false
    })
  },
  setSetLogisticsNumber:function(e){
    var that =this
    that.setData({
      trackingNumber:e.detail.value
    })

  },
  setLogistics:function(){
    var that =this
    app.Util.ajax('mall/orderRefund/addOrUpdateLogistics', {
      refundId: that.data.orderGoodsApplyRefund.id,
      logisticsId:that.data.logisticsId?that.data.logisticsId:that.data.orderGoodsApplyRefund.logisticsId,
      trackingNumber:that.data.trackingNumber?that.data.trackingNumber:that.data.orderGoodsApplyRefund.trackingNumber
    }, 'POST').then((res) => {
      if (res.data.messageCode == "MSG_1001") {
        wx.navigateBack()
      }
    })
  }
})