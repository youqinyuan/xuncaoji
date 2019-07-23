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
    provinces: [],
    id:1,
    districtId:1,
    is_ios:false,//判断机型是不是ios
    is_checked:false, //判断是不是默认地址
  },
  // 页面初始化 options为页面跳转所带来的参数
  onLoad: function (options) {
    var that = this
    var province = options.province
    var city = options.city
    var district = options.district
    var name = options.name
    var number = options.number
    var detailed = options.detailed
    var id = options.id
    var districtId = options.districtId
    var index = parseInt(options.index)
    if(index===0){
      that.setData({
        name: name,
        phoneNumber: number,
        detailAddress: detailed,
        city: province + city + district,
        id: id,
        districtId: parseInt(districtId),
        switchChecked:true,
        is_checked:true
      })
    }else{
      that.setData({
        name: name,
        phoneNumber: number,
        detailAddress: detailed,
        city: province + city + district,
        id: id,
        districtId: parseInt(districtId),
        is_checked:false
      })
    }
    //判断用户机型是ios还是安卓，去除textarea在ios上默认的上间隙问题
    var phone = wx.getSystemInfoSync()
    if (phone.platform == 'ios'){
      that.setData({
        is_ios:true
      })
    } else if (phone.platform == 'android'){
      that.setData({
        is_ios:false
      })
    }

  },

  onReady: function () {

    // 页面渲染完成

  },

  onShow: function () {

    // 页面显示

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
  },
  submit: function () {
    var that = this
    if (that.data.name == '') {
      wx.showToast({
        title: '请填写姓名',
        icon: 'none'
      })
    } else if (that.data.phoneNumber == '') {
      wx.showToast({
        title: '请填写手机号码',
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
    }
    //默认地址不能取消提示
    if(that.data.is_checked){
      if (!that.data.switchChecked){
        wx.showToast({
          title: '必须设置一个生效的默认地址',
          icon:'none',
          duration: 1500
        })
        return;
      }
    }
    if (that.data.phoneNumber !== '' && that.data.phoneNumber !== '' && that.data.city !== '' && that.data.detailAddress !== ''){
      app.Util.ajax('mall/personal/updateAddressInfo', { id: that.data.id, receiverName: that.data.name, mobileNumber: that.data.phoneNumber, detailedAddress: that.data.detailAddress, districtId: that.data.districtId, isDefault: that.data.switchChecked ? 1 : 2 }, 'POST').then((res) => { 
        if (res.data.content) {
          wx.navigateBack({
            delta: 1
          })
        } else {
          
        }
      })
    }
  },
  /**
   * 城市选择确认
   */
  cityPickerOnSureClick: function (e) {
    this.setData({
      city: e.detail.valueName[0] + e.detail.valueName[1] + e.detail.valueName[2],
      cityPickerValue: e.detail.valueCode,
      districtId: e.detail.valueCode[2],
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
  },
})