// pages/commission/commission.js
var time = require('../../utils/util.js');
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageNumber: 1,
    pageSize: 8,
    items:[],
    content:{},
    inputValue1:'',
    show:false
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.setData({
      isMember: parseInt(options.isMember)
    })
    that.init()
  },
  init:function(){
    let that = this
    app.Util.ajax('mall/personal/balanceDetails', { pageNumber: that.data.pageNumber, pageSize: that.data.pageSize, status: 2 }, 'GET').then((res) => { // 使用ajax函数
      if (res.messageCode = 'MSG_1001') {
        for (var i = 0; i < res.data.content.items.items.length;i++){
          res.data.content.items.items[i].tradeTime=time.formatTimeTwo(res.data.content.items.items[i].tradeTime, 'Y-M-D h:m:s');
        }
        that.setData({
          content: res.data.content,
          items: res.data.content.items.items
        })
      }
    })
  },
  //跳转至会员页面
  jumpMember:function(){
    wx.switchTab({
      url: '/pages/member/member',
    })
  },
  //提现
  showDetail: function () {
    var that = this;
    that.setData({
      show: true
    })
  },
  //隐藏提现模态框
  hide: function () {
    var that = this;
    that.setData({
      show: false
    });
  },
  //获取提现金额
  btnSumbit: function (e) {
    var that = this;
    var mesValue = e.detail.value
    that.setData({
      inputValue1: mesValue
    })
  },
  //确认提现
  hideConfirm: function () {
    var that = this;
    var amount = that.data.inputValue1
    console.log(amount)
    if (that.data.inputValue1 !== '') {
      app.Util.ajax('mall/personal/transferForWeChatAudit',{amount:amount,status:2}, 'PUT').then((res) => { // 使用ajax函数
        if (res.data.content) {
          that.hide();
          that.setData({
            inputValue1:''
          })
          wx.showToast({
            title: '余额提现成功',
            icon: 'none'
          })
          that.init()
        }else{
          that.setData({
            inputValue1: ''
          })
          wx.showToast({
            title: res.data.message,
            icon: 'none'
          })
        }
      })
    } else {
      that.setData({
        showMessage1: true
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