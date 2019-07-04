// pages/merchantEntry2/merchantEntry2.js
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    storeName:'',//店铺名称
    rebate:'',//折扣
    phoneNumber: '',//电话号码
    codeNumber: '',//验证码
    city:'',//所在位置
    getcode: '获取验证码',
    color: '#3C8AFF',
    currentTime: 60,
    disabled: false
  },
  //获取input的值(手机号码)
  bindInput: function (e) {
    var that = this;
    var value = e.detail.value
    that.setData({
      phoneNumber: value
    })
  },
  //获取input的值(验证码)
  bindCode: function (e) {
    var that = this;
    var value1 = e.detail.value
    that.setData({
      codeNumber: value1
    })
  },
  //获取验证码
  getCode: function () {
    var that = this
    var phoneNumber = String(that.data.phoneNumber)
    var currentTime = that.data.currentTime
    if (!(/^1[3456789]\d{9}$/.test(phoneNumber))) {
      wx.showToast({
        title: '请输入正确的电话号码',
        icon:'none'
      })
      return false;
    }
    if (phoneNumber !== '') {
      let interval = setInterval(function () {
        currentTime--;
        that.setData({
          getcode: currentTime + 's再次获取',
          color: '#AAAAAA',
          disabled: true
        })
        if (currentTime <= 0) {
          clearInterval(interval)
          that.setData({
            getcode: '重新发送',
            currentTime: 60,
            disabled: false
          })
        }
      }, 1000)
      app.Util.ajax('mall/captcha/send', {
        mobileNumber: phoneNumber,
        business: 1
      }, 'POST').then((res) => { // 使用ajax函数
        if (res.messageCode = 'MSG_1001') {
          wx.showToast({
            title: '获取验证码成功',
            icon: 'none'
          })
        }
      })
    } else {
      wx.showToast({
        title: '请输入正确的电话号码',
        icon: 'none'
      })
    }
  },
  //获取店铺名称
  getStoreName:function(e){
    var that = this
    var storeName = e.detail.value
    that.setData({
      storeName: storeName
    })
  },
  //店铺位置
  shopAddress:function(){
    wx.navigateTo({
      url: '/pages/shopAddress/shopAddress',
    })
  },
  //平均折扣
  averageDiscount:function(){
    wx.navigateTo({
      url: '/pages/averageDiscount/averageDiscount',
    })
  },
  //营业执照
  nextStep:function(){
    var that = this
    var mobile = that.data.phoneNumber
    var code = that.data.codeNumber
    var infoList = wx.getStorageSync('info')
    infoList.mobile = mobile
    infoList.code = code
    wx.setStorageSync('info', infoList)
    if (that.data.storeName !== '' && that.data.rebate !== '' && that.data.phoneNumber !== '' && that.data.codeNumber !== '' && that.data.city !== ''){
      wx.navigateTo({
        url: '/pages/merchantEntry3/merchantEntry3',
      })
    }else{
      wx.showToast({
        title: '输入框不能为空',
        icon:'none'
      })
    }
   
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    wx.removeStorageSync('rebate')
    wx.removeStorageSync('city')
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this
    that.setData({
      rebate: wx.getStorageSync('rebate') || '',
      city: wx.getStorageSync('city') || ''
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})