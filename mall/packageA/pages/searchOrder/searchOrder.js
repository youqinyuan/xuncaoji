// packageA/pages/searchOrder/searchOrder.js
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hostUrl: app.Util.getUrlImg().hostUrl,
    currentTab: 2,
    type: 1,
    navData: [{
      type: 1,
      text: '价格从高到低'
    }, {
      type: 2,
      text: '价格从低到高'
    }],
    inputValue: '',
    show: false,
    template: 1,
    pageNumber: 1,
    pageSize: 20,
    goodsResult: [],
    textToast: '', //已经到底啦
    getMore: '', //查看更多
    sortFlag: 1, //排序
    sortBy:1,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this
    that.setData({
      options:options
    })
    if (options.status == 1) {
      wx.setNavigationBarTitle({
        title: '发布预售商品'
      });
    } else if (options.status == 2) {
      wx.setNavigationBarTitle({
        title: '发布预定商品'
      });
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
    let that = this
    if (wx.getStorageSync('inputValue1')) {
      that.setData({
        pageNumber:1,
        show: true,
        inputValue: wx.getStorageSync('inputValue1')
      })
      that.utilsData();
    }
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
    wx.removeStorageSync('inputValue1')
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
  onShareAppMessage: function(ops) {

  },
  //导航切换
  switchNav: function(e) {
    let that = this
    let cur = e.currentTarget.dataset.current //导航栏数组的index
    let type = e.currentTarget.dataset.type
    if (type == 1) {
      that.setData({
        sortFlag: 2,
        sortBy:2
      })
    } else {
      that.setData({
        sortFlag: 1,
        sortBy:2
      })
    }
    that.setData({
      type: type,
      currentTab: cur
    })
    that.utilsData();
  },
  //跳转到详情页
  toDetail(e) {
    let that = this
    let id = e.currentTarget.dataset.id
    if (that.data.options.status == 2){
      wx.navigateTo({
        url: `/pages/detail/detail?id=${id}&searchOrder=2`,
      })
    }else{
      wx.navigateTo({
        url: `/pages/detail/detail?id=${id}&searchOrder=1`,
      })
    }
    
  },
  /**
   * 搜索
   */
  search: function() {
    let that = this
    if (that.data.inputValue === '') {
      wx.showToast({
        title: '搜索内容不能为空',
        icon: 'none',
        duration: 2000
      })
    } else {
      const value = that.data.inputValue;
      that.setData({
        inputValue: value,
        textToast: '',
        pageNumber: 1
      })
      that.utilsData();
    }
  },
  confirmTap: function(e) {
    let that = this
    that.data.inputValue = e.detail.value
    if (that.data.inputValue === '') {
      wx.showToast({
        title: '搜索内容不能为空',
        icon: 'none',
        duration: 2000
      })
    } else {
      const value = that.data.inputValue;
      that.setData({
        inputValue: value,
        textToast: '',
        pageNumber: 1
      })
      that.utilsData();
    }
  },
  utilsData: function() {
    let that = this
    let data = {
      keyword: that.data.inputValue,
      scope: 1,
      sortBy: 2,
      sortBy: that.data.sortBy,
      sortFlag: that.data.sortFlag,
      pageNumber: that.data.pageNumber,
      pageSize: that.data.pageSize
    }
    app.Util.ajax('mall/home/_search', data, 'GET').then((res) => { // 使用ajax函数
      if (res.data.messageCode == 'MSG_1001') {
        res.data.content.goodsResult.items.forEach((v, i) => {
          v.truePrice = parseFloat((v.dctPrice - v.marketingCashBack.totalAmount).toFixed(2))
        })
        that.setData({
          goodsResult: res.data.content.goodsResult.items,
        })
        if (that.data.goodsResult.length == 0) {
          wx.showToast({
            title: '暂无相关商品',
            icon: 'none',
          })
        }
        wx.setStorageSync('inputValue1', that.data.inputValue)
      } else {
        wx.showToast({
          title: res.data.message,
          icon: 'none'
        })
      }
    })
  },
  //加载更多
  getMore: function() {
    let that = this
    let pageNumber = that.data.pageNumber + 1
    let data = {
      keyword: that.data.inputValue,
      scope: 1,
      sortBy: 2,
      sortFlag: that.data.sortFlag,
      pageNumber: pageNumber,
      pageSize: that.data.pageSize
    }
    app.Util.ajax('mall/home/_search', data, 'GET').then((res) => { // 使用ajax函数
      if (res.messageCode = 'MSG_1001') {
        if (res.data.content.goodsResult.items == '' && that.data.goodsResult !== '') {
          that.setData({
            textToast: '已经到底啦'
          })
        }
        let arr = that.data.goodsResult
        res.data.content.goodsResult.items.forEach((v, i) => {
          v.truePrice = parseFloat((v.dctPrice - v.marketingCashBack.totalAmount).toFixed(2))
        })
        for (let i = 0; i < res.data.content.goodsResult.items.length; i++) {
          arr.push(res.data.content.goodsResult.items[i])
        }
        that.setData({
          goodsResult: arr,
          pageNumber: pageNumber
        })
      }
    })
  },
  cancel: function() {
    let that = this;
    that.setData({
      pageNumber: 1,
      show: false,
      inputValue: '',
      textToast: '',
      sortBy:1,
      currentTab:2
    })
  },
  bindInput: function(e) {
    let that = this;
    let value = e.detail.value
    if (value !== '') {
      that.setData({
        inputValue: value,
        show: true
      })
    } else {
      that.setData({
        show: false
      })
    }
  },
})