// packageA/pages/seedRecharge/seedRecharge.js
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    seedIndex:null,
    getNumber:'',
    getSeed:'',
    listSeed:[10,30,50,100,200,300,500,800,1000],
    paymentAmount:0,
    addSendOrder:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    let that = this
    if (app.globalData.seedText == '充值成功'){
      wx.showToast({
        title: app.globalData.seedText,
        icon:'none'
      })
      that.setData({
        seedIndex: null,
        getNumber: '',
        getSeed: '',
        paymentAmount: 0,
        addSendOrder: null
      })
      app.globalData.seedText = ''
    }
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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  selectSeed(e){
    let that = this
    that.setData({
      getNumber:'',
      seedIndex: e.currentTarget.dataset.index,
      getSeed: e.currentTarget.dataset.num
    })
    app.Util.ajax('mall/order/addSendOrder', { quantity: that.data.getSeed}, 'POST').then((res) => {
      if (res.data.content) {
        that.setData({
          paymentAmount: res.data.content.paymentAmount,
          addSendOrder: res.data.content
        })
      }
    })
  },
  getNumber(e){
    let that = this
    that.setData({
      getNumber:e.detail.value,
      getSeed: Number(e.detail.value),
      seedIndex:null
    })
  },
  blurNumber(e){
    let that = this
    if(that.data.getSeed==0){
      wx.showToast({
        title: '请输入大于0的种子数量',
        icon:'none'
      })
    } else if (isNaN(that.data.getSeed)) {
      wx.showToast({
        title: '请输入正确的种子数量',
        icon: 'none'
      })
    }else{
      app.Util.ajax('mall/order/addSendOrder', { quantity: that.data.getSeed }, 'POST').then((res) => {
        if (res.data.content) {
          that.setData({
            paymentAmount: res.data.content.paymentAmount,
            addSendOrder: res.data.content
          })
        }
      })
    }    
  },
  seedBtn(){
    let that = this
    if(that.data.getSeed==''){
      wx.showToast({
        title: '请选择种子或者输入大于0的种子数量',
        icon: 'none'
      })
    }else{
      wx.navigateTo({
        url: `/pages/paymentorder/paymentorder?id=${that.data.addSendOrder.id}&seedBtn=${1}`,
      })
    }   
  }
})