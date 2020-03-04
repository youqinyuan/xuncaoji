// pages/goodsStage3/goodsStage3.js
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    objStatus:null,
    hostUrl: app.Util.getUrlImg().hostUrl,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    var objStatus = JSON.parse(options.objStatus) 
    that.setData({
      objStatus: objStatus
    })
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
    var detailPage = wx.getStorageSync('detailPage')
    var detailBack = wx.getStorageSync('detailBack')
    if (detailBack == 2){
      wx.navigateBack({
        delta: 4,
      })
    } else if (detailPage == 1) {
      wx.navigateBack({
        delta: 3,
      })
    } 
    wx.removeStorageSync('detailPage')
    wx.removeStorageSync('detailBack')
    wx.removeStorageSync('installment')
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

  },
  getGoodsMsg:function(){
    wx.navigateTo({
      url: '/pages/goodsStage/goodsStage',
    })
    wx.setStorageSync('detailBack', 2)
  }
})