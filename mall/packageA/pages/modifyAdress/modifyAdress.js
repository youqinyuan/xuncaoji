// packageA/pages/modifyAdress/modifyAdress.js
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    centerData:{},
    shurePeriod:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    that.setData({
      receiverName:options.receiverName,
      mobileNumber:options.mobileNumber,
      detailedAddress:options.detailedAddress,
      houseNumber:options.houseNumber,
      id:options.id,
      lng:options.lng,
      lat:options.lat,
    })

  },
  hrefMap: function (){
    this.getLocation();
  },

  /**
   * 获取当前位置信息
   * */
  getLocation: function () {
    var that = this;
    wx.getLocation({
      type: 'gcj02',
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
        var longitude = wx.getStorageSync('longitude');
        if(longitude){
          wx.navigateTo({
            url: '/packageA/pages/map/map'
          })
        }else{
          this.getLocation();
        }
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
                              type: 'gcj02',
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
  deleteAddress:function(){
    let that = this
    app.Util.ajax('mall/personal/deleteAddress?id='+that.data.id, null, 'DELETE').then((res) => { 
      if (res.data.messageCode=="MSG_1001") {
        wx.showToast({
          title:'删除成功',
          icon:'none'
        })
        setTimeout(function(){
          wx.navigateBack({
            delta: 1
          })
        },500)
      }else{
        wx.showToast({
          title:res.data.message,
          icon:'none'
        })
      }
    })
  },
  save:function(e){
    let that = this
    if(e.detail.value.receiverName==''){
      wx.showToast({
        title:'请填写收货人姓名',
        icon:'none'
      })
    }else if(e.detail.value.mobileNumber==''){
      wx.showToast({
        title:'请填写收货人电话',
        icon:'none'
      })
    }else if(e.detail.value.detailedAddress==''){
      console.log(22)
      wx.showToast({
        title:'请选择配送收货地址',
        icon:'none'
      })
    }else if(e.detail.value.houseNumber==''){
      wx.showToast({
        title:'请填写门牌号',
        icon:'none'
      })
    }else{
      app.Util.ajax('mall/personal/updateAddressInfo', {
        id:that.data.id,
        mobileNumber: e.detail.value.mobileNumber,
        receiverName:e.detail.value.receiverName,
        detailedAddress:that.data.centerData.addr?that.data.centerData.addr:e.detail.value.detailedAddress,
        houseNumber:e.detail.value.houseNumber,
        addressType:2,
        lng:that.data.centerData.longitude?that.data.centerData.longitude:that.data.lng,
        lat:that.data.centerData.latitude?that.data.centerData.latitude:that.data.lat
      }, 'POST').then((res) => { 
        if (res.data.messageCode=="MSG_1001") {
          wx.showToast({
            title:'修改成功',
            icon:'none'
          })
          setTimeout(function(){
            wx.navigateBack({
              delta: 1
            })
          },500)
        }else{
          wx.showToast({
            title:res.data.message,
            icon:'none'
          })
        }
      })
    }
  },
  show:function(){
    this.setData({
      shurePeriod:true
    })
  },
  close:function(){
    this.setData({
      shurePeriod:false
    })
  }
})