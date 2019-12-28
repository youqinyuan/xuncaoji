// pages/storeDetail/storeDetail.js
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    store:{},
    list:[],
    pageNumber: 1, //分页记录数
    pageSize: 20, //分页大小
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.setData({
      storeId: parseInt(options.id)
    })
    app.Util.ajax('mall/home/storeDetail', {
      id: parseInt(options.id)
    }, 'GET').then((res) => {
      if (res.data.content) {
        that.setData({
          store: res.data.content
        })
        that.initgetMore();
      }
    })
  },
  //店铺商品
  initgetMore: function () {
    var that = this
    var pageNumber = that.data.pageNumber
    //品质优选
    app.Util.ajax('mall/home/store/goods', {
      storeId: that.data.storeId,
      pageNumber: pageNumber,
      pageSize: that.data.pageSize
    }, 'GET').then((res) => { // 使用ajax函数
      if (res.data.messageCode = 'MSG_1001') {
        res.data.content.items.forEach((v, i) => {
          v.truePrice = parseFloat((v.dctPrice - v.marketingCashBack.totalAmount).toFixed(2))
        })
        that.setData({
          list: res.data.content.items
        })
      }
    })
  },
  //加载更多店铺商品
  getMore: function () {
    var that = this
    var pageNumber = that.data.pageNumber + 1
    app.Util.ajax('mall/home/store/goods', {
      storeId: that.data.storeId,
      pageNumber: pageNumber,
      pageSize: that.data.pageSize
    }, 'GET').then((res) => { // 使用ajax函数
      if (res.data.messageCode = 'MSG_1001') {
        if (res.data.content.items == '' && that.data.list !== '') {
         wx.showToast({
           title: '已经到底啦',
           icon:'none'
         })
        }
        var arr = that.data.list
        res.data.content.items.forEach((v, i) => {
          v.truePrice = parseFloat((v.dctPrice - v.marketingCashBack.totalAmount).toFixed(2))
          arr.push(res.data.content.items[i])
        })
        that.setData({
          list: arr,
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
  onShareAppMessage: function () {

  }
})