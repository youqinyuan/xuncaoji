// pages/applyZero/applyZero.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showPeriod:false,//想要的分期月数
    showDialog:false,//返现明细表
    showModal:false,//利息明细表
    showStop:false,//可随时终止
    status:1,
    disabled:true//分期返现月数input是否禁用
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  //分期的月数弹框(出现)
  periodMonth: function () {
    var that = this;
    if(that.data.status == 1){
      that.setData({
        showPeriod: true
      })
    }  
  },
  //分期的月数弹框(隐藏)
  cancelPeriod: function () {
    var that = this;
    that.setData({
      showPeriod: false
    })
  },
  //自定义月数
  custom:function(){
    var that = this;
    that.setData({
      disabled:false,
      showPeriod: false,
      status:0
    })
  },
  //返现明细弹框(出现)
  returnDetail:function(){
    var that = this;
    that.setData({
      showDialog: true
    })
  },
  //返现明细弹框(隐藏)
  cancelDialog:function(){
    var that = this;
    that.setData({
      showDialog:false
    })
  },
  //利息明细弹框(出现)
  interestDetail: function () {
    var that = this;
    that.setData({
      showModal: true
    })
  },
  cancelModal:function() {
    var that = this;
    that.setData({
      showModal: false
    })
  },
  //可随时终止(出现)
  stopZero: function () {
    var that = this;
    if (that.data.status == 1) {
      that.setData({
        showStop: true
      })
    }
  },
  //可随时终止(隐藏)
  cancelStop: function () {
    var that = this;
    that.setData({
      showStop: false
    })
  },
  //利息明细弹框(隐藏)

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