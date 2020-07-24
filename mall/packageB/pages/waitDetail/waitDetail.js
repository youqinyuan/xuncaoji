// packageB/pages/waitDetail/waitDetail.js
const app = getApp()
var utils = require('../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hostUrl: app.Util.getUrlImg().hostUrl,
    pageNumber:1,
    pageSize:20,
    text:'',
    seedToast:false,
    content:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initDetail()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  initDetail: function(e) {
    var that = this
    app.Util.ajax('mall/NoWithdrawal/queryNoWithdrawalDetails',{
      pageNumber: 1,
      pageSize: 20
    }, 'GET').then((res) => {
      if (res.data.content.noWithdrawalItems) {
        var arr = res.data.content.noWithdrawalItems.items
        for (let i of arr) {
          i.createTime = utils.formatTimeTwo(i.createTime, 'Y-M-D');
          if (i.otherTransfer == 1) {
            i.remark = "商品名称保护中"
            i.proStatus = 1
          }else if(i.code){
            i.remark = "购买—一折购提期"
            i.proStatus = 1
          }
        }
        that.data.content = []
        that.setData({
          content: arr,
          seedAmount:res.data.content.seedAmount
        })
        if (that.data.content.length === 0) {
          that.setData({
            text: '暂无数据'
          })
        } else {
          that.setData({
            text: ''
          })
        }
      }
    })
  },
  getInitDetail: function() {
    var that = this
    var pageNumber = that.data.pageNumber + 1
    app.Util.ajax('mall/NoWithdrawal/queryNoWithdrawalDetails', {
      pageNumber: pageNumber,
      pageSize: that.data.pageSize
    }, 'GET').then((res) => { // 使用ajax函数
      if (res.data.content) {
        if (res.data.content.noWithdrawalItems.items == '' && that.data.content !== '') {
          that.setData({
            text: '已经到底啦'
          })
        }
        var arr = that.data.content
        for (var i = 0; i < res.data.content.noWithdrawalItems.items.length; i++) {
          res.data.content.noWithdrawalItems.items[i].createTime = utils.formatTimeTwo(res.data.content.noWithdrawalItems.items[i].createTime, 'Y-M-D');
          if (res.data.content.noWithdrawalItems.items[i].otherTransfer == 1) {
            res.data.content.noWithdrawalItems.items[i].remark = "商品名称保护中"
            res.data.content.noWithdrawalItems.items[i].proStatus = 1
          }else if(res.data.content.noWithdrawalItems.items[i].code){
            res.data.content.noWithdrawalItems.items[i].remark = "购买—一折购提期"
            res.data.content.noWithdrawalItems.items[i].proStatus = 1
          }
          arr.push(res.data.content.noWithdrawalItems.items[i])
        }
        that.setData({
          content: arr,
          pageNumber: pageNumber
        })
      }
    })
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
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    this.getInitDetail()
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  cancle:function(){
    this.setData({
      seedToast:false
    })
  },
  toSeed:function(){
    wx.navigateTo({
      url:"/packageA/pages/seed/seed"
    })
    this.setData({
      seedToast:false
    })
  },
  mention:function(e){
    console.log(e)
    this.setData({
      seedNumber:e.currentTarget.dataset.seednumber,
      id:e.currentTarget.dataset.id,
      seedToast:true
    })
  },
  payShure:function(){
    let that = this
    app.Util.ajax('mall/NoWithdrawal/withdrawal',{
      id:that.data.id
    }, 'POST').then((res) => {
      if(res.data.messageCode=="MSG_1001"){
        this.setData({
          seedToast:false
        })
        wx.showToast({
          title:'提现成功',
          icon:'none'
        })
        setTimeout(function(){
          that.onLoad()
        },1000)
      }else{
        wx.showToast({
          title:res.data.message,
          icon:'none'
        })
      }
    })
  }
})