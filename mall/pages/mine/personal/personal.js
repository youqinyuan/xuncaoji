// pages/mine/personal/personal.js
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showDialog: false,
    datePickerValue: ['', '', ''],
    datePickerIsShow: false,
    sexPickerIsShow: false,
    isUpHeader: false,
    adds: {},
    text: ['男', '女']
  },
  getNickname: function(e) {
    var that = this
    that.data.adds.nickname = e.detail.value
    that.setData({
      adds: that.data.adds
    })
  },
  getCareer: function(e) {
    var that = this
    that.data.adds.career = e.detail.value
    that.setData({
      adds: that.data.adds
    })
  },
  getLocation: function(e) {
    var that = this
    that.data.adds.location = e.detail.value
    that.setData({
      adds: that.data.adds
    })
  },
  getHometown: function(e) {
    var that = this
    that.data.adds.hometown = e.detail.value
    that.setData({
      adds: that.data.adds
    })
  },
  //获取性别
  toggleDialog: function() {
    var that = this
    that.setData({
      showDialog: !this.data.showDialog
    });
  },
  sexOnChange: function(e) {
    var that = this
    if (e.currentTarget.dataset.text === '男') {
      that.data.adds.gender = 1
      that.setData({
        adds: that.data.adds
      })
    } else {
      that.data.adds.gender = 2
      that.setData({
        adds: that.data.adds
      })
    }
  },
  //获取日期
  showDatePicker: function(e) {
    var that = this
    that.setData({
      datePickerIsShow: true,
    });
  },
  datePickerOnSureClick: function(e) {
    var that = this
    that.data.adds.birthday = `${e.detail.value[0]}-${e.detail.value[1]}-${e.detail.value[2]}`
    that.setData({
      adds: that.data.adds,
      datePickerIsShow: false,
    });
  },
  datePickerOnCancelClick: function(event) {
    var that = this
    that.setData({
      datePickerIsShow: false,
    });
  },

  //表单提交（保存资料）
  formSubmit: function(e) {
    var that = this
    var adds = e.detail.value;
    if (that.data.isUpHeader === true) {
      if (adds.gender === '女') {
        adds.gender = 2
      } else {
        adds.gender = 1
      }
      that.data.adds = adds
      that.upload()
    } else {
      if (adds.gender === '女') {
        adds.gender = 2
      } else {
        adds.gender = 1
      }
      that.data.adds = adds
      that.upload1()
    }

  },
  upimg: function() {
    var that = this
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      success: function(res) {
        const tempFilePaths = res.tempFilePaths[0]
        that.data.adds.avatarKey = tempFilePaths
        wx.setStorageSync('avatarKey', that.data.adds.avatarKey)
        that.setData({
          avatarKey: that.data.adds.avatarKey,
          adds: that.data.adds,
          isUpHeader: true
        })
      }
    })
  },
  //上传文件
  upload: function() {
    var that = this
    var adds = that.data.adds
    var userInfo = {}
    for (var item in adds) {
      if (adds[item] != '') {
        userInfo[item] = adds[item]
      }
    }
    var token = wx.getStorageSync('token')
    wx.uploadFile({
      // url: 'https://xuncaoji.yzsaas.cn/mall/personal/modifyBaseData', //测试环境
      url: 'https://xuncj.yzsaas.cn/mall/personal/modifyBaseData', //正式环境
      filePath: that.data.avatarKey,
      name: 'avatarKey',
      formData: userInfo,
      header: {
        'token': token,
        "content-type": "multipart/form-data"
      },
      success: function(res) {
        var res = JSON.parse(res.data)
        console.log(res)
        if (res.content) {
          that.baseMessage()
          wx.showToast({
            title: '资料更新成功',
            icon: 'none',
            duration: 1500
          })
          setTimeout(function() {
            wx.switchTab({
              url: '/pages/mine/mine'
            })
          }, 500)
        } else {
          wx.showToast({
            title: '资料更新失败',
            icon: 'none',
            duration: 1500
          })
        }
      },
      fail: function(res) {
        wx.showToast({
          title: '资料更新失败',
          icon: 'none',
          duration: 1500
        })
      }
    })
  },
  //不传头像的方法
  upload1: function() {
    var that = this
    var adds = that.data.adds
    var userInfo = {}
    for (var item in adds) {
      if (adds[item] != '') {
        userInfo[item] = adds[item]
      }
    }
    var token = wx.getStorageSync('token')
    wx.request({
      // url: 'https://xuncaoji.yzsaas.cn/mall/personal/modifyBaseData', //测试环境
      url: 'https://xuncj.yzsaas.cn/mall/personal/modifyBaseData', //正式环境
      method: "POST",
      data: userInfo,
      header: {
        "token": token,
        "content-type": "application/x-www-form-urlencoded"
      },
      success(res) {
        console.log(res.data)
        if (res.data.content) {
          that.baseMessage()
          wx.showToast({
            title: '资料更新成功',
            icon: 'none'
          })
          setTimeout(function() {
            wx.switchTab({
              url: '/pages/mine/mine'
            })
          }, 500)
        } else {
          wx.showToast({
            title: '资料更新失败',
            icon: 'none'
          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this
    that.setData({
      isUpHeader: false
    })
    that.baseMessage()
  },
  baseMessage: function() {
    let that = this
    app.Util.ajax('mall/personal/queryBaseData', null, 'POST').then((res) => { // 使用ajax函数
      if (res.messageCode = 'MSG_1001') {
        that.setData({
          adds: res.data.content
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