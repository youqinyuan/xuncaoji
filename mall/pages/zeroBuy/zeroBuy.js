// pages/zeroBuy/zeroBuy.js

let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsItems:[],
    showMask:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    this.init()
  },
  init: function () {
    var that = this
    app.Util.ajax(`mall/home/activity/freeShopping?mode=${2}`, null, 'GET').then((res) => { // 使用ajax函数
      if (res.data.content) {
        that.setData({
          goodsItems: res.data.content.goodsItems
        })
      }
    })
  },
  //显示或隐藏弹框
  show:function(){
    this.setData({
      showMask: !this.data.showMask
    })
  },
  //阻止弹框之后的页面滑动问题
  preventTouchMove:function(){

  },
  //保存二维码图片到相册
  saveImg:function(){
    wx.saveImageToPhotosAlbum({
      filePath:'/assets/images/icon/code.png',
      success(res) {
        wx.showToast({
          title: '图片保存成功',
          icon: 'success',
          duration: 1000
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})