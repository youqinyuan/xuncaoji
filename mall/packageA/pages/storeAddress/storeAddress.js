// packageA/pages/storeAddress/storeAddress.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hostUrl: app.Util.getUrlImg().hostUrl,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  onShow: function (){
    var moveData = app.globalData.moveData;

    this.setData({
      moveData: moveData
    })
  },

  hrefMap: function (){
    this.getLocation();
    var longitude = wx.getStorageSync('longitude');
    if(longitude){
      wx.navigateTo({
        url: '/packageA/pages/map/map'
      })
    }else{
      this.getLocation();
    }
  },

  /**
   * 获取当前位置信息
   * */
  getLocation: function () {
    var that = this;
    wx.getLocation({
      type: 'wgs84',
      altitude: true,
      success: function (res) {
        var longitude = res.longitude
        var latitude = res.latitude

        wx.setStorageSync('longitude', longitude);
        wx.setStorageSync('latitude', latitude);

        that.get_province_name(latitude, longitude, function (data) {
          var city = data.data.regeocode.addressComponent.city; //市
          var cityCode = data.data.regeocode.addressComponent.adcode;

          //设置默认市
          wx.setStorageSync('city', city);
          wx.setStorageSync('cityCode', cityCode);
        })
      },
      fail: function (res) {
        var is_first = wx.getStorageSync('is_first')
        if (is_first) {
          wx.showModal({
            title: '获取位置信息',
            content: '是否允许获取你的地理位置呢？',
            success: function (res) {
              if (res.confirm) {
                wx.getSetting({
                  success(res) {
                    if (!res.authSetting['scope.userLocation']) {
                      wx.openSetting({
                        success: function (res) {
                          var is_agree = res.authSetting['scope.userLocation']
                          if (is_agree) {
                            wx.getLocation({
                              type: 'wgs84',
                              success: function (res) {
                                var longitude = res.longitude
                                var latitude = res.latitude

                                //获取地址信息，如果不需要，可以删除该段代码
                                that.get_province_name(latitude, longitude, function (data) {
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
                        fail: function (res) {
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

  get_province_name: function (latitude, longitude, callback){
    var that = this;
    wx.request({
      url: 'https://restapi.amap.com/v3/geocode/regeo?key=3463e52d39490a74a0b1354ed3e99289&location=' + longitude + ',' + latitude + '&output=json',
      data: {},
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        var city = res.data.regeocode.addressComponent.city;
        callback(res)
      },
      fail: function (res) {
        callback('定位失败')
      }

    })
  }

})