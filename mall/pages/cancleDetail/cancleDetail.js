var time = require('../../utils/util.js');
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageNumber:1,
    pageSize:7,
    items:[],
    text:'',
    textData:'',
    showDialog:false,
    orderId:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    that.init();
  },
  init:function(){
    let that = this
    app.Util.ajax('mall/personal/querAuditDetails', { pageNumber: that.data.pageNumber, pageSize: that.data.pageSize}, 'GET').then((res) => { 
      console.log(JSON.stringify(res.data.content))
      if (res.data.content) {
        for (var i = 0; i < res.data.content.items.length; i++) {
          res.data.content.items[i].tradeTime = time.formatTimeTwo(res.data.content.items[i].tradeTime, 'Y-M-D h:m:s');
          res.data.content.items[i].tradeAmount = -res.data.content.items[i].tradeAmount
          var temp = res.data.content.items[i].bankCardNumber
          console.log(res.data.content.items[i].bankCardNumber)
          if(res.data.content.items[i].bankCardNumber.length==19){
            res.data.content.items[i].bankCardNumber = temp.substr(0,4)+'***********'+temp.substr(temp.length-4)
          }else if(res.data.content.items[i].bankCardNumber.length==17){
            res.data.content.items[i].bankCardNumber = temp.substr(0,4)+'*********'+temp.substr(temp.length-4)
          }else if(res.data.content.items[i].bankCardNumber.length==16){
            res.data.content.items[i].bankCardNumber = temp.substr(0,4)+'********'+temp.substr(temp.length-4)
          }else{
            res.data.content.items[i].bankCardNumber = '*******************'
          }
        }
        that.setData({
          items: res.data.content.items
        })
        if (that.data.items.length===0){
          that.setData({
            textData:'暂无数据'
          })
        }
      }
    })
  },
  getMore:function(){
    var that = this
    var pageNumber = that.data.pageNumber + 1
    app.Util.ajax('mall/personal/querAuditDetails', { pageNumber: pageNumber, pageSize: that.data.pageSize},'GET').then((res) => { // 使用ajax函数
      console.log(JSON.stringify(res.data.content))
      if (res.data.content) {
        if (res.data.content.items == '' && that.data.items !== '') {
          that.setData({
            text: '已经到底啦'
          })
        }
        var arr = that.data.items
        for (var i = 0; i < res.data.content.items.length; i++) {
          console.log(i)
          res.data.content.items[i].tradeTime = time.formatTimeTwo(res.data.content.items[i].tradeTime, 'Y-M-D h:m:s');
          res.data.content.items[i].tradeAmount = -res.data.content.items[i].tradeAmount
          for (var i = 0; i < res.data.content.items.length; i++) {
            res.data.content.items[i].tradeTime = time.formatTimeTwo(res.data.content.items[i].tradeTime, 'Y-M-D h:m:s');
            res.data.content.items[i].tradeAmount = -res.data.content.items[i].tradeAmount
            var temp = res.data.content.items[i].bankCardNumber
            console.log(res.data.content.items[i].bankCardNumber)
            if(res.data.content.items[i].bankCardNumber.length==19){
              res.data.content.items[i].bankCardNumber = temp.substr(0,4)+'***********'+temp.substr(temp.length-4)
            }else if(res.data.content.items[i].bankCardNumber.length==17){
              res.data.content.items[i].bankCardNumber = temp.substr(0,4)+'*********'+temp.substr(temp.length-4)
            }else if(res.data.content.items[i].bankCardNumber.length==16){
              res.data.content.items[i].bankCardNumber = temp.substr(0,4)+'********'+temp.substr(temp.length-4)
            }else{
              res.data.content.items[i].bankCardNumber = '*******************'
            }
          }
          arr.push(res.data.content.items[i])
        }
        that.setData({
          items: arr,
          pageNumber: pageNumber
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
    var that = this
    // that.setData({
    //   pageNumber: 1
    // })
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
    var that = this
    that.setData({
      pageNumber:1
    })
    that.init()
    setTimeout(function(){
      wx.stopPullDownRefresh() //停止下拉刷新
    },1000)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this
    that.getMore();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  //显示
  returnedMoney(e){
    console.log(e.currentTarget.dataset.orderid)
    var orderId = parseInt(e.currentTarget.dataset.orderid)
    this.setData({
      orderId:orderId,
      showDialog:true
    })
  },
  //隐藏
  cancel:function(){
    this.setData({
      showDialog:false
    })
  },
  //确定
  comfire:function(){
    var that = this
    app.Util.ajax('mall/personal/cancelAudit', {id:that.data.orderId}, 'POST').then((res) => { // 使用ajax函数
      console.log(111+JSON.stringify(res.data))
      if (res.data.messageCode == 'MSG_1001') {
        that.setData({
          showDialog:false,
          pageNumber:1
        })
        wx.showToast({
          title:'取消成功',
          icon:"none"
        })
        setTimeout(function(){
          console.log(33)
          that.init()
        },1000)
      }else{
        wx.showToast({
          title:res.data.message,
          icon:"none"
        })
        that.setData({
          showDialog:false
        })
      }
    })
  }
})