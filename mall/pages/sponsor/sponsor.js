// pages/sponsor/sponsor.js
let app = getApp()
var interval2 = null
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show1: false,
    banner: '',
    productionWidth: 100,
    pageNumber: 1,
    pageSize: 10,
    toBottom: false,
    temp: [],
    hostUrl: app.Util.getUrlImg().hostUrl,
    sponsorCancle:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    //页面基础数据初始化
    that.init()
    //   if(wx.getStorageSync('token')){
    //     //我的赞助初始化
    //     that.mySponsorinit()
    // }
  },
  formatDuring(temp) {
    var that = this
    var hours = 0
    var minutes = 0
    var seconds = 0
    var temparr = []
    for (var i = 0; i < temp.length; i++) {
      var tempList = {}
      hours = parseInt(temp[i] / 3600000).toString() >= 10 ? parseInt(temp[i] / 3600000).toString() : '0' + parseInt(temp[i] / 3600000).toString()
      minutes = parseInt((temp[i] % (1000 * 60 * 60)) / (1000 * 60)).toString() >= 10 ? parseInt((temp[i] % (1000 * 60 * 60)) / (1000 * 60)).toString() : '0' + parseInt((temp[i] % (1000 * 60 * 60)) / (1000 * 60)).toString()
      seconds = parseInt((temp[i] % (1000 * 60)) / 1000).toString() >= 10 ? parseInt((temp[i] % (1000 * 60)) / 1000).toString() : '0' + parseInt((temp[i] % (1000 * 60)) / 1000).toString()
      tempList.hours = hours
      tempList.minutes = minutes
      tempList.seconds = seconds
      temparr.push(tempList)
    }
    that.setData({
      temparr: temparr
    })
  },
  init: function() {
    var that = this
    app.Util.ajax('mall/marketingAuspicesGoods/queryAuspices', {
      pageNumber: that.data.pageNumber,
      pageSize: that.data.pageSize
    }, 'GET').then((res) => { // 使用ajax函数
      if (res.messageCode = 'MSG_1001') {
        var tempList = []
        for (let i of res.data.content.configList) {
          var obj = {}
          obj.name = i.key
          obj.value = i.value
          tempList.push(obj)
        }
        that.setData({
          content: res.data.content,
          goodsContent: res.data.content.goodsItems.items,
          noticeList: res.data.content.textSlideShowItems.items,
          configList: tempList
        })
      } else {
        wx.showToast({
          title: res.data.message,
          icon: "none"
        })
      }
    })
  },
  getMore: function() {
    var that = this
    var pageNumber = that.data.pageNumber + 1
    app.Util.ajax('mall/marketingAuspicesGoods/queryAuspices', {
      pageNumber: pageNumber,
      pageSize: that.data.pageSize
    }, 'GET').then((res) => { // 使用ajax函数
      if (res.messageCode = 'MSG_1001') {
        if (res.data.content.goodsItems.items == '' && that.data.goodsContent !== '') {
          that.setData({
            toBottom: true
          })
        }
        var arr = that.data.goodsContent
        for (var i = 0; i < res.data.content.goodsItems.items.length; i++) {
          arr.push(res.data.content.goodsItems.items[i])
        }
        that.setData({
          goodsContent: arr,
          pageNumber: pageNumber
        })
        console.log(that.data.goodsContent)
      } else {
        wx.showToast({
          title: res.data.message,
          icon: "none"
        })
      }
    })
  },
  // 倒计时初始化
  countDownInit: function() {
    var that = this
    var temp = that.data.temp
    that.formatDuring(temp)
    interval2 = setInterval(() => {
      for (var i = 0; i < temp.length; i++) {
        if (temp[i] > 0) {
          temp[i] -= 1000
        } else {
          // clearInterval(interval2)
        }
      }
      that.formatDuring(temp)
    }, 1000)
  },
  mySponsorinit: function() {
    var that = this
    app.Util.ajax('mall/marketingAuspicesGoods/queryMyApply', null, 'GET').then((res) => {
      if (res.data.messageCode == 'MSG_1001') {
        for (let i in res.data.content) {
          that.data.temp[i] = res.data.content[i].leftTime
        }
        that.setData({
          mySponsorContent: res.data.content
        })
        //倒计时初始化
        that.countDownInit()
      } else {

      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var that = this
    if (wx.getStorageSync('token')) {
      clearInterval(interval2)
      //我的赞助初始化
      that.mySponsorinit()
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    var that = this
    that.getMore()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  toDetail: function(e) {
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/packageB/pages/toSponsor/toSponsor?id=' + id
    })

  },
  closeShow1: function() {
    this.setData({
      show1: false
    })
  },
  Show1: function() {
    this.setData({
      show1: true
    })
  },
  setSponsor: function(e) {
    var sponsorId = e.currentTarget.dataset.id
    var goodsId = e.currentTarget.dataset.goodsid
    wx.navigateTo({
      url: '/pages/detail/detail?sponsorId=' + sponsorId + '&&id=' + goodsId,
    })
  },
  showCancle:function(e){
    this.setData({
      sponsorCancle:true,
      sponsorId:e.currentTarget.dataset.id
    })
  },
  closeShow:function(){
    this.setData({
      sponsorCancle:false
    })
  },
  shure:function(){
    let that = this
    let sponsorId = that.data.sponsorId
    app.Util.ajax('mall/marketingAuspicesGoods/cancelApply', {id:sponsorId}, 'POST').then((res) => {
      if (res.data.messageCode == 'MSG_1001') {
        that.setData({
          sponsorCancle:false
        })
        wx.showToast({
          title:'取消成功',
          icon:'none'
        })
        setTimeout(function(){
          clearInterval(interval2)
          that.mySponsorinit()
        },1000)
      } else {
        wx.showToast({
          title:res.data.message,
          icon:'none'
        })
      }
    })
  }
})