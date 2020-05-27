// packageA/pages/profitOrder/profitOrder.js
const app = getApp();
let utils = require('../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hostUrl: app.Util.getUrlImg().hostUrl,
    pageNumber:1,
    pageSize:10,
    arr:[]
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.init()
  },
  init:function(){
    let that = this
    app.Util.ajax('mall/userHome/queryRefundOrderList', {
      type:3,
      pageNumber:that.data.pageNumber,
      pageSize:that.data.pageSize
    }, 'GET').then((res) => { // 使用ajax函数
      if (res.data.messageCode=="MSG_1001"){
        let arr = res.data.content.list.items
        for (let i of arr) {
          i.createTime = utils.formatTimeTwo(i.createTime, 'Y-M-D h:m');
        } 
        that.setData({
          content:res.data.content,
          arr:arr
        })
      }else{
        wx.showToast({
          title:res.data.message,
          icon:'none'
        })
      }
    })
  },
  getInitDetail: function() {
    var that = this
    var pageNumber = that.data.pageNumber + 1
    app.Util.ajax('mall/userHome/queryRefundOrderList', {
      type:3,
      pageNumber: pageNumber,
      pageSize: that.data.pageSize
    }, 'GET').then((res) => { // 使用ajax函数
      if (res.data.content) {
        if (res.data.content.list.items == '' && that.data.arr !== '') {
          wx.showToast({
            title:'已经到底啦',
            icon:'none'
          })
        }
        var arr = that.data.arr
        for (var i = 0; i < res.data.content.list.items.length; i++) {
          res.data.content.list.items[i].createTime = utils.formatTimeTwo(res.data.content.list.items[i].createTime, 'Y-M-D h:m');
          arr.push(res.data.content.list.items[i])
        }
        that.setData({
          arr: arr,
          pageNumber: pageNumber
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
    this.getInitDetail()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})