// pages/search/goods/goods.js
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsResult: [],
    keyword:'',
    pageNumber:1,
    pageSize:6,
    text:'',
    hostUrl: app.Util.getUrlImg().hostUrl,
  },
  //跳转到详情页
  toDetail(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/detail/detail?id=${id}`,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      keyword: options.keyword
    })
    that.init()  
  },
  init:function(){
    var that = this;
    var keyword = that.data.keyword
    app.Util.ajax('mall/home/_search', {
      keyword: keyword,
      scope: 1,
      pageNumber: that.data.pageNumber,
      pageSize: that.data.pageSize
    }, 'GET').then((res) => {  // 使用ajax函数
      if (res.messageCode = 'MSG_1001') {
        res.data.content.items.forEach((v, i) => {
          v.truePrice = parseFloat((v.dctPrice - v.marketingCashBack.totalAmount).toFixed(2))
        })
        that.setData({
          goodsResult: res.data.content.goodsResult.items
        })
      }
    })  
  },
  getMore:function(){
      var that = this
      var keyword = that.data.keyword
      var pageNumber = that.data.pageNumber + 1
      //销量排行榜
      app.Util.ajax('mall/home/_search', {
        keyword: keyword,
        pageNumber: pageNumber,
        scope: 1,
        pageSize: that.data.pageSize
      }, 'GET').then((res) => { // 使用ajax函数
        if (res.messageCode = 'MSG_1001') {
          if (res.data.content.goodsResult.items == '' && that.data.goodsResult !== '') {
            that.setData({
              text: '已经到底啦'
            })
          }
          var arr = that.data.goodsResult
          res.data.content.items.forEach((v, i) => {
            v.truePrice = parseFloat((v.dctPrice - v.marketingCashBack.totalAmount).toFixed(2))
            arr.push(res.data.content.goodsResult.items[i])
          })
          that.setData({
            goodsResult: arr,
            pageNumber: pageNumber
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
    var that = this
    that.getMore()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (ops) {
    
  }
})