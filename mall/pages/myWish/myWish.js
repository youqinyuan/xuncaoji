// pages/myWish/myWish.js
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showDialog: false, //删除弹框
    wishpool: [],
    wishId: null,
    bgColor: '#f4f4f4',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    that.queryWish()
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
    if (wx.getStorageSync('messages')) {
      wx.showToast({
        title: wx.getStorageSync('messages'),
        icon: 'none'
      })
    }
    setTimeout(function() {
      that.queryWish()
      wx.removeStorageSync('messages')
    }, 1000)
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
    if (wx.getStorageSync('jumpStatus')) {


    } else {
      wx.switchTab({
        url: '/pages/wishpool/wishpool'
      })
    }
    wx.removeStorageSync('jumpStatus')
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    var that = this
    that.queryWish()
    setTimeout(function() {
      wx.stopPullDownRefresh() //停止下拉刷新
    }, 1000)
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
  queryWish: function() {
    var that = this
    app.Util.ajax('mall/wishZone/wishes', 'GET').then((res) => { // 使用ajax函数
      if (res.data.messageCode == "MSG_1001") {
        if (res.data.content.length > 0) {
          that.setData({
            bgColor: '#f4f4f4',
            wishpool: res.data.content
          })
        } else {
          that.setData({
            bgColor: '#fff',
            wishpool: res.data.content
          })
        }
      }
    })
  },
  //已满足商品跳转到详情页
  getDetail: function(e) {
    var that = this
    wx.navigateTo({
      url: `/pages/detail/detail?id=${e.currentTarget.dataset.id}`,
    })

  },
  //客服分享图片回到指定的小程序页面
  handleContact: function(e) {
    var path = e.detail.path,
      query = e.detail.query,
      params = '';
    if (path) {
      for (var key in query) {
        params = key + '=' + query[key] + '&';
      }
      params = params.slice(0, params.length - 1);
      wx.navigateTo({
        url: path + '?' + params
      })
    }
  },
  comfirm: function(e) {
    var that = this
    app.Util.ajax('mall/wishZone/wish?wishId=' + that.data.wishId, null, 'DELETE').then((res) => { // 使用ajax函数
      if (res.data.messageCode == "MSG_1001") {
        that.setData({
          showDialog: false
        })
        that.queryWish();
      } else {
        that.setData({
          showDialog: false
        })
        wx.showToast({
          title: res.data.message,
          icon: 'none',
          duration: 1000
        })
      }
    })

  },
  reject: function(e) {
    var that = this
    that.setData({
      showDialog: false
    })
  },
  //长按删除
  deleteList: function(e) {
    var that = this
    that.setData({
      showDialog: true,
      wishId: e.currentTarget.dataset.id
    })
  },
  //跳转到留下心愿页面
  leaveWish: function() {
    wx.navigateTo({
      url: '/pages/leaveWish/leaveWish',
    })
    wx.setStorageSync('jumpStatus', 1)
  },
})