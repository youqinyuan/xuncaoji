// pages/newIndex/newIndex.js
let app = getApp()
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
    noticeList:[],
    navigationList: [],
    navigationList1: [], //营销列表个数小于10
    navigationList2: [], //营销列表大于10
    profitStatus:2,
    showNotice: false,
    swiperCurrent:0,
    guide:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //轮播图
    this.explosivesSwiper()
    //公告
    this.noticeList()
    //图标导航
    this.navigationList()
    //英雄榜    
    this.navigationList1()
    //模块
    this.navigationList2()
    this.navigationList3()
    this.navigationList4()
    //收益数据状态（是否隐藏）
    this.setData({
      profitStatus:wx.getStorageSync('profitStatus')?wx.getStorageSync('profitStatus'):this.data.profitStatus
    })
  },
  explosivesSwiper: function() {
    var that = this
    app.Util.ajax('mall/home/slideShow?slideShowCategory=3', 'GET').then((res) => { // 使用ajax函数
      if (res.data.messageCode = 'MSG_1001') {
        that.setData({
          imgUrls: res.data.content
        })
      }
    })
  },
  swiperChange: function(e){
    this.setData({
        swiperCurrent: e.detail.current
    })
},
isGuide:function(){
  let that = this
  app.Util.ajax('mall/guide/needToGuide',{
    type:1
  }, 'GET').then((res) => { // 使用ajax函数
    if (res.data.messageCode = 'MSG_1001') {
      if(res.data.content==1){
        that.setData({
          guide:true
        })
      }
    }
  })
},
    //公告栏
    noticeList: function() {
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
   navigationList: function() {
    var that = this
    app.Util.ajax('mall/marketing/navigation/findPageList',{
      navType:3
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
  navigationList1: function() {
    var that = this
    app.Util.ajax('mall/marketing/navigation/findPageList',{
      navType:7
    }, 'GET').then((res) => {
      if (res.data.messageCode == 'MSG_1001') {
        that.setData({
          heroContent:res.data.content.items
        })
      }
    })
  },
     // 模块一
navigationList2: function() {
      var that = this
      app.Util.ajax('mall/marketing/navigation/findPageList',{
        navType:4
      }, 'GET').then((res) => {
        if (res.data.messageCode == 'MSG_1001') {
          that.setData({
            module1:res.data.content.items
          })
        }
      })
    },
// 模块二
    navigationList3: function() {
          var that = this
          app.Util.ajax('mall/marketing/navigation/findPageList',{
            navType:5
          }, 'GET').then((res) => {
            if (res.data.messageCode == 'MSG_1001') {
              that.setData({
                module2:res.data.content.items
              })
            }
          })
        },
// 模块三
navigationList4: function() {
      var that = this
      app.Util.ajax('mall/marketing/navigation/findPageList',{
        navType:6
      }, 'GET').then((res) => {
        if (res.data.messageCode == 'MSG_1001') {
          that.setData({
            module3:res.data.content.items
          })
        }
      })
    },
    //营销列表跳转
  navigatePage: function(e) {
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
              url: '/pages/waitReentryDetail/waitReentryDetail',
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
              url: '/packageA/pages/zeroBuy/zeroBuy?type=' + 2,
            })
          } else if (res.data.content.param == 12) {
            wx.navigateTo({
              url: '/packageA/pages/zeroBuy/zeroBuy?type=' + 1,
            })
          } else if (res.data.content.param == 13) {
            wx.navigateTo({
              url: '/packageA/pages/zeroBuy/zeroBuy?type=' + 4,
            })
          } else if (res.data.content.param == 14) {
            wx.navigateTo({
              url: '/packageA/pages/freeBuy/freeBuy',
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
              url: '/packageA/pages/takeoutStore/takeoutStore',
            })
          }else if (res.data.content.param == 21) {
            wx.navigateTo({
              url: '/packageA/pages/guidePage/guidePage',
            })
          }else if (res.data.content.param == 22) {
              wx.navigateTo({
                url: '/packageA/pages/hero/hero',
              })
          }else if (res.data.content.param == 23) {
            wx.navigateTo({
              url: '/pages/mine/recharge/recharge',
            })
          }else if (res.data.content.param == 24) {
            wx.switchTab({
              url: '/pages/index/index',
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
          wx.navigateTo({
            url: `/packageA/pages/takeoutHomeage/takeoutHomeage?storeId=${res.data.content.param}`,
          })
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
        url: '/packageA/pages/freeBuy/freeBuy',
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
        url: '/packageA/pages/takeoutStore/takeoutStore',
      })
    }else if (forwarddest === 13) {
      wx.navigateTo({
        url: '/packageA/pages/guidePage/guidePage',
      })
    }
  },
    //点击弹出公告弹窗
    showNotice: function(e) {
      var that = this
      that.setData({
        showNotice: true,
        noticeId: e.currentTarget.dataset.id
      })
      //公告栏明细
      that.noticeList();
    },
    //点击关闭公告弹窗
    cancelNotice: function() {
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
  onShow: function () {
    let that = this
    //是否引导
    if(wx.getStorageSync('token')){
      this.isGuide()
    }
    // 总收益
    if(wx.getStorageSync('token')){
      app.Util.ajax('mall/userHome/queryUserIncomeTotal', null, 'GET').then((res) => {
        if (res.data.messageCode = 'MSG_1001') {
          that.setData({
            totalAnnualizedRate:res.data.content.totalAnnualizedRate,
            totalIncome:res.data.content.totalIncome
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
  toProfit:function(){
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
  toHero:function(){
      wx.navigateTo({
        url: "/packageA/pages/hero/hero"
      })
  },
  toguide:function(){
    wx.navigateTo({
      url: "/packageA/pages/guidePage/guidePage"
    })
    this.setData({
      guide:false
    })
  },
  updateProfitStatus:function(e){
    let index = e.currentTarget.dataset.index
    if(index==1){
      this.setData({
        profitStatus:2
      })
      wx.setStorageSync('profitStatus',2)
    }else{
      this.setData({
        profitStatus:1
      })
      wx.setStorageSync('profitStatus',1)
    }
  },
  cancleguide:function(){
    this.setData({
      guide:false
    })
  }
})