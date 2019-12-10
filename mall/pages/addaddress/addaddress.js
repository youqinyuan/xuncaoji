let app = getApp()
Page({

  data: {
    switchChecked: false,//默认按钮
    name: '',//姓名
    phoneNumber: '',//电话号码
    detailAddress: '',//详细地址
    city: '',//所在区域
    cityPickerValue: [],
    cityPickerIsShow: false,
    showDialog: false,//确认收货地址弹框
    is_ios:false, //登录机型是否是ios
  },

  onLoad: function (options) {
    // 页面显示
    var that = this
    //判断用户机型是ios还是安卓，去除textarea在ios上默认的上间隙问题
    var phone = wx.getSystemInfoSync()
    if (phone.platform == 'ios') {
      that.setData({
        is_ios: true
      })
    } else if (phone.platform == 'android') {
      that.setData({
        is_ios: false
      })
    }


  },
  onReady: function () {
  },
  //查询省市

  onShow: function () {

  },

  onHide: function () {

    // 页面隐藏

  },

  onUnload: function () {

    // 页面关闭

  },

  //获取输入框的值
  bindName: function (e) {
    var that = this
    that.setData({
      name: e.detail.value
    })
  },
  bindNumber: function (e) {
    var that = this
    that.setData({
      phoneNumber: e.detail.value
    })
  },
  bindDetail: function (e) {
    var that = this
    that.setData({
      detailAddress: e.detail.value
    })
  },
  //默认按钮
  switchChange: function (e) {
    var that = this
    var value = e.detail.value
    that.setData({
      switchChecked: value
    })
    console.log(that.data.switchChecked)
  },
  submit: function () {
    var that = this
    if (that.data.name == '') {
      wx.showToast({
        title: '请填写收货人姓名',
        icon: 'none'
      })
    } else if (that.data.phoneNumber == '' || !(/^1[3456789]\d{9}$/.test(that.data.phoneNumber))) {
      wx.showToast({
        title: '请填写正确的手机号码',
        icon: 'none'
      })
    } else if (that.data.city == '') {
      wx.showToast({
        title: '请选择所在地区',
        icon: 'none'
      })
    } else if (that.data.detailAddress == '') {
      wx.showToast({
        title: '请填写详细地址',
        icon: 'none'
      })
    }else if (that.data.phoneNumber !== '' && that.data.phoneNumber !== '' && that.data.city !== '' && that.data.detailAddress !== '') {
      that.setData({
        showDialog: true
      })
    }
  },
  comfirm: function () {
    var that = this
    var id = that.data.cityPickerValue[2]
    app.Util.ajax('mall/personal/updateAddressInfo', { receiverName: that.data.name, mobileNumber: that.data.phoneNumber, detailedAddress: that.data.detailAddress, districtId: id, isDefault: that.data.switchChecked ? 1 : 2 }, 'POST').then((res) => { // 使用ajax函数
      if (res.data.content) {
        wx.showToast({
          title: '保存成功',
          icon: 'none'
        })
        that.setData({
          showDialog: false,
          name: '',//姓名
          phoneNumber: '',//电话号码
          detailAddress: '',//详细地址
          city: '',//所在区域
        })
        //保存成功后跳转到我的地址页面
        wx.navigateBack({
          delta: 1
        })
      } else {
        wx.showToast({
          title: res.data.message,
          icon: 'none'
        })
      }
    })
  },
  reject: function (e) {
    this.setData({
      showDialog: false
    })
  },
  /**
   * 城市选择确认
   */
  cityPickerOnSureClick: function (e) {
    this.setData({
      city: e.detail.valueName[0] + e.detail.valueName[1] + e.detail.valueName[2],
      cityPickerValue: e.detail.valueCode,
      cityPickerIsShow: false,
    });
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