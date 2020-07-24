//index.js
//获取应用实例
const app = getApp()
var _animation;
var _animationIndex
var _ANIMATION_TIME = 500;
let m = 1;
Page({
  data: {
    tempId: '',
    brandShow: false,
    tempInfo: [],
    returnContent: [],
    returnContent2: [],
    waitReentry3: false,
    waitReentry: false,
    waitReentry2: false,
    showDialog: false, //获取头像昵称弹框
    showReceived: false, //首页叮咚弹窗
    showNotice: false, //首页广告弹窗
    autoplay: true,
    circular: true,
    interval: 2000,
    duration: 1000,
    navData: [], //导航栏
    currentTab: 0,
    swiperCurrent: 0,
    navScrollLeft: 0,
    imgUrls: [], //爆品下的轮播图
    wholeNation: [], //0元购好物
    totalAmount: '', //0元购好物返总件数
    goods: [], //超值一口价
    trend: [], //口碑爆品榜
    list: [], //销量排行榜
    noticeList: [], //公告栏列表
    navigationList: [],
    navigationList1: [], //营销列表个数小于10
    navigationList2: [], //营销列表大于10
    activityList: [], //活动列表
    maxHeight: '',
    indicatorDots: false,
    height: 0,
    paddingTop: 0,
    heightTop: 0,
    padding: 0,
    noticeId: null, //具体公告栏id
    classfy: [], //二级分类下轮播图下的分类
    pageNumber: 1, //分页记录数
    pageSize: 20, //分页大小
    id: 1, //导航栏id
    pageI: 1,
    text: '', //爆品底部提示
    text1: '', //其他底部提示
    imageUrl: [], //二级分类下的轮播图
    comprehensive: {}, //二级分类下的商品
    count: null, //购物车数量
    i: 1,
    pageI: 1,
    bannerId: 1, //0元购bannerid
    bannerUrl: '', //0元购banner图片
    color: "#FF2644",
    color1: "black",
    color2: "black",
    pricePhoto: app.Util.getUrlImg().hostUrl + '/twoSix/greyUp.png',
    pricePhoto1: app.Util.getUrlImg().hostUrl + '/twoSix/greyDown.png',
    pricePhoto2: app.Util.getUrlImg().hostUrl + '/twoSix/greyUp.png',
    pricePhoto3: app.Util.getUrlImg().hostUrl + '/twoSix/greyDown.png',
    options: {},
    shareMessage: {}, //叮咚信息
    newUserCourtesy: false,
    hostUrl: app.Util.getUrlImg().hostUrl,
    returnMoneyShow: false,
    returnImg: '',
    returnCanclePeople: false,
    frameClass1: 'frame z1', //默认正面在上面
    status10: true,
    temp: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18],
    content10: [],
    content11: [],
    popShow: false,
    floatShow: false
  },
  //事件处理函数
  onLoad: function (options) {
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
    //判断是否是新用户
    // var newUserCourtesyStatus1 = wx.getStorageSync('newUserCourtesyStatus')
    // console.log("aa" + newUserCourtesyStatus1)
    // if (newUserCourtesyStatus1 == 1) {
    //   setTimeout(function() {
    //     that.setData({
    //       newUserCourtesy: true
    //     })
    //   }, 5000)
    // }
    //别人通过链接
    if (options.inviterCode) {
      wx.setStorageSync('othersInviterCode', options.inviterCode)
      that.setData({
        inviterCode: options.inviterCode
      })
    }
    //查询购物车种类数量
    that.getCartCount();
    //一级分类（导航栏）
    that.navigationBar();
    //爆品轮播图
    that.navigationList5();
    //公告栏列表
    that.noticeList();
    //营销列表
    that.navigationList();
    //活动列表
    that.activityList();
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
    //品牌专区
    that.pinPai();
    that.pinPai2();
  },
      // 轮播图
      navigationList5: function () {
        var that = this
        app.Util.ajax('mall/marketing/navigation/findPageList', {
          navType: 8
        }, 'GET').then((res) => {
          if (res.data.messageCode == 'MSG_1001') {
            that.setData({
              imgUrls: res.data.content.items
            })
          }
        })
      },
  //品牌专区
  pinPai2: function () {
    let that = this
    app.Util.ajax('mall/home/brand', {
      pageNumber: 1,
      pageSize: 100
    }, 'GET').then((res) => {
      if (res.data.messageCode = 'MSG_1001') {
        for (let i = 0; i < res.data.content.items.length; i++) {
          res.data.content.items[i].brandChoose = false
          res.data.content.items[i].border1 = '1rpx solid #aaa'
          res.data.content.items[i].attr = 1
        }
        that.setData({
          content11: res.data.content.items
        })
      }
    })
  },
  //品牌专区
  pinPai: function () {
    let n = 0
    let that = this
    let tempList = []
    let number = 0 //数据组成数组个数
    app.Util.ajax('mall/home/brand', {
      pageNumber: 1,
      pageSize: 100
    }, 'GET').then((res) => {
      if (res.data.messageCode = 'MSG_1001') {
        number = Math.ceil(res.data.content.items.length / 8) //数据组成数组个数
        that.setData({
          number: number
        })
        for (let a = 0; a <= number; a++) {
          let temp = []
          for (let i = 0; i < res.data.content.items.length; i++) {
            if (a * 8 <= i && i <= a * 8 + 7) {
              temp.push(res.data.content.items[i])
            } else { }
          }
          tempList.push(temp)
        }
        that.setData({
          tempList: tempList,
          content10: tempList[0]
        })
        if (number > 1) {
          setInterval(function () {
            this.rotateFn()
          }.bind(this), 5000)
        }
      }
    })    
  },
  rotateFn: function () {
    var that = this
    that.setData({
      frameClass1: "frame back"
    })
    setTimeout(function () {
      let number = that.data.number
      if (m < number) {
        that.setData({
          content10: that.data.tempList[m],
        })
        m = m + 1
      } else {
        that.setData({
          content10: that.data.tempList[0],
        })
        m = 1
      }
    }, 500)
    setTimeout(function () {
      that.setData({
        frameClass1: "frame z1",
      })
    }, 1000);
  },
  brand() {
    let that = this
    that.setData({
      brandShow: true
    })
  },
  cancelBrand() {
    let that = this
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
  // 跳转到品牌详情
  jumpBrand(e) {
    let id = e.currentTarget.dataset.id
    let type = e.currentTarget.dataset.type
    let name = e.currentTarget.dataset.name
    let posterimage = e.currentTarget.dataset.posterimage
    let iconurl = posterimage ? posterimage.split('?') : null
    let iconurl1 = iconurl ? iconurl[0] : null
    wx.setStorageSync('posterimage', iconurl1 ? iconurl[1] : null)
    wx.navigateTo({
      url: `/pages/oneList/oneList?id=${id}&type=${type}&name=${name}&iconurl=${iconurl1}`,
    })
  },
  swiperChange: function (e) {
    let that = this
    that.setData({
      swiperCurrent: e.detail.current
    })
  },
  //客服分享图片回到指定的小程序页面
  handleContact: function (e) {
    var path = e.detail.path,
      query = e.detail.query,
      params = '';
    if (path) {
      for (var key in query) {
        params = key + '=' + query[key] + '&';
      }
      params = params.slice(0, params.length - 1);
      wx.navigateTo({
        url: path + '?' + params
      })
    }
  },
  //获取分享提示信息
  getShareMessage: function () {
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
  go_zeroActivity: function () {
    var that = this
    wx.navigateTo({
      url: '/packageB/pages/zeroPurchaseActivity/zeroPurchaseActivity',
    })
    that.setData({
      showReceived: false
    })
    app.globalData.share = 1
  },
  //点击立即去进去0元购列表页面
  go_zeroBuy: function () {
    var that = this
    wx.navigateTo({
      url: '/packageB/pages/zeroBuy/zeroBuy',
    })
    that.setData({
      showReceived: false
    })
    app.globalData.share = 1
  },
  //取消弹框
  cancel: function () {
    var that = this
    that.setData({
      showReceived: false
    })
  },
  //点击跳到全部分类
  jumpClassify: function () {
    wx.navigateTo({
      url: '/pages/classify/classify',
    })
  },
  //点击弹出公告弹窗
  showNotice: function (e) {
    var that = this
    that.setData({
      showNotice: true,
      noticeId: e.currentTarget.dataset.id
    })
    //公告栏明细
    that.noticeList();
  },
  //点击关闭公告弹窗
  cancelNotice: function () {
    var that = this
    that.setData({
      showNotice: false
    })
  },
  //公告栏
  noticeList: function () {
    var that = this
    app.Util.ajax('mall/marketing/notice/findList', {
      navType: 1
    }, 'GET').then((res) => {
      if (res.data.messageCode = 'MSG_1001') {
        that.setData({
          noticeList: res.data.content.slice(0, 3)
        })
      }
    })
  },
  // 营销列表
  navigationList: function () {
    var that = this
    app.Util.ajax('mall/marketing/navigation/findPageList', 'GET').then((res) => {
      if (res.data.messageCode == 'MSG_1001') {
        if (res.data.content.items.length > 5) {
          that.setData({
            height: 360,
            paddingTop: 40
          })
        } else if (res.data.content.items.length <= 5) {
          if (res.data.content.items.length === 0) {
            that.setData({
              height: 0,
              paddingTop: 0
            })
          } else {
            that.setData({
              height: 160,
              paddingTop: 40
            })
          }
        }
        if (res.data.content.items.length > 10) {
          that.setData({
            indicatorDots: true,
          })
        } else {
          that.setData({
            indicatorDots: false,
          })
        }
        that.setData({
          navigationList: res.data.content.items,
          navigationList1: res.data.content.items.slice(0, 10),
          navigationList2: res.data.content.items.slice(10, 20)
        })
      }
    })
  },
  //营销列表跳转
  navigatePage: function (e) {
    var that = this
    app.Util.ajax('mall/marketing/navigation/findDetail?id=' + e.currentTarget.dataset.id, null, 'GET').then((res) => {
      if (res.data.messageCode == 'MSG_1001') {
        if (res.data.content.category == 1) {
          if (res.data.content.param == 1) {
            wx.navigateTo({
              url: '/packageA/pages/xuncaoji/xuncaoji',
            })
          } else if (res.data.content.param == 2) {
            wx.navigateTo({
              url: '/pages/commission/commission',
            })
          } else if (res.data.content.param == 3) {
            wx.navigateTo({
              url: '/packageB/pages/waitReentryDetail/waitReentryDetail',
            })
          } else if (res.data.content.param == 4) {
            wx.navigateTo({
              url: '/pages/mine/personal/personal',
            })
          } else if (res.data.content.param == 5) {
            wx.setStorageSync('params', 1)
            wx.navigateTo({
              url: '/pages/myorder/myorder?status=' + 0,
            })
          } else if (res.data.content.param == 6) {
            wx.navigateTo({
              url: '/packageA/pages/myteam/myteam',
            })
          } else if (res.data.content.param == 7) {
            wx.navigateTo({
              url: '/pages/index/cart/cart',
            })
          } else if (res.data.content.param == 8) {

          } else if (res.data.content.param == 9) {
            wx.navigateTo({
              url: '/pages/diamondPartner/diamondPartner',
            })
          } else if (res.data.content.param == 10) {
            wx.navigateTo({
              url: '/packageA/pages/seed/seed',
            })
          } else if (res.data.content.param == 11) {
            wx.navigateTo({
              url: '/packageB/pages/zeroBuy/zeroBuy?type=' + 2,
            })
          } else if (res.data.content.param == 12) {
            wx.navigateTo({
              url: '/packageB/pages/zeroBuy/zeroBuy?type=' + 1,
            })
          } else if (res.data.content.param == 13) {
            wx.navigateTo({
              url: '/packageB/pages/zeroBuy/zeroBuy?type=' + 4,
            })
          } else if (res.data.content.param == 14) {
            wx.navigateTo({
              url: '/packageB/pages/freeBuy/freeBuy',
            })
          } else if (res.data.content.param == 15) {
            wx.switchTab({
              url: '/pages/wishpool/wishpool',
            })
          } else if (res.data.content.param == 16) {
            wx.navigateTo({
              url: '/pages/cityPartner/cityPartner',
            })
          } else if (res.data.content.param == 17) {
            wx.navigateTo({
              url: '/pages/byStages/byStages',
            })
          } else if (res.data.content.param == 18) {
            wx.navigateTo({
              url: '/pages/sponsor/sponsor',
            })
          } else if (res.data.content.param == 19) {
            wx.navigateTo({
              url: '/packageA/pages/mentionPeriodIndex/mentionPeriodIndex',
            })
          } else if (res.data.content.param == 20) {
            wx.navigateTo({
              url: '/packageA/pages/allStore/allStore',
            })
          } else if (res.data.content.param == 21) {
            wx.navigateTo({
              url: '/packageA/pages/guidePage/guidePage',
            })
          } else if (res.data.content.param == 22) {
            let token = wx.getStorageSync('token')
            if (token) {
              wx.navigateTo({
                url: '/packageA/pages/hero/hero',
              })
            } else {
              wx.navigateTo({
                url: "/pages/invitationCode/invitationCode"
              })
            }
          } else if (res.data.content.param == 23) {
            wx.navigateTo({
              url: '/packageA/pages/profitDetail/profitDetail',
            })
          } else if (res.data.content.param == 24) {
            wx.switchTab({
              url: '/pages/index/index',
            })
          } else if (res.data.content.param == 25) {
            wx.navigateTo({
              url: '/packageA/pages/payAttention/payAttention',
            })
          } else if (res.data.content.param == 26) {
            //订单交易-全部
            wx.switchTab({
              url: '/pages/forum/forum',
            })
            app.globalData.type = 10
          } else if (res.data.content.param == 27) {
            //订单交易-关注
            if (wx.getStorageSync('token')) {
              wx.switchTab({
                url: '/pages/forum/forum',
              })
              app.globalData.type = 6
            } else {
              wx.navigateTo({
                url: `/pages/invitationCode/invitationCode?inviterCode=${that.data.inviterCode}`,
              })
            }
          } else if (res.data.content.param == 28) {
            //订单交易-返现交易
            wx.switchTab({
              url: '/pages/forum/forum',
            })
            app.globalData.type = 7
          } else if (res.data.content.param == 29) {
            //订单交易-商品交易
            wx.switchTab({
              url: '/pages/forum/forum',
            })
            app.globalData.type = 8
          } else if (res.data.content.param == 30) {
            //订单交易-提期
            wx.switchTab({
              url: '/pages/forum/forum',
            })
            app.globalData.type = 5
          } else if (res.data.content.param == 31) {
            //订单交易-普通贴
            wx.switchTab({
              url: '/pages/forum/forum',
            })
            app.globalData.type = 9
          } else if (res.data.content.param == 32) {
            wx.navigateTo({
              url: '/packageA/pages/seed/seed?status=1',
            })
          } else if (res.data.content.param == 33) {
            wx.navigateTo({
              url: '/packageA/pages/seedRecharge/seedRecharge',
            })
          }
          else if (res.data.content.param== 34) {
            wx.navigateTo({
              url: '/packageA/pages/seedMask/seedMask',
            })
          }
        } else if (res.data.content.category == 2) {
          wx.navigateTo({
            url: '/pages/detail/detail?id=' + res.data.content.param + '&&status=' + res.data.content.status,
          })
        } else if (res.data.content.category == 3) {
          if (res.data.content.paramExt == 1) {
            wx.navigateTo({
              url: `/pages/oneList/oneList?id=${res.data.content.param}&name=${res.data.content.pageName}`,
            })
          } else if (res.data.content.paramExt == 2) {
            wx.navigateTo({
              url: `/pages/index/twolist/twolist?id=${res.data.content.param}&name=${res.data.content.pageName}`,
            })
          }
        } else if (res.data.content.category == 4) {
          wx.navigateTo({
            url: `/pages/longActivity/longActivity?id=${res.data.content.param}`,
          })
        } else if (res.data.content.category == 5) {
          wx.navigateTo({
            url: `/pages/commodityArea/commodityArea?id=${res.data.content.param}`,
          })
        } else if (res.data.content.category == 6) {
          wx.navigateTo({
            url: `/pages/h5Page/h5Page?srcItem=${res.data.content.paramExt}`,
          })
        } else if (res.data.content.category == 7) {
          if (e.currentTarget.dataset.storetype == 1) {
            wx.navigateTo({
              url: `/packageA/pages/ecommerceStore/ecommerceStore?id=${res.data.content.param}`,
            })
          } else {
            wx.navigateTo({
              url: `/packageA/pages/takeoutHomeage/takeoutHomeage?storeId=${res.data.content.param}`,
            })
          }
        } else if (res.data.content.category == 8) {
          wx.navigateTo({
            url: `/packageA/pages/takeoutStore/takeoutStore?id=${res.data.content.param}`,
          })
        }
      } else {
        wx.showToast({
          title: resa.data.message,
          icon: 'none'
        })
      }
    })
  },
  //活动列表
  activityList: function () {
    var that = this
    app.Util.ajax('mall/marketing/navigation/findPageList', {
      navType: 2
    }, 'GET').then((res) => {
      if (res.data.messageCode == 'MSG_1001') {
        that.setData({
          activityList: res.data.content.items.slice(0, 6),
        })
        var oblong = []
        var square = []
        that.data.activityList.slice(0, 4).forEach((v, i) => {
          if (v.showStyle == 1) {
            oblong.push(that.data.activityList[i])
          }
          if (v.showStyle == 2) {
            square.push(that.data.activityList[i])
          }
        })
        if (oblong.length >= 3) {
          that.setData({
            maxHeight: 762,
            activityList: that.data.activityList.slice(0, 3)
          })
        } else if (oblong.length == 2) {
          for (var i = 0; i < that.data.activityList.slice(0, 4).length; i++) {
            if (i != 0) {
              if (that.data.activityList.slice(0, 4)[i].showStyle == 2) {
                if (that.data.activityList.slice(0, 4)[i + 1].showStyle == 2 || that.data.activityList.slice(0, 4)[i - 1].showStyle == 2) {
                  that.setData({
                    maxHeight: 792,
                    activityList: that.data.activityList.slice(0, 4)
                  })
                } else {
                  that.setData({
                    maxHeight: 792,
                    activityList: that.data.activityList.slice(0, 3)
                  })
                }
              }
            }
          }
        } else if (oblong.length == 1) {
          if (square.length == 3) {
            that.setData({
              maxHeight: 822,
              activityList: that.data.activityList.slice(0, 4)
            })
          } else {
            that.setData({
              maxHeight: 822,
              activityList: that.data.activityList.slice(0, 5)
            })
          }
        } else if (oblong.length == 0) {
          if (that.data.activityList.length >= 4) {
            if (that.data.activityList.length > 4 && that.data.activityList[4].showStyle == 1) {
              that.setData({
                maxHeight: 822,
                activityList: that.data.activityList.slice(0, 5)
              })
            } else {
              that.setData({
                maxHeight: 852,
                activityList: that.data.activityList.slice(0, 6)
              })
            }
          }
        }
      }
    })
  },
  //营销列表跳转
  activityPage: function (e) {
    var that = this
    app.Util.ajax('mall/marketing/navigation/findDetail?id=' + e.currentTarget.dataset.id, null, 'GET').then((res) => {
      if (res.data.messageCode == 'MSG_1001') {
        if (res.data.content.category == 1) {
          if (res.data.content.param == 1) {
            wx.navigateTo({
              url: '/packageA/pages/xuncaoji/xuncaoji',
            })
          } else if (res.data.content.param == 2) {
            wx.navigateTo({
              url: '/pages/commission/commission',
            })
          } else if (res.data.content.param == 3) {
            wx.navigateTo({
              url: '/packageB/pages/waitReentryDetail/waitReentryDetail',
            })
          } else if (res.data.content.param == 4) {
            wx.navigateTo({
              url: '/pages/mine/personal/personal',
            })
          } else if (res.data.content.param == 5) {
            wx.setStorageSync('params', 1)
            wx.navigateTo({
              url: '/pages/myorder/myorder?status=' + 0,
            })
          } else if (res.data.content.param == 6) {
            wx.navigateTo({
              url: '/packageA/pages/myteam/myteam',
            })
          } else if (res.data.content.param == 7) {
            wx.navigateTo({
              url: '/pages/index/cart/cart',
            })
          } else if (res.data.content.param == 8) {

          } else if (res.data.content.param == 9) {
            wx.navigateTo({
              url: '/pages/diamondPartner/diamondPartner',
            })
          } else if (res.data.content.param == 10) {
            wx.navigateTo({
              url: '/packageA/pages/seed/seed',
            })
          } else if (res.data.content.param == 11) {
            wx.navigateTo({
              url: '/packageB/pages/zeroBuy/zeroBuy?type=' + 2,
            })
          } else if (res.data.content.param == 12) {
            wx.navigateTo({
              url: '/packageB/pages/zeroBuy/zeroBuy?type=' + 1,
            })
          } else if (res.data.content.param == 13) {
            wx.navigateTo({
              url: '/packageB/pages/zeroBuy/zeroBuy?type=' + 4,
            })
          } else if (res.data.content.param == 14) {
            wx.navigateTo({
              url: '/packageB/pages/freeBuy/freeBuy',
            })
          } else if (res.data.content.param == 15) {
            wx.switchTab({
              url: '/pages/wishpool/wishpool',
            })
          } else if (res.data.content.param == 16) {
            wx.navigateTo({
              url: '/pages/cityPartner/cityPartner',
            })
          } else if (res.data.content.param == 17) {
            wx.navigateTo({
              url: '/pages/byStages/byStages',
            })
          } else if (res.data.content.param == 18) {
            wx.navigateTo({
              url: '/pages/sponsor/sponsor',
            })
          } else if (res.data.content.param == 19) {
            wx.navigateTo({
              url: '/packageA/pages/mentionPeriodIndex/mentionPeriodIndex',
            })
          } else if (res.data.content.param == 20) {
            wx.navigateTo({
              url: '/packageA/pages/allStore/allStore',
            })
          } else if (res.data.content.param == 21) {
            wx.navigateTo({
              url: '/packageA/pages/guidePage/guidePage',
            })
          } else if (res.data.content.param == 22) {
            let token = wx.getStorageSync('token')
            if (token) {
              wx.navigateTo({
                url: '/packageA/pages/hero/hero',
              })
            } else {
              wx.navigateTo({
                url: "/pages/invitationCode/invitationCode"
              })
            }
          } else if (res.data.content.param == 23) {
            wx.navigateTo({
              url: '/packageA/pages/profitDetail/profitDetail',
            })
          } else if (res.data.content.param == 24) {
            wx.switchTab({
              url: '/pages/index/index',
            })
          } else if (res.data.content.param == 25) {
            if (wx.getStorageSync('token')) {
              wx.navigateTo({
                url: '/packageA/pages/payAttention/payAttention',
              })
            } else {
              wx.navigateTo({
                url: `/pages/invitationCode/invitationCode?inviterCode=${that.data.inviterCode}`,
              })
            }
          } else if (res.data.content.param == 26) {
            //订单交易-全部
            wx.switchTab({
              url: '/pages/forum/forum',
            })
            app.globalData.type = 10
          } else if (res.data.content.param == 27) {
            //订单交易-关注
            if (wx.getStorageSync('token')) {
              wx.switchTab({
                url: '/pages/forum/forum',
              })
              app.globalData.type = 6
            } else {
              wx.navigateTo({
                url: `/pages/invitationCode/invitationCode?inviterCode=${that.data.inviterCode}`,
              })
            }
          } else if (res.data.content.param == 28) {
            //订单交易-返现交易
            wx.switchTab({
              url: '/pages/forum/forum',
            })
            app.globalData.type = 7
          } else if (res.data.content.param == 29) {
            //订单交易-商品交易
            wx.switchTab({
              url: '/pages/forum/forum',
            })
            app.globalData.type = 8
          } else if (res.data.content.param == 30) {
            //订单交易-提期
            wx.switchTab({
              url: '/pages/forum/forum',
            })
            app.globalData.type = 5
          } else if (res.data.content.param == 31) {
            //订单交易-普通贴
            wx.switchTab({
              url: '/pages/forum/forum',
            })
            app.globalData.type = 9
          } else if (res.data.content.param == 32) {
            wx.navigateTo({
              url: '/packageA/pages/seed/seed?status=1',
            })
          } else if (res.data.content.param == 33) {
            wx.navigateTo({
              url: '/packageA/pages/seedRecharge/seedRecharge',
            })
          }else if (res.data.content.param == 34) {
            wx.navigateTo({
              url: '/packageA/pages/seedMask/seedMask',
            })
          }
        } else if (res.data.content.category == 2) {
          wx.navigateTo({
            url: '/pages/detail/detail?id=' + res.data.content.param + '&&status=' + res.data.content.status,
          })
        } else if (res.data.content.category == 3) {
          if (res.data.content.paramExt == 1) {
            wx.navigateTo({
              url: `/pages/oneList/oneList?id=${res.data.content.param}&name=${res.data.content.pageName}`,
            })
          } else if (res.data.content.paramExt == 2) {
            wx.navigateTo({
              url: `/pages/index/twolist/twolist?id=${res.data.content.param}&name=${res.data.content.pageName}`,
            })
          }
        } else if (res.data.content.category == 4) {
          wx.navigateTo({
            url: `/pages/longActivity/longActivity?id=${res.data.content.param}`,
          })
        } else if (res.data.content.category == 5) {
          wx.navigateTo({
            url: `/pages/commodityArea/commodityArea?id=${res.data.content.param}`,
          })
        } else if (res.data.content.category == 6) {
          wx.navigateTo({
            url: `/pages/h5Page/h5Page?srcItem=${res.data.content.paramExt}`,
          })
        } else if (res.data.content.category == 7) {
          if (e.currentTarget.dataset.storetype == 1) {
            wx.navigateTo({
              url: `/packageA/pages/ecommerceStore/ecommerceStore?id=${res.data.content.param}`,
            })
          } else {
            wx.navigateTo({
              url: `/packageA/pages/takeoutHomeage/takeoutHomeage?storeId=${res.data.content.param}`,
            })
          }
        } else if (res.data.content.category == 8) {
          wx.navigateTo({
            url: `/packageA/pages/takeoutStore/takeoutStore?id=${res.data.content.param}`,
          })
        }
      } else {
        wx.showToast({
          title: resa.data.message,
          icon: 'none'
        })
      }
    })
  },
  //导航栏
  navigationBar: function () {
    var that = this
    app.Util.ajax('mall/home/categories', {
      isHome: 1
    }, 'GET').then((res) => {
      if (res.data.messageCode = 'MSG_1001') {
        that.setData({
          navData: res.data.content.categoryResponse
        })
      }
    })
  },
  //爆品轮播图
  explosivesSwiper: function () {
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
  zeroPurchase: function () {
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
  zeroPurchaseMessage: function () {
    var that = this
    app.Util.ajax(`mall/home/activity/freeShopping?mode=${1}&type=${1}`, null, 'GET').then((res) => { // 使用ajax函数
      if (res.data.messageCode = 'MSG_1001') {
        that.setData({
          bannerId: res.data.content ? res.data.content.id : ''
        })
      }
    })
  },
  //0元购好物
  zeroPurchaseGoods: function () {
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
  overvaluedPrice: function () {
    var that = this
    app.Util.ajax('mall/home/lowPrice', 'GET').then((res) => { // 使用ajax函数
      if (res.data.messageCode = 'MSG_1001') {
        res.data.content.forEach((v, i) => {
          v.cashBackPrice = (v.dctPrice - v.marketingCashBack.totalAmount).toFixed(2)
        })
        that.setData({
          goods: res.data.content
        })
      }
    })
  },
  //口碑爆品榜
  publicPraise: function () {
    var that = this
    app.Util.ajax('mall/home/topSales', 'GET').then((res) => { // 使用ajax函数
      if (res.data.messageCode = 'MSG_1001') {
        that.setData({
          trend: res.data.content.slice(0, 3)
        })
      }
    })
  },
  //销量排行榜
  initgetMore1: function () {
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
  getMore1: function () {
    var that = this
    var pageNumber = that.data.pageNumber + 1
    app.Util.ajax('mall/home/bestChoice', {
      pageNumber: pageNumber,
      pageSize: that.data.pageSize
    }, 'GET').then((res) => { // 使用ajax函数
      if (res.data.messageCode = 'MSG_1001') {
        if (res.data.content.items == '' && that.data.list !== '') {
          that.setData({
            text: '已到底，去【寻商品】提交吧'
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
  getCartCount: function () {
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
        pageSize: that.data.pageSize
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
          comprehensive: res.data.content.items,
          color: "#FF2644",
          color1: "black",
          color2: "black",
          pricePhoto: app.Util.getUrlImg().hostUrl + '/twoSix/greyUp.png',
          pricePhoto1: app.Util.getUrlImg().hostUrl + '/twoSix/greyDown.png',
          pricePhoto2: app.Util.getUrlImg().hostUrl + '/twoSix/greyUp.png',
          pricePhoto3: app.Util.getUrlImg().hostUrl + '/twoSix/greyDown.png',
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
      comprehensive: []
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
          pageSize: that.data.pageSize
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
            comprehensive: res.data.content.items,
            color: "black",
            color1: "#FF2644",
            color2: "black",
            pricePhoto: app.Util.getUrlImg().hostUrl + '/twoSix/greyUp.png',
            pricePhoto1: app.Util.getUrlImg().hostUrl + '/twoSix/redDown.png',
            pricePhoto2: app.Util.getUrlImg().hostUrl + '/twoSix/greyUp.png',
            pricePhoto3: app.Util.getUrlImg().hostUrl + '/twoSix/greyDown.png',
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
          pageSize: that.data.pageSize
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
            comprehensive: res.data.content.items,
            color: "black",
            color1: "#FF2644",
            color2: "black",
            pricePhoto: app.Util.getUrlImg().hostUrl + '/twoSix/redUp.png',
            pricePhoto1: app.Util.getUrlImg().hostUrl + '/twoSix/greyDown.png',
            pricePhoto2: app.Util.getUrlImg().hostUrl + '/twoSix/greyUp.png',
            pricePhoto3: app.Util.getUrlImg().hostUrl + '/twoSix/greyDown.png',
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
          pageSize: that.data.pageSize
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
            comprehensive: res.data.content.items,
            color: "black",
            color1: "black",
            color2: "#FF2644",
            pricePhoto: app.Util.getUrlImg().hostUrl + '/twoSix/greyUp.png',
            pricePhoto1: app.Util.getUrlImg().hostUrl + '/twoSix/greyDown.png',
            pricePhoto2: app.Util.getUrlImg().hostUrl + '/twoSix/redUp.png',
            pricePhoto3: app.Util.getUrlImg().hostUrl + '/twoSix/greyDown.png',
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
          pageSize: that.data.pageSize
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
            comprehensive: res.data.content.items,
            color: "black",
            color1: "black",
            color2: "#FF2644",
            pricePhoto: app.Util.getUrlImg().hostUrl + '/twoSix/greyUp.png',
            pricePhoto1: app.Util.getUrlImg().hostUrl + '/twoSix/greyDown.png',
            pricePhoto2: app.Util.getUrlImg().hostUrl + '/twoSix/greyUp.png',
            pricePhoto3: app.Util.getUrlImg().hostUrl + '/twoSix/redDown.png',
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
  //跳转到搜索页面
  focus: function (e) {
    app.nav(e)
  },
  //首页跳转到详情页
  jumpDetail: function (e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/detail/detail?id=${id}`,
    })
  },
  //跳转到0元购公众号
  toZeroPurchase: function (e) {
    const that = this
    if (wx.getStorageSync('token')) {
      if (e.detail.formId !== 'the formId is a mock one') {
        app.Util.ajax('mall/userFromRecord/addRecord', {
          formId: e.detail.formId
        }, 'POST').then((res) => { // 使用ajax函数

        })
      } else {

      }
    }
    wx.navigateTo({
      url: "/packageB/pages/zeroBuy/zeroBuy",
    })
  },
  //跳转到0元购好物
  jumpReturn: function (e) {
    app.nav(e)
  },
  //跳转到购物车
  toCart: function (e) {
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
  switchNav(e) {
    var that = this
    var cur = e.currentTarget.dataset.current; //导航栏数组的index
    var id = e.currentTarget.dataset.id; //导航栏数组的id                
    that.setData({
      id: id,
      pageNumber: 1,
      text: '',
      text1: ''
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
            classfy: res.data.content.categoryResponse,
            heightTop: 40
          })
        } else {
          that.setData({
            heightTop: 0
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
  initgetMore2: function () {
    var that = this
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
        pageSize: that.data.pageSize
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
          comprehensive: res.data.content.items
        })
      }
    })
  },
  //爆品之外的分类加载更多
  getMore2: function () {
    var that = this
    var id = that.data.id
    var pageNumber = that.data.pageNumber + 1
    if (that.data.sortBy == 1) {
      if (that.data.tempId == '') {
        var data = {
          sortBy: that.data.sortBy,
          categoryId: id,
          pageNumber: pageNumber,
          pageSize: that.data.pageSize
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
          pageSize: that.data.pageSize
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
          pageSize: that.data.pageSize
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
        if (res.data.content.items == '' && that.data.comprehensive !== '') {
          that.setData({
            text1: '已到底，去【寻商品】提交吧'
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
  bindGetUserInfo: function (e) {
    app.Util.ajax('mall/personal/cityData', 'GET').then((res) => { // 使用ajax函数
      if (res.data.messageCode == 'MSG_1001') {
        that.setData({
          provinces: res.data.content
        })
        wx.setStorageSync('provinces', res.data.content)
      }
    })
    var that = this
    if (e.detail.errMsg == 'getUserInfo:ok') {
      app.globalData.flag = false
      //登录成功，设置登录授权首选项
      app.Util.ajax('mall/personal/preference', {
        authAvatarNikeName: 1
      }, 'POST').then((res) => {

      })
      that.setData({
        showDialog: false
      })
      // 发送个人资料给后台
      var userInfo = e.detail.userInfo
      app.Util.ajax('mall/personal/queryBaseData', null, 'POST').then((res) => { // 使用ajax函数
        if (res.messageCode = 'MSG_1001') {
          if (!res.data.content.nickname) {
            wx.downloadFile({
              url: userInfo.avatarUrl,
              success(res) {
                if (res.statusCode === 200) {
                  wx.uploadFile({
                    url: app.Util.getUrlImg().publicUrl + 'mall/personal/modifyBaseData',
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
                    success: function (res) {
                      console.log(res)
                      console.log('发送成功')
                    },
                    fail: function (res) {
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
        if (res.data == 'pages/wishpool/wishpool') {
          wx.switchTab({
            url: '/' + res.data
          })
        } else {
          wx.navigateTo({
            url: '/' + res.data
          })
        }
        wx.removeStorage({
          key: 'url'
        })
      }
    })
  },
  reject: function () {
    var that = this
    app.globalData.flag = false
    that.setData({
      showDialog: false
    })
    //跳转到授权页面之前的页面
    wx.getStorage({
      key: 'url',
      success(res) {
        if (res.data == 'pages/wishpool/wishpool') {
          wx.switchTab({
            url: '/' + res.data
          })
        } else {
          wx.navigateTo({
            url: '/' + res.data
          })
        }
        wx.removeStorage({
          key: 'url'
        })
      }
    })
  },


  onShow: function () {
    var that = this;
    //获取分享提示信息
    var token = wx.getStorageSync('token')
    if (token) {
      if (app.globalData.share == 0) {
        that.getShareMessage();
      }
    }
    wx.setNavigationBarTitle({
      title: '商城'
    })
    //转让消息弹窗查询
    if (wx.getStorageSync("token")) {
      that.returnInfo()
    }
    var temp = wx.getStorageSync('toindex')
    if (temp == 1) {
      setTimeout(function () {
        wx.pageScrollTo({
          // scrollTop: 740,
          selector: '.toto',
          duration: 300
        })
        wx.removeStorageSync('toindex')
      }, 1000)
    }
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
    //返现到账提示
    if (wx.getStorageSync("token")) {
      that.getCashBackInfo()
      //活动提醒
      if (wx.getStorageSync('indexMsg')) {
        setTimeout(function () {
          wx.showToast({
            title: wx.getStorageSync('indexMsg'),
            icon: 'none'
          })
        }, 500)
      }
    }
    //弹窗浮窗
    if (wx.getStorageSync('token')) {
      that.floatAndPop()
    }
  },
  floatAndPop: function () {
    var that = this
    app.Util.ajax('mall/floatingWindow/navigation/queryNavigation', {
      pageNumber: 2 //商城
    }, 'GET').then((res) => {
      if (res.data.content) {
        let arr = res.data.content
        if(arr.length>0){
          for (let i = 0; i < arr.length; i++) {
            if (arr[i].navType == 1) {
              that.setData({
                popContent: arr[i],
                popShow: true
              })
            } else if (arr[i].navType == 2) {
              that.setData({
                floatContent: arr[i],
                floatShow: true
              })
            }
          }
        }else{
          that.setData({
            popShow: false,
            floatShow: false
          })
        }
      }
    })
  },
  //获取返现到账提示
  getCashBackInfo: function () {
    var that = this
    app.Util.ajax('mall/cashBackNotice/queryCashBackNoticeQuota', null, 'GET').then((res) => {
      if (res.data.content) {
        that.setData({
          cashBackMoney: res.data.content
        })
      }
    })
  },
  //爆品轮播图跳转
  jumpping: function (e) {
    var that = this
    var id = e.currentTarget.dataset.id
    var forwarddest = e.currentTarget.dataset.forwarddest
    var name = e.currentTarget.dataset.name
    if (forwarddest === 1) {
      wx.navigateTo({
        url: `/pages/detail/detail?id=${id}`,
      })
    } else if (forwarddest === 2) {
      wx.navigateTo({
        url: `/pages/oneList/oneList?id=${id}&name=${name}`,
      })
    } else if (forwarddest === 3) {
      wx.navigateTo({
        url: `/pages/index/twolist/twolist?id=${id}&name=${name}`,
      })
    } else if (forwarddest === 4) {
      wx.navigateTo({
        url: '/packageA/pages/member/member',
      })
    } else if (forwarddest === 7) {
      wx.navigateTo({
        url: '/pages/mine/recharge/recharge',
      })
    } else if (forwarddest === 8) {
      // wx.navigateTo({
      //   url: '/pages/merchantEntry/merchantEntry',
      // })
    } else if (forwarddest === 9) {
      wx.navigateTo({
        url: '/packageB/pages/freeBuy/freeBuy',
      })
    } else if (forwarddest === 10) {
      wx.navigateTo({
        url: '/pages/byStages/byStages',
      })
    } else if (forwarddest === 11) {
      wx.navigateTo({
        url: '/pages/sponsor/sponsor',
      })
    } else if (forwarddest === 12) {
      wx.navigateTo({
        url: '/packageA/pages/allStore/allStore',
      })
    } else if (forwarddest === 13) {
      wx.navigateTo({
        url: '/packageA/pages/guidePage/guidePage',
      })
    }
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (ops) {
    return {
      path: "/pages/index/index?inviterCode=" + wx.getStorageSync('inviterCode'),
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let that = this
    that.animation = wx.createAnimation()
  },
  //监听页面隐藏
  onHide: function () {
    // 隐藏弹框
    this.setData({
      showReceived: false
    })
    wx.removeStorageSync('indexMsg')
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this
    if (that.data.currentTab == 0) {
      that.getMore1()
    } else {
      if (that.data.comprehensive.length>0){
        that.getMore2()
      }     
    }
  },
  //下拉刷新
  onPullDownRefresh: function () {
    var that = this
    that.setData({
      pageNumber: 1
    })
    that.onLoad(that.data.options)
    wx.stopPullDownRefresh() //停止下拉刷新
  },
  //新用户好礼弹窗(隐藏)
  newUserCourtesyCancel: function () {
    this.setData({
      newUserCourtesy: false
    })
    // wx.setStorageSync('newUserCourtesyStatus', 2)
  },
  //领取新用户好礼
  // getNewUserCourtesy: function() {
  //   app.Util.ajax('mall/order/newcomersReturnCash', null, 'POST').then((res) => {
  //     if (res.data.messageCode == 'MSG_1001') {
  //       wx.showToast({
  //         title: '领取成功，请到余额查看',
  //         icon: 'none'
  //       })
  //     } else {
  //       wx.showToast({
  //         title: res.data.message,
  //         icon: 'none'
  //       })
  //     }
  //   })
  //   this.setData({
  //     newUserCourtesy: false
  //   })
  //   wx.setStorageSync('newUserCourtesyStatus', 2)
  // },
  //转让弹窗
  waitReentryClose: function () {
    this.setData({
      waitReentry: false
    })
    this.returnInfo6()
  },
  waitReentryClose2: function () {
    this.setData({
      waitReentry2: false
    })
    this.returnInfo2()
  },
  waitReentryClose3: function () {
    this.setData({
      waitReentry3: false
    })
    wx.navigateTo({
      url: "/packageB/pages/waitReentryDetail/waitReentryDetail"
    })
  },
  //转让信息弹窗查询
  returnInfo: function () {
    var that = this
    app.Util.ajax('mall/transfer/gainNotice', null, 'GET').then((res) => {
      if (res.data.content.length > 0) {
        that.setData({
          tempInfo: res.data.content
        })
        for (let i of res.data.content) {
          if (i.type == 2) {
            //转让完成消息
            that.setData({
              waitReentry2: true,
              returnContent2: i.userItems
            })
          }
        }
        if (that.data.waitReentry2 == false) {
          for (let i of res.data.content) {
            if (i.type == 3) {
              //转让取消消息
              that.setData({
                waitReentry: true,
                returnContent: i.userItems
              })
            }
          }
        }
        if (that.data.waitReentry == false) {
          for (let i of res.data.content) {
            if (i.type == 4) {
              //撤销消息
              that.setData({
                returnCanclePeople: true,
                returnContent3: i.userItems
              })
            }
          }
        }
        if (that.data.returnCanclePeople == false) {
          for (let i of res.data.content) {
            if (i.type == 1) {
              //转让消息
              that.setData({
                waitReentry3: true,
              })
            }
          }
        }
      }
    })
  },
  returnInfo2: function () {
    var that = this
    if (that.data.tempInfo.length > 0) {
      for (let i of that.data.tempInfo) {
        if (i.type == 3) {
          //转让取消消息
          that.setData({
            waitReentry: true,
            returnContent: i.userItems
          })
        }
      }
      if (that.data.waitReentry == false) {
        for (let i of that.data.tempInfo) {
          if (i.type == 1) {
            //转让消息
            that.setData({
              waitReentry3: true,
            })
          }
        }
      }

    }
  },
  returnInfo6: function () {
    var that = this
    if (that.data.tempInfo.length > 0) {
      for (let i of that.data.tempInfo) {
        if (i.type == 4) {
          //转让取消消息
          that.setData({
            waitReentry: true,
            returnContent3: i.userItems
          })
        }
      }
      if (that.data.waitReentry == false) {
        for (let i of that.data.tempInfo) {
          if (i.type == 1) {
            //转让消息
            that.setData({
              returnCanclePeople: true,
            })
          }
        }
      }

    }
  },
  returnInfo3: function () {
    var that = this
    if (that.data.tempInfo.length > 0) {
      for (let i of that.data.tempInfo) {
        if (i.type == 1) {
          //转让消息
          that.setData({
            waitReentry3: true,
          })
        }
      }
    }
  },
  retunrnMoneyShow: function () {
    var that = this
    that.setData({
      returnMoneyShow: true,
      returnImg: app.Util.getUrlImg().hostUrl + '/update/moneybox.gif'
    })
    var backgroundAudioManager = wx.getBackgroundAudioManager()
    backgroundAudioManager.title = '到账音效'
    backgroundAudioManager.src = app.Util.getUrlImg().hostUrl + '/update/coin_ drop.mp3'
    app.Util.ajax('mall/cashBackNotice/deleteByUserId', null, 'POST').then((res) => { })
  },
  retunrnMoneyClose: function () {
    var that = this
    that.setData({
      returnMoneyShow: false,
      cashBackMoney: false
    })
  },
  toYue: function () {
    wx.navigateTo({
      url: '/packageB/pages/waitDetail/waitDetail'
    })
  },
  returnCanclePeople: function () {
    var that = this
    that.setData({
      returnCanclePeople: false
    })
    that.returnInfo3()
  },
  closePop: function () {
    let that = this
    app.Util.ajax('mall/floatingWindow/navigation/userClick', {
      type: 1, //关闭
      id: that.data.popContent.id
    }, 'POST').then((res) => {
      if (res.data.messageCode == "MSG_1001") {
        that.setData({
          popShow: false
        })
      }
    })
  },
  closeFloat: function () {
    let that = this
    app.Util.ajax('mall/floatingWindow/navigation/userClick', {
      type: 1, //关闭
      id: that.data.floatContent.id
    }, 'POST').then((res) => {
      if (res.data.messageCode == "MSG_1001") {
        that.setData({
          floatShow: false
        })
      }
    })
  },
  toPages: function (e) {
    let that = this
    let tempContent = e.currentTarget.dataset.navtype == 1 ? that.data.popContent : that.data.floatContent
    let navtype = e.currentTarget.dataset.navtype
    app.Util.ajax('mall/floatingWindow/navigation/userClick', {
      type: 2, //跳转
      id: tempContent.id
    }, 'POST').then((res) => {
      if (res.data.messageCode == "MSG_1001") {
        if (navtype == 1) {
          that.setData({
            popShow: false
          })
        } else {
          that.setData({
            floatShow: false
          })
        }
      }
    })
    if (tempContent.category == 1) {
      if (tempContent.param == 1) {
        wx.navigateTo({
          url: '/packageA/pages/xuncaoji/xuncaoji',
        })
      } else if (tempContent.param == 2) {
        wx.navigateTo({
          url: '/pages/commission/commission',
        })
      } else if (tempContent.param == 3) {
        wx.navigateTo({
          url: '/packageB/pages/waitReentryDetail/waitReentryDetail',
        })
      } else if (tempContent.param == 4) {
        wx.navigateTo({
          url: '/pages/mine/personal/personal',
        })
      } else if (tempContent.param == 5) {
        wx.setStorageSync('params', 1)
        wx.navigateTo({
          url: '/pages/myorder/myorder?status=' + 0,
        })
      } else if (tempContent.param == 6) {
        wx.navigateTo({
          url: '/packageA/pages/myteam/myteam',
        })
      } else if (tempContent.param == 7) {
        wx.navigateTo({
          url: '/pages/index/cart/cart',
        })
      } else if (tempContent.param == 8) {

      } else if (tempContent.param == 9) {
        wx.navigateTo({
          url: '/pages/diamondPartner/diamondPartner',
        })
      } else if (tempContent.param == 10) {
        wx.navigateTo({
          url: '/packageA/pages/seed/seed',
        })
      } else if (tempContent.param == 11) {
        wx.navigateTo({
          url: '/packageB/pages/zeroBuy/zeroBuy?type=' + 2,
        })
      } else if (tempContent.param == 12) {
        wx.navigateTo({
          url: '/packageB/pages/zeroBuy/zeroBuy?type=' + 1,
        })
      } else if (tempContent.param == 13) {
        wx.navigateTo({
          url: '/packageB/pages/zeroBuy/zeroBuy?type=' + 4,
        })
      } else if (tempContent.param == 14) {
        wx.navigateTo({
          url: '/packageB/pages/freeBuy/freeBuy',
        })
      } else if (tempContent.param == 15) {
        wx.switchTab({
          url: '/pages/wishpool/wishpool',
        })
      } else if (tempContent.param == 16) {
        wx.navigateTo({
          url: '/pages/cityPartner/cityPartner',
        })
      } else if (tempContent.param == 17) {
        wx.navigateTo({
          url: '/pages/byStages/byStages',
        })
      } else if (tempContent.param == 18) {
        wx.navigateTo({
          url: '/pages/sponsor/sponsor',
        })
      } else if (tempContent.param == 19) {
        wx.navigateTo({
          url: '/packageA/pages/mentionPeriodIndex/mentionPeriodIndex',
        })
      } else if (tempContent.param == 20) {
        wx.navigateTo({
          url: '/packageA/pages/allStore/allStore',
        })
      } else if (tempContent.param == 21) {
        wx.navigateTo({
          url: '/packageA/pages/guidePage/guidePage',
        })
      } else if (tempContent.param == 22) {
        let token = wx.getStorageSync('token')
        if (token) {
          wx.navigateTo({
            url: '/packageA/pages/hero/hero',
          })
        } else {
          wx.navigateTo({
            url: "/pages/invitationCode/invitationCode"
          })
        }
      } else if (tempContent.param == 23) {
        wx.navigateTo({
          url: '/packageA/pages/profitDetail/profitDetail',
        })
      } else if (tempContent.param == 24) {
        wx.switchTab({
          url: '/pages/index/index',
        })
      } else if (tempContent.param == 25) {
        wx.navigateTo({
          url: '/packageA/pages/payAttention/payAttention',
        })
      } else if (tempContent.param == 26) {
        //订单交易-全部
        wx.switchTab({
          url: '/pages/forum/forum',
        })
        app.globalData.type = 10
      } else if (tempContent.param == 27) {
        //订单交易-关注
        if (wx.getStorageSync('token')) {
          wx.switchTab({
            url: '/pages/forum/forum',
          })
          app.globalData.type = 6
        } else {
          wx.navigateTo({
            url: `/pages/invitationCode/invitationCode?inviterCode=${that.data.inviterCode}`,
          })
        }
      } else if (tempContent.param == 28) {
        //订单交易-返现交易
        wx.switchTab({
          url: '/pages/forum/forum',
        })
        app.globalData.type = 7
      } else if (tempContent.param == 29) {
        //订单交易-商品交易
        wx.switchTab({
          url: '/pages/forum/forum',
        })
        app.globalData.type = 8
      } else if (tempContent.param == 30) {
        //订单交易-提期
        wx.switchTab({
          url: '/pages/forum/forum',
        })
        app.globalData.type = 5
      } else if (tempContent.param == 31) {
        //订单交易-普通贴
        wx.switchTab({
          url: '/pages/forum/forum',
        })
        app.globalData.type = 9
      } else if (tempContent.param == 32) {
        wx.navigateTo({
          url: '/packageA/pages/seed/seed?status=1',
        })
      } else if (tempContent.param == 33) {
        wx.navigateTo({
          url: '/packageA/pages/seedRecharge/seedRecharge',
        })
      } else if (tempContent.param == 34) {
        wx.navigateTo({
          url: '/packageA/pages/seedMask/seedMask',
        })
      }
    } else if (tempContent.category == 2) {
      wx.navigateTo({
        url: '/pages/detail/detail?id=' + tempContent.param + '&&status=' + tempContent.status,
      })
    } else if (tempContent.category == 3) {
      if (tempContent.paramExt == 1) {
        wx.navigateTo({
          url: `/pages/oneList/oneList?id=${tempContent.param}&name=${tempContent.pageName}`,
        })
      } else if (tempContent.paramExt == 2) {
        wx.navigateTo({
          url: `/pages/index/twolist/twolist?id=${tempContent.param}&name=${tempContent.pageName}`,
        })
      }
    } else if (tempContent.category == 4) {
      wx.navigateTo({
        url: `/pages/longActivity/longActivity?id=${tempContent.param}`,
      })
    } else if (tempContent.category == 5) {
      wx.navigateTo({
        url: `/pages/commodityArea/commodityArea?id=${tempContent.param}`,
      })
    } else if (tempContent.category == 6) {
      wx.navigateTo({
        url: `/pages/h5Page/h5Page?srcItem=${tempContent.paramExt}`,
      })
    } else if (tempContent.category == 7) {
      if (e.currentTarget.dataset.storetype == 1) {
        wx.navigateTo({
          url: `/packageA/pages/ecommerceStore/ecommerceStore?id=${tempContent.param}`,
        })
      } else {
        wx.navigateTo({
          url: `/packageA/pages/takeoutHomeage/takeoutHomeage?storeId=${tempContent.param}`,
        })
      }
    } else if (tempContent.category == 8) {
      wx.navigateTo({
        url: `/packageA/pages/takeoutStore/takeoutStore?id=${tempContent.param}`,
      })
    }
  }
})