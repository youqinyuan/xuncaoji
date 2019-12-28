// pages/placeorder/placeorder.js
var time = require('../../utils/util.js');
let app = getApp()
var newCount = true //节流阀-限制购买提交次数
Page({

  /**
   * 页面的初始数据
   */
  data: {
    buyType: 1,
    placeOrder: [],
    actualPrice: 0, //实际付款
    cashBack: 0, //0元购返现
    addressItems: [],
    showModalStatus: false,
    goodsList: {}, //单个商品下单
    cardIds: [], //购物车下单id
    name: '', //姓名
    phoneNumber: '', //电话号码
    detailAddress: '', //详细地址
    city: '', //所在区域
    userAddressBookId: '', //地址id
    activityGoodsId: '', //0元购活动id
    stockId: '', //库存ID
    goodsId: '', //商品id
    options: {},
    disabled: false,
    remarks: '',
    showStop: false, //终止0元购
    showReMark: false, //订单备注弹框
    noteMaxLen: 100, //详细地址的字数限制
    currentNoteLen: 0, //输入的字数
    tempIndex: 0,
    styleDisply: '',
    display: '',
    type: null,
    seedShow: true,
    shoppingAmountShow:true,
    seedDetailShow: false
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    var goodsId = parseInt(options.goodsId)
    var stockId = parseInt(options.stockId)
    var quantity = parseInt(options.quantity)
    var cashBackId = parseInt(options.cashbackId)
    var type = parseInt(options.type)
    var expectedAmount = parseInt(options.expectedAmount) //想花多少钱获得商品
    if (options.buyType) {
      that.setData({
        buyType: options.buyType,
      })
    }
    that.setData({
      options: options,
    })
    if (options.cardIds) {
      //购物车校验下单
      that.cardIdsPurchase();
    } else if (options.goodsType) {
      if(that.data.options.sponsorId){
        //赞助0元购申请订单
        that.applyPurchase2();
      }else{
        //申请0元购订单
        that.applyPurchase();
      }
      
    } else if (options.type == 1) {
      //新人免费领校验下单
      var stockId = parseInt(options.stockId)
      var goodsId = parseInt(options.goodsId)
      app.Util.ajax('mall/order/checkGoods', {
        stockId: stockId,
        goodsId: goodsId,
        orderType: 3
      }, 'POST').then((res) => { // 使用ajax函数
        if (res.data.content) {
          var arr = []
          var arr1 = arr.concat(res.data.content)
          for (let i in arr1) {
            arr1[i].remark = '选填',
              arr1[i].colors = '#ff6417'
          }
          that.setData({
            placeOrder: arr1
          })
          var actualPrice = 0
          for (var i = 0; i < that.data.placeOrder.length; i++) {
            var orderGoods = that.data.placeOrder[i].orderGoodsBo
            for (var j = 0; j < orderGoods.length; j++) {
              if (that.data.buyType == 2) {
                actualPrice += (orderGoods[j].orderGoods.price * orderGoods[j].orderGoods.quantity) + orderGoods[j].orderGoods.expressFee - orderGoods[j].orderGoods.expressFee
              } else {
                actualPrice += (orderGoods[j].orderGoods.price * orderGoods[j].orderGoods.quantity) + orderGoods[j].orderGoods.expressFee
              }

              that.data.cashBack = orderGoods[j].orderGoods.cashBack
            }
          }
          var price1 = Number(actualPrice).toFixed(2);
          that.setData({
            actualPrice: price1,
            cashBack: that.data.cashBack
          })
        } else {
          wx.showToast({
            title: res.data.message,
            icon: 'none'
          })
        }
      })
    } else if (options.type == 2) {
      //信用卡校验下单
      var stockId = parseInt(options.stockId)
      var goodsId = parseInt(options.goodsId)
      app.Util.ajax('mall/order/checkGoods', {
        stockId: stockId,
        goodsId: goodsId,
        orderType: 4
      }, 'POST').then((res) => { // 使用ajax函数
        if (res.data.content) {
          var arr = []
          var arr1 = arr.concat(res.data.content)
          for (let i in arr1) {
            arr1[i].remark = '选填',
              arr1[i].colors = '#ff6417'
          }
          that.setData({
            placeOrder: arr1
          })
          var actualPrice = 0
          for (var i = 0; i < that.data.placeOrder.length; i++) {
            var orderGoods = that.data.placeOrder[i].orderGoodsBo
            for (var j = 0; j < orderGoods.length; j++) {
              if (that.data.buyType == 2) {
                actualPrice += (orderGoods[j].orderGoods.price * orderGoods[j].orderGoods.quantity) + orderGoods[j].orderGoods.expressFee - orderGoods[j].orderGoods.expressFee
              } else {
                actualPrice += (orderGoods[j].orderGoods.price * orderGoods[j].orderGoods.quantity) + orderGoods[j].orderGoods.expressFee
              }

              that.data.cashBack = orderGoods[j].orderGoods.cashBack
            }
          }
          var price1 = Number(actualPrice).toFixed(2);
          that.setData({
            actualPrice: price1,
            cashBack: that.data.cashBack
          })
        } else {
          wx.showToast({
            title: res.data.message,
            icon: 'none'
          })
        }
      })
    } else if (options.type == 3) {
      //渠道合作校验下单
      var stockId = parseInt(options.stockId)
      var goodsId = parseInt(options.goodsId)
      app.Util.ajax('mall/order/checkGoods', {
        stockId: stockId,
        goodsId: goodsId,
        // type: type,
        orderType: 5
      }, 'POST').then((res) => { // 使用ajax函数
        if (res.data.content) {
          var arr = []
          var arr1 = arr.concat(res.data.content)
          for (let i in arr1) {
            arr1[i].remark = '选填',
              arr1[i].colors = '#ff6417'
          }
          that.setData({
            placeOrder: arr1
          })
          var actualPrice = 0
          for (var i = 0; i < that.data.placeOrder.length; i++) {
            var orderGoods = that.data.placeOrder[i].orderGoodsBo
            for (var j = 0; j < orderGoods.length; j++) {
              if (that.data.buyType == 2) {
                actualPrice += (orderGoods[j].orderGoods.price * orderGoods[j].orderGoods.quantity) + orderGoods[j].orderGoods.expressFee - orderGoods[j].orderGoods.expressFee
              } else {
                actualPrice += (orderGoods[j].orderGoods.price * orderGoods[j].orderGoods.quantity) + orderGoods[j].orderGoods.expressFee
              }

              that.data.cashBack = orderGoods[j].orderGoods.cashBack
            }
          }
          var price1 = Number(actualPrice).toFixed(2);
          that.setData({
            actualPrice: price1,
            cashBack: that.data.cashBack
          })
        } else {
          wx.showToast({
            title: res.data.message,
            icon: 'none'
          })
        }
      })
    } else if (options.type == 4) {
      //freeBuy首单校验下单
      var stockId = parseInt(options.stockId)
      var goodsId = parseInt(options.goodsId)
      app.Util.ajax('mall/order/checkGoods', {
        stockId: stockId,
        goodsId: goodsId,
        orderType: 6,
        quantity: 1,
      }, 'POST').then((res) => { // 使用ajax函数
        if (res.data.content) {
          var arr = []
          var arr1 = arr.concat(res.data.content)
          for (let i in arr1) {
            arr1[i].remark = '选填',
              arr1[i].colors = '#ff6417'
          }
          that.setData({
            placeOrder: arr1
          })
          var actualPrice = 0
          for (var i = 0; i < that.data.placeOrder.length; i++) {
            var orderGoods = that.data.placeOrder[i].orderGoodsBo
            for (var j = 0; j < orderGoods.length; j++) {
              if (that.data.buyType == 2) {
                actualPrice += (orderGoods[j].orderGoods.price * orderGoods[j].orderGoods.quantity) + orderGoods[j].orderGoods.expressFee - orderGoods[j].orderGoods.expressFee
              } else {
                actualPrice += (orderGoods[j].orderGoods.price * orderGoods[j].orderGoods.quantity) + orderGoods[j].orderGoods.expressFee
              }

              that.data.cashBack = orderGoods[j].orderGoods.cashBack
            }
          }
          var price1 = Number(actualPrice).toFixed(2);
          that.setData({
            actualPrice: price1,
            cashBack: that.data.cashBack
          })
        } else {
          wx.showToast({
            title: res.data.message,
            icon: 'none'
          })
        }
      })
    } else {
      //单个商品校验下单
      that.getSingle();
    }
    var address = wx.getStorageSync('address')
    if (address) {
      address.length = 1
      that.setData({
        addressItems: address,
        name: address.receiverName,
        phoneNumber: address.mobileNumber,
        city: address.provinceName + address.cityName + address.districtName,
        detailAddress: address.detailedAddress,
        goodsList: {
          goodsId: goodsId,
          stockId: stockId,
          quantity: quantity,
          cashBackId: cashBackId,
          userAddressBookId: address.id,
          expectedAmount: options.expectedAmount,
          cashBackPeriods: options.cashBackPeriods
        },
        userAddressBookId: address.id
      })
    } else {
      app.Util.ajax('mall/personal/addressInfo', 'GET').then((res) => { // 使用ajax函数
        if (res.data.content.length > 0) {
          that.setData({
            addressItems: res.data.content,
            name: res.data.content[0].receiverName, //姓名
            phoneNumber: res.data.content[0].mobileNumber, //电话号码
            detailAddress: res.data.content[0].detailedAddress, //详细地址
            city: res.data.content[0].provinceName + res.data.content[0].cityName + res.data.content[0].districtName, //所在区域
            userAddressBookId: res.data.content[0].id,
            goodsList: {
              goodsId: goodsId,
              stockId: stockId,
              quantity: quantity,
              cashBackId: cashBackId,
              userAddressBookId: res.data.content[0].id,
              expectedAmount: options.expectedAmount,
              cashBackPeriods: options.cashBackPeriods
            }
          })
        } else {
          // wx.showToast({
          //   title: res.data.message,
          //   icon: 'none'
          // })
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
    const that = this
    var address = wx.getStorageSync('address')
    if (address) {
      address.length = 1
      that.setData({
        addressItems: address,
        name: address.receiverName,
        phoneNumber: address.mobileNumber,
        city: address.provinceName + address.cityName + address.districtName,
        detailAddress: address.detailedAddress,
        goodsList: {
          goodsId: that.data.options.goodsId,
          stockId: that.data.options.stockId,
          quantity: that.data.options.quantity,
          cashBackId: that.data.options.cashbackId,
          userAddressBookId: address.id,
          expectedAmount: that.data.options.expectedAmount,
          cashBackPeriods: that.data.options.cashBackPeriods
        },
        userAddressBookId: address.id
      })
    } else {
      app.Util.ajax('mall/personal/addressInfo', 'GET').then((res) => { // 使用ajax函数
        if (res.data.content.length > 0) {
          that.setData({
            addressItems: res.data.content,
            name: res.data.content[0].receiverName, //姓名
            phoneNumber: res.data.content[0].mobileNumber, //电话号码
            detailAddress: res.data.content[0].detailedAddress, //详细地址
            city: res.data.content[0].provinceName + res.data.content[0].cityName + res.data.content[0].districtName, //所在区域
            userAddressBookId: res.data.content[0].id,
            goodsList: {
              goodsId: that.data.options.goodsId,
              stockId: that.data.options.stockId,
              quantity: that.data.options.quantity,
              cashBackId: that.data.options.cashbackId,
              userAddressBookId: res.data.content[0].id,
              expectedAmount: that.data.options.expectedAmount,
              cashBackPeriods: that.data.options.cashBackPeriods
            }
          })
        } else {
          // wx.showToast({
          //   title: res.data.message,
          //   icon: 'none'
          // })
        }
      })
    }
    that.setData({
      disabled: false,
    })
    //如果 isBack 为 true，就返回上一页
    if (that.data.isBack) {
      wx.navigateBack()
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
    wx.removeStorageSync('address')
    wx.removeStorageSync('goAddress')
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
  //跳转到支付订单页面
  toPaymentorder: function (e) {
    if (newCount) {
      newCount = false
      var that = this
      var buymode = e.currentTarget.dataset.buymode
      var goodsList = that.data.goodsList;
      var type = that.data.options.type;
      goodsList.remark = that.data.remarks
      that.setData({
        disabled: true
      })
      if (that.data.addressItems != '') {
        if (that.data.cardIds.length > 0) {
          var cardIds = that.data.cardIds
          var temp = that.data.placeOrder
          var tempRemark = []
          temp.forEach((v, i) => {
            if (v.remark == "选填") {
              tempRemark.push('')
            } else {
              tempRemark.push(v.remark)
            }
          })
          app.Util.ajax('mall/order/addOrderByCart', {
            cardIds: cardIds,
            userAddressBookId: that.data.userAddressBookId,
            remarkList: tempRemark,
            useSeed: that.data.seedShow == true ? 1 : 0,
            useCoupon : that.data.shoppingAmountShow == true ? 1 : 0
          }, 'POST').then((res) => {
            if (res.data.content) {
              wx.navigateTo({
                url: `/pages/paymentorder/paymentorder?id=${res.data.content.id}&buymode=${buymode}`,
              })
              wx.setStorageSync('cartStatus', 1)
              wx.removeStorageSync('address')
              wx.removeStorageSync('goAddress')
            } else {
              wx.showToast({
                title: res.data.message,
                icon: 'none'
              })
            }
          })
        } else if (that.data.options.type) {
          app.Util.ajax('mall/home/activity/freeShopping/placeOrder', {
            stockId: parseInt(that.data.options.stockId),
            type: parseInt(that.data.options.type),
            userAddressBookId: parseInt(that.data.userAddressBookId),
            remark: that.data.remarks
          }, 'POST').then((res) => {
            if (res.data.content) {
              if (that.data.options.type == 2) {
                wx.navigateTo({
                  url: `/pages/paymentorder/paymentorder?id=${res.data.content.transStatement.id ? res.data.content.transStatement.id : ''}&cashBack=${that.data.cashBack}&flag=${true}&createTime=${res.data.content.transStatement.createTime}&buymode=${buymode}&orderType=${4}`,
                })
              } else {
                wx.navigateTo({
                  url: `/pages/paymentorder/paymentorder?id=${res.data.content.transStatement.id ? res.data.content.transStatement.id : ''}&cashBack=${that.data.cashBack}&flag=${true}&createTime=${res.data.content.transStatement.createTime}&buymode=${buymode}`,
                })
              }
              wx.removeStorageSync('address')
              wx.removeStorageSync('goAddress')
            } else {
              wx.showToast({
                title: res.data.message,
                icon: 'none'
              })
            }
          })
        } else {
          if(that.data.options.sponsorId){
            goodsList.isUnderLine = that.data.options.buyType == 2?"1":"0"
            goodsList.useSeed = that.data.seedShow == true ? 1 : 0
            goodsList.useCoupon = that.data.shoppingAmountShow == true ? 1 : 0
            goodsList.orderType = 14
            goodsList.auspicesApplyId = that.data.options.sponsorId
            console.log(111)
            console.log(JSON.stringify(goodsList))
            app.Util.ajax('mall/order/addOrderByGoods', goodsList, 'POST').then((res) => {
              if (res.data.content) {
                wx.navigateTo({
                  url: `/pages/paymentorder/paymentorder?id=${res.data.content.id}&buymode=${buymode}`,
                })
                wx.removeStorageSync('address')
                wx.removeStorageSync('goAddress')
              } else {
                wx.showToast({
                  title: res.data.message,
                  icon: 'none'
                })
              }
            })
          }else{
            goodsList.isUnderLine = that.data.options.buyType == 2?"1":"0"
            goodsList.useSeed = that.data.seedShow == true ? 1 : 0
            goodsList.useCoupon = that.data.shoppingAmountShow == true ? 1 : 0
            console.log(111)
            console.log(JSON.stringify(goodsList))
            app.Util.ajax('mall/order/addOrderByGoods', goodsList, 'POST').then((res) => {
              if (res.data.content) {
                wx.navigateTo({
                  url: `/pages/paymentorder/paymentorder?id=${res.data.content.id}&buymode=${buymode}`,
                })
                wx.removeStorageSync('address')
                wx.removeStorageSync('goAddress')
              } else {
                wx.showToast({
                  title: res.data.message,
                  icon: 'none'
                })
              }
            })
          }
           
        }
        that.setData({
          disabled: false
        })
      } else {
        wx.showToast({
          title: '请选择收货地址',
          icon: 'none'
        })
        that.setData({
          disabled: false
        })
      }
    }
    setTimeout(function () {
      newCount = true
    }, 300)

  },
  //跳转到添加地址页面
  jumpAddress: function () {
    var that = this;
    wx.navigateTo({
      url: '/pages/address/address',
    })
    wx.setStorage({
      key: "goAddress",
      data: "1"
    })
  },
  hideModal: function () {
    var that = this;
    that.setData({
      showModalStatus: false
    })
  },
  //终止0元购弹框
  stopZero: function () {
    var that = this
    that.setData({
      showStop: true
    })
  },
  cancelStop: function () {
    var that = this
    that.setData({
      showStop: false
    })
  },
  remarksBtn: function (e) {
    // console.log('e:' + JSON.stringify(e.currentTarget.dataset.index))
    var that = this
    that.setData({
      showReMark: true,
      tempIndex: e.currentTarget.dataset.index,
      textvalue: e.currentTarget.dataset.val == "选填" ? "" : e.currentTarget.dataset.val
    })
  },
  //获取文本框的值
  bindTextAreaBlur: function (e) {
    var that = this
    var value = e.detail.value,
      len = parseInt(value.length);
    if (len > 100) {
      that.setData({
        [`remarks[${tempIndex}]`]: e.detail.value,
        currentNoteLen: that.data.noteMaxLen,
        remarks: value
      });
    } else {
      that.setData({
        currentNoteLen: len,
        remarks: value
      });
    }
  },
  cancelBtn: function () {
    var that = this
    that.setData({
      showReMark: false,
      currentNoteLen: 0
    })
  },
  sureBtn: function (e) {
    var that = this
    that.data.placeOrder.forEach((v, i) => {
      if (i == e.currentTarget.dataset.index) {
        v.remark = that.data.remarks
        v.colors = '#333'
        that.setData({
          showReMark: false,
          placeOrder: that.data.placeOrder,
          currentNoteLen: 0
        })
      }
    })
  },
  //单个普通商品校验下单
  getSingle: function () {
    var that = this
      //单个商品校验下单
      app.Util.ajax('mall/order/checkGoods', {
        goodsId: parseInt(that.data.options.goodsId),
        stockId: parseInt(that.data.options.stockId),
        quantity: parseInt(that.data.options.quantity),
        cashBackId: parseInt(that.data.options.cashbackId),
        orderType: 1, //普通订单
        useSeed: that.data.seedShow == true?1:0
      }, 'POST').then((res) => { // 使用ajax函数
        //  console.log('商品详情：' + JSON.stringify(res.data.content.order))
        if (res.data.content) {
          var arr = []
          var arr1 = arr.concat(res.data.content)
          for (let i in arr1) {
            arr1[i].remark = '选填'
            arr1[i].colors = '#ff6417'
          }
          arr1.forEach((v, i) => {
            v.orderGoodsBo.forEach((v, i) => {
              if (that.data.buyType == 2) {
                v.orderGoods.payAmount = Number((v.orderGoods.payAmount + v.orderGoods.expressFee - v.orderGoods.expressFee).toFixed(2))
                v.orderGoods.discountRatio = v.orderGoods.discountRatio / 10
              } else {
                v.orderGoods.payAmount = Number((v.orderGoods.payAmount + v.orderGoods.expressFee).toFixed(2))
                v.orderGoods.discountRatio = v.orderGoods.discountRatio / 10
              }

            })
          })
          that.setData({
            placeOrder: arr1,
            seedContent: res.data.content.order,
            deductionAmount: res.data.content.order.deductionAmount.toFixed(2),
            buyMode: res.data.content.order.buyMode,
            deductionSeed: res.data.content.order.deductionSeed,
            deductionAfterAmount: res.data.content.order.deductionAfterAmount.toFixed(2)
          })
          var actualPrice = 0
          for (var i = 0; i < that.data.placeOrder.length; i++) {
            var orderGoods = that.data.placeOrder[i].orderGoodsBo
            for (var j = 0; j < orderGoods.length; j++) {
              if (that.data.buyType == 2) {
                actualPrice += orderGoods[j].orderGoods.payAmount - orderGoods[j].orderGoods.expressFee
              } else {
                actualPrice += orderGoods[j].orderGoods.payAmount
              }
            }
          }
          var price1 = Number(actualPrice).toFixed(2);
          that.setData({
            actualPrice: price1
          })
        } else {
          wx.showToast({
            title: res.data.message,
            icon: 'none'
          })
        }
      })
  },
  //申请0元购校验下单
  applyPurchase: function () {
    var that = this
      var needPaymentAmount = that.data.options.needPaymentAmount; //申请零元购需支付的钱
      var cashBackPeriods = that.data.options.cashBackPeriods; //申请零元购返现期数
      var goodsType = that.data.options.goodsType;
      app.Util.ajax('mall/order/checkGoods', {
        goodsId: that.data.options.goodsId,
        stockId: that.data.options.stockId,
        quantity: that.data.options.quantity,
        orderType: that.data.sponsorId?14:1, //普通订单1,
        expectedAmount: that.data.options.expectedAmount,
        cashBackPeriods: that.data.options.cashBackPeriods,
        useSeed: that.data.seedShow == true?1:0,
        useCoupon:that.data.shoppingAmountShow == true?1:0
      }, 'POST').then((res) => {
        if (res.data.content) {
          var arr = []
          var arr1 = arr.concat(res.data.content)
          //订单总种子抵扣金额与种子数
          var deductionAmount = 0
          var deductionSeed = 0
          var deductionAfterAmount = 0
          var discountRatio = 0 //freebuy折扣
          var discountAmount = 0 //freebuy折扣抵扣金额
          var shoppingAmount = 0 //购物金抵扣金额
          var shoppingNum = arr1[0].order.shoppingNum //购物金剩余次数
          var totalDiscount = 0 //优惠总金额
          for (let i in arr1) {
            arr1[i].remark = '选填'
            arr1[i].colors = '#ff6417'
          }
          arr1.forEach((v, i) => {
            deductionAmount = v.order.deductionAmount + deductionAmount
            deductionSeed = v.order.deductionSeed + deductionSeed
            deductionAfterAmount = deductionAfterAmount + v.order.deductionAfterAmount
            discountRatio = v.order.discountRatio / 10
            discountAmount = v.order.discountAmount
            shoppingAmount = v.order.shoppingAmount
            totalDiscount = v.order.totalDiscount
            console.log(deductionAmount, deductionSeed)
            v.orderGoodsBo.forEach((v, i) => {
              if (that.data.buyType == 2) {
                v.orderGoods.payAmount = Number((v.orderGoods.payAmount + v.orderGoods.expressFee - v.orderGoods.expressFee).toFixed(2))
                v.orderGoods.discountRatio = v.orderGoods.discountRatio / 10
              } else {
                v.orderGoods.payAmount = Number((v.orderGoods.payAmount + v.orderGoods.expressFee).toFixed(2))
                v.orderGoods.discountRatio = v.orderGoods.discountRatio / 10
              }
            })
          })
          that.setData({
            placeOrder: arr1,
            goodsType: goodsType, //类型为申请零元购
            needPaymentAmount: needPaymentAmount, //零元购需要支付的钱
            cashBackPeriods: cashBackPeriods, //申请零元购返现期数
            buyMode: res.data.content.order.buyMode,
            deductionAmount: deductionAmount.toFixed(2),
            deductionSeed: deductionSeed,
            deductionAfterAmount: deductionAfterAmount.toFixed(2),
            discountRatio:discountRatio.toFixed(1),
            discountAmount:discountAmount.toFixed(2),
            shoppingAmount:shoppingAmount.toFixed(2),
            shoppingNum:shoppingNum,
            totalDiscount:totalDiscount.toFixed(2)
          })
          var actualPrice = 0
          for (var i = 0; i < that.data.placeOrder.length; i++) {
            var orderGoods = that.data.placeOrder[i].orderGoodsBo
            for (var j = 0; j < orderGoods.length; j++) {
              if (that.data.buyType == 2) {
                actualPrice += orderGoods[j].orderGoods.payAmount - orderGoods[j].orderGoods.expressFee
              } else {
                actualPrice += orderGoods[j].orderGoods.payAmount
              }
            }
          }
          var price1 = Number(actualPrice).toFixed(2);
          that.setData({
            actualPrice: price1,

          })
        } else {
          wx.showToast({
            title: res.data.message,
            icon: 'none'
          })
        }
      })
  },
  //赞助申请0元购校验下单
  applyPurchase2: function () {
    var that = this
      var needPaymentAmount = 0; //申请零元购需支付的钱
      var cashBackPeriods = 0; //申请零元购返现期数
      var goodsType = that.data.options.goodsType;
      app.Util.ajax('mall/order/checkGoods', {
        auspicesApplyId:that.data.options.sponsorId,
        orderType: 14, 
        useSeed: that.data.seedShow == true?1:0,
        useCoupon:that.data.shoppingAmountShow == true?1:0
      }, 'POST').then((res) => {
        if (res.data.content) {
          var arr = []
          var arr1 = arr.concat(res.data.content)
          //订单总种子抵扣金额与种子数
          var sponsorAmount = 0
          var deductionAmount = 0
          var deductionSeed = 0
          var deductionAfterAmount = 0
          var discountRatio = 0 //freebuy折扣
          var discountAmount = 0 //freebuy折扣抵扣金额
          var shoppingAmount = 0 //购物金抵扣金额
          var shoppingNum = arr1[0].order.shoppingNum //购物金剩余次数
          var totalDiscount = 0 //优惠总金额
          for (let i in arr1) {
            arr1[i].remark = '选填'
            arr1[i].colors = '#ff6417'
          }
          arr1.forEach((v, i) => {
            deductionAmount = v.order.deductionAmount + deductionAmount
            deductionSeed = v.order.deductionSeed + deductionSeed
            deductionAfterAmount = deductionAfterAmount + v.order.deductionAfterAmount
            discountRatio = v.order.discountRatio / 10
            discountAmount = v.order.discountAmount
            shoppingAmount = v.order.shoppingAmount
            totalDiscount = v.order.totalDiscount
            sponsorAmount = v.order.sponsorAmount
            console.log(deductionAmount, deductionSeed)
            v.orderGoodsBo.forEach((v, i) => {
              if (that.data.buyType == 2) {
                v.orderGoods.payAmount = Number((v.orderGoods.payAmount + v.orderGoods.expressFee - v.orderGoods.expressFee).toFixed(2))
                v.orderGoods.discountRatio = v.orderGoods.discountRatio / 10
              } else {
                v.orderGoods.payAmount = Number((v.orderGoods.payAmount + v.orderGoods.expressFee).toFixed(2))
                v.orderGoods.discountRatio = v.orderGoods.discountRatio / 10
              }
            })
          })
          that.setData({
            placeOrder: arr1,
            goodsType: goodsType, //类型为申请零元购
            needPaymentAmount: needPaymentAmount, //零元购需要支付的钱
            cashBackPeriods: cashBackPeriods, //申请零元购返现期数
            buyMode: res.data.content.order.buyMode,
            deductionAmount: deductionAmount.toFixed(2),
            deductionSeed: deductionSeed,
            deductionAfterAmount: deductionAfterAmount.toFixed(2),
            discountRatio:discountRatio.toFixed(1),
            discountAmount:discountAmount.toFixed(2),
            shoppingAmount:shoppingAmount.toFixed(2),
            shoppingNum:shoppingNum,
            totalDiscount:totalDiscount.toFixed(2),
            sponsorAmount:sponsorAmount
          })
          var actualPrice = 0
          for (var i = 0; i < that.data.placeOrder.length; i++) {
            var orderGoods = that.data.placeOrder[i].orderGoodsBo
            for (var j = 0; j < orderGoods.length; j++) {
              if (that.data.buyType == 2) {
                actualPrice += orderGoods[j].orderGoods.payAmount - orderGoods[j].orderGoods.expressFee
              } else {
                actualPrice += orderGoods[j].orderGoods.payAmount
              }
            }
          }
          var price1 = Number(actualPrice).toFixed(2);
          that.setData({
            actualPrice: price1,

          })
        } else {
          wx.showToast({
            title: res.data.message,
            icon: 'none'
          })
        }
      })
  },
  //购物车下单
  cardIdsPurchase: function () {
    var that = this
      var cardIds = JSON.parse(that.data.options.cardIds);
      that.setData({
        cardIds: cardIds
      })
      app.Util.ajax('mall/order/checkCart', {
        cardIds: cardIds,
        useSeed: that.data.seedShow == true?1:0,
        useCoupon:that.data.shoppingAmountShow == true?1:0
      }, 'POST').then((res) => { // 使用ajax函数
        if (res.data.content) {
          var arr = []
          var arr1 = arr.concat(res.data.content)
          //订单总种子抵扣金额与种子数
          var deductionAmount = 0
          var deductionSeed = 0
          var deductionAfterAmount = 0
          var discountRatio = 0 //freebuy折扣
          var discountAmount = 0 //freebuy折扣抵扣金额
          var shoppingAmount = 0 //购物金抵扣金额
          var shoppingNum = arr1[0].order.shoppingNum //购物金剩余次数
          var shoppingNum2 = 0 //购物金剩余次数
          var totalDiscount = 0 //优惠总金额
          for (let i in arr1) {
            arr1[i].remark = '选填',
              arr1[i].colors = '#ff6417'
          }
          arr1.forEach((v, i) => {
            deductionAmount = v.order.deductionAmount + deductionAmount
            deductionSeed = v.order.deductionSeed + deductionSeed
            deductionAfterAmount = deductionAfterAmount + v.order.deductionAfterAmount
            discountRatio = v.order.discountRatio / 10
            discountAmount = v.order.discountAmount + discountAmount
            shoppingAmount = v.order.shoppingAmount + shoppingAmount
            totalDiscount = v.order.totalDiscount + totalDiscount
            shoppingNum2 = v.order.shoppingNum
            console.log(deductionAmount, deductionSeed)
            v.orderGoodsBo.forEach((v, i) => {
              v.orderGoods.payAmount = Number((v.orderGoods.payAmount + v.orderGoods.expressFee).toFixed(2))
              v.orderGoods.discountRatio = v.orderGoods.discountRatio / 10
            })
          })
          that.setData({
            placeOrder: arr1,
            buyMode: res.data.content[0].order.buyMode,
            deductionAmount: deductionAmount.toFixed(2),
            deductionSeed: deductionSeed,
            deductionAfterAmount: deductionAfterAmount.toFixed(2),
            discountRatio:discountRatio.toFixed(1),
            discountAmount:discountAmount.toFixed(2),
            shoppingAmount:shoppingAmount.toFixed(2),
            shoppingNum:that.data.shoppingAmountShow == true?shoppingNum2:shoppingNum,
            totalDiscount:totalDiscount.toFixed(2),
          })
          var actualPrice = 0
          for (var i = 0; i < that.data.placeOrder.length; i++) {
            var orderGoods = that.data.placeOrder[i].orderGoodsBo
            for (var j = 0; j < orderGoods.length; j++) {
              if (that.data.buyType == 2) {
                actualPrice += orderGoods[j].orderGoods.payAmount - orderGoods[j].orderGoods.expressFee
              } else {
                actualPrice += orderGoods[j].orderGoods.payAmount
              }
            }
          }
          var price1 = Number(actualPrice).toFixed(2);
          that.setData({
            actualPrice: price1,
          })
        } else {
          wx.showToast({
            title: res.data.message,
            icon: 'none'
          })
        }
      })
    
  },
  seedShow: function() {
    var that = this
    if (that.data.seedShow == true) {
      that.setData({
        seedShow: false
      })
    } else {
      that.setData({
        seedShow: true
      })
    }
    if (that.data.options.goodsType) {
      //申请0成本购校验
      if(that.data.options.sponsorId){
        //赞助0元购申请订单
        that.applyPurchase2();
      }else{
        //申请0元购订单
        that.applyPurchase();
      }
    } else if (that.data.options.cardIds) {
      //购物车校验
      that.cardIdsPurchase()
    } else {
      //普通商品校验
      that.getSingle()
    }
  },
  seedDetail: function() {
    console.log("种子抵扣明细")
    this.setData({
      seedDetailShow: true
    })

  },
  seedDetailShowClose: function() {
    this.setData({
      seedDetailShow: false
    })
  },
  shoppingAmountShow:function(){
    var that = this
    if(that.data.shoppingAmountShow == true){
      that.setData({
        shoppingAmountShow: false
      })
    }else{
      that.setData({
        shoppingAmountShow: true
      })
    }
    if (that.data.options.goodsType) {
      //申请0成本购校验
      if(that.data.options.sponsorId){
        //赞助0元购申请订单
        that.applyPurchase2();
      }else{
        //申请0元购订单
        that.applyPurchase();
      }
    } else if (that.data.options.cardIds) {
      //购物车校验
      that.cardIdsPurchase()
    }
  }
})