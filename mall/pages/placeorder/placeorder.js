// pages/placeorder/placeorder.js
var time = require('../../utils/util.js');
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
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
    userAddressBookId: 1, //地址id
    activityGoodsId: '', //0元购
    goodsId: 1, //商品id
    options: {},
    disabled: false,
  },
  //跳转到支付订单页面
  toPaymentorder: function(e) {
    var that = this
    console.log(0)
    var goodsList = that.data.goodsList;
    that.setData({
      disabled: true
    })
    if (that.data.addressItems != '') {
      if (that.data.cardIds.length > 0) {
        var cardIds = that.data.cardIds
        app.Util.ajax('mall/order/addOrderByCart', {
          cardIds: cardIds,
          userAddressBookId: that.data.userAddressBookId
        }, 'POST').then((res) => {
          if (res.data.content) {
            wx.navigateTo({
              url: `/pages/paymentorder/paymentorder?id=${res.data.content.id}`,
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
      } else if (that.data.activityGoodsId !== '') {
        app.Util.ajax('mall/home/activity/freeShopping/placeOrder', {
          goodsId: that.data.goodsId,
          userAddressBookId: that.data.userAddressBookId
        }, 'POST').then((res) => { // 使用ajax函数
          if (res.data.content) {
            wx.navigateTo({
              url: `/pages/paymentorder/paymentorder?id=${res.data.content.transStatement.id ? res.data.content.transStatement.id : ''}&cashBack=${that.data.cashBack}&flag=${true}&createTime=${res.data.content.transStatement.createTime}`,
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
      } else {
        app.Util.ajax('mall/order/addOrderByGoods', goodsList, 'POST').then((res) => { // 使用ajax函数
          if (res.data.content) {
            wx.navigateTo({
              url: `/pages/paymentorder/paymentorder?id=${res.data.content.id}`,
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
  },
  //跳转到添加地址页面
  jumpAddress: function() {
    var that = this;
    wx.navigateTo({
      url: '/pages/address/address',
    })
    wx.setStorage({
      key: "goAddress",
      data: "1"
    })
  },
  hideModal: function() {
    var that = this;
    that.setData({
      showModalStatus: false
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options)
    this.setData({
      options: options
    })
    var that = this
    var goodsId = parseInt(options.goodsId)
    var stockId = parseInt(options.stockId)
    var quantity = parseInt(options.quantity)
    var cashBackId = parseInt(options.cashbackId)
    if (options.cardIds) {
      //购物车下单
      var cardIds = JSON.parse(options.cardIds);
      that.setData({
        cardIds: cardIds
      })
      app.Util.ajax('mall/order/checkCart', cardIds, 'POST').then((res) => { // 使用ajax函数
        if (res.data.content) {
          var arr = []
          var arr1 = arr.concat(res.data.content)
          that.setData({
            placeOrder: arr1
          })
          var actualPrice = 0
          for (var i = 0; i < that.data.placeOrder.length; i++) {
            var orderGoods = that.data.placeOrder[i].orderGoodsBo
            for (var j = 0; j < orderGoods.length; j++) {
              actualPrice += (orderGoods[j].orderGoods.price * orderGoods[j].orderGoods.quantity) + orderGoods[j].orderGoods.expressFee
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
    } else if (options.activityGoodsId) {
      //零元购下单
      var activityGoodsId = parseInt(options.activityGoodsId)
      var goodsId = parseInt(options.goodsId)
      that.setData({
        activityGoodsId: activityGoodsId,
        goodsId: goodsId
      })
      app.Util.ajax('mall/order/checkGoods', {
        activityGoodsId: activityGoodsId,
        orderType: 3
      }, 'POST').then((res) => { // 使用ajax函数
        if (res.data.content) {
          var arr = []
          var arr1 = arr.concat(res.data.content)
          that.setData({
            placeOrder: arr1
          })
          var actualPrice = 0
          for (var i = 0; i < that.data.placeOrder.length; i++) {
            var orderGoods = that.data.placeOrder[i].orderGoodsBo
            for (var j = 0; j < orderGoods.length; j++) {
              actualPrice += (orderGoods[j].orderGoods.price * orderGoods[j].orderGoods.quantity) + orderGoods[j].orderGoods.expressFee
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
      //单个商品下单
      app.Util.ajax('mall/order/checkGoods', {
        goodsId: goodsId,
        stockId: stockId,
        quantity: quantity,
        cashBackId: cashBackId,
        orderType: 1 //普通订单
      }, 'POST').then((res) => { // 使用ajax函数
        if (res.data.content) {
          var arr = []
          var arr1 = arr.concat(res.data.content)
          that.setData({
            placeOrder: arr1
          })
          var actualPrice = 0
          for (var i = 0; i < that.data.placeOrder.length; i++) {
            var orderGoods = that.data.placeOrder[i].orderGoodsBo
            for (var j = 0; j < orderGoods.length; j++) {
              actualPrice += (orderGoods[i].orderGoods.price * orderGoods[i].orderGoods.quantity) + orderGoods[i].orderGoods.expressFee
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

    }
    var address = wx.getStorageSync('address')
    if (address) {
      console.log(address)
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
          userAddressBookId: address.id
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
              userAddressBookId: res.data.content[0].id
            }
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
    const that = this
    that.onLoad(that.data.options);
    that.setData({
      disabled: false
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

  }
})