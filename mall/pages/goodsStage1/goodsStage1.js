// pages/goodsStage1/goodsStage1.js
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hostUrl: app.Util.getUrlImg().hostUrl,
    city: '',//所在区域
    cityPickerValue: [],
    cityPickerIsShow: false,
    goodsMessage:null,
    auto_height:true,
    isShowText:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
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
    var goodsMessage = wx.getStorageSync('goodsMessage')
    wx.setStorageSync('goodsMessage', goodsMessage)
    that.setData({
      goodsMessage: goodsMessage
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
  areablur:function(e){
    var that = this
    console.log(e)
    that.setData({
      auto_height:false
    })
  },
  areafocus: function (e) {
    var that = this
    console.log(e)
    that.setData({
      auto_height: true
    })
  },
  //获取职位
  getJobTitle: function (e) {
    var goodsMessage = wx.getStorageSync('goodsMessage')
    goodsMessage.jobTitle = e.detail.value
    wx.setStorageSync('goodsMessage', goodsMessage)
  },
  //邮箱
  getEmail: function (e) {
    var goodsMessage = wx.getStorageSync('goodsMessage')
    goodsMessage.email = e.detail.value
    wx.setStorageSync('goodsMessage', goodsMessage)
  },
  //公司名称
  getCompanyName: function (e) {
    var goodsMessage = wx.getStorageSync('goodsMessage')
    goodsMessage.companyName = e.detail.value
    wx.setStorageSync('goodsMessage', goodsMessage)
  },
  //公司电话
  getCompanyTel: function (e) {
    var goodsMessage = wx.getStorageSync('goodsMessage')
    goodsMessage.companyTel = e.detail.value
    wx.setStorageSync('goodsMessage', goodsMessage)
  },
  //详细地址
  getDetail: function (e) {
    var goodsMessage = wx.getStorageSync('goodsMessage')
    goodsMessage.detailedAddress = e.detail.value
    wx.setStorageSync('goodsMessage', goodsMessage)
  },
  nexStep: function () {
    var goodsMessage = wx.getStorageSync('goodsMessage')
    if (!(/^[\u4e00-\u9fa5a-z]+$/gi).test(goodsMessage.jobTitle)) {
      wx.showToast({
        title: '请填写正确的职位',
        icon: 'none'
      })
    } else if (!(/^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/).test(goodsMessage.email)) {
      wx.showToast({
        title: '请输入正确的邮箱',
        icon: 'none'
      })
    } else if (!goodsMessage.companyName) {
      wx.showToast({
        title: '请输入公司名称',
        icon: 'none'
      })
    } else if (!goodsMessage.companyTel) {
      wx.showToast({
        title: '请输入公司电话',
        icon: 'none'
      })
    } else if (!goodsMessage.provinceId && !goodsMessage.cityId && !goodsMessage.districtId) {
      wx.showToast({
        title: '请选择工作地址',
        icon: 'none'
      })
    } else if (!goodsMessage.detailedAddress) {
      wx.showToast({
        title: '请输入详细地址',
        icon: 'none'
      })
    } else if (goodsMessage.jobTitle && goodsMessage.email && goodsMessage.companyName && goodsMessage.companyTel && goodsMessage.provinceId && goodsMessage.cityId && goodsMessage.districtId && goodsMessage.detailedAddress) {
      wx.navigateTo({
        url: '/pages/goodsStage2/goodsStage2',
      })
    } else {
      wx.showToast({
        title: '请完整填写内容',
        icon: 'none'
      })
    }
  },
  //城市选择确认  
  cityPickerOnSureClick: function (e) {
    var that = this
    that.setData({
      isShowText: true,
      auto_height: true,
      city: e.detail.valueName[0] + e.detail.valueName[1] + e.detail.valueName[2],
      cityPickerValue: e.detail.valueCode,
      cityPickerIsShow: false,
    });
    var goodsMessage = wx.getStorageSync('goodsMessage')    
    goodsMessage.provinceId = e.detail.valueCode[0]
    goodsMessage.cityId = e.detail.valueCode[1]
    goodsMessage.districtId = e.detail.valueCode[2]
    goodsMessage.districtName = e.detail.valueName[0] + ' ' + e.detail.valueName[1] + ' ' + e.detail.valueName[2]
    that.setData({
      goodsMessage: goodsMessage
    })
    wx.setStorageSync('goodsMessage', goodsMessage)
    console.log(that.data.isShowText)
  },
  //城市选择取消   
  cityPickerOnCancelClick: function (event) {
    var that = this
    that.setData({
      cityPickerIsShow: false,
      isShowText:true,
      auto_height: true
    });
  },
  showCityPicker() {
    var that = this
    that.setData({
      cityPickerIsShow: true,
      isShowText: false
    });
  },
})