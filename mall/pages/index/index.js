//index.js
//获取应用实例
const app = getApp()
var utils = require('../../utils/util.js');
Page({
  data: {
    showDialog: false, //获取头像昵称弹框
    showReceived: false, //首页叮咚弹窗
    autoplay: true,
    circular: true,
    interval: 2000,
    duration: 1000,
    navData: [], //导航栏
    currentTab: 0,
    navScrollLeft: 0,
    imgUrls: [], //爆品下的轮播图
    wholeNation: [], //0元购好物
    totalAmount: '', //0元购好物返总件数
    goods: [], //超值一口价
    trend: [], //口碑爆品榜
    list: [], //销量排行榜
    classfy: [], //二级分类下轮播图下的分类
    pageNumber: 1, //分页记录数
    pageSize: 20, //分页大小
    id: 1, //导航栏id
    text: '', //爆品底部提示
    text1: '', //其他底部提示
    imageUrl: [], //二级分类下的轮播图
    comprehensive: [], //二级分类下的商品
    count: null, //购物车数量
    i: 1,
    bannerId: 1, //0元购bannerid
    bannerUrl: '', //0元购banner图片
    color: "#FF8D12",
    color1: "black",
    color2: "black",
    pricePhoto: '../../assets/images/icon/fenlei_tuijian_pinzhi_title_updown.png',
    pricePhoto1: '../../assets/images/icon/fenlei_tuijian_pinzhi_title_updown.png',
    options: {},
    shareMessage: {} //叮咚信息
  },
  //事件处理函数
  onLoad: function(options) {
    var that = this;
    that.setData({
      options: options
    })
    var flag = app.globalData.flag
    if (!flag) {
      that.setData({
        showDialog: false
      })
    } else {
      that.setData({
        showDialog: true
      })
    }
    //别人通过链接
    if (options.inviterCode) {
      wx.setStorageSync('othersInviterCode', options.inviterCode)
    }
    //查询购物车种类数量
    that.getCartCount();
    //一级分类（导航栏）
    that.navigationBar();
    //爆品轮播图
    that.explosivesSwiper();
    //查询0元购banner图信息
    that.zeroPurchase();
    //查询0元购活动页
    that.zeroPurchaseMessage();
    //0元购好物
    that.zeroPurchaseGoods();
    //超值一口价
    that.overvaluedPrice();
    //口碑爆品榜
    that.publicPraise();
    //销量排行榜
    that.initgetMore1();
    //获取分享提示信息
    var token = wx.getStorageSync('token')
    if (token) {
      if (app.globalData.share == 0) {
        that.getShareMessage();
      }
    }
  },
  //获取分享提示信息
  getShareMessage: function() {
    var that = this
    app.Util.ajax('mall/home/hint/share', {
      source: 2
    }, 'GET').then((res) => {
      if (res.data.messageCode = 'MSG_1001') {
        if (res.data.content.hint == 2) {
          that.setData({
            showReceived: false
          })
        } else if (res.data.content.hint == 1) {
          that.setData({
            showReceived: true,
            shareMessage: res.data.content
          })
        }
      }
    })
  },
  //点击立即去进去公众号0元购页面
  go_zeroActivity: function() {
    var that = this
    wx.navigateTo({
      url: '/pages/zeroPurchaseActivity/zeroPurchaseActivity',
    })
    that.setData({
      showReceived: false
    })
    app.globalData.share = 1
  },
  //点击立即去进去0元购列表页面
  go_zeroBuy: function() {
    var that = this
    wx.navigateTo({
      url: '/pages/zeroBuy/zeroBuy',
    })
    that.setData({
      showReceived: false
    })
    app.globalData.share = 1
  },
  //导航栏
  navigationBar: function() {
    var that = this
    app.Util.ajax('mall/home/categories', 'GET').then((res) => {
      if (res.data.messageCode = 'MSG_1001') {
        that.setData({
          navData: res.data.content
        })
      }
    })
  },
  //爆品轮播图
  explosivesSwiper: function() {
    var that = this
    app.Util.ajax('mall/home/slideShow?slideShowCategory=1', 'GET').then((res) => { // 使用ajax函数
      if (res.data.messageCode = 'MSG_1001') {
        that.setData({
          imgUrls: res.data.content
        })
      }
    })
  },
  //查询0元购入口图片
  zeroPurchase: function() {
    var that = this
    app.Util.ajax('mall/home/activity/freeShopping/entry', 'GET').then((res) => { // 使用ajax函数
      if (res.data.content) {
        that.setData({
          bannerUrl: res.data.content.bannerUrl
        })
      } else {
        that.setData({
          bannerUrl: null
        })
      }
    })
  },
  //查询0元购活动页
  zeroPurchaseMessage: function() {
    var that = this
    app.Util.ajax(`mall/home/activity/freeShopping?mode=${1}`, null, 'GET').then((res) => { // 使用ajax函数
      if (res.data.messageCode = 'MSG_1001') {
        that.setData({
          bannerId: res.data.content ? res.data.content.id : ''
        })
      }
    })
  },
  //0元购好物
  zeroPurchaseGoods: function() {
    var that = this
    app.Util.ajax('mall/home/cashBack', {
      statistic: 1,
      pageNumber: that.data.pageNumber,
      pageSize: 6
    }, 'GET').then((res) => { // 使用ajax函数
      if (res.data.messageCode = 'MSG_1001') {
        res.data.content.items.forEach((v, i) => {
          v.truePrice = parseFloat((v.dctPrice - v.marketingCashBack.totalAmount).toFixed(2))
        })
        that.setData({
          wholeNation: res.data.content.items,
          totalAmount: res.data.content.totalAmount
        })
      }
    })
  },
  //超值一口价
  overvaluedPrice: function() {
    var that = this
    app.Util.ajax('mall/home/lowPrice', 'GET').then((res) => { // 使用ajax函数
      if (res.data.messageCode = 'MSG_1001') {
        res.data.content.forEach((v,i)=>{
          v.cashBackPrice = (v.dctPrice - v.marketingCashBack.totalAmount).toFixed(2)
        })
        that.setData({
          goods: res.data.content
        })
      }
    })
  },
  //口碑爆品榜
  publicPraise: function() {
    var that = this
    app.Util.ajax('mall/home/topSales', 'GET').then((res) => { // 使用ajax函数
      if (res.data.messageCode = 'MSG_1001') {
        that.setData({
          trend: res.data.content
        })
      }
    })
  },
  //销量排行榜
  initgetMore1: function() {
    var that = this
    var pageNumber = that.data.pageNumber
    //品质优选
    app.Util.ajax('mall/home/bestChoice', {
      pageNumber: pageNumber,
      pageSize: that.data.pageSize
    }, 'GET').then((res) => { // 使用ajax函数
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
  //加载更多销量排行榜
  getMore1: function() {
    var that = this
    var pageNumber = that.data.pageNumber + 1
    app.Util.ajax('mall/home/bestChoice', {
      pageNumber: pageNumber,
      pageSize: that.data.pageSize
    }, 'GET').then((res) => { // 使用ajax函数
      if (res.data.messageCode = 'MSG_1001') {
        if (res.data.content.items == '' && that.data.list !== '') {
          that.setData({
            text: '已经到底啦'
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
  //查询购物车种类数量
  getCartCount: function() {
    var that = this
    app.Util.ajax('mall/cart/count', 'GET').then((res) => { // 使用ajax函数
      if (res.data.messageCode = 'MSG_1001') {
        let a = res.data.content
        that.setData({
          count: a > 99 ? '99+' : res.data.content
        })
      }
    })
  },
  //综合
  comprehensive: function() {
    var that = this
    var id = that.data.id
    that.setData({
      pageNumber: 1
    })
    app.Util.ajax('mall/home/goods', {
      categoryId: id,
      sortBy: 1,
      pageNumber: that.data.pageNumber,
      pageSize: that.data.pageSize
    }, 'GET').then((res) => { // 使用ajax函数
      if (res.data.messageCode = 'MSG_1001') {
        res.data.content.items.forEach((v, i) => {
          v.truePrice = parseFloat((v.dctPrice - v.marketingCashBack.totalAmount).toFixed(2))
        })
        that.setData({
          comprehensive: res.data.content.items,
          color: "#FF8D12",
          color1: "black",
          color2: "black",
          pricePhoto: '../../assets/images/icon/fenlei_tuijian_pinzhi_title_updown.png',
          pricePhoto1: '../../assets/images/icon/fenlei_tuijian_pinzhi_title_updown.png'
        })
      }
    })
  },
  //升序降序
  toPrice: function() {
    var that = this
    var id = that.data.id
    that.setData({
      i: that.data.i + 1,
      pageNumber: 1,
      comprehensive: []
    })
    if (that.data.i % 2 === 0) {
      app.Util.ajax('mall/home/goods', {
        categoryId: id,
        sortBy: 2,
        sortFlag: 2,
        pageNumber: that.data.pageNumber,
        pageSize: that.data.pageSize
      }, 'GET').then((res) => { // 使用ajax函数
        if (res.data.messageCode = 'MSG_1001') {
          res.data.content.items.forEach((v, i) => {
            v.truePrice = parseFloat((v.dctPrice - v.marketingCashBack.totalAmount).toFixed(2))
          })
          that.setData({
            comprehensive: res.data.content.items,
            color: "black",
            color1: "#FF8D12",
            color2: "black",
            pricePhoto: '../../assets/images/icon/fenlei_tuijian_pinzhi_title_down.png',
            pricePhoto1: '../../assets/images/icon/fenlei_tuijian_pinzhi_title_updown.png',
          })
        }
      })
    } else if (that.data.i % 2 !== 0) {
      app.Util.ajax('mall/home/goods', {
        categoryId: id,
        sortBy: 2,
        sortFlag: 1,
        pageNumber: that.data.pageNumber,
        pageSize: that.data.pageSize
      }, 'GET').then((res) => { // 使用ajax函数
        if (res.data.messageCode = 'MSG_1001') {
          res.data.content.items.forEach((v, i) => {
            v.truePrice = parseFloat((v.dctPrice - v.marketingCashBack.totalAmount).toFixed(2))
          })
          that.setData({
            comprehensive: res.data.content.items,
            color: "black",
            color1: "#FF8D12",
            color2: "black",
            pricePhoto: '../../assets/images/icon/fenlei_tuijian_pinzhi_title_up.png',
            pricePhoto1: '../../assets/images/icon/fenlei_tuijian_pinzhi_title_updown.png',

          })
        }
      })
    }
  },
  //上新
  newGoods: function() {
    var that = this
    var id = that.data.id
    that.setData({
      i: that.data.i + 1,
      pageNumber: 1
    })
    if (that.data.i % 2 === 0) {
      app.Util.ajax('mall/home/goods', {
        categoryId: id,
        sortBy: 3,
        sortFlag: 1,
        pageNumber: that.data.pageNumber,
        pageSize: that.data.pageSize
      }, 'GET').then((res) => { // 使用ajax函数
        if (res.data.messageCode = 'MSG_1001') {
          res.data.content.items.forEach((v, i) => {
            v.truePrice = parseFloat((v.dctPrice - v.marketingCashBack.totalAmount).toFixed(2))
          })
          that.setData({
            comprehensive: res.data.content.items,
            color: "black",
            color1: "black",
            color2: "#FF8D12",
            pricePhoto1: '../../assets/images/icon/fenlei_tuijian_pinzhi_title_up.png',
            pricePhoto: '../../assets/images/icon/fenlei_tuijian_pinzhi_title_updown.png'
          })
        }
      })
    } else if (that.data.i % 2 !== 0) {
      app.Util.ajax('mall/home/goods', {
        categoryId: id,
        sortBy: 3,
        sortFlag: 2,
        pageNumber: that.data.pageNumber,
        pageSize: that.data.pageSize
      }, 'GET').then((res) => { // 使用ajax函数
        if (res.data.messageCode = 'MSG_1001') {
          res.data.content.items.forEach((v, i) => {
            v.truePrice = parseFloat((v.dctPrice - v.marketingCashBack.totalAmount).toFixed(2))
          })
          that.setData({
            comprehensive: res.data.content.items,
            color: "black",
            color1: "black",
            color2: "#FF8D12",
            pricePhoto1: '../../assets/images/icon/fenlei_tuijian_pinzhi_title_down.png',
            pricePhoto: '../../assets/images/icon/fenlei_tuijian_pinzhi_title_updown.png'
          })
        }
      })
    }
  },
  //跳转到搜索页面
  focus: function(e) {
    app.nav(e)
  },
  //首页跳转到详情页
  jumpDetail: function(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/detail/detail?id=${id}`,
    })
  },
  //跳转到0元购公众号
  toZeroPurchase: function() {
    const that = this
    wx.navigateTo({
      url: "/pages/zeroBuy/zeroBuy",
    })
  },
  //跳转到0元购好物
  jumpReturn: function(e) {
    app.nav(e)
  },
  //跳转到购物车
  toCart: function(e) {
    let token = wx.getStorageSync('token')
    if (token) {
      app.nav(e)
    } else {
      wx.navigateTo({
        url: '/pages/invitationCode/invitationCode',
      })
    }
  },
  //跳转到详情页
  toDetail: function(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/detail/detail?id=${id}`,
    })
  },
  //跳转到二级列表页面
  twoList: function(e) {
    var id = e.currentTarget.dataset.id //当前点击的id 
    var name = e.currentTarget.dataset.name //当前点击的名字
    wx.navigateTo({
      url: `/pages/index/twolist/twolist?id=${id}&name=${name}`,
    })
  },  　　　　　
  switchNav(e) {
    var that = this
    var cur = e.currentTarget.dataset.current; //导航栏数组的index
    var id = e.currentTarget.dataset.id; //导航栏数组的id                
    that.setData({
      id: id,
      pageNumber: 1,
      navScrollLeft: (cur - 3) * 80
    })
    if (that.data.currentTab == cur) {
      return false;
    } else {
      that.setData({
        currentTab: cur
      })
    }
    if (that.data.currentTab == 0) {
      that.onLoad(that.data.options)
    }
    //二级分类（轮播图下面的）
    if (that.data.currentTab === cur) {
      app.Util.ajax('mall/home/categories', {
        parentId: id
      }, 'GET').then((res) => {
        if (res.data.messageCode = 'MSG_1001') {
          that.setData({
            classfy: res.data.content
          })
        }
      })
      //二级分类轮播图
      app.Util.ajax('mall/home/slideShow', {
        slideShowCategory: 2,
        goodsCategoryId: id
      }, 'GET').then((res) => {
        if (res.data.messageCode = 'MSG_1001') {
          that.setData({
            imageUrl: res.data.content
          })
        }
      })
      that.setData({
        comprehensive: [],
        pageNumber: 1
      })
      that.initgetMore2();
      that.comprehensive();
    }
  },
  //爆品之外的分类
  initgetMore2: function() {
    var that = this
    var id = that.data.id
    var pageNumber = that.data.pageNumber
    app.Util.ajax('mall/home/goods', {
      categoryId: id,
      sortBy: 1,
      pageNumber: pageNumber,
      pageSize: that.data.pageSize
    }, 'GET').then((res) => { // 使用ajax函数
      if (res.data.messageCode = 'MSG_1001') {
        res.data.content.items.forEach((v, i) => {
          v.truePrice = parseFloat((v.dctPrice - v.marketingCashBack.totalAmount).toFixed(2))
        })
        that.setData({
          comprehensive: res.data.content.items
        })
      }
    })
  },
  //爆品之外的分类加载更多
  getMore2: function() {
    var that = this
    var id = that.data.id
    var pageNumber = that.data.pageNumber + 1
    app.Util.ajax('mall/home/goods', {
      categoryId: id,
      sortBy: 1,
      pageNumber: pageNumber,
      pageSize: that.data.pageSize
    }, 'GET').then((res) => { // 使用ajax函数
      if (res.data.messageCode = 'MSG_1001') {
        if (res.data.content.items == '' && that.data.comprehensive !== '') {
          that.setData({
            text1: '已经到底啦'
          })
        }
        var arr = that.data.comprehensive
        res.data.content.items.forEach((v, i) => {
          v.truePrice = parseFloat((v.dctPrice - v.marketingCashBack.totalAmount).toFixed(2))
          arr.push(res.data.content.items[i])
        })
        that.setData({
          comprehensive: arr,
          pageNumber: pageNumber
        })
      }
    })
  },
  //允许授权
  bindGetUserInfo: function(e) {
    var that = this
    if (e.detail.errMsg == 'getUserInfo:ok') {
      app.globalData.flag = false
      wx.setStorageSync("userInfo", e.detail.userInfo)
      that.setData({
        showDialog: false
      })
      // 发送个人资料给后台
      var userInfo = e.detail.userInfo
      app.Util.ajax('mall/personal/queryBaseData', null, 'POST').then((res) => { // 使用ajax函数
        if (res.messageCode = 'MSG_1001') {
          if (!res.data.content.nickname) {
            console.log('需要发送个人资料给后台')
            wx.downloadFile({
              url: userInfo.avatarUrl,
              success(res) {
                if (res.statusCode === 200) {
                  wx.uploadFile({
                    url: 'https://xuncaoji.yzsaas.cn/mall/personal/modifyBaseData', //测试环境
                    // url: 'https://xuncj.yzsaas.cn/mall/personal/modifyBaseData', //正式环境
                    filePath: res.tempFilePath,
                    name: 'avatarKey',
                    formData: {
                      nickname: userInfo.nickName,
                      gender: userInfo.gender == 0 ? 2 : userInfo.gender,
                    },
                    header: {
                      'token': wx.getStorageSync('token'),
                      "content-type": "multipart/form-data"
                    },
                    success: function(res) {
                      console.log(res)
                      console.log('发送成功')
                    },
                    fail: function(res) {
                      console.log(res)
                    }
                  })
                }
              }
            })
          }
        }
      })
    } else if (e.detail.errMsg == 'getUserInfo:fail auth deny') {
      app.globalData.flag = false
      that.setData({
        showDialog: false
      })
    }
    //跳转到授权页面之前的页面
    wx.getStorage({
      key: 'url',
      success(res) {
        wx.navigateTo({
          url: '/' + res.data
        })
        wx.removeStorage({key: 'url'})
      }
    })
  },
  reject: function() {
    var that = this
    app.globalData.flag = false
    that.setData({
      showDialog: false
    })
    //跳转到授权页面之前的页面
    wx.getStorage({
      key: 'url',
      success(res) {
        wx.navigateTo({
          url: '/' + res.data
        })
        wx.removeStorage({ key: 'url' })
      }
    })
  },
  　　　
  onShow: function() {
    var that = this;
    var flag = app.globalData.flag
    if (!flag) {
      that.setData({
        showDialog: false
      })
    } else {
      that.setData({
        showDialog: true
      })
    }
    //查询购物车种类
    that.getCartCount();
  },
  //爆品轮播图跳转
  jumpping: function(e) {
    var that = this
    var id = e.currentTarget.dataset.id
    var forwarddest = e.currentTarget.dataset.forwarddest
    var name = e.currentTarget.dataset.name
    if (forwarddest === 1) {
      wx.navigateTo({
        url: `/pages/detail/detail?id=${id}`,
      })
    } else if (forwarddest === 2) {
      that.setData({
        currentTab: id
      })
      //二级分类（轮播图下面的）
      app.Util.ajax('mall/home/categories', {
        parentId: id
      }, 'GET').then((res) => { // 使用ajax函数
        if (res.data.messageCode = 'MSG_1001') {
          that.setData({
            classfy: res.data.content
          })
        }
      })
      //二级分类轮播图
      app.Util.ajax('mall/home/slideShow', {
        slideShowCategory: 2,
        goodsCategoryId: id
      }, 'GET').then((res) => { // 使用ajax函数
        if (res.data.messageCode = 'MSG_1001') {
          that.setData({
            imageUrl: res.data.content
          })
        }
      })
      that.setData({
        comprehensive: [],
        pageNumber: 1
      })
      that.initgetMore2();
      //综合排序
      app.Util.ajax('mall/home/goods', {
        categoryId: id,
        sortBy: 1,
        pageNumber: that.data.pageNumber,
        pageSize: that.data.pageSize
      }, 'GET').then((res) => { // 使用ajax函数
        if (res.data.messageCode = 'MSG_1001') {
          that.setData({
            comprehensive: res.data.content.items,
            color: "#FF8D12",
            color1: "black",
            color2: "black",
            pricePhoto: '../../assets/images/icon/fenlei_tuijian_pinzhi_title_updown.png',
            pricePhoto1: '../../assets/images/icon/fenlei_tuijian_pinzhi_title_updown.png'
          })
        }
      })
      wx.switchTab({
        url: '/pages/index/index',
      })
    } else if (forwarddest === 3) {
      wx.navigateTo({
        url: `/pages/index/twolist/twolist?id=${id}&name=${name}`,
      })
    } else if (forwarddest === 4) {
      wx.switchTab({
        url: '/pages/member/member',
      })
    } else if (forwarddest === 7) {
      wx.navigateTo({
        url: '/pages/mine/recharge/recharge',
      })
    } else if (forwarddest === 8) {
      // wx.navigateTo({
      //   url: '/pages/merchantEntry/merchantEntry',
      // })
    }
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(ops) {
    return {
      path: "/pages/index/index?inviterCode=" + wx.getStorageSync('inviterCode'),
    }
  },
  onLaunch: function() {

  },
  //监听页面隐藏
  onHide: function() {
    // 隐藏弹框
    this.setData({
      showReceived: false
    })
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    var that = this
    if (that.data.currentTab == 0) {
      that.getMore1()
    } else {
      that.getMore2()
    }
  },
  //下拉刷新
  onPullDownRefresh: function() {
    var that = this
    that.onLoad(that.data.options)
    wx.stopPullDownRefresh() //停止下拉刷新
  },
})