// pages/seedDetail/seedDetail.js
const app = getApp()
var time = require('../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabName: '全部',
    aa: 0,
    index: 0,
    choose: false,
    arry: ['全部', '获取', '扣除'],
    mengban: false,
    content: {},
    pageNumber:1,
    hostUrl: app.Util.getUrlImg().hostUrl,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    app.Util.ajax('mall/seed/queryFinishRecord', {
      pageNumber: 1,
      pageSize: 20,
      type: 0
    }, 'GET').then((res) => {
      console.log(res.data.content.items)
      for (let i of res.data.content.items) {
        i.recordTime = time.formatTimeTwo(i.recordTime, 'Y-M-D h:m:s');
      }
      that.data.content = []
      that.setData({
        content: res.data.content.items
      })
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
    var that = this
    that.getMore();
  },
  getMore: function () {
    var that = this
    if (that.data.aa == 0) {
      var pageNumber = that.data.pageNumber + 1
      app.Util.ajax('mall/seed/queryFinishRecord', {
        pageNumber: pageNumber,
        pageSize: 20,
        type:0
      }, 'GET').then((res) => { // 使用ajax函数
        if (res.data.content.items) {
          if (res.data.content.items == '' && that.data.content !== '') {
            wx.showToast({
              title: '已经到底啦',
              icon: 'none'
            })
          }
          var arr = that.data.content
          for (var i = 0; i < res.data.content.items.length; i++) {
            res.data.content.items[i].recordTime = time.formatTimeTwo(res.data.content.items[i].recordTime, 'Y-M-D h:m:s');
            arr.push(res.data.content.items[i])
          }
          that.setData({
            content: arr,
            pageNumber: pageNumber
          })
        }
      })
    }else if(that.data.aa==1){
      var pageNumber = that.data.pageNumber + 1
      app.Util.ajax('mall/seed/queryFinishRecord', {
        pageNumber: pageNumber,
        pageSize: 20,
        type:1
      }, 'GET').then((res) => { // 使用ajax函数
        if (res.data.content.items) {
          if (res.data.content.items == '' && that.data.content !== '') {
            wx.showToast({
              title: '已经到底啦',
              icon: 'none'
            })
          }
          var arr = that.data.content
          for (var i = 0; i < res.data.content.items.length; i++) {
            res.data.content.items[i].recordTime = time.formatTimeTwo(res.data.content.items[i].recordTime, 'Y-M-D h:m:s');
            arr.push(res.data.content.items[i])
          }
          that.setData({
            content: arr,
            pageNumber: pageNumber
          })
        }
      })
    }else{
      var pageNumber = that.data.pageNumber + 1
      app.Util.ajax('mall/seed/queryFinishRecord', {
        pageNumber: pageNumber,
        pageSize: 20,
        type:2
      }, 'GET').then((res) => { // 使用ajax函数
        if (res.data.content.items) {
          if (res.data.content.items == '' && that.data.content !== '') {
            wx.showToast({
              title: '已经到底啦',
              icon: 'none'
            })
          }
          var arr = that.data.content
          for (var i = 0; i < res.data.content.items.length; i++) {
            res.data.content.items[i].recordTime = time.formatTimeTwo(res.data.content.items[i].recordTime, 'Y-M-D h:m:s');
            arr.push(res.data.content.items[i])
          }
          that.setData({
            content: arr,
            pageNumber: pageNumber
          })
        }
      })
    }

  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  showChoose: function () {
    var that = this
    if (that.data.choose) {
      that.setData({
        choose: false,
        mengban: false
      })
    } else {
      that.setData({
        choose: true,
        mengban: true
      })
    }

  },
  tap: function (e) {
    var that = this
    // console.log(e.currentTarget.dataset.index)
    if (e.currentTarget.dataset.index == 0) {
      var that = this
      app.Util.ajax('mall/seed/queryFinishRecord', {
        pageNumber: 1,
        pageSize: 20,
        type: 0
      }, 'GET').then((res) => {
        console.log(res.data.content.items)
        for (let i of res.data.content.items) {
          i.recordTime = time.formatTimeTwo(i.recordTime, 'Y-M-D h:m:s');
        }
        that.setData({
          content: res.data.content.items
        })
      })
      that.setData({
        aa: 0,
        tabName: '全部',
        pageNumber: 1,
        pageSize: 20,
        text: ''
      })
    } else if (e.currentTarget.dataset.index == 1) {
      var that = this
      app.Util.ajax('mall/seed/queryFinishRecord', {
        pageNumber: 1,
        pageSize: 20,
        type: 1
      }, 'GET').then((res) => {
        console.log(res.data.content.items)
        for (let i of res.data.content.items) {
          i.recordTime = time.formatTimeTwo(i.recordTime, 'Y-M-D h:m:s');
        }
        that.setData({
          content: res.data.content.items
        })
      })
      that.setData({
        aa: 1,
        tabName: '获取',
        pageNumber: 1,
        pageSize: 20,
        text: ''
      })
    } else {
      var that = this
      app.Util.ajax('mall/seed/queryFinishRecord', {
        pageNumber: 1,
        pageSize: 20,
        type: 2
      }, 'GET').then((res) => {
        console.log(res.data.content.items)
        for (let i of res.data.content.items) {
          i.recordTime = time.formatTimeTwo(i.recordTime, 'Y-M-D h:m:s');
        }
        that.setData({
          content: res.data.content.items
        })
      })
      that.setData({
        aa: 2,
        tabName: '扣除',
        pageNumber: 1,
        pageSize: 20,
        text: ''
      })
    }
    //关闭下拉列表
    setTimeout(function () {
      that.showChoose()
    }, 300)
  }
})