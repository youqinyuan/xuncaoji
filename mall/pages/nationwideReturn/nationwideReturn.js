// pages/nationwideReturn/nationwideReturn.js
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    msgList: [],//轮播图
    totalAmount:0,//累计返现
    pageNumber: 1,
    pageSize: 6,
    wholeNation:[],//列表
    text: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    that.init()
    
  },
  //全民返
  init:function(){
    var that = this
    app.Util.ajax('mall/home/cashBack', {
      statistic: 1,
      pageNumber: that.data.pageNumber,
      pageSize: that.data.pageSize
    }, 'GET').then((res) => { // 使用ajax函数
      if (res.messageCode = 'MSG_1001') {
        that.setData({
          wholeNation: res.data.content.items,
          totalAmount: res.data.content.totalAmount,
          msgList: res.data.content.userCashBackItems
        })
      }
    })
  },
  getMore: function () {
    var that = this
    var pageNumber = that.data.pageNumber + 1
    //品质优选
    app.Util.ajax('mall/home/cashBack', {
      pageNumber: pageNumber,
      pageSize: that.data.pageSize,
      statistic: 1
    }, 'GET').then((res) => { // 使用ajax函数
      if (res.messageCode = 'MSG_1001') {
        if (res.data.content.items == '' && that.data.wholeNation !== '') {
          that.setData({
            text: '已经到底啦'
          })
        }
        var arr = that.data.wholeNation
        for (var i = 0; i < res.data.content.items.length; i++) {
          arr.push(res.data.content.items[i])
        }
        that.setData({
          wholeNation: arr,
        })
        that.setData({
          pageNumber: pageNumber
        })
      }
    })
  },
  //跳转到详情页
  toDetail: function (e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/detail/detail?id=${id}`,
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
    var that = this
    that.getMore()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})