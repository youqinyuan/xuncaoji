// packageA/pages/guidePage/guidePage.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageNumber:1,
    pageSize:10
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.init()
  },
  init:function(){
    let that = this
    app.Util.ajax('mall/guide/queryContent', null, 'GET').then((res) => {
      if(res.data.messageCode == "MSG_1001"){
        that.setData({
          html: res.data.content
        })
        app.Util.ajax('mall/guide/recommendedGoods', {
          pageNumber: 1,
          pageSize: 10,
        }, 'GET').then((res) => {
          if(res.data.messageCode == "MSG_1001"){
            that.setData({
              list: res.data.content.items
            })
          }
        })
      }
    })
  },
  getMore: function() {
    var that = this
    var pageNumber = that.data.pageNumber + 1
    app.Util.ajax('mall/guide/recommendedGoods', {
      pageNumber: pageNumber,
      pageSize: that.data.pageSize
    }, 'GET').then((res) => { // 使用ajax函数
      if (res.data.content) {
        if (res.data.content.items == '' && that.data.list !== '') {
          that.setData({
            bottom_tishi:'已到底，去【寻商品】提交吧'
          })
        }
        var arr = that.data.list
        for (var i = 0; i < res.data.content.items.length; i++) {
          arr.push(res.data.content.items[i])
        }
        that.setData({
          list: arr,
          pageNumber: pageNumber
        })
      }
    })
  },
  toDetail: function(e) {
    wx.navigateTo({
      url: '/pages/detail/detail?id=' + e.currentTarget.dataset.id
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
    this.getMore()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})