// pages/newIndex/newIndex.js
let app = getApp()
let interval = null
let m = 1
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hostUrl: app.Util.getUrlImg().hostUrl,
    autoplay: false,
    duration: 200,
    current: 0,
    isLogin: false,
    noticeList: [],
    navigationList: [],
    navigationList1: [], //营销列表个数小于10
    navigationList2: [], //营销列表大于10
    profitStatus: 2,
    showNotice: false,
    swiperCurrent: 0,
    guide: false,
    popShow: false,
    floatShow: false,
    content10:[],
    frameClass1: 'frame z1', //默认正面在上面
    temp: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    //轮播图
    that.navigationList5()
    //公告
    that.noticeList()
    //图标导航
    that.navigationList()
    //英雄榜    
    that.navigationList1()
    //模块
    that.navigationList2()
    that.navigationList3()
    that.navigationList4()
    that.pinPai()
    // 总收益
    setTimeout(function () {
      if (wx.getStorageSync('token')) {
        that.init()
        that.isGuide()
        // 是否可以获取红包
        that.isGetSeed()
      }
    }, 2000)
    //收益数据状态（是否隐藏）
    that.setData({
      profitStatus: wx.getStorageSync('profitStatus') ? wx.getStorageSync('profitStatus') : this.data.profitStatus
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
  //点击跳到全部分类
  jumpClassify: function () {
    wx.navigateTo({
      url: '/pages/classify/classify',
    })
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
  explosivesSwiper: function () {
    var that = this
    app.Util.ajax('mall/home/slideShow?slideShowCategory=3', 'GET').then((res) => { // 使用ajax函数
      if (res.data.messageCode = 'MSG_1001') {
        that.setData({
          imgUrls: res.data.content
        })
      }
    })
  },
  swiperChange: function (e) {
    this.setData({
      swiperCurrent: e.detail.current
    })
  },
  isGuide: function () {
    let that = this
    app.Util.ajax('mall/guide/needToGuide', {
      type: 1
    }, 'GET').then((res) => { // 使用ajax函数
      if (res.data.messageCode = 'MSG_1001') {
        if (res.data.content == 1) {
          that.setData({
            guide: true
          })
        }
      }
    })
  },
  // 是否可以领取红包
  isGetSeed() {
    let that = this
    app.Util.ajax('mall//integral/seed/checkRedEnvelope', null, 'GET').then((res) => { // 使用ajax函数
      if (res.data.messageCode = 'MSG_1001') {
        that.setData({
          getSeed: res.data.content
        })
        if (that.data.getSeed.status == 1) {
          if (!wx.getStorageSync('isSeed')) {
            let lastTime = res.data.content.minuteInterval * 60
            interval = setInterval(() => {
              if (lastTime > 1) {
                lastTime--
                let minuteTime = parseInt(lastTime / 60)
                let secondTime = parseInt(lastTime % 60) < 10 ? '0' + parseInt(lastTime % 60) : parseInt(lastTime % 60)
                that.setData({
                  showSeed: `${minuteTime}:${secondTime}可领`
                })
              } else {
                clearInterval(interval)
                wx.setStorageSync('isSeed', 1)
                that.setData({
                  showSeed: '马上领'
                })
              }
            }, 1000)
          } else {
            that.setData({
              showSeed: '马上领'
            })
          }
        }
      }
    })
  },
  getSeed() {
    let that = this
    if (that.data.showSeed == '马上领') {
      wx.navigateTo({
        url: '/packageA/pages/seed/seed?isSeed=' + 1,
      })
      clearInterval(interval)
      wx.removeStorageSync('isSeed')
      that.isGetSeed()
    } else {
      return
    }
  },
  //公告栏
  noticeList: function () {
    var that = this
    app.Util.ajax('mall/marketing/notice/findList', {
      category: 2
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
    app.Util.ajax('mall/marketing/navigation/findPageList', {
      navType: 3
    }, 'GET').then((res) => {
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
  //英雄榜
  navigationList1: function () {
    var that = this
    app.Util.ajax('mall/marketing/navigation/findPageList', {
      navType: 7
    }, 'GET').then((res) => {
      if (res.data.messageCode == 'MSG_1001') {
        that.setData({
          heroContent: res.data.content.items
        })
      }
    })
  },
  // 模块一
  navigationList2: function () {
    var that = this
    app.Util.ajax('mall/marketing/navigation/findPageList', {
      navType: 4
    }, 'GET').then((res) => {
      if (res.data.messageCode == 'MSG_1001') {
        that.setData({
          module1: res.data.content.items
        })
      }
    })
  },
  // 模块二
  navigationList3: function () {
    var that = this
    app.Util.ajax('mall/marketing/navigation/findPageList', {
      navType: 5
    }, 'GET').then((res) => {
      if (res.data.messageCode == 'MSG_1001') {
        that.setData({
          module2: res.data.content.items
        })
      }
    })
  },
  // 模块三
  navigationList4: function () {
    var that = this
    app.Util.ajax('mall/marketing/navigation/findPageList', {
      navType: 6
    }, 'GET').then((res) => {
      if (res.data.messageCode == 'MSG_1001') {
        that.setData({
          module3: res.data.content.items
        })
      }
    })
  },
    // 轮播图
    navigationList5: function () {
      var that = this
      app.Util.ajax('mall/marketing/navigation/findPageList', {
        navType: 9
      }, 'GET').then((res) => {
        if (res.data.messageCode == 'MSG_1001') {
          that.setData({
            imgUrls: res.data.content.items
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
            wx.navigateTo({
              url: '/packageA/pages/hero/hero',
            })
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
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  init: function () {
    let that = this
    // 总收益
    if (wx.getStorageSync('token')) {
      app.Util.ajax('mall/userHome/queryUserIncomeTotal', null, 'GET').then((res) => {
        if (res.data.messageCode == 'MSG_1001') {
          that.setData({
            totalAnnualizedRate: res.data.content.totalAnnualizedRate,
            totalIncome: res.data.content.totalIncome
          })
        }
      })
    }
  },
  onShow: function () {
    let that = this
    that.init()
    //是否引导
    if (wx.getStorageSync('token')) {
      this.isGuide()
    }
    //弹窗浮窗
    if (wx.getStorageSync('token')) {
      that.floatAndPop()
    }
  },
  floatAndPop: function () {
    var that = this
    app.Util.ajax('mall/floatingWindow/navigation/queryNavigation', {
      pageNumber: 1 //首页
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
    let that = this
    that.onLoad()
    wx.stopPullDownRefresh()
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
  toProfit: function () {
    let token = wx.getStorageSync('token')
    if (token) {
      wx.navigateTo({
        url: "/packageA/pages/profitDetail/profitDetail"
      })
    } else {
      wx.navigateTo({
        url: "/pages/invitationCode/invitationCode"
      })
    }
  },
  toHero: function () {
    wx.navigateTo({
      url: "/packageA/pages/hero/hero"
    })
  },
  toguide: function () {
    wx.navigateTo({
      url: "/packageA/pages/guidePage/guidePage"
    })
    this.setData({
      guide: false
    })
  },
  updateProfitStatus: function (e) {
    let index = e.currentTarget.dataset.index
    if (index == 1) {
      this.setData({
        profitStatus: 2
      })
      wx.setStorageSync('profitStatus', 2)
    } else {
      this.setData({
        profitStatus: 1
      })
      wx.setStorageSync('profitStatus', 1)
    }
  },
  cancleguide: function () {
    this.setData({
      guide: false
    })
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
      }else if (tempContent.param == 34) {
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