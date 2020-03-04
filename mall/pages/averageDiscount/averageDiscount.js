// pages/averageDiscount/averageDiscount.js
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    rebate:'',
    hostUrl: app.Util.getUrlImg().hostUrl,
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

  },
  //获取折扣
  getRebate:function(e){
    var that = this
    var rebate = e.detail.value
    that.setData({
      rebate: rebate
    })
    wx.setStorageSync('rebate', Number(that.data.rebate))
  },
  comfirm: function () {
    var that = this
    var rebate = Number(that.data.rebate)
    var infoList = wx.getStorageSync('info')
    infoList.rebate = rebate
    wx.setStorageSync('info', infoList)
    wx.showToast({
      title: '保存成功',
      icon: 'none'
    })
  },
})