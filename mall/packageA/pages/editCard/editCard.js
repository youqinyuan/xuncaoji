// packageA/pages/editCard/editCard.js
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    switchChecked: true,
    card: '',
    address: '',
    name: '',
    id:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    let bankMsg = JSON.parse(options.data)
    that.setData({
      switchChecked: bankMsg.isdefault==1?true:false,
      card: bankMsg.bank,
      address: bankMsg.address,
      name: bankMsg.name,
      id: bankMsg.id
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
  bindCard(e) {
    let that = this
    that.setData({
      card: e.detail.value
    })
  },
  bindAddress(e) {
    let that = this
    that.setData({
      address: e.detail.value
    })
  },
  bindName(e) {
    let that = this
    that.setData({
      name: e.detail.value
    })
  },
  switchChange(e) {
    let that = this
    that.setData({
      switchChecked: !that.data.switchChecked
    })
  },
  submit() {
    let that = this
    if (that.data.card == '') {
      wx.showToast({
        title: '银行卡卡号不能为空',
        icon: 'none'
      })
    } else if (that.data.address == '') {
      wx.showToast({
        title: '开户行不能为空',
        icon: 'none'
      })
    } else if (that.data.name == '') {
      wx.showToast({
        title: '姓名不能为空',
        icon: 'none'
      })
    } else {
      let data = {
        id:that.data.id,
        bankCardNumber: that.data.card,
        bankAddress: that.data.address,
        realName: that.data.name,
        isDefault: that.data.switchChecked == true ? 1 : 2
      }
      app.Util.ajax('mall/personal/updateBankCard', data, 'POST').then((res) => {
        if (res.data.messageCode == 'MSG_1001') {
          wx.showToast({
            title: '保存成功',
            icon:'none'
          })
          setTimeout(function(){
            wx.navigateBack({})
          },500)
        }else{
          wx.showToast({
            title: res.data.message,
            icon: 'none'
          })
        }
      })
    }
  }
})