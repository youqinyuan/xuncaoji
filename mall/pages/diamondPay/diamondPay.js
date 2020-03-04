// pages/diamondPay/diamondPay.js
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hostUrl: app.Util.getUrlImg().hostUrl,
    navScrollLeft: 0,
    currentTab: 0,
    initialize:{},//页面显示内容
    initData:{},//页面传过来的数据
    initMember:{},//判断用户是不是钻石会员
    shareImg: '', //分享图片
    list: [{
        title: '1元奖励金',
        bannerUrl: app.Util.getUrlImg().hostUrl+"/partner_a.png",
        select: true,
        status: '1'
      },
      {
        title: '2元购物金',
        select: false,
        bannerUrl: app.Util.getUrlImg().hostUrl+"/partner_e.png",
        status: '2'
      },
      {
        title: '坐享下级消费提成',
        select: false,
        bannerUrl: app.Util.getUrlImg().hostUrl+"/partner_c.png",
        status: '3'
      },
      {
        title: '享FreeBuy下单优惠',
        select: false,
        bannerUrl: app.Util.getUrlImg().hostUrl+"/partner_d.png",
        status: '4'
      }, {
        title: '优先成为城市合伙人',
        select: false,
        bannerUrl: app.Util.getUrlImg().hostUrl+"/partner_b.png",
        status: '5'
      }, {
        title: '待返转让分佣',
        select: false,
        bannerUrl: app.Util.getUrlImg().hostUrl+"/partner_a.png",
        status: '6'
      },
    ],
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    that.setData({
      currentTab: parseInt(options.status) - 1,
      initData:options
    })
    that.initPrice();
    that.initMember();
    wx.downloadFile({
      url: app.Util.getUrlImg().hostUrl+'/shre_img.png',
      success: function (res) {
        that.setData({
          shareImg: res.tempFilePath
        })
      },
      fail: function (res) {

      }
    })
  },
  /**
   * 滑动切换tab
   */

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    var that = this
    return {
      title: '【钻石合伙人招募令】加入寻草记～共赢未来，带你提前实现财富自由！！！',
      path: '/pages/diamondPartner/diamondPartner?inviterCode=' + wx.getStorageSync('inviterCode'),
      imageUrl: that.data.shareImg,
    }
  },
  initMember:function(){
    var that = this
    app.Util.ajax('mall/personal/myMember', null, 'GET').then((res) => {
      if (res.data.content) {
        that.setData({
          initMember: res.data.content
        })
      }
    })
  },
  initPrice: function () {
    var that = this
    app.Util.ajax('mall/paramConfig/getMemberParamConfig', 'GET').then((res) => {
      if (res.data.content) {
        res.data.content.forEach((v, i) => {
          if (v.key == "PAYMENT_AMOUNT") {
            that.data.initialize['payMent'] = v.value
          } else if (v.key == "DIAMOND_FREE_BUY_AMOUNT") {
            that.data.initialize['diamond'] = v.value
          } else if (v.key == "SUBORDINATES_NUMBER") {
            that.data.initialize['subordiates'] = v.value
          } else if (v.key == "DIAMOND_FREE_BUY_FREQUENCY") {
            that.data.initialize['frequency'] = v.value
          } else if (v.key == "DIAMOND_DISCOUNT") {
            that.data.initialize['discount'] = (v.value)/10
          } else if (v.key == "DIAMOND_TRANSFER_SERVICE_CHARGE") {
            that.data.initialize['transfer'] = v.value
          } else if (v.key == "DIAMOND_PURCHASE_SERVICE_CHARGE") {
            that.data.initialize['purchase'] = v.value
          } else if (v.key == "INVITEES_COUNT") {
            that.data.initialize['invitees'] = v.value
          } else if (v.key == "DIAMOND_PAYMENT_RATE") {
            that.data.initialize['rateBegin'] = v.value
          } else if (v.key == "DIAMOND_RATE") {
            that.data.initialize['rateEnd'] = v.value
          } else if (v.key == "DIAMOND_FREE_BUY_RATE") {
            that.data.initialize['buyRate'] = v.value
          } else if (v.key == "DIAMOND_DIAMOND") {
            that.data.initialize['money'] = v.value
          } else if (v.key == "DIAMOND_FREE_BUY_LEVEL") {
            that.data.initialize['level'] = v.value
          } else if(v.key == "DIAMOND_PROFIT_RATE"){
            that.data.initialize['rate'] = v.value
          } else if(v.key == "DIAMOND_PROFIT_PAYMENT_RATE"){
            that.data.initialize['paymentRate'] = v.value
          } else if(v.key == "DIAMOND_NO_PROFIT_PAYMENT_RATE"){
            that.data.initialize['noPaymentRate'] = v.value
          }    
        })
        that.setData({
          initialize: that.data.initialize
        })
      } else {
        wx.showToast({
          title: res.data.message,
          icon: 'none'
        })
      }
    })
    that.data.list.forEach((v,i)=>{
      if(v.status==1){
        console.log()
        v.title = that.data.initData.payMent + '元奖励金'        
        that.setData({
          list:that.data.list
        })        
      } else if (v.status == 2){
        v.title = that.data.initData.diamond + '元购物金'
        that.setData({
          list: that.data.list
        })
      }
    })
  },
  //开通钻石会员
  openDiamond: function() {
    var that = this
    console.log()
    app.Util.ajax('mall/order/addDiamondPartnerOrder', {
      amount: that.data.initData.payMent
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
  },
  bindChange: function(e) {
    var that = this;
    that.setData({
      currentTab: e.detail.current,
      navScrollLeft: (e.detail.current - 1) * 100,
    });
    for (var i in that.data.list) {
      that.setData({
        [`list[${i}].select`]: false
      });
    }
    that.setData({
      [`list[${e.detail.current}].select`]: true
    });
  },
  /**
   * 点击tab切换
   */
  swichNav: function(e) {
    var that = this;
    if (that.data.currentTab === e.currentTarget.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.currentTarget.dataset.current
      })
    }
    for (var i in this.data.list) {
      that.setData({
        [`list[${i}].select`]: false
      });
    }
    that.setData({
      [`list[${e.currentTarget.dataset.current}].select`]: true
    });
  },
  //开通
  openPay: function() {

  }
})