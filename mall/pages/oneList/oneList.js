// pages/oneList/oneList.js
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    category: [],
    color: "#FF8D12",
    color1: "black",
    color2: "black",
    id: 1,
    i: 1,
    textToast: '',
    pageNumber: 1, //分页记录数
    pageSize: 20, //分页大小
    titleName: '',//标题
    pricePhoto: 'https://xuncj.yzsaas.cn/_download/img/icon/fenlei_tuijian_pinzhi_title_updown.png',
    pricePhoto1: 'https://xuncj.yzsaas.cn/_download/img/icon/fenlei_tuijian_pinzhi_title_updown.png',
    name: '',
    imageUrl:null,
    classfy:null,
    heightTop: 0,
  },
  //跳转到详情页
  toDetail: function (e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/detail/detail?id=${id}`,
    })
  },
  //跳转到二级列表页面
  twoList: function (e) {
    var id = e.currentTarget.dataset.id //当前点击的id 
    var name = e.currentTarget.dataset.name //当前点击的名字
    wx.navigateTo({
      url: `/pages/index/twolist/twolist?id=${id}&name=${name}`,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    this.data.titleName = decodeURIComponent(options.name);
    wx.setNavigationBarTitle({
      title: decodeURIComponent(options.name)
    });
    that.setData({
      id: options.id,
      name: options.name
    })
    that.initgetMore();
  },
  //初始化加载
  initgetMore: function () {
    var that = this
    var pageNumber = that.data.pageNumber
    app.Util.ajax('mall/home/goods', {
      categoryId: that.data.id, 
      sortBy: 1, 
      pageNumber: pageNumber,
      pageSize: that.data.pageSize
    }, 'GET').then((res) => { // 使用ajax函数
      if (res.messageCode = 'MSG_1001') {
        res.data.content.items.forEach((v, i) => {
          v.truePrice = parseFloat((v.dctPrice - v.marketingCashBack.totalAmount).toFixed(2))
        })
        that.setData({
          category: res.data.content.items
        })
      }
    })
    //一级分类轮播图
    app.Util.ajax('mall/home/slideShow', {
      slideShowCategory: 2,
      goodsCategoryId: that.data.id
    }, 'GET').then((res) => {
      if (res.data.messageCode = 'MSG_1001') {
        that.setData({
          imageUrl: res.data.content
        })
      }
    })
    //二级分类（轮播图下面的）
    app.Util.ajax('mall/home/categories', {
      parentId: that.data.id
    }, 'GET').then((res) => {
      if (res.data.messageCode == 'MSG_1001') {
        that.setData({
          classfy: res.data.content,
          heightTop: 30
        })
      } else {
        that.setData({
          heightTop: 0
        })
      }
    })
  },
  //加载更多
  getMore: function () {
    var that = this
    var pageNumber = that.data.pageNumber + 1
    app.Util.ajax('mall/home/goods', {
      categoryId: that.data.id, sortBy: 1, pageNumber: pageNumber,
      pageSize: that.data.pageSize
    }, 'GET').then((res) => { // 使用ajax函数
      if (res.messageCode = 'MSG_1001') {
        if (res.data.content.items == '' && that.data.category !== '') {
          that.setData({
            textToast: '已经到底啦'
          })
        }
        var arr = that.data.category
        res.data.content.items.forEach((v, i) => {
          v.truePrice = parseFloat((v.dctPrice - v.marketingCashBack.totalAmount).toFixed(2))
          arr.push(res.data.content.items[i])
        })
        that.setData({
          category: arr,
          pageNumber: pageNumber
        })
      }
    })
  },
  //综合
  comprehensive: function () {
    var that = this
    var id = that.data.id
    that.setData({
      pageNumber: 1
    })
    app.Util.ajax('mall/home/goods', {
      categoryId: id, sortBy: 1, pageNumber: that.data.pageNumber,
      pageSize: that.data.pageSize
    }, 'GET').then((res) => {  // 使用ajax函数
      if (res.messageCode = 'MSG_1001') {
        res.data.content.items.forEach((v, i) => {
          v.truePrice = parseFloat((v.dctPrice - v.marketingCashBack.totalAmount).toFixed(2))
        })
        that.setData({
          category: res.data.content.items,
          color: "#FF8D12",
          color1: "black",
          color2: "black",
          pricePhoto: 'https://xuncj.yzsaas.cn/_download/img/icon/fenlei_tuijian_pinzhi_title_updown.png',
          pricePhoto1: 'https://xuncj.yzsaas.cn/_download/img/icon/fenlei_tuijian_pinzhi_title_updown.png'
        })
      } else {
        wx.showToast({
          title: res.data.message,
          icon: 'none'
        })
      }
    })
  },
  //升序降序
  toPrice: function () {
    var that = this
    var id = that.data.id
    that.setData({
      i: that.data.i + 1,
      pageNumber: 1
    })
    if (that.data.i % 2 === 0) {
      app.Util.ajax('mall/home/goods', {
        categoryId: id, sortBy: 2, sortFlag: 2, pageNumber: that.data.pageNumber,
        pageSize: that.data.pageSize
      }, 'GET').then((res) => {  // 使用ajax函数
        if (res.messageCode = 'MSG_1001') {
          res.data.content.items.forEach((v, i) => {
            v.truePrice = parseFloat((v.dctPrice - v.marketingCashBack.totalAmount).toFixed(2))
          })
          that.setData({
            category: res.data.content.items,
            color: "black",
            color1: "#FF8D12",
            color2: "black",
            pricePhoto: 'https://xuncj.yzsaas.cn/_download/img/icon/fenlei_tuijian_pinzhi_title_down.png',
            pricePhoto1: 'https://xuncj.yzsaas.cn/_download/img/icon/fenlei_tuijian_pinzhi_title_updown.png',
          })
        } else {
          wx.showToast({
            title: res.data.message,
            icon: 'none'
          })
        }
      })
    } else if (that.data.i % 2 !== 0) {
      app.Util.ajax('mall/home/goods', {
        categoryId: id, sortBy: 2, sortFlag: 1, pageNumber: that.data.pageNumber,
        pageSize: that.data.pageSize
      }, 'GET').then((res) => {  // 使用ajax函数
        if (res.messageCode = 'MSG_1001') {
          res.data.content.items.forEach((v, i) => {
            v.truePrice = parseFloat((v.dctPrice - v.marketingCashBack.totalAmount).toFixed(2))
          })
          that.setData({
            category: res.data.content.items,
            color: "black",
            color1: "#FF8D12",
            color2: "black",
            pricePhoto: 'https://xuncj.yzsaas.cn/_download/img/icon/fenlei_tuijian_pinzhi_title_up.png',
            pricePhoto1: 'https://xuncj.yzsaas.cn/_download/img/icon/fenlei_tuijian_pinzhi_title_updown.png',
          })
        } else {
          wx.showToast({
            title: res.data.message,
            icon: 'none'
          })
        }
      })
    }
  },

  //上新
  newGoods: function () {
    var that = this
    var id = that.data.id
    that.setData({
      i: that.data.i + 1,
      pageNumber: 1
    })
    if (that.data.i % 2 === 0) {
      app.Util.ajax('mall/home/goods', {
        categoryId: id, sortBy: 3, sortFlag: 1, pageNumber: that.data.pageNumber,
        pageSize: that.data.pageSize
      }, 'GET').then((res) => {  // 使用ajax函数
        if (res.messageCode = 'MSG_1001') {
          res.data.content.items.forEach((v, i) => {
            v.truePrice = parseFloat((v.dctPrice - v.marketingCashBack.totalAmount).toFixed(2))
          })
          that.setData({
            category: res.data.content.items,
            color: "black",
            color1: "black",
            color2: "#FF8D12",
            pricePhoto1: 'https://xuncj.yzsaas.cn/_download/img/icon/fenlei_tuijian_pinzhi_title_up.png',
            pricePhoto: 'https://xuncj.yzsaas.cn/_download/img/icon/fenlei_tuijian_pinzhi_title_updown.png'
          })
        } else {
          wx.showToast({
            title: res.data.message,
            icon: 'none'
          })
        }
      })
    } else if (that.data.i % 2 !== 0) {
      app.Util.ajax('mall/home/goods', {
        categoryId: id, sortBy: 3, sortFlag: 2, pageNumber: that.data.pageNumber,
        pageSize: that.data.pageSize
      }, 'GET').then((res) => {  // 使用ajax函数
        if (res.messageCode = 'MSG_1001') {
          res.data.content.items.forEach((v, i) => {
            v.truePrice = parseFloat((v.dctPrice - v.marketingCashBack.totalAmount).toFixed(2))
          })
          that.setData({
            category: res.data.content.items,
            color: "black",
            color1: "black",
            color2: "#FF8D12",
            pricePhoto1: 'https://xuncj.yzsaas.cn/_download/img/icon/fenlei_tuijian_pinzhi_title_down.png',
            pricePhoto: 'https://xuncj.yzsaas.cn/_download/img/icon/fenlei_tuijian_pinzhi_title_updown.png'
          })
        } else {
          wx.showToast({
            title: res.data.message,
            icon: 'none'
          })
        }
      })
    }
  },
  jumpping: function (e) {
    var that = this
    var id = e.currentTarget.dataset.id
    var forwarddest = e.currentTarget.dataset.forwarddest
    var name = e.currentTarget.dataset.name
    if (forwarddest === 1) {
      wx.navigateTo({
        url: `/pages/detail/detail?id=${id}`,
      })
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.setNavigationBarTitle({
      title: this.data.titleName
    });
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
    that.getMore()
  },
  /**
 * 用户点击右上角分享
 */
  onShareAppMessage: function (ops) {
    var that = this
    return {
      path: "/pages/oneList/oneList?inviterCode=" + wx.getStorageSync('inviterCode') + '&id=' + that.data.id + '&name=' + that.data.name,
    }
  },
})