// pages/orderDetail/orderDetail.js
var time = require('../../utils/util.js');
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    content: {}, //详情信息 
    orderId: 1, //订单id
    list: {}, //物流信息
    showDialog: false, //确认收货弹框
    showDialog1: false, //取消退款
    showDialog2: false, //退款
    refundorderId: 1, //退款id
    refund: ['质量问题', '长时间未发货', '我不想买了', '其他原因'], //退款申请理由
    current: 0, //获取退款理由
    reason: '质量问题',
    cancelOrder: ['我不想买了', '填写错误,重拍', '卖家缺货', '其他原因'], //取消订单
    showDialog3: false, //取消订单弹框
    reason1: '我不想买了', //取消订单理由
    showDialog4: false, //去评价弹框
    noteMaxLen: 100, //详细评价的字数限制
    currentNoteLen: 0, //输入的字数
    evaluate: '', //文本框的值
    one_2: 5,//实心星星
    two_2: 0,//空心星星
    waitPay: '',
    orderTimeRefundDetail: {}, //退款时间
    orderTimeDetail: [], //订单信息时间
    userInteractDetail: [], //商家回复
    autoProcessTime: '',
  },
  //跳转到分期返现明细
  periodCash: function(e) {
    console.log(e)
    var orderId = e.currentTarget.dataset.orderid
    var latestStatus = e.currentTarget.dataset.lateststatus
    wx.navigateTo({
      url: `/pages/cashBack/cashBack?orderId=${orderId}&latestStatus=${latestStatus}`,
    })
  },
  //跳转到物流详情
  jumpLogistics: function(e) {
    var orderId = e.currentTarget.dataset.orderid
    wx.navigateTo({
      url: `/pages/logistics/logistics?orderId=${orderId}`,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    var orderId = options.orderId
    that.setData({
      orderId: orderId
    })
    app.Util.ajax('mall/order/queryOrder', {
      orderId: orderId
    }, 'GET').then((res) => { // 使用ajax函数
      if (res.data.content) {
        let lastTime = res.data.content.remainingTime / 1000
        // let lastTime = 10
        if (lastTime>0){
         let interval2 = setInterval(() => {
           if (lastTime > 0) {
             lastTime--
             let minuteTime = parseInt(lastTime / 60) < 10 ? '0' + parseInt(lastTime / 60) : parseInt(lastTime / 60)
             let secondTime = parseInt(lastTime % 60) < 10 ? '0' + parseInt(lastTime % 60) : parseInt(lastTime % 60)
             this.setData({
               waitPay: `${minuteTime}:${secondTime}`
             })
           } else {
             clearInterval(interval2)
             wx.navigateBack({
               url: `/pages/myorder/myorder?status=${1}`
             })
             this.setData({
               waitPay: ''
             })
           }
         }, 1000)
        }
        for (var i = 0; i < res.data.content.orderTimeDetail.length; i++) {
          res.data.content.orderTimeDetail[i].statusTime = time.formatTimeTwo(res.data.content.orderTimeDetail[i].statusTime, 'Y-M-D h:m:s');
        }
        if (res.data.content.orderTimeRefundDetail.length > 0) { 
          for (var i = 0; i < res.data.content.orderTimeRefundDetail.length; i++) {
            if (res.data.content.latestStatus == 7 || res.data.content.latestStatus == 8) {
              if (res.data.content.orderTimeRefundDetail[i].status == 7 || res.data.content.orderTimeRefundDetail[i].status == 8){
                let current = res.data.content.orderTimeRefundDetail[i].autoProcessTime
                let interval = setInterval(() => {
                  if (current > 0) {
                    current -= 1000
                    that.formatDuring(current)
                  } else {
                    clearInterval(interval)
                    this.setData({
                      autoProcessTime: ''
                    })
                  }
                }, 1000)
              }
          }
            res.data.content.orderTimeRefundDetail[i].statusTime = time.formatTimeTwo(res.data.content.orderTimeRefundDetail[i].statusTime, 'Y-M-D h:m:s');
          }
        }
        that.setData({
          content: res.data.content,
          orderTimeDetail: (res.data.content.orderTimeDetail).reverse(),
          orderTimeRefundDetail: (res.data.content.orderTimeRefundDetail).reverse(),
          list: res.data.content.orderLogisticsDetail && res.data.content.orderLogisticsDetail.logisticsDto ? (res.data.content.orderLogisticsDetail.logisticsDto.list.reverse())[0] : '',
        })

      }
    })
  },
  //退款倒计时
  formatDuring(mss) {
    var that = this
    const days = parseInt(mss / (1000 * 60 * 60 * 24)).toString()
    const hours = parseInt(mss / (1000 * 60 * 60 *7)).toString()
    const minutes = parseInt((mss % (1000 * 60 * 60)) / (1000 * 60)).toString()
    const seconds = parseInt((mss % (1000 * 60)) / 1000).toString()
    that.setData({
      autoProcessTime: `超过${days}天${hours}小时${minutes}分钟${seconds}秒`
    })
  },
  //各种按钮
  //付款
  toPay: function(e) {
    var orderId = e.currentTarget.dataset.orderid
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/paymentorder/paymentorder?orderId=${orderId}&id=${id}`,
    })
  },
  //确认收货
  confirmReceipt: function(e) {
    var that = this
    that.setData({
      showDialog: true,
      refundorderId: e.currentTarget.dataset.orderid
    })
  },
  //取消收货
  cancel: function() {
    var that = this
    that.setData({
      showDialog: false
    })
  },
  //确认收货
  allow: function(e) {
    var that = this
    var orderId = that.data.refundorderId
    console.log(orderId)
    app.Util.ajax('mall/order/confirmReceipt', {
      orderId: orderId
    }, 'POST').then((res) => { // 使用ajax函数
      if (res.data.content) {
        that.setData({
          showDialog: false
        })
        wx.navigateBack({
          url: `/pages/myorder/myorder?status=${5}`,
        })
      } else {
        wx.showToast({
          title: res.data.message,
          icon: 'none'
        })
      }
    })
  },
  //取消退款
  cancelRefund: function(e) {
    var that = this
    that.setData({
      showDialog1: true,
      refundorderId: e.currentTarget.dataset.orderid
    })
  },
  //取消
  cancelrefund: function() {
    var that = this
    that.setData({
      showDialog1: false
    })
  },
  //确定
  surerefund: function(e) {
    var that = this
    var orderId = that.data.refundorderId
    app.Util.ajax('mall/order/cancelRefund', {
      orderId: orderId
    }, 'POST').then((res) => { // 使用ajax函数
      if (res.data.content) {
        that.setData({
          showDialog1: false
        })
        wx.navigateBack({
          url: `/pages/myorder/myorder?status=${0}`
        })
      } else {
        wx.showToast({
          title: res.data.message,
          icon: 'none'
        })
      }
    })
  },
  //退款
  refund: function(e) {
    var that = this
    that.setData({
      showDialog2: true,
      refundorderId: e.currentTarget.dataset.orderid
    })
  },
  //取消
  refundDialog: function() {
    var that = this
    that.setData({
      showDialog2: false
    })
  },
  //申请退款
  application: function(e) {
    var that = this
    var orderId = that.data.refundorderId
    var desc = that.data.reason
    app.Util.ajax('mall/order/applyRefund', {
      orderId: orderId,
      desc: desc
    }, 'POST').then((res) => { // 使用ajax函数
      if (res.data.content) {
        that.setData({
          showDialog2: false
        })
        wx.navigateBack({
          url: `/pages/myorder/myorder?status=${0}`
        })
      } else {
        wx.showToast({
          title: res.data.message,
          icon: 'none'
        })
      }
    })
  },
  //获取退款理由
  getText: function(e) {
    var that = this
    var current = e.currentTarget.dataset.current
    var reason = e.currentTarget.dataset.text
    that.setData({
      current: current,
      reason: reason
    })
  },
  //取消订单
  cancelOrder: function(e) {
    var that = this
    that.setData({
      showDialog3: true,
      refundorderId: e.currentTarget.dataset.orderid
    })
  },
  //取消
  cancelorder: function() {
    var that = this
    that.setData({
      showDialog3: false
    })
  },
  //确定
  sureorder: function(e) {
    var that = this
    var orderId = that.data.refundorderId
    var desc = that.data.reason1
    app.Util.ajax('mall/order/cancelOrder', {
      orderId: orderId,
      desc: desc
    }, 'POST').then((res) => { // 使用ajax函数
      if (res.data.content) {
        that.setData({
          showDialog3: false
        })
        wx.navigateBack({
          url: `/pages/myorder/myorder?status=${0}`
        })
      } else {
        wx.showToast({
          title: res.data.message,
          icon: 'none'
        })
      }
    })
  },
  //获取退款理由
  getText1: function(e) {
    var that = this
    var current = e.currentTarget.dataset.current
    var reason = e.currentTarget.dataset.text
    that.setData({
      current: current,
      reason1: reason
    })
  },
  //去评价
  toEvaluate: function(e) {
    var that = this
    that.setData({
      showDialog4: true,
      multiShow: false,
      refundorderId: e.currentTarget.dataset.orderid
    })
  },
  //获取文本框的长度
  input(e) {
    var value = e.detail.value,
      len = parseInt(value.length);
    let that = this;
    that.setData({
      currentNoteLen: len,
      evaluate: value
    })
  },
  //用户给评分
  in_xin: function(e) {
    var in_xin = e.currentTarget.dataset.in;
    var one_2;
    if (in_xin === 'use_sc2') {
      one_2 = Number(e.currentTarget.id);
    } else {
      one_2 = Number(e.currentTarget.id) + this.data.one_2;
    }
    this.setData({
      one_2: one_2,
      two_2: 5 - one_2
    })
    console.log(this.data.one_2)
  },
  //取消
  cancelEvaluate: function() {
    var that = this
    that.setData({
      showDialog4: false,
      one_2: 5,//实心星星
      two_2: 0,//空心星星
      evaluate: ''
    })
  },
  //确定
  sureEvaluate: function() {
    var that = this
    var orderId = that.data.refundorderId
    var score = that.data.one_2
    var content = that.data.evaluate
    if (score == '') {
      wx.showToast({
        title: '请对商品进行评分',
        icon: 'none'
      })
    } else {
      app.Util.ajax('mall/interact/addUserInteract', {
        orderId: orderId,
        score: score,
        action: 1,
        content: content
      }, 'POST').then((res) => {
        if (res.data.content) {
          that.setData({
            showDialog4: false,
            one_2: 5,//实心星星
            two_2: 0,//空心星星
            evaluate: ''
          })

        } else {
          wx.showToast({
            title: res.data.message,
            icon: 'none'
          })
        }
      })
    }
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
    // wx.reLaunch({
    //   url: `/pages/myorder/myorder?status=${0}`
    // })
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})