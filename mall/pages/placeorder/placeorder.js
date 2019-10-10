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
    styleDisply:'',
    display:'',
    type:null
  },
  //跳转到支付订单页面
  toPaymentorder: function(e) {
    var that = this
    var buymode = e.currentTarget.dataset.buymode
    var goodsList = that.data.goodsList;
    var type = that.data.options.type;
    console.log("type:"+type)
    goodsList.remark = that.data.remarks
    that.setData({
      disabled: true
    })
    if (that.data.addressItems != '') {
      if (that.data.cardIds.length > 0) {
        var cardIds = that.data.cardIds
        var temp = that.data.placeOrder
        var tempRemark = []
        temp.forEach((v,i)=>{
          if(v.remark=="选填"){
            tempRemark.push('')
          }else{
            tempRemark.push(v.remark)
          } 
        })
        // console.log("tempRemark:"+JSON.stringify(tempRemark))
        // console.log("temp:"+JSON.stringify(temp))
        app.Util.ajax('mall/order/addOrderByCart', {
          cardIds: cardIds,
          userAddressBookId: that.data.userAddressBookId,
          remarkList: tempRemark
        }, 'POST').then((res) => {
          if (res.data.content) {
            // console.log('提交订单1：' + JSON.stringify(res.data))
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
      } else if (that.data.options.type) {
        // console.log(that.data.options.stockId,that.data.options.type,that.data.userAddressBookId,that.data.remarks)
        app.Util.ajax('mall/home/activity/freeShopping/placeOrder', {
          // goodsId: that.data.goodsId,
          stockId: that.data.options.stockId,
          type: that.data.options.type,
          userAddressBookId: that.data.userAddressBookId,
          remark:that.data.remarks
        }, 'POST').then((res) => { // 使用ajax函数
          // console.log('提交订单2：' + JSON.stringify(res.data))
          if (res.data.content) {
            if(that.data.options.type==2){
              wx.navigateTo({
                url: `/pages/paymentorder/paymentorder?id=${res.data.content.transStatement.id ? res.data.content.transStatement.id : ''}&cashBack=${that.data.cashBack}&flag=${true}&createTime=${res.data.content.transStatement.createTime}&buymode=${buymode}&orderType=${4}`,
              })
            }else{
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
      //  console.log('提交订单的参数：' + JSON.stringify(goodsList))
        app.Util.ajax('mall/order/addOrderByGoods', goodsList, 'POST').then((res) => { // 使用ajax函数
        //  console.log('提交订单3：' + JSON.stringify(res.data))
          //  console.log('提交订单的参数：'+JSON.stringify(goodsList))
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
  //终止0元购弹框
  stopZero: function() {
    var that = this
    that.setData({
      showStop: true
    })
  },
  cancelStop: function() {
    var that = this
    that.setData({
      showStop: false
    })
  },
  //弹出订单备注框
  remarksBtn: function(e) {
    console.log('e:' + JSON.stringify(e.currentTarget.dataset.index))
    var that = this
    that.setData({
      showReMark: true,
      tempIndex: e.currentTarget.dataset.index
    })
  },
  //获取文本框的值
  bindTextAreaBlur: function(e) {
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
  cancelBtn: function() {
    var that = this
    that.setData({
      showReMark: false,
      currentNoteLen:0
    })
  },
  sureBtn: function(e) {
    var that = this
    console.log(e.currentTarget.dataset.index)
    that.data.placeOrder.forEach((v, i) => {
      if (i == e.currentTarget.dataset.index) {
        v.remark = that.data.remarks
        v.colors = '#333'
        that.setData({
          showReMark: false,
          placeOrder: that.data.placeOrder,
          currentNoteLen:0
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log("options:"+JSON.stringify(options))
    var that = this
    var goodsId = parseInt(options.goodsId)
    var stockId = parseInt(options.stockId)
    var quantity = parseInt(options.quantity)
    var cashBackId = parseInt(options.cashbackId)
    var type = parseInt(options.type)
    var expectedAmount = parseInt(options.expectedAmount) //想花多少钱获得商品
    that.setData({
      options: options
    })
    if (options.cardIds) {
      //购物车校验下单
      var cardIds = JSON.parse(options.cardIds);
      that.setData({
        cardIds: cardIds
      })
      app.Util.ajax('mall/order/checkCart', cardIds, 'POST').then((res) => { // 使用ajax函数
        console.log('购物车提交：' + JSON.stringify(res.data.content))
        if (res.data.content) {
          var arr = []
          var arr1 = arr.concat(res.data.content)
          for (let i in arr1) {
            arr1[i].remark = '选填',
            arr1[i].colors = '#ff6417'
          }
          that.setData({
            placeOrder: arr1,
            buyMode: res.data.content[0].order.buyMode
          })
          var actualPrice = 0
          for (var i = 0; i < that.data.placeOrder.length; i++) {
            var orderGoods = that.data.placeOrder[i].orderGoodsBo
            for (var j = 0; j < orderGoods.length; j++) {
              // console.log('分期钱：'+orderGoods[j].orderGoods.cashBack)
              if (orderGoods[j].orderGoods.purchaseTotalPrice) {
                //零元购商品计算分期价格
                actualPrice += orderGoods[j].orderGoods.purchaseTotalPrice + orderGoods[j].orderGoods.expressFee
              } else {
                actualPrice += (orderGoods[j].orderGoods.price * orderGoods[j].orderGoods.quantity) + orderGoods[j].orderGoods.expressFee
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
    } else if (options.goodsType) {
      var needPaymentAmount = options.needPaymentAmount; //申请零元购需支付的钱
      var cashBackPeriods = options.cashBackPeriods; //申请零元购返现期数
      var goodsType = options.goodsType;
      app.Util.ajax('mall/order/checkGoods', {
        goodsId: options.goodsId,
        stockId: options.stockId,
        quantity: options.quantity,
        orderType: 1,
        expectedAmount: options.expectedAmount,
        cashBackPeriods: options.cashBackPeriods

      }, 'POST').then((res) => {
      //  console.log('商品详情：' + JSON.stringify(res.data.content))
        if (res.data.content) {
          var arr = []
          var arr1 = arr.concat(res.data.content)
          for (let i in arr1) {
            arr1[i].remark = '选填',
            arr1[i].colors = '#ff6417'
          }
        //  console.log(arr1)
          that.setData({
            placeOrder: arr1,
            goodsType: goodsType, //类型为申请零元购
            needPaymentAmount: needPaymentAmount, //零元购需要支付的钱
            cashBackPeriods: cashBackPeriods, //申请零元购返现期数
            buyMode: res.data.content.order.buyMode
          })
          var actualPrice = 0
          for (var i = 0; i < that.data.placeOrder.length; i++) {
            var orderGoods = that.data.placeOrder[i].orderGoodsBo
            for (var j = 0; j < orderGoods.length; j++) {
              if (orderGoods[j].orderGoods.purchaseTotalPrice) {
                //零元购商品计算分期价格
                actualPrice += orderGoods[j].orderGoods.purchaseTotalPrice + orderGoods[j].orderGoods.expressFee
              } else {
                actualPrice += (orderGoods[j].orderGoods.price * orderGoods[j].orderGoods.quantity) + orderGoods[j].orderGoods.expressFee
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
    } else if (options.type ==1) {
      console.log(66)
      //零元购校验下单
      var stockId = parseInt(options.stockId)
      var goodsId = parseInt(options.goodsId)
      app.Util.ajax('mall/order/checkGoods',{
        stockId: stockId,
        goodsId: goodsId,
        // type: type,
        orderType: 3       
      }, 'POST').then((res) => { // 使用ajax函数
        console.log("res:"+JSON.stringify(res.data))
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
    } else if (options.type==2){
      //零元购校验下单
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
    }else if (options.type ==3) {
      console.log(66)
      //零元购校验下单
      var stockId = parseInt(options.stockId)
      var goodsId = parseInt(options.goodsId)
      app.Util.ajax('mall/order/checkGoods',{
        stockId: stockId,
        goodsId: goodsId,
        // type: type,
        orderType: 5      
      }, 'POST').then((res) => { // 使用ajax函数
        console.log("res:"+JSON.stringify(res.data))
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
      //单个商品校验下单
      app.Util.ajax('mall/order/checkGoods', {
        goodsId: goodsId,
        stockId: stockId,
        quantity: quantity,
        cashBackId: cashBackId,
        orderType: 1 //普通订单
      }, 'POST').then((res) => { // 使用ajax函数
      //  console.log('商品详情：' + JSON.stringify(res.data.content))
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
              if (orderGoods[j].orderGoods.purchaseTotalPrice) {
                //零元购商品计算分期价格
                actualPrice += orderGoods[j].orderGoods.purchaseTotalPrice + orderGoods[j].orderGoods.expressFee
              } else {
                actualPrice += (orderGoods[j].orderGoods.price * orderGoods[j].orderGoods.quantity) + orderGoods[j].orderGoods.expressFee
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

  }
})