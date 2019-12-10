// pages/newMessage/newMessage.js
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    message:null,
    bgColor:'#f4f4f4'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.getData();
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
    that.getData();
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
  getData:function(){
    var that = this
    app.Util.ajax('mall/forum/comment/findMyRemindMsgList', 'GET').then((res) => {
      if (res.data.messageCode == 'MSG_1001') {
        that.setData({
          message: res.data.content.items
        })
      }
    })
  },
  jumpComment: function (e) {
    wx.navigateTo({
      url: '/pages/forumDetail/forumDetail?tempStatus=' + 1 + '&id=' + e.currentTarget.dataset.id + '&userId=' + e.currentTarget.dataset.userid + '&nickname=' + e.currentTarget.dataset.nickname,
    })
  },
})