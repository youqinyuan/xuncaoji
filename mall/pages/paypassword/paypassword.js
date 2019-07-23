// pages/paypassword/paypassword.js
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showModal: false,
    showDialog: false,
    password: '', //初始密码
    password1: '',
    oldPassword: '', //旧密码
    newPassword: '', //新密码
    newPassword1: '', //
    content: '',
    text: '',
    text1: ''
  },
  //设置（修改）密码的模态框
  setPassword: function() {
    var that = this;
    if (that.data.content === 1) {
      that.setData({
        showDialog: true
      })
    } else if(that.data.content === 2){
      that.setData({
        showModal: true
      })
    }

  },
  hideModal: function() {
    var that = this;
    that.setData({
      showModal: false,
      password: '',
      password1: ''
    })
  },
  hide: function () {
    var that = this;
    that.setData({
      showDialog: false,
      oldPassword: '',
      newPassword: '',
      newPassword1: ''
    })
  },
  //设置密码的值
  btnInput: function(e) {
    var that = this;
    var passwordNumber
    //限制输入6位数字
    if (e.detail.value.toString().length > 6) {
      passwordNumber = e.detail.value.substring(0, e.detail.value.length - 1);
    } else {
      passwordNumber = e.detail.value
    }
    that.setData({
      password: passwordNumber
    })

  },
  btnInput1: function(e) {
    var that = this;
    var passwordNumber1
    //限制输入6位数字
    if (e.detail.value.toString().length > 6) {
      passwordNumber1 = e.detail.value.substring(0, e.detail.value.length - 1);
    } else {
      passwordNumber1 = e.detail.value
    }
    that.setData({
      password1: passwordNumber1
    })
  },
  //设置密码
  confirmSet: function() {
    var that = this;
    var token = wx.getStorageSync('token')
    if (!(/^[0-9]{6}$/.test(that.data.password))) {
      that.setData({
        text: '请检查密码输入框是否正确'
      })
    }
    if (that.data.password == '' || that.data.password1=='') {
      that.setData({
        text: '请检查密码输入框是否正确'
      })
    }else if (that.data.password !== '' && that.data.password1 !==''){
      if (that.data.password !== that.data.password1) {
      that.setData({
        text: '2次密码输入不一致请重试'
      })
      } else{
        app.Util.ajax('mall/account/paymentPassword', {
          mode: 1,
          newPassword: that.data.password,
          retypedNewPassword: that.data.password1
        }, 'POST').then((res) => { // 使用ajax函数
          if (res.data.messageCode === 'MSG_1001') {
            app.Util.ajax('mall/account/paymentPassword/status', 'GET').then((res) => { // 使用ajax函数
              if (res.data.messageCode === 'MSG_1001') {
                that.setData({
                  content: res.data.content
                })
              }
            })
            wx.showToast({
              title: '密码设置成功',
              icon: 'none'
            })
            that.setData({
              showModal: false,
              password: '',
              password1: ''
            })
            
          } else {
            // wx.showToast({
            //   title: res.data.message,
            //   icon: 'none'
            // })
          }
        })
      }
    }
  },
  //修改密码的值
  btnOldPassword: function(e) {
    var that = this;
    var oldPasswordNumber
    //限制输入6位数字
    if (e.detail.value.toString().length > 6) {
      oldPasswordNumber = e.detail.value.substring(0, e.detail.value.length - 1);
    } else {
      oldPasswordNumber = e.detail.value
    }
    that.setData({
      oldPassword: oldPasswordNumber
    })
  },
  btnNewPassword: function(e) {
    var that = this;
    var newPasswordNumber
    //限制输入6位数字
    if (e.detail.value.toString().length > 6) {
      newPasswordNumber = e.detail.value.substring(0, e.detail.value.length - 1);
    } else {
      newPasswordNumber = e.detail.value
    }
    that.setData({
      newPassword: newPasswordNumber
    })
  },
  btnNewPassword1: function(e) {
    var that = this;
    var newPasswordNumber1
    //限制输入6位数字
    if (e.detail.value.toString().length > 6) {
      newPasswordNumber1 = e.detail.value.substring(0, e.detail.value.length - 1);
    } else {
      newPasswordNumber1 = e.detail.value
    }
    that.setData({
      newPassword1: newPasswordNumber1
    })
  },
  //修改密码
  confirmChange: function() {
    var that = this;
    var token = wx.getStorageSync('token')
    if (!(/^[0-9]{6}$/.test(that.data.newPassword))) {
      that.setData({
        text1: '请检查密码输入框是否正确'
      })
    }
    if (that.data.oldPassword == '' && that.data.newPassword == '' && that.data.newPassword1 == ''){
      that.setData({
        text1: '请检查密码输入框是否正确'
      })
    }else if (that.data.oldPassword !== '' && that.data.newPassword !== '' && that.data.newPassword1 !== '') {
      if (that.data.newPassword !== that.data.newPassword1) {
        that.setData({
          text1: '2次密码输入不一致请重试'
        })
      }else{
        app.Util.ajax('mall/account/paymentPassword', {
          mode: 2,
          oldPassword: that.data.oldPassword,
          newPassword: that.data.newPassword,
          retypedNewPassword: that.data.newPassword1
        }, 'POST').then((res) => { // 使用ajax函数
          if (res.data.messageCode === 'MSG_1001') {
            that.setData({
              showDialog: false,
              oldPassword: '',
              newPassword: '',
              newPassword1: '',
              text1: ''
            })
            wx.showToast({
              title: '密码修改成功',
              icon:'none'
            })
            console.log(that.data.content)
          } else {
            if (res.data.messageCode ==='MSG_4001')
            that.setData({
              text1:res.data.message
            })
          }
        })
      }
      
    }
  },
  //跳转到忘记密码页面
  toForgetPassword: function() {
    wx.navigateTo({
      url: '/pages/forgetpassword/forgetpassword',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    var token = wx.getStorageSync('token')
    app.Util.ajax('mall/account/paymentPassword/status', 'GET').then((res) => { // 使用ajax函数
      if (res.data.messageCode === 'MSG_1001') {
        console.log(res)
        that.setData({
          content: res.data.content
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
    // wx.reLaunch({
    //   url: '/pages/mine/mine',
    // })
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