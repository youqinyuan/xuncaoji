// packageA/pages/helpSuccess/helpSuccess.js
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hostUrl: app.Util.getUrlImg().hostUrl,
    period:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    app.Util.ajax('mall/forum/MentionPeriod/queryMentionPeriod', {
      id: options.id
    }, 'GET').then((res) => { // 使用ajax函数
      if (res.data.content) {
        that.setData({
          period : res.data.content.mentionPeriod
        })
      }
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
    if(wx.getStorageSync("mentionPeriodFrom")){
      app.globalData.type = 5
      wx.switchTab({
        url: '/pages/forum/forum',
      })
    }else{
      wx.navigateBack({
        delta: 3
      })
    }
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
  toHelpOther:function(){
    app.globalData.type = 5
    wx.switchTab({
      url: '/pages/forum/forum',
    })
  },
  toReturn:function(){
    wx.navigateTo({
      url: `/pages/waitReentryDetail/waitReentryDetail`,
    })
  }
})