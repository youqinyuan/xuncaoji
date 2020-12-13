// packageA/pages/takeoutStore/takeoutStore.js
let QQMapWX = require('../../utils/qqmap-wx-jssdk1.2/qqmap-wx-jssdk.min.js');
const app = getApp()
let qqmapsdk;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    current: 0,
    keyword: '',
    nearList: null,
    defaultKeyword: '房产小区',
    hostUrl: app.Util.getUrlImg().hostUrl,
    navData: [],
    imgUrls: [], //轮播图
    swiperCurrent: 0,
    navigationList: [],
    navigationList1: [], //营销列表个数小于10
    navigationList2: [], //营销列表大于10
    navData: ['精选商品', '推荐店铺'],
    tempText: '<',
    pageNumber: 1,
    pageSize: 5,
    text: '',
    sortBy: 1,
    businessId: '',
    distance: '',
    scope: 2,
    sortFlag: 2,
    underLine: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
    // 轮播图
    that.navigationList5();
    //营销列表
    that.navigationList();
    if (wx.getStorageSync('token')) {
      that.initAddress();
    }

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
    let that = this
    that.setData({
      pageNumber: 1
    })
    if (app.globalData.searchLocation == 0) {
      that.initLocation()
    } else if (app.globalData.searchLocation == 1) {
      app.globalData.searchLocation = 0
    }
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
    let that = this
    if (that.data.current == 0) {
      // 加载精选商品
      that.getSelectedGoods();
    } else if (that.data.current == 1) {
      that.getRecommendedStore()
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  //轮播图
  navigationList5: function() {
    var that = this
    app.Util.ajax('mall/marketing/navigation/findPageList', {
      navType: 11
    }, 'GET').then((res) => {
      if (res.data.messageCode == 'MSG_1001') {
        that.setData({
          imgUrls: res.data.content.items
        })
      }
    })
  },
  swiperChange: function(e) {
    let that = this
    that.setData({
      swiperCurrent: e.detail.current
    })
  },
  // 营销列表
  navigationList: function() {
    var that = this
    app.Util.ajax('mall/marketing/navigation/findPageList', {
      navType: 12
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
              url: '/packageB/pages/commission/commission',
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
            wx.navigateTo({
              url: '/packageB/pages/wishpool/wishpool',
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
          } else if (res.data.content.param == 34) {
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
            url: `/packageB/pages/nearbyStore/nearbyStore?id=${res.data.content.param}`,
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
  // 精选商品
  selectedGoods() {
    let that = this
    let data = {
      pageSize: that.data.pageSize,
      pageNumber: that.data.pageNumber,
      sortBy: that.data.sortBy,
      businessId: that.data.businessId,
      distance: that.data.distance,
      longitude: that.data.nearList.longitude,
      latitude: that.data.nearList.latitude
    }
    app.Util.ajax('mall/home/packageGoods', data, 'GET').then((res) => {
      if (res.data.messageCode == 'MSG_1001') {
        that.setData({
          selectedGoods: res.data.content.items
        })
      }
    })
  },
  // 加载精选商品
  getSelectedGoods() {
    let that = this
    let pageNumber = that.data.pageNumber + 1
    let data = {
      pageSize: that.data.pageSize,
      pageNumber: pageNumber,
      sortBy: that.data.sortBy,
      businessId: that.data.businessId,
      distance: that.data.distance,
      longitude: that.data.nearList.longitude,
      latitude: that.data.nearList.latitude
    }
    app.Util.ajax('mall/home/packageGoods', data, 'GET').then((res) => { // 使用ajax函数
      if (res.data.messageCode = 'MSG_1001') {
        if (res.data.content.items == '' && that.data.selectedGoods !== '') {
          that.setData({
            text: '已到底，去【寻商品】提交吧'
          })
        }
        var arr = that.data.selectedGoods
        res.data.content.items.forEach((v, i) => {
          arr.push(res.data.content.items[i])
        })
        that.setData({
          selectedGoods: arr,
          pageNumber: pageNumber
        })
      }
    })
  },
  // 推荐店铺
  recommendedStore() {
    let that = this
    let data = {
      pageSize: that.data.pageSize,
      pageNumber: that.data.pageNumber,
      scope: that.data.scope,
      sortFlag: that.data.sortFlag,
      underLine: that.data.underLine,
      sortBy: that.data.sortBy,
      businessId: that.data.businessId,
      distance: that.data.distance,
      longitude: that.data.nearList.longitude,
      latitude: that.data.nearList.latitude
    }
    app.Util.ajax('mall/home/_search', data, 'GET').then((res) => {
      if (res.data.messageCode == 'MSG_1001') {
        let nearStoreResult = res.data.content.nearStoreResult.items
        nearStoreResult.forEach((v, i) => {
          if (nearStoreResult[i].distance >= 0.5 && nearStoreResult[i].distance < 1) {
            nearStoreResult[i].distance = nearStoreResult[i].distance + 'm'
          } else if (nearStoreResult[i].distance < 0.5) {
            nearStoreResult[i].distance = that.data.tempText + 500 + 'm'
          } else if (nearStoreResult[i].distance >= 1) {
            nearStoreResult[i].distance = (nearStoreResult[i].distance).toFixed(1) + 'km'
          }
        })
        that.setData({
          recommendedStore: res.data.content.nearStoreResult.items
        })
      }
    })
  },
  getRecommendedStore() {
    let that = this
    let pageNumber = that.data.pageNumber + 1
    let data = {
      pageSize: that.data.pageSize,
      pageNumber: pageNumber,
      scope: that.data.scope,
      sortFlag: that.data.sortFlag,
      underLine: that.data.underLine,
      sortBy: that.data.sortBy,
      businessId: that.data.businessId,
      distance: that.data.distance,
      longitude: that.data.nearList.longitude,
      latitude: that.data.nearList.latitude
    }
    app.Util.ajax('mall/home/_search', data, 'GET').then((res) => {
      if (res.data.messageCode = 'MSG_1001') {
        if (res.data.content.nearStoreResult.items == '' && that.data.recommendedStore !== '') {
          that.setData({
            text: '已到底，去【寻商品】提交吧'
          })
        }
        let arr = that.data.recommendedStore
        let nearStoreResult = res.data.content.nearStoreResult.items
        nearStoreResult.forEach((v, i) => {
          if (nearStoreResult[i].distance >= 0.5 && nearStoreResult[i].distance < 1) {
            nearStoreResult[i].distance = nearStoreResult[i].distance + 'm'
          } else if (nearStoreResult[i].distance < 0.5) {
            nearStoreResult[i].distance = that.data.tempText + 500 + 'm'
          } else if (nearStoreResult[i].distance >= 1) {
            nearStoreResult[i].distance = (nearStoreResult[i].distance).toFixed(1) + 'km'
          }
          arr.push(nearStoreResult[i])
        })
        that.setData({
          recommendedStore: arr,
          pageNumber: pageNumber
        })
      }
    })
  },
  // 查看更多优惠拼团
  toMakeGroup() {
    wx.navigateTo({
      url: '/packageA/pages/takeoutHomeage/takeoutHomeage',
    })
  },
  // 查看更多推荐店铺
  toNearbyStore() {
    let that = this
    if (that.data.current == 0) {
      let nearList = JSON.stringify(that.data.nearList)
      wx.navigateTo({
        url: '/packageB/pages/makeGroup/makeGroup?nearList=' + nearList,
      })
    } else if (that.data.current == 1) {
      let nearList = JSON.stringify(that.data.nearList)
      wx.navigateTo({
        url: '/packageB/pages/nearbyStore/nearbyStore?nearList=' + nearList,
      })
    }
  },
  // 跳转到有拼团的商家首页
  toTakePages() {
    wx.navigateTo({
      url: '/packageB/pages/takePages/takePages',
    })
  },
  // 跳转到拼团套餐详情
  toSetmealDetails(e) {
    wx.navigateTo({
      url: '/packageB/pages/setmealDetails/setmealDetails?id=' + e.currentTarget.dataset.id,
    })
  },
  // 切换精选商品和推荐店铺
  switchNav: function(e) {
    let that = this
    let cur = e.currentTarget.dataset.index; //导航栏数组的index
    that.setData({
      current: cur,
      text: '',
      pageNumber: 1
    })
    if (that.data.current == 0) {
      that.selectedGoods();
    } else if (that.data.current == 1) {
      that.recommendedStore();
    }
  },
  // 初始化定位
  initLocation() {
    let that = this
    that.mapCtx = wx.createMapContext('myMap')
    qqmapsdk = new QQMapWX({
      key: 'ZWQBZ-ZTYL4-V2MUB-D4U7V-BZ6F7-NVF6X'
    });
    wx.getLocation({
      type: 'gcj02',
      success(res) {
        if (app.globalData.location == 0) {
          const latitude = res.latitude.toFixed(6)
          const longitude = res.longitude.toFixed(6)
          const speed = res.speed
          const accuracy = res.accuracy
          qqmapsdk.reverseGeocoder({
            location: {
              latitude: latitude,
              longitude: longitude
            },
            success: function(res) {
              that.setData({
                latitude: latitude,
                longitude: longitude,
                currentRegion: res.result.address_component,
                keyword: that.data.defaultKeyword
              })
              that.nearby_search();
            },
          });
        } else {
          app.globalData.location = 0
          const latitude = that.data.latitude
          const longitude = that.data.longitude
          qqmapsdk.reverseGeocoder({
            location: {
              latitude: latitude,
              longitude: longitude
            },
            success: function(res) {
              that.setData({
                latitude: latitude,
                longitude: longitude,
                currentRegion: res.result.address_component,
                keyword: that.data.defaultKeyword
              })
              that.nearby_search();
            },
          });
        }
      },
      fail(err) {
        if (that.data.content.length == 0) {
          const latitude = 30.67
          const longitude = 104.07
          qqmapsdk.reverseGeocoder({
            location: {
              latitude: latitude,
              longitude: longitude
            },
            success: function(res) {
              that.setData({
                latitude: latitude,
                longitude: longitude,
                currentRegion: res.result.address_component,
                keyword: that.data.defaultKeyword
              })
              that.nearby_search();
            },
          });
        } else {
          const latitude = that.data.content[0].lat
          const longitude = that.data.content[0].lng
          qqmapsdk.reverseGeocoder({
            location: {
              latitude: latitude,
              longitude: longitude
            },
            success: function(res) {
              that.setData({
                latitude: latitude,
                longitude: longitude,
                currentRegion: res.result.address_component,
                keyword: that.data.defaultKeyword
              })
              that.nearby_search();
            },
          });
        }
        wx.setStorageSync('is_first', true)
      }
    })
  },
  initAddress: function() {
    let that = this
    app.Util.ajax('mall/personal/underAddressInfo', null, 'GET').then((res) => {
      if (res.data.messageCode == 'MSG_1001') {
        that.setData({
          content: res.data.content
        })
      }
    })
  },
  nearby_search: function() {
    var that = this;
    qqmapsdk.search({
      keyword: that.data.keyword,
      location: that.data.latitude + ',' + that.data.longitude,
      page_size: 1,
      page_index: 1,
      success: function(res) {
        var sug = [];
        for (var i = 0; i < res.data.length; i++) {
          sug.push({
            title: res.data[i].title,
            id: res.data[i].id,
            addr: res.data[i].address,
            province: res.data[i].ad_info.province,
            city: res.data[i].ad_info.city,
            district: res.data[i].ad_info.district,
            latitude: res.data[i].location.lat,
            longitude: res.data[i].location.lng
          });
        }
        that.setData({
          nearList: sug[0]
        })
        // 精选商品
        that.selectedGoods();
      },
      fail: function(res) {

      },
      complete: function(res) {

      }
    });
  },
  // 去定位
  jumpLocation(e) {
    wx.navigateTo({
      url: '/packageA/pages/addressLocation/addressLocation?title=' + e.currentTarget.dataset.address,
    })
  },
  // 去搜索
  toSearch() {
    wx.navigateTo({
      url: '/packageA/pages/storeSearch/storeSearch',
    })
  },
})