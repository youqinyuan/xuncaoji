// packageA/pages/check/check.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hostUrl: app.Util.getUrlImg().hostUrl,
    remark:'',
    DownloadAddress:'https://xuncaoji.net:8087'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    if(options.status){
      that.setData({
        status:options.status,
        remark:options.remark,
        inviterCode:options.inviterCode,
        mobileNumber:options.mobileNumber,
        phone:options.phone
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
    wx.switchTab({
      url:'/pages/mine/mine'
    })
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
  update:function(){
    let that = this
    wx.navigateTo({
      url: '/packageA/pages/storeEnter/storeEnter?check=1&inviterCode='+that.data.inviterCode+'&mobileNumber='+that.data.mobileNumber,
    })
  },
  again:function(){
    let that = this
    wx.navigateTo({
      url: '/packageA/pages/storeEnter/storeEnter?check=1&inviterCode='+that.data.inviterCode+'&mobileNumber='+that.data.mobileNumber,
    })
  },
  copy:function(){
    var that = this
    wx.setClipboardData({
      //准备复制的数据
      data: that.data.DownloadAddress,
      success: function (res) {
        wx.showToast({
          title: '复制成功',
          icon: "none"
        }, 2000);

        that.setData({
          downAppStatus: false
        });
      }
    });
  }
})