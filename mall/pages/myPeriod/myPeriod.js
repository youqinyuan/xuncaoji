// pages/myPeriod/myPeriod.js
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hostUrl: app.Util.getUrlImg().hostUrl,
    recommend: {},
    pageNumber: 1,
    pageSize: 20,
    textData:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.init()
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
    var that = this
    that.setData({
      pageNumber:1
    })
    that.init()
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
  //爆品推荐
  init: function () {
    var that = this
    var pageNumber = that.data.pageNumber
    app.Util.ajax('mall/installment/mine', {
      pageNumber: pageNumber,
      pageSize: that.data.pageSize
    }, 'GET').then((res) => { // 使用ajax函数
      if (res.data.messageCode == 'MSG_1001') {
        that.setData({
          recommend: res.data.content
        })
        if (that.data.recommend.length===0){
          that.setData({
            textData:'暂无数据'
          })
        }
      }
    })
  },
  //加载更多
  getMore: function () {
    var that = this
    var pageNumber = that.data.pageNumber + 1
    //品质优选
    app.Util.ajax('mall/installment/mine', {
      pageNumber: pageNumber,
      pageSize: that.data.pageSize
    }, 'GET').then((res) => { // 使用ajax函数
      if (res.data.messageCode == 'MSG_1001') {
        if (res.data.content == '' && that.data.recommend !== '') {
          wx.showToast({
            title: '已经到底啦',
            icon: 'none'
          })
        }
        var arr = that.data.recommend
        res.data.content.forEach((v, i) => {
          arr.push(res.data.content[i])
        })
        that.setData({
          recommend: arr,
          pageNumber: pageNumber
        })
      }
    })
  },
  getGoodsMsg: function (e) {
    wx.navigateTo({
      url: '/pages/goodsStage/goodsStage',
    })
    var installment = e.currentTarget.dataset.installment
    console.log(installment)
    wx.setStorageSync('installment', installment)
    wx.setStorageSync('detailPage', 1)
  }
})