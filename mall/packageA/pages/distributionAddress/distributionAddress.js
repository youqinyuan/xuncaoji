// packageA/pages/distributionAddress/distributionAddress.js
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hostUrl: app.Util.getUrlImg().hostUrl,
    storeId:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.storeId){
      this.setData({
        storeId:options.storeId
      })
    }
  },
  init:function(){
    let that = this
    app.Util.ajax('mall/personal/underAddressInfo', null, 'GET').then((res) => {
      if (res.data.messageCode == 'MSG_1001') {
        that.setData({
          content:res.data.content,
        })
      }else{
        wx.showToast({
          title:res.data.message,
          icon:'none'
        })
      }
    })
  },
  init2:function(){
    let that = this
    app.Util.ajax('mall/bag/queryAddressBook', {
      storeId:that.data.storeId
    }, 'GET').then((res) => {
      if (res.data.messageCode == 'MSG_1001') {
        that.setData({
          content3:res.data.content.canUse,
          content2:res.data.content.notUse,
        })
      }else{
        wx.showToast({
          title:res.data.message,
          icon:'none'
        })
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
    let that = this
    if(that.data.storeId){
      that.init2()
    }else{
      that.init()
    }
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
  modifyAddress:function(e){
    let that = this
    let type= e.currentTarget.dataset.type
    let temp = {}
    if(type==1){
       temp = that.data.content[e.currentTarget.dataset.index]
    }else if(type==2){
       temp = that.data.content3[e.currentTarget.dataset.index]
    }else{
       temp = that.data.content2[e.currentTarget.dataset.index]
    }
    wx.navigateTo({
      url: '/packageA/pages/modifyAdress/modifyAdress?receiverName='+temp.receiverName+'&mobileNumber='+temp.mobileNumber+'&detailedAddress='+temp.detailedAddress+'&houseNumber='+temp.houseNumber+'&id='+temp.id+'&lng='+temp.lng+'&lat='+temp.lat,
    })
  },
  setDistribution:function(){
    let that = this
    let length1 = that.data.content?that.data.content.length:0
    let length2 = that.data.content2?that.data.content3.length+that.data.content2.length:0
    if(length1>=10||length2>=10){
      wx.showToast({
        title:'地址数量已达上限',
        icon:'none'
      })
    }else{
      wx.navigateTo({
        url: '/packageA/pages/setDisbutionAddress/setDisbutionAddress',
      })
    }
  },
  toBack:function(e){
    let that = this
    let index = e.currentTarget.dataset.index
    let temp = that.data.content3[index]
    wx.setStorageSync("distributionAddress",temp)
    wx.navigateBack({
      delta: 1
    })
  }
})