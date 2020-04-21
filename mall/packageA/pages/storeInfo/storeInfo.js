// packageA/pages/storeInfo/storeInfo.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    adds: {},
    mobileNumber:'',
    bankCardNumber:'',
    hostUrl: app.Util.getUrlImg().hostUrl,
    logoKey:null,//店铺logo
    centerData:{},
    cityPickerIsShow:false,
    cityPickerValue: [],
    areaId:''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var moveData = app.globalData.moveData;
    this.setData({
      moveData: moveData
    })
  },

  onShow: function (){

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
  upimg: function() {
    var that = this
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      success: function(res) {
        const tempFilePaths = res.tempFilePaths[0]
        that.data.adds.avatarKey = tempFilePaths
        that.setData({
          avatarKey: that.data.adds.avatarKey,
          adds: that.data.adds,
          isUpHeader: true
        })
        that.upload()
      }
    })
  },
  toBlank:function(){
    wx.navigateTo({
      url: '/packageA/pages/bankAccount/bankAccount'
    })
  },
  toDoBusiness:function(){
    wx.navigateTo({
      url: '/packageA/pages/doBusiness/doBusiness'
    })
  },
  getCode:function(){
    let that = this
    if(that.data.mobileNumber==''&&!that.data.moveData.mobileNumber){
      wx.showToast({
        title:'请输入手机号',
        icon:'none'
      })
    }else{
      app.Util.ajax('mall/captcha/send', {
        mobileNumber: that.data.mobileNumber?that.data.mobileNumber:that.data.moveData.mobileNumber,
        business:3
      }, 'POST').then((res) => { // 使用ajax函数
        if (res.data.messageCode=="MSG_1001") {
          wx.showToast({
            title:'验证码已发送到您的手机',
            icon:'none'
          })
        }else{
          wx.showToast({
            title:res.data.message,
            icon:'none'
          })
        }
      })
    }
  },
  getPhone:function(e){
    console.log(e.detail.value)
    this.setData({
      mobileNumber:e.detail.value
    })
  },
  next:function(e){
    console.log(e.detail.value)
  },
  upload: function() {
    var that = this
    var token = wx.getStorageSync('token')
    wx.uploadFile({
      url: app.Util.getUrlImg().publicUrl+'mall/personal/uploadFile',
      filePath: that.data.avatarKey,
      name: 'file',
      header: {
        'token': token,
        "content-type": "multipart/form-data"
      },
      success: function(res) {
        that.setData({
          logoKey:JSON.parse(res.data).content.key
        })
      },
      fail: function(res) {
       
      }
    })
  },
  next:function(e){
    let that = this
    let token = wx.getStorageSync('token')
     console.log(e.detail.value)
     console.log(that.data.logoKey)
    if(!that.data.moveData.logoKey&&that.data.logoKey==null){
      wx.showToast({
        title:'请选择店铺logo',
        icon:'none'
      })
    }else if(e.detail.value.storeName==''){
      wx.showToast({
        title:'请填写店铺名称',
        icon:'none'
      })
    }else if(that.data.areaId==''&&!that.data.moveData.provinceId){
      wx.showToast({
        title:'请选择所在区域',
        icon:'none'
      })
    }else if(!that.data.centerData.addr&&!that.data.moveData.storeAddress){
      wx.showToast({
        title:'请在地图上选择位置',
        icon:'none'
      })
    }else if(e.detail.value.addressDetail==''){
      wx.showToast({
        title:'详细地址不能为空',
        icon:'none'
      })
    }else if(that.data.bankCardNumber==''&&!that.data.moveData.bankCardNumber){
      wx.showToast({
        title:'收款账号不能为空',
        icon:'none'
      })
    }else if(e.detail.value.referrerMobileNumber==''){
      wx.showToast({
        title:'请填写介绍人',
        icon:'none'
      })
    }else if(e.detail.value.mobileNumber==''){
      wx.showToast({
        title:'请填写联系人',
        icon:'none'
      })
    }else if(e.detail.value.code==''){
      wx.showToast({
        title:'验证码不能为空',
        icon:'none'
      })
    }else{
      app.Util.ajax('mall/merchant/checkMobileNumber', {
        mobile: e.detail.value.mobileNumber,
        referrerMobileNumber:e.detail.value.referrerMobileNumber,
        code:e.detail.value.code,
        areaId:that.data.areaId?that.data.areaId:that.data.moveData.areaId,
        lng:that.data.centerData.longitude?that.data.centerData.longitude:that.data.moveData.lng,
        lat:that.data.centerData.latitude?that.data.centerData.latitude:that.data.moveData.lat
      }, 'GET').then((res) => { // 使用ajax函数
        if (res.data.messageCode=="MSG_1001") {
          app.globalData.moveData.logoKey = that.data.logoKey?that.data.logoKey:that.data.moveData.logoKey //店铺logo
          app.globalData.moveData.storeName = e.detail.value.storeName  //店铺名称
          app.globalData.moveData.addressDetail = e.detail.value.addressDetail  //详细地址
          app.globalData.moveData.lng = that.data.centerData.longitude?that.data.centerData.longitude:that.data.moveData.lng //经度
          app.globalData.moveData.lat = that.data.centerData.latitude?that.data.centerData.latitude:that.data.moveData.lat  //纬度
          app.globalData.moveData.mobile = e.detail.value.mobileNumber  //联系人电话
          app.globalData.moveData.code = e.detail.value.code      //验证码
          app.globalData.moveData.referrerMobileNumber = e.detail.value.referrerMobileNumber  //邀请人
          app.globalData.moveData.areaId = that.data.areaId?that.data.areaId:that.data.moveData.areaId //区域id
          app.globalData.moveData.storeAddress = that.data.centerData.title?that.data.centerData.title:that.data.moveData.storeAddress //门店地址
          wx.navigateTo({
            url: '/packageA/pages/businessLicence/businessLicence'
          })
        }else{
          wx.showToast({
            title:res.data.message,
            icon:'none'
          })
        }
      })
      console.log(app.globalData.moveData)
    }
  },
    /**
   * 城市选择确认
   */
  cityPickerOnSureClick: function (e) {
    console.log(e)
    this.setData({
      city: e.detail.valueName[0] + e.detail.valueName[1] + e.detail.valueName[2],
      areaId: e.detail.valueCode[e.detail.valueCode.length-1],
      cityPickerIsShow: false,
    });
    console.log(this.data.areaId)
  },
  /**
   * 城市选择取消
   */
  cityPickerOnCancelClick: function (event) {
    this.setData({
      cityPickerIsShow: false,
    });
  },
  showCityPicker() {
    this.setData({
      cityPickerIsShow: true,
    });
  }
})