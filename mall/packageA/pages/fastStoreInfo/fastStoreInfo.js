// packageA/pages/fastStoreInfo/fastStoreInfo.js
const app = getApp()
const util = require('../../../utils/util.js') // 将工具函数导入进来
Page({

  /**
   * 页面的初始数据
   */
  data: {
    business:'',
    businessId:'',
    hostUrl: app.Util.getUrlImg().hostUrl,
    moveData:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options){
      this.setData({
        options:options
      })
    }
    var moveData = app.globalData.moveData;
    this.setData({
      moveData: moveData
    })
    console.log(moveData)
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
  toBusiness:function(){
    wx.navigateTo({
      url: '/packageA/pages/business/business'
    })
  },
  getPhone:function(e){
    console.log(e.detail.value)
    this.setData({
      mobileNumber:e.detail.value
    })
  },
  getCode:function(){
    let that = this
    if(that.data.mobileNumber==''&&!that.data.moveData.mobileNumber){
      wx.showToast({
        title:'请输入联系方式',
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
  next:function(e){
    let that = this
    let token = wx.getStorageSync('token')
     console.log(e.detail.value)
    if(e.detail.value.storeName==''){
      wx.showToast({
        title:'请填写店铺名称',
        icon:'none'
      })
    }else if(e.detail.value.userName==''){
      wx.showToast({
        title:'请填写店主姓名',
        icon:'none'
      })
    }else if(e.detail.value.number==''){
      wx.showToast({
        title:'请身份证号码',
        icon:'none'
      })
    }else if(that.data.businessId==''&&that.data.options.businessId==''&&that.data.moveData.businessId==''){
      wx.showToast({
        title:'请选择行业',
        icon:'none'
      })
    }else if(e.detail.value.referrerMobileNumber==''){
      wx.showToast({
        title:'请填写邀请人手机号',
        icon:'none'
      })
    }else if(e.detail.value.inviterCode==''){
      wx.showToast({
        title:'请填写邀请人邀请码',
        icon:'none'
      })
    }else if(e.detail.value.mobileNumber==''){
      wx.showToast({
        title:'请填写联系方式',
        icon:'none'
      })
    }else if(e.detail.value.code==''){
      wx.showToast({
        title:'验证码不能为空',
        icon:'none'
      })
    }else{
      app.Util.ajax('mall/merchant/preRegister', {
        type:2 ,//预入驻
        source:2,//注册渠道，小程序
        name:e.detail.value.userName,
        idNumber:e.detail.value.number,
        businessId:that.data.businessId?that.data.businessId:that.data.options.businessId?that.data.options.businessId:that.data.moveData.businessId,
        storeName:e.detail.value.storeName,
        mobile:e.detail.value.mobileNumber,
        code:e.detail.value.code,
        referrerMobileNumber:e.detail.value.referrerMobileNumber,
        inviterCode:e.detail.value.inviterCode
      }, 'POST').then((res) => { // 使用ajax函数
        if (res.data.messageCode=="MSG_1001") {
          wx.navigateTo({
            url: '/packageA/pages/fastSuccess/fastSuccess'
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
})