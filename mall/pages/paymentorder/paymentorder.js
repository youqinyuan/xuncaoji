// pages/paymentorder/paymentorder.js
var time = require('../../utils/util.js');
let app = getApp()
var newCount = true
var interval = ''
var interval2 = ''
Page({

  /**
   * 页面的初始数据
   */
  data: {
    payment_mode1: true,
    payment_mode2: false,
    showDialog: false, //余额不足弹出框
    content: {},
    paymentAmount: '',
    cashBack: '',
    clientTime: '',
    balance: 100, //获取余额
    time: '',
    currentTime: '300',
    channel: 1, //默认余额支付
    show: false, //支付密码弹出框
    Length: 6, //输入框个数 
    isFocus: false, //聚焦 
    Value: "", //输入的内容 
    ispassword: true, //是否密文显示 true为密文， false为明文。
    text: '',
    flag: false, //显示支付多少返多少
    transStatementId: 1, //交易流水id
    orderId: 1, //订单id
    options: {},
    showPassword: false, //设置支付密码弹框
    showStop: false,
    orderType: null,
    message: '微信支付时，请在支付方式内选择信用卡支付，其他方式支付自动退款。',
    amount: null,
    seedBtn:null,
    isShowBook: null,
    buyWay:null,//orderType=23、24
    takeType:null,//线下商店
    getMoneyOrder: null, //发布赚钱订单
    hostUrl: app.Util.getUrlImg().hostUrl,
    shurePeriod:false, 
    isMentionPeriod:false,  //提期0.5期支付问号
    shuomingText1:'支付后，可对此订单发起提期哦，提期可对返现时间缩短！',
    shuomingText2:'下单后商品自己用，给你的返现可卖给他人立即拿钱。',
    shuomingText3:'下单后可随时撤销，退还您已支付金额。',
    paySuccess:false
  },
  //支付
  pay: function(e) {
    var that = this
    if (that.data.channel == 1) {
      if (that.data.content.paymentAmount > 0 && that.data.content.paymentAmount < 10) {
        if (that.data.content.balance <= 0 || that.data.content.paymentAmount > that.data.content.balance) {
          that.setData({
            showDialog: true
          });
        } else {
          var transStatementId = that.data.transStatementId
          var channel = that.data.channel
          var orderId = that.data.orderId
          //余额支付
          app.Util.ajax('mall/payment/pay', {
            transStatementId: transStatementId,
            channel: channel,
            orderId: orderId,
            paymentPassword: ''
          }, 'POST').then((res) => { // 使用ajax函数
            if (res.data.content) {
              if (res.data.content.balance.success == 1) {
                if(that.data.transOrder==2){
                  that.setData({
                    paySuccess:true,
                    businessId:res.data.content.balance.businessId
                  })
                }else{
                  if (that.data.amount2) {
                    wx.navigateBack({
                      delta: 1
                    })
                    wx.setStorageSync('loving', 1)
                  } else if (that.data.amount1) {
                    wx.navigateBack({
                      delta: 1
                    })
                  } else if (that.data.seedBtn) {
                    wx.navigateBack({
                      delta: 1
                    })
                    app.globalData.seedText = '充值成功'
                  } else if (that.data.amount3) {
                    wx.showToast({
                      title:'支付成功，等待对方支付后将开始发货',
                      icon:'none'
                    })
                    setTimeout(function(){
                      wx.navigateTo({
                        url: `/pages/myorder/myorder?status=${2}`,
                      })
                    },1000)
                  } else if (that.data.amount) {
                    wx.navigateBack({
                      delta: 1
                    })
                    wx.setStorageSync('sponsorStatus', 1)
                  } else if (that.data.mentionPeriod) {
                    wx.navigateTo({
                      url: `/packageA/pages/setSuccess/setSuccess?id=`+res.data.content.balance.businessId+'&&multiple='+res.data.content.balance.multiple,
                    })
                  }else if (that.data.helpMentionPeriod) {
                    app.Util.ajax('mall/forum/MentionPeriod/queryMentionPeriod', {
                      id: res.data.content.balance.businessId
                    }, 'GET').then((res) => { // 使用ajax函数
                      if(app.globalData.returnMentionPeriodStatus==2){
                        wx.navigateBack({
                          delta:1
                        })
                      }else{
                        if (res.data.content.status!==1) {
                          wx.navigateTo({
                            url: `/packageA/pages/helpSuccess/helpSuccess?period=`+res.data.content.mentionPeriod,
                          })
                        }else{
                          wx.navigateTo({
                            url: `/packageA/pages/helpFail/helpFail`,
                          })
                        }
                      }
                    })
                  } else if (that.data.getMoneyOrder) {
                    wx.navigateBack({
                      delta: 1
                    })
                    wx.setStorageSync('getMoneyOrder', 1)
                  } else if (that.data.isShowBook) {
                    wx.switchTab({
                      url: '/pages/forum/forum',
                    })
                    app.globalData.type = 4
                  } else if (that.data.goods) {
                    wx.navigateBack({
                      delta: 1
                    })
                  } else {
                    if (res.data.content.balance.type == 1) {
                      if (that.data.buyType == 2) {
                        wx.navigateTo({
                          url: `/pages/myorder/myorder?status=${5}`,
                        })
                      } else if (that.data.buyWay) {
                        wx.navigateTo({
                          url: `/pages/myorder/myorder?status=${0}`,
                        })
                      } else if (that.data.takeType) {
                        // 线下商店
                        if (that.data.takeType == 1) {
                          wx.navigateTo({
                            url: `/pages/myorder/myorder?status=${0}`,
                          })
                        } else {
                          wx.navigateTo({
                            url: `/packageB/pages/waitReentryDetail/waitReentryDetail?&takeType=${that.data.takeType}`,
                          })
                        }
                      }   else {
                        //预售返现卖家付尾款
                        if(that.data.orderSell){
                          wx.showToast({
                            title:'支付成功，等待对方支付后将开始发货',
                            icon:'none'
                          })
                          setTimeout(function(){
                            wx.navigateTo({
                              url: `/pages/myorder/myorder?status=${2}`,
                            })
                          },1000)
                        }else{
                          wx.navigateTo({
                            url: `/pages/myorder/myorder?status=${2}`,
                          })
                        }
                      }
                      wx.removeStorageSync('myOrder')
                    } else if (that.data.getMoneyOrder) {
                      wx.navigateBack({
                        delta: 1
                      })
                      wx.setStorageSync('getMoneyOrder', 1)
                    } else if (that.data.isShowBook) {
                      wx.switchTab({
                        url: '/pages/forum/forum',
                      })
                      app.globalData.type = 4
                    } else if (that.data.goods) {
                      wx.navigateBack({
                        delta: 1
                      })
                    } 
                  }
                }
              }
            }
          })
        }
      } else if (that.data.content.paymentAmount >= 10) {
        //是否设置支付密码
        app.Util.ajax('mall/account/paymentPassword/status', 'GET').then((res) => { // 使用ajax函数
          if (res.messageCode = 'MSG_1001') {
            if (res.data.content == 2) {
              //未设置密码
              that.setData({
                showPassword: true
              })
            } else {
              //已设置密码
              if (that.data.content.balance <= 0 || that.data.content.paymentAmount > that.data.content.balance) {
                that.setData({
                  showDialog: true
                });
              } else {
                that.setData({
                  show: true,
                  isFocus: true
                })
              }
            }
          }
        })
      } else if (that.data.content.paymentAmount === 0) {
        var transStatementId = that.data.transStatementId
        var channel = that.data.channel
        var orderId = that.data.orderId
        //余额支付(支付金额小于10)
        app.Util.ajax('mall/payment/pay', {
          transStatementId: transStatementId,
          channel: channel,
          orderId: orderId,
          paymentPassword: ''
        }, 'POST').then((res) => { // 使用ajax函数
          if (res.data.content) {
            if (res.data.content.balance.success == 1) {
              if(that.data.transOrder==2){
                that.setData({
                  paySuccess:true,
                  businessId:res.data.content.balance.businessId
                })
              }else{
                if (that.data.amount2) {
                  wx.navigateBack({
                    delta: 1
                  })
                  wx.setStorageSync('loving', 1)
                } else if (that.data.amount1) {
                  wx.navigateBack({
                    delta: 1
                  })
                } else if (that.data.seedBtn) {
                  wx.navigateBack({
                    delta: 1
                  })
                  app.globalData.seedText = '充值成功'
                }  else if (that.data.amount3) {
                  wx.showToast({
                    title:'支付成功，等待对方支付后将开始发货',
                    icon:'none'
                  })
                  setTimeout(function(){
                    wx.navigateTo({
                      url: `/pages/myorder/myorder?status=${2}`,
                    })
                  },1000)
                }else if (that.data.helpMentionPeriod){
                  app.Util.ajax('mall/forum/MentionPeriod/queryMentionPeriod', {
                    id: res.data.content.balance.businessId
                  }, 'GET').then((res) => { // 使用ajax函数
                    if(app.globalData.returnMentionPeriodStatus==2){
                      wx.navigateBack({
                        delta:1
                      })
                    }else{
                      if (res.data.content.status!==1) {
                        wx.navigateTo({
                          url: `/packageA/pages/helpSuccess/helpSuccess?period=`+res.data.content.mentionPeriod,
                        })
                      }else{
                        wx.navigateTo({
                          url: `/packageA/pages/helpFail/helpFail`,
                        })
                      }
                    }
                  })
                } else if (that.data.mentionPeriod) {
                  wx.navigateTo({
                    url: `/packageA/pages/setSuccess/setSuccess?id=`+res.data.content.balance.businessId+'&&multiple='+res.data.content.balance.multiple,
                  })
                } else if (that.data.amount) {
                  wx.navigateBack({
                    delta: 1
                  })
                  wx.setStorageSync('sponsorStatus', 1)
                } else if (that.data.getMoneyOrder) {
                  wx.navigateBack({
                    delta: 1
                  })
                  wx.setStorageSync('getMoneyOrder', 1)
                } else if (that.data.isShowBook) {
                  wx.switchTab({
                    url: '/pages/forum/forum',
                  })
                  app.globalData.type = 4
                } else if (that.data.goods) {
                  wx.navigateBack({
                    delta: 1
                  })
                }  else {
                  if (res.data.content.balance.type == 1) {
                    if (that.data.buyType == 2) {
                      wx.navigateTo({
                        url: `/pages/myorder/myorder?status=${5}`,
                      })
                    } else if (that.data.buyWay) {
                      wx.navigateTo({
                        url: `/pages/myorder/myorder?status=${0}`,
                      })
                    } else if (that.data.takeType) {
                      // 线下商店
                      if (that.data.takeType == 1) {
                        wx.navigateTo({
                          url: `/pages/myorder/myorder?status=${0}`,
                        })
                      } else {
                        wx.navigateTo({
                          url: `/packageB/pages/waitReentryDetail/waitReentryDetail?&takeType=${that.data.takeType}`,
                        })
                      }
                    }   else {
                      //预售返现卖家付尾款
                      if(that.data.orderSell){
                        wx.showToast({
                          title:'支付成功，等待对方支付后将开始发货',
                          icon:'none'
                        })
                        setTimeout(function(){
                          wx.navigateTo({
                            url: `/pages/myorder/myorder?status=${2}`,
                          })
                        },1000)
                      }else{
                        wx.navigateTo({
                          url: `/pages/myorder/myorder?status=${2}`,
                        })
                      }
                    }
                    wx.removeStorageSync('myOrder')
                  } else if (that.data.getMoneyOrder) {
                    wx.navigateBack({
                      delta: 1
                    })
                    wx.setStorageSync('getMoneyOrder', 1)
                  } else if (that.data.isShowBook){
                    wx.switchTab({
                      url: '/pages/forum/forum',
                    })
                    app.globalData.type = 4
                  } else if (that.data.goods) {
                    wx.navigateBack({
                      delta: 1
                    })
                  } 
                }
              }
              
            }
          }
        })
      }
    } else if (that.data.channel == 2) {
      var transStatementId = that.data.transStatementId
      var channel = that.data.channel
      var orderId = that.data.orderId
      app.Util.ajax('mall/payment/pay', {
        transStatementId: transStatementId,
        channel: channel,
        orderId: orderId,
        client: 2
      }, 'POST').then((res) => {
        if (res.data.content) {
          wx.requestPayment({
            timeStamp: res.data.content.wechat.appletPrepay.timeStamp,
            nonceStr: res.data.content.wechat.appletPrepay.nonceStr,
            package: res.data.content.wechat.appletPrepay.pkg,
            signType: res.data.content.wechat.appletPrepay.signType,
            paySign: res.data.content.wechat.appletPrepay.paySign,
            success(res) {
              app.Util.ajax('mall/payment/wechat/result', {
                transStatementId: transStatementId,
                client: 2
              }, 'GET').then((res) => {
                if (res.data.content) {
                  if (res.data.content.status === 'SUCCESS') {
                    if(that.data.transOrder==2){
                      that.setData({
                        paySuccess:true,
                        businessId:res.data.content.businessId
                      })
                    }else{
                      if (res.data.content.bankCardType == 2 && that.data.options.type == 2) {
                        //信用卡用户
                        // console.log("支付卡类型:" + res.data.content.bankCardType)
                        app.globalData.creditCard = 1
                      }
                      if (that.data.amount2) {
                        wx.navigateBack({
                          delta: 1
                        })
                        wx.setStorageSync('loving', 1)
                      } else if (that.data.amount1) {
                        wx.navigateBack({
                          delta: 1
                        })
                      } else if (that.data.seedBtn) {
                        wx.navigateBack({
                          delta: 1
                        })
                        app.globalData.seedText = '充值成功'
                      } else if (that.data.helpMentionPeriod) {
                        app.Util.ajax('mall/forum/MentionPeriod/queryMentionPeriod', {
                          id: res.data.content.businessId
                        }, 'GET').then((res) => { // 使用ajax函数
                          if(app.globalData.returnMentionPeriodStatus==2){
                            wx.navigateBack({
                              delta:1
                            })
                          }else{
                            if (res.data.content.status!==1) {
                              wx.navigateTo({
                                url: `/packageA/pages/helpSuccess/helpSuccess?period=`+res.data.content.mentionPeriod,
                              })
                            }else{
                              wx.navigateTo({
                                url: `/packageA/pages/helpFail/helpFail`,
                              })
                            }
                          }
                        })
                      } else if (that.data.mentionPeriod) {
                        wx.navigateTo({
                          url: `/packageA/pages/setSuccess/setSuccess?id=`+res.data.content.businessId+'&&multiple='+res.data.content.multiple,
                        })
                      } else if (that.data.amount3) {
                        wx.showToast({
                          title:'支付成功，等待对方支付后将开始发货',
                          icon:'none'
                        })
                        setTimeout(function(){
                          wx.navigateTo({
                            url: `/pages/myorder/myorder?status=${2}`,
                          })
                        },1000)
                      } else if (that.data.amount) {
                        wx.navigateBack({
                          delta: 1
                        })
                        wx.setStorageSync('sponsorStatus', 1)
                      } else if (that.data.getMoneyOrder) {
                        wx.navigateBack({
                          delta: 1
                        })
                        wx.setStorageSync('getMoneyOrder', 1)
                      }  else if (that.data.isShowBook) {
                        wx.switchTab({
                          url: '/pages/forum/forum',
                        })
                        app.globalData.type = 4
                      } else if (that.data.goods) {
                        wx.navigateBack({
                          delta: 1
                        })
                      }  else {
                        if (res.data.content.type == 1) {
                          if (that.data.buyType == 2) {
                            wx.navigateTo({
                              url: `/pages/myorder/myorder?status=${5}`,
                            })
                          } else if (that.data.buyWay) {
                            wx.navigateTo({
                              url: `/pages/myorder/myorder?status=${0}`,
                            })
      
                          } else if (that.data.takeType) {
                            // 线下商店
                            if (that.data.takeType == 1) {
                              wx.navigateTo({
                                url: `/pages/myorder/myorder?status=${0}`,
                              })
                            } else {
                              wx.navigateTo({
                                url: `/packageB/pages/waitReentryDetail/waitReentryDetail?&takeType=${that.data.takeType}`,
                              })
                            }
                          }   else {
                            //预售返现卖家付尾款
                        if(that.data.orderSell){
                          wx.showToast({
                            title:'支付成功，等待对方支付后将开始发货',
                            icon:'none'
                          })
                          setTimeout(function(){
                            wx.navigateTo({
                              url: `/pages/myorder/myorder?status=${2}`,
                            })
                          },1000)
                        }else{
                          wx.navigateTo({
                            url: `/pages/myorder/myorder?status=${2}`,
                          })
                        }
                          }
                          wx.removeStorageSync('myOrder')
                        } else if (that.data.getMoneyOrder) {
                          wx.navigateBack({
                            delta: 1
                          })
                          wx.setStorageSync('getMoneyOrder', 1)
                        }  else if (that.data.isShowBook) {
                          wx.switchTab({
                            url: '/pages/forum/forum',
                          })
                          app.globalData.type = 4
                        } else if (that.data.goods) {
                          wx.navigateBack({
                            delta: 1
                          })
                        } 
                      }
                    }
                  } else if (res.data.content.status === 'REFUND') {
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
                } else {
                  wx.showToast({
                    title: res.data.message,
                    icon: 'none'
                  })
                }
              })
            },
            fail(res) {}
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
  //转换为余额支付
  wallet_pay() {
    var that = this
    that.setData({
      payment_mode2: false,
      payment_mode1: true,
      channel: 1,
    })
  },
  //转换为微信支付
  wx_pay() {
    var that = this
    that.setData({
      payment_mode1: false,
      payment_mode2: true,
      channel: 2
    })
  },
  //充值余额返回
  back: function() {
    var that = this;
    that.setData({
      showDialog: false
    })
  },
  //去充值余额
  continuePay: function() {
    var that = this;
    wx.navigateTo({
      url: '/pages/mine/recharge/recharge',
    })
  },
  //取消支付密码弹框
  cancelShow: function() {
    var that = this;
    that.setData({
      show: false,
      Value: ''
    })
  },
  //获取密码框的值
  Focus(e) {
    var that = this;
    var inputValue = e.detail.value;
    that.setData({
      Value: inputValue
    })
    if (that.data.Value.length === 6) {
      if (newCount == true) {
        newCount = false
        var transStatementId = that.data.transStatementId
        var channel = that.data.channel
        var orderId = that.data.orderId
        var paymentPassword = that.data.Value
        if (that.data.channel == 1) {
          //余额支付
          if (that.data.content.paymentAmount >= 10) {
            app.Util.ajax('mall/payment/pay', {
              transStatementId: transStatementId,
              channel: channel,
              orderId: orderId,
              paymentPassword: paymentPassword
            }, 'POST').then((res) => { // 使用ajax函数
              if (res.data.content) {
                if (res.data.content.balance.success == 1) {
                  if(that.data.transOrder==2){
                    that.setData({
                      paySuccess:true,
                      businessId:res.data.content.balance.businessId
                    })
                  }else{
                    if (that.data.amount2) {
                      wx.navigateBack({
                        delta: 1
                      })
                      wx.setStorageSync('loving', 1)
                    } else if (that.data.amount1) {
                      wx.navigateBack({
                        delta: 1
                      })
                    } else if (that.data.seedBtn) {
                      wx.navigateBack({
                        delta: 1
                      })
                      app.globalData.seedText = '充值成功'
                    }  else if (that.data.amount3) {
                      wx.showToast({
                        title:'支付成功，等待对方支付后将开始发货',
                        icon:'none'
                      })
                      setTimeout(function(){
                        wx.navigateTo({
                          url: `/pages/myorder/myorder?status=${2}`,
                        })
                      },1000)
                    }else if (that.data.helpMentionPeriod) {
                      app.Util.ajax('mall/forum/MentionPeriod/queryMentionPeriod', {
                        id: res.data.content.balance.businessId
                      }, 'GET').then((res) => { // 使用ajax函数
                        if(app.globalData.returnMentionPeriodStatus==2){
                          wx.navigateBack({
                            delta:1
                          })
                        }else{
                          if (res.data.content.status!==1) {
                            wx.navigateTo({
                              url: `/packageA/pages/helpSuccess/helpSuccess?period=`+res.data.content.mentionPeriod,
                            })
                          }else{
                            wx.navigateTo({
                              url: `/packageA/pages/helpFail/helpFail`,
                            })
                          }
                        }
                      })
                    } else if (that.data.mentionPeriod) {
                      wx.navigateTo({
                        url: `/packageA/pages/setSuccess/setSuccess?id=`+res.data.content.balance.businessId+'&&multiple='+res.data.content.balance.multiple,
                      })
                    } else if (that.data.amount) {
                      wx.navigateBack({
                        delta: 1
                      })
                      wx.setStorageSync('sponsorStatus', 1)
                    } else if (that.data.getMoneyOrder) {
                      wx.navigateBack({
                        delta: 1
                      })
                      wx.setStorageSync('getMoneyOrder', 1)
                    }  else if (that.data.isShowBook) {
                      wx.switchTab({
                        url: '/pages/forum/forum',
                      })
                      app.globalData.type = 4
                    } else if (that.data.goods) {
                      wx.navigateBack({
                        delta: 1
                      })
                    }  else {
                      if (that.data.amount) {
                        wx.navigateBack({
                          delta: 1
                        })
                      } else {
                        if (res.data.content.balance.type == 1) {
                          if (that.data.buyType == 2) {
                            wx.navigateTo({
                              url: `/pages/myorder/myorder?status=${5}`,
                            })
                          }else if (that.data.buyWay) {
                            wx.navigateTo({
                              url: `/pages/myorder/myorder?status=${0}`,
                            })
      
                          } else if (that.data.takeType) {
                            // 线下商店
                            if (that.data.takeType == 1) {
                              wx.navigateTo({
                                url: `/pages/myorder/myorder?status=${0}`,
                              })
                            } else {
                              wx.navigateTo({
                                url: `/packageB/pages/waitReentryDetail/waitReentryDetail?&takeType=${that.data.takeType}`,
                              })
                            }
                          }  else {
                            //预售返现卖家付尾款
                        if(that.data.orderSell){
                          wx.showToast({
                            title:'支付成功，等待对方支付后将开始发货',
                            icon:'none'
                          })
                          setTimeout(function(){
                            wx.navigateTo({
                              url: `/pages/myorder/myorder?status=${2}`,
                            })
                          },1000)
                        }else{
                          wx.navigateTo({
                            url: `/pages/myorder/myorder?status=${2}`,
                          })
                        }
                          }
                          wx.removeStorageSync('myOrder')
                        } else if (that.data.isShowBook) {
                          wx.switchTab({
                            url: '/pages/forum/forum',
                          })
                          app.globalData.type = 4
                        } else if (that.data.goods) {
                          wx.navigateBack({
                            delta: 1
                          })
                        } 
                      }
                    }
                    that.setData({
                      show: false,
                      isFocus: false
                    })
                  }
                } else {
                  if (res.data.content.balance.remainingCount > 0) {
                    that.setData({
                      text: `密码错误，你还剩余${res.data.content.balance.remainingCount}次机会`,
                      Value: ''
                    })
                  } else {
                    let lastTime = res.data.content.balance.retryRemainingTime / 1000
                    interval = setInterval(() => {
                      if (lastTime > 0) {
                        lastTime--
                        let minuteTime = parseInt(lastTime / 60) < 10 ? '0' + parseInt(lastTime / 60) : parseInt(lastTime / 60)
                        let secondTime = parseInt(lastTime % 60) < 10 ? '0' + parseInt(lastTime % 60) : parseInt(lastTime % 60)
                        that.setData({
                          text: `请${minuteTime}分${secondTime}秒后重试`,
                          Value: ''
                        })

                      } else {
                        clearInterval(interval)
                        that.setData({
                          text: ''
                        })
                      }
                    }, 1000)
                  }
                }
              } else {
                wx.showToast({
                  title: res.data.message,
                  icon: 'none'
                })
              }
            })
          }
        }
      }
      setTimeout(function() {
        newCount = true
      }, 1000)
    }
  },
  blur: function(e) {
    var that = this;
    that.setData({
      bottom: 0
    })
  },
  hideModal: function() {
    var that = this
    that.setData({
      show: false,
      isFocus: false,
      Value: ''
    })
  },
  Tap() {
    var that = this;
    that.setData({
      isFocus: true,
    })
  },
  // 是否设置支付密码弹框点击取消
  cancel: function() {
    var that = this
    that.setData({
      showPassword: false
    })
  },
  // 是否设置支付密码弹框点击确定
  sure: function() {
    var that = this
    that.setData({
      showPassword: false
    })
    wx.navigateTo({
      url: '/pages/paypassword/paypassword',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    //发起提期佣金支付
    if (options.mentionPeriod) {
      that.setData({
        mentionPeriod: options.mentionPeriod
      })
    }
    if(options.isMentionPeriod){
      that.setData({
        isMentionPeriod: options.isMentionPeriod
      })
    }
    //购买提期
    if (options.helpMentionPeriod) {
      that.setData({
        helpMentionPeriod: options.helpMentionPeriod
      })
    }
    that.setData({
      options: options,
      seedBtn: options.seedBtn ? options.seedBtn : null,
      buyType: options.buyType ? options.buyType:null,
      isShowBook: options.isShowBook ? options.isShowBook : null,
      goods: options.goods ? options.goods:null,
      amount: options.amount ? options.amount : null,
      orderType: parseInt(options.orderType),
      amount2: options.amount2 ? options.amount2 : null,
      amount1: options.amount1 ? options.amount1 : null,
      amount3: options.amount3 ? options.amount3 : null,
      orderSell: options.orderSell ? options.orderSell : null,
      buyWay: options.buyWay ? options.buyWay : null,
      takeType: options.takeType ? options.takeType : null,
      getMoneyOrder: options.getMoneyOrder ? options.getMoneyOrder : null,
    })
    if (that.data.orderType === 4) {
      that.setData({
        payment_mode1: false,
        payment_mode2: true,
        channel: 2
      })
    }
    var transStatementId = parseInt(options.id)
    var flag = Boolean(options.flag)
    // var createTime = parseInt(options.createTime)
    // let endTime = createTime + 15 * 60 * 1000
    // let clientTime = new Date()
    // let lastTime = (endTime - clientTime) / 1000
    // let hourTime = parseInt(lastTime / 3600) < 10 ? '0' + parseInt(lastTime / 3600) : parseInt(lastTime / 3600)
    // let minuteTime = parseInt((lastTime % 3600) / 60) < 10 ? '0' + parseInt((lastTime % 3600) / 60) : parseInt((lastTime % 3600) / 60)
    // let secondTime = parseInt(lastTime % 60)
    // that.setData({
    //   clientTime: `${minuteTime}:${secondTime}`
    // })
    // interval2 = setInterval(() => {
    //   if (lastTime > 0) {
    //     lastTime--
    //     let hourTime = parseInt(lastTime / 3600) < 10 ? '0' + parseInt(lastTime / 3600) : parseInt(lastTime / 3600)
    //     let minuteTime = parseInt((lastTime % 3600) / 60) < 10 ? '0' + parseInt((lastTime % 3600) / 60) : parseInt((lastTime % 3600) / 60)
    //     let secondTime = parseInt(lastTime % 60) > 10 ? parseInt(lastTime % 60) : '0' + parseInt(lastTime % 60)
    //     that.setData({
    //       clientTime: `${hourTime}:${minuteTime}:${secondTime}`
    //     })
    //   } else {
    //     clearInterval(interval2)
    //     that.setData({
    //       clientTime: ''
    //     })
    //   }
    // }, 1000)
    var orderId = parseInt(options.orderId)
    that.setData({
      transStatementId: transStatementId,
      orderId: orderId,
      flag: flag,
      paymentAmount: parseInt(options.actualPrice),
      cashBack: parseInt(options.cashBack),
    })
    if (options.orderId) {
      app.Util.ajax('mall/order/queryTransStatementInfo', {
        orderId: orderId
      }, 'GET').then((res) => { // 使用ajax函数
        if (res.data.messageCode = 'MSG_1001') {
          app.Util.ajax('mall/payment/channels', {
            transStatementId: res.data.content.id
          }, 'GET').then((res) => { // 使用ajax函数
            if (res.data.content) {
              that.setData({
                transOrder:res.data.content.transOrder
              })
              let lastTime = res.data.content.remainingTime / 1000
              let hourTime = parseInt(lastTime / 3600) < 10 ? '0' + parseInt(lastTime / 3600) : parseInt(lastTime / 3600)
              let minuteTime = parseInt((lastTime % 3600) / 60) < 10 ? '0' + parseInt((lastTime % 3600) / 60) : parseInt((lastTime % 3600) / 60)
              let secondTime = parseInt(lastTime % 60) < 10 ? '0' + parseInt(lastTime % 60) : parseInt(lastTime % 60)
              that.setData({
                time: `${hourTime}:${minuteTime}:${secondTime}`
              })
              interval2 = setInterval(() => {
                if (lastTime > 0) {
                  lastTime--
                  let hourTime = parseInt(lastTime / 3600) < 10 ? '0' + parseInt(lastTime / 3600) : parseInt(lastTime / 3600)
                  let minuteTime = parseInt((lastTime % 3600) / 60) < 10 ? '0' + parseInt((lastTime % 3600) / 60) : parseInt((lastTime % 3600) / 60)
                  let secondTime = parseInt(lastTime % 60) < 10 ? '0' + parseInt(lastTime % 60) : parseInt(lastTime % 60)
                  that.setData({
                    time: `${hourTime}:${minuteTime}:${secondTime}`
                  })
                } else {
                  clearInterval(interval2)
                  let pages = getCurrentPages()
                  if (pages[pages.length - 1].route == 'pages/paymentorder/paymentorder' || pages[pages.length - 1].route == 'pages/orderDetail/orderDetail') {
                    if (that.data.amount2) {
                      wx.navigateBack({
                        delta: 1
                      })
                      wx.setStorageSync('loving', 1)
                    } else if (that.data.amount1) {
                      wx.navigateBack({
                        delta: 1
                      })
                    } else if (that.data.seedBtn) {
                      wx.navigateBack({
                        delta: 1
                      })
                      app.globalData.seedText = '充值成功'
                    }  else if (that.data.amount3) {
                      wx.setStorageSync('toWaitReentry', 1)
                      wx.navigateBack({
                        delta: 1
                      })
                    }else if (that.data.helpMentionPeriod) {
                      wx.navigateBack({
                        delta: 1
                      })
                    } else if (that.data.mentionPeriod) {
                      wx.navigateBack({
                        delta: 1
                      })
                    } else if (that.data.amount) {
                      wx.navigateBack({
                        delta: 1
                      })
                      wx.setStorageSync('sponsorStatus', 1)
                    } else if (that.data.isShowBook) {
                      wx.switchTab({
                        url: '/pages/forum/forum',
                      })
                      app.globalData.type = 4
                    } else if (that.data.goods) {
                      wx.navigateBack({
                        delta: 1
                      })
                    }  else {
                      if (that.data.buyType == 2) {
                        wx.navigateTo({
                          url: `/pages/myorder/myorder?status=${5}`,
                        })
                      } else if (that.data.buyWay) {
                        wx.navigateTo({
                          url: `/pages/myorder/myorder?status=${0}`,
                        }) 
                      } else if (that.data.takeType) {
                        // 线下商店
                        if (that.data.takeType==1){
                          wx.navigateTo({
                            url: `/pages/myorder/myorder?status=${0}`,
                          })
                        }else{
                          wx.navigateTo({
                            url: `/packageB/pages/waitReentryDetail/waitReentryDetail?&takeType=${that.data.takeType}`,
                          })
                        }
                      }else {
                        wx.navigateTo({
                          url: `/pages/myorder/myorder?status=${2}`,
                        })
                      }
                    }
                  }
                  that.setData({
                    time: ''
                  })
                }
              }, 1000)
              that.setData({
                content: res.data.content
              })
            }
          })
        }
      })
    } else {
      app.Util.ajax('mall/payment/channels', {
        transStatementId: transStatementId
      }, 'GET').then((res) => { // 使用ajax函数
        if (res.data.content) {
          that.setData({
            transOrder:res.data.content.transOrder
          })
          let lastTime = res.data.content.remainingTime / 1000
          clearInterval(interval2)
          interval2 = setInterval(() => {
            if (lastTime > 0) {
              lastTime--
              let hourTime = parseInt(lastTime / 3600) < 10 ? '0' + parseInt(lastTime / 3600) : parseInt(lastTime / 3600)
              let minuteTime = parseInt((lastTime % 3600) / 60) < 10 ? '0' + parseInt((lastTime % 3600) / 60) : parseInt((lastTime % 3600) / 60)
              let secondTime = parseInt(lastTime % 60) < 10 ? '0' + parseInt(lastTime % 60) : parseInt(lastTime % 60)
              that.setData({
                time: `${hourTime}:${minuteTime}:${secondTime}`
              })

            } else {
              clearInterval(interval2)
              let pages = getCurrentPages()
              if (pages[pages.length - 1].route == 'pages/paymentorder/paymentorder' || pages[pages.length - 1].route == 'pages/orderDetail/orderDetail') {
                if (that.data.amount2) {
                  wx.navigateBack({
                    delta: 1
                  })
                  wx.setStorageSync('loving', 1)
                } else if (that.data.amount1) {
                  wx.navigateBack({
                    delta: 1
                  })
                } else if (that.data.seedBtn) {
                  wx.navigateBack({
                    delta: 1
                  })
                  app.globalData.seedText = '充值成功'
                }  else if (that.data.amount3) {
                  wx.setStorageSync('toWaitReentry', 1)
                  wx.navigateBack({
                    delta: 1
                  })
                } else if (that.data.mentionPeriod) {
                  wx.navigateBack({
                    delta: 2
                  })
                }else if (that.data.helpMentionPeriod) {
                  wx.navigateBack({
                    delta: 1
                  })
                }else if (that.data.amount) {
                  wx.navigateBack({
                    delta: 1
                  })
                  wx.setStorageSync('sponsorStatus', 1)
                } else if (that.data.isShowBook) {
                  wx.switchTab({
                    url: '/pages/forum/forum',
                  })
                  app.globalData.type = 4
                } else {
                  if (that.data.buyType == 2) {
                    wx.navigateTo({
                      url: `/pages/myorder/myorder?status=${5}`,
                    })
                  } else if (that.data.buyWay) {
                    wx.navigateTo({
                      url: `/pages/myorder/myorder?status=${0}`,
                    })
                  } else if (that.data.takeType) {
                    // 线下商店
                    if (that.data.takeType == 1) {
                      wx.navigateTo({
                        url: `/pages/myorder/myorder?status=${0}`,
                      })
                    } else {
                      wx.navigateTo({
                        url: `/packageB/pages/waitReentryDetail/waitReentryDetail?&takeType=${that.data.takeType}`,
                      })
                    }
                  } else {
                    wx.navigateTo({
                      url: `/pages/myorder/myorder?status=${2}`,
                    })
                  }
                }
              }
              that.setData({
                time: ''
              })
            }
          }, 1000)
          that.setData({
            content: res.data.content
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
    var that = this
    that.setData({
      showDialog: false
    });
    //账户资产数据
    app.Util.ajax('mall/personal/assets', null, 'GET').then((res) => {
      if (res.data.content) {
        that.setData({
          balance: (res.data.content.balance).toFixed(2),
        })
      }
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
    var that = this
    //判断页面栈里面的页面数是否大于2
    if(that.data.comeBackStatus){

    }else{
      if (getCurrentPages().length > 2) {
        //获取页面栈
        let pages = getCurrentPages()
        //给上一个页面设置状态
        let curPage = pages[pages.length - 2];
        let data = curPage.data;
        curPage.setData({
          'isBack': true
        });
        clearInterval(interval2)
        clearInterval(interval)
      }
    }
    clearInterval(interval2)
    clearInterval(interval)
  },
  comeBack2:function(){
    wx.navigateBack({
      delta:1
    })
  },
  comeBack1:function(){
    let that = this
    if(that.data.options.orderId){
      app.Util.ajax('mall/order/transAdvance', {
        transStatementId:that.data.transStatementId
      }, 'POST').then((res) => {
        let arr = res.data.content
        let activityId = arr.order.activityId?arr.order.activityId:''
        let goodsType = 1 //freeBuy单个商品
        if(arr.order.orderType==14){
          wx.navigateTo({
            url: "/pages/placeorder/placeorder?sponsorId=" + activityId + "&&goodsType=" + goodsType
          })
        }else{
          wx.redirectTo({
            url: '/pages/placeorder/placeorder?goodsId=' + arr.orderGoodsBo[0].orderGoods.goodsId + '&&activityId=' + activityId + '&&stockId=' + arr.orderGoodsBo[0].orderGoods.stockId + '&&quantity=' + arr.orderGoodsBo[0].orderGoods.quantity + '&&goodsType=applyZero' + '&&needPaymentAmount=' + arr.orderGoodsBo[0].orderGoods.needPaymentAmount + '&&cashBackPeriods=' + arr.orderGoodsBo[0].orderGoods.period+ '&&expectedAmount=' + arr.orderGoodsBo[0].orderGoods.expectedAmount + '&&buyType=' + arr.orderGoodsBo[0].orderGoods.buyType + '&&isShowBook=2&&isOrder=1'+'&&discountCompute='+arr.orderGoodsBo[0].orderGoods.discountNumber/10+'&orderType='+arr.order.orderType
          })
        }
      })
    }else{
      let pages = getCurrentPages();
      let prevPage = pages[pages.length - 2]; 
      prevPage.setData({
        isShowBook:2
      })
      app.Util.ajax('mall/order/transAdvance', {
        transStatementId:that.data.transStatementId
      }, 'POST').then((res) => {
      })
      this.setData({
        comeBackStatus:1
      })
      wx.navigateBack({
        delta:1
      })
    }
  },
  comeBack3:function(){
    let that = this
    if(that.data.options.orderId){
      app.Util.ajax('mall/order/transFreeBuy', {
        transStatementId:that.data.transStatementId
      }, 'GET').then((res) => {
        wx.redirectTo({
          url: `/packageB/pages/applyZero/applyZero?goodsId=${res.data.content.goodsId}&discountNumber=${res.data.content.discountNumber}&orderType=${res.data.content.orderType}&stockId=${res.data.content.stockId}&quantity=${res.data.content.quantity}&activityId=${res.data.content.activityId?res.data.content.activityId:''}`,
        })
      })
    }else{
      app.Util.ajax('mall/order/transFreeBuy', {
        transStatementId:that.data.transStatementId
      }, 'GET').then((res) => {
        let pages = getCurrentPages();
        let prevPage = pages[pages.length - 2]; 
        prevPage.setData({
          orderType:res.data.content.orderType
        })
        wx.navigateBack({
          delta:1
        })
      })
    }
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
  /**
   * 弹出框蒙层截断touchmove事件
   */
  preventTouchMove: function() {},
  //可终止弹窗显示
  payValueShow: function() {
    this.setData({
      showStop: true
    })
  },
  //可终止弹窗隐藏
  payValueHiden: function() {
    this.setData({
      showStop: false
    })
  },
  clooseShurePeriod:function(){
    this.setData({
      shurePeriod:false
    })
  },
  mentionPeriod:function(){
    this.setData({
      shurePeriod:true
    })
  },
  cancelShuoming:function(){
    this.setData({
      shuoming:false
    })
  },
  showShuoming:function(e){
    let index = e.currentTarget.dataset.index
    if(index==0){
      this.setData({
        textStatus:0,
        shuoming:true
      })
    }else if(index==1){
      this.setData({
        textStatus:1,
        shuoming:true
      })
    }else if(index==2){
      this.setData({
        textStatus:2,
        shuoming:true
      })
    }
  },
  cancelPaySuccess:function(){
    this.setData({
      paySuccess:false
    })
    wx.navigateTo({
      url: `/pages/myorder/myorder?status=${2}`,
    })
  },
  toMentionPeriod:function(){
    //跳转控制
    app.globalData.returnMentionPeriodStatus = 2
    this.setData({
      paySuccess:false
    })
    wx.navigateTo({
      url: `/packageA/pages/mentionPeriod/mentionPeriod?returnStatus=1`,
    })
  },
  toPost:function(){
    this.setData({
      paySuccess:false
    })
    wx.navigateTo({
      url: `/pages/posting/posting?returnStatus=1&&status=3`,
    })
  }
})