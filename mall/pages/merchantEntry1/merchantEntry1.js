// pages/merchantEntry1/merchantEntry1.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: []
  },
  //获取文本的值
  chooseText:function(e){
    var that = this;
    var industry = {}
    var name = e.currentTarget.dataset.name
    var id = e.currentTarget.dataset.id
    industry.businessId = id
    industry.name = name
    wx.setStorageSync('industry', industry)
    wx.navigateBack({
      url:'/pages/merchantEntry/merchantEntry'
    })
  },
  //获取商户行业分类列表
  industryList:function(){
    var that = this
    app.Util.ajax('mall/merchant/getMerchantBusinessList','GET').then((res) => {
      if (res.data.content) {
        that.setData({
          list: res.data.content
        })
      } else {
        wx.showToast({
          title: res.data.message,
          icon: 'none'
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.industryList()
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