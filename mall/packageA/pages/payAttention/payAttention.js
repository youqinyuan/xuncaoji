// packageA/pages/payAttention/payAttention.js
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageNumber:1,
    pageSize:20
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.init()
  },
  init:function(){
    let that = this
    app.Util.ajax('mall/personal/getFollowStoreList', {
      pageNumber:1,
      pageSize:that.data.pageSize
    }, 'GET').then((res) => {
      if (res.data.messageCode == 'MSG_1001') {
        that.setData({
          content:res.data.content.items,
        })
      }else{
        wx.showToast({
          title:res.data.message,
          icon:'none'
        })
      }
    })
  },
  getInit: function() {
    let that = this
    let pageNumber = that.data.pageNumber + 1
    app.Util.ajax('mall/personal/getFollowStoreList', {
      pageNumber:pageNumber,
      pageSize:that.data.pageSize
    }, 'GET').then((res) => {
      if (res.data.content) {
        if (res.data.content.items == '' && that.data.content !== '') {
          wx.showToast({
            title: '已经到底啦',
            icon: 'none'
          })
        }
        var arr = that.data.content
        if (res.data.content.items.length > 0) {
          for (var i = 0; i < res.data.content.items.length; i++) {
            arr.push(res.data.content.items[i])
          }
          that.setData({
            content: arr,
            pageNumber:pageNumber
          })
        }
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
    this.setData({
      pageNumber:1
    })
    this.init()
    wx.stopPullDownRefresh() //停止下拉刷新
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.getInit()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  toStoreDetail:function(e){
    let storeId = e.currentTarget.dataset.storeid
    //清除配送地址缓存
    wx.removeStorageSync("registerInfo")
    let channel = e.currentTarget.dataset.channel
    if(channel==1){
      //线上
      wx.navigateTo({
        url: '/packageA/pages/ecommerceStore/ecommerceStore?id='+storeId
      })
    }else{
      //线下
      wx.navigateTo({
        url: '/packageA/pages/takeoutHomeage/takeoutHomeage?storeId='+storeId
      })
    }
  }
})