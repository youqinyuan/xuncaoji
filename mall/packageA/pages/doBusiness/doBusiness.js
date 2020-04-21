// packageA/pages/doBusiness/doBusiness.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    col:[false,false,false,false,false,false,false]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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

  },
  changeCol:function(e){
    var that = this
    var index = e.currentTarget.dataset.index
    var temp = that.data.col
    if(that.data.col[index]){
      temp[index] = false
      that.setData({
        col:temp
      })
    }else{
      temp[index] = true
      that.setData({
        col:temp
      })
    }
  },
  save:function(){
    wx.navigateBack({
      delta: 1
    })
  }
})