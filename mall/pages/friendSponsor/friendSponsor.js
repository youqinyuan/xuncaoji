// pages/friendSponsor/friendSponsor.js
let app = getApp()
var interval2 = null
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show1: false,
    sponsorButton: true,
    toIndexButton: false,
    success: false,
    sponsorNews: false,
    show2: false,
    pageNumber: 1,
    pageSize: 10,
    hostUrl: app.Util.getUrlImg().hostUrl,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    console.log("options1:"+options)
    if (options.id) {
      that.setData({
        sponsorId: parseInt(options.id),
        inviterCode: options.inviterCode || '',
      })
      wx.setStorageSync('sponsorId', that.data.sponsorId)
    }
    //新品推荐
    that.init2()
  },
  init: function() {
    var that = this
    var sponsorId = wx.getStorageSync('sponsorId')
    app.Util.ajax('mall/marketingAuspicesGoods/queryApplyDetail', {
      id: sponsorId
    }, 'GET').then((res) => { // 使用ajax函数
      if (res.messageCode = 'MSG_1001') {
        if (res.data.content) {
          if (res.data.content.isApplyUser == "YES") {
            wx.redirectTo({
              url: '/packageB/pages/toSponsor/toSponsor?id=' + res.data.content.apply.id,
            })
          } else {
            that.setData({
              content: res.data.content.apply,
              sponsorItems: res.data.content.sponsorItems
            })
            console.log(res.data.content)
            if (res.data.content.apply.status !== 'PROGRESS'&&res.data.content.isSponsor=="NO") {
              that.setData({
                show2: true
              })
            }
            if (res.data.content.isSponsor == 'YES') {
              this.setData({
                success: true,
                sponsorButton: false,
                toIndexButton: true,
                sponsorNews: true
              })
            } else if (res.data.content.isSponsor == 'NO') {
              this.setData({
                success: false,
                sponsorButton: true,
                toIndexButton: false,
                sponsorNews: false
              })
            }
            //倒计时初始化
            that.countDownInit(res.data.content.apply.leftTime)
          }
        }
      } else {
        wx.showToast({
          title: res.data.message,
          icon: 'none'
        })
      }
    })
    app.Util.ajax('mall/marketingAuspicesGoods/queryAuspices', null, 'GET').then((res) => { // 使用ajax函数
      if (res.messageCode = 'MSG_1001') {
        var tempList = []
        for (let i of res.data.content.configList) {
          var obj = {}
          obj.name = i.key
          obj.value = i.value
          tempList.push(obj)
        }
        that.setData({
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
  formatDuring(mss) {
    var that = this
    const hours = parseInt(mss / 3600000).toString() > 10 ? parseInt(mss / 3600000).toString() : '0' + parseInt(mss / 3600000).toString()
    const minutes = parseInt((mss % (1000 * 60 * 60)) / (1000 * 60)).toString() >= 10 ? parseInt((mss % (1000 * 60 * 60)) / (1000 * 60)).toString() : '0' + parseInt((mss % (1000 * 60 * 60)) / (1000 * 60)).toString()
    const seconds = parseInt((mss % (1000 * 60)) / 1000).toString() >= 10 ? parseInt((mss % (1000 * 60)) / 1000).toString() : '0' + parseInt((mss % (1000 * 60)) / 1000).toString()
    const day = parseInt(hours / 24)
    const hours1 = parseInt(hours % 24)
    that.setData({
      day: day,
      hours: hours,
      hours1: hours1,
      minutes: minutes,
      seconds: seconds
    })
  },
  // 倒计时初始化
  countDownInit: function(time) {
    var that = this
    var current = time
    that.formatDuring(current)
    interval2 = setInterval(() => {
      if (current > 0) {
        current -= 1000
        that.formatDuring(current)
      } else {
        clearInterval(interval2)
        that.setData({
          day: '00',
          hours1: '00', //小时
          hours: "00",
          minutes: '00', //分钟
          seconds: '00' //秒
        })
      }
    }, 1000)
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
    clearInterval(interval2)
    //页面基础数据初始化
    console.log('bb' + wx.getStorageSync('sponsorId'))
    console.log('cc' + wx.getStorageSync('sponsorStatus'))
    that.init()
    if (wx.getStorageSync('sponsorStatus')) {
      this.setData({
        success: true,
        sponsorButton: false,
        toIndexButton: true,
        sponsorNews: true
      })
    }
    setTimeout(function() {
      wx.removeStorageSync('sponsorStatus')
    }, 1000)
  },
  //更多好货
  init2: function() {
    var that = this
    var pageNumber = that.data.pageNumber
    var pageSize = that.data.pageSize
    app.Util.ajax('mall/home/bestChoice', {
      pageNumber: pageNumber,
      pageSize: pageSize
    }, 'GET').then((res) => { // 使用ajax函数
      if (res.messageCode = 'MSG_1001') {
        res.data.content.items.forEach((v, i) => {
          v.truePrice = parseFloat((v.dctPrice - v.marketingCashBack.totalAmount).toFixed(2))
        })
        that.setData({
          list: res.data.content.items
        })
      }
    })
  },
  //加载更多好货
  getMore2: function() {
    var that = this
    var pageNumber = that.data.pageNumber + 1
    app.Util.ajax('mall/home/bestChoice', {
      pageNumber: pageNumber,
      pageSize: that.data.pageSize
    }, 'GET').then((res) => { // 使用ajax函数
      if (res.data.content) {
        if (res.data.content.items == '' && that.data.list !== '') {
          that.setData({
            bottom_tishi:'已到底，去【寻商品】提交吧'
          })
        }
        var arr = that.data.list
        res.data.content.items.forEach((v, i) => {
          v.truePrice = parseFloat((v.dctPrice - v.marketingCashBack.totalAmount).toFixed(2))
          arr.push(res.data.content.items[i])
        })
        that.setData({
          list: arr,
          pageNumber: pageNumber
        })
      }
    })
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
    this.getMore2()
  },
 
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    
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
  sponsor: function(e) {
    let id = e.currentTarget.dataset.id
    let that = this
    var token = wx.getStorageSync('token')
    if (token) {
      app.Util.ajax('mall/order/addAuspicesSponsorOrder', {
        amount: 1,
        applyId: id
      }, 'POST').then((res) => {
        if (res.data.content) {
          wx.navigateTo({
            url: `/pages/paymentorder/paymentorder?id=${res.data.content.id}&amount=${1}`,
          })
        } else {
          wx.showToast({
            title: res.data.message,
            icon: 'none'
          })
        }
      })
    } else {
      wx.navigateTo({
        url: '/pages/invitationCode/invitationCode?inviterCode=' + that.data.inviterCode,
      })
    }
  },
  toIndex: function() {
    wx.switchTab({
      url: '/pages/index/index'
    })
  },
  toDetail: function(e) {
    var id = e.currentTarget.dataset.id
    console.log(id)
    wx.navigateTo({
      url: "/pages/detail/detail?id=" + id
    })
  }
})