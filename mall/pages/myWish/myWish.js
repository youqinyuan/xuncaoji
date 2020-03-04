// pages/myWish/myWish.js
let app = getApp();
var time = require('../../utils/util.js');
var arryTime = [];
var objTime = {}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hostUrl: app.Util.getUrlImg().hostUrl,
    showDialog: false, //删除弹框
    wishpool: [],
    wishId: null,
    bgColor: '#f4f4f4',
    pageNumber: 1,
    pageSize: 20,
    minutes: 1800000 //30分钟
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    if (options.messages) {
      wx.showToast({
        title: options.messages,
        icon: 'none'
      })
      setTimeout(function() {
        that.queryWish()
      }, 1000)
    } else {
      that.queryWish()
    }
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
    var that = this
    if (wx.getStorageSync('messages')) {
      wx.showToast({
        title: wx.getStorageSync('messages'),
        icon: 'none'
      })
    }
    if (wx.getStorageSync('pageNum')) {
      that.setData({
        pageNumber: 1,
        wishpool: []
      })
      setTimeout(function() {
        that.queryWish()
      }, 1000)
    }

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    wx.removeStorageSync('messages')
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    if (wx.getStorageSync('jumpStatus')) {


    } else {
      wx.switchTab({
        url: '/pages/wishpool/wishpool'
      })
    }
    wx.removeStorageSync('pageNum')
    wx.removeStorageSync('jumpStatus')
    wx.removeStorageSync('messages')
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    var that = this
    that.setData({
      pageNumber: 1
    })
    that.queryWish()
    setTimeout(function() {
      wx.stopPullDownRefresh() //停止下拉刷新
    }, 1000)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    var that = this
    that.getQueryWish()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  queryWish: function() {
    var that = this
    app.Util.ajax('mall/wishZone/findPageList', {
      pageNumber: that.data.pageNumber,
      pageSize: that.data.pageSize
    }, 'GET').then((res) => { // 使用ajax函数
      if (res.data.content) {
        if (res.data.content.items.length > 0) {
          res.data.content.items.forEach((v, i) => {
            v.hours = parseInt(v.leftTime / 3600000).toString() >= 10 ? parseInt(v.leftTime / 3600000).toString() : '0' + parseInt(v.leftTime / 3600000).toString()
            v.minutes = parseInt((v.leftTime % (1000 * 60 * 60)) / (1000 * 60)).toString() >= 10 ? parseInt((v.leftTime % (1000 * 60 * 60)) / (1000 * 60)).toString() : '0' + parseInt((v.leftTime % (1000 * 60 * 60)) / (1000 * 60)).toString()
            v.boxWidth = 610
            v.backWidth = (610 / 24) * v.progressBar
          })
          that.setData({
            bgColor: '#f4f4f4',
            wishpool: res.data.content.items
          })
        } else {
          that.setData({
            bgColor: '#fff',
            wishpool: res.data.content.items
          })
        }
      }
    })
  },
  getQueryWish: function() {
    var that = this
    var pageNumber = that.data.pageNumber + 1
    app.Util.ajax('mall/wishZone/findPageList', {
      pageNumber: pageNumber,
      pageSize: that.data.pageSize
    }, 'GET').then((res) => { // 使用ajax函数
      if (res.data.messageCode = 'MSG_1001') {
        if (res.data.content.items == '' && that.data.wishpool !== '') {
          wx.showToast({
            title: '已经到底啦',
            icon: 'none'
          })
        }
        var arr = that.data.wishpool
        res.data.content.items.forEach((v, i) => {
          v.hours = parseInt(v.leftTime / 3600000).toString() >= 10 ? parseInt(v.leftTime / 3600000).toString() : '0' + parseInt(v.leftTime / 3600000).toString()
          v.minutes = parseInt((v.leftTime % (1000 * 60 * 60)) / (1000 * 60)).toString() >= 10 ? parseInt((v.leftTime % (1000 * 60 * 60)) / (1000 * 60)).toString() : '0' + parseInt((v.leftTime % (1000 * 60 * 60)) / (1000 * 60)).toString()
          v.boxWidth = 610
          v.backWidth = (610 / 24) * v.progressBar
          arr.push(res.data.content.items[i])
        })
        that.setData({
          wishpool: arr,
          pageNumber: pageNumber
        })
      }
    })
  },
  //已满足商品跳转到详情页
  getDetail: function(e) {
    var that = this
    if(e.currentTarget.dataset.status==2){
      wx.navigateTo({
        url: `/pages/detail/detail?id=${e.currentTarget.dataset.id}`,
      })
    } else if (e.currentTarget.dataset.status == 3){
      wx.showToast({
        title: '心愿处于等待期请耐心等待一会哦，或者联系客服',
        icon:'none'
      })
    }
  },
  //点击复制
  copyText: function(e) {
    var that = this
    var text = e.currentTarget.dataset.text
    var text1 = text.toString()
    wx.setClipboardData({
      data: text1,
      success: function(res) {
        wx.getClipboardData({
          success: function(res) {
            wx.showToast({
              title: '复制成功',
              icon: 'none'
            })
          }
        })
      }
    })
  },
  //催一催
  urgeData: function(e) {
    var that = this
    var wishId = e.currentTarget.dataset.id
    var timestamp = Date.parse(new Date());
    objTime[wishId] = timestamp
    // console.log(objTime)
    var objTimeSt = wx.getStorageSync('objTime')
    var temp = 1
    // console.log(objTimeSt)
    if (objTimeSt !== '') {
      for (var key in objTimeSt) {
        if (key == wishId) {
          temp = 2
          if ((timestamp - objTimeSt[key]) > that.data.minutes) {
            wx.showToast({
              title: '已收到您的催促申请，我们将尽快满足您心愿哦',
              icon: 'none'
            })
            objTimeSt[wishId] = timestamp
            wx.setStorageSync('objTime', objTimeSt)
          } else {
            wx.showToast({
              title: '催促过于频繁，请耐心等待',
              icon: 'none'
            })
          }
        } 
      }
      if(temp!==2){
        wx.showToast({
          title: '已收到您的催促申请，我们将尽快满足您心愿哦',
          icon: 'none'
        })
        objTimeSt[wishId] = timestamp
        wx.setStorageSync('objTime', objTimeSt)
      }
    } else {
      wx.showToast({
        title: '已收到您的催促申请，我们将尽快满足您心愿哦',
        icon: 'none'
      })
      wx.setStorageSync('objTime', objTime)
    }
  },
  imgYu: function(e) {
    var that = this
    var index = e.currentTarget.dataset.index;
    var idx = e.currentTarget.dataset.idx;
    var imgArr = [];
    for (var i = 0; i < that.data.wishpool[idx].imageList.length; i++) {
      imgArr.push(that.data.wishpool[idx].imageList[i]["imageUrl"]);
    }
    wx.previewImage({
      current: imgArr[index], //当前图片地址
      urls: imgArr
    })
  },
  //客服分享图片回到指定的小程序页面
  handleContact: function(e) {
    var path = e.detail.path,
      query = e.detail.query,
      params = '';
    if (path) {
      for (var key in query) {
        params = key + '=' + query[key] + '&';
      }
      params = params.slice(0, params.length - 1);
      wx.navigateTo({
        url: path + '?' + params
      })
    }
  },
  comfirm: function(e) {
    var that = this
    app.Util.ajax('mall/wishZone/wish?wishId=' + that.data.wishId, null, 'DELETE').then((res) => { // 使用ajax函数
      if (res.data.messageCode == "MSG_1001") {
        that.setData({
          showDialog: false
        })
        wx.showToast({
          title: '心愿删除成功',
          icon: 'none'
        })
        setTimeout(function() {
          that.queryWish()
        }, 300)
      } else {
        that.setData({
          showDialog: false
        })
        wx.showToast({
          title: res.data.message,
          icon: 'none',
          duration: 1000
        })
      }
    })

  },
  reject: function(e) {
    var that = this
    that.setData({
      showDialog: false
    })
  },
  //长按删除
  deleteList: function(e) {
    var that = this
    that.setData({
      showDialog: true,
      wishId: e.currentTarget.dataset.id
    })
  },
  //跳转到留下心愿页面
  leaveWish: function() {
    wx.navigateTo({
      url: '/pages/leaveWish/leaveWish',
    })
    wx.setStorageSync('jumpStatus', 1)
    wx.removeStorageSync('pageNum')
  },
})