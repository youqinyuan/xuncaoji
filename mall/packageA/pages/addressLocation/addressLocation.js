// packageA/pages/addressLocation/addressLocation.js
let QQMapWX = require('../../../utils/qqmap-wx-jssdk1.2/qqmap-wx-jssdk.min.js');
const app = getApp()
let qqmapsdk;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hostUrl: app.Util.getUrlImg().hostUrl,
    nearList: {},
    keyword: '',
    defaultKeyword: '房产小区',
    initAddress: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this
    that.setData({
      nearList: options
    })
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
    let that = this;
    if (app.globalData.addLocation == 1) {
      that.reLocation()
      app.globalData.addLocation = 0
    }
    that.initAddress()
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  initAddress: function() {
    let that = this
    app.Util.ajax('mall/personal/underAddressInfo', null, 'GET').then((res) => {
      if (res.data.messageCode == 'MSG_1001') {
        that.setData({
          initAddress: res.data.content
        })
      }
    })
  },
  jumpLocation(e) {
    let that = this
    that.mapCtx = wx.createMapContext('myMap')
    qqmapsdk = new QQMapWX({
      key: 'ZWQBZ-ZTYL4-V2MUB-D4U7V-BZ6F7-NVF6X'
    });
    const latitude = e.currentTarget.dataset.lat
    const longitude = e.currentTarget.dataset.lng
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
        //获取页面栈
        let pages = getCurrentPages()
        //给上一个页面设置状态
        let curPage = pages[pages.length - 2];
        let data = curPage.data;
        curPage.setData({
          latitude: latitude,
          longitude: longitude
        });
        app.globalData.location = 1
        wx.navigateBack({})
      },
    });
  },
  reLocation() {
    let that = this;
    that.data.nearList.title = '定位中…'
    that.setData({
      nearList: that.data.nearList
    })
    that.mapCtx = wx.createMapContext('myMap')
    qqmapsdk = new QQMapWX({
      key: 'ZWQBZ-ZTYL4-V2MUB-D4U7V-BZ6F7-NVF6X'
    });
    //定位
    wx.getLocation({
      type: 'gcj02',
      success(res) {
        console.log(res)
        const latitude = res.latitude.toFixed(6)
        const longitude = res.longitude.toFixed(6)
        const speed = res.speed
        const accuracy = res.accuracy
        console.log(latitude, longitude)
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
      },
      fail: function(res) {
        var is_first = wx.getStorageSync('is_first')
        if (is_first) {
          wx.showModal({
            title: '',
            content: '外卖送餐需要您的地理地址',
            success: function(res) {
              if (res.confirm) {
                app.globalData.addLocation = 1
                wx.getSetting({
                  success(res) {
                    if (!res.authSetting['scope.userLocation']) {
                      wx.openSetting({
                        success: function(res) {
                          var is_agree = res.authSetting['scope.userLocation']
                          if (is_agree) {
                            wx.getLocation({
                              type: 'gcj02',
                              success: function(res) {
                                that.nearby_search();
                              }
                            })

                          } else {
                            //用户拒绝位置授权
                          }

                        },
                        fail: function(res) {
                          //用户拒绝位置授权
                        }
                      })
                    }
                  }
                })
              }
              if (res.cancel) {
                //用户拒绝位置授权
              }

            }
          })
        } else {
          //用户拒绝位置授权


        }
      }
    })
  },
  // 根据关键词搜索附近位置
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
  hrefMap: function() {
    this.getLocation();
  },

  /**
   * 获取当前位置信息
   * */
  getLocation: function() {
    var that = this;
    wx.getLocation({
      type: 'gcj02',
      altitude: true,
      success: function(res) {
        var longitude = res.longitude
        var latitude = res.latitude
        wx.setStorageSync('longitude', longitude);
        wx.setStorageSync('latitude', latitude);

        that.get_province_name(latitude, longitude, function(data) {
          var city = data.data.regeocode.addressComponent.city; //市
          var cityCode = data.data.regeocode.addressComponent.adcode;
          //设置默认市
          wx.setStorageSync('city', city);
          wx.setStorageSync('cityCode', cityCode);
        })
        var longitude = wx.getStorageSync('longitude');
        if (longitude) {
          wx.navigateTo({
            url: '/packageA/pages/map/map'
          })
          app.globalData.searchLocation = 1
        } else {
          this.getLocation();
        }
      },
      fail: function(res) {
        var is_first = wx.getStorageSync('is_first')
        if (is_first) {
          wx.showModal({
            title: '获取位置信息',
            content: '是否允许获取你的地理位置呢？',
            success: function(res) {
              if (res.confirm) {
                wx.getSetting({
                  success(res) {
                    if (!res.authSetting['scope.userLocation']) {
                      wx.openSetting({
                        success: function(res) {
                          var is_agree = res.authSetting['scope.userLocation']
                          if (is_agree) {
                            wx.getLocation({
                              type: 'gcj02',
                              success: function(res) {
                                var longitude = res.longitude
                                var latitude = res.latitude

                                //获取地址信息，如果不需要，可以删除该段代码
                                that.get_province_name(latitude, longitude, function(data) {
                                  var city = data.data.regeocode.addressComponent.city; //市
                                  var cityCode = data.data.regeocode.addressComponent.adcode;

                                  //设置默认市
                                  wx.setStorageSync('city', city);
                                  wx.setStorageSync('cityCode', cityCode);
                                })
                              }
                            })
                          } else {
                            //用户拒绝位置授权
                          }

                        },
                        fail: function(res) {
                          //用户拒绝位置授权
                        }
                      })
                    }
                  }
                })
              }
              if (res.cancel) {
                //用户拒绝位置授权
              }

            }
          })
        } else {
          //用户拒绝位置授权
          wx.setStorageSync('is_first', true)
        }
      }
    })
  },

  get_province_name: function(latitude, longitude, callback) {
    var that = this;
    wx.request({
      url: 'https://restapi.amap.com/v3/geocode/regeo?key=3463e52d39490a74a0b1354ed3e99289&location=' + longitude + ',' + latitude + '&output=json',
      data: {},
      header: {
        'Content-Type': 'application/json'
      },
      success: function(res) {
        var city = res.data.regeocode.addressComponent.city;
        callback(res)
      },
      fail: function(res) {
        callback('定位失败')
      }

    })
  },
})