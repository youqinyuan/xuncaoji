// pages/byStages/byStages.js
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    recommend: [],
    pageNumber: 1,
    pageSize: 20,
    hostUrl: app.Util.getUrlImg().hostUrl,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    that.init()
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
    var that = this
    that.getMore()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  //爆品推荐
  init: function() {
    var that = this
    var pageNumber = that.data.pageNumber
    app.Util.ajax('mall/installment/goods', {
      pageNumber: pageNumber,
      pageSize: that.data.pageSize
    }, 'GET').then((res) => { // 使用ajax函数
      if (res.data.messageCode == 'MSG_1001') {
        that.setData({
          imageUrl: res.data.content.imageUrl ? res.data.content.imageUrl :app.Util.getUrlImg().hostUrl+'/add/fenBuy.png',
          recommend: res.data.content.goods
        })
      }
    })
  },
  //加载更多
  getMore: function() {
    var that = this
    var pageNumber = that.data.pageNumber + 1
    //品质优选
    app.Util.ajax('mall/installment/goods', {
      pageNumber: pageNumber,
      pageSize: that.data.pageSize
    }, 'GET').then((res) => { // 使用ajax函数
      if (res.data.messageCode == 'MSG_1001') {
        if (res.data.content.goods == '' && that.data.recommend !== '') {
          wx.showToast({
            title: '已经到底啦',
            icon: 'none'
          })
        }
        var arr = that.data.recommend
        res.data.content.goods.forEach((v, i) => {
          arr.push(res.data.content.goods[i])
        })
        that.setData({
          recommend: arr,
          pageNumber: pageNumber
        })
      }
    })
  },
  //跳转到详情页
  toDetail: function(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/detail/detail?id=' + id + '&stages=' + 1,
    })
  },
})