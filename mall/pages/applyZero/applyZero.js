// pages/applyZero/applyZero.js
var time = require('../../utils/util.js');
let app = getApp()
var newCount = true //节流阀-限制购买提交次数
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sponsorShow: false,
    sponsor: 0,
    buyType: 1,
    showPeriod: false, //想要的分期月数
    showDialog: false, //返现明细表
    showModal: false, //利息明细表
    showStop: false, //可随时终止
    showGet: false, //怎么赚的钱
    status: 1, //我要平台弹框是否点击自定义
    isFocus: false, //是否自动聚焦
    buttonText: '加入购物车',
    buttonText2: '下一步',
    disabled: true, //分期返现月数input是否禁用
    goodsMsg: {}, //页面初始化需要传的数据
    cashMsg: {}, //页面初始化分期数据
    payMsg: {}, //需要支付的金额
    reviseStatus: 0,
    reviseStatus2: 0,
    reviseStatus3: 1,
    shoppingcartgoodsid: 0,
    expectedAmount: 0,
    cashbackperiods: 0,
    monthStatus: false,
    expectedAmountStatus: false,
    expectedAmountNumber: 0,
    monthNumber: 0,
    monthInput: "请输入分期数",
    expectedAmountInput: "请输入最终成本价",
    inputBorder: "border: #DBDBDB 2rpx solid;",
    expectedAmountNumbertemp: 0,
    monthNumbertemp: 0,
    newPeopleActivity: 1, //新人专区跳转页面状态
    activityId: null,
    hostUrl: app.Util.getUrlImg().hostUrl,
    isShowBook: 0,
    yuShow: false,
    freeBuyMode: 2, //0元购类型，1-月返，2-天天返
    yindao1:false,
    yindao2:false
  },
  //跳转到服务问题页面
  goIntoProblem: function(e) {
    wx.navigateTo({
      url: '/packageA/pages/serviceProblem/serviceProblem',
    })
  },
  //立即体验
  experience: function(e) {
    var that = this
    //引导服务页面
    if (wx.getStorageSync('experienceStatus')) {
      if (that.data.newPeopleActivity == 2) {
        if (newCount) {
          newCount = false
          wx.navigateTo({
            url: '/pages/placeorder/placeorder?activityGoodsId=' + that.data.options.activityGoodsId + '&&buyType=' + that.data.buyType + '&&stockId=' + that.data.options.stockId + '&&quantity=' + that.data.options.quantity + '&&newPeopleActivity=' + that.data.options.newPeopleActivity + '&&isShowBook=' + 2
          })
        }
        setTimeout(function() {
          newCount = true
        }, 1000)
      } else {
        if (newCount) {
          newCount = false
          if (that.data.activityId) {
            wx.navigateTo({
              url: '/pages/placeorder/placeorder?goodsId=' + this.data.goodsMsg.goodsId + '&&activityId=' + that.data.activityId + '&&stockId=' + this.data.goodsMsg.stockId + '&&quantity=' + this.data.goodsMsg.quantity + '&&goodsType=applyZero' + '&&needPaymentAmount=' + this.data.payMsg.needPaymentAmount + '&&cashBackPeriods=' + this.data.cashMsg.cashBackPeriods + '&&expectedAmount=' + this.data.cashMsg.expectedAmount + '&&buyType=' + this.data.buyType + '&&isShowBook=' + 2
            })
          } else {
            wx.navigateTo({
              url: '/pages/placeorder/placeorder?goodsId=' + this.data.goodsMsg.goodsId + '&&stockId=' + this.data.goodsMsg.stockId + '&&quantity=' + this.data.goodsMsg.quantity + '&&goodsType=applyZero' + '&&needPaymentAmount=' + this.data.payMsg.needPaymentAmount + '&&cashBackPeriods=' + this.data.cashMsg.cashBackPeriods + '&&expectedAmount=' + this.data.cashMsg.expectedAmount + '&&buyType=' + this.data.buyType + '&&isShowBook=' + 2
            })
          }
        }
        setTimeout(function() {
          newCount = true
        }, 1000)
      }
    } else {
      that.setData({
        yuShow: true
      })
      wx.setStorageSync('experienceStatus', 1)
    }
  },
  noNeed: function(e) {
    var that = this
    that.setData({
      yuShow: false
    })
    wx.setStorageSync('experienceStatus', 1)
  },
  need: function(e) {
    var that = this
    that.setData({
      yuShow: false
    })
    wx.setStorageSync('experienceStatus', 1)
    wx.navigateTo({
      url: '/packageA/pages/serviceProblem/serviceProblem',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    //0成本购引导3
    if(app.globalData.freeBuyYinDao==1){
      that.setData({
        yindao1:true
      })
    }
    if (options.isShowBook == 2) {
      that.setData({
        isShowBook: 2
      })
    } else {
      that.setData({
        isShowBook: 1
      })
    }
    //购买省钱帖初始化
    if (options.getOrder) {
      var arr = JSON.parse(options.getOrder)
      var obj = {}
      obj.goodsId = arr.goodsid
      obj.stockId = arr.stock
      obj.quantity = arr.quantity
      that.setData({
        goodsMsg: obj,
        options: arr,
        getOrder: options.getOrder
      })
      that.getInit(obj.stockId)
    } else if (options.newPeopleActivity == 2 && options.newPeople == 1) {
      that.setData({
        newPeopleActivity: options.newPeopleActivity,
        options: options
      })
      if (options.buyType) {
        that.setData({
          buyType: options.buyType
        })
      }
      that.newPeopleCompute(options.activityGoodsId, options.stockId, options.quantity)
    } else {
      if (options.sponsor) {
        //赞助页面初始化
        that.setData({
          sponsor: options.sponsor,
          stockId: options.stockId,
          supportCount: options.supportCount
        })
      }
      //申请0元购初始化初始化
      if (options.buyType) {
        that.setData({
          buyType: options.buyType
        })
      }
      //申请0元购初始化初始化
      if (options.activityId) {
        that.setData({
          activityId: options.activityId
        })
      }
      if (options.arr) {
        var arr = JSON.parse(options.arr)
        var obj = {}
        obj.goodsId = arr.goodsid
        obj.stockId = arr.stockid
        obj.quantity = arr.quantity
        that.setData({
          goodsMsg: obj,
          reviseStatus: 1,
          shoppingcartgoodsid: arr.shoppingcartgoodsid,
          cashbackperiods: arr.cashbackperiods,
          expectedAmount: arr.expectedAmount,
        })
        that.getInit(obj.stockId)
      } else {
        if (options.reviseStatus2) {
          var obj = JSON.parse(options.detailObj)
          that.setData({
            goodsMsg: obj,
            reviseStatus2: options.reviseStatus2,
            shoppingcartgoodsid: options.shoppingcartgoodsid
          })
          that.getInit(obj.stockId)
        } else {
          var obj = {}
          obj.goodsId = options.goodsId
          obj.stockId = options.stockId
          obj.quantity = options.quantity
          that.setData({
            goodsMsg: obj
          })
          that.getInit(obj.stockId)
        }
      }
    }
  },
  //请求初始化数据
  getInit: function(stockId) {
    var that = this
    app.Util.ajax('mall/freeShopping/request/default', {
      stockId: stockId
    }, 'GET').then((res) => {
      //获取页面分期判断数据
      if (res.data.messageCode == 'MSG_1001') {
        //计算需要支付的金额
        if (that.data.cashbackperiods!==0&&that.data.cashbackperiods !== res.data.content.cashbackperiods) {
          //从购物车进来，查看0元购
          that.compute2(that.data.expectedAmount, that.data.cashbackperiods);
          var tempList = res.data.content;
          tempList.expectedAmount = that.data.expectedAmount
          tempList.cashBackPeriods = that.data.cashbackperiods
          that.setData({
            cashMsg: tempList
          })
        } else {
          //初始化
          that.setData({
            cashMsg: res.data.content
          })
          that.compute();
        }

      } else {
        wx.showToast({
          title: res.data.message,
          icon: 'none',
          duration: 1000
        })
      }
    })
  },
  //新人专区计算
  newPeopleCompute: function(activityGoodsId, stockId, quantity) {
    var that = this
    app.Util.ajax('mall/newPeople/calculate', {
      stockId: Number(stockId),
      quantity: Number(quantity),
      activityGoodsId: Number(activityGoodsId)
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
        that.setData({
          payMsg: res.data.content
        })
      } else {
        wx.showToast({
          title: res.data.message,
          icon: 'none',
          duration: 1000
        })
      }
    })
    //获取利率
    app.Util.ajax('mall/paramConfig/getParamConfigByKey', {
      key: "USER_INTEREST_RATIO"
    }, 'GET').then((res) => {
      if (res.data.messageCode == 'MSG_1001') {
        that.setData({
          interestRate: res.data.content.value
        })
      }
    })
  },
  //赞助初始化函数
  sponsorInit: function(stockId) {

  },
  //分期的月数弹框(出现)
  periodMonth: function() {
    var that = this;
    that.setData({
      showPeriod: true
    })

  },
  //分期的月数弹框(隐藏)
  cancelPeriod: function() {
    var that = this;
    that.setData({
      showPeriod: false
    })
  },
  //自定义月数
  custom: function() {
    var that = this;
    that.setData({
      showPeriod: false,
      status: 0,
      monthStatus: true
    })
  },
  //获取分期月数的值
  getMonthText: function(e) {
    var that = this
    var cashMsg = that.data.cashMsg
    cashMsg.cashBackPeriods = e.currentTarget.dataset.text
    that.setData({
      showPeriod: false,
      cashMsg: cashMsg,
      monthNumbertemp: e.currentTarget.dataset.text
    })
    that.monthButton()
  },
  //获取我想花输入框的值
  wantAmount: function(e) {
    var that = this
    var cashMsg = that.data.cashMsg
    cashMsg.expectedAmount = e.detail.value
  },
  //自定义分期数
  needAmount: function(e) {
    var that = this
    var cashMsg = that.data.cashMsg
    cashMsg.cashBackPeriods = e.detail.value
  },
  //计算支付的金额
  compute: function() {
    var that = this
    var orderType;
    if (that.data.activityId) {
      orderType = 19
    } else {
      if (that.data.sponsor == 1) {
        orderType = 14
      } else {
        orderType = 7
      }
    }
    if (that.data.activityId) {
      app.Util.ajax('mall/freeShopping/request/calculate', {
        stockId: Number(that.data.goodsMsg.stockId),
        quantity: Number(that.data.goodsMsg.quantity),
        expectedAmount: that.data.cashMsg.expectedAmount,
        cashBackPeriods: that.data.cashMsg.cashBackPeriods,
        orderType: orderType,
        activityId: parseInt(that.data.activityId)
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
          that.setData({
            payMsg: res.data.content
          })
        } else {
          wx.showToast({
            title: res.data.message,
            icon: 'none',
            duration: 1000
          })
        }
      })
    } else {
      app.Util.ajax('mall/freeShopping/request/calculate', {
        stockId: Number(that.data.goodsMsg.stockId),
        quantity: Number(that.data.goodsMsg.quantity),
        expectedAmount: that.data.cashMsg.expectedAmount,
        cashBackPeriods: that.data.cashMsg.cashBackPeriods,
        orderType: orderType
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
          that.setData({
            payMsg: res.data.content
          })
        } else {
          wx.showToast({
            title: res.data.message,
            icon: 'none',
            duration: 1000
          })
        }
      })
    }

  },
  compute2: function(expectedAmount, cashBackPeriods) {
    var that = this
    app.Util.ajax('mall/freeShopping/request/calculate', {
      stockId: Number(that.data.goodsMsg.stockId),
      quantity: Number(that.data.goodsMsg.quantity),
      expectedAmount: expectedAmount,
      cashBackPeriods: cashBackPeriods,
      orderType: that.data.sponsor == 1 ? 14 : 7
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
        that.setData({
          payMsg: res.data.content
        })
      } else {
        wx.showToast({
          title: res.data.message,
          icon: 'none',
          duration: 1000
        })
      }
    })
  },
  addOrCompute: function() {
    var that = this
    if (that.data.isShowBook == 2) {
      wx.showToast({
        title: '预售订单无法加入购物车，如需加入购物车请单独购买。',
        icon: 'none'
      })
    } else {
      if (that.data.reviseStatus == 1 || that.data.reviseStatus2 == 1) {
        app.Util.ajax('mall/cart/updateShoppingCartApply', {
          shoppingCartGoodsId: that.data.shoppingcartgoodsid, //修改购物车的id
          expectedAmount: that.data.cashMsg.expectedAmount, //用户预期花费
          cashBackPeriods: that.data.cashMsg.cashBackPeriods //返现期数
        }, 'GET').then((res) => {
          if (res.data.messageCode == "MSG_1001") {
            wx.showToast({
              title: '修改成功',
              icon: 'none'
            })

          } else {
            wx.showToast({
              title: '修改失败,请稍后再试',
              icon: 'none'
            })
          }
        })
      } else {
        app.Util.ajax('mall/cart/addShoppingCart', {
          goodsId: that.data.goodsMsg.goodsId,
          stockId: that.data.goodsMsg.stockId,
          quantity: that.data.goodsMsg.quantity,
          expectedAmount: that.data.cashMsg.expectedAmount, //用户预期花费
          cashBackPeriods: that.data.cashMsg.cashBackPeriods //返现期数
        }, 'POST').then((res) => { // 使用ajax函数
          if (res.data.messageCode === 'MSG_1001') {
            if (that.data.num > that.data.quantity) {
              wx.showToast({
                title: '已超出最大库存',
                icon: 'none'
              })
            } else if (that.data.num < 1) {
              wx.showToast({
                title: '不能再少了哟',
                icon: 'none'
              })
            } else {
              wx.showToast({
                title: '添加商品成功',
                icon: 'none'
              })
              that.setData({
                showModalStatus: false,
                num: 1
              })
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
  },
  //返现明细弹框(出现)
  returnDetail: function() {
    var that = this;
    that.setData({
      showDialog: true
    })
  },
  //返现明细弹框(隐藏)
  cancelDialog: function() {
    var that = this;
    that.setData({
      showDialog: false
    })
  },
  //利息明细弹框(出现)
  interestDetail: function() {
    var that = this;
    that.setData({
      showModal: true
    })
  },
  //利息明细弹框(隐藏)
  cancelModal: function() {
    var that = this;
    that.setData({
      showModal: false
    })
  },
  //可随时终止(出现)
  stopZero: function() {
    var that = this;
    that.setData({
      showStop: true
    })
  },
  //可随时终止(隐藏)
  cancelStop: function() {
    var that = this;
    that.setData({
      showStop: false
    })
  },
  //期限(隐藏)
  monthStop: function() {
    var that = this;
    that.setData({
      monthStatus: false,
      cashMsg: that.data.cashMsg
    })
  },
  //期限(显示)
  monthShow: function() {
    var that = this;
    that.setData({
      monthStatus: true
    })
  },
  //预期金额(隐藏)
  expectedAmountStop: function() {
    var that = this;
    that.setData({
      expectedAmountStatus: false,
      cashMsg: that.data.cashMsg
    })
  },
  //预期金额(显示)
  expectedAmountShow: function() {
    var that = this;
    that.setData({
      expectedAmountStatus: true
    })
  },
  //怎么赚的钱(出现)
  payNum: function() {
    var that = this
    that.setData({
      showGet: true
    })
  },
  //怎么赚的钱(隐藏)
  cancelGet: function() {
    var that = this
    that.setData({
      showGet: false
    })
  },
  understand: function() {
    var that = this
    that.setData({
      showGet: false
    })
  },
  //刷新计算
  refurbish: function() {
    var that = this
    var orderType;
    if (that.data.activityId) {
      orderType = 19
    } else {
      if (that.data.sponsor == 1) {
        orderType = 14
      } else {
        orderType = 7
      }
    }
    if (that.data.activityId) {
      app.Util.ajax('mall/freeShopping/request/calculate', {
        stockId: Number(that.data.goodsMsg.stockId),
        quantity: Number(that.data.goodsMsg.quantity),
        expectedAmount: that.data.cashMsg.expectedAmount,
        cashBackPeriods: that.data.cashMsg.cashBackPeriods,
        orderType: orderType,
        activityId: parseInt(that.data.activityId)
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
          var obj = that.data.cashMsg
          that.setData({
            cashMsg: obj,
            payMsg: res.data.content,
            reviseStatus3: 1
          })
          wx.showToast({
            title: '刷新计算成功',
            icon: 'none',
            duration: 2000
          })
        } else if (res.data.messageCode == 'MSG_4001') {
          wx.showToast({
            title: res.data.message,
            icon: 'none',
            duration: 2000
          })
        }
      })
    } else {
      app.Util.ajax('mall/freeShopping/request/calculate', {
        stockId: Number(that.data.goodsMsg.stockId),
        quantity: Number(that.data.goodsMsg.quantity),
        expectedAmount: that.data.cashMsg.expectedAmount,
        cashBackPeriods: that.data.cashMsg.cashBackPeriods,
        orderType: orderType
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
          var obj = that.data.cashMsg
          that.setData({
            cashMsg: obj,
            payMsg: res.data.content,
            reviseStatus3: 1
          })
          wx.showToast({
            title: '刷新计算成功',
            icon: 'none',
            duration: 2000
          })
        } else if (res.data.messageCode == 'MSG_4001') {
          wx.showToast({
            title: res.data.message,
            icon: 'none',
            duration: 2000
          })
        }
      })
    }
  },
  //自定义输入点击计
  payNow: function() {
    var that = this;
    if (newCount) {
      newCount = false
      if (that.data.activityId) {
        wx.navigateTo({
          url: '/pages/placeorder/placeorder?goodsId=' + this.data.goodsMsg.goodsId + '&&activityId=' + that.data.activityId + '&&stockId=' + this.data.goodsMsg.stockId + '&&quantity=' + this.data.goodsMsg.quantity + '&&goodsType=applyZero' + '&&needPaymentAmount=' + this.data.payMsg.needPaymentAmount + '&&cashBackPeriods=' + this.data.cashMsg.cashBackPeriods + '&&expectedAmount=' + this.data.cashMsg.expectedAmount + '&&buyType=' + this.data.buyType + '&&isShowBook=' + this.data.isShowBook
        })
      }else if(that.data.getOrder){ 
        let orderType;
        if (that.data.activityId) {
          orderType = 19
        } else {
          if (that.data.sponsor == 1) {
            orderType = 14
          } else {
            orderType = 7
          }
        }      
        let data = {
          goodsId: that.data.options.goodsid,
          stockId: that.data.options.stock,
          quantity: that.data.options.quantity,
          source: that.data.options.source,
          topicId: that.data.options.topicid,
          needPaymentAmount: that.data.payMsg.needPaymentAmount,
          cashBackPeriods: that.data.cashMsg.cashBackPeriods,
          expectedAmount: that.data.cashMsg.expectedAmount,
          buyType: that.data.buyType,
          orderType:orderType,
          isShowBook:2
        }
        let getOrder = JSON.stringify(data)
        wx.navigateTo({
          url: '/pages/placeorder/placeorder?getOrder=' + getOrder +'&goodsType=applyZero'
        })
      } else {
        wx.navigateTo({
          url: '/pages/placeorder/placeorder?goodsId=' + this.data.goodsMsg.goodsId + '&&stockId=' + this.data.goodsMsg.stockId + '&&quantity=' + this.data.goodsMsg.quantity + '&&goodsType=applyZero' + '&&needPaymentAmount=' + this.data.payMsg.needPaymentAmount + '&&cashBackPeriods=' + this.data.cashMsg.cashBackPeriods + '&&expectedAmount=' + this.data.cashMsg.expectedAmount + '&&buyType=' + this.data.buyType + '&&isShowBook=' + this.data.isShowBook
        })
      }
    }
    setTimeout(function() {
      newCount = true
    }, 1000)
  },
  //新人专区提交订单
  payNow2: function() {
    var that = this;
    if (newCount) {
      newCount = false
      wx.navigateTo({
        url: '/pages/placeorder/placeorder?activityGoodsId=' + that.data.options.activityGoodsId + '&&buyType=' + that.data.buyType + '&&stockId=' + that.data.options.stockId + '&&quantity=' + that.data.options.quantity + '&&newPeopleActivity=' + that.data.options.newPeopleActivity + '&&isShowBook=' + this.data.isShowBook
      })
    }
    setTimeout(function() {
      newCount = true
    }, 1000)
  },
  //期望付款
  expectedAmountNumber: function(e) {
    var that = this
    var expectedAmount = e.detail.value
    // that.setData({
    //   expectedAmountNumbertemp:e.detail.value
    // }) 
    // var obj = that.data.cashMsg
    // obj.expectedAmount = expectedAmount
    if (e.detail.value) {
      that.setData({
        // cashMsg:obj,
        // expectedAmountNumber:expectedAmount,
        expectedAmountNumbertemp: e.detail.value
      })
      //   var expectedAmount = e.detail.value
      //   app.Util.ajax('mall/freeShopping/request/calculate', {
      //     stockId: Number(that.data.goodsMsg.stockId),
      //   // stockId:3,
      //     quantity: Number(that.data.goodsMsg.quantity),
      //  //  quantity: 2,
      //    expectedAmount: expectedAmount,
      //    cashBackPeriods: that.data.cashMsg.cashBackPeriods
      //  }, 'POST').then((res) => {
      //    console.log("ssssssss"+JSON.stringify(res))
      //   if (res.data.messageCode == 'MSG_1001') {
      //     var obj = that.data.cashMsg
      //     obj.expectedAmount = expectedAmount
      //     console.log("res.data.messageCode"+JSON.stringify(obj))
      //     console.log("res.data.messageCode"+JSON.stringify(expectedAmount))
      //       that.setData({
      //         cashMsg:obj,
      //         expectedAmountNumber:expectedAmount
      //         expectedAmountNumbertemp:e.detail.value
      // })
      //   }
      //  })
    }

  },
  //分月
  monthNumber: function(e) {
    var that = this
    var monthNumber = e.detail.value
    var monthNumbertemp = e.detail.value
    that.setData({
      monthNumbertemp: monthNumbertemp
    })
    // if(e.detail.value){
    //   var month = e.detail.value
    //   app.Util.ajax('mall/freeShopping/request/calculate', {
    //     stockId: Number(that.data.goodsMsg.stockId),
    //     quantity: Number(that.data.goodsMsg.quantity),
    //    expectedAmount: that.data.cashMsg.expectedAmount,
    //    cashBackPeriods: month
    //  }, 'POST').then((res) => {
    //   that.setData({
    //     monthNumber:monthNumber
    //   })
    //   console.log("数据正确")
    //   if (res.data.messageCode == 'MSG_1001'){
    //     var obj = that.data.cashMsg
    //     obj.cashBackPeriods = monthNumber
    //     that.setData({
    //       cashMsg:obj,
    //     })
    //   }else{
    //     that.setData({
    //       monthNumber:monthNumber2
    //     })
    //   }
    //  })
    // }
  },
  monthButton: function() {
    var that = this
    var orderType;
    if (that.data.activityId) {
      orderType = 19
    } else {
      if (that.data.sponsor == 1) {
        orderType = 14
      } else {
        orderType = 7
      }
    }
    //保留一位小数
    var reg = /^\d{0,5}([\b]*|\.|\.\d{0,1}|$)$/
    if (that.data.monthNumbertemp && reg.test(that.data.monthNumbertemp)) {
      var month = that.data.monthNumbertemp
      app.Util.ajax('mall/freeShopping/request/calculate', {
        stockId: Number(that.data.goodsMsg.stockId),
        quantity: Number(that.data.goodsMsg.quantity),
        expectedAmount: that.data.cashMsg.expectedAmount,
        cashBackPeriods: month,
        orderType: orderType
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
          var obj = that.data.cashMsg
          obj.cashBackPeriods = that.data.monthNumbertemp
          that.setData({
            cashMsg: obj,
            payMsg: res.data.content,
            monthStatus: false,
            reviseStatus3: 0
          })
          wx.showToast({
            title: "修改成功",
            icon: 'none',
            duration: 2000
          })
        } else if (res.data.messageCode == 'MSG_4001') {
          wx.showToast({
            title: res.data.message,
            icon: 'none',
            duration: 2000
          })
        } else {
          wx.showToast({
            title: '分期不可同时存在整月和非整月',
            icon: 'none',
            duration: 2000
          })
        }
      })
    } else {
      wx.showToast({
        title: '请输入正确的数字',
        icon: 'none'
      })
    }

  },
  expectedAmountButton: function() {
    var that = this
    var reg = /^\d{0,5}([\b]*|\.|\.\d{0,2}|$)$/
    if (that.data.expectedAmountNumbertemp && reg.test(that.data.expectedAmountNumbertemp)) {
      var expectedAmount = that.data.expectedAmountNumbertemp
      app.Util.ajax('mall/freeShopping/request/calculate', {
        stockId: Number(that.data.goodsMsg.stockId),
        quantity: Number(that.data.goodsMsg.quantity),
        expectedAmount: expectedAmount,
        cashBackPeriods: that.data.cashMsg.cashBackPeriods,
        orderType: that.data.sponsor == 1 ? 14 : 7
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
          var obj = that.data.cashMsg
          obj.expectedAmount = expectedAmount
          that.setData({
            cashMsg: obj,
            payMsg: res.data.content,
            expectedAmountStatus: false,
            reviseStatus3: 0
          })
          wx.showToast({
            title: "修改成功",
            icon: 'none',
            duration: 2000
          })
        } else if (res.data.messageCode == 'MSG_4001') {
          wx.showToast({
            title: res.data.message,
            icon: 'none',
            duration: 2000
          })
        }
      })
    } else {
      wx.showToast({
        title: '请输入正确的数字',
        icon: 'none'
      })
    }
  },
  phoneNumberInputs(e) {
    if (e.detail.value != this.data.inputs[e.currentTarget.dataset.index]) {
      this.setData({
        [`inputs[${e.currentTarget.dataset.index}]`]: e.detail.value
      })
    }
    let value = this.validateNumber(e.detail.value)
    this.setData({
      expectedAmountValue: value
    })
  },
  validateNumber(val) {
    return val.replace(/\D/g, '')
  },
  //阻止弹框之后的页面滑动问题
  preventTouchMove: function() {

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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  toapplyRule: function() {
    wx.navigateTo({
      url: "/pages/applyRule/applyRule"
    })
  },
  sponsorShow: function() {
    var that = this
    this.setData({
      sponsorShow: true
    })
  },
  closeSponsorShow: function() {
    this.setData({
      sponsorShow: false
    })
  },
  toSponsorDetail: function() {
    var that = this
    app.Util.ajax('mall//marketingAuspicesGoods/addApply', {
      stockId: that.data.stockId,
      expectedAmount: that.data.cashMsg.expectedAmount, //期望金额
      cashBackPeriods: that.data.cashMsg.cashBackPeriods //期望分期
    }, 'POST').then((res) => { // 使用ajax函数
      if (res.data.messageCode == 'MSG_1001') {
        wx.navigateTo({
          url: "/pages/toSponsor/toSponsor?id=" + res.data.content.id
        })
        that.setData({
          sponsorShow: false
        })
      } else {
        wx.showToast({
          title: res.data.message,
          icon: 'none'
        })
      }
    })
  },
  closeyindao1:function(){
    this.setData({
      yindao1:false,
      yindao2:true
    })
  },
  closeyindao2:function(){
    this.setData({
      yindao2:false
    })
    wx.showToast({
      title:'引导完成',
      icon:'none'
    })
  }
})