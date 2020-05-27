// packageA/pages/saveMoneyMessage/saveMoneyMessage.js
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hostUrl: app.Util.getUrlImg().hostUrl,
    placeholder1: `请输入您想要购买该商品的价格-建议出价:￥1900`,
    showSuccess: false,
    name: '', //姓名
    phoneNumber: '', //电话号码
    city: '', //所在区域
    userAddressBookId: '', //地址id
    getOffer: null, //出价
    orderContent: null, //想说的话
    showBtn: '发布'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this
    if (options.editPrice) {
      let editPrice = JSON.parse(options.editPrice)
      editPrice.iconurl = editPrice.iconurl ? editPrice.iconurl + '?' + wx.getStorageSync('iconurl') : null
      let price = ((editPrice.dctprice * editPrice.quantity) * 0.95).toFixed(2)
      that.setData({
        getOrder: editPrice,
        getOffer: editPrice.expectamount,
        orderContent: editPrice.content,
        userAddressBookId: editPrice.userAddressBookId,
        showBtn: '保存'
      })
    } else {
      let getOrder = JSON.parse(options.getOrder)
      getOrder.iconurl = getOrder.iconurl ? getOrder.iconurl + '?' + wx.getStorageSync('iconurl') : null
      let price = ((getOrder.dctprice * getOrder.quantity) * 0.95).toFixed(2)
      that.setData({
        options: options,
        getOrder: getOrder,
        placeholder1: `请输入您想要出售该商品的价格-建议出价:￥${price}`
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
    let that = this
    if (wx.getStorageSync('getMoneyOrder')) {
      that.setData({
        showSuccess: true
      })
    }
    let address = wx.getStorageSync('address')
    if (address) {
      address.length = 1
      that.setData({
        addressItems: address,
        name: address.receiverName,
        phoneNumber: address.mobileNumber,
        city: address.provinceName + address.cityName + address.districtName + address.detailedAddress,
        userAddressBookId: address.id
      })
    } else if (that.data.showBtn == '保存') {
      app.Util.ajax('mall/personal/addressInfo', 'GET').then((res) => { // 使用ajax函数
        if (res.data.content) {
          for (let i = 0; i < res.data.content.length;i++) {
            if (res.data.content[i].id == that.data.userAddressBookId) {
              that.setData({
                addressItems: res.data.content,
                name: res.data.content[i].receiverName,
                phoneNumber: res.data.content[i].mobileNumber,
                city:res.data.content[i].provinceName + res.data.content[i].cityName + res.data.content[i].districtName + res.data.content[i].detailedAddress,
                userAddressBookId: that.data.userAddressBookId,
              })
            }
          }
        }
      })
    } else {
      app.Util.ajax('mall/personal/addressInfo', 'GET').then((res) => { // 使用ajax函数
        if (res.data.content) {
          that.setData({
            addressItems: res.data.content,
            name: res.data.content.length > 0 ? res.data.content[0].receiverName : '',
            phoneNumber: res.data.content.length > 0 ? res.data.content[0].mobileNumber : '',
            city: res.data.content.length > 0 ? (res.data.content[0].provinceName + res.data.content[0].cityName + res.data.content[0].districtName + res.data.content[0].detailedAddress) : '',
            userAddressBookId: res.data.content.length > 0 ? res.data.content[0].id : '',
          })
        }
      })
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
    wx.removeStorageSync('getMoneyOrder')
    wx.removeStorageSync('goShowOrder')
    wx.removeStorageSync('iconurl')
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
  orderContent: function(e) {
    let that = this
    that.setData({
      orderContent: e.detail.value,
    })
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
  //出价
  getOffer(e) {
    let that = this;
    that.setData({
      getOffer: e.detail.value
    })
  },
  // 发布
  getMoneyPost(e) {
    let that = this;
    if(that.data.showBtn=='保存'){
      let data = {
        topicId: that.data.getOrder.id,
        expectAmount: that.data.getOffer,
        userAddressBookId: that.data.userAddressBookId,
        content: that.data.orderContent
      }
      if (that.data.getOffer == '') {
        wx.showToast({
          title: '出价不能为空',
          icon: 'none'
        })
      } else {
        app.Util.ajax('mall/forum/goodsPreSale/updateGoodsPreSaleEconomy', data, 'POST').then((res) => {
          if (res.data.messageCode == 'MSG_1001') {
            wx.navigateBack({})
            wx.removeStorageSync('iconurl')
          } else {
            wx.showToast({
              title: res.data.message,
              icon: 'none'
            })
          }
        })
      }
    }else{
      let data = {
        content: that.data.orderContent,
        type: 6,
        platformOrgAmount: that.data.getOrder.dctprice,
        expectAmount: that.data.getOffer,
        stockId: that.data.getOrder.stockid,
        goodsQuantity: that.data.getOrder.quantity,
        userAddressBookId: that.data.userAddressBookId
      }
      if (that.data.getOffer == '') {
        wx.showToast({
          title: '出价不能为空',
          icon: 'none'
        })
      } else {
        app.Util.ajax('mall/forum/topic/addGoodsPreSaleTopic', data, 'POST').then((res) => {
          if (res.data.messageCode == 'MSG_1001') {
            wx.navigateTo({
              url: `/pages/paymentorder/paymentorder?id=${res.data.content.id}&getMoneyOrder=${1}`,
            })
            wx.removeStorageSync('iconurl')
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
  cancelGetMoney(e) {
    let that = this
    let getOrder = JSON.parse(that.data.options.getOrder)
    if (getOrder.searchOrder == '2') {
      if (wx.getStorageSync('goShowOrder')) {
        if (getCurrentPages().length > 2) {
          //获取页面栈
          let pages = getCurrentPages()
          let curPage = pages[pages.length - 2];
          let data = curPage.data;
          curPage.setData({
            showOrder: false
          });
        }
        wx.navigateBack({})
      } else {
        wx.switchTab({
          url: '/pages/forum/forum',
        })
        app.globalData.type = 3
      }
    }
    that.setData({
      showSuccess: false
    })
    wx.removeStorageSync('getMoneyOrder')
    wx.removeStorageSync('goShowOrder')
  },
})