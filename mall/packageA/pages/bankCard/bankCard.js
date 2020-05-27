// packageA/pages/bankCard/bankCard.js
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hostUrl: app.Util.getUrlImg().hostUrl,
    queryBankList: [],
    showModal: false,
    delId:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

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
    that.init()
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
  init: function() {
    let that = this
    app.Util.ajax('mall/personal/queryBankList', null, 'GET').then((res) => {
      if (res.data.messageCode == 'MSG_1001') {
        for (let i = 0; i < res.data.content.length; i++) {
          res.data.content[i].bankNumber = res.data.content[i].bankCardNumber
          res.data.content[i].bankCardNumber = res.data.content[i].bankCardNumber.substring(res.data.content[i].bankCardNumber.length - 4)
        }
        that.setData({
          queryBankList: res.data.content
        })
      }
    })
  },
  delBtn(e) {
    let that = this
    that.setData({
      delId: e.currentTarget.dataset.id,
      showModal: true
    })

  },
  noNeed() {
    let that = this
    that.setData({
      showModal: false
    })
  },
  need() {
    let that = this
    app.Util.ajax('mall/personal/deleteBank?id=' + that.data.delId, null, 'DELETE').then((res) => {
      if (res.data.messageCode == 'MSG_1001') {
        wx.showToast({
          title: '删除成功',
          icon:'none'
        })
        that.setData({
          showModal: false
        })
        setTimeout(function(){
          that.init()
        },500)
      }else{
        wx.showToast({
          title: res.data.message,
          icon: 'none'
        })
        that.setData({
          showModal: false
        })
      } 
    })
  },
  addCard() {
    wx.navigateTo({
      url: '/packageA/pages/addCard/addCard',
    })
  },
  editCard(e) {
    let data = {
      address: e.currentTarget.dataset.address,
      bank: e.currentTarget.dataset.bank,
      isdefault: e.currentTarget.dataset.isdefault,
      name: e.currentTarget.dataset.name,
      id: e.currentTarget.dataset.id
    }
    let bankMsg = JSON.stringify(data)
    wx.navigateTo({
      url: '/packageA/pages/editCard/editCard?data=' + bankMsg,
    })
  },
})