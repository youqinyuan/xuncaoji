// pages/forgetpassword/forgetpassword.js
var interval = null //倒计时函数
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phoneNum:'',
    codeNum:'',
    password:'',
    password1:'',
    getcode: '获取验证码',
    color: '#3C8AFF',
    currentTime: 60,
    disabled: false
  },
    //获取输入框的值
  bindPhone:function(e){
    var that = this;
    var phoneNumber
    if (e.detail.value.toString().length > 11) {
      phoneNumber = e.detail.value.substring(0, e.detail.value.length - 1);
    } else {
      phoneNumber = e.detail.value
    }
    that.setData({
      phoneNum: phoneNumber
    })
  },
  bindCode: function (e) {
    var that = this;
    var codeNumber
    if (e.detail.value.toString().length > 6) {
      codeNumber = e.detail.value.substring(0, e.detail.value.length - 1);
    } else {
      codeNumber = e.detail.value
    }
    that.setData({
      codeNum: codeNumber
    })
  },
  bindPassword: function (e) {
    var that = this;
    var passwordNumber
    if (e.detail.value.toString().length > 6) {
      passwordNumber = e.detail.value.substring(0, e.detail.value.length - 1);
    } else {
      passwordNumber = e.detail.value
    }
    that.setData({
      password: passwordNumber
    })
  },
  bindPassword1: function (e) {
    var that = this;
    var passwordNumber1
    if (e.detail.value.toString().length > 6) {
      passwordNumber1 = e.detail.value.substring(0, e.detail.value.length - 1);
    } else {
      passwordNumber1 = e.detail.value
    }
    that.setData({
      password1: passwordNumber1
    })
  },
  //获取验证码
  getCode:function(){
    var that = this
    var phoneNumber = String(that.data.phoneNum)
    var currentTime = that.data.currentTime
    if (!(/^1[3456789]\d{9}$/.test(phoneNumber))) {
      wx.showToast({
        title: '请输入正确的手机号码',
        icon:'none'
      })
      return false;
    }
    if (phoneNumber !== '') {
      interval = setInterval(function () {
        currentTime--;
        that.setData({
          getcode: currentTime + 's再次获取',
          disabled: true,
          color:'#AAAAAA'
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
        business: 2
      }, 'POST').then((res) => {  // 使用ajax函数
        if (res.messageCode === 'MSG_1001') {
          console.log(res)
        }
      })  
    }
  },
  //保存密码
  submit:function(){
    var that = this
    if (!(/^[0-9]{6}$/.test(that.data.phoneNum))) {
      wx.showToast({
        title: '请输入正确的手机号码',
        icon:'none'
      })
    }else if (!(/^[0-9]{6}$/.test(that.data.codeNum))) {
      wx.showToast({
        title: '验证码输入错误',
        icon: 'none'
      })
    }else if (that.data.password !== that.data.password1) {
      wx.showToast({
        title: '2次密码输入不一致请重试',
        icon: 'none'
      })
    }else if (that.data.phoneNum !== '' && that.data.codeNum !== '' && that.data.password !== '' && that.data.password1 !==''){
      app.Util.ajax('mall/account/paymentPassword/reset', {
        mobileNumber: that.data.phoneNum,
        captcha: that.data.codeNum,
        newPassword: that.data.password,
        retypedNewPassword: that.data.password1
      }, 'POST').then((res) => {  // 使用ajax函数
        if (res.data.message === '处理成功') {
          wx.switchTab({
            url: '/pages/mine/mine',
          })  
        }else{
          wx.showToast({
            title: res.data.message,
            icon: 'none'
          })
        }
      })  
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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