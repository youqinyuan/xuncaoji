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
    items:[],//佣金明细
    content:{},
    inputValue1:'',//提现金额
    show:false,//提现弹框
    isMember:null,//是否是会员
    text:'',
    html: '',
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    if (options) {
      if (options.inviterCode) {
        wx.setStorage({
          key: "othersInviterCode",
          data: options.inviterCode
        })
      }
    }
    that.setData({
      isMember: parseInt(options.isMember)
    })
    that.init()
    that.commission()
  },
  //合伙人介绍
  commission: function () {
    var that = this
    app.Util.ajax('mall/page/queryByType', {
      type: 2,
    }, 'GET').then((res) => {
      if (res.data.messageCode = 'MSG_1001') {
        that.setData({
          html: res.data.content.content
        })
      }
    })
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
  getMore1: function () {
    var that = this
    var pageNumber = that.data.pageNumber + 1
    app.Util.ajax('mall/personal/balanceDetails', { pageNumber: pageNumber, pageSize: that.data.pageSize, status: 2 }, 'GET').then((res) => { // 使用ajax函数
      if (res.data.messageCode = 'MSG_1001') {
        if (res.data.content.items.items == '' && that.data.items !== '') {
          that.setData({
            text: '已经到底啦'
          })
        }
        var arr = that.data.items
        for (var i = 0; i < res.data.content.items.items.length; i++) {
          res.data.content.items.items[i].tradeTime = time.formatTimeTwo(res.data.content.items.items[i].tradeTime, 'Y-M-D h:m:s');
          arr.push(res.data.content.items.items[i])
        }
        that.setData({
          items: arr,
          pageNumber: pageNumber
        })
      }
    })
  },
  //跳转至会员页面
  jumpMember:function(){
    wx.navigateTo({
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
    if (that.data.inputValue1 !== '') {
      app.Util.ajax('mall/personal/transferAudit', { status: 2, amount: amount, source:2}, 'POST').then((res) => { // 使用ajax函数
        if (res.data.content) {
          that.hide();
          that.setData({
            inputValue1:'',
            pageNumber:1
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
    var that = this;
    that.setData({
      pageNumber: 1
    })
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
    var that = this;
    if (that.data.isMember == 1){
      that.getMore1(); 
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      path: "/pages/commission/commission?inviterCode=" + wx.getStorageSync('inviterCode'),
    }
  }
})