// pages/myteam/myteam.js
var time = require('../../utils/util.js');
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show: false,
    pageNumber:1,
    pageSize: 10,
    content:{},
    followers:[],
    shareList:{},
    inviterCode:''
  },
  //显示弹框
  recurit: function () {
    var that = this;
    that.setData({
      show: true
    })
  },
  cancel:function(){
    var that = this;
    that.setData({
      show: false
    })
  },
  /**
  * 弹出框蒙层截断touchmove事件
  */
  preventTouchMove: function () {

  },
  //查询分享数据
  chooseShare: function () {
    var that = this
    app.Util.ajax('mall/weChat/sharing/target', { mode: 4}, 'GET').then((res) => {
      if (res.messageCode = 'MSG_1001') {
        var inviterCode = wx.getStorageSync('inviterCode')
        if (inviterCode) {
          res.data.content.link = res.data.content.link.replace(/{inviterCode}/g, inviterCode)
        } else {
          res.data.content.link = res.data.content.link.replace(/{inviterCode}/g, '')
        }     
        that.setData({
          shareList: res.data.content
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    app.Util.ajax('mall/personal/followers', { pageNumber: that.data.pageNumber, pageSize: that.data.pageSize}, 'GET').then((res) => { 
      if (res.messageCode = 'MSG_1001') {
        var inviterCode = wx.getStorageSync('inviterCode')
        for (var i = 0; i < res.data.content.followers.items.length;i++){
          res.data.content.followers.items[i].regTime = time.formatTimeTwo(res.data.content.followers.items[i].regTime, 'Y-M-D h:m:s');
        }
        that.setData({
          content: res.data.content,
          followers: res.data.content.followers.items,
          inviterCode: inviterCode
        })
      }
    })
    that.chooseShare()
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
  onShareAppMessage: function (ops) {
    var that = this
    if (ops.from === 'button') {
      // 来自页面内转发按钮
      that.setData({
        show: false
      })
      app.Util.ajax('mall/weChat/sharing/onSuccess', { mode: 4 }, 'POST').then((res) => {
        if (res.data.messageCode = 'MSG_1001') {
          wx.showToast({
            title: '分享成功',
            icon: 'none'
          })
        } else {
          wx.showToast({
            title: res.data.message,
            icon: 'none'
          })
        }
      })
    }
    return {
      title: that.data.shareList.title,
      path: that.data.shareList.link,
      imageUrl: that.data.shareList.imageUrl,
      success: function (res) {

      },
      fail: function (res) {
        // 转发失败
        console.log("转发失败:" + JSON.stringify(res));
      }
    }
  }
})