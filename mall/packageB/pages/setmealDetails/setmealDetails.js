// packageB/pages/setmealDetails/setmealDetails.js
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: null, //商品id
    setmealDetails: null, //套餐详情
    pageNumber: 1,
    getEvaluate:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this
    that.setData({
      id: options.id
    })
    that.setmealDetails();
    that.setmealEvaluation();
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

  },
  setmealDetails() {
    let that = this
    app.Util.ajax('mall/home/packageGoodsDetail', {
      id: that.data.id
    }, 'GET').then((res) => {
      if (res.data.messageCode == 'MSG_1001') {
        console.log(res.data.content)
        that.setData({
          setmealDetails: res.data.content
        })
      }
    })
  },
  freeTell: function () {
    let that = this
    wx.makePhoneCall({
      phoneNumber: that.data.setmealDetails.store.mobileNumber
    })
  },
  setmealEvaluation() {
    let that = this
    app.Util.ajax('mall/home/packageGoodsEvaluation', {
      id: that.data.id,
      pageNumber: that.data.pageNumber,
      pageSize:4
    }, 'GET').then((res) => {
      if (res.data.messageCode == 'MSG_1001') {
        console.log(res.data.content.items)
        that.setData({
          setmeal: res.data.content.totalSize,
          setmealEvaluation: res.data.content.items
        })
        if (that.data.setmealEvaluation.length>4){
          that.setData({
            getEvaluate: '查看更多评价>'
          })
        }
      }
    })
  },
  getEvaluation(){
    let that = this
    let pageNumber = that.data.pageNumber + 1
    app.Util.ajax('mall/home/packageGoodsEvaluation', {
      id: that.data.id,
      pageNumber: pageNumber,
      pageSize: 2,
    }, 'GET').then((res) => { // 使用ajax函数
      if (res.data.messageCode = 'MSG_1001') {
        if (res.data.content.items == '' && that.data.setmealEvaluation !== '') {
         wx.showToast({
           title: '没有更多数据了',
           icon:'none'
         })
         that.setData({
           getEvaluate:''
         })
        }
        var arr = that.data.setmealEvaluation
        res.data.content.items.forEach((v, i) => {
          arr.push(res.data.content.items[i])
        })
        that.setData({
          setmealEvaluation: arr,
          pageNumber: pageNumber
        })
      }
    })
  }
})