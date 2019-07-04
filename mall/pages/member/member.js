// pages/mine/member/member.js
var time = require('../../utils/util.js');
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show: false,
    taskItems:[],
    expireTime:'',
    inviterCode: ''
  },
  //显示弹框
  recurit: function () {
    var that = this;
    that.setData({
      show: true
    })
  },
  cancel: function () {
    var that = this;
    that.setData({
      show: false
    })
  },
  //跳转至充值界面
  jumpRecharge:function(){
    wx.navigateTo({
      url: '/pages/mine/recharge/recharge',
    })
  },
  //跳转至首页
  jumpIndex:function(){
    wx.switchTab({
     url:'/pages/index/index'
   })
  },
  /**
  * 弹出框蒙层截断touchmove事件
  */
  preventTouchMove: function () {
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    var token = wx.getStorageSync('token')
    if (!token) {
      wx.navigateTo({
        url: '/pages/invitationCode/invitationCode',
      })
    }else{
      // that.setData({
      //   isMember: Number(options.isMember)
      // })
      app.Util.ajax('mall/personal/myMember', 'GET').then((res) => { // 使用ajax函数
        if (res.messageCode = 'MSG_1001') {
          var inviterCode = wx.getStorageSync('inviterCode')
          if (res.data.content.expireTime) {
            res.data.content.expireTime = time.formatTimeTwo(res.data.content.expireTime, 'Y年M月D日');
          }
          that.setData({
            taskItems: res.data.content.taskItems,
            expireTime: res.data.content.expireTime,
            inviterCode: inviterCode
          })
        }
      })
    }
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
    var that = this
    that.onLoad();
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
    that.onLoad()
    wx.stopPullDownRefresh() //停止下拉刷新
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