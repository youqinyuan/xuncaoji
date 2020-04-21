// packageA/pages/business/business.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    aa:null,
    hostUrl: app.Util.getUrlImg().hostUrl,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.init()
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

  },
  init:function(){
    var that = this
    app.Util.ajax('mall/merchant/getMerchantBusinessList', null, 'GET').then((res) => {
      that.setData({
        businessList:res.data.content
    })
  })
  },
  toChoose:function(e){
    var that = this
    var index = e.currentTarget.dataset.index
    var name = e.currentTarget.dataset.name
    var id = e.currentTarget.dataset.id
    let pages = getCurrentPages(); //获取当前页面js里面的pages里的所有信息。
    let prevPage = pages[pages.length - 2]; 
    prevPage.setData({
      business: name,
      businessId:id
    })
    console.log(id,name)
    that.setData({
      aa:index
    })
    wx.navigateBack({
      delta: 1
    })
  }

})