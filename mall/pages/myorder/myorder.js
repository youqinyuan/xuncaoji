// pages/myorder/myorder.js
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTab: '',
    orderTabItem: [{
        title: '全部',
        select: true,
        status: '0'
      },
      {
        title: '待支付',
        select: false,
        status: '1'
      },
      {
        title: '待收货',
        select: false,
        status: '4'
      },
      {
        title: '待使用',
        select: false,
        status: '3'
      },
      {
        title: '待评价',
        select: false,
        status: '5'
      },
      {
        title: '退款/售后',
        select: false,
        status: '7, 8, 9, 10, 11'
      },
      // {
      //   title: '已取消',
      //   select: false,
      //   status: '12'
      // },
    ],
    allOrder: [],
    list:[],//更多好货
    pageNumber:1,
    pageSize:20,
    text:'',
    showDialog:false,//确认收货弹框
    showDialog1:false,//取消退款
    showDialog2:false,//退款
    refundorderId:1,//退款id
    refund:['质量问题','长时间未发货','我不想买了','其他原因'],//退款申请理由
    current:0,//获取退款理由
    reason:'质量问题',
    cancelOrder: ['我不想买了', '填写错误,重拍', '卖家缺货', '其他原因'],//取消订单
    showDialog3: false,//取消订单弹框
    reason1:'我不想买了',//取消订单理由
    showDialog4:false,//去评价弹框
    noteMaxLen: 100, //详细评价的字数限制
    currentNoteLen: 0,//输入的字数
    evaluate:'',//文本框的值
    one_2: 5,//实心星星
    two_2: 0,//空心星星
    // disabled:true,
    multiShow:true,
    showModalStatus: false,//分享弹窗
    shareList: {},//分享数据
    goodsId: 1,//分享用的商品id
    sharingProfit: '',//分享返利
    options:{}
  },
  // 跳转到订单详情
  jumpOrderDetail:function(e){
    app.nav(e)
  },
  //跳转到分期返现明细
  periodCash:function(e){
    var orderId = e.currentTarget.dataset.orderid
    var latestStatus = e.currentTarget.dataset.lateststatus
    wx.navigateTo({
      url: `/pages/cashBack/cashBack?orderId=${orderId}&latestStatus=${latestStatus}`,
    })
  },
  //跳转至店铺详情
  jumpStoreDetail: function (e) {
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/storedetails/storedetails?id=${id}`,
    })
  },
  //跳转到详情页
  toDetail: function (e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/detail/detail?id=${id}`,
    })
  },
  //分享
  share: function (e) {
    var that = this
    var goodsId = e.currentTarget.dataset.goodsid
    var sharingProfit = e.currentTarget.dataset.profit
    that.setData({
      goodsId: goodsId,
      sharingProfit: sharingProfit
    })
    //分享数据
    that.chooseShare()

    that.setData({
      showModalStatus: true
    })
  },
  cancelShare: function () {
    var that = this
    that.setData({
      showModalStatus: false
    })
  },
  hideModal: function () {
    var that = this
    that.setData({
      showModalStatus: false
    })
  },
  //查询分享数据
  chooseShare: function () {
    var that = this
    app.Util.ajax('mall/weChat/sharing/target', { mode: 1, targetId: that.data.goodsId }, 'GET').then((res) => {
      if (res.messageCode = 'MSG_1001') {
        var inviterCode = wx.getStorageSync('inviterCode')
        if (inviterCode) {
          res.data.content.link = res.data.content.link.replace(/{inviterCode}/g, inviterCode)
        } else {
          res.data.content.link = res.data.content.link.replace(/{inviterCode}/g, '')
        }     
        that.setData({
          shareList: res.data.content
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    var status;
    that.setData({
      options:options
    })
    if (options.status==='0'){
      status= parseInt(options.status)
    }else{
      status = options.status
    }
    that.setData({
      currentTab: status
    })
    for (let i of this.data.orderTabItem) {
      if (i.status == options.status) {
        that.setData({
          [`orderTabItem[${that.data.orderTabItem.indexOf(i)}].select`]: true
        })
      } else {
        that.setData({
          [`orderTabItem[${that.data.orderTabItem.indexOf(i)}].select`]: false
        })
      }
    }
    if (status !== '0') {
      app.Util.ajax('mall/order/queryOrderListByUserId', {
        pageNumber: that.data.pageNumber,
        pageSize: that.data.pageSize,
        latestStatus: status
      }, 'GET').then((res) => { // 使用ajax函数
        if (res.data.content) {
          that.setData({
            allOrder: res.data.content.items
          })  
        }
      })
    } else {
      that.initgetMore1()
    }
    that.init()
  },
  //更多好货
  init: function () {
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
  getMore2: function () {
    var that = this
    var pageNumber = that.data.pageNumber + 1
    app.Util.ajax('mall/home/bestChoice', {
      pageNumber: pageNumber,
      pageSize: that.data.pageSize
    }, 'GET').then((res) => { // 使用ajax函数
      if (res.data.content) {
        if (res.data.content.items == '' && that.data.list !== '') {
          that.setData({
            text: '已经到底啦'
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
  //页面初始化全部订单
  initgetMore1: function () {
    var that = this
    var pageNumber = that.data.pageNumber
    var latestStatus = that.data.currentTab ? that.data.currentTab : ''
    app.Util.ajax('mall/order/queryOrderListByUserId', {
      pageNumber: pageNumber,
      pageSize: that.data.pageSize,
      latestStatus: latestStatus
    }, 'GET').then((res) => { // 使用ajax函数
      if (res.data.content) {
        that.setData({
          allOrder: res.data.content.items
        })
      }
    })
  },
  //加载更多订单
  getMore1: function () {
    var that = this
    var pageNumber = that.data.pageNumber+1
    app.Util.ajax('mall/order/queryOrderListByUserId', {
      pageNumber: pageNumber,
      pageSize: that.data.pageSize
    }, 'GET').then((res) => { // 使用ajax函数
      if (res.data.content) {
        if (res.data.content.items == '' && that.data.allOrder !== '') {
          that.setData({
            text: '已经到底啦'
          })
        }
        var arr = that.data.allOrder
        for (var i = 0; i < res.data.content.items.length; i++) { 
          arr.push(res.data.content.items[i])
        }
        that.setData({
          allOrder: arr,
          pageNumber: pageNumber
        })
      }
    })
  },
  //各种按钮
  //付款
  toPay:function(e){
    var orderId = e.currentTarget.dataset.orderid
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/paymentorder/paymentorder?orderId=${orderId}&id=${id}`,
    })
  },
  //确认收货
  confirmReceipt:function(e){
    var that = this
    that.setData({
      showDialog: true,
      refundorderId: e.currentTarget.dataset.orderid
    })
  },
  //取消收货
  cancel:function(){
    var that = this
    that.setData({
      showDialog: false
    })
  },
  //确认收货
  allow:function(e){
    var that = this
    var orderId = that.data.refundorderId
    app.Util.ajax('mall/order/confirmReceipt', { orderId:orderId}, 'POST').then((res) => { // 使用ajax函数
      if (res.data.content) {
        that.initgetMore1()
      }else{
        wx.showToast({
          title: res.data.message,
          icon:'none'
        })
      }
    })
    that.setData({
      showDialog: false
    })
  },
  //取消退款
  cancelRefund:function(e){
    var that = this
    that.setData({
      showDialog1: true,
      refundorderId: e.currentTarget.dataset.orderid
    })
  },
  //取消
  cancelrefund: function () {
    var that = this
    that.setData({
      showDialog1: false
    })
  },
  //确定
  surerefund: function (e) {
    var that = this
    var orderId = that.data.refundorderId
    app.Util.ajax('mall/order/cancelRefund', { orderId: orderId }, 'POST').then((res) => { // 使用ajax函数
      if (res.data.content) {
        that.initgetMore1()
      } else {
        wx.showToast({
          title: res.data.message,
          icon: 'none'
        })
      }
    })
    that.setData({
      showDialog1: false
    })
  },
  //退款
  refund: function (e) {
    var that = this
    that.setData({
      showDialog2: true,
      refundorderId: e.currentTarget.dataset.orderid
    })
  },
  //取消
  refundDialog: function () {
    var that = this
    that.setData({
      showDialog2: false
    })
  },
  //申请退款
  application: function (e) {
    var that = this
    var orderId = that.data.refundorderId
    var desc = that.data.reason
    app.Util.ajax('mall/order/applyRefund', { orderId: orderId, desc: desc }, 'POST').then((res) => { // 使用ajax函数
      if (res.data.content) {
        that.initgetMore1()
      } else {
        wx.showToast({
          title: res.data.message,
          icon: 'none'
        })
      }
    })
    that.setData({
      showDialog2: false
    })
  },
  //获取退款理由
  getText:function(e){
    var that = this
    var current = e.currentTarget.dataset.current
    var reason = e.currentTarget.dataset.text
    that.setData({
      current:current,
      reason: reason
    })
  },
  //取消订单
  cancelOrder: function (e) {
    var that = this
    that.setData({
      showDialog3: true,
      refundorderId: e.currentTarget.dataset.orderid
    })
  },
  //取消
  cancelorder: function () {
    var that = this
    that.setData({
      showDialog3: false
    })
  },
  //确定
  sureorder: function (e) {
    var that = this
    var orderId = that.data.refundorderId
    var desc = that.data.reason1
    app.Util.ajax('mall/order/cancelOrder', { orderId: orderId, desc: desc }, 'POST').then((res) => { // 使用ajax函数
      if (res.data.content) {
        that.initgetMore1()
        that.setData({
          showDialog3: false
        })
      } else {
        wx.showToast({
          title: res.data.message,
          icon: 'none'
        })
      }
    })  
  },
  //获取退款理由
  getText1: function (e) {
    var that = this
    var current = e.currentTarget.dataset.current
    var reason = e.currentTarget.dataset.text
    that.setData({
      current: current,
      reason1: reason
    })
  },
  //去评价
  toEvaluate:function(e){
    var that = this
    that.setData({
      showDialog4: true,
      multiShow:false,
      refundorderId: e.currentTarget.dataset.orderid
    })
  },
  //获取文本框的长度
  input(e) {
    var value = e.detail.value,
    len = parseInt(value.length);
    let that = this;
    that.setData({
      currentNoteLen: len,
      evaluate: value
    })
  },
  //用户给评分
  in_xin: function (e) {
    var in_xin = e.currentTarget.dataset.in;
    var one_2;
    if (in_xin === 'use_sc2') {
      one_2 = Number(e.currentTarget.id);
    } else {
      one_2 = Number(e.currentTarget.id) + this.data.one_2;
    }
    this.setData({
      one_2: one_2,
      two_2: 5 - one_2
    })
  },
  //取消
  cancelEvaluate: function () {
    var that = this
    that.setData({
      showDialog4: false,
      one_2: 5,//实心星星
      two_2: 0,//空心星星
      evaluate: ''
    })
  },
  //确定
  sureEvaluate: function () {
    var that = this
    var orderId = that.data.refundorderId
    var score = that.data.one_2
    var content = that.data.evaluate
    if (score ==''){
      wx.showToast({
        title: '请对商品进行评分',
        icon: 'none'
      })
    }else{
      app.Util.ajax('mall/interact/addUserInteract', { orderId: orderId, score: score, action: 1, content: content }, 'POST').then((res) => {
        if (res.data.content) {
          that.initgetMore1()
          that.setData({
            showDialog4: false,
            one_2: 5,//实心星星
            two_2: 0,//空心星星
            evaluate:''
          })
        } else {
          wx.showToast({
            title: res.data.message,
            icon: 'none'
          })
        }
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
    var that = this;
    that.setData({
      pageNumber: 1
    })
    that.initgetMore1()
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
    // wx.reLaunch({
    //   url: '/pages/mine/mine'
    // }) 
    var pages = getCurrentPages() //获取加载的页面
    var currentPage = pages[pages.length - 2] //获取当前页面的对象
    var url = currentPage.route
    if (url == 'pages/paymentorder/paymentorder') {
      wx.reLaunch({
        url: '/pages/mine/mine'
      })
    }
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    wx.stopPullDownRefresh() //停止下拉刷新
  },

  /**
  * 页面上拉触底事件的处理函数
  */
  onReachBottom: function () {
    var that = this;
    if (that.data.allOrder.length > 2){
      that.getMore1() 
    }else{
      that.getMore2()
    }
    
  },

  /**
 * 用户点击右上角分享
 */
  onShareAppMessage: function (ops) {
    var that = this
    if (ops.from === 'button') {
      // 来自页面内转发按钮
      that.setData({
        showModalStatus: false
      })
      app.Util.ajax('mall/weChat/sharing/onSuccess', { mode: 1 }, 'POST').then((res) => {
        if (res.data.content) {
          wx.showToast({
            title: '分享成功',
            icon: 'none'
          })
        } else {
          wx.showToast({
            title: res.data.message,
            icon: 'none'
          })
        }
      })
    }
    return {
      title: that.data.shareList.title,
      path: that.data.shareList.link,
      imageUrl: that.data.shareList.imageUrl,
      success: function (res) {
        
      },
      fail: function (res) {
        // 转发失败
        console.log("转发失败:" + JSON.stringify(res));
      }
    }
  },
  tab: function(e) {
    var that = this;    
    var status = e.currentTarget.dataset.status
    that.setData({
      pageNumber:1
    })
    if (status == 0){
      that.setData({
        currentTab: ''
      })
    }else{
      that.setData({
        currentTab: status
      })
    }
    if (status == 0){
      that.initgetMore1()
    }else{
      app.Util.ajax('mall/order/queryOrderListByUserId', {
        pageNumber: 1,
        pageSize: 10,
        latestStatus: status
      }, 'GET').then((res) => { // 使用ajax函数
        if (res.data.content) {
          that.setData({
            allOrder: res.data.content.items
          })
        }
      })
    }
    
    for (var i in this.data.orderTabItem) {
      that.setData({
        [`orderTabItem[${i}].select`]: false
      });
    }
    that.setData({
      [`orderTabItem[${e.currentTarget.dataset.index}].select`]: true
    });
  },
 
})