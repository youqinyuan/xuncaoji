// packageA/pages/ecommerceStore/ecommerceStore.js
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTab: 0,
    hostUrl: app.Util.getUrlImg().hostUrl,
    navData: [], //店铺分类
    store: {},
    list: [],
    pageNumber: 1, //分页记录数
    pageSize: 20, //分页大小
    storeId: null, //店铺Id
    fixed: 1,
    merchantCategoryId: 0,
    showText: '关注'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this
    that.setData({
      storeId: parseInt(options.id)
    })

    that.init();
    that.initgetMore();
    that.initStore();
    that.getHeight1();
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

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    let that = this
    that.getMore()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  getHeight1: function() {
    let  that = this;
    setTimeout(() => {
      wx.createSelectorQuery().selectAll('.section-wrapper').boundingClientRect(function(rect) {
        that.setData({
          heightView: rect[0].top
        })
      }).exec();
    }, 300)
  },
  onPageScroll(e) {
    let that = this
    if (e.scrollTop > that.data.heightView) {
      that.setData({
        fixed: 2
      })
    } else if (e.scrollTop < 50) {
      that.setData({
        fixed: 1
      })
    }
  },
  switchNav(e) {
    let that = this;
    let index = e.currentTarget.dataset.index
    let id = e.currentTarget.dataset.id 
    that.setData({
      currentTab: index,
      merchantCategoryId: id ,
      pageNumber: 1
    })
    that.initgetMore()
  },
  //店铺细节
  init() {
    let that = this;
    app.Util.ajax('mall/home/store/categories', {
      storeId: that.data.storeId
    }, 'GET').then((res) => {
      if (res.data.content) {
        that.setData({
          navData: res.data.content
        })
      }
    })
   
  },
  initStore(){
    let that = this;
    app.Util.ajax('mall/home/storeDetail', {
      id: that.data.storeId
    }, 'GET').then((res) => {
      if (res.data.content) {
        if (res.data.content.isFollow == 2) {
          that.setData({
            showText: '关注'
          })
        } else {
          that.setData({
            showText: '已关注'
          })
        }
        that.setData({
          store: res.data.content
        })       
      }
    })
  },
  //店铺商品
  initgetMore: function() {
    let that = this
    let pageNumber = that.data.pageNumber
    let data = {
      storeId: that.data.storeId,
      pageNumber: pageNumber,
      pageSize: that.data.pageSize,
      merchantCategoryId: that.data.merchantCategoryId
    }
    app.Util.ajax('mall/home/store/goods', data, 'GET').then((res) => {
      if (res.data.messageCode = 'MSG_1001') {
        res.data.content.items.forEach((v, i) => {
          v.truePrice = parseFloat((v.dctPrice - v.marketingCashBack.totalAmount).toFixed(2))
        })
        that.setData({
          list: res.data.content.items
        })
      }
    })
  },
  //加载更多店铺商品
  getMore: function() {
    let that = this
    let pageNumber = that.data.pageNumber + 1
    let data = {
      storeId: that.data.storeId,
      pageNumber: pageNumber,
      pageSize: that.data.pageSize
    }
    app.Util.ajax('mall/home/store/goods', data, 'GET').then((res) => {
      if (res.data.messageCode = 'MSG_1001') {
        if (res.data.content.items == '' && that.data.list !== '') {
          wx.showToast({
            title: '已经到底啦',
            icon: 'none'
          })
        }
        let arr = that.data.list
        res.data.content.items.forEach((v, i) => {
          v.truePrice = parseFloat((v.dctPrice - v.marketingCashBack.totalAmount).toFixed(2))
          arr.push(res.data.content.items[i])
        })
        that.setData({
          list: arr,
          pageNumber: pageNumber
        })
      }
    })
  },
  //跳转到详情页
  toDetail: function(e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/detail/detail?id=${id}`,
    })
  },
  //跳转到搜索页面
  toSearch(e) {
    wx.navigateTo({
      url: '../homeageSearch/homeageSearch?id=' + e.currentTarget.dataset.id,
    })
  },
  //关注
  follow(e) {
    let that = this
    wx.request({
      url: app.Util.getUrlImg().publicUrl + 'mall/personal/followStore',
      method: "POST",
      data: {storeId: that.data.storeId},
      header: {
        "content-type": 'application/json',
        token: '' || wx.getStorageSync('token'),
      },
      success: function(res) {
        if (res.data.messageCode === 'MSG_1001') {
          that.initStore()
        }
      }
    })
  }
})