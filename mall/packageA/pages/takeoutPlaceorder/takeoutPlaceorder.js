// packageA/pages/takeoutPlaceorder/takeoutPlaceorder.js
var time = require('../../../utils/util.js');
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showModal: false,
    isBack: false,
    hostUrl: app.Util.getUrlImg().hostUrl,
    showPeriod: false,
    current: 1, //是否选中外卖配送或者到店自取
    cur: 0, //选中返还期数
    monthStatus: false, //自定义分期数
    showWay: false, //在线支付时间和支付方式
    showText: '在线支付', //到店自取
    showTake: '在线支付', //外卖配送
    getWayTime: '',
    appointment: [],
    shoppingAmountShow: true, //是否使用购物金
    useSeed: true, //是否使用种子
    monthInput: '请输入分期数',
    tempStatus: 1,
    tempTitle: '选择支付方式',
    inputBorder: "border: #DBDBDB 2rpx solid;margin:28rpx 0;width:500rpx;height:50rpx;margin-left:50rpx;",
    orderContent: null,
    deliveryType: 1, //配送类型
    payType: 1, //支付类型
    userAddressBookId: null, //地址id
    appointmentTime: null,
    bgColor: '#ff2644',
    navData: [{
      type: 1,
      img: app.Util.getUrlImg().hostUrl + '/changeImg/not_select_a.png',
      img1: app.Util.getUrlImg().hostUrl + '/changeImg/select_a.png',
      title: '外卖配送'
    }, {
      type: 2,
      img: app.Util.getUrlImg().hostUrl + '/changeImg/select_b.png',
      img1: app.Util.getUrlImg().hostUrl + '/changeImg/not_select_b.png',
      title: '到店自取'
    }],
    arry: [{
      name: '在线支付',
      type: 1
    }, {
      name: '立即送出',
      type: 2
    }],
    arry1: [{
      name: '在线支付',
      select: false
    }, {
      name: '到付',
      select: false
    }],
    canUseTime: [],
    canUse: null,
    store: null, //店铺id
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this
    that.setData({
      store: JSON.parse(options.store)
    })
    // 校验购物袋
    that.checkCart()
    //查询可配送地址
    that.queryAddress()
    //查询可配送时间
    that.queryTime()
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
    let that = this
    let canUse = wx.getStorageSync("distributionAddress")
    that.setData({
      canUse: canUse ? canUse : that.data.canUse,
      userAddressBookId: canUse ? canUse.id : that.data.userAddressBookId
    })
    // 校验购物袋
    that.checkCart()
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
  onUnload: function() {},

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
  nav: function() {
    let that = this;
    wx.getLocation({
      type: 'gcj02',
      altitude: true,
      success: function(res) {
        wx.openLocation({ //?使用微信内置地图查看位置。
          latitude: that.data.store.lat, //要去地点的纬度
          longitude: that.data.store.lng, ///要去地点的经度-地址
          name: that.data.orderContent.order.storeName, //
          address: that.data.store.addressDetail
        })
      },
      fail: function(res) {
        let is_first = wx.getStorageSync('is_first')
        if (is_first) {
          wx.showModal({
            title: '获取位置信息',
            content: '是否允许获取你的地理位置呢？',
            success: function(res) {
              if (res.confirm) {
                wx.getSetting({
                  success(res) {
                    if (!res.authSetting['scope.userLocation']) {
                      wx.openSetting({
                        success: function(res) {
                          wx.openLocation({ //?使用微信内置地图查看位置。
                            latitude: that.data.store.lat, //要去地点的纬度
                            longitude: that.data.store.lng, ///要去地点的经度-地址
                            name: that.data.orderContent.order.storeName, //
                            address: that.data.store.addressDetail
                          })
                        },
                        fail: function(res) {
                          //用户拒绝位置授权
                        }
                      })
                    }
                  }
                })
              }
              if (res.cancel) {
                //用户拒绝位置授权
              }
            }
          })
        } else {
          //用户拒绝位置授权
          wx.setStorageSync('is_first', true)
        }
      }
    })
  },
  //查询可配送地址
  queryAddress() {
    let that = this
    app.Util.ajax('mall/bag/queryAddressBook', {
      storeId: that.data.store.id
    }, 'GET').then((res) => {
      if (res.data.messageCode == 'MSG_1001') {
        that.setData({
          canUse: res.data.content.canUse.length > 0 ? res.data.content.canUse[0] : '',
        })
      }
    })
  },
  queryTime() {
    let that = this
    let appointment = []
    let canUseTime = []
    app.Util.ajax('mall/bag/queryAppointmentTime', {
      storeId: that.data.store.id
    }, 'GET').then((res) => {
      if (res.data.messageCode == 'MSG_1001') {
        canUseTime = res.data.content
        appointment = JSON.stringify(res.data.content)
        that.setData({
          appointment: appointment,
          canUseTime: canUseTime
        })
        for (let i of that.data.canUseTime) {
          i.time = that.toDate(i.time)
        }

        let timestamp = (new Date()).getTime();
        let date = new Date(timestamp);
        //获取年份  
        let Y = date.getFullYear();
        //获取月份  
        let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
        //获取当日日期 
        let D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
        let H = date.getHours();
        let S = date.getMinutes();
        let cusxin = []
        let scisxn = []
        for (let i = 0; i < that.data.canUseTime.length; i++) {
          scisxn.push(that.data.canUseTime[i].time.substring(0, 10))
          cusxin.push(that.data.canUseTime[i].time.substring(11, 16))
        }
        let appTime = JSON.parse(that.data.appointment)
        for (let i = 0; i < appTime.length; i++) {
          if (appTime[i].time <= timestamp + 60000) {
            cusxin[i] = '立即送出'
          }
        }
        for (let x = 0; x < scisxn.length; x++) {
          if (scisxn[x] == (Y + '-' + M + '-' + D)) {
            cusxin[x] = cusxin[x]
          } else if (scisxn[x] == (Y + '-' + M + '-' + (D + 1))) {
            cusxin[x] = '次日' + cusxin[x]
          }
        }
        that.setData({
          canUseTime: cusxin
        })
        if (res.data.content.length > 0) {
          if (cusxin[0] == '立即送出') {
            that.setData({
              getWayTime: '立即送出',
              appointmentTime: appTime[0].time
            })
          } else {
            that.setData({
              getWayTime: '选择配送时间'
            })
          }
        } else {
          that.setData({
            getWayTime: '立即送出'
          })
        }
      }
    })
  },
  changeType(data) {
    return new Date().getTime();
  },
  toDate: function(value) {
    var time = new Date(value);
    var year = time.getFullYear();
    var month = time.getMonth() + 1;
    var date = time.getDate();
    var hour = time.getHours();
    var minute = time.getMinutes();
    var second = time.getSeconds();
    month = month < 10 ? "0" + month : month;
    date = date < 10 ? "0" + date : date;
    hour = hour < 10 ? "0" + hour : hour;
    minute = minute < 10 ? "0" + minute : minute;
    second = second < 10 ? "0" + second : second;
    return year + "-" + month + "-" + date + ' ' + hour + ':' + minute
  },
  //校验购物袋
  checkCart() {
    let that = this
    let data = {
      storeId: that.data.store.id,
      useSeed: that.data.useSeed == true ? 1 : 0,
      useCoupon: that.data.shoppingAmountShow == true ? 1 : 0,
      deliveryType: that.data.deliveryType,
      payType: that.data.payType,
      userAddressBookId: that.data.userAddressBookId, //地址id
      appointmentTime: that.data.appointmentTime,
    }
    app.Util.ajax('mall/bag/checkBag', data, 'POST').then((res) => {
      if (res.data.messageCode == 'MSG_1001') {
        res.data.content.goodsCount = res.data.content.goodsCount > 99 ? '99' : res.data.content.goodsCount
        that.setData({
          orderContent: res.data.content,
          bgColor: res.data.content.achieveStartPrice == 1 ? '#ff2644' : '#AAAAAA'
        })
        if (res.data.content.achieveStartPrice == 0){
          wx.showToast({
            title: '未达到起送价',
            icon: 'none'
          })
        }else if (res.data.content.hasErrGoods == 1) {
          wx.showToast({
            title: '部分商品价格信息有变动\n不参与结算',
            icon:'none'
          })
        }
      } else if (res.data.messageCode == 'MSG_4002'){
          wx.navigateBack({
            delta:1
          })
      } else {
        wx.showToast({
          title: res.data.message,
          icon: 'none'
        })
      }
    })
  },
  toPlaceOrder() {
    let that = this
    if (that.data.bgColor == '#ff2644') {
      if (that.data.payType == 1) {
        let data = {
          storeId: that.data.store.id,
          useSeed: that.data.useSeed == true ? 1 : 0,
          useCoupon: that.data.shoppingAmountShow == true ? 1 : 0,
          deliveryType: that.data.deliveryType,
          payType: that.data.payType,
          appointmentTime: that.data.appointmentTime,
          userAddressBookId: that.data.canUse.id //地址id
        }
        app.Util.ajax('mall/bag/addOrderByBag', data, 'POST').then((res) => {
          if (res.data.messageCode == 'MSG_1001') {
            if (res.data.content.hasErrGoods == 1) {
              wx.showToast({
                title: '部分商品价格信息有变动\n不参与结算',
                icon: 'none'
              })
            }
            setTimeout(function(){
              wx.navigateTo({
                url: `/pages/paymentorder/paymentorder?id=${res.data.content.id}&buyWay=${1}&buymode=${that.data.orderContent.order.buyMode}`,
              })
            },1000)
          } else if (res.data.message == '[userAddressId] 不能为空') {
            wx.showToast({
              title: '请选择配送地址',
              icon: 'none'
            })
          } else if (res.data.messageCode == 'MSG_4002') {
              wx.navigateBack({
                delta:1
              })
          } else {
            wx.showToast({
              title: res.data.message,
              icon: 'none'
            })
          }
        })
      } else {
        let data = {
          storeId: that.data.store.id,
          useSeed: that.data.useSeed == true ? 1 : 0,
          useCoupon: that.data.shoppingAmountShow == true ? 1 : 0,
          deliveryType: that.data.deliveryType,
          payType: that.data.payType,
          appointmentTime: that.data.appointmentTime,
          userAddressBookId: that.data.canUse.id //地址id
        }
        app.Util.ajax('mall/bag/addOrderByBag', data, 'POST').then((res) => {
          if (res.data.messageCode == 'MSG_1001') {
            if (res.data.content.hasErrGoods == 1) {
              wx.showToast({
                title: '部分商品价格信息有变动\n不参与结算',
                icon: 'none'
              })
            }
            setTimeout(function () {
              app.Util.ajax('mall/payment/pay', {
                transStatementId: res.data.content.id,
                channel: 3,
                client: 2
              }, 'POST').then((res) => {
                wx.navigateTo({
                  url: `/pages/myorder/myorder?status=${0}`,
                })
              })
            }, 1000)           
          } else if (res.data.message == '[userAddressId] 不能为空') {
            wx.showToast({
              title: '请选择配送地址',
              icon: 'none'
            })
          } else if (res.data.messageCode == 'MSG_4002') {
              wx.navigateBack({
                delta:1
              })
          } else {
            wx.showToast({
              title: res.data.message,
              icon: 'none'
            })
          }
        })
      }
    } else {
      return;
    }
  },
  //查询支付方式
  tapWay(e) {
    let that = this
    if (that.data.tempStatus == 1) {
      if (that.data.current == 1) {
        let index = e.currentTarget.dataset.index
        if (index == 0) {
          that.setData({
            deliveryType: 1,
            payType: 1,
            showWay: false,
            showText: e.currentTarget.dataset.name
          })
          that.checkCart()
        } else if (index == 1) {
          that.setData({
            deliveryType: 1,
            payType: 2,
            showWay: false,
            showModal: true,
            showText1: e.currentTarget.dataset.name
          })

        }
      } else if (that.data.current == 0) {
        let index = e.currentTarget.dataset.index
        if (index == 0) {
          that.setData({
            deliveryType: 2,
            payType: 1,
            showWay: false,
            showTake: e.currentTarget.dataset.name
          })
          that.checkCart()
        } else if (index == 1) {
          that.setData({
            deliveryType: 2,
            payType: 2,
            showWay: false,
            showModal: true,
            showTake1: e.currentTarget.dataset.name
          })

        }
      }
    } else if (that.data.tempStatus == 2) {
      let appointment = JSON.parse(that.data.appointment)
      that.setData({
        getWayTime: e.currentTarget.dataset.time,
        showWay: false,
        appointmentTime: e.currentTarget.dataset.time == '立即送出' ? null : appointment[e.currentTarget.dataset.index].time
      })
      that.checkCart();
    }
  },
  //
  need() {
    let that = this
    if (that.data.current == 1) {
      that.setData({
        showText: that.data.showText1,
        showModal: false
      })
      that.checkCart()
    } else if (that.data.current == 0) {
      that.setData({
        showTake: that.data.showTake1,
        showModal: false
      })
      that.checkCart()
    }
  },
  noNeed: function(e) {
    let that = this
    that.setData({
      showModal: false
    })
  },
  //是否使用种子
  seedShow() {
    let that = this
    that.setData({
      useSeed: !that.data.useSeed
    })
    if (that.data.useSeed == true) {
      that.checkCart();
    } else {
      that.checkCart();
    }
  },
  //是否使用购物金
  shoppingAmountShow() {
    let that = this
    that.setData({
      shoppingAmountShow: !that.data.shoppingAmountShow
    })
    if (that.data.shoppingAmountShow == true) {
      that.checkCart();
    } else {
      that.checkCart();
    }
  },
  switchNav(e) {
    let that = this;
    that.setData({
      current: e.currentTarget.dataset.index,
    })
    if (that.data.current == 0) {
      that.setData({
        deliveryType: 2,
        payType: 1,
        showTake: '在线支付',
        showWay: false,
        appointmentTime: that.data.appointmentTime,
        userAddressBookId: that.data.canUse ? that.data.canUse.id : null //地址id
      })
      that.checkCart()
    } else if (that.data.current == 1) {
      that.setData({
        deliveryType: 1,
        payType: 1,
        showWay: false,
        showText: '在线支付',
      })
      that.checkCart()
    }
  },
  //请选择返还的期数
  getPeriod(e) {
    let that = this
    that.setData({
      cur: e.currentTarget.dataset.index
    })
    let data = {
      id: that.data.bagId,
      quantity: that.data.quantity,
      cashBackId: e.currentTarget.dataset.cashbackid,
    }
    app.Util.ajax('mall/bag/updateShoppingCart', data, 'POST').then((res) => {
      if (res.data.messageCode == 'MSG_1001') {
        that.checkCart()
        that.setData({
          showPeriod: false
        })
      }
    })
  },
  getShowPeriod(e) {
    let that = this
    that.setData({
      stagetype: e.currentTarget.dataset.stagetype,
      cashBackType: e.currentTarget.dataset.cashbacktype,
      bagId: e.currentTarget.dataset.bagid,
      quantity: e.currentTarget.dataset.quantity,
    })
    let data = {
      bagId: e.currentTarget.dataset.bagid
    }
    app.Util.ajax('mall/bag/queryCashBackPeriods', data, 'GET').then((res) => {
      if (res.data.messageCode == 'MSG_1001') {
        for (let i = 0; i < res.data.content.length;i++){
          if (res.data.content[i].cashBackId == e.currentTarget.dataset.cashbackid){
            that.setData({
              cur: i
            })
          }
        }
        that.setData({
          cashBackPeriods: res.data.content
        })
        that.setData({
          showPeriod: true
        })
      }
    })
  },
  cancelPeriod() {
    let that = this
    that.setData({
      showPeriod: false
    })
  },
  getMonthText(e) {
    let that = this
    let data = {
      id: that.data.bagId,
      quantity: that.data.quantity,
      cashBackPeriods: e.currentTarget.dataset.periods
    }
    app.Util.ajax('mall/bag/updateShoppingCart', data, 'POST').then((res) => {
      if (res.data.messageCode == 'MSG_1001') {
        that.checkCart()
        that.setData({
          showPeriod: false
        })
      }
    })
  },
  //支付最少
  payMin() {
    let that = this
    let data = {
      storeId: that.data.store.id,
      type: 1
    }
    app.Util.ajax('mall/bag/uniformSetUp', data, 'POST').then((res) => {
      if (res.data.messageCode == 'MSG_1001') {
        that.checkCart()
      }
    })
  },
  //返还最快
  cashFast() {
    let that = this
    let data = {
      storeId: that.data.store.id,
      type: 2
    }
    app.Util.ajax('mall/bag/uniformSetUp', data, 'POST').then((res) => {
      if (res.data.messageCode == 'MSG_1001') {
        that.checkCart()
      }
    })
  },
  //自定义弹窗
  custom() {
    let that = this
    that.setData({
      monthStatus: true,
      showPeriod: false,
    })
  },
  //获取自定义弹窗的分期数
  monthNumber(e) {
    let that = this
    that.setData({
      month: Number(e.detail.value)
    })
  },
  //确定
  monthButton() {
    let that = this
    let reg = /^\d{0,5}([\b]*|\.|\.\d{0,1}|$)$/
    if (that.data.month && reg.test(that.data.month)) {
      let data = {
        id: that.data.bagId,
        quantity: that.data.quantity,
        cashBackPeriods: that.data.month
      }
      app.Util.ajax('mall/bag/updateShoppingCart', data, 'POST').then((res) => {
        if (res.data.messageCode == 'MSG_1001') {
          that.checkCart()
          that.setData({
            monthStatus: false
          })
        } else {
          wx.showToast({
            title: res.data.message,
            icon: 'none'
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
  monthStop() {
    let that = this
    that.setData({
      monthStatus: false
    })
  },
  //是否支持到付
  isPayType() {
    let that = this
    that.setData({
      showWay: true,
      tempStatus: 1
    })
  },
  //支付方式和送达时间
  onlinePay() {
    let that = this
    that.setData({
      showWay: true,
      tempTitle: '选择支付方式',
      tempStatus: 1
    })
  },
  getWay() {
    let that = this
    let appointment = JSON.parse(that.data.appointment)
    if (appointment.length == 0) {
      wx.showToast({
        title: '该商家没有可选配送时间',
        icon: 'none'
      })
    } else {
      that.setData({
        showWay: true,
        tempTitle: '选择预订送达时间',
        tempStatus: 2
      })
    }
  },
  cancelCondition() {
    let that = this
    that.setData({
      showWay: false
    })
  },
  chooseAdress: function() {
    let that = this
    wx.navigateTo({
      url: `/packageA/pages/distributionAddress/distributionAddress?storeId=` + that.data.store.id,
    })
  }
})