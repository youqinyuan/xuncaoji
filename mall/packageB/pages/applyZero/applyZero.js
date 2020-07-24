// pages/applyZero/applyZero.js
var time = require('../../../utils/util.js');
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
    yindao2:false,
    shuoming:false,
    shuomingText:'下单后可随时撤销，退还您已支付金额。',
    shuomingText1:'支付后，可对此订单发起提期哦，提期可对返现时间缩短！',
    shuomingText3:'年化收益率={商品原价*（1-折扣）}/{支付金额-折扣价}/返现周期*12个月。',
    shuomingText4:'订单支付金额=订单最长期支付价*（最长期期限/选择订单返现期限）',
    shuomingText5:'订单支付金额=订单最长期支付价*（最长期期限/选择订单返现期限）- 赞助减的金额',
    discount:false,
    discountCompute:0.1,
    discountNumber:'一折',
    canInput:0,
    zeroChoose:2,
    zhihui:false,
    topicId:'',
    takeout:'',
    isChoose:1
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
            url: '/pages/placeorder/placeorder?activityGoodsId=' + that.data.options.activityGoodsId + '&&buyType=' + that.data.buyType + '&&stockId=' + that.data.options.stockId + '&&quantity=' + that.data.options.quantity + '&&newPeopleActivity=' + that.data.options.newPeopleActivity + '&&isShowBook=2' + '&&discountCompute=' + that.data.discountCompute
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
              url: '/pages/placeorder/placeorder?goodsId=' + this.data.goodsMsg.goodsId + '&&activityId=' + that.data.activityId + '&&stockId=' + this.data.goodsMsg.stockId + '&&quantity=' + this.data.goodsMsg.quantity + '&&goodsType=applyZero' + '&&needPaymentAmount=' + this.data.payMsg.needPaymentAmount + '&&cashBackPeriods=' + that.data.payMsg.actualCashBackPeriods + '&&expectedAmount=' + this.data.orgPrice + '&&buyType=' + this.data.buyType + '&&isShowBook=2'+ '&&discountCompute=' + that.data.discountCompute
            })
          } else {
            wx.navigateTo({
              url: '/pages/placeorder/placeorder?goodsId=' + this.data.goodsMsg.goodsId + '&&stockId=' + this.data.goodsMsg.stockId + '&&quantity=' + this.data.goodsMsg.quantity + '&&goodsType=applyZero' + '&&needPaymentAmount=' + this.data.payMsg.needPaymentAmount + '&&cashBackPeriods=' + that.data.payMsg.actualCashBackPeriods + '&&expectedAmount=' + this.data.orgPrice + '&&buyType=' + this.data.buyType + '&&isShowBook=2'+ '&&discountCompute=' + that.data.discountCompute
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
    console.log(options)
    if(options.takeout){
      that.setData({
        takeout:options.takeout,
        tempList:JSON.parse(options.arr)
      })
    }
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
    if(options.quantity){
      that.setData({
        quantity:options.quantity
      })
    }
    if(options.orderType){
      that.setData({
        orderType:options.orderType
      })
    }
    //发布赚钱帖初始化
    if (options.getOrder) {
      var arr = JSON.parse(options.getOrder)
      var obj = {}
      let topicId = arr.topicid?arr.topicid:''
      obj.goodsId = arr.goodsid
      obj.stockId = arr.stock
      obj.quantity = arr.quantity
      that.setData({
        goodsMsg: obj,
        options: arr,
        topicId:topicId,
        getOrder: options.getOrder
      })
      that.getInit2(obj.stockId,that.data.topicId)
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
      app.Util.ajax('mall/freeShopping/request/getUserIsChoiceMaxPeriods', {
        stockId: options.stockId?options.stockId:JSON.parse(options.arr).stockid
      }, 'GET').then((res) => {
        //获取页面分期判断数据
        if (res.data.messageCode == 'MSG_1001') {
          that.setData({
            isChoose:res.data.content
          })
        } else {
          wx.showToast({
            title: res.data.message,
            icon: 'none',
            duration: 1000
          })
        }
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
      })
    }
  },
  //用户是否可选择最大期数
  isChoose:function(stockId){
    var that = this
    app.Util.ajax('mall/freeShopping/request/getUserIsChoiceMaxPeriods', {
      stockId: stockId
    }, 'GET').then((res) => {
      //获取页面分期判断数据
      if (res.data.messageCode == 'MSG_1001') {
        that.setData({
          isChoose:res.data.content
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
  //请求初始化数据
  getInit: function(stockId) {
    var that = this
    app.Util.ajax('mall/freeShopping/request/default', {
      stockId: stockId
    }, 'GET').then((res) => {
      //获取页面分期判断数据
      if (res.data.messageCode == 'MSG_1001') {
        //计算需要支付的金额
        if (that.data.takeout){
          console.log(1)
          console.log(that.data.tempList)
         // 从购物袋进来，修改一折购
         if(that.data.tempList.discountNumber==0){
          that.setData({
            discountNumber:'零折',
          })
        }else if(that.data.tempList.discountNumber==1){
          that.setData({
            discountNumber:'一折',
          })
        }else if(that.data.tempList.discountNumber==2){
          that.setData({
            discountNumber:'二折',
          })
        }else if(that.data.tempList.discountNumber==3){
          that.setData({
            discountNumber:'三折',
          })
        }else if(that.data.tempList.discountNumber==4){
          that.setData({
            discountNumber:'四折',
          })
        }else if(that.data.tempList.discountNumber==5){
          that.setData({
            discountNumber:'五折',
          })
        }else if(that.data.tempList.discountNumber==6){
          that.setData({
            discountNumber:'六折',
          })
        }else if(that.data.tempList.discountNumber==7){
          that.setData({
            discountNumber:'七折',
          })
        }else if(that.data.tempList.discountNumber==8){
          that.setData({
            discountNumber:'八折',
          })
        }else if(that.data.tempList.discountNumber==9){
          that.setData({
            discountNumber:'九折',
          })
        }
          that.compute2(that.data.tempList.discountNumber,that.data.tempList.cashBackPeriods);
          that.setData({
            cashMsg: res.data.content,
            orgPriceCompute:res.data.content.orgPrice,
            orgPrice:that.data.tempList.expectedAmount
          })
        } else {
          console.log(2)
          //初始化
          that.setData({
            cashMsg: res.data.content,
            orgPriceCompute:res.data.content.orgPrice,
            orgPrice:(res.data.content.orgPrice*that.data.discountCompute*that.data.goodsMsg.quantity).toFixed(2)
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
    //发布赚钱贴初始化
    getInit2: function(stockId,topicId) {
      var that = this
      app.Util.ajax('mall/freeShopping/request/default', {
        stockId: stockId,
        topicId:topicId
      }, 'GET').then((res) => {
        //获取页面分期判断数据
        if (res.data.messageCode == 'MSG_1001') {
          //计算需要支付的金额
          if (that.data.takeout){
            console.log(1)
            console.log(that.data.tempList)
           // 从购物袋进来，修改一折购
           if(that.data.tempList.discountNumber==0){
            that.setData({
              discountNumber:'零折',
            })
          }else if(that.data.tempList.discountNumber==1){
            that.setData({
              discountNumber:'一折',
            })
          }else if(that.data.tempList.discountNumber==2){
            that.setData({
              discountNumber:'二折',
            })
          }else if(that.data.tempList.discountNumber==3){
            that.setData({
              discountNumber:'三折',
            })
          }else if(that.data.tempList.discountNumber==4){
            that.setData({
              discountNumber:'四折',
            })
          }else if(that.data.tempList.discountNumber==5){
            that.setData({
              discountNumber:'五折',
            })
          }else if(that.data.tempList.discountNumber==6){
            that.setData({
              discountNumber:'六折',
            })
          }else if(that.data.tempList.discountNumber==7){
            that.setData({
              discountNumber:'七折',
            })
          }else if(that.data.tempList.discountNumber==8){
            that.setData({
              discountNumber:'八折',
            })
          }else if(that.data.tempList.discountNumber==9){
            that.setData({
              discountNumber:'九折',
            })
          }
            that.compute2(that.data.tempList.discountNumber,that.data.tempList.cashBackPeriods);
            that.setData({
              cashMsg: res.data.content,
              orgPriceCompute:res.data.content.orgPrice,
              orgPrice:that.data.tempList.expectedAmount
            })
          } else {
            console.log(2)
            //初始化
            that.setData({
              cashMsg: res.data.content,
              orgPriceCompute:res.data.content.orgPrice,
              orgPrice:(res.data.content.orgPrice*that.data.discountCompute*that.data.goodsMsg.quantity).toFixed(2)
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
        // var interestDetails = res.data.content.interestDetails
        // interestDetails.forEach((v, i) => {
        //   v.cashBackDate = time.formatTimeTwo(v.cashBackDate, 'Y-M-D')
        // })
        if(res.data.content.discountNumber==0){
          that.setData({
            discountNumber:'零折',
          })
        }else if(res.data.content.discountNumber==1){
          that.setData({
            discountNumber:'一折',
          })
        }else if(res.data.content.discountNumber==2){
          that.setData({
            discountNumber:'二折',
          })
        }else if(res.data.content.discountNumber==3){
          that.setData({
            discountNumber:'三折',
          })
        }else if(res.data.content.discountNumber==4){
          that.setData({
            discountNumber:'四折',
          })
        }else if(res.data.content.discountNumber==5){
          that.setData({
            discountNumber:'五折',
          })
        }else if(res.data.content.discountNumber==6){
          that.setData({
            discountNumber:'六折',
          })
        }else if(res.data.content.discountNumber==7){
          that.setData({
            discountNumber:'七折',
          })
        }else if(res.data.content.discountNumber==8){
          that.setData({
            discountNumber:'八折',
          })
        }else if(res.data.content.discountNumber==9){
          that.setData({
            discountNumber:'九折',
          })
        }
        that.setData({
          payMsg: res.data.content,
          zhihui:false
        })
      } else {
        that.setData({
          zhihui:true
        })
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
    if(that.data.newPeopleActivity==2){
      console.log('新人专区不可修改')
    }else{
      that.setData({
        showPeriod: true
      })
    }
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
      monthStatus: true,
      canInput:1
    })
  },
  //获取分期月数的值
  getMonthText: function(e){
    var that = this
    var cashMsg = that.data.cashMsg
    if(e.currentTarget.dataset.index==0&&that.data.isChoose==2){
      wx.showToast({
        title:'一折购要求长期的必须选择一折以上；若选择0折拿货，修改期限短期返吧！',
        icon:'none'
      })
    }else if(e.currentTarget.dataset.index==0&&that.data.zeroChoose==1){
      wx.showToast({
        title:'一折购要求长期的必须选择一折以上；若选择0折拿货，修改期限短期返吧！',
        icon:'none'
      })
    }else{
      cashMsg.cashBackPeriods = e.currentTarget.dataset.text
      that.setData({
        showPeriod: false,
        cashMsg: cashMsg,
        monthNumbertemp: e.currentTarget.dataset.text
      })
      that.monthButton()
    }
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
    if(that.data.orderType){
      orderType = that.data.orderType
    }else{
      if (that.data.activityId) {
        orderType = 19
      } else {
        if (that.data.sponsor == 1) {
          orderType = 14
        } else {
          orderType = 7
        }
      }
    }
    console.log(that.data.orgPriceCompute,that.data.discountCompute,that.data.goodsMsg.quantity)
    if (that.data.activityId) {
      app.Util.ajax('mall/freeShopping/request/calculate', {
        stockId: Number(that.data.goodsMsg.stockId),
        quantity: Number(that.data.goodsMsg.quantity),
        // expectedAmount: (that.data.orgPriceCompute*that.data.discountCompute*that.data.goodsMsg.quantity).toFixed(2),
        cashBackPeriods: that.data.isChoose==1?that.data.cashMsg.selectablePeriods[0]:that.data.cashMsg.selectablePeriods[1],
        orderType: orderType,
        activityId: parseInt(that.data.activityId),
        discountNumber:Number((that.data.discountCompute*10).toFixed(2)),
        topicId:that.data.topicId
      }, 'POST').then((res) => {
        if (res.data.messageCode == 'MSG_1001') {
          var cashBackDetails = res.data.content.cashBackDetails
          cashBackDetails.forEach((v, i) => {
            v.cashBackDate = time.formatTimeTwo(v.cashBackDate, 'Y-M-D')
          })
          // var interestDetails = res.data.content.interestDetails
          // interestDetails.forEach((v, i) => {
          //   v.cashBackDate = time.formatTimeTwo(v.cashBackDate, 'Y-M-D')
          // })
          that.setData({
            zhihui:false,
            payMsg: res.data.content
          })
        } else {
          that.setData({
            zhihui:true
          })
          wx.showToast({
            title: res.data.message,
            icon: 'none',
            duration: 1000
          })
        }
      })
    } else {
      console.log(that.data.isChoose==1?that.data.cashMsg.selectablePeriods[0]:that.data.cashMsg.selectablePeriods[1])
      app.Util.ajax('mall/freeShopping/request/calculate', {
        stockId: Number(that.data.goodsMsg.stockId),
        quantity: Number(that.data.goodsMsg.quantity),
        // expectedAmount: (that.data.orgPriceCompute*that.data.discountCompute*that.data.goodsMsg.quantity).toFixed(2),
        cashBackPeriods: that.data.isChoose==1?that.data.cashMsg.selectablePeriods[0]:that.data.cashMsg.selectablePeriods[1],
        orderType: orderType,
        discountNumber:Number((that.data.discountCompute*10).toFixed(2)),
        topicId:that.data.topicId
      }, 'POST').then((res) => {
        if (res.data.messageCode == 'MSG_1001') {
          var cashBackDetails = res.data.content.cashBackDetails
          cashBackDetails.forEach((v, i) => {
            v.cashBackDate = time.formatTimeTwo(v.cashBackDate, 'Y-M-D')
          })
          // var interestDetails = res.data.content.interestDetails
          // interestDetails.forEach((v, i) => {
          //   v.cashBackDate = time.formatTimeTwo(v.cashBackDate, 'Y-M-D')
          // })
          that.setData({
            zhihui:false,
            payMsg: res.data.content
          })
        } else {
          that.setData({
            zhihui:true
          })
          wx.showToast({
            title: res.data.message,
            icon: 'none',
            duration: 1000
          })
        }
      })
    }

  },
  compute2: function(discountNumber, cashBackPeriods) {
    var that = this
    app.Util.ajax('mall/freeShopping/request/calculate', {
      stockId: Number(that.data.goodsMsg.stockId),
      quantity: Number(that.data.goodsMsg.quantity),
      // expectedAmount: expectedAmount,
      cashBackPeriods: cashBackPeriods,
      orderType: that.data.sponsor == 1 ? 14 : 7,
      discountNumber:discountNumber
    }, 'POST').then((res) => {
      if (res.data.messageCode == 'MSG_1001') {
        var cashBackDetails = res.data.content.cashBackDetails
        cashBackDetails.forEach((v, i) => {
          v.cashBackDate = time.formatTimeTwo(v.cashBackDate, 'Y-M-D')
        })
        // var interestDetails = res.data.content.interestDetails
        // interestDetails.forEach((v, i) => {
        //   v.cashBackDate = time.formatTimeTwo(v.cashBackDate, 'Y-M-D')
        // })
        that.setData({
          zhihui:false,
          payMsg: res.data.content
        })
      } else {
        that.setData({
          zhihui:true
        })
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
    if(that.data.zhihui){

    }else{
      if (that.data.isShowBook == 2) {
        wx.showToast({
          title: '预售返现无法加入购物车，如需加入购物车请单独购买。',
          icon: 'none'
        })
      } else {
        if (that.data.reviseStatus == 1 || that.data.reviseStatus2 == 1) {
          app.Util.ajax('mall/cart/updateShoppingCartApply', {
            shoppingCartGoodsId: that.data.shoppingcartgoodsid, //修改购物车的id
            // expectedAmount: (that.data.orgPriceCompute*that.data.discountCompute).toFixed(2), //用户预期花费
            cashBackPeriods: that.data.payMsg.actualCashBackPeriods, //返现期数
            discountNumber:Number((that.data.discountCompute*10).toFixed(2))
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
            // expectedAmount: (that.data.orgPriceCompute*that.data.discountCompute).toFixed(2), //用户预期花费
            cashBackPeriods: that.data.payMsg.actualCashBackPeriods, //返现期数
            discountNumber:Number((that.data.discountCompute*10).toFixed(2))
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
    }
  },
  //返现明细弹框(出现)
  returnDetail: function() {
    var that = this;
    that.setData({
      showDialog: true,
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
  //自定义输入点击计算
  payNow: function() {
    var that = this;
    if(that.data.zhihui){

    }else{
      if (newCount) {
        newCount = false
        if (that.data.activityId) {
          wx.navigateTo({
            url: '/pages/placeorder/placeorder?goodsId=' + this.data.goodsMsg.goodsId + '&&activityId=' + that.data.activityId + '&&stockId=' + this.data.goodsMsg.stockId + '&&quantity=' + this.data.goodsMsg.quantity + '&&goodsType=applyZero' + '&&needPaymentAmount=' + this.data.payMsg.needPaymentAmount + '&&cashBackPeriods=' + this.data.payMsg.actualCashBackPeriods+ '&&expectedAmount=' + this.data.orgPrice + '&&buyType=' + this.data.buyType + '&&isShowBook=' + this.data.isShowBook+ '&&discountCompute=' + that.data.discountCompute
          })
        }else if(that.data.getOrder){ 
          let orderType;
          if(that.data.orderType){
            orderType = that.data.orderType
          }else{
            if (that.data.activityId) {
              orderType = 19
            } else {
              if (that.data.sponsor == 1) {
                orderType = 14
              } else {
                orderType = 7
              }
            }
          }    
          let data = {
            goodsId: that.data.options.goodsid,
            stockId: that.data.options.stock,
            quantity: that.data.options.quantity,
            source: that.data.options.source,
            topicId: that.data.options.topicid,
            needPaymentAmount: that.data.payMsg.needPaymentAmount,
            cashBackPeriods: that.data.payMsg.actualCashBackPeriods,
            expectedAmount: that.data.payMsg.expectedAmount,
            buyType: that.data.buyType,
            orderType:orderType,
            isShowBook:2
          }
          let getOrder = JSON.stringify(data)
          wx.navigateTo({
            url: '/pages/placeorder/placeorder?getOrder=' + getOrder +'&goodsType=applyZero'+ '&&discountCompute=' + that.data.discountCompute
          })
        } else {
          wx.navigateTo({
            url: '/pages/placeorder/placeorder?goodsId=' + this.data.goodsMsg.goodsId + '&&stockId=' + this.data.goodsMsg.stockId + '&&quantity=' + this.data.goodsMsg.quantity + '&&goodsType=applyZero' + '&&needPaymentAmount=' + this.data.payMsg.needPaymentAmount +  '&&cashBackPeriods=' + this.data.payMsg.actualCashBackPeriods+ '&&expectedAmount=' + this.data.orgPrice + '&&buyType=' + this.data.buyType + '&&isShowBook=' + this.data.isShowBook+ '&&discountCompute=' + that.data.discountCompute
          })
        }
      }
      setTimeout(function() {
        newCount = true
      }, 1000)
    }

  },
  //新人专区提交订单
  payNow2: function() {
    var that = this;
    if(that.data.zhihui){

    }else{
      if (newCount) {
        newCount = false
        wx.navigateTo({
          url: '/pages/placeorder/placeorder?activityGoodsId=' + that.data.options.activityGoodsId + '&&buyType=' + that.data.buyType + '&&stockId=' + that.data.options.stockId + '&&quantity=' + that.data.options.quantity + '&&newPeopleActivity=' + that.data.options.newPeopleActivity + '&&isShowBook=' + this.data.isShowBook+ '&&discountCompute=' + that.data.discountCompute
        })
      }
      setTimeout(function() {
        newCount = true
      }, 1000)
    }
  },
  //期望付款
  expectedAmountNumber: function(e) {
    var that = this
    var expectedAmount = e.detail.value
    if (e.detail.value) {
      that.setData({
        expectedAmountNumbertemp: e.detail.value
      })
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
  },
  monthButton: function() {
    var that = this
    var orderType;
    if(that.data.orderType){
      orderType = that.data.orderType
    }else{
      if (that.data.activityId) {
        orderType = 19
      } else {
        if (that.data.sponsor == 1) {
          orderType = 14
        } else {
          orderType = 7
        }
      }
    }
    //保留一位小数
    var reg = /^\d{0,5}([\b]*|\.|\.\d{0,1}|$)$/
    var reg1 = /^\d{0,5}([\b]*|\.|\.\d{0,0}|$)$/
    if(that.data.payMsg.freeBuyMode==2){
      if(reg1.test(that.data.monthNumbertemp)){
        console.log(that.data.newPeopleActivity,that.data.payMsg.freeBuyMode)
        if(that.data.payMsg.freeBuyMode==1&&that.data.canInput==1&&that.data.monthNumbertemp>6){
          wx.showToast({
            title: '自定义期数不能大于6期',
              icon: 'none',
              duration: 2000
          })
        }else if(that.data.payMsg.freeBuyMode==2&&that.data.canInput==1&&that.data.monthNumbertemp<15){
          wx.showToast({
            title: '天天返最短15天返还',
              icon: 'none',
              duration: 2000
          })
        }else{
          if (that.data.monthNumbertemp && reg.test(that.data.monthNumbertemp)){
            var month = that.data.monthNumbertemp
            app.Util.ajax('mall/freeShopping/request/calculate', {
              stockId: Number(that.data.goodsMsg.stockId),
              quantity: Number(that.data.goodsMsg.quantity),
              expectedAmount: (that.data.orgPriceCompute*that.data.discountCompute*that.data.goodsMsg.quantity).toFixed(2),
              cashBackPeriods: month,
              orderType: orderType,
              discountNumber:Number((that.data.discountCompute*10).toFixed(2)),
              topicId:that.data.topicId
            }, 'POST').then((res) => {
              if (res.data.messageCode == 'MSG_1001') {
                var cashBackDetails = res.data.content.cashBackDetails
                cashBackDetails.forEach((v, i) => {
                  v.cashBackDate = time.formatTimeTwo(v.cashBackDate, 'Y-M-D')
                })
                // var interestDetails = res.data.content.interestDetails
                // interestDetails.forEach((v, i) => {
                //   v.cashBackDate = time.formatTimeTwo(v.cashBackDate, 'Y-M-D')
                // })
                var cashMsg = that.data.cashMsg
                var obj = that.data.cashMsg
                obj.cashBackPeriods = that.data.monthNumbertemp
                that.setData({
                  zhihui:false,
                  cashMsg: obj,
                  payMsg: res.data.content,
                  monthStatus: false,
                  reviseStatus3: 0,
                  canInput:0
                })
                wx.showToast({
                  title: "修改成功",
                  icon: 'none',
                  duration: 2000
                })
              } else if (res.data.messageCode == 'MSG_4001') {
                that.setData({
                  zhihui:true
                })
                wx.showToast({
                  title: res.data.message,
                  icon: 'none',
                  duration: 2000
                })
              } else {
                that.setData({
                  zhihui:true
                })
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
        }
      }else{
        wx.showToast({
          title: '请输入整数',
            icon: 'none',
            duration: 2000
        })
      }
    }else{
      if(that.data.payMsg.freeBuyMode==1&&that.data.canInput==1&&that.data.monthNumbertemp>6){
        wx.showToast({
          title: '自定义期数不能大于6期',
            icon: 'none',
            duration: 2000
        })
      }else if(that.data.payMsg.freeBuyMode==2&&that.data.canInput==1&&that.data.monthNumbertemp<15){
        wx.showToast({
          title: '天天返最短15天返还',
            icon: 'none',
            duration: 2000
        })
      }else{
        if (that.data.monthNumbertemp && reg.test(that.data.monthNumbertemp)){
          var month = that.data.monthNumbertemp
          app.Util.ajax('mall/freeShopping/request/calculate', {
            stockId: Number(that.data.goodsMsg.stockId),
            quantity: Number(that.data.goodsMsg.quantity),
            expectedAmount: (that.data.orgPriceCompute*that.data.discountCompute*that.data.goodsMsg.quantity).toFixed(2),
            cashBackPeriods: month,
            orderType: orderType,
            discountNumber:Number((that.data.discountCompute*10).toFixed(2)),
            topicId:that.data.topicId
          }, 'POST').then((res) => {
            if (res.data.messageCode == 'MSG_1001') {
              var cashBackDetails = res.data.content.cashBackDetails
              cashBackDetails.forEach((v, i) => {
                v.cashBackDate = time.formatTimeTwo(v.cashBackDate, 'Y-M-D')
              })
              // var interestDetails = res.data.content.interestDetails
              // interestDetails.forEach((v, i) => {
              //   v.cashBackDate = time.formatTimeTwo(v.cashBackDate, 'Y-M-D')
              // })
              var cashMsg = that.data.cashMsg
              var obj = that.data.cashMsg
              obj.cashBackPeriods = that.data.monthNumbertemp
              that.setData({
                zhihui:false,
                cashMsg: obj,
                payMsg: res.data.content,
                monthStatus: false,
                reviseStatus3: 0,
                canInput:0
              })
              wx.showToast({
                title: "修改成功",
                icon: 'none',
                duration: 2000
              })
            } else if (res.data.messageCode == 'MSG_4001') {
              that.setData({
                zhihui:true
              })
              wx.showToast({
                title: res.data.message,
                icon: 'none',
                duration: 2000
              })
            } else {
              that.setData({
                zhihui:true
              })
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
      }
    }
    
  },
  // expectedAmountButton: function() {
  //   var that = this
  //   var reg = /^\d{0,5}([\b]*|\.|\.\d{0,2}|$)$/
  //   if (that.data.expectedAmountNumbertemp && reg.test(that.data.expectedAmountNumbertemp)) {
  //     var expectedAmount = that.data.expectedAmountNumbertemp
  //     app.Util.ajax('mall/freeShopping/request/calculate', {
  //       stockId: Number(that.data.goodsMsg.stockId),
  //       quantity: Number(that.data.goodsMsg.quantity),
  //       expectedAmount: expectedAmount,
  //       cashBackPeriods: that.data.cashMsg.cashBackPeriods,
  //       orderType: that.data.sponsor == 1 ? 14 : 7
  //     }, 'POST').then((res) => {
  //       if (res.data.messageCode == 'MSG_1001') {
  //         var cashBackDetails = res.data.content.cashBackDetails
  //         cashBackDetails.forEach((v, i) => {
  //           v.cashBackDate = time.formatTimeTwo(v.cashBackDate, 'Y-M-D')
  //         })
  //         var interestDetails = res.data.content.interestDetails
  //         interestDetails.forEach((v, i) => {
  //           v.cashBackDate = time.formatTimeTwo(v.cashBackDate, 'Y-M-D')
  //         })
  //         var obj = that.data.cashMsg
  //         obj.expectedAmount = expectedAmount
  //         that.setData({
  //           cashMsg: obj,
  //           payMsg: res.data.content,
  //           expectedAmountStatus: false,
  //           reviseStatus3: 0
  //         })
  //         wx.showToast({
  //           title: "修改成功",
  //           icon: 'none',
  //           duration: 2000
  //         })
  //       } else if (res.data.messageCode == 'MSG_4001') {
  //         wx.showToast({
  //           title: res.data.message,
  //           icon: 'none',
  //           duration: 2000
  //         })
  //       }
  //     })
  //   } else {
  //     wx.showToast({
  //       title: '请输入正确的数字',
  //       icon: 'none'
  //     })
  //   }
  // },
  expectedAmountButton: function(e) {
    let that = this
    let orderType;
    let expectedAmount = (that.data.orgPriceCompute*that.data.discountCompute*that.data.goodsMsg.quantity).toFixed(2)
    let index = e.currentTarget.dataset.index
    if(that.data.orderType){
      orderType = that.data.orderType
    }else{
      if (that.data.activityId) {
        orderType = 19
      } else {
        if (that.data.sponsor == 1) {
          orderType = 14
        } else {
          orderType = 7
        }
      }
    }
    if(index==0){
      that.setData({
        discountNumber:'零折',
        discountCompute:0,
        zeroChoose:1
      })
    }else if(index==1){
      that.setData({
        discountNumber:'一折',
        discountCompute:0.1,
        zeroChoose:2
      })
    }else if(index==2){
      that.setData({
        discountNumber:'二折',
        discountCompute:0.2,
        zeroChoose:2
      })
    }else if(index==3){
      that.setData({
        discountNumber:'三折',
        discountCompute:0.3,
        zeroChoose:2
      })
    }else if(index==4){
      that.setData({
        discountNumber:'四折',
        discountCompute:0.4,
        zeroChoose:2
      })
    }else if(index==5){
      that.setData({
        discountNumber:'五折',
        discountCompute:0.5,
        zeroChoose:2
      })
    }else if(index==6){
      that.setData({
        discountNumber:'六折',
        discountCompute:0.6,
        zeroChoose:2
      })
    }else if(index==7){
      that.setData({
        discountNumber:'七折',
        discountCompute:0.7,
        zeroChoose:2
      })
    }else if(index==8){
      that.setData({
        discountNumber:'八折',
        discountCompute:0.8,
        zeroChoose:2
      })
    }else if(index==9){
      that.setData({
        discountNumber:'九折',
        discountCompute:0.9,
        zeroChoose:2
      })
    }
      app.Util.ajax('mall/freeShopping/request/calculate', {
        stockId: Number(that.data.goodsMsg.stockId),
        quantity: Number(that.data.goodsMsg.quantity),
        // expectedAmount: (that.data.orgPriceCompute*that.data.discountCompute).toFixed(2),
        cashBackPeriods: that.data.cashMsg.cashBackPeriods,
        orderType: orderType,
        discountNumber:Number((that.data.discountCompute*10).toFixed(2)),
        topicId:that.data.topicId
      }, 'POST').then((res) => {
        if (res.data.messageCode == 'MSG_1001') {
          var cashBackDetails = res.data.content.cashBackDetails
          cashBackDetails.forEach((v, i) => {
            v.cashBackDate = time.formatTimeTwo(v.cashBackDate, 'Y-M-D')
          })
          // var interestDetails = res.data.content.interestDetails
          // interestDetails.forEach((v, i) => {
          //   v.cashBackDate = time.formatTimeTwo(v.cashBackDate, 'Y-M-D')
          // })
          var obj = that.data.cashMsg
          obj.expectedAmount = expectedAmount
          that.setData({
            zhihui:false,
            cashMsg: obj,
            payMsg: res.data.content,
            expectedAmountStatus: false,
            reviseStatus3: 0,
            discount:false,
            orgPrice:(that.data.orgPriceCompute*that.data.discountCompute).toFixed(2)
          })
          wx.showToast({
            title: "修改成功",
            icon: 'none',
            duration: 2000
          })
        } else if (res.data.messageCode == 'MSG_4001') {
          that.setData({
            expectedAmountStatus:false,
            zhihui:true
          })
          wx.showToast({
            title: res.data.message,
            icon: 'none',
            duration: 2000
          })
        }
      })
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
      url: "/packageB/pages/applyRule/applyRule"
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
    if(that.data.zhihui){

    }else{
      app.Util.ajax('mall//marketingAuspicesGoods/addApply', {
        stockId: that.data.stockId,
        // expectedAmount: (that.data.orgPriceCompute*that.data.discountCompute).toFixed(2), //期望金额
        cashBackPeriods: that.data.cashMsg.cashBackPeriods, //期望分期
        discountNumber:Number((that.data.discountCompute*10).toFixed(2))  //折扣
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
    }
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
  },
  showShuoming:function(e){
    let index = e.currentTarget.dataset.index
    console.log(index)
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
    }else{
      this.setData({
        textStatus:3,
        shuoming:true
      })
    }
  },
  cancelShuoming:function(){
    this.setData({
      shuoming:false
    })
  },
  cancelDiscount:function(){
    this.setData({
      discount:false
    })
  },
  showDiscount:function(){
    let that = this
    if(that.data.newPeopleActivity==2){
      console.log('新人专区不可修改')
    }else{
      this.setData({
        discount:true
      })
    }
  },
  comeBack:function(){
    let that = this
    let arr = that.data.goodsMsg
    console.log(arr)
    console.log(that.data.discountCompute*10)
    console.log(that.data.payMsg.actualCashBackPeriods)
    app.Util.ajax('mall/bag/updateShoppingCart', {
      id:that.data.tempList.bagId,
      goodsId:that.data.tempList.goodsId,
      stockId:that.data.tempList.stockId,
      quantity:that.data.tempList.quantity,
      buyMode:2,
      cashBackId:that.data.tempList.cashBackId,
      cashBackPeriods:that.data.payMsg.actualCashBackPeriods,
      expectedAmount:(that.data.orgPriceCompute*that.data.discountCompute).toFixed(2),
      discountNumber:that.data.discountCompute*10
    }, 'POST').then((res) => {
      if (res.data.messageCode == 'MSG_1001') {
        app.globalData.takeOut = 2
        wx.navigateBack({
          delta:1
        })
        that.setData({
          cashBackPeriods: res.data.content
        })
        that.setData({
          showPeriod: true
        })
      }else{
        wx.showToast({
          title:res.data.message,
          icon:'none',
          duration:2000
        })
      }
    })
  }
})