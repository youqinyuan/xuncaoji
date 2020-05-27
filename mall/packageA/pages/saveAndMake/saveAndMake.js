// packageA/pages/saveAndMake/saveAndMake.js
let app = getApp();
let interval2 = null
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: null, //交易关闭id
    liquidateText:null,//关闭交易提示
    hostUrl: app.Util.getUrlImg().hostUrl,
    currentTab: 0,
    type: 5,
    navData: [{
      type: 5,
      text: '卖商品'
    }, {
      type: 6,
        text: '买商品'
    }],
    showModal: false, //交易关闭
    pageNumber: 1,
    pageSize: 20,
    myOrderList: [],
    temp: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this
    clearInterval(interval2)
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
    let that = this
    that.setData({
      pageNumber:1
    })
    if (wx.getStorageSync('token')) {
      clearInterval(interval2)
      //我的赞助初始化
      that.getData()
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
    let that = this
    that.setData({
      pageNumber: 1,
    })
    clearInterval(interval2)
    that.getData()
    wx.stopPullDownRefresh() //停止下拉刷新
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    let that = this
    that.getMore()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  getData() {
    let that = this
    let data = {
      type: that.data.type,
      pageNumber: that.data.pageNumber,
      pageSize: that.data.pageSize
    }
    app.Util.ajax('mall/forum/topic/findMyGoodsPreSalePageList', data, 'GET').then((res) => { // 使用ajax函数
      if (res.data.messageCode == "MSG_1001") {
        for (let i in res.data.content.items) {
          res.data.content.items[i].timestamp = Date.parse(new Date())
          that.data.temp[i] = res.data.content.items[i].expireTime - res.data.content.items[i].timestamp
        }
        that.setData({
          myOrderList: res.data.content.items
        })
        //倒计时初始化
        that.countDownInit()
        if(that.data.myOrderList.length==0){
          that.setData({
            emptyText:'暂无数据'
          })
        }
      }
    })
  },
  formatDuring(temp) {
    let that = this
    let hours = 0
    let minutes = 0
    let seconds = 0
    let temparr = []
    for (let i = 0; i < temp.length; i++) {
      let tempList = {}
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
  // 倒计时初始化
  countDownInit: function () {
    let that = this
    let temp = that.data.temp
    that.formatDuring(temp)
    interval2 = setInterval(() => {
      for (let i = 0; i < temp.length; i++) {
        temp[i] = temp[i]
        if (temp[i] > 0) {
          temp[i] -= 1000
        } else if (temp[i] == 0){
          clearInterval(interval2)
          that.getData()
        }
      }
      that.formatDuring(temp)
    }, 1000)
  },
  //加载更多
  getMore: function() {
    let that = this
    let pageNumber = that.data.pageNumber + 1
    let data = {
      type: that.data.type,
      pageNumber: pageNumber,
      pageSize: that.data.pageSize
    }
    app.Util.ajax('mall/forum/topic/findMyGoodsPreSalePageList', data, 'GET').then((res) => { // 使用ajax函数
      if (res.data.messageCode == 'MSG_1001') {
        if (res.data.content.items == '' && that.data.myOrderList !== '') {
          wx.showToast({
            title: '已经到底啦',
            icon: 'none'
          })
        }
        let arr = that.data.myOrderList
        for (let i = 0; i < res.data.content.items.length; i++) {
          res.data.content.items[i].expireTimePay = res.data.content.items[i].expireTimePay + ':' + '00' + ':' + '00'
          console.log()
          arr.push(res.data.content.items[i])
        }
        that.setData({
          myOrderList: arr,
          pageNumber: pageNumber
        })
      }
    })
  },
  //导航切换
  switchNav: function(e) {
    let that = this
    let cur = e.currentTarget.dataset.current //导航栏数组的index
    let type = e.currentTarget.dataset.type
    that.setData({
      type: type,
      currentTab: cur,
      pageNumber: 1,
    })
    if (type == 5) {
      wx.setNavigationBarTitle({
        title: '卖商品'
      });
      clearInterval(interval2)
      that.getData()
    } else if (type == 6) {
      wx.setNavigationBarTitle({
        title: '买商品'
      });
      clearInterval(interval2)
      that.getData()
    }
  },
  goToApply: function(e) {
    wx.navigateTo({
      url: '/pages/applyZero/applyZero',
    })
  },
  //交易关闭
  exchangeClosed: function(e) {
    let that = this
    if (that.data.currentTab==0){
      that.setData({
        showModal: true,
        id: e.currentTarget.dataset.id,
        type: 5,
        status: e.currentTarget.dataset.status
      })
      if (e.currentTarget.dataset.status==6){
        that.setData({
          liquidateText: `${e.currentTarget.dataset.liquidate}元将补偿给对方`
        })
      }else{
        that.setData({
          liquidateText: '确认关闭交易？关闭后违约金将退还给您！'
        })
      }
    } else if (that.data.currentTab == 1){
      that.setData({
        showModal: true,
        id: e.currentTarget.dataset.id,
        type: 6,
        liquidateText: '确定关闭交易？关闭交易后出价将退回给您！'
      })
    }   
  },
  need: function(e) {
    let that = this
    app.Util.ajax('mall/forum/goodsPreSale/closeGoodsPreSale', {
      id: that.data.id
    }, 'POST').then((res) => { // 使用ajax函数
      if (res.data.messageCode == "MSG_1001") {
        that.setData({
          pageNumber: 1,
          showModal: false
        })
        setTimeout(function() {
          that.getData();
        }, 500)
      }
    })

  },
  noNeed: function(e) {
    let that = this
    that.setData({
      showModal: false
    })
  },

  getOrder(e) {
    let that = this
    let data = {
      quantity: e.currentTarget.dataset.quantity,
      source: 1,
      topicid: e.currentTarget.dataset.topicid,
      stock: e.currentTarget.dataset.stock,
      goodsid: e.currentTarget.dataset.goodsid
    }
    let getOrder = JSON.stringify(data)
    wx.navigateTo({
      url: '/pages/applyZero/applyZero?getOrder=' + getOrder,
    })
  },
  // 改价
  editPriceFinish(e) {
    let that = this
    let img = e.currentTarget.dataset.iconurl
    let iconurl = img ? img.split('?') : null
    let iconurl1 = iconurl ? iconurl[0] : null
    wx.setStorageSync('iconurl', iconurl1 ? iconurl[1] : null)
    let data = {
      dctprice: e.currentTarget.dataset.dctprice,
      name: e.currentTarget.dataset.name,
      spec: e.currentTarget.dataset.spec,
      stockid: e.currentTarget.dataset.stockid,
      iconurl: iconurl1,
      expressfee: e.currentTarget.dataset.expressfee,
      expectamount: e.currentTarget.dataset.expectamount,
      liquidate: e.currentTarget.dataset.liquidate,
      id: e.currentTarget.dataset.id
    }
    let editPrice = JSON.stringify(data)
    wx.navigateTo({
      url: "/packageA/pages/getMoneyMessage/getMoneyMessage?editPrice=" + editPrice
    })
  },
  // 修改地址信息
  modifyPrice(e) {
    let that = this
    let data = {
      id: e.currentTarget.dataset.id,
    }
    let editPrice = JSON.stringify(data)
    wx.navigateTo({
      url: "/packageA/pages/saveMoneyMessage/saveMoneyMessage?editPrice=" + editPrice
    })
  },
})