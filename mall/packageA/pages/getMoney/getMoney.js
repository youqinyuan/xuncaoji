// packageA/pages/getMoney/getMoney.js
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hostUrl: app.Util.getUrlImg().hostUrl,
    pageNumber: 1,
    pageSize: 20,
    allPost:[],
    type:6
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    console.log(options)
    that.setData({
      goodsId: options.goodsId
    })
    that.getMoney()
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
    let that = this
    that.setData({
      pageNumber: 1,
    })
    that.getMoney()
    setTimeout(function () {
      wx.stopPullDownRefresh() //停止下拉刷新
    }, 500)
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
  //查询省钱帖
  getMoney() {
    let that = this
    let data = {
      pageNumber: that.data.pageNumber,
      pageSize: that.data.pageSize,
      type: that.data.type,
      goodsId: that.data.goodsId
    }
    app.Util.ajax('mall/forum/topic/findPageList', data, 'GET').then((res) => {
      if (res.data.content) {
        let arr = res.data.content.items
        that.setData({
          allPost: arr
        })
      }
    })
  },
  getAllPost: function () {
    var that = this
    var pageNumber = that.data.pageNumber + 1
    let data = {
      pageNumber: pageNumber,
      pageSize: that.data.pageSize,
      type: that.data.type,
      goodsId: that.data.goodsId
    }
    app.Util.ajax('mall/forum/topic/findPageList', data, 'GET').then((res) => { // 使用ajax函数
      if (res.data.content) {
        if (res.data.content.items == '' && that.data.allPost !== '') {
          wx.showToast({
            title: '已经到底啦',
            icon: 'none'
          })
        }
        var arr = that.data.allPost
        if (res.data.content.items.length > 0) {
          for (var i = 0; i < res.data.content.items.length; i++) {
            var arr1 = arr.concat(res.data.content.items)
          }
          that.setData({
            allPost: arr1,
            pageNumber: pageNumber
          })
        }
      }
    })
  },
  //购买赚钱
  earnMoney(e) {
    if (wx.getStorageSync('token')) {
      let id = e.currentTarget.dataset.id
      let specitemids = e.currentTarget.dataset.specitemids
      let topicid = e.currentTarget.dataset.topicid
      let quantity = e.currentTarget.dataset.quantity
      let stockid = e.currentTarget.dataset.stockid
      let source = 1
      wx.navigateTo({
        url: `/pages/detail/detail?id=${id}&specitemids=${specitemids}&topicid=${topicid}&source=${source}&quantity=${quantity}&stockid=${stockid}`,
      })
    } else {
      wx.navigateTo({
        url: '/pages/invitationCode/invitationCode',
      })
    }
  },
  toDetail(e) {
    let that = this;
    if (getCurrentPages().length > 2) {
      //获取页面栈
      let pages = getCurrentPages()
      //给上一个页面设置状态
      let curPage = pages[pages.length - 2];
      let data = curPage.data;
      data.options.searchOrder = 1
      curPage.setData({
        showOrder: true,
        options: data.options
      });
      wx.navigateBack({})
    }
    wx.setStorageSync('goShowOrder', 1)
  },
})