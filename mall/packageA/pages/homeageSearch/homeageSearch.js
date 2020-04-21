// packageA/pages/homeageSearch/homeageSearch.js
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hostUrl: app.Util.getUrlImg().hostUrl,
    inputValue: '',
    show: false,
    pageNumber: 1,
    pageSize: 20,
    goodsResult: [],
    history: wx.getStorageSync('search1') || [],
    textToast: '',//已经到底啦
    storeId:null//店铺ID
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    that.setData({
      storeId: options.id ? options.id:null,
      history: wx.getStorageSync('search1') || [],
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
    let that = this
    if (wx.getStorageSync('inputValue2')) {
      that.setData({
        show: true,
        inputValue: wx.getStorageSync('inputValue2')
      })
      let data = {
        keyword: that.data.inputValue,
        scope: 1,
        pageNumber: that.data.pageNumber,
        pageSize: that.data.pageSize,
        storeId: that.data.storeId
      }
      app.Util.ajax('mall/home/_search',data, 'GET').then((res) => {  // 使用ajax函数
        if (res.data.messageCode == 'MSG_1001') {
          res.data.content.goodsResult.items.forEach((v, i) => {
            v.truePrice = parseFloat((v.dctPrice - v.marketingCashBack.totalAmount).toFixed(2))
          })
          that.setData({
            goodsResult: res.data.content.goodsResult.items
          })
          wx.removeStorageSync('inputValue2')
        } else {
          wx.showToast({
            title: res.data.message,
            icon: 'none'
          })
        }
      })
    }
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
    wx.removeStorageSync('inputValue2')
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

  },
  //跳转到详情页
  toDetail(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/detail/detail?id=${id}`,
    })
  },
  /**
   * 搜索
   */
  search: function () {
    let that = this
    if (that.data.inputValue === '') {
      wx.showToast({
        title: '搜索内容不能为空',
        icon: 'none',
        duration: 2000
      })
    } else {
      const value = that.data.inputValue;
      const text = that.data.history
      const title = text.filter(item => item !== value)
      title.unshift(value)
      that.setData({
        history: title.slice(0, 10),
        inputValue: value,
        textToast: ''
      })
      wx.setStorageSync("search1", that.data.history)
      that.data.pageNumber == 1
      let data = {
        keyword: value,
        scope: 1,
        pageNumber: that.data.pageNumber,
        pageSize: that.data.pageSize,
        storeId: that.data.storeId
      }
      app.Util.ajax('mall/home/_search',data, 'GET').then((res) => {  // 使用ajax函数
        if (res.data.messageCode == 'MSG_1001') {
          res.data.content.goodsResult.items.forEach((v, i) => {
            v.truePrice = parseFloat((v.dctPrice - v.marketingCashBack.totalAmount).toFixed(2))
          })
          that.setData({
            goodsResult: res.data.content.goodsResult.items
          })
          if (that.data.goodsResult.length == 0) {
            wx.showToast({
              title: '暂无相关商品',
              icon: 'none',
            })
          }
          wx.setStorageSync('inputValue2', that.data.inputValue)
        } else {
          wx.showToast({
            title: res.data.message,
            icon: 'none'
          })
        }
      })
    }
  },
  confirmTap: function (e) {
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
      const text = that.data.history
      const title = text.filter(item => item !== value)
      title.unshift(value)
      that.setData({
        history: title.slice(0, 10),
        inputValue: value,
        textToast: ''
      })
      wx.setStorageSync("search1", that.data.history)
      that.data.pageNumber == 1
      let data = {
        keyword: value,
        scope: 1,
        pageNumber: that.data.pageNumber,
        pageSize: that.data.pageSize,
        storeId: that.data.storeId
      }
      app.Util.ajax('mall/home/_search',data, 'GET').then((res) => {  // 使用ajax函数
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
          wx.setStorageSync('inputValue2', that.data.inputValue)
        } else {
          wx.showToast({
            title: res.data.message,
            icon: 'none'
          })
        }
      })
    }
  },
  //点击搜索历史
  searchClick: function (e) {
    let that = this
    const text = e.target.dataset.item
    that.setData({
      show: true,
      inputValue: text
    })
    let data = {
      keyword: text,
      scope: 1,
      pageNumber: that.data.pageNumber,
      pageSize: that.data.pageSize,
      storeId: that.data.storeId
    }
    app.Util.ajax('mall/home/_search',data, 'GET').then((res) => {  // 使用ajax函数
      if (res.data.messageCode == 'MSG_1001') {
        res.data.content.goodsResult.items.forEach((v, i) => {
          v.truePrice = parseFloat((v.dctPrice - v.marketingCashBack.totalAmount).toFixed(2))
        })
        that.setData({
          goodsResult: res.data.content.goodsResult.items
        })
        if (that.data.goodsResult.length == 0) {
          wx.showToast({
            title: '暂无相关商品',
            icon: 'none',
          })
        }
        wx.setStorageSync('inputValue2', that.data.inputValue)
      } else {
        wx.showToast({
          title: res.data.message,
          icon: 'none'
        })
      }
    })
  },
  //加载更多
  getMore: function () {
    let that = this
    let pageNumber = that.data.pageNumber + 1
    let data = {
      keyword: that.data.inputValue,
      scope: 1,
      pageNumber: that.data.pageNumber,
      pageSize: that.data.pageSize,
      storeId: that.data.storeId
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
  cancel: function () {
    let that = this;
    that.setData({
      pageNumber: 1,
      show: false,
      template: 1,
      inputValue: '',
      textToast: '',
      goodsResult:[]
    })
  },
  bindInput: function (e) {
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
  //清空历史记录
  
  detele: function () {
    let that = this
    wx.removeStorage({
      key: 'search1',
      success: function (res) {
        that.setData({
          history: []
        })
      },
    })
    wx.showToast({
      title: '历史记录已删除',
      icon: 'none',
      duration: 2000
    })
  },
})