// pages/newMessage/newMessage.js
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    message:null,
    bgColor:'#f4f4f4',
    pageNumber: 1,
    pageSize: 20,
    hostUrl: app.Util.getUrlImg().hostUrl,
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
    that.setData({
      pageNumber:1
    })
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
    var that = this
    that.setData({
      pageNumber: 1
    })
    that.getData()
    wx.stopPullDownRefresh() //停止下拉刷新
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this
    that.getMore()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  getData:function(){
    var that = this
    app.Util.ajax('mall/forum/comment/findMyRemindMsgList', {
      pageNumber: that.data.pageNumber,
      pageSize: that.data.pageSize
    },'GET').then((res) => {
      if (res.data.messageCode == 'MSG_1001') {
        that.setData({
          message: res.data.content.items
        })
        if (that.data.message.length==0) {
          that.setData({
            text: '暂无数据'
          })
        }
      }
    })
  },
  getMore: function () {
    var that = this
    var pageNumber = that.data.pageNumber + 1
    app.Util.ajax('mall/forum/comment/findMyRemindMsgList', {
      pageNumber: pageNumber,
      pageSize: that.data.pageSize
    }, 'GET').then((res) => {
      if (res.data.messageCode == 'MSG_1001') {
        var message = res.data.content.items
        if (message == '' && that.data.message !== '') {
          that.setData({
            text: '没有了哟~'
          })
        }
        var arr = that.data.message
        for (var i = 0; i < res.data.content.items.length; i++) {
          arr.push(res.data.content.items[i])
        }
        that.setData({
          message: arr,
          pageNumber: pageNumber
        })
      }
    })
  },
  jumpComment: function (e) {
    console.log(e.currentTarget.dataset.userid)
    if (e.currentTarget.dataset.userid!==-1){
      wx.navigateTo({
        url: '/pages/forumDetail/forumDetail?tempStatus=' + 1 + '&id=' + e.currentTarget.dataset.topicid + '&userId=' + e.currentTarget.dataset.userid + '&nickname=' + e.currentTarget.dataset.nickname,
      })
    }else {
      wx.navigateTo({
        url: '/pages/forumDetail/forumDetail?id=' + e.currentTarget.dataset.topicid,
      })
    }    
  },
})