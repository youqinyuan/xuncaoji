// pages/chooseMoney/chooseMoney.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    buttonStatus:2,
    startMoney:100,
    endMoney:10000
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(wx.getStorageSync('startMoney')||wx.getStorageSync('endMoney')){
      this.setData({
        startMoney:wx.getStorageSync('startMoney'),
        endMoney:wx.getStorageSync('endMoney'),
        buttonStatus:2
      })
    }
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
  startMoney:function(e){
    var that = this
    that.setData({
      startMoney:e.detail.value
    })
    if(that.data.startMoney!==""||that.data.endMoney!==""){
      that.setData({
        buttonStatus:2
      })
    }else{
      that.setData({
        buttonStatus:1
      })
    }
  },
  endMoney:function(e){
    var that = this
    that.setData({
      endMoney:e.detail.value
    })
    if(that.data.startMoney!==""||that.data.endMoney!==""){
      that.setData({
        buttonStatus:2
      })
    }else{
      that.setData({
        buttonStatus:1
      })
    }
  },
  clear:function(){
    this.setData({
      buttonStatus:1,
      endMoney:"",
      startMoney:""
    })
  },
  toWait:function(){
    wx.setStorageSync('startMoney',"")
    wx.setStorageSync('endMoney',"")
    wx.setStorageSync('pageNumber2',1)
    wx.navigateBack({
      delta: 1
    })
  },
  toWait2:function(){
    var that = this
    var reg = /^(-)?(([1-9]{1}\d*)|([0]{1}))(\.(\d){1,2})?$/
    if(that.data.startMoney&&reg.test(that.data.startMoney)&&that.data.startMoney<10000000){
          if(that.data.endMoney&&reg.test(that.data.endMoney)&&that.data.endMoney<10000000){
            wx.setStorageSync('startMoney',that.data.startMoney)
            wx.setStorageSync('endMoney',that.data.endMoney)
            wx.setStorageSync('pageNumber2',1)
            wx.navigateBack({
              delta: 1
            })
          } else if(that.data.endMoney==''){
            wx.setStorageSync('startMoney',that.data.startMoney)
            wx.setStorageSync('endMoney',that.data.endMoney)
            wx.setStorageSync('pageNumber2',1)
            wx.navigateBack({
              delta: 1
            })
          }else{
            wx.showToast({
              title: '输入的数字不对或已超过10000000',
              icon: 'none'
            })
      }
    } else if(that.data.startMoney==''){
      if(that.data.endMoney&&reg.test(that.data.endMoney)&&that.data.startMoney<10000000){
        wx.setStorageSync('startMoney',that.data.startMoney)
        wx.setStorageSync('endMoney',that.data.endMoney)
        wx.setStorageSync('pageNumber2',1)
        wx.navigateBack({
          delta: 1
        })
      } else if(that.data.endMoney==''){
        wx.setStorageSync('startMoney',that.data.startMoney)
        wx.setStorageSync('endMoney',that.data.endMoney)
        wx.setStorageSync('pageNumber2',1)
        wx.navigateBack({
          delta: 1
        })
      }else{
        wx.showToast({
          title: '输入的数字不对或已超过10000000',
          icon: 'none'
        })
  }
    }else{
      console.log(11)
      wx.showToast({
        title: '输入的数字不对或已超过10000000',
        icon: 'none'
      })
    }
  }
})