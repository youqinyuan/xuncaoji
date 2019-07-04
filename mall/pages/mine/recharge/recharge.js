// pages/mine/recharge/recharge.js
let app = getApp()
Page({
  data: {
    showModal: false, //充值
    showMessage: false, //错误充值提示
    showMessage1: false, //提现错误提示
    show: false, //提现
    pageNumber: 1,
    pageSize: 6,
    content: {},
    inputValue: '',
  },
  onLoad: function(options) {
    var that = this
    that.getMessage()
  },
  getMessage:function(){
    var that = this
    var pageNumber = that.data.pageNumber
    var pageSize = that.data.pageSize
    app.Util.ajax('mall/personal/balanceDetails', {
      pageNumber: pageNumber,
      pageSize: pageSize,
      status: 1
    }, 'GET').then((res) => {
      if (res.data.content) {
        that.setData({
          content: res.data.content
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
   * 跳转到余额明细页面
   */
  accountDetail: function() {
    wx.navigateTo({
      url: '/pages/mine/recharge/details/details'
    })
  },
  // 充值
  showRecharge: function() {
    var that = this;
    that.setData({
      showModal: true
    })
  },
  //隐藏充值模态框
  hideModal: function() {
    var that = this;
    that.setData({
      showModal: false,
      inputValue:''
    });
  },
  //获取充值金额
  btnInput: function(e) {
    var that = this;
    var mesValue = e.detail.value
    that.setData({
      inputValue: mesValue
    })
  },
  //对话框确认按钮点击事件确认充值
  onConfirm: function() {
    var that = this;
    var amount = that.data.inputValue
    if (that.data.inputValue !== '') {
      app.Util.ajax('mall/order/addRechargeOrder', {
        amount: amount
      }, 'POST').then((res) => { // 使用ajax函数

        if (res.data.content) {
          var id = res.data.content.id
          app.Util.ajax('mall/payment/pay', {
            transStatementId: id,
            channel: 2,
            client: 2
          }, 'POST').then((res) => {
            console.log(res)
            if (res.data.content) {
              wx.requestPayment({
                timeStamp: res.data.content.wechat.appletPrepay.timeStamp,
                nonceStr: res.data.content.wechat.appletPrepay.nonceStr,
                package: res.data.content.wechat.appletPrepay.pkg,
                signType: res.data.content.wechat.appletPrepay.signType,
                paySign: res.data.content.wechat.appletPrepay.paySign,
                success(res) {
                  app.Util.ajax('mall/payment/wechat/result', {
                    transStatementId: id,
                    client: 2
                  }, 'GET').then((res) => {
                    if (res.data.content) {
                      if (res.data.content === 'SUCCESS') {
                        wx.showToast({
                          title: '余额充值成功',
                          icon: 'none'
                        })
                        that.setData({
                          showModal: false,
                          inputValue: ''
                        })
                        that.getMessage();
                      } else if (res.data.content = null) {
                        wx.showToast({
                          title: '订单不存在',
                          icon: 'none'
                        })
                      } else if (res.data.content = 'REFUND') {
                        wx.showToast({
                          title: '转入退款',
                          icon: 'none'
                        })
                      } else if (res.data.content = 'NOTPAY') {
                        wx.showToast({
                          title: '未支付',
                          icon: 'none'
                        })
                      } else if (res.data.content = 'CLOSED') {
                        wx.showToast({
                          title: '已关闭',
                          icon: 'none'
                        })
                      } else if (res.data.content = 'REVOKED') {
                        wx.showToast({
                          title: '已撤销',
                          icon: 'none'
                        })
                      } else if (res.data.content = 'USERPAYING') {
                        wx.showToast({
                          title: '用户支付中',
                          icon: 'none'
                        })
                      } else if (res.data.content = 'PAYERROR') {
                        wx.showToast({
                          title: '支付失败',
                          icon: 'none'
                        })
                      }
                    }
                  })
                },
                fail(err) {
                  console.log(err)
                }
              })
            }
          })
        }
      })
    }
  },
  //提现
  showDetail: function() {
    var that = this;
    that.setData({
      show: true
    })
  },
  //隐藏提现模态框
  hide: function() {
    var that = this;
    that.setData({
      show: false
    });
  },
  //确认提现
  hideConfirm: function() {
    var that = this;
    that.setData({
      show: false
    })
  },
  /**
   * 弹出框蒙层截断touchmove事件
   */
  preventTouchMove: function() {}

})