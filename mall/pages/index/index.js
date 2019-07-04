//index.js
//获取应用实例
const app = getApp()
var utils = require('../../utils/util.js');
Page({
  data: {
    showDialog: false,
    showModalStatus: false, //分享弹窗
    shareList: {}, //分享数据
    goodsId: 1, //分享用的商品id
    sharingProfit:'',//分享返利
    imgUrls: [], //轮播图
    imageUrl: [], //二级分类下的轮播图
    autoplay: true,
    circular: true,
    interval: 2000,
    duration: 1000,
    navData: [], //导航栏
    currentTab: 0,
    navScrollLeft: 0,
    goods: [], //性价比之王
    list: [], //销量排行榜
    classfy: [], //二级分类下轮播图下的分类
    pageNumber: 1, //分页记录数
    pageSize: 6, //分页大小
    total: 0, //分页总数
    hasmoreData: true, //更多数据
    hiddenloading: true, //加载中
    id: 1, //父级id
    text: '', //底部提示
    text1: '', //底部提示
    trend: [], //口碑爆品榜
    wholeNation: [], //全民返
    comprehensive: [], //二级分类下的商品
    totalAmount: 1, //全民返总件数
    count: '', //购物车
    i: 1,
    bannerId: 1, //0元购banner
    color: "#FF8D12",
    color1: "black",
    color2: "black",
    pricePhoto: '../../assets/images/icon/fenlei_tuijian_pinzhi_title_updown.png',
    pricePhoto1: '../../assets/images/icon/fenlei_tuijian_pinzhi_title_updown.png'
  },
  //分享
  share: function(e) {
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
  cancelShare: function() {
    var that = this
    that.setData({
      showModalStatus: false
    })
  },
  hideModal: function() {
    var that = this
    that.setData({
      showModalStatus: false
    })
  },
  // bindGetLocation: function() {
  //   this.setData({
  //     showDialog: false
  //   })
  //   wx.getLocation({
  //     type: 'wgs84',
  //     success(res) {
  //       const latitude = res.latitude
  //       const longitude = res.longitude
  //       const speed = res.speed
  //       const accuracy = res.accuracy
  //     }
  //   })
  // },
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
      if (res.messageCode = 'MSG_1001') {
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
        sortFlag: 1,
        pageNumber: that.data.pageNumber,
        pageSize: that.data.pageSize
      }, 'GET').then((res) => { // 使用ajax函数
        if (res.messageCode = 'MSG_1001') {
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
    } else if (that.data.i % 2 !== 0) {
      app.Util.ajax('mall/home/goods', {
        categoryId: id,
        sortBy: 2,
        sortFlag: 2,
        pageNumber: that.data.pageNumber,
        pageSize: that.data.pageSize
      }, 'GET').then((res) => { // 使用ajax函数
        if (res.messageCode = 'MSG_1001') {
          that.setData({
            comprehensive: res.data.content.items,
            color: "black",
            color1: "#FF8D12",
            color2: "black",
            pricePhoto: '../../assets/images/icon/fenlei_tuijian_pinzhi_title_down.png'
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
        if (res.messageCode = 'MSG_1001') {
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
        if (res.messageCode = 'MSG_1001') {
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
  //跳转到二级列表页面
  twoList: function(e) {
    var id = e.currentTarget.dataset.id//当前点击的id 
    var name = e.currentTarget.dataset.name//当前点击的id 
    // wx.navigateTo({
    //   url: '/pages/questionDetail/questionDetail?id=' + id + '&name=' + name
    // })
    wx.navigateTo({
      url: `/pages/index/twolist/twolist?id=${id}&name=${name}`,
    })
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
  //跳转到搜索页面
  focus: function(e) {
    app.nav(e)
  },
  //跳转到详情页
  toDetail: function(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/detail/detail?id=${id}`,
    })
  },
  //首页跳转到详情页
  jumpDetail: function(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/detail/detail?id=${id}`,
    })
  },
  //跳转到全民返
  jumpReturn: function(e) {
    app.nav(e)
  },
  //跳转到0元购详情页
  toZeroPurchase: function() {
    const that = this
    wx.navigateTo({
      url: "/pages/zeroPurchaseActivity/zeroPurchaseActivity",
    })
  },
  //事件处理函数
  onLoad: function(options) {
    wx.showShareMenu({
      withShareTicket: true
    })
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
    //查询商品数量
    app.Util.ajax('mall/cart/count', 'GET').then((res) => { // 使用ajax函数
      if (res.messageCode = 'MSG_1001') {
        let a = res.data.content
        that.setData({
          count: a > 99 ? '99+' : res.data.content
        })
      }
    })
    //一级分类（导航栏）
    app.Util.ajax('mall/home/categories', 'GET').then((res) => {
      if (res.messageCode = 'MSG_1001') {
        that.setData({
          navData: res.data.content
        })
      }
    })
    //爆品轮播图
    app.Util.ajax('mall/home/slideShow?slideShowCategory=1', 'GET').then((res) => { // 使用ajax函数
      if (res.messageCode = 'MSG_1001') {
        that.setData({
          imgUrls: res.data.content
        })
      }
    })
    //查询0元购活动页
    app.Util.ajax(`mall/home/activity/freeShopping?mode=${1}`, null, 'GET').then((res) => { // 使用ajax函数
      if (res.messageCode = 'MSG_1001') {
        that.setData({
          bannerId: res.data.content ? res.data.content.id : ''
        })
      }
    })
    //性价比之王
    app.Util.ajax('mall/home/lowPrice', 'GET').then((res) => { // 使用ajax函数
      if (res.messageCode = 'MSG_1001') {
        // console.log(res)
        that.setData({
          goods: res.data.content
        })
      }
    })
    //口碑爆品榜
    app.Util.ajax('mall/home/topSales', 'GET').then((res) => { // 使用ajax函数
      if (res.messageCode = 'MSG_1001') {
        // for (var i = 0; i < res.data.content.length; i++) {
        //   res.data.content[i].name = (res.data.content[i].name).slice(0, 6)
        // }
        that.setData({
          trend: res.data.content
        })
      }
    })
    //分期返专场
    app.Util.ajax('mall/home/cashBack', {
      statistic: 1,
      pageNumber: that.data.pageNumber,
      pageSize: that.data.pageSize
    }, 'GET').then((res) => { // 使用ajax函数
      if (res.messageCode = 'MSG_1001') {
        that.setData({
          wholeNation: res.data.content.items,
          totalAmount: res.data.content.totalAmount
        })
      }
    })
    //销量排行榜
    that.initgetMore1()
  },
  //加载更多
  getMore1: function() {
    var that = this
    var pageNumber = that.data.pageNumber + 1
    //销量排行榜
    app.Util.ajax('mall/home/bestChoice', {
      pageNumber: pageNumber,
      pageSize: that.data.pageSize
    }, 'GET').then((res) => { // 使用ajax函数
      if (res.messageCode = 'MSG_1001') {
        if (res.data.content.items == '' && that.data.list !== '') {
          that.setData({
            text: '已经到底啦'
          })
        }
        var arr = that.data.list
        for (var i = 0; i < res.data.content.items.length; i++) {
          arr.push(res.data.content.items[i])
        }
        that.setData({
          list: arr,
        })
        that.setData({
          pageNumber: pageNumber
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
      if (res.messageCode = 'MSG_1001') {
        that.setData({
          list: res.data.content.items
        })
      }
    })
  },
  　　　　　
  switchNav(e) {
    var that = this
    var cur = e.currentTarget.dataset.current;
    var id = e.currentTarget.dataset.id
    //每个tab选项宽度占1/5
    var singleNavWidth = that.data.windowWidth / 5;
    var pageNumber = that.data.pageNumber;
    //tab选项居中                            
    that.setData({
      navScrollLeft: (cur - 2) * singleNavWidth,
      id: id
    })
    if (that.data.currentTab == cur) {
      return false;
    } else {
      that.setData({
        currentTab: cur
      })
    }
    //二级分类（轮播图下面的）
    if (that.data.currentTab === cur) {
      app.Util.ajax('mall/home/categories', {
        parentId: id
      }, 'GET').then((res) => { // 使用ajax函数
        if (res.messageCode = 'MSG_1001') {
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
        if (res.messageCode = 'MSG_1001') {
          that.setData({
            imageUrl: res.data.content
          })
        }
      })
      that.setData({
        comprehensive: [],
        pageNumber: 1
      })
      that.initgetMore2()
    }
  },
  //爆品之外的分类加载更多
  getMore2: function() {
    var that = this
    var id = that.data.id
    var pageNumber = that.data.pageNumber + 1
    //品质优选
    app.Util.ajax('mall/home/goods', {
      categoryId: id,
      sortBy: 1,
      pageNumber: pageNumber,
      pageSize: that.data.pageSize
    }, 'GET').then((res) => { // 使用ajax函数
      if (res.messageCode = 'MSG_1001') {
        if (res.data.content.items == '' && that.data.comprehensive !== '') {
          that.setData({
            text1: '已经到底啦'
          })
        }
        var arr = that.data.comprehensive
        for (var i = 0; i < res.data.content.items.length; i++) {
          arr.push(res.data.content.items[i])
        }
        that.setData({
          comprehensive: arr,
        })
        that.setData({
          pageNumber: pageNumber
        })
      }
    })
  },
  initgetMore2: function() {
    var that = this
    var id = that.data.id
    var pageNumber = that.data.pageNumber
    //品质优选
    app.Util.ajax('mall/home/goods', {
      categoryId: id,
      sortBy: 1,
      pageNumber: pageNumber,
      pageSize: that.data.pageSize
    }, 'GET').then((res) => { // 使用ajax函数
      if (res.messageCode = 'MSG_1001') {
        that.setData({
          comprehensive: res.data.content.items
        })
      }
    })
  },
  //允许授权
  bindGetUserInfo: function(e) {
    var that = this 
    if (e.detail.errMsg == 'getUserInfo:ok'){
      app.globalData.flag = false
      wx.setStorageSync("userInfo", e.detail.userInfo)
      that.setData({
        showDialog: false
      })
    }else if (e.detail.errMsg =='getUserInfo:fail auth deny'){
      app.globalData.flag = false
      that.setData({
        showDialog: false
      })
    }  
  },
  reject: function() {
    var that = this
    app.globalData.flag = false
    that.setData({
      showDialog: false
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
    if (that.data.currentTab == 0) {
      that.setData({
        pageNumber: 1
      })
    } else {
      that.setData({
        pageNumber: 1
      })
      that.initgetMore1()
      //查询商品数量
      app.Util.ajax('mall/cart/count', 'GET').then((res) => { // 使用ajax函数
        if (res.messageCode = 'MSG_1001') {
          let a = res.data.content
          that.setData({
            count: a > 99 ? '99+' : res.data.content
          })
        }
      })
    }
  },
  //查询分享数据
  chooseShare: function() {
    var that = this
    app.Util.ajax('mall/weChat/sharing/target', {
      mode: 1,
      targetId: that.data.goodsId
    }, 'GET').then((res) => {
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
  //爆品轮播图跳转
  jumpping: function(e) {
    var that = this
    var id = e.currentTarget.dataset.id
    var forwarddest = e.currentTarget.dataset.forwarddest
    if (forwarddest === 1) {
      wx.navigateTo({
        url: `/pages/detail/detail?id=${id}`,
      })
    } else if(forwarddest === 2){
      console.log(that.data.id)
      that.setData({
        currentTab: id
      })
      //二级分类（轮播图下面的）
      app.Util.ajax('mall/home/categories', {
        parentId: id
      }, 'GET').then((res) => { // 使用ajax函数
        if (res.messageCode = 'MSG_1001') {
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
        if (res.messageCode = 'MSG_1001') {
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
        if (res.messageCode = 'MSG_1001') {
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
        url: `/pages/index/twolist/twolist?id=${id}`,
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
    var that = this
    if (ops.from === 'button') {
      // 来自页面内转发按钮
      that.setData({
        showModalStatus: false
      })
      app.Util.ajax('mall/weChat/sharing/onSuccess', {
        mode: 1
      }, 'POST').then((res) => {
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
      success: function(res) {
        console.log(res.shareTickets[0])
        wx.getShareInfo({
          shareTicket: res.shareTickets[0],
          complete(res) {
            console.log(res)
          }
        })
      },
      fail: function(res) {
        // 转发失败
        console.log("转发失败:" + JSON.stringify(res));
      }
    }
  },
  onLaunch: function() {

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
  onPullDownRefresh: function () {
    var that = this
    that.onLoad()
    wx.stopPullDownRefresh() //停止下拉刷新
  },
})