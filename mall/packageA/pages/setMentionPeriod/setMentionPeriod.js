// packageA/pages/setMentionPeriod/setMentionPeriod.js
let app = getApp()
var time = require('../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageNumber:1,
    pageSize:20,
    shrueDelete:false,
    shareImg:'',
    shareList:{},
    showModalStatus1:false,
    hostUrl: app.Util.getUrlImg().hostUrl,
    showModal:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  init:function(){
    let that = this
    app.Util.ajax('mall/forum/MentionPeriod/findMyForumMentionPeriodPageList', {
      // pageNumber:that.data.pageNumber,
      // pageSize:that.data.pageSize
    }, 'GET').then((res) => {
      if (res.data.messageCode == 'MSG_1001') {
        console.log(res.data.content)
        that.setData({
          content:res.data.content.items
        })
      }else{
        wx.showToast({
          title:res.data.message,
          icon:'none'
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
    let that = this
    that.init()
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
    this.init()
    wx.stopPullDownRefresh() //停止下拉刷新
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    wx.showToast({
      title:'已经到底了哦~',
      icon:'none'
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    var that = this
    if (res.from == "button") {
      if (res.target.id === 'btn') {
        // 来自页面内转发按钮
        that.setData({
          showModalStatus1: false
        })
        app.Util.ajax('mall/weChat/sharing/onSuccess', {
          mode: 16
        }, 'POST').then((res) => {
          if (res.data.content) {
            wx.showToast({
              title: '分享成功',
              icon: 'none'
            })
          }
        })
        return {
          title: '请助我一臂之力帮我提期，您也可享受超高收益',
          path: that.data.shareList.link,
          imageUrl: that.data.shareImg,
          success: function(res) {

          },
          fail: function(res) {
            // 转发失败
            console.log("转发失败:" + JSON.stringify(res));
          }
        }
      } else if (res.target.id === 'btnGroup') {
        that.setData({
          showModalStatus1: false
        })
        app.Util.ajax('mall/weChat/sharing/onSuccess', {
          mode: 16
        }, 'POST').then((res) => {
          if (res.data.content) {
            wx.showToast({
              title: '分享成功',
              icon: 'none'
            })
          } else {

          }
        })
        return {
          title: '请助我一臂之力帮我提期，您也可享受超高收益',
          path: that.data.shareList.link,
          imageUrl: that.data.shareImg,
        }
      }
    }
  },
  delete:function(e){
    let that = this
    let id = e.currentTarget.dataset.id
    that.setData({
      shrueDelete:true,
      id:id
    })
  },
  shureDelete:function(){
    let that = this
    let id = that.data.id
    app.Util.ajax('mall/forum/MentionPeriod/deleteForumMentionPeriod', {
      id:id
    }, 'POST').then((res) => {
      if (res.data.messageCode == 'MSG_1001') {
        wx.showToast({
          title:'删除成功',
          icon:'none'
        })
        that.setData({
          shrueDelete:false
        })
        setTimeout(function(){
          that.init()
        },500)
      }else{
        wx.showToast({
          title:res.data.message,
          icon:'none'
        })
      }
    })
  },
  closeDelete:function(){
    this.setData({
      shrueDelete:false
    })
  },
  shares: function (e) {
    var that = this
    var token = wx.getStorageSync('token')
    let id = e.currentTarget.dataset.id
    console.log(id)
    if (token) {
      that.setData({
        showModalStatus1: true
      })
      that.share(id)
    } else {
      wx.navigateTo({
        url: '/pages/invitationCode/invitationCode',
      })
    }
  },
      // 取消分享
      cancelShare: function () {
        var that = this
        that.setData({
          showModalStatus1: false
        })
      },
      share:function(id){
        let that = this
        app.Util.ajax('mall/weChat/sharing/target', {
          mode: 16,
          targetId: id
        }, 'GET').then((res) => {
          if (res.data.messageCode == "MSG_1001") {
            var inviterCode = wx.getStorageSync('inviterCode')
            if (inviterCode) {
              res.data.content.link = res.data.content.link.replace(/{inviterCode}/g, inviterCode)
            } else {
              res.data.content.link = res.data.content.link.replace(/{inviterCode}/g, '')
            }
            // 产品图片路径转换为本地路径
            var imageUrl = res.data.content.imageUrl
            if (imageUrl) {
              wx.getImageInfo({
                src: imageUrl,
                success(res) {
                  that.data.shareImg = res.path
                }
              })
            }
            that.setData({
              shareList: res.data.content
            })
            console.log(res.data.content)
          }
      })
    },
      //隐藏底部分享对话框
  hide: function() {
    var that = this
    that.setData({
      showModalStatus1: false,
    })
  },
  closeModal:function(){
    this.setData({
      showModal:false
    })
  },
  showModal:function(e){
    let that = this
    let temp = e.currentTarget.dataset.temp
    // console.log(that.data.content[temp])
    that.data.content[temp].createTime = time.formatTimeTwo(that.data.content[temp].createTime, 'Y-M-D');
    this.setData({
      detail:that.data.content[temp],
      showModal:true
    })
  },
  toHelp:function(e){
      //此缓存解决从待返提期完成后的页面跳转问题，清除是为了确保此时无缓存
      app.globalData.helpMentionPeriod = 2
        let id = e.currentTarget.dataset.id
        wx.navigateTo({
          url: '/packageA/pages/helpMentionPeriod/helpMentionPeriod?id='+id
        })
  },
})