// pages/mine/mine.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    content: {},
    slist: [{
      img: '../../assets/images/icon/my_order_list1_icon.png',
      txt: '待支付',
      status: '1'
    }, {
      img: '../../assets/images/icon/my_order_list2_icon.png',
      txt: '待收货',
      status: '2,4'
    }, {
      img: '../../assets/images/icon/my_order_list3_icon.png',
      txt: '待评价',
      status: '5'
    }, {
      img: '../../assets/images/icon/my_order_list4_icon.png',
      txt: '退款/售后',
      status: '7, 8, 9, 10, 11'
    }],
    showService: false, //我的服务
    showInviterCode: false, //邀请码
    orderCount: [],
    waitCount: 0, //待发货待收货数量
    userInfo: wx.getStorageSync('userInfo'), //用户信息
  },
  //客服分享图片回到指定的小程序页面
  handleContact: function (e) {
    var path = e.detail.path, query = e.detail.query, params = '';
    if (path) {
      for (var key in query) {
        params = key + '=' + query[key] + '&';
      }
      params = params.slice(0, params.length - 1);
      wx.navigateTo({
        url: path + '?' + params
      })
    }
  },
  //跳转到全部订单页面
  nav: function(e) {
    app.nav(e);
  },
  /**
   * 跳转到开通会员页面
   */
  open: function() {
    var that = this
    wx.switchTab({
      url: '/pages/member/member',
    })
  },
  /**
   * 跳转到充值页面
   */
  recharge: function(e) {
    wx.navigateTo({
      url: '/pages/mine/recharge/recharge'
    })
  },
  /**
   * 跳转到个人资料页面
   */
  personalData: function(e) {
    let img = e.currentTarget.dataset.img
    wx.navigateTo({
      url: `/pages/mine/personal/personal?img=${img}`,
    })
  },
  //付钱页面
  payMoney: function() {
    wx.navigateTo({
      url: '/pages/undeveloped/undeveloped',
    })
  },
  //跳转到佣金页面
  commission: function() {
    var isMember = this.data.content.isMember
    wx.navigateTo({
      url: `/pages/commission/commission?isMember=${isMember}`,
    })
  },
  //跳转到我的团队页面
  myTeam: function() {
    wx.navigateTo({
      url: '/pages/myteam/myteam',
    })
  },
  //跳转到购物车
  toCart: function() {
    wx.navigateTo({
      url: '/pages/index/cart/cart',
    })
  },
  //我的心情
  myMood: function() {
    wx.navigateTo({
      url: '/pages/undeveloped/undeveloped',
    })
  },
  //跳转到修改地址页面
  toAdress: function() {
    wx.navigateTo({
      url: '/pages/address/address',
    })
  },
  //跳转到支付密码页面
  toPassword: function() {
    wx.navigateTo({
      url: '/pages/paypassword/paypassword',
    })
  },
  //邀请码
  showInviterCode: function() {
    var that = this;
    that.setData({
      showInviterCode: true
    })
  },
  hideModal: function() {
    var that = this
    that.setData({
      showInviterCode: false
    })
  },
  //点击复制
  copyText: function(e) {
    var that = this
    var text = e.currentTarget.dataset.text
    var text1 = text.toString()
    wx.setClipboardData({
      data: text1,
      success: function(res) {
        wx.getClipboardData({
          success: function(res) {
            wx.showToast({
              title: '复制成功',
              icon: 'none'
            })
            that.setData({
              showInviterCode: false
            })
          }
        })
      }
    })
  },
  //跳转到商家入驻界面
  toMerchantEntry: function() {
    wx.navigateTo({
      url: '/pages/undeveloped/undeveloped',
    })
  },
  //客服
  // customerService: function() {
  //   var that = this;
  //   that.setData({
  //     showService: true
  //   })
  // },
  //呼叫
  call: function() {
    var that = this;
    that.setData({
      showService: false
    })
    wx.makePhoneCall({
      phoneNumber: that.data.content.servicePhone // 仅为示例，并非真实的电话号码
    })
  },
  hideService: function() {
    var that = this;
    that.setData({
      showService: false
    })
  },
  onLoad: function(options) {
    var that = this
    var token = wx.getStorageSync('token')
    if (!token) {
      wx.navigateTo({
        url: '/pages/invitationCode/invitationCode',
      })
    } else {
      that.setData({
        userInfo: wx.getStorageSync('userInfo')
      })
      // console.log(that.data.userInfo.nickName)
      app.Util.ajax('mall/personal/dashboard', null, 'GET').then((res) => { // 使用ajax函数
        if (res.data.content) {
          if (res.data.content.orderCount.length > 0) {
            var waitCount = 0;
            for (var i = 0; i < res.data.content.orderCount.length; i++) {
              res.data.content.orderCount[i].count = res.data.content.orderCount[i].count > 99 ? res.data.content.orderCount[i].count + '+' : res.data.content.orderCount[i].count
              if (res.data.content.orderCount[i].status == 2) {
                waitCount += res.data.content.orderCount[i].count
                that.setData({
                  waitCount: waitCount
                })
              }
              if (res.data.content.orderCount[i].status == 4) {
                waitCount += res.data.content.orderCount[i].count
                that.setData({
                  waitCount: waitCount
                })
              }
            }
          }
          that.setData({
            content: res.data.content ? res.data.content : '',
            orderCount: res.data.content ? res.data.content.orderCount : [],
            // waitCount:
          })
        }
      })
    }
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
    that.onLoad();
    //tabbar
    if (typeof that.getTabBar === 'function' && that.getTabBar()) {
      that.getTabBar().setData({
        selected: 2
      })
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
    var that = this
    that.onLoad(that.data.options)
    wx.stopPullDownRefresh() //停止下拉刷新
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

  }
})