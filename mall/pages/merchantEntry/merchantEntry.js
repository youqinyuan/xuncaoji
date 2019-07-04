// pages/merchantEntry/merchantEntry.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    industry:{},
    fullName:'',
    identityNum:'',
    businessId:1
  },
  //获取值
  bindText:function(e){
    var that = this
    var name = e.detail.value
    that.setData({
      fullName:name
    })
  },
  bindNum:function(e){
    var that = this
    var number = e.detail.value
    that.setData({
      identityNum: number
    })
  },
  //跳转到下一步
  nextStep:function(e){
    var that = this
    if (that.data.fullName == ''){
      wx.showToast({
        title: '请输入正确的姓名',
        icon:'none'
      })
    }else if (that.data.identityNum == ''){
      wx.showToast({
        title: '实名认证失败，请修改',
        icon: 'none'
      })
    }
    var infoList = {}
    if (that.data.fullName !== '' && that.data.identityNum !== ''){
      app.Util.ajax(`mall/merchant/checkRegisterIdCard?name=${that.data.fullName}&idNumber=${that.data.identityNum}`, null,'PUT').then((res) => {
        if (res.data.message === '处理成功'){
          infoList.name = that.data.fullName
          infoList.idNumber = that.data.identityNum
          infoList.businessId = that.data.industry.businessId
          wx.setStorageSync('info', infoList)
          wx.navigateTo({
            url: '/pages/merchantEntry2/merchantEntry2',
          })
        }else{
          wx.showToast({
            title: res.data.message,
            icon: 'none'
          })
        }
      })
    }
    
  },
  //所属行业
  industry:function(e){
    wx.navigateTo({
      url: '/pages/merchantEntry1/merchantEntry1',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    wx.removeStorageSync('industry')
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
    var that = this
    that.setData({
      industry: wx.getStorageSync('industry') || {}
    })
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

  }
})