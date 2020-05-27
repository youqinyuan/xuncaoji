// packageA/pages/addAppear/addAppear.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hostUrl: app.Util.getUrlImg().hostUrl,
    getSeed: '',//输入种子
    topicId: null,//帖子ID
    getSeed1: null,//消耗种子
    orderNo: null,//排名
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this
    that.setData({
      topicId: options.topicid
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  getSeed(e) {
    let that = this
    that.setData({
      getSeed: e.detail.value
    })
  },
  blurSeed(e) {
    let that = this
    if (Number(e.detail.value) > 100000){
      wx.showToast({
        title: '最大值不能超过100000',
        icon: 'none'
      })
    } if (Number(that.data.getSeed) == 0) {
      wx.showToast({
        title: '输入种子数量不能为0',
        icon: 'none'
      })
    }else{
      let data = {
        topicId: that.data.topicId,
        seedAmount: that.data.getSeed
      }
      app.Util.ajax('mall/forum/topic/checkExposureSeed', data, 'POST').then((res) => {
        if (res.data.messageCode == "MSG_1001") {
          that.setData({
            getSeed1: that.data.getSeed,
            orderNo: res.data.content.orderNo
          })
        }
      })
    }  
  },
  addAppear(){
    let that = this
    if(that.data.getSeed==''){
      wx.showToast({
        title: '请输入消耗种子的数量',
        icon: 'none'
      })
    } if (Number(that.data.getSeed) == 0) {
      wx.showToast({
        title: '输入种子数量不能为0',
        icon: 'none'
      })
    }else{
      if (Number(that.data.getSeed) > 100000) {
        wx.showToast({
          title: '最大值不能超过100000',
          icon: 'none'
        })
      } else {
        let data = {
          topicId: that.data.topicId,
          seedAmount: that.data.getSeed
        }
        app.Util.ajax('mall/forum/topic/addExposureSeed', data, 'POST').then((res) => {
          if (res.data.messageCode == "MSG_1001") {
            wx.showToast({
              title: '增加曝光成功',
              icon:'none'
            })
            setTimeout(function(){
              wx.navigateBack({})
            },500)
          }else{
            wx.showToast({
              title: res.data.message,
              icon: 'none'
            })
          }
        })
      }
    }    
  }
})