// packageA/pages/bankAccount/bankAccount.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
  next:function(e){
    let that = this
    console.log(e.detail.value)
    if(e.detail.value.bankAddress==''){
      wx.showToast({
        title:'请填写开户行',
        icon:'none'
      })
    }else if(e.detail.value.realName==''){
      wx.showToast({
        title:'请填写收款人',
        icon:'none'
      })
    }else if(e.detail.value.bankCardNumber==''){
      wx.showToast({
        title:'请填写银行卡账号',
        icon:'none'
      })
    }else{
      app.globalData.moveData.bankAddress = e.detail.value.bankAddress
      app.globalData.moveData.realName = e.detail.value.realName
      app.globalData.moveData.bankCardNumber = e.detail.value.bankCardNumber
      let pages = getCurrentPages(); //获取当前页面js里面的pages里的所有信息。
      let prevPage = pages[pages.length - 2]; 
      prevPage.setData({
        bankCardNumber:e.detail.value.bankCardNumber
      })
      wx.navigateBack({
        delta: 1
      })
    }
  },
    //获取银行卡号
    bindCardNum: function(e) {
      var that = this
      var cardNumber = e.detail.value
      that.setData({
        cardNumber: String(cardNumber)
      })
      var card = cardNumber.replace(/(\d{4})(?=\d)/g, "$1 "); //replace(/\s/g,'');
      this.setData({
        cardNum: card
      })
    },
})