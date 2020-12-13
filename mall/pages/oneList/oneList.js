// pages/oneList/oneList.js
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tempId: '',
    brandShow: false,
    fixed: 1,
    list: {},
    color: "#FF2644",
    color1: "black",
    color2: "black",
    id: 1,
    i: 1,
    pageI: 1,
    textToast: '',
    pageNumber: 1, //分页记录数
    pageSize: 20, //分页大小
    titleName: '', //标题
    pricePhoto: app.Util.getUrlImg().hostUrl+'/twoSix/greyUp.png',
    pricePhoto1: app.Util.getUrlImg().hostUrl+'/twoSix/greyDown.png',
    pricePhoto2: app.Util.getUrlImg().hostUrl+'/twoSix/greyUp.png',
    pricePhoto3: app.Util.getUrlImg().hostUrl+'/twoSix/greyDown.png',
    name: '',
    imageUrl: null,
    classfy: null,
    heightTop: 0,
    hostUrl: app.Util.getUrlImg().hostUrl,
  },
 
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    that.data.titleName = decodeURIComponent(options.name);  
    wx.setNavigationBarTitle({
      title: decodeURIComponent(options.name)
    });
    that.setData({
      id: parseInt(options.id),
      name: options.name,
      type: options.type ? parseInt(options.type):1,
      iconurl: options.iconurl == 'null' ? null : options.iconurl + '?' + wx.getStorageSync('posterimage')
    })
    that.initgetMore();
    //带上邀请码去登陆
    if(options.inviterCode){
      wx.setStorageSync("othersInviterCode",options.inviterCode)
    }
    let wHeight = wx.getSystemInfoSync().windowHeight
    if (wHeight > 555) {
      that.setData({
        options: options,
        wHeight: 550
      })
    } else {
      that.setData({
        options: options,
        wHeight: 470
      })
    }
  },
  //初始化加载
  initgetMore: function() {
    var that = this
    var id = that.data.id
    that.setData({
      sortBy: 1
    })
    if (that.data.tempId == '') {
      var data = {
        sortBy: that.data.sortBy,
        categoryId: id,
        pageNumber: that.data.pageNumber,
        pageSize: that.data.pageSize,
        type:that.data.type
      }
    } else {
      var data = {
        sortBy: that.data.sortBy,
        categoryId: id,
        brandIds: that.data.tempId,
        pageNumber: that.data.pageNumber,
        pageSize: that.data.pageSize
      }
    }
    app.Util.ajax('mall/home/goods', data, 'GET').then((res) => { // 使用ajax函数
      if (res.messageCode = 'MSG_1001') {
        res.data.content.items.forEach((v, i) => {
          v.truePrice = parseFloat((v.dctPrice - v.marketingCashBack.totalAmount).toFixed(2))
        })
        that.setData({
          list: res.data.content.items
        })
        if(0<res.data.content.items.length&&res.data.content.items.length<=2){
          that.setData({
            textToast1: '已到底，去【寻商品】提交吧'
          })
        }
        that.getHeight1();
        if(that.data.type!==2){
          that.pinPai();
        }
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
          classfy: res.data.content.categoryResponse,
          heightTop: 30
        })
      } else {
        that.setData({
          heightTop: 0
        })
      }
    })
  },
  getHeight1() {
    let that = this;
    setTimeout(() => {
      wx.createSelectorQuery().selectAll('.brandtitle').boundingClientRect(function (rect) {
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
  pinPai: function () {
    var that = this
    app.Util.ajax('mall/home/categories', {
      parentId: that.data.id
    }, 'GET').then((res) => {
      if (res.data.messageCode = 'MSG_1001') {
        for (let i = 0; i < res.data.content.brandResponse.length; i++) {
          res.data.content.brandResponse[i].brandChoose = false
          res.data.content.brandResponse[i].border1 = '1rpx solid #aaa'
          res.data.content.brandResponse[i].attr = 1
        }
        that.setData({
          content11: res.data.content.brandResponse,
        })
      } 
    })    
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
  //加载更多
  getMore: function() {
    var that = this
    var id = that.data.id
    var pageNumber = that.data.pageNumber + 1
    if (that.data.sortBy == 1) {
      if (that.data.tempId == '') {
        var data = {
          sortBy: that.data.sortBy,
          categoryId: id,
          pageNumber: pageNumber,
          pageSize: that.data.pageSize,
          type: that.data.type
        }
      } else {
        var data = {
          sortBy: that.data.sortBy,
          categoryId: id,
          brandIds: that.data.tempId,
          pageNumber: pageNumber,
          pageSize: that.data.pageSize
        }
      }
    } else if (that.data.sortBy == 2) {
      if (that.data.tempId == '') {
        var data = {
          categoryId: id,
          sortBy: that.data.sortBy,
          sortFlag: that.data.sortFlag,
          pageNumber: pageNumber,
          pageSize: that.data.pageSize,
          type: that.data.type
        }
      } else {
        var data = {
          categoryId: id,
          sortBy: that.data.sortBy,
          sortFlag: that.data.sortFlag,
          brandIds: that.data.tempId,
          pageNumber: pageNumber,
          pageSize: that.data.pageSize
        }
      }
    } else if (that.data.sortBy == 3) {
      if (that.data.tempId == '') {
        var data = {
          categoryId: id,
          sortBy: that.data.sortBy,
          sortFlag: that.data.sortFlag,
          pageNumber: pageNumber,
          pageSize: that.data.pageSize,
          type: that.data.type
        }
      } else {
        var data = {
          categoryId: id,
          sortBy: that.data.sortBy,
          sortFlag: that.data.sortFlag,
          brandIds: that.data.tempId,
          pageNumber: pageNumber,
          pageSize: that.data.pageSize
        }
      }
    }
    app.Util.ajax('mall/home/goods', data, 'GET').then((res) => { // 使用ajax函数
      if (res.messageCode = 'MSG_1001') {
        if (res.data.content.items == '' && that.data.list !== '') {
          that.setData({
            textToast: '已到底，去【寻商品】提交吧'
          })
        }
        var arr = that.data.list
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
  brand() {
    var that = this
    that.setData({
      brandShow: true
    })
  },
  cancelBrand() {
    var that = this
    that.setData({
      brandShow: false
    })
  },
  chooseBrand(e) {
    var that = this
    var index = e.currentTarget.dataset.index
    var type = e.currentTarget.dataset.type
    var id = e.currentTarget.dataset.id
    that.data.content11[index].attr++
    if (that.data.content11[index].attr % 2 == 0) {
      that.data.content11[index].brandChoose = true
      that.data.content11[index].border1 = '1rpx solid #fff'
    } else {
      that.data.content11[index].brandChoose = false
      that.data.content11[index].border1 = '1rpx solid #aaa'
    }
    that.setData({
      content11: that.data.content11,
    })
    var tempId = []
    that.data.content11.forEach((v, i) => {
      if (that.data.content11[i].brandChoose == true) {
        tempId.push(that.data.content11[i].id)
      }
    })
    that.setData({
      tempId: tempId.join(',')
    })
  },
  resetBrand() {
    var that = this
    that.data.content11.forEach((v, i) => {
      that.data.content11[i].brandChoose = false
      that.data.content11[i].border1 = '1rpx solid #aaa'
    })
    that.setData({
      content11: that.data.content11,
      tempId: ''
    })
  },
  sureBrand() {
    var that = this
    that.setData({
      pageI: that.data.pageI - 1,
      i: that.data.i - 1,
      pageNumber: 1
    })
    if (that.data.sortBy == 1) {
      that.setData({
        brandShow: false
      })
      that.comprehensive()
    } else if (that.data.sortBy == 2) {
      that.setData({
        brandShow: false
      })
      that.toPrice()
    } else if (that.data.sortBy == 3) {
      that.setData({
        brandShow: false
      })
      that.newGoods()
    }
  },
  //综合
  comprehensive: function () {
    var that = this
    var id = that.data.id
    that.setData({
      pageNumber: 1,
      sortBy: 1
    })
    if (that.data.tempId == '') {
      var data = {
        sortBy: that.data.sortBy,
        categoryId: id,
        pageNumber: that.data.pageNumber,
        pageSize: that.data.pageSize,
        type: that.data.type
      }
    } else {
      var data = {
        sortBy: that.data.sortBy,
        categoryId: id,
        brandIds: that.data.tempId,
        pageNumber: that.data.pageNumber,
        pageSize: that.data.pageSize
      }
    }
    app.Util.ajax('mall/home/goods', data, 'GET').then((res) => { // 使用ajax函数
      if (res.data.messageCode = 'MSG_1001') {
        res.data.content.items.forEach((v, i) => {
          v.truePrice = parseFloat((v.dctPrice - v.marketingCashBack.totalAmount).toFixed(2))
        })
        that.setData({
          list: res.data.content.items,
          color: "#FF2644",
          color1: "black",
          color2: "black",
          pricePhoto: app.Util.getUrlImg().hostUrl+'/twoSix/greyUp.png',
          pricePhoto1: app.Util.getUrlImg().hostUrl+'/twoSix/greyDown.png',
          pricePhoto2: app.Util.getUrlImg().hostUrl+'/twoSix/greyUp.png',
          pricePhoto3: app.Util.getUrlImg().hostUrl+'/twoSix/greyDown.png',
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
      pageI: that.data.pageI + 1,
      pageNumber: 1,
      sortBy: 2,
      list: []
    })
    if (that.data.pageI % 2 === 0) {
      that.setData({
        sortFlag: 2
      })
      if (that.data.tempId == '') {
        var data = {
          categoryId: id,
          sortBy: that.data.sortBy,
          sortFlag: that.data.sortFlag,
          pageNumber: that.data.pageNumber,
          pageSize: that.data.pageSize,
          type: that.data.type
        }
      } else {
        var data = {
          categoryId: id,
          sortBy: that.data.sortBy,
          sortFlag: that.data.sortFlag,
          brandIds: that.data.tempId,
          pageNumber: that.data.pageNumber,
          pageSize: that.data.pageSize
        }
      }
      app.Util.ajax('mall/home/goods', data, 'GET').then((res) => { // 使用ajax函数
        if (res.data.messageCode = 'MSG_1001') {
          res.data.content.items.forEach((v, i) => {
            v.truePrice = parseFloat((v.dctPrice - v.marketingCashBack.totalAmount).toFixed(2))
          })
          that.setData({
            list: res.data.content.items,
            color: "black",
            color1: "#FF2644",
            color2: "black",
            pricePhoto: app.Util.getUrlImg().hostUrl+'/twoSix/greyUp.png',
            pricePhoto1: app.Util.getUrlImg().hostUrl+'/twoSix/redDown.png',
            pricePhoto2: app.Util.getUrlImg().hostUrl+'/twoSix/greyUp.png',
            pricePhoto3: app.Util.getUrlImg().hostUrl+'/twoSix/greyDown.png',
          })
        } else {
          wx.showToast({
            title: res.data.message,
            icon: 'none'
          })
        }
      })
    } else if (that.data.pageI % 2 !== 0) {
      that.setData({
        sortFlag: 1
      })
      if (that.data.tempId == '') {
        var data = {
          categoryId: id,
          sortBy: that.data.sortBy,
          sortFlag: that.data.sortFlag,
          pageNumber: that.data.pageNumber,
          pageSize: that.data.pageSize,
          type: that.data.type
        }
      } else {
        var data = {
          categoryId: id,
          sortBy: that.data.sortBy,
          sortFlag: that.data.sortFlag,
          brandIds: that.data.tempId,
          pageNumber: that.data.pageNumber,
          pageSize: that.data.pageSize
        }
      }
      app.Util.ajax('mall/home/goods', data, 'GET').then((res) => { // 使用ajax函数
        if (res.data.messageCode = 'MSG_1001') {
          res.data.content.items.forEach((v, i) => {
            v.truePrice = parseFloat((v.dctPrice - v.marketingCashBack.totalAmount).toFixed(2))
          })
          that.setData({
            list: res.data.content.items,
            color: "black",
            color1: "#FF2644",
            color2: "black",
            pricePhoto: app.Util.getUrlImg().hostUrl+'/twoSix/redUp.png',
            pricePhoto1: app.Util.getUrlImg().hostUrl+'/twoSix/greyDown.png',
            pricePhoto2: app.Util.getUrlImg().hostUrl+'/twoSix/greyUp.png',
            pricePhoto3: app.Util.getUrlImg().hostUrl+'/twoSix/greyDown.png',
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
      pageNumber: 1,
      sortBy: 3
    })
    if (that.data.i % 2 === 0) {
      that.setData({
        sortFlag: 1
      })
      if (that.data.tempId == '') {
        var data = {
          categoryId: id,
          sortBy: that.data.sortBy,
          sortFlag: that.data.sortFlag,
          pageNumber: that.data.pageNumber,
          pageSize: that.data.pageSize,
          type: that.data.type
        }
      } else {
        var data = {
          categoryId: id,
          sortBy: that.data.sortBy,
          sortFlag: that.data.sortFlag,
          brandIds: that.data.tempId,
          pageNumber: that.data.pageNumber,
          pageSize: that.data.pageSize
        }
      }
      app.Util.ajax('mall/home/goods', data, 'GET').then((res) => { // 使用ajax函数
        if (res.data.messageCode = 'MSG_1001') {
          res.data.content.items.forEach((v, i) => {
            v.truePrice = parseFloat((v.dctPrice - v.marketingCashBack.totalAmount).toFixed(2))
          })
          that.setData({
            list: res.data.content.items,
            color: "black",
            color1: "black",
            color2: "#FF2644",
            pricePhoto: app.Util.getUrlImg().hostUrl+'/twoSix/greyUp.png',
            pricePhoto1: app.Util.getUrlImg().hostUrl+'/twoSix/greyDown.png',
            pricePhoto2: app.Util.getUrlImg().hostUrl+'/twoSix/redUp.png',
            pricePhoto3: app.Util.getUrlImg().hostUrl+'/twoSix/greyDown.png',
          })
        } else {
          wx.showToast({
            title: res.data.message,
            icon: 'none'
          })
        }
      })

    } else if (that.data.i % 2 !== 0) {
      that.setData({
        sortFlag: 2
      })
      if (that.data.tempId == '') {
        var data = {
          categoryId: id,
          sortBy: that.data.sortBy,
          sortFlag: that.data.sortFlag,
          pageNumber: that.data.pageNumber,
          pageSize: that.data.pageSize,
          type: that.data.type
        }
      } else {
        var data = {
          categoryId: id,
          sortBy: that.data.sortBy,
          sortFlag: that.data.sortFlag,
          brandIds: that.data.tempId,
          pageNumber: that.data.pageNumber,
          pageSize: that.data.pageSize
        }
      }
      app.Util.ajax('mall/home/goods', data, 'GET').then((res) => { // 使用ajax函数
        if (res.data.messageCode = 'MSG_1001') {
          res.data.content.items.forEach((v, i) => {
            v.truePrice = parseFloat((v.dctPrice - v.marketingCashBack.totalAmount).toFixed(2))
          })
          that.setData({
            list: res.data.content.items,
            color: "black",
            color1: "black",
            color2: "#FF2644",
            pricePhoto: app.Util.getUrlImg().hostUrl+'/twoSix/greyUp.png',
            pricePhoto1: app.Util.getUrlImg().hostUrl+'/twoSix/greyDown.png',
            pricePhoto2: app.Util.getUrlImg().hostUrl+'/twoSix/greyUp.png',
            pricePhoto3: app.Util.getUrlImg().hostUrl+'/twoSix/redDown.png',
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
  jumpping: function(e) {
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
  onReady: function() {
    wx.setNavigationBarTitle({
      title: this.data.titleName
    });
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
    wx.removeStorageSync('posterimage')
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
    that.getMore()
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(ops) {
    var that = this
    return {
      path: "/pages/oneList/oneList?inviterCode=" + wx.getStorageSync('inviterCode') + '&id=' + that.data.id + '&name=' + that.data.name,
    }
  },
})