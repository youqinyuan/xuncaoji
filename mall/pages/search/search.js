// pages/search/search.js
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputValue: '',
    show: false,
    template: 1,
    pageNumber: 1,
    pageSize: 20,
    goodsResult:[],
    storeResult:[],
    history: wx.getStorageSync('search')||[],
    showModalStatus: false,//分享弹窗
    textToast:'',//已经到底啦
    getMore:'',//查看更多
    getMore1: '',//查看更多
  },
  //跳转到详情页
  toDetail(e){
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/detail/detail?id=${id}`,
    })
  },
  //跳转到店铺详情
  jumpShopsDetail: function (e) {
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/storedetails/storedetails?id=' + id
    })
  },
  /**
   * 搜索
   */
  search: function() {
    var that = this
    if (that.data.inputValue === '') {
      wx.showToast({
        title: '搜索内容不能为空',
        icon: 'none',
        duration: 2000
      })
    }else {
      const value = that.data.inputValue;
      const text = that.data.history
      const title = text.filter(item => item !== value)
      title.unshift(value)
      that.setData({
        history: title,
        inputValue: value,
        textToast: ''
      })
      wx.setStorageSync("search", that.data.history.slice(0,30))
      that.setData({
        template: 2
      })
      that.data.pageNumber == 1
      app.Util.ajax('mall/home/_search', {
        keyword: value,
        scope: 4,
        pageNumber: that.data.pageNumber,
        pageSize: that.data.pageSize
      }, 'GET').then((res) => {  // 使用ajax函数
        if (res.messageCode = 'MSG_1001') {
          res.data.content.goodsResult.items.forEach((v, i) => {
            v.truePrice = parseFloat((v.dctPrice - v.marketingCashBack.totalAmount).toFixed(2))
          })
          that.setData({
            goodsResult: res.data.content.goodsResult.items,
            // storeResult: res.data.content.storeResult.items
          }) 
          // if (res.data.content.goodsResult.items.length !== 0 && res.data.content.storeResult.items.length !==0){
          //   that.setData({
          //     goodsResult: res.data.content.goodsResult.items.slice(0, 5),
          //     storeResult: res.data.content.storeResult.items.slice(0, 5)
          //   }) 
          // }else{
          //   that.setData({
          //     goodsResult: res.data.content.goodsResult.items,
          //     storeResult: res.data.content.storeResult.items
          //   })
          // }         
        }
      })  
    }
  },
  confirmTap:function(e){
    var that = this
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
        history: title,
        inputValue: value,
        textToast: ''
      })
      wx.setStorageSync("search", that.data.history.slice(0, 30))
      that.setData({
        template: 2
      })
      that.data.pageNumber == 1
      app.Util.ajax('mall/home/_search', {
        keyword: value,
        scope: 4,
        pageNumber: that.data.pageNumber,
        pageSize: that.data.pageSize
      }, 'GET').then((res) => {  // 使用ajax函数
        if (res.messageCode = 'MSG_1001') {
          res.data.content.goodsResult.items.forEach((v, i) => {
            v.truePrice = parseFloat((v.dctPrice - v.marketingCashBack.totalAmount).toFixed(2))
          })
          that.setData({
            goodsResult: res.data.content.goodsResult.items,
            // storeResult: res.data.content.storeResult.items
          })
          // if (res.data.content.goodsResult.items.length !== 0 && res.data.content.storeResult.items.length !==0){
          //   that.setData({
          //     goodsResult: res.data.content.goodsResult.items.slice(0, 5),
          //     storeResult: res.data.content.storeResult.items.slice(0, 5)
          //   }) 
          // }else{
          //   that.setData({
          //     goodsResult: res.data.content.goodsResult.items,
          //     storeResult: res.data.content.storeResult.items
          //   })
          // }         
        }
      })
    }
  },
  //点击搜索历史
  searchClick:function(e){
    var that = this
    const text = e.target.dataset.item
    that.setData({
      template: 2,
      show: true,
      inputValue: text
    })
    app.Util.ajax('mall/home/_search', {
      keyword: that.data.inputValue,
      scope: 4,
      pageNumber: that.data.pageNumber,
      pageSize: that.data.pageSize
    }, 'GET').then((res) => {  // 使用ajax函数
      if (res.messageCode = 'MSG_1001') {
        res.data.content.goodsResult.items.forEach((v, i) => {
          v.truePrice = parseFloat((v.dctPrice - v.marketingCashBack.totalAmount).toFixed(2))
        })
        that.setData({
          goodsResult: res.data.content.goodsResult.items,
          // storeResult: res.data.content.storeResult.items
        }) 
        // if (res.data.content.goodsResult.items.length !== 0 && res.data.content.storeResult.items.length !== 0) {
        //   res.data.content.goodsResult.items = res.data.content.goodsResult.items.slice(0, 5)
        //   res.data.content.storeResult.items = res.data.content.storeResult.items.slice(0, 5)
        //   that.setData({
        //     goodsResult: res.data.content.goodsResult.items,
        //     storeResult: res.data.content.storeResult.items
        //   })
        // } else {
        //   that.setData({
        //     goodsResult: res.data.content.goodsResult.items,
        //     storeResult: res.data.content.storeResult.items
        //   })
        // }       
      }
    })  
  },
  //加载更多
  getMore: function () {
    var that = this
    var pageNumber = that.data.pageNumber + 1
    // //品质优选
    app.Util.ajax('mall/home/_search', {
      keyword: that.data.inputValue,
      scope: 4,
      pageNumber: that.data.pageNumber,
      pageSize: that.data.pageSize
    }, 'GET').then((res) => { // 使用ajax函数
      if (res.messageCode = 'MSG_1001') {
        if (res.data.content.goodsResult.items == '' && that.data.goodsResult !== '') {
          that.setData({
            textToast: '已经到底啦'
          })
        }
        var arr = that.data.goodsResult
        res.data.content.goodsResult.items.forEach((v, i) => {
          v.truePrice = parseFloat((v.dctPrice - v.marketingCashBack.totalAmount).toFixed(2))
        })
        for (var i = 0; i < res.data.content.goodsResult.items.length; i++) {
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
    var that = this;
    that.setData({
      pageNumber:1,
      show: false,
      template: 1,
      inputValue: '',
      textToast:''
    })
  },
  bindInput: function(e) {
    var that = this;
    var value = e.detail.value
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
   /**
   * 清空
   */
  detele:function(){
    var that = this
    wx.removeStorage({
      key: 'search',
      success: function(res) {
        that.setData({
          history:[]
        })
      },
    })
    wx.showToast({
      title: '历史记录已删除',
      icon: 'none',
      duration: 2000
    })
  },
  /**
   * 查看更多
   */
  seeMoreGoods: function() {
    var that = this;
    var text = that.data.inputValue
    wx.navigateTo({
      url: `/pages/search/goods/goods?keyword=${text}`,
    })
  },
  seeMoreShops: function() {
    var that = this;
    var text = that.data.inputValue
    wx.navigateTo({
      url: `/pages/search/shops/shops?keyword=${text}`,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    that.setData({
      history: wx.getStorageSync('search') || [],
    })
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
  //  that.setData({
  //    pageNumber:1
  //  })
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
    var that = this
    if (that.data.goodsResult.length > 5 && that.data.storeResult.length===0){
      that.getMore()
    }
  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function (ops) {
    
  // }
})