// pages/orderDetail/orderDetail.js
var time = require('../../utils/util.js');
var utils = require('../../utils/util.js');
let app = getApp();
var newCount = true //节流阀-限制购买提交次数
var interval = ''
var interval2 = ''
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showCashback:false,
    content: {}, //详情信息 
    orderId: 1, //订单id
    list: null, //物流信息
    logisticsDetailList: null, //是否显示几个包裹
    logisticsId: null, //物流id
    showDialog: false, //确认收货弹框
    showDialog1: false, //取消退款
    showDialog2: false, //退款
    refundorderId: 1, //退款id
    refund: ['质量问题', '长时间未发货', '我不想买了', '其他原因'], //退款申请理由
    current: 0, //获取退款理由
    reason: '质量问题',
    cancelOrder: ['我不想买了', '写错重拍', '卖家缺货', '其他原因'], //取消订单
    showDialog3: false, //取消订单弹框
    reason1: '我不想买了', //取消订单理由
    showDialog4: false, //终止0元购弹框
    waitPay: '',
    orderTimeRefundDetail: {}, //退款时间
    orderTimeDetail: [], //订单信息时间
    userInteractDetail: [], //商家回复
    autoProcessTime: '',
    showBox: false,
    seedDetailShow:false,
    newPeopleActivity:1, //新人专区跳转页面状态
    hostUrl: app.Util.getUrlImg().hostUrl,
    seedToast:false,
    notUsing:false,//成团待使用
  },
  goIntoProblem: function (e) {
    wx.navigateTo({
      url: '/packageA/pages/serviceProblem/serviceProblem',
    })
  },
  //跳转到分期返现明细
  periodCash: function(e) {
    var orderId = e.currentTarget.dataset.orderid
    var latestStatus = e.currentTarget.dataset.lateststatus
    var whetherAdvanceSale = e.currentTarget.dataset.whetheradvancesale
    var defaultAmountStatus = e.currentTarget.dataset.defaultamountstatus
    wx.navigateTo({
      url: `/pages/cashBack/cashBack?orderId=${orderId}&latestStatus=${latestStatus}&whetherAdvanceSale=${whetherAdvanceSale}&defaultAmountStatus=${defaultAmountStatus}`,
    })
  },
  //跳转到物流详情
  jumpLogDetail: function(e) {
    var that = this
    var orderId = e.currentTarget.dataset.orderid
    var logisticsId = e.currentTarget.dataset.logisticsid
    if (that.data.logisticsDetailList.length > 1) {
      wx.navigateTo({
        url: `/pages/logisticsDetail/logisticsDetail?orderId=${orderId}`,
      })
    } else if (that.data.logisticsDetailList.length === 1) {
      wx.navigateTo({
        url: `/pages/logistics/logistics?logisticsId=${logisticsId}`,
      })
    }
  },
  // 详情查看
  showDetails() {
    let that = this
    that.setData({
      showDetails: true
    })
  },
  cancelDetails() {
    let that = this
    that.setData({
      showDetails: false
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    var orderId = options.orderId
    clearInterval(interval2)
    clearInterval(interval)
    that.setData({
      orderId: orderId
    })
    //物流详情
    app.Util.ajax('mall/order/queryLogistics', {
      orderId: orderId
    }, 'GET').then((res) => { // 使用ajax函数
      if (res.data.messageCode == 'MSG_1001') {
        that.setData({
          list: res.data.content.logisticsDetailList.length > 0 ? (res.data.content.logisticsDetailList[0].logisticsDto.list.reverse())[0] : '',
          logisticsDetailList: res.data.content.logisticsDetailList,
          logisticsId: res.data.content.logisticsDetailList.length > 0 ? res.data.content.logisticsDetailList[0].id : ''
        })
      } else if (res.data.messageCode == 'MSG_5001') {
        that.setData({
          list: null,
          logisticsDetailList: null
        })
      }
    })
  },
  //退款倒计时
  formatDuring(mss) {
    var that = this
    const days = parseInt(mss / (1000 * 60 * 60 * 24)).toString()
    const hours = parseInt(mss / (1000 * 60 * 60 * 7)).toString()
    const minutes = parseInt((mss % (1000 * 60 * 60)) / (1000 * 60)).toString()
    const seconds = parseInt((mss % (1000 * 60)) / 1000).toString()
    that.setData({
      autoProcessTime: `超过${days}天${hours}小时${minutes}分钟${seconds}秒`
    })
  },

  //各种按钮
  //终止0元购按钮
  //终止0元购按钮
  stopZero: function(e) {
    var that = this
    if(e.currentTarget.dataset.isstop==2){
      console.log("已置灰")
    }else{
      app.Util.ajax('mall/order/queryStopApplyZeroPurchase', {
        orderId: e.currentTarget.dataset.orderid
      }, 'GET').then((res) => {
        if(res.data.messageCode=="MSG_1001"){
          that.setData({
            refundAmount: res.data.content.refundAmount,
            orderId: e.currentTarget.dataset.orderid,
            seedAmountTotal:res.data.content.seedAmountTotal,
            seedAmountConsume:res.data.content.seedAmountConsume,
            seedStatus:res.data.content.status,
            isStop:res.data.content.isStop
          })
          that.setData({
            seedToast: true
          })
        }else{
          wx.showToast({
            title:res.data.message,
            icon:"none"
          })
        }
      })
    }
  },
  wait: function(e) {
    var that = this
    that.setData({
      showDialog4: false
    })
  },
  comfireCancel: function(e) {
    var that = this
    if(newCount){
      newCount = false
      var latestStatus = e.currentTarget.dataset.lateststatus
      let whetherAdvanceSale = e.currentTarget.dataset.whetheradvancesale
      let isStop = that.data.isStop
      console.log('whetherAdvanceSale:'+whetherAdvanceSale)
      app.Util.ajax('mall/order/queryOrder', {
        orderId: that.data.orderId
      }, 'GET').then((res) => {
        if (!isStop) {
          //订单内有多个商品，进入返现明细
          wx.navigateTo({
            url: `/pages/cashBack/cashBack?orderId=${that.data.orderId}&latestStatus=${latestStatus}&whetherAdvanceSale=${whetherAdvanceSale}`
          })
          this.setData({
            seedToast:false
          })
        } else {
          //订单内只有单个商品，直接终止
          app.Util.ajax('mall/order/stopApplyZeroPurchase', {
            orderId: that.data.orderId
          }, 'POST').then((res) => {
            if (res.data.messageCode == "MSG_1001") {
              wx.showToast({
                title: '终止成功,钱款已进入余额,可随时体现哦!',
                icon: "none",
                during: 2000
              })
              this.setData({
                seedToast:false
              })
              setTimeout(function() {
                that.orderDetail();
              }, 2000) //延迟时间 这里是1秒
            } else {
              wx.showToast({
                title: '终止失败,请稍后再试',
                icon: 'none'
              })
            }
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
  //付款
  toPay: function(e) {
    var that = this
    var orderId = e.currentTarget.dataset.orderid
    var id = e.currentTarget.dataset.id
    var orderType = e.currentTarget.dataset.ordertype
    var advancesalestatus = e.currentTarget.dataset.advancesalestatus
    var defaultamountstatus =  e.currentTarget.dataset.defaultamountstatus
    that.setData({
      orderId:orderId,
      id:id,
      orderType:orderType
    })
    if(advancesalestatus==1&&defaultamountstatus==2){
      that.setData({
        payStatus:true
      })
    } else if (orderType == 23 || orderType == 24 || orderType == 26) {
      wx.navigateTo({
        url: `/pages/paymentorder/paymentorder?orderId=${orderId}&id=${id}&orderType=${orderType}&takeType=${1}`,
      })
    }else {
      wx.navigateTo({
        url: `/pages/paymentorder/paymentorder?orderId=${orderId}&id=${id}&orderType=${orderType}&orderSell=1`,
      })
    }
  },
  toPay2:function(){
    wx.navigateTo({
      url: '/pages/paymentorder/paymentorder?orderId='+this.data.orderId+'&id='+this.data.id+'&orderType='+this.data.orderType,
    })
    this.closePay()
  },
  closePay:function(){
    this.setData({
      payStatus:false
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
    wx.navigateTo({
      url: '/pages/goodsComment/goodsComment?orderid=' + e.currentTarget.dataset.orderid
    })
  },
  orderDetail: function() {
    var that = this
    app.Util.ajax('mall/order/queryOrder', {
      orderId: that.data.orderId
    }, 'GET').then((res) => {
      if (res.data.content) {
        if(res.data.content.orderGoodsDetail[0].cashBackType==2||res.data.content.orderGoodsDetail[0].cashBackType==1){
          that.setData({
            newPeopleActivity:2
          })
        }
        let lastTime = res.data.content.remainingTime / 1000
        let hourTime = parseInt(lastTime / 3600) < 10 ? '0' + parseInt(lastTime / 3600) : parseInt(lastTime / 3600)
        let minuteTime = parseInt((lastTime % 3600)/60) < 10 ? '0' + parseInt((lastTime % 3600)/60) : parseInt((lastTime % 3600)/60)
        let secondTime = parseInt(lastTime % 60) < 10 ? '0' + parseInt(lastTime % 60) : parseInt(lastTime % 60)
        this.setData({
          waitPay: `${hourTime}:${minuteTime}:${secondTime}`
        })
        if (lastTime > 0) {
           interval2 = setInterval(() => {
            if (lastTime > 0) {
              lastTime--
              let hourTime = parseInt(lastTime / 3600) < 10 ? '0' + parseInt(lastTime / 3600) : parseInt(lastTime / 3600)
              let minuteTime = parseInt((lastTime % 3600)/60) < 10 ? '0' + parseInt((lastTime % 3600)/60) : parseInt((lastTime % 3600)/60)
              let secondTime = parseInt(lastTime % 60) < 10 ? '0' + parseInt(lastTime % 60) : parseInt(lastTime % 60)
              this.setData({
                waitPay: `${hourTime}:${minuteTime}:${secondTime}`
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
        res.data.content.orderGoodsDetail.forEach((v, i) => {
          v.discountRatio = v.discountRatio / 10
          if (v.purchaseTotalPrice && res.data.content.orderSource !== 2) {
            v.payAmount1 = Number((v.payAmount + v.expressFee ).toFixed(2))
            v.discountPrice = Number((v.purchaseTotalPrice - v.payAmount).toFixed(2))
          } else {
            v.payAmount1 = Number((res.data.content.expectAmount + v.expressFee).toFixed(2))
          }
        })
        for (var i = 0; i < res.data.content.orderTimeDetail.length; i++) {
          res.data.content.orderTimeDetail[i].statusTime = time.formatTimeTwo(res.data.content.orderTimeDetail[i].statusTime, 'Y-M-D h:m:s')
      
        }
        if (res.data.content.orderTimeRefundDetail.length > 0) {
          for (var i = 0; i < res.data.content.orderTimeRefundDetail.length; i++) {
            if (res.data.content.latestStatus == 7 || res.data.content.latestStatus == 8) {
              if (res.data.content.orderTimeRefundDetail[i].status == 7 || res.data.content.orderTimeRefundDetail[i].status == 8) {
                let current = res.data.content.orderTimeRefundDetail[i].autoProcessTime
                that.formatDuring(current)
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
        var orderTimeDetail = res.data.content.orderTimeDetail.reverse()
        orderTimeDetail.forEach((v, i) => {
          if (v.status == 4) {
            orderTimeDetail[2].show = true
          }
        })
        let stagesTemp = []
        if(res.data.content.installmentPaymentDetail){
          stagesTemp = res.data.content.installmentPaymentDetail
          for (let i of stagesTemp) {
            i.payTime = utils.formatTimeTwo(i.payTime, 'Y-M-D');
          }
        }
        console.log("11"+stagesTemp)
        that.setData({
          content: res.data.content,
          orderTimeDetail: orderTimeDetail,
          orderTimeRefundDetail: (res.data.content.orderTimeRefundDetail).reverse(),
          installmentPaymentDetail:stagesTemp
        })
      }
    })
    //物流详情
    app.Util.ajax('mall/order/queryLogistics', {
      orderId: that.data.orderId
    }, 'GET').then((res) => { // 使用ajax函数
      if (res.data.messageCode == 'MSG_1001') {
        that.setData({
          list: res.data.content.logisticsDetailList.length > 0 ? (res.data.content.logisticsDetailList[0].logisticsDto.list.reverse())[0] : '',
          logisticsDetailList: res.data.content.logisticsDetailList,
          logisticsId: res.data.content.logisticsDetailList.length > 0 ? res.data.content.logisticsDetailList[0].id : ''
        })
      } else if (res.data.messageCode == 'MSG_5001') {
        that.setData({
          list: null,
          logisticsDetailList: null
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
    var that = this 
    clearInterval(interval2)
    app.Util.ajax('mall/order/queryOrder', {
      orderId: that.data.orderId
    }, 'GET').then((res) => { // 使用ajax函数
      if (res.data.content) {
        if(res.data.content.orderGoodsDetail[0].cashBackType==2||res.data.content.orderGoodsDetail[0].cashBackType==1){
          that.setData({
            newPeopleActivity:2
          })
        }
        let lastTime = res.data.content.remainingTime / 1000
        let hourTime = parseInt(lastTime / 3600) < 10 ? '0' + parseInt(lastTime / 3600) : parseInt(lastTime / 3600)
        let minuteTime = parseInt((lastTime % 3600)/60) < 10 ? '0' + parseInt((lastTime % 3600)/60) : parseInt((lastTime % 3600)/60)
        let secondTime = parseInt(lastTime % 60) < 10 ? '0' + parseInt(lastTime % 60) : parseInt(lastTime % 60)
        this.setData({
          waitPay: `${hourTime}:${minuteTime}:${secondTime}`
        })
        if (lastTime > 0) {
           interval2 = setInterval(() => {
            if (lastTime > 0) {
              lastTime--
              let hourTime = parseInt(lastTime / 3600) < 10 ? '0' + parseInt(lastTime / 3600) : parseInt(lastTime / 3600)
              let minuteTime = parseInt((lastTime % 3600)/60) < 10 ? '0' + parseInt((lastTime % 3600)/60) : parseInt((lastTime % 3600)/60)
              let secondTime = parseInt(lastTime % 60) < 10 ? '0' + parseInt(lastTime % 60) : parseInt(lastTime % 60)
              this.setData({
                waitPay: `${hourTime}:${minuteTime}:${secondTime}`
              })
            } else {
              clearInterval(interval2)
              let pages = getCurrentPages()
              if (pages[pages.length - 1].route == 'pages/paymentorder/paymentorder' || pages[pages.length - 1].route == 'pages/orderDetail/orderDetail') {
                wx.navigateTo({
                  url: `/pages/myorder/myorder?status=${1}`
                })
              }
              this.setData({
                waitPay: ''
              })
            }
          }, 1000)
        }
        res.data.content.orderGoodsDetail.forEach((v, i) => {
          v.discountRatio = v.discountRatio / 10
          if (v.purchaseTotalPrice && res.data.content.orderSource !== 2) {
            v.payAmount1 = Number((v.payAmount + v.expressFee).toFixed(2))
            v.discountPrice = Number((v.purchaseTotalPrice - v.payAmount).toFixed(2))
          } else {
            v.payAmount1 = Number((res.data.content.expectAmount + v.expressFee).toFixed(2))
          }
        })
        for (var i = 0; i < res.data.content.orderTimeDetail.length; i++) {
          res.data.content.orderTimeDetail[i].statusTime = time.formatTimeTwo(res.data.content.orderTimeDetail[i].statusTime, 'Y-M-D h :m :s');
        }
        if (res.data.content.orderTimeRefundDetail.length > 0) {
          for (var i = 0; i < res.data.content.orderTimeRefundDetail.length; i++) {
            if (res.data.content.latestStatus == 7 || res.data.content.latestStatus == 8) {
              if (res.data.content.orderTimeRefundDetail[i].status == 7 || res.data.content.orderTimeRefundDetail[i].status == 8) {
                let current = res.data.content.orderTimeRefundDetail[i].autoProcessTime
                that.formatDuring(current)
                 interval = setInterval(() => {
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
        var orderTimeDetail = res.data.content.orderTimeDetail.reverse()
        orderTimeDetail.forEach((v, i) => {
          if (v.status == 4) {
            orderTimeDetail[2].show = true
          }
        })
        let stagesTemp = []
        if(res.data.content.installmentPaymentDetail){
          stagesTemp = res.data.content.installmentPaymentDetail
          for (let i of stagesTemp) {
            i.payTime = utils.formatTimeTwo(i.payTime, 'Y-M-D');
          }
        }
        that.setData({
          content: res.data.content,
          orderTimeDetail: orderTimeDetail,
          orderTimeRefundDetail: (res.data.content.orderTimeRefundDetail).reverse(),
          installmentPaymentDetail:stagesTemp
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    clearInterval(interval2)
    clearInterval(interval)
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    wx.removeStorageSync('type')
    clearInterval(interval2)
    clearInterval(interval)
    clearInterval(interval2)
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

  },
  //显示弹窗
  showBox: function() {
    this.setData({
      showBox: true
    })
  },
  //隐藏弹窗
  cancelBox: function() {
    this.setData({
      showBox: false
    })
  },
  toReturnMoney:function(e){
    wx.setStorageSync("goodsList",e.currentTarget.dataset.goodsdetail)
    if(e.currentTarget.dataset.index==1){
        wx.navigateTo({
          url:"/packageA/pages/returnMoney/returnMoney"
        })
    }else{
      wx.navigateTo({
        url:"/packageA/pages/dealWithReturn/dealWithReturn"
      })
    }
  },
  seedDetail:function(){
    this.setData({
      seedDetailShow:true
    })
  },
  seedDetailShowClose:function(){
    this.setData({
      seedDetailShow:false
    })
  },
  //跳转商品详情
  toGoodsDetail:function(e){
    let goodsId = e.currentTarget.dataset.goodsid
    let orderType = e.currentTarget.dataset.ordertype
    if (orderType == 23 || orderType == 24 || orderType == 26){
      return;
    }else{
      wx.navigateTo({
        url: "/pages/detail/detail?id=" + goodsId
      })
    }
  },
  cancle:function(){
    this.setData({
      seedToast:false
    })
  },
  toSeed:function(){
    wx.navigateTo({
      url:"/packageA/pages/seed/seed"
    })
    this.setData({
      seedToast:false
    })
  },
  // 成团待使用弹窗
  cancelNotUsing(){
    let that = this
    that.setData({
      notUsing:false
    })
  }
})