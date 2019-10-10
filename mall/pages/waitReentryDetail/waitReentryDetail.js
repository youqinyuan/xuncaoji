// pages/waitReentryDetail/waitReentryDetail.js
const app = getApp()
var utils = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showCause: false,
    causeValue1: {
      text1: '当前商品发生退款，系统已自动终止剩余返现，取消退款或退款失败系统将继续返现，返现详细信息请前往“我的订单”页面查看。',
      text2: '如有疑问请联系平台客服。'
    },
    causeValue2: {
      text1: '当前商品您已终止与平台的“0元购”合约，系统已自动终止剩余返现，返现详细信息请前往“我的订单”页面查看。',
      text2: '如有疑问请联系平台客服。'
    },
    //返现原因分类
    causeStatue: 1,
    //订单终止颜色终止stopOrderStatus=1
    stopOrderStatus: 2,
    text:'',
    stopOrder: 'stopOrder',
    pageNumber: 1,
    pageSize: 10
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    that.initDetail();
  },
  initDetail: function(e) {
    var that = this
    var pageNumber = that.data.pageNumber
    var pageSize = that.data.pageSize
    app.Util.ajax('mall/personal/balanceDetails', {
      pageNumber: pageNumber,
      pageSize: pageSize,
      status: 1
    }, 'GET').then((res) => {
      if (res.data.content.noReturnItem) {
        var arr = res.data.content.noReturnItem.items
        console.log("待返现明细："+JSON.stringify(arr))
        for (let i of arr) {
          i.tradeTime = utils.formatTimeTwo(i.tradeTime, 'Y-M-D h:m:s');
        }
        that.setData({
          content: arr
        })
      }
    })
  },
  getInitDetail: function() {
    var that = this
    var pageNumber = that.data.pageNumber + 1
    //销量排行榜
    app.Util.ajax('mall/personal/balanceDetails', {
      pageNumber: pageNumber,
      pageSize: that.data.pageSize,
      status: 1
    }, 'GET').then((res) => { // 使用ajax函数
      if (res.data.content) {
        if (res.data.content.noReturnItem.items == '' && that.data.content !== '') {
          that.setData({
            text: '已经到底啦'
          })
        }
        var arr = that.data.content
        for (var i = 0; i < res.data.content.noReturnItem.items.length; i++) {
          res.data.content.noReturnItem.items[i].tradeTime = utils.formatTimeTwo(res.data.content.noReturnItem.items[i].tradeTime, 'Y-M-D h:m:s');
          arr.push(res.data.content.noReturnItem.items[i])
        }
        that.setData({
          content: arr,
          pageNumber: pageNumber
        })
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
    var that = this;
    that.setData({
      pageNumber: 1
    })
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
    var that = this
    that.getInitDetail();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  //查看原因弹窗隐藏
  cancelCause: function() {
    this.setData({
      showCause: false
    })
  },
  //查看原因弹窗显示
  showCause: function(e) {
    console.log(e.currentTarget.dataset.type)
    if (e.currentTarget.dataset.type == 1) {
      this.setData({
        causeStatue: 1
      })
    } else {
      this.setData({
        causeStatue: 2
      })
    }
    this.setData({
      showCause: true
    })
  }
})