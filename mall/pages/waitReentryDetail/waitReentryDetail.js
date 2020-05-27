// pages/waitReentryDetail/waitReentryDetail.js
const app = getApp()
var utils = require('../../utils/util.js');
var time = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sellOneStatus:false,
    sellTwoStatus:false,
    money: 0,
    tempInfo: [],
    passwordType: null,
    transferId: null,
    avatarKey: null,
    nickname: null,
    transferorId: null,
    mobileNumber: null,
    inviterCode: null,
    sellPrice: null,
    service_charge: 0, //手续费
    returnType: null,
    orderId: null,
    orderGoodsId: null,
    transferId: null,
    returnContent: [],
    returnContent2: [],
    returnOne: false,
    returnTwo: false,
    waitReentry3: false,
    waitReentry: false,
    waitReentry2: false,
    showPassword: false,
    isFocus: false, //聚焦 
    Value: "", //输入的内容 
    text: '',
    show: false,
    Length: 6, //输入框个数 
    ispassword: true, //是否密文显示 true为密文， false为明文。
    shureTwo_cancle: false,
    shure_two_tishi: "",
    shureOne: false,
    shureTwo: false,
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
    stopOrder: 'stopOrder',
    pageNumber: 1,
    pageNumber2: 1,
    pageSize: 10,
    goWaitReentry: null,
    choose1: false,
    index1: 4,
    returnCancle: false,
    returnCanclePeople: false,
    hostUrl: app.Util.getUrlImg().hostUrl,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    that.setData({
      goWaitReentry: wx.getStorageSync('goWaitReentry')
    })
    that.setData({
      goMentionPeriod: options.goMentionPeriod
    })
    if (options.temp) {
      setTimeout(function() {
        wx.showToast({
          title: "余额转让成功有种子奖励哦",
          icon: "none"
        })
      }, 1000)
    }
    if (wx.getStorageSync('goWaitReentry')) {
      wx.setNavigationBarTitle({
        title: '选择待返合约',
      })
      that.initDetail1();
    }else if(that.data.goMentionPeriod){
      wx.setNavigationBarTitle({
        title: '选择待返合约',
      })
      that.initDetail2();
    } else {
      wx.setNavigationBarTitle({
        title: '待返明细',
      })
      that.initDetail();
    }
  },
  //从发卖帖点过来返回
  backPosting: function(e) {
    var that = this
    var is_waitReentry = wx.getStorageSync('goWaitReentry')
    let is_mentionPeriod = that.data.goMentionPeriod
    if (is_waitReentry||is_mentionPeriod) {
      wx.setStorage({
        key: "waitReentry",
        data: that.data.contentPsoting[e.currentTarget.dataset.index]
      })
      wx.navigateBack({
        delta: 1
      })
    }
  },
  postingCard: function(e) {
    var that = this
    console.log(e)
    wx.setStorage({
      key: "waitReentry",
      data: that.data.content[e.currentTarget.dataset.index]
    })
    wx.navigateTo({
      url: '/pages/posting/posting?status=' + 3,
    })
  },
  initDetail: function(e) {
    var that = this
    var pageNumber = that.data.pageNumber
    var pageSize = that.data.pageSize
    app.Util.ajax('mall/personal/queryPendingReturnDetails', {
      pageNumber: pageNumber,
      pageSize: pageSize
    }, 'GET').then((res) => {
      if (res.data.content.noReturnItem) {
        var arr = res.data.content.noReturnItem.items
        for (let i of arr) {
          i.tradeTime = utils.formatTimeTwo(i.tradeTime, 'Y-M-D');
          if (i.otherTransfer == 1) {
            i.remark = "商品名称保护中"
            i.proStatus = 1
          }else if(i.code){
            i.remark = "购买—FreeBuy提期"
            i.proStatus = 1
          }
        } 
        that.setData({
          content: arr
        })
        if (that.data.content.length === 0) {
          that.setData({
            text: '暂无数据'
          })
        } else {
          that.setData({
            text: ''
          })
        }
        that.returnInfo()
      }
    })
  },
  getInitDetail: function() {
    var that = this
    var pageNumber = that.data.pageNumber + 1
    app.Util.ajax('mall/personal/queryPendingReturnDetails', {
      pageNumber: pageNumber,
      pageSize: that.data.pageSize
    }, 'GET').then((res) => { // 使用ajax函数
      if (res.data.content) {
        if (res.data.content.noReturnItem.items == '' && that.data.content !== '') {
          that.setData({
            text: '已经到底啦'
          })
        }
        var arr = that.data.content
        for (var i = 0; i < res.data.content.noReturnItem.items.length; i++) {
          res.data.content.noReturnItem.items[i].tradeTime = utils.formatTimeTwo(res.data.content.noReturnItem.items[i].tradeTime, 'Y-M-D');
          if (res.data.content.noReturnItem.items[i].otherTransfer == 1) {
            res.data.content.noReturnItem.items[i].remark = "商品名称保护中"
            res.data.content.noReturnItem.items[i].proStatus = 1
          }else if(res.data.content.noReturnItem.items[i].code){
            res.data.content.noReturnItem.items[i].remark = "购买—FreeBuy提期"
            res.data.content.noReturnItem.items[i].proStatus = 1
          }
          arr.push(res.data.content.noReturnItem.items[i])
        }
        that.setData({
          content: arr,
          pageNumber: pageNumber
        })
      }
    })
  },
  //从发帖子过来
  initDetail1: function(e) {
    var that = this
    var pageNumber = that.data.pageNumber
    var pageSize = that.data.pageSize
    app.Util.ajax('mall/forum/topic/findNoReturnPageList', {
      pageNumber: pageNumber,
      pageSize: pageSize,
    }, 'GET').then((res) => {
      if (res.data.content) {
        var arr = res.data.content.items
        for (let i of arr) {
          i.tradeTime = utils.formatTimeTwo(i.tradeTime, 'Y-M-D');
          if (i.otherTransfer == 1) {
            i.remark = "商品名称保护中"
          }else if(i.code){
            i.remark = "购买—FreeBuy提期"
            i.proStatus = 1
          }
        }
        that.setData({
          contentPsoting: arr
        })
        if (that.data.contentPsoting.length === 0) {
          that.setData({
            text: '暂无数据'
          })
        } else {
          that.setData({
            text: ''
          })
        }
      }
    })
  },
  getInitDetail1: function() {
    var that = this
    var pageNumber = that.data.pageNumber + 1
    app.Util.ajax('mall/forum/topic/findNoReturnPageList', {
      pageNumber: pageNumber,
      pageSize: that.data.pageSize,
    }, 'GET').then((res) => { // 使用ajax函数
      if (res.data.content) {
        if (res.data.content.items == '' && that.data.contentPsoting !== '') {
          that.setData({
            text: '已经到底啦'
          })
        }
        var arr = that.data.contentPsoting
        for (var i = 0; i < res.data.content.items.length; i++) {
          res.data.content.items[i].tradeTime = utils.formatTimeTwo(res.data.content.items[i].tradeTime, 'Y-M-D h:m:s');
          if (res.data.content.items[i].otherTransfer == 1) {
            res.data.content.items[i].remark = "商品名称保护中"
          }else if(res.data.content.items[i].code){
            res.data.content.items[i].remark = "购买—FreeBuy提期"
            res.data.content.items[i].proStatus = 1
          }
          arr.push(res.data.content.items[i])
        }
        that.setData({
          contentPsoting: arr,
          pageNumber: pageNumber
        })
      }
    })
  },
    //从发提期过来
    initDetail2: function(e) {
      var that = this
      var pageNumber = that.data.pageNumber
      var pageSize = that.data.pageSize
      app.Util.ajax('mall/personal/queryPendingReturnDetails', {
        pageNumber: pageNumber,
        pageSize: pageSize,
        isMentionPeriod:1
      }, 'GET').then((res) => {
        if (res.data.content) {
          var arr = res.data.content.noReturnItem.items
          for (let i of arr) {
            i.tradeTime = utils.formatTimeTwo(i.tradeTime, 'Y-M-D');
            if (i.otherTransfer == 1) {
              i.remark = "商品名称保护中"
            }else if (i.code) {
              i.remark = "购买—FreeBuy提期"
            }
          }
          that.setData({
            contentPsoting: arr
          })
          if (that.data.contentPsoting.length === 0) {
            that.setData({
              text: '暂无数据'
            })
          } else {
            that.setData({
              text: ''
            })
          }
        }
      })
    },
    getInitDetail2: function() {
      var that = this
      var pageNumber = that.data.pageNumber + 1
      app.Util.ajax('mall/personal/queryPendingReturnDetails', {
        pageNumber: pageNumber,
        pageSize: that.data.pageSize,
        isMentionPeriod:1
      }, 'GET').then((res) => { // 使用ajax函数
        if (res.data.content) {
          if (res.data.content.noReturnItem.items == '' && that.data.contentPsoting !== '') {
            that.setData({
              text: '已经到底啦'
            })
          }
          var arr = that.data.contentPsoting
          for (var i = 0; i < res.data.content.noReturnItem.items.length; i++) {
            res.data.content.noReturnItem.items[i].tradeTime = utils.formatTimeTwo(res.data.content.noReturnItem.items[i].tradeTime, 'Y-M-D h:m:s');
            if (res.data.content.noReturnItem.items[i].otherTransfer == 1) {
              res.data.content.noReturnItem.items[i].remark = "商品名称保护中"
            }else if (res.data.content.noReturnItem.items[i].code) {
              res.data.content.noReturnItem.items[i].remark = "购买—FreeBuy提期"
            }
            arr.push(res.data.content.noReturnItem.items[i])
          }
          that.setData({
            contentPsoting: arr,
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
    if (wx.getStorageSync('pageNumber2')) {
      that.setData({
        pageNumber2: wx.getStorageSync('pageNumber2')
      })
    }
    if (wx.getStorageSync('goWaitReentry')) {
      if (wx.getStorageSync('startMoney') || wx.getStorageSync('endMoney') || wx.getStorageSync('startTime') || wx.getStorageSync('endTime') || wx.getStorageSync('source') || wx.getStorageSync('pageNumber2')) {
        var startMoney = wx.getStorageSync('startMoney') ? wx.getStorageSync('startMoney') : ""
        var endMoney = wx.getStorageSync('endMoney') ? wx.getStorageSync('endMoney') : ""
        var startTime = new Date(wx.getStorageSync('startTime').replace(/-/g, "/")).getTime() ? new Date(wx.getStorageSync('startTime').replace(/-/g, "/")).getTime() : ""
        var endTime = new Date(wx.getStorageSync('endTime').replace(/-/g, "/")).getTime() ? new Date(wx.getStorageSync('endTime').replace(/-/g, "/")).getTime() : ""
        var source = wx.getStorageSync('source') ? wx.getStorageSync('source') : ""
        if (wx.getStorageSync('endTime')) {
          endTime = endTime + 86399999
        }
        app.Util.ajax('mall/forum/topic/findNoReturnPageList', {
          pageNumber: that.data.pageNumber2,
          pageSize: 10,
          startAmount: startMoney,
          endAmount: endMoney,
          startTime: startTime,
          endTime: endTime,
          source: source
        }, 'GET').then((res) => {
          if (res.data.content) {
            var arr = res.data.content.items
            for (let i of arr) {
              i.tradeTime = utils.formatTimeTwo(i.tradeTime, 'Y-M-D');
              if (i.otherTransfer == 1) {
                i.remark = "商品名称保护中"
              }else if (i.code) {
                i.remark = "购买—FreeBuy提期"
              }
            }
            that.setData({
              contentPsoting: arr
            })
            if (that.data.contentPsoting.length === 0) {
              that.setData({
                text: '暂无数据'
              })
            }else{
              that.setData({
                text: ''
              })
            }
          }
        })
      }
    }else if (wx.getStorageSync('goMentionPeriod')) {
      if (wx.getStorageSync('startMoney') || wx.getStorageSync('endMoney') || wx.getStorageSync('startTime') || wx.getStorageSync('endTime') || wx.getStorageSync('source') || wx.getStorageSync('pageNumber2')) {
        var startMoney = wx.getStorageSync('startMoney') ? wx.getStorageSync('startMoney') : ""
        var endMoney = wx.getStorageSync('endMoney') ? wx.getStorageSync('endMoney') : ""
        var startTime = new Date(wx.getStorageSync('startTime').replace(/-/g, "/")).getTime() ? new Date(wx.getStorageSync('startTime').replace(/-/g, "/")).getTime() : ""
        var endTime = new Date(wx.getStorageSync('endTime').replace(/-/g, "/")).getTime() ? new Date(wx.getStorageSync('endTime').replace(/-/g, "/")).getTime() : ""
        var source = wx.getStorageSync('source') ? wx.getStorageSync('source') : ""
        if (wx.getStorageSync('endTime')) {
          endTime = endTime + 86399999
        }
        app.Util.ajax('mall/personal/queryPendingReturnDetails', {
          pageNumber: that.data.pageNumber2,
          pageSize: 10,
          startAmount: startMoney,
          endAmount: endMoney,
          startTime: startTime,
          endTime: endTime,
          source: source,
          isMentionPeriod:1
        }, 'GET').then((res) => {
          if (res.data.content) {
            var arr = res.data.content.noReturnItem.items
            for (let i of arr) {
              i.tradeTime = utils.formatTimeTwo(i.tradeTime, 'Y-M-D');
              if (i.otherTransfer == 1) {
                i.remark = "商品名称保护中"
              }else if (i.code) {
                i.remark = "购买—FreeBuy提期"
              }
            }
            that.setData({
              contentPsoting: arr
            })
            if (that.data.contentPsoting.length === 0) {
              that.setData({
                text: '暂无数据'
              })
            }else{
              that.setData({
                text: ''
              })
            }
          }
        })
      }
    } else {
      if (wx.getStorageSync('startMoney') || wx.getStorageSync('endMoney') || wx.getStorageSync('startTime') || wx.getStorageSync('endTime') || wx.getStorageSync('source') || wx.getStorageSync('pageNumber2')) {
        var startMoney = wx.getStorageSync('startMoney') ? wx.getStorageSync('startMoney') : ""
        var endMoney = wx.getStorageSync('endMoney') ? wx.getStorageSync('endMoney') : ""
        var startTime = new Date(wx.getStorageSync('startTime').replace(/-/g, "/")).getTime() ? new Date(wx.getStorageSync('startTime').replace(/-/g, "/")).getTime() : ""
        var endTime = new Date(wx.getStorageSync('endTime').replace(/-/g, "/")).getTime() ? new Date(wx.getStorageSync('endTime').replace(/-/g, "/")).getTime() : ""
        var source = wx.getStorageSync('source') ? wx.getStorageSync('source') : ""
        if (wx.getStorageSync('endTime')) {
          endTime = endTime + 86399999
        }
        app.Util.ajax('mall/personal/queryPendingReturnDetails', {
          pageNumber: that.data.pageNumber2,
          pageSize: 10,
          startAmount: startMoney,
          endAmount: endMoney,
          startTime: startTime,
          endTime: endTime,
          source: source
        }, 'GET').then((res) => {
          if (res.data.content.noReturnItem) {
            var arr = res.data.content.noReturnItem.items
            for (let i of arr) {
              i.tradeTime = utils.formatTimeTwo(i.tradeTime, 'Y-M-D');
              if (i.otherTransfer == 1) {
                i.remark = "商品名称保护中"
                i.proStatus = 1
              }else if (i.code) {
                i.remark = "购买—FreeBuy提期"
              }
            }
            that.setData({
              content: arr
            })
            if (that.data.content.length === 0) {
              that.setData({
                text: '暂无数据'
              })
            } else{
              that.setData({
                text: ''
              })
            }
          }

        })
      }
    }
    if(wx.getStorageSync('toWaitReentry')){
      that.initDetail();
      setTimeout(function(){
        wx.removeStorageSync("toWaitReentry");
      },500)
    }
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
    wx.removeStorageSync("startMoney");
    wx.removeStorageSync("endMoney");
    wx.removeStorageSync("startTime");
    wx.removeStorageSync("endTime");
    wx.removeStorageSync("source");
    wx.removeStorageSync("pageNumber2");
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
    if (wx.getStorageSync('goWaitReentry')) {
      if (wx.getStorageSync('startMoney') || wx.getStorageSync('endMoney') || wx.getStorageSync('startTime') || wx.getStorageSync('endTime') || wx.getStorageSync('source')) {
        var startMoney = wx.getStorageSync('startMoney') ? wx.getStorageSync('startMoney') : ""
        var endMoney = wx.getStorageSync('endMoney') ? wx.getStorageSync('endMoney') : ""
        var startTime = new Date(wx.getStorageSync('startTime').replace(/-/g, "/")).getTime() ? new Date(wx.getStorageSync('startTime').replace(/-/g, "/")).getTime() : ""
        var endTime = new Date(wx.getStorageSync('endTime').replace(/-/g, "/")).getTime() ? new Date(wx.getStorageSync('endTime').replace(/-/g, "/")).getTime() : ""
        var source = wx.getStorageSync('source') ? wx.getStorageSync('source') : ""
        var pageNumber = that.data.pageNumber2 + 1
        app.Util.ajax('mall/forum/topic/findNoReturnPageList', {
          pageNumber: pageNumber,
          pageSize: 10,
          startAmount: startMoney,
          endAmount: endMoney,
          startTime: startTime,
          endTime: endTime,
          source: source
        }, 'GET').then((res) => {
          if (res.data.content) {
            if (res.data.content.items == '' && that.data.contentPsoting !== '') {
              that.setData({
                text: '已经到底啦'
              })
            }
            var arr = that.data.contentPsoting
            for (var i = 0; i < res.data.content.items.length; i++) {
              res.data.content.items[i].tradeTime = utils.formatTimeTwo(res.data.content.items[i].tradeTime, 'Y-M-D h:m:s');
              if (res.data.content.items[i].otherTransfer == 1) {
                res.data.content.items[i].remark = "商品名称保护中"
                res.data.content.items[i].proStatus = 1
              }else if (res.data.content.items[i].code) {
                res.data.content.items[i].remark = "购买—FreeBuy提期"
                res.data.content.items[i].proStatus = 1
              }
              arr.push(res.data.content.items[i])
            }
            that.setData({
              contentPsoting: arr,
              pageNumber: pageNumber
            })
          }
        })
      }else{
        that.getInitDetail1();
      }        
    }else if(wx.getStorageSync('goMentionPeriod')){
      if (wx.getStorageSync('startMoney') || wx.getStorageSync('endMoney') || wx.getStorageSync('startTime') || wx.getStorageSync('endTime') || wx.getStorageSync('source')) {
        var startMoney = wx.getStorageSync('startMoney') ? wx.getStorageSync('startMoney') : ""
        var endMoney = wx.getStorageSync('endMoney') ? wx.getStorageSync('endMoney') : ""
        var startTime = new Date(wx.getStorageSync('startTime').replace(/-/g, "/")).getTime() ? new Date(wx.getStorageSync('startTime').replace(/-/g, "/")).getTime() : ""
        var endTime = new Date(wx.getStorageSync('endTime').replace(/-/g, "/")).getTime() ? new Date(wx.getStorageSync('endTime').replace(/-/g, "/")).getTime() : ""
        var source = wx.getStorageSync('source') ? wx.getStorageSync('source') : ""
        var pageNumber = that.data.pageNumber2 + 1
        app.Util.ajax('mall/personal/queryPendingReturnDetails', {
          pageNumber: pageNumber,
          pageSize: 10,
          startAmount: startMoney,
          endAmount: endMoney,
          startTime: startTime,
          endTime: endTime,
          source: source
        }, 'GET').then((res) => {
          if (res.data.content) {
            if (res.data.content.noReturnItem.items == '' && that.data.contentPsoting !== '') {
              that.setData({
                text: '已经到底啦'
              })
            }
            var arr = that.data.contentPsoting
            for (var i = 0; i < res.data.content.noReturnItem.items.length; i++) {
              res.data.content.noReturnItem.items[i].tradeTime = utils.formatTimeTwo(res.data.content.noReturnItem.items[i].tradeTime, 'Y-M-D h:m:s');
              if (res.data.content.noReturnItem.items[i].otherTransfer == 1) {
                res.data.content.noReturnItem.items[i].remark = "商品名称保护中"
                res.data.content.noReturnItem.items[i].proStatus = 1
              }else if (res.data.content.noReturnItem.items[i].code) {
                res.data.content.noReturnItem.items[i].remark = "购买—FreeBuy提期"
                res.data.content.noReturnItem.items[i].proStatus = 1
              }
              arr.push(res.data.content.noReturnItem.items[i])
            }
            that.setData({
              contentPsoting: arr,
              pageNumber: pageNumber
            })
          }
        })
      }else{
        that.getInitDetail2();
      }        
    }else{
      if (wx.getStorageSync('startMoney') || wx.getStorageSync('endMoney') || wx.getStorageSync('startTime') || wx.getStorageSync('endTime') || wx.getStorageSync('source')) {
        var startMoney = wx.getStorageSync('startMoney') ? wx.getStorageSync('startMoney') : ""
        var endMoney = wx.getStorageSync('endMoney') ? wx.getStorageSync('endMoney') : ""
        var startTime = new Date(wx.getStorageSync('startTime').replace(/-/g, "/")).getTime() ? new Date(wx.getStorageSync('startTime').replace(/-/g, "/")).getTime() : ""
        var endTime = new Date(wx.getStorageSync('endTime').replace(/-/g, "/")).getTime() ? new Date(wx.getStorageSync('endTime').replace(/-/g, "/")).getTime() : ""
        var source = wx.getStorageSync('source') ? wx.getStorageSync('source') : ""
        var pageNumber = that.data.pageNumber2 + 1
        app.Util.ajax('mall/personal/queryPendingReturnDetails', {
          pageNumber: pageNumber,
          pageSize: 10,
          startAmount: startMoney,
          endAmount: endMoney,
          startTime: startTime,
          endTime: endTime,
          source: source
        }, 'GET').then((res) => {
          if (res.data.content) {
            if (res.data.content.noReturnItem.items == '' && that.data.content !== '') {
              that.setData({
                text: '已经到底啦'
              })
            }
            var arr = that.data.content
            for (var i = 0; i < res.data.content.noReturnItem.items.length; i++) {
              res.data.content.noReturnItem.items[i].tradeTime = utils.formatTimeTwo(res.data.content.noReturnItem.items[i].tradeTime, 'Y-M-D');
              if (res.data.content.noReturnItem.items[i].otherTransfer == 1) {
                res.data.content.noReturnItem.items[i].remark = "商品名称保护中"
                res.data.content.noReturnItem.items[i].proStatus = 1
              }else if (res.data.content.noReturnItem.items[i].code) {
                res.data.content.noReturnItem.items[i].remark = "购买—FreeBuy提期"
                res.data.content.noReturnItem.items[i].proStatus = 1
              }
              arr.push(res.data.content.noReturnItem.items[i])
            }
            that.setData({
              content: arr,
              pageNumber2: pageNumber
            })
          }
        })
      } else {
        that.getInitDetail();
      }
    }
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
  },
  //点击转让
  return: function(e) {
    console.log(e.currentTarget.dataset.money)
    var money = e.currentTarget.dataset.money
    var returnType = e.currentTarget.dataset.returntype
    var orderId = e.currentTarget.dataset.orderid
    var orderGoodsId = e.currentTarget.dataset.ordergoodsid
    var transferId = e.currentTarget.dataset.transferid
    var code = e.currentTarget.dataset.code
    this.setData({
      returnType: returnType,
      orderId: orderId,
      orderGoodsId: orderGoodsId,
      transferId: transferId,
      money: money,
      code:code
    })
    this.setData({
      returnOne: true,
    })
  },
  //跳转返现明细
  Reentry_detail: function(e) {
    var defaultAmountStatus = e.currentTarget.dataset.defaultamountstatus
    var code = e.currentTarget.dataset.code?e.currentTarget.dataset.code:''
    var whetherAdvanceSale = e.currentTarget.dataset.whetheradvancesale
    var orderId = e.currentTarget.dataset.orderid
    var orderGoodsId = e.currentTarget.dataset.ordergoodsid
    var transferId = e.currentTarget.dataset.transferid == null ? "" : e.currentTarget.dataset.transferid
    var proStatus = e.currentTarget.dataset.prostatus
    var newPeopleActivity = e.currentTarget.dataset.returntype==3?2:1
    if (proStatus == 1) {
      wx.navigateTo({
        url: "/pages/cashBack/cashBack?from=2&proStatus=1&orderId=" + orderId + "&orderGoodsId=" + orderGoodsId + "&transferId=" + transferId + "&newPeopleActivity=" + newPeopleActivity + "&whetherAdvanceSale="+whetherAdvanceSale + "&defaultAmountStatus="+defaultAmountStatus+ "&code="+code
      })
    } else {
      wx.navigateTo({
        url: "/pages/cashBack/cashBack?from=2&orderId=" + orderId + "&orderGoodsId=" + orderGoodsId + "&transferId=" + transferId+ "&newPeopleActivity=" + newPeopleActivity + "&whetherAdvanceSale="+whetherAdvanceSale + "&defaultAmountStatus="+defaultAmountStatus+ "&code="+code
      })
    }

  },
  //确认交易
  shure: function(e) {
    var transferId = e.currentTarget.dataset.transferid
    var avatarKey = e.currentTarget.dataset.avatarkey
    var nickname = e.currentTarget.dataset.nickname
    var returnAmount = e.currentTarget.dataset.returnamount
    var cycle = e.currentTarget.dataset.cycle
    var phone = e.currentTarget.dataset.phone
    var sellPrice = e.currentTarget.dataset.sellprice
    this.setData({
      transferId: transferId,
      avatarKey: avatarKey,
      nickname: nickname,
      returnAmount: returnAmount,
      cycle: cycle,
      phone: phone,
      sellPrice: sellPrice
    })
    //开启一次交易确认弹窗
    this.setData({
      shureOne: true
    })
  },
  //第一次确认关闭
  shureOneClose: function() {
    this.setData({
      shureOne: false
    })
  },
  //第二次确认关闭
  shureTwoClose: function() {
    this.setData({
      shureTwo: false,
      shure_two_tishi: ""
    })
  },
  //取消交易弹窗关闭
  shureOneCancle: function() {
    //关闭取消交易弹窗
    this.setData({
      shureTwo_cancle: false
    })
  },
  cancle_one: function() {
    //关闭第一次确认弹窗,并开启确认取消交易弹窗
    var that = this

    this.setData({
      shureOne: false,
      shureTwo_cancle: true
    })
  },
  shure_one: function() {
    //关闭第一次确认弹窗,并开启第二次确认弹窗
    this.setData({
      shureOne: false,
      shureTwo: true
    })
  },
  cancle_two: function() {
    //关闭第二次确认弹窗
    this.setData({
      shureTwo: false,
      shure_two_tishi: "",
      shureOne: true
    })
  },
  shure_two: function(e) {
    if(e.currentTarget.dataset.presalestatus==5){
      wx.showToast({
        title:'卖方还未支付剩余订单金额，请耐心等候',
        icon:'none'
      })
    }else{
      var that = this
      that.setData({
        transferId:e.currentTarget.dataset.transferid?e.currentTarget.dataset.transferid:that.data.transferId,
        passwordType: 1,
        shure_two_tishi: ""
      })
      //开启密码输入
      // console.log("输入密码")
      app.Util.ajax('mall/account/paymentPassword/status', 'GET').then((res) => { // 使用ajax函数
        if (res.messageCode = 'MSG_1001') {
          if (res.data.content == 2) {
            //未设置密码
            that.setData({
              showPassword: true
            })
          } else {
            //已设置密码
            that.setData({
              show: true,
              isFocus: true
            })
          }
        }
      })
    }
  },
  shureTwo_cancle: function() {
    //关闭取消交易弹窗
    var that = this
    app.Util.ajax('mall/transfer/transferHandle', {
      transferId: that.data.transferId,
      type: 2
    }, 'POST').then((res) => { // 使用ajax函数
      // console.log(JSON.stringify(res))
      if (res.messageCode = 'MSG_1001') {
        this.setData({
          shureTwo_cancle: false,
          pageNumber: 1,
          pageSize: 10
        })
        wx.showToast({
          title: '取消成功',
          icon: "none"
        })
        setTimeout(function() {
          that.initDetail();
        }, 500)
      } else {
        wx.showToast({
          title: res.data.message,
          icon: "none",
        })
      }
    })
  },
  shureTwo_loding: function() {
    //关闭取消交易弹窗,并开启第一次确认弹窗
    this.setData({
      shureTwo_cancle: false,
      shureOne: true
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
      if (that.data.passwordType == 1) {
        app.Util.ajax('mall/transfer/transferHandle', {
          transferId: that.data.transferId,
          type: 1,
          paymentPassword: e.detail.value
        }, 'POST').then((res) => { // 使用ajax函数
          // console.log(JSON.stringify(res))
          if (res.data.messageCode == 'MSG_1001') {
            wx.showToast({
              title: "支付成功，请在待返明细中查看待返",
              icon: "none",
            })
            that.setData({
              shureTwo: false,
              show: false,
              Value: "",
              pageNumber: 1,
              pageSize: 10,
              text: ""
            })
            setTimeout(function() {
              that.initDetail();
            }, 1000)
          } else {
            wx.showToast({
              title:res.data.message,
              icon:'none'
            })
            that.setData({
              // shure_two_tishi: res.data.message,
              show: false,
              Value: ""
            })
          }
        })
      } else {
        console.log("aa"+that.data.transferId)
        app.Util.ajax('mall/transfer/initiateTransfer', {
          mobileNumber: that.data.mobileNumber,
          inviterCode: that.data.inviterCode,
          sellPrice: that.data.sellPrice,
          returnType: that.data.returnType,
          orderId: that.data.orderId,
          orderGoodsId: that.data.orderGoodsId,
          transferId: that.data.transferId,
          paymentPassword: e.detail.value,
          code:that.data.code
        }, 'POST').then((res) => {
          // console.log(22+JSON.stringify(res))
          if (res.data.messageCode == "MSG_1001") {
            that.setData({
              show: false,
              returnTwo: false,
              Value: "",
              pageNumber: 1,
              pageSize: 10,
              text: ""
            })
            wx.showToast({
              title: "转让成功",
              icon: "none"
            })
            setTimeout(function() {
              that.initDetail();
            }, 500)
          } else {
            wx.showToast({
              title: res.data.message,
              icon: "none"
            })
            that.setData({
              show: false,
              Value: ""
            })
          }
        })
      }


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
    // wx.navigateTo({
    //   url: `/pages/myorder/myorder?status=${1}`
    // })
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
  waitReentryClose: function() {
    this.setData({
      waitReentry: false
    })
    this.returnInfo6()
  },
  waitReentryClose2: function() {
    this.setData({
      waitReentry2: false
    })
    this.returnInfo2()
  },
  waitReentryClose3: function() {
    this.setData({
      waitReentry3: false
    })
  },
  //关闭转让二次确认弹窗
  returnTwoClose: function() {
    this.setData({
      returnTwo: false,
    })
  },
  //关闭转让信息填写弹窗
  returnOneClose: function() {
    this.setData({
      returnOne: false,
    })
  },
  //开启转让二次确认弹窗
  return_one: function(e) {
    var that = this
    that.setData({
      mobileNumber: e.detail.value.phonenumber,
      inviterCode: e.detail.value.incode,
      sellPrice: e.detail.value.price,
    })
    var reg = /^\d{0,5}([\b]*|\.|\.\d{0,2}|$)$/
    var reg2 = /^(?!(0[0-9]{0,}$))[0-9]{1,}[.]{0,}[0-9]{0,}$/
    // console.log(e.detail.value)
    if (e.detail.value.phonenumber == '' || !(/^1[3456789]\d{9}$/.test(e.detail.value.phonenumber))) {
      wx.showToast({
        title: '请填写正确的手机号码',
        icon: 'none'
      })
    } else if (e.detail.value.incode == '') {
      wx.showToast({
        title: '请填写邀请码',
        icon: 'none'
      })
    } else if (e.detail.value.price == '') {
      wx.showToast({
        title: '请填写出售价格',
        icon: 'none'
      })
    } else if (e.detail.valuephoneNumber !== '' && e.detail.value.incode !== '' && e.detail.value.price !== '') {
      if (e.detail.value.price > that.data.money) {
        wx.showToast({
          title: "出售价格不能大于待返金额",
          icon: 'none'
        })
      } else {
        if (reg.test(e.detail.value.price) && reg2.test(e.detail.value.price) || e.detail.value.price == 0) {
          app.Util.ajax('mall/transfer/gainServiceCharge', {
            mobileNumber: e.detail.value.phonenumber,
            inviterCode: e.detail.value.incode,
            sellPrice: e.detail.value.price,
          }, 'POST').then((res) => {
            if (res.data.messageCode == "MSG_1001") {
              this.setData({
                service_charge: res.data.content,
                returnOne: false,
                returnTwo: true,
              })
            } else {
              wx.showToast({
                title: res.data.message,
                icon: "none"
              })
            }
          })
        } else {
          wx.showToast({
            title: '请填写正确的出售价格',
            icon: 'none'
          })
        }
      }

    }
  },
  //转让信息弹窗查询
  returnInfo: function() {
    var that = this
    app.Util.ajax('mall/transfer/gainNotice', null, 'GET').then((res) => {
      if (res.data.content.length > 0) {
        that.setData({
          tempInfo: res.data.content
        })
        for (let i of res.data.content) {
          if (i.type == 2) {
            //转让完成消息
            that.setData({
              waitReentry2: true,
              returnContent2: i.userItems
            })
          }
        }
        if (that.data.waitReentry2 == false) {
          for (let i of res.data.content) {
            if (i.type == 3) {
              //转让取消消息
              that.setData({
                waitReentry: true,
                returnContent: i.userItems
              })
            }
          }
        }
        if (that.data.waitReentry == false) {
          for (let i of res.data.content) {
            if (i.type == 4) {
              //转让撤销消息
              that.setData({
                returnCanclePeople: true,
                returnContent3: i.userItems
              })
            }
          }
        }
        if (that.data.returnCanclePeople == false) {
          for (let i of res.data.content) {
            if (i.type == 1) {
              //转让消息
              that.setData({
                waitReentry3: true,
              })
            }
          }
        }
      }
    })
  },
  returnInfo2: function() {
    var that = this
    if (that.data.tempInfo.length > 0) {
      for (let i of that.data.tempInfo) {
        if (i.type == 3) {
          //转让取消消息
          that.setData({
            waitReentry: true,
            returnContent: i.userItems
          })
        }
      }
      if (that.data.waitReentry == false) {
        for (let i of that.data.tempInfo) {
          if (i.type == 4) {
            //转让消息
            that.setData({
              returnCanclePeople: true,
            })
          }
        }
      }

    }
  },
  returnInfo6: function() {
    var that = this
    if (that.data.tempInfo.length > 0) {
      for (let i of that.data.tempInfo) {
        if (i.type == 4) {
          //转让取消消息
          that.setData({
            waitReentry: true,
            returnContent3: i.userItems
          })
        }
      }
      if (that.data.waitReentry == false) {
        for (let i of that.data.tempInfo) {
          if (i.type == 1) {
            //转让消息
            that.setData({
              returnCanclePeople: true,
            })
          }
        }
      }

    }
  },
  returnInfo3: function() {
    var that = this
    if (that.data.tempInfo.length > 0) {
      for (let i of that.data.tempInfo) {
        if (i.type == 1) {
          //转让消息
          that.setData({
            waitReentry3: true,
          })
        }
      }
    }
  },
  return_two: function(e) {
    var that = this
    var id = e.currentTarget.dataset.id?e.currentTarget.dataset.id:that.data.transferId
    that.setData({
      passwordType: 2,
      transferId: id
    })
    // console.log("输入密码")
    app.Util.ajax('mall/account/paymentPassword/status', 'GET').then((res) => { // 使用ajax函数
      if (res.messageCode = 'MSG_1001') {
        if (res.data.content == 2) {
          //未设置密码
          that.setData({
            showPassword: true
          })
        } else {
          //已设置密码
          that.setData({
            show: true,
            isFocus: true
          })
        }
      }
    })

  },
  return_lod: function() {
    wx.showToast({
      title: "对方正在确认，可通过上方电话联系购买人",
      icon: "none"
    })
  },
  getChoose: function(e) {
    var that = this
    console.log(e.currentTarget.dataset.aa)
    if (e.currentTarget.dataset.aa == 1) {
      that.setData({
        index1: 1
      })
    } else if (e.currentTarget.dataset.aa == 2) {
      that.setData({
        index1: 2
      })
    } else if (e.currentTarget.dataset.aa == 3) {
      that.setData({
        index1: 3
      })
    } else if (e.currentTarget.dataset.aa == 4) {
      that.setData({
        index1: 4
      })
    }
  },
  chooseOneShure: function() {
    var that = this
    that.setData({
      choose1: false
    })
    if (that.data.index1 == 4) {
      wx.removeStorageSync("source");
      if (!wx.getStorageSync('goWaitReentry')){
        app.Util.ajax('mall/personal/queryPendingReturnDetails', {
          pageNumber: 1,
          pageSize: 10,
          source: ''
        }, 'GET').then((res) => {
          if (res.data.content.noReturnItem) {
            var arr = res.data.content.noReturnItem.items
            for (let i of arr) {
              i.tradeTime = utils.formatTimeTwo(i.tradeTime, 'Y-M-D');
              if (i.otherTransfer == 1) {
                i.remark = "商品名称保护中"
                i.proStatus = 1
              }
            }
            that.setData({
              content: arr
            })
            if (that.data.content.length === 0) {
              that.setData({
                text: '暂无数据'
              })
            } else {
              that.setData({
                text: ''
              })
            }
          }
        })
      }else{
        app.Util.ajax('mall/forum/topic/findNoReturnPageList', {
          pageNumber: 1,
          pageSize: 10,
          source: ''
        }, 'GET').then((res) => {
          if (res.data.content) {
            var arr = res.data.content.items
            for (let i of arr) {
              i.tradeTime = utils.formatTimeTwo(i.tradeTime, 'Y-M-D');
            }
            that.setData({
              contentPsoting: arr
            })
            if (that.data.contentPsoting.length === 0) {
              that.setData({
                text: '暂无数据'
              })
            } else {
              that.setData({
                text: ''
              })
            }
          }
        })
      }    
    } else {
      if (!wx.getStorageSync('goWaitReentry')){
        wx.setStorageSync("source", that.data.index1)
        app.Util.ajax('mall/personal/queryPendingReturnDetails', {
          pageNumber: 1,
          pageSize: 10,
          source: that.data.index1
        }, 'GET').then((res) => {
          if (res.data.content.noReturnItem) {
            var arr = res.data.content.noReturnItem.items
            for (let i of arr) {
              i.tradeTime = utils.formatTimeTwo(i.tradeTime, 'Y-M-D');
              if (i.otherTransfer == 1) {
                i.remark = "商品名称保护中"
                i.proStatus = 1
              }
            }
            that.setData({
              content: arr
            })
            if (that.data.content.length === 0) {
              that.setData({
                text: '暂无数据'
              })
            } else {
              that.setData({
                text: ''
              })
            }
          }
        })
      }else{
        app.Util.ajax('mall/forum/topic/findNoReturnPageList', {
          pageNumber: 1,
          pageSize: 10,
          source: that.data.index1
        }, 'GET').then((res) => {
          if (res.data.content) {
            var arr = res.data.content.items
            for (let i of arr) {
              i.tradeTime = utils.formatTimeTwo(i.tradeTime, 'Y-M-D');
            }
            that.setData({
              contentPsoting: arr
            })
            if (that.data.contentPsoting.length === 0) {
              that.setData({
                text: '暂无数据'
              })
            } else {
              that.setData({
                text: ''
              })
            }
          }
        })
      }     
    }
  },
  showChoose1: function() {
    var that = this
    that.setData({
      choose1: true
    })
  },
  closewChoose1: function() {
    var that = this
    that.setData({
      choose1: false
    })
  },
  toChooseMoney: function() {
    wx.navigateTo({
      url: "/pages/chooseMoney/chooseMoney"
    })
  },
  toChooseTime: function() {
    wx.navigateTo({
      url: "/pages/chooseTime/chooseTime"
    })
  },
  returnCancle: function() {
    var that = this
    app.Util.ajax('mall/transfer/sellerCancel', {
      transferId: that.data.cancleTransferId,
      type: 2
    }, 'POST').then((res) => {
      if (res.data.messageCode == "MSG_1001") {
        wx.showToast({
          title: '撤销成功',
          icon: 'none'
        })
        setTimeout(function() {
          that.initDetail();
        }, 500)
      } else {
        wx.showToast({
          title: res.data.message,
          icon: 'none'
        })
      }
    })
    that.setData({
      returnCancle: false
    })
  },
  returnCancleClose: function() {
    var that = this
    that.setData({
      returnCancle: false
    })
  },
  returnCancleShow: function(e) {
    var that = this
    var cancleTransferId = e.currentTarget.dataset.transferid
    console.log(cancleTransferId)
    that.setData({
      cancleTransferId: cancleTransferId,
      returnCancle: true
    })
  },
  returnCanclePeople: function() {
    var that = this
    that.setData({
      returnCanclePeople: false
    })
    that.returnInfo3()
  },
  sellClose1:function(){
    this.setData({
      sellOneStatus:false
    })
  },
  sellClose2:function(){
    this.setData({
      sellTwoStatus:false
    })
  },
  cancelPreSell:function(e){
    var preSaleStatus = e.currentTarget.dataset.presalestatus
    var orderId = e.currentTarget.dataset.orderid
    if(preSaleStatus==1||preSaleStatus==2){
      //订单未预订
      this.setData({
        sellOneStatus:true,
        orderId:orderId
      })
    }else if(preSaleStatus==3||preSaleStatus==4){
      //订单已预订
      this.setData({
        sellTwoStatus:true,
        orderId:orderId
      })
    }
  },
  shureCanclePre:function(){
    var that = this
    app.Util.ajax('mall/order/cancelOrderAdvanceSale', {
      orderId: that.data.orderId
    }, 'POST').then((res) => {
      if(res.data.messageCode=="MSG_1001"){
        that.setData({
          sellTwoStatus:false,
          sellOneStatus:false,
          pageNumber: 1,
          pageSize: 10
        })
        wx.showToast({
          title: '撤销成功',
          icon: 'none'
        })
        setTimeout(function() {
          that.initDetail();
        }, 500)
      }else{
        wx.showToast({
          title: res.data.message,
          icon: 'none'
        })
      }
    })
  },
    //卖家支付尾款
    toPay: function(e) {
      var orderId = e.currentTarget.dataset.orderid
      var id = e.currentTarget.dataset.id
      wx.navigateTo({
        url: `/pages/paymentorder/paymentorder?orderId=${orderId}&id=${id}&amount3=1`,
      })
    },
    sticky:function(e){
      let that = this
      let returnType = e.currentTarget.dataset.returntype
      let orderId = e.currentTarget.dataset.orderid
      let orderGoodsId = e.currentTarget.dataset.ordergoodsid
      let transferId = e.currentTarget.dataset.transferid
      let code = e.currentTarget.dataset.code
      app.Util.ajax('mall/personal/pendingReturnIsTop', {
        returnType:returnType,
        orderId: orderId,
        orderGoodsId:orderGoodsId,
        transferId:transferId,
        code:code
      }, 'POST').then((res) => {
        if(res.data.messageCode=="MSG_1001"){
          that.setData({
            pageNumber: 1,
            pageSize: 10
          })
          wx.showToast({
            title: '置顶成功',
            icon: 'none'
          })
          setTimeout(function() {
            that.initDetail();
          }, 500)
        }else{
          wx.showToast({
            title: res.data.message,
            icon: 'none'
          })
        }
      })
    },
    toMentionPeriod:function(e){
      let that = this
      wx.setStorage({
        key: "waitReentry",
        data: that.data.content[e.currentTarget.dataset.index]
      })
      app.globalData.mentionPeriodFrom = 2
      wx.navigateTo({
        url: '/packageA/pages/mentionPeriod/mentionPeriod'
      })
    }
})