// pages/evaluate/evaluate.js
var time = require('../../utils/util.js');
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsId:1,//商品id
    comment:[],//商品评论
    pageNumber: 1,
    pageSize: 6,
    avgGoddInteract:1,//综合评分
    goodInteractRate:'',//好评率
    text:'',
    options:{},
    hostUrl: app.Util.getUrlImg().hostUrl,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.setData({
      goodsId: parseInt(options.goodsId),
      options: options
    })
    that.comment()
  },
  //商品评论
  comment: function () {
    var that = this
    app.Util.ajax('mall/interact/queryUserInteract', {
      pageNumber: that.data.pageNumber,
      pageSize: that.data.pageSize,
      goodsId: that.data.goodsId
    }, 'GET').then((res) => {
      if (res.messageCode = 'MSG_1001') {
        for (var i = 0; i < res.data.content.items.length;i++){
          res.data.content.items[i].createTime = time.formatTimeTwo(res.data.content.items[i].createTime, 'Y-M-D h:m')
        }
        that.setData({
          goodInteractRate: res.data.content.goodInteractRate,
          avgGoddInteract: res.data.content.avgGoddInteract,
          comment: res.data.content.items
        })
      }
    })
  },
  getMore:function(){
    var that = this
    var pageNumber = that.data.pageNumber + 1
    //品质优选
    app.Util.ajax('mall/interact/queryUserInteract', {
      pageNumber: pageNumber,
      pageSize: that.data.pageSize,
      goodsId: that.data.goodsId
    }, 'GET').then((res) => { // 使用ajax函数
      if (res.messageCode = 'MSG_1001') {
        if (res.data.content.items == '' && that.data.comment !== '') {
          that.setData({
            text: '已经到底啦'
          })
        }
        var arr = that.data.comment
        for (var i = 0; i < res.data.content.items.length; i++) {
          res.data.content.items[i].createTime = time.formatTimeTwo(res.data.content.items[i].createTime, 'Y-M-D h:m:s')
          arr.push(res.data.content.items[i])
        }
        that.setData({
          comment: arr,
        })
        that.setData({
          pageNumber: pageNumber
        })
      }
    })
  },
  // 图片预览 - 获取需要预览的图片http连接列表
  getIdex:function(e){
    console.log(e)
    var that = this
    var index = e.currentTarget.dataset.index
    var imgList = that.data.comment[index].interactImageUrlList; //获取data-list
    var src = that.data.src 
    //图片预览
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: imgList // 需要预览的图片http链接列表
    })
  },
  //图片预览 - 获取当前显示的http连接
  imgYu: function (e) {
    var that = this
    var src = e.currentTarget.dataset.src; //获取data-src
    that.data.src = src
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
    var that = this
    that.setData({
      pageNumber:1
    })
    that.onLoad(that.data.options)
    wx.stopPullDownRefresh() //停止下拉刷新
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this
    that.getMore()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})