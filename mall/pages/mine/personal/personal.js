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
    text:['男','女']
  },
  toggleDialog: function() {
    this.setData({
      showDialog: !this.data.showDialog
    });
  },
  //获取性别
  sexOnChange: function(e) {
    if (e.currentTarget.dataset.text === '男') {
      this.data.adds.gender = 1
      this.setData({
        adds: this.data.adds
      })
    } else {
      this.data.adds.gender = 2
      this.setData({
        adds: this.data.adds
      })
    }
  },
  //获取日期
  showDatePicker: function(e) {
    this.setData({
      datePickerIsShow: true,
    });
  },
  datePickerOnSureClick: function(e) {
    this.data.adds.birthday = `${e.detail.value[0]}-${e.detail.value[1]}-${e.detail.value[2]}`
    this.setData({
      adds: this.data.adds,
      datePickerIsShow: false,
    });
  },
  datePickerOnCancelClick: function(event) {
    this.setData({
      datePickerIsShow: false,
    });
  },

  //表单提交（保存资料）
  formSubmit: function(e) {
    var that = this
    var adds = e.detail.value;
    if (that.data.isUpHeader === true) {
      console.log(1)
      if (adds.gender === '女') {
        adds.gender = 2
      } else {
        adds.gender = 1
      }
      that.data.adds = adds
      that.upload()
    } else {
      console.log(2)
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
    var token = wx.getStorageSync('token')
    wx.uploadFile({
      // url: 'https://xuncaoji.yzsaas.cn/mall/personal/modifyBaseData',//测试环境
      url: 'https://xuncj.yzsaas.cn/mall/personal/modifyBaseData',//正式环境
      filePath: that.data.avatarKey,
      name: 'avatarKey',
      formData: that.data.adds,
      header: {
        'token': token,
        'content-type': 'multipart/form-data'
      },
      success: function(res) {
        var res = JSON.parse(res.data)
        if (res.content) {
          that.baseMessage()
          wx.showToast({
            title: '资料更新成功',
            icon: 'none'
          })
        }
      },
      fail: function(res) {
        wx.showToast({
          title: '资料更新失败',
          icon: 'none'
        })
      }
    })
  },
  //不传头像的方法
  upload1: function() {
    var that = this
    var userInfo = that.data.adds
    app.Util.ajax('mall/personal/modifyBaseData', userInfo, 'POST').then((res) => {
      if (res.data.content) {
        that.baseMessage()
        wx.showToast({
          title: '资料更新成功', 
          icon: 'none'
        })
      } else {
        wx.showToast({
          title: '资料更新失败',
          icon: 'none'
        })
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
        console.log(res)
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