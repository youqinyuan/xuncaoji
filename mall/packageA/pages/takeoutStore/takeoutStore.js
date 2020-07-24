// packageA/pages/takeoutStore/takeoutStore.js
let QQMapWX = require('../qqmap-wx-jssdk1.2/qqmap-wx-jssdk.min.js');
const app = getApp()
let qqmapsdk;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTab: 0,
    keyword: '',
    nearList: null,
    defaultKeyword: '房产小区',
    hostUrl: app.Util.getUrlImg().hostUrl,
    navData: [],
    businessId: null, //行业id
    pageNumber: 1,
    pageSize: 15,
    navScrollLeft:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
    that.initCategories();
    if (options.id == 1 || !options.id){
      that.initStore();    
    }else{
      that.setData({
        businessId: options.id
      })
      that.initStore1();
    }
    that.initAddress();
    
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
    that.initLocation()
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
    if (that.data.currentTab == 0) {
      that.getMore()
    } else {
      that.getMore1()
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  initLocation() {
    let that = this
    that.mapCtx = wx.createMapContext('myMap')
    qqmapsdk = new QQMapWX({
      key: 'ZWQBZ-ZTYL4-V2MUB-D4U7V-BZ6F7-NVF6X'
    });
    wx.showLoading({
      title: '加载中'
    });
    wx.getLocation({
      type: 'gcj02',
      success(res) {
        wx.hideLoading({})
        if (app.globalData.location == 0) {
          const latitude = res.latitude
          const longitude = res.longitude
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
        wx.hideLoading({});
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
  //店铺细节
  initCategories() {
    let that = this;
    wx.request({
      url: app.Util.getUrlImg().publicUrl + 'mall/home/getMerchantBusinessList',
      method: "GET",
      data: null,
      header: {
        "content-type": 'application/json',
        token: '' || wx.getStorageSync('token'),
      },
      success: function(res) {
        if (res.data.messageCode === 'MSG_1001') {
          that.setData({
            navData: res.data.content
          })
         
          if(that.data.businessId){
            let query = wx.createSelectorQuery();
            let navData = that.data.navData
            query.selectAll('.nav-box').boundingClientRect(function (rect) {
              for (var i = 0; i < navData.length; i++) {
                if (navData[i].id==that.data.businessId){
                  that.setData({
                    currentTab: i,
                    navScrollLeft: rect[i].left,
                  })
                }
                
              }
            }).exec();
            that.setData({
              navData: navData
            })
          }
        }
      }
    })
  },
  // 店铺细节
  initStore() {
    let that = this;
    let data = {
      scope: 2,
      pageNumber: that.data.pageNumber,
      pageSize: that.data.pageSize,
      sortBy: 1,
      underLine: 1
    }
    wx.request({
      url: app.Util.getUrlImg().publicUrl + 'mall/home/_search',
      method: "GET",
      data: data,
      header: {
        "content-type": 'application/json',
        token: '' || wx.getStorageSync('token'),
      },
      success: function(res) {
        if (res.data.messageCode === 'MSG_1001') {
          that.setData({
            nearbyResult: res.data.content.nearStoreResult.items
          })
        }
      }
    })
  },
  //全部加载更多
  getMore: function() {
    let that = this
    let pageNumber = that.data.pageNumber + 1
    let data = {
      scope: 2,
      pageNumber: pageNumber,
      pageSize: that.data.pageSize,
      sortBy: 1,
      underLine: 1
    }
    app.Util.ajax('mall/home/_search', data, 'GET').then((res) => { // 使用ajax函数
      if (res.messageCode = 'MSG_1001') {
        if (res.data.content.nearStoreResult.items == '' && that.data.nearbyResult !== '') {
          wx.showToast({
            title: '已经到底啦',
            icon: 'none'
          })
        }
        let arr = that.data.nearbyResult
        for (let i = 0; i < res.data.content.nearStoreResult.items.length; i++) {
          arr.push(res.data.content.nearStoreResult.items[i])
        }
        that.setData({
          nearbyResult: arr,
          pageNumber: pageNumber
        })
      }
    })
  },
  initStore1() {
    let that = this;
    let data = {
      scope: 2,
      pageNumber: that.data.pageNumber,
      pageSize: that.data.pageSize,
      sortBy: 1,
      businessId: that.data.businessId,
      underLine: 1
    }
    wx.request({
      url: app.Util.getUrlImg().publicUrl + 'mall/home/_search',
      method: "GET",
      data: data,
      header: {
        "content-type": 'application/json',
        token: '' || wx.getStorageSync('token'),
      },
      success: function(res) {
        if (res.data.messageCode === 'MSG_1001') {
          that.setData({
            nearbyResult: res.data.content.nearStoreResult.items
          })
        }
      }
    })
  },
  //分类加载更多
  getMore1: function() {
    let that = this
    let pageNumber = that.data.pageNumber + 1
    let data = {
      scope: 2,
      pageNumber: pageNumber,
      pageSize: that.data.pageSize,
      sortBy: 1,
      businessId: that.data.businessId,
      underLine: 1
    }
    app.Util.ajax('mall/home/_search', data, 'GET').then((res) => { // 使用ajax函数
      if (res.messageCode = 'MSG_1001') {
        if (res.data.content.nearStoreResult.items == '' && that.data.nearbyResult !== '') {
          wx.showToast({
            title: '已经到底啦',
            icon: 'none'
          })
        }
        let arr = that.data.nearbyResult
        for (let i = 0; i < res.data.content.nearStoreResult.items.length; i++) {
          arr.push(res.data.content.nearStoreResult.items[i])
        }
        that.setData({
          nearbyResult: arr,
          pageNumber: pageNumber
        })
      }
    })
  },
  nearby_search: function() {
    var that = this;
    wx.showLoading({
      title: '加载中'
    });
    qqmapsdk.search({
      keyword: that.data.keyword,
      location: that.data.latitude + ',' + that.data.longitude,
      page_size: 1,
      page_index: 1,
      success: function(res) {
        wx.hideLoading();
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
      },
      fail: function(res) {

      },
      complete: function(res) {

      }
    });
  },
  switchNav(e) {
    let that = this;
    let index = e.currentTarget.dataset.index
    let id = e.currentTarget.dataset.id
    that.setData({
      currentTab: index,
      businessId: id,
      pageNumber: 1,
    })
    if (that.data.currentTab == 0) {
      that.initStore()
    } else {
      that.initStore1()
    }
  },
  jumpLocation(e) {
    wx.navigateTo({
      url: '/packageA/pages/addressLocation/addressLocation?title=' + e.currentTarget.dataset.address,
    })
  },
  toSearch() {
    wx.navigateTo({
      url: '/packageA/pages/storeSearch/storeSearch',
    })
  },
  businessInfo(e) {
    if (e.currentTarget.dataset.count == 0) {
      wx.navigateTo({
        url: '/packageA/pages/businessInfo/businessInfo?storeId=' + e.currentTarget.dataset.id,
      })
    } else {
      wx.navigateTo({
        url: '/packageA/pages/takeoutHomeage/takeoutHomeage?storeId=' + e.currentTarget.dataset.id,
      })
    }

  },
})