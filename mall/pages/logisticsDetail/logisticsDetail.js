// pages/logisticsDetail/logisticsDetail.js
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hostUrl: app.Util.getUrlImg().hostUrl,
    orderId:null,//订单id
    logisticsDetailList:[],//已发货物流信息
    goodsImageList:[],//未发货
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    var orderId = options.orderId
    that.setData({
      orderId: orderId
    })
    app.Util.ajax('mall/order/queryLogistics', {
      orderId: orderId
    }, 'GET').then((res) => { // 使用ajax函数
      if (res.data.content) {
        var logisticsDetailList = res.data.content.logisticsDetailList
        logisticsDetailList.forEach((v,i)=>{
          v.logisticsDto.list = (v.logisticsDto.list.reverse())[0]
        })
        that.setData({
          logisticsDetailList: logisticsDetailList,
          goodsImageList: res.data.content.goodsImageList
        })
        
      }
    })
  },
  // 事件
  go_logistics:function(e){
    var logisticsId = e.currentTarget.dataset.logisticsid
    wx.navigateTo({
      url: `/pages/logistics/logistics?logisticsId=${logisticsId}`,
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})