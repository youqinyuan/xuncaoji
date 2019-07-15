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
    inviterCode: '',
    shareList:{},
    imageUrl: '../../assets/images/icon/team_share.png'
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
  //查询分享数据
  chooseShare: function () {
    var that = this
    app.Util.ajax('mall/weChat/sharing/target', { mode: 4 }, 'GET').then((res) => {
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
    var token = wx.getStorageSync('token')
    if (!token) {
      wx.navigateTo({
        url: '/pages/invitationCode/invitationCode',
      })
    }else{
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
      title: that.data.shareList.desc,
      path: that.data.shareList.link,
      imageUrl: that.data.imageUrl,
      success: function (res) {

      },
      fail: function (res) {
        // 转发失败
        console.log("转发失败:" + JSON.stringify(res));
      }
    }
  }
})