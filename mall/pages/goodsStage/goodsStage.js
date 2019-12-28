// pages/goodsStage/goodsStage.js
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    effTime:{},
    installment: null,
    goodsMessage: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    var installment = wx.getStorageSync('installment')
    if (installment) {
      that.setData({
        installment: installment
      })
      that.init()
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
    var that = this
    that.setData({
      effTime: wx.getStorageSync('time')
    })
    if (wx.getStorageSync('time')) {
      var goodsMessage = wx.getStorageSync('goodsMessage')
      var startTime = new Date(wx.getStorageSync('time').startTime.replace(/-/g, "/")).getTime()
      var endTime = new Date(wx.getStorageSync('time').endTime.replace(/-/g, "/")).getTime()
      goodsMessage.validBeginTime = startTime
      goodsMessage.validEndTime = endTime
      that.setData({
        goodsMessage: goodsMessage
      })
      wx.setStorageSync('goodsMessage', goodsMessage)
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
    wx.removeStorageSync('goodsMessage')
    wx.removeStorageSync('time')
    wx.removeStorageSync('installment')
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
  init: function() {
    var that = this
    app.Util.ajax('mall/installment/status', {}, 'GET').then((res) => {
      if (res.data.content) {
        res.data.content.annualizedRate = that.data.installment.annualizedRate
        res.data.content.goodsId = that.data.installment.goodsId
        res.data.content.stockId = that.data.installment.stockId
        res.data.content.status = that.data.installment.status
        res.data.content.periods = that.data.installment.periods
        res.data.content.monthlyPayment = that.data.installment.monthlyPayment
        res.data.content.monthlyInterest = that.data.installment.monthlyInterest
        res.data.content.type = 1
        res.data.content.id = that.data.installment.status == 0 ? null : that.data.installment.id
        that.setData({
          goodsMessage: res.data.content
        })
        wx.setStorageSync('goodsMessage', res.data.content)
      }
    })   
  },
  //获取姓名
  getRealName: function(e) {
    var goodsMessage = wx.getStorageSync('goodsMessage')
    goodsMessage.realName = e.detail.value
    wx.setStorageSync('goodsMessage', goodsMessage)
  },
  getIdCard: function(e) {
    var goodsMessage = wx.getStorageSync('goodsMessage')
    goodsMessage.idCard = e.detail.value
    wx.setStorageSync('goodsMessage', goodsMessage)
  },
  getAuthority: function(e) {
    var goodsMessage = wx.getStorageSync('goodsMessage')
    goodsMessage.issuingAuthority = e.detail.value
    wx.setStorageSync('goodsMessage', goodsMessage)
  },
  effectiveTime: function() {
    wx.navigateTo({
      url: '/pages/effectiveTime/effectiveTime',
    })
  },
  nexStep: function() {
    var goodsMessage = wx.getStorageSync('goodsMessage')
    if (!(/^[\u4e00-\u9fa5a-z]+$/gi).test(goodsMessage.realName)) {
      wx.showToast({
        title: '请输入您的真实姓名',
        icon: 'none'
      })
    } else if (!(/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/).test(goodsMessage.idCard)) {
      wx.showToast({
        title: '请输入正确的身份证号码',
        icon: 'none'
      })
    } else if (!goodsMessage.issuingAuthority) {
      wx.showToast({
        title: '请输入签证机关',
        icon: 'none'
      })
    } else if (!goodsMessage.validBeginTime && !goodsMessage.validEndTime) {
      wx.showToast({
        title: '有效期限不能为空',
        icon: 'none'
      })
    } else if (goodsMessage.realName && goodsMessage.idCard && goodsMessage.validBeginTime && goodsMessage.validEndTime) {
      app.Util.ajax('mall/installment/checkPersonalInfo', goodsMessage, 'POST').then((res) => {
        if (res.data.messageCode== 'MSG_1001') {
          wx.navigateTo({
            url: '/pages/goodsStage1/goodsStage1',
          })
        }else{
          wx.showToast({
            title: res.data.message,
            icon: 'none'
          })
        }
      })     
    } else {
      wx.showToast({
        title: '请完整填写内容',
        icon: 'none'
      })
    }
  },
})