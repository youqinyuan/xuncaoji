// pages/mine/recharge/recharge.js
let app = getApp()
Page({
  data: {
    showModal: false, //充值
    showMessage: '', //错误充值提示
    showMessage1: '', //提现错误提示
    show: false, //提现
    pageNumber: 1,
    pageSize: 6,
    content: {},
    inputValue: '', //充值金额
    inputValue1: '', //提现金额
    hostUrl: app.Util.getUrlImg().hostUrl
  },
  onLoad: function(options) {
    var that = this
    if(options.temp){
      setTimeout(function(){
        wx.showToast({
          title:"账户余额存的越多种子奖励越多哦",
          icon:"none"
        })
      },1000)
    }
    that.getMessage()
  },
  getMessage: function() {
    var that = this
    app.Util.ajax('mall/personal/assets', null, 'GET').then((res) => {
      if(res.data.content){
        that.setData({
          content: res.data.content,
        })
      }      
    })
    // app.Util.ajax('mall/personal/balanceDetails', {
    //   pageNumber: pageNumber,
    //   pageSize: pageSize,
    //   status: 1
    // }, 'GET').then((res) => {
    //   if (res.data.content) {
    //     that.setData({
    //       content: res.data.content
    //     })
    //   } else {
    //     wx.showToast({
    //       title: res.data.message,
    //       icon: 'none'
    //     })
    //   }
    // })
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
      inputValue: ''
    });
  },
  //获取充值金额
  btnInput: function(e) {
    var that = this;
    var mesValue
    //正则验证，充值金额仅支持小数点前8位小数点后2位
    if (/^\d{1,8}(\.\d{0,2})?$/.test(e.detail.value) || e.detail.value == '') {
      mesValue = e.detail.value;
      that.setData({
        showMessage: ''
      })
    } else {
      mesValue = e.detail.value.substring(0, e.detail.value.length - 1);
      that.setData({
        showMessage: '充值金额仅支持小数点前8位,小数点后2位'
      })
    }
    that.setData({
      inputValue: mesValue
    })
  },
  //对话框确认按钮点击事件确认充值
  onConfirm: function() {
    var that = this;
    var amount = that.data.inputValue
    console.log(Number(amount))
    if (that.data.inputValue !== '') {
      app.Util.ajax('mall/order/addRechargeOrder', {
        amount: Number(amount)
      }, 'POST').then((res) => { // 使用ajax函数
        if (res.data.messageCode === 'MSG_1001') {
          var id = res.data.content.id
          app.Util.ajax('mall/payment/pay', {
            transStatementId: id,
            channel: 2,
            client: 2
          }, 'POST').then((res) => {
            if (res.data.messageCode == 'MSG_1001') {             
              wx.requestPayment({
                timeStamp: res.data.content.wechat.appletPrepay.timeStamp,
                nonceStr: res.data.content.wechat.appletPrepay.nonceStr,
                package: res.data.content.wechat.appletPrepay.pkg,
                signType: res.data.content.wechat.appletPrepay.signType,
                paySign: res.data.content.wechat.appletPrepay.paySign,
                success:function(res) {
                  app.Util.ajax('mall/payment/wechat/result', {
                    transStatementId: id,
                    client: 2
                  }, 'GET').then((res) => {
                    if (res.data.content) {
                      if (res.data.content.status === 'SUCCESS') {
                        wx.showToast({
                          title: '余额充值成功',
                          icon: 'none'
                        })
                        that.setData({
                          showModal: false,
                          inputValue: ''
                        })
                        setTimeout(function(){
                          that.getMessage();
                        },2000)                       
                      }else if (res.data.content.status === 'REFUND') {
                        wx.showToast({
                          title: '转入退款',
                          icon: 'none'
                        })
                      } else if (res.data.content.status === 'NOTPAY') {
                        wx.showToast({
                          title: '未支付',
                          icon: 'none'
                        })
                      } else if (res.data.content.status === 'CLOSED') {
                        wx.showToast({
                          title: '已关闭',
                          icon: 'none'
                        })
                      } else if (res.data.content.status === 'REVOKED') {
                        wx.showToast({
                          title: '已撤销',
                          icon: 'none'
                        })
                      } else if (res.data.content.status === 'USERPAYING') {
                        wx.showToast({
                          title: '用户支付中',
                          icon: 'none'
                        })
                      } else if (res.data.content.status === 'PAYERROR') {
                        wx.showToast({
                          title: '支付失败',
                          icon: 'none'
                        })
                      }
                    }else{
                      wx.showToast({
                        title: res.data.message,
                        icon:'none',
                        duration:1000
                      })
                    }
                  })
                },
                fail:function(err) {
                  console.log(err)
                }
              })
            }else{
              wx.showToast({
                title: res.data.message,
                icon: 'none'
              })
            }
          })
        } else if (res.data.messageCode === 'MSG_3002') {
          that.setData({
            showMessage: '请将金额限制在50000元以内'
          })
        } else {
          console.log(res.data.messageCode)
          wx.showToast({
            title: res.data.message,
            icon: 'none'
          })
        }
      })
    } else {
      that.setData({
        showMessage: '请输入充值金额'
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
      show: false,
    });
  },
  toReentryDetail: function(){
    wx.navigateTo({
      url:'/pages/waitReentryDetail/waitReentryDetail'
    })
  },
  /**
   * 弹出框蒙层截断touchmove事件
   */
  preventTouchMove: function() {},
  //充值退款
  refundDetail:function(){
    wx.navigateTo({
        url:'/pages/refundDetail/refundDetail'
    })
  },
  //取消提现
  cancleDetail:function(){
    wx.navigateTo({
      url:'/pages/cancleDetail/cancleDetail'
    })
  }
})