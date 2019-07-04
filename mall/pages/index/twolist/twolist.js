// pages/index/twolist/twolist.js
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    category:[],
    color: "#FF8D12",
    color1: "black",
    color2: "black",
    id:1,
    i: 1,
    textToast:'',
    pageNumber: 1, //分页记录数
    pageSize: 6, //分页大小
    total: 0, //分页总数
    hasmoreData: true, //更多数据
    hiddenloading: true, //加载中
    showModalStatus: false,//分享弹框
    shareList:{},//分享数据
    goodsId:1,
    sharingProfit: '',//分享返利
    titleName:'',//标题
    pricePhoto: '../../../assets/images/icon/fenlei_tuijian_pinzhi_title_updown.png',
    pricePhoto1: '../../../assets/images/icon/fenlei_tuijian_pinzhi_title_updown.png',
  },
  //跳转到详情页
  toDetail: function (e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/detail/detail?id=${id}`,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  //初始化加载
  initgetMore: function () {
    var that = this
    var pageNumber = that.data.pageNumber
    // //品质优选
    app.Util.ajax('mall/home/goods', {
      categoryId: that.data.id, sortBy: 1, pageNumber: pageNumber,
      pageSize: that.data.pageSize
    }, 'GET').then((res) => { // 使用ajax函数
      if (res.messageCode = 'MSG_1001') {
        that.setData({
          category: res.data.content.items
        })
      }
    })
  },
  //加载更多
  getMore: function () {
    var that = this
    var pageNumber = that.data.pageNumber+1
    // //品质优选
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
        for (var i = 0; i < res.data.content.items.length; i++) {
          arr.push(res.data.content.items[i])
        }
        that.setData({
          category: arr,
        })
        that.setData({
          pageNumber: pageNumber
        })
      }
    })
  },
  onLoad: function (options) {
    var that = this
    this.data.titleName = options.name;
    wx.setNavigationBarTitle({
      title: options.name
    });
    that.setData({
      id:options.id
    })
     // //品质优选
    that.initgetMore()
  },
  //综合
  comprehensive: function () {
    var that = this
    var id = that.data.id
    that.setData({
      pageNumber:1
    })
    app.Util.ajax('mall/home/goods', {
      categoryId: id, sortBy: 1, pageNumber: that.data.pageNumber,
      pageSize: that.data.pageSize }, 'GET').then((res) => {  // 使用ajax函数
      if (res.messageCode = 'MSG_1001') {
        that.setData({
          category: res.data.content.items,
          color: "#FF8D12",
          color1: "black",
          color2: "black",
          pricePhoto: '../../../assets/images/icon/fenlei_tuijian_pinzhi_title_updown.png',
          pricePhoto1: '../../../assets/images/icon/fenlei_tuijian_pinzhi_title_updown.png'
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
        categoryId: id, sortBy: 2, sortFlag: 1, pageNumber: that.data.pageNumber,
        pageSize: that.data.pageSize }, 'GET').then((res) => {  // 使用ajax函数
        if (res.messageCode = 'MSG_1001') {
          that.setData({
            category: res.data.content.items,
            color: "black",
            color1: "#FF8D12",
            color2: "black",
            pricePhoto: '../../../assets/images/icon/fenlei_tuijian_pinzhi_title_up.png',
            pricePhoto1: '../../../assets/images/icon/fenlei_tuijian_pinzhi_title_updown.png',
          })
        }
      })
    } else if (that.data.i % 2 !== 0) {
      app.Util.ajax('mall/home/goods', {
        categoryId: id, sortBy: 2, sortFlag: 2, pageNumber: that.data.pageNumber,
        pageSize: that.data.pageSize }, 'GET').then((res) => {  // 使用ajax函数
        if (res.messageCode = 'MSG_1001') {
          that.setData({
            category: res.data.content.items,
            color: "black",
            color1: "#FF8D12",
            color2: "black",
            pricePhoto: '../../../assets/images/icon/fenlei_tuijian_pinzhi_title_down.png'
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
        pageSize: that.data.pageSize }, 'GET').then((res) => {  // 使用ajax函数
        if (res.messageCode = 'MSG_1001') {
          that.setData({
            category: res.data.content.items,
            color: "black",
            color1: "black",
            color2: "#FF8D12",
            pricePhoto1: '../../../assets/images/icon/fenlei_tuijian_pinzhi_title_up.png',
            pricePhoto: '../../../assets/images/icon/fenlei_tuijian_pinzhi_title_updown.png'
          })
        }
      })
    } else if (that.data.i % 2 !== 0) {
      app.Util.ajax('mall/home/goods', {
        categoryId: id, sortBy: 3, sortFlag: 2, pageNumber: that.data.pageNumber,
        pageSize: that.data.pageSize }, 'GET').then((res) => {  // 使用ajax函数
        if (res.messageCode = 'MSG_1001') {
          that.setData({
            category: res.data.content.items,
            color: "black",
            color1: "black",
            color2: "#FF8D12",
            pricePhoto1: '../../../assets/images/icon/fenlei_tuijian_pinzhi_title_down.png',
            pricePhoto: '../../../assets/images/icon/fenlei_tuijian_pinzhi_title_updown.png'
          })
        }
      })
    }
  },
  //分享
  share: function (e) {
    var that = this
    var goodsId = e.currentTarget.dataset.goodsid
    var sharingProfit = e.currentTarget.dataset.profit
    that.setData({
      goodsId: goodsId,
      sharingProfit: sharingProfit
    })
    //分享数据
    that.chooseShare()

    that.setData({
      showModalStatus: true
    })
  },
  cancelShare: function () {
    var that = this
    that.setData({
      showModalStatus: false
    })
  },
  hideModal: function () {
    var that = this
    that.setData({
      showModalStatus: false
    })
  },
  //查询分享数据
  chooseShare: function () {
    var that = this
    app.Util.ajax('mall/weChat/sharing/target', { mode: 1, targetId: that.data.goodsId }, 'GET').then((res) => {
      if (res.messageCode = 'MSG_1001') {
        var inviterCode = wx.getStorageSync('inviterCode')
        if (inviterCode) {
          res.data.content.link = res.data.content.link.replace(/{inviterCode}/g, inviterCode)
        } else {
          res.data.content.link = res.data.content.link.replace(/{inviterCode}/g, '')
        }     
        that.setData({
          shareList: res.data.content
        })
      }
    })
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
    if (ops.from === 'button') {
      // 来自页面内转发按钮
      // 来自页面内转发按钮
      that.setData({
        showModalStatus: false
      })
      app.Util.ajax('mall/weChat/sharing/onSuccess', { mode: 1 }, 'POST').then((res) => {
        if (res.data.content) {
          wx.showToast({
            title: '分享成功',
            icon: 'none'
          })
        } else {
          wx.showToast({
            title: res.data.message,
            icon: 'none'
          })
        }
      })
    }
    return {
      title: that.data.shareList.title,
      path: that.data.shareList.link,
      imageUrl: that.data.shareList.imageUrl,
      success: function (res) {
      },
      fail: function (res) {
        // 转发失败
        console.log("转发失败:" + JSON.stringify(res));
      }
    }
  },
})