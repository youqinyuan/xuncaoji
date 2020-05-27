// packageA/pages/setSuccess/setSuccess.js
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shurePeriod:false,
    shareImg:'',
    shareList:{},
    hostUrl: app.Util.getUrlImg().hostUrl,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    if(options.id){
      this.setData({
        id:options.id
      })
    }
    that.getShare()
  },
  //获取分享数据
  getShare:function(){
    let that = this
    app.Util.ajax('mall/weChat/sharing/target', {
      mode: 16,
      targetId: that.data.id
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
    if(app.globalData.mentionPeriodFrom == 2){
      app.globalData.type = 5
      app.globalData.mentionPeriodFrom = 1
      wx.switchTab({
        url: '/pages/forum/forum',
      })
    }else{
      wx.navigateBack({
        delta: 2
      })
    }
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
  onShareAppMessage: function (res) {
    let that = this
    console.log(that.data.shareImg)
    if (res.from == "button") {
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
  }
  },
  fabu:function(){
    this.setData({
      shurePeriod:true
    })
  },
  close:function(){
    this.setData({
      shurePeriod:false
    })
  },
  shure:function(){
    let that = this
    app.Util.ajax('mall/forum/topic/updateMentionPeriodTopicVisible', {
      id:that.data.id
    }, 'POST').then((res) => {
      that.setData({
        shurePeriod:false
      })
      if (res.data.messageCode == 'MSG_1001') {
        wx.showToast({
          title:'发布成功',
          icon:'none'
        })
      }else{
        wx.showToast({
          title:res.data.message,
          icon:'none'
        })
      }
    })
  },
  toHelp:function(){
    let that = this
    wx.navigateTo({
      url: `/packageA/pages/helpMentionPeriod/helpMentionPeriod?id=`+that.data.id,
    })
  }
})