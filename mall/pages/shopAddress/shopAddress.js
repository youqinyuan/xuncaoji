// pages/shopAddress/shopAddress.js
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    city: '',//所在区域
    detailAddress:'',//详细地址
    cityPickerValue: [],
    cityPickerIsShow: false,
    provinces: [],
    hostUrl: app.Util.getUrlImg().hostUrl,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.Util.ajax('mall/personal/cityData', { provinceId: 5 }, 'GET').then((res) => { // 使用ajax函数
      if (res.messageCode = 'MSG_1001') {
        this.setData({
          provinces: res.data.content
        })
        wx.setStorageSync('provinces', res.data.content)
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
  //获取详细地址
  bindDetail: function (e) {
    var that = this
    that.setData({
      detailAddress: e.detail.value
    })
  },
//城市选择确认
  cityPickerOnSureClick: function (e) {
    this.setData({
      city: e.detail.valueName[0] + e.detail.valueName[1] + e.detail.valueName[2],
      cityPickerValue: e.detail.valueCode,
      cityPickerIsShow: false,
    });
    wx.setStorageSync('city',this.data.city)
  },
  //城市选择取消 
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
  comfirm:function(){
    var areaId = this.data.cityPickerValue[2]
    var addressDetail = this.data.detailAddress
    var infoList =  wx.getStorageSync('info')
    infoList.areaId = areaId
    infoList.addressDetail = addressDetail
    wx.setStorageSync('info', infoList)
    wx.showToast({
      title: '保存成功',
      icon:'none'
    })
  },
})