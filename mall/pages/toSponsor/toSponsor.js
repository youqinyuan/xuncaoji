// pages/toSponsor/toSponsor.js
let app = getApp()
var interval2 = null
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show1: false,
    productionWidth: 100,
    pageSize: 10,
    pageNumber: 1,
    showModalStatus1: false,
    haibao: false,
    hostUrl: app.Util.getUrlImg().hostUrl,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    that.setData({
      options: options
    })
    //页面基础数据初始化
    // that.init(options)
    //推荐商品
    that.init2()
  },
  init: function(options) {
    var that = this
    app.Util.ajax('mall/marketingAuspicesGoods/queryApplyDetail', {
      id: options.id
    }, 'GET').then((res) => { // 使用ajax函数
      if (res.messageCode = 'MSG_1001') {
        that.setData({
          content: res.data.content.apply,
          sponsorItems: res.data.content.sponsorItems
        })
        //倒计时初始化
        that.countDownInit(res.data.content.apply.leftTime)
      } else {
        wx.showToast({
          title: res.data.message,
          icon: 'none'
        })
      }
    })
    app.Util.ajax('mall/marketingAuspicesGoods/queryAuspices', null, 'GET').then((res) => { // 使用ajax函数
      if (res.messageCode = 'MSG_1001') {
        //分享数据
        that.chooseShare()
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
    that.init(that.data.options)
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
          wx.showToast({
            title: '已经到底啦~',
            icon: 'none'
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function(res) {
    var that = this
    if (res.from == "button") {
      if (res.target.id === 'btn') {
        // 来自页面内转发按钮
        that.setData({
          showModalStatus1: false
        })
        console.log(333)
        app.Util.ajax('mall/weChat/sharing/onSuccess', {
          mode: 13
        }, 'POST').then((res) => {
          if (res.data.content) {
            wx.showToast({
              title: '分享成功',
              icon: 'none'
            })
          } else {}
        })
        return {
          title: '是朋友帮我支付1元，我真的需要你的帮助，么么哒～',
          path: that.data.shareList.link,
          imageUrl: that.data.shareList.imageUrl,
          success: function(res) {

          },
          fail: function(res) {
            // 转发失败
            console.log("转发失败:" + JSON.stringify(res));
          }
        }
      } else if (res.target.id === 'btnGroup') {
        that.setData({
          showModalStatus1: false
        })
        app.Util.ajax('mall/weChat/sharing/onSuccess', {
          mode: 13
        }, 'POST').then((res) => {
          if (res.data.content) {
            wx.showToast({
              title: '分享成功',
              icon: 'none'
            })
          } else {

          }
        })
        return {
          title: '我在0成本购买心仪商品，活动100%真实，麻烦你帮我赞助一下。',
          path: that.data.shareList.link,
          imageUrl: that.data.shareList.imageUrl,
        }
      }
    } else {
      app.Util.ajax('mall/weChat/sharing/onSuccess', {
        mode: 13
      }, 'POST').then((res) => {
        if (res.data.content) {
          wx.showToast({
            title: '分享成功',
            icon: 'none'
          })
        } else {

        }
      })
      return {
        title: that.data.shareList.desc,
        path: that.data.shareList.link,
        imageUrl: that.data.shareList.imageUrl,
        success: function(res) {

        },
        fail: function(res) {
          // 转发失败
          console.log("转发失败:" + JSON.stringify(res));
        }
      }
    }
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
  //分享
  share: function(e) {
    var that = this
    // var goodsId = e.currentTarget.dataset.goodsid
    that.setData({
      showModalStatus1: true
    })
  },
  cancelShare: function() {
    var that = this
    that.setData({
      showModalStatus1: false
    })
  },
  //查询分享数据
  chooseShare: function() {
    console.log(1111111)
    var that = this
    app.Util.ajax('mall/weChat/sharing/target', {
      mode: 13,
      targetId: that.data.content.id
    }, 'GET').then((res) => {
      if (res.data.messageCode == "MSG_1001") {
        var arr = res.data.content
        var inviterCode = wx.getStorageSync('inviterCode')
        if (inviterCode) {
          arr.link = arr.link.replace(/{inviterCode}/g, inviterCode)
        } else {
          arr.link = arr.link.replace(/{inviterCode}/g, '')
        }
        that.setData({
          shareList: arr
        })
      } else {
        wx.showToast({
          title: res.data.message,
          icon: 'none',
          duration: 3000
        })
      }
    })
  },
  toPlaceOrder: function() {
    var that = this
    if (that.data.content.status == 'ORDERED_PROGRESS_TO_PAY' || that.data.content.status == 'ORDERED_TO_PAY') {
      wx.navigateTo({
        url: `/pages/paymentorder/paymentorder?id=${that.data.content.transStatementId}&buymode=2`,
      })
    } else {
      var sponsorId = that.data.content.id
      var goodsType = 1 //freeBuy单个商品
      wx.navigateTo({
        url: "/pages/placeorder/placeorder?sponsorId=" + sponsorId + "&&goodsType=" + goodsType
      })
    }
  },
  toGoodsDetail: function(e) {
    var id = e.currentTarget.dataset.id
    console.log(id)
    wx.navigateTo({
      url: "/pages/detail/detail?id=" + id
    })
  }
})