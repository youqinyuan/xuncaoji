// packageA/pages/getMoneyMessage/getMoneyMessage.js
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hostUrl: app.Util.getUrlImg().hostUrl,
    placeholder1: `请输入您想要出售该商品的价格-建议出价:￥1900`,
    placeholder2: '请填写违约金，不可低于￥5哦',
    showSuccess: false,
    getOrder: null, //查询商品信息
    getOffer: '', //出价
    getDefault: '', //违约金
    getDefault1:'',//后台设置的违约金最小值
    getDefault2:'',//后台设置的违约金最大值
    showBtn:'发布并支付违约金'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this
    if (options.editPrice){
      let editPrice = JSON.parse(options.editPrice)      
      editPrice.iconurl = editPrice.iconurl ? editPrice.iconurl + '?' + wx.getStorageSync('iconurl') : null
      let price = ((editPrice.dctprice * editPrice.quantity) * 0.95).toFixed(2)
      that.setData({
        getOrder: editPrice,
        getOffer: editPrice.expectamount,
        getDefault: editPrice.liquidate,
        showBtn:'保存'
      })
    }else{
      let getOrder = JSON.parse(options.getOrder)
      getOrder.iconurl = getOrder.iconurl ? getOrder.iconurl + '?' + wx.getStorageSync('iconurl') : null
      let price = ((getOrder.dctprice * getOrder.quantity) * 0.95).toFixed(2)
      that.setData({
        options:options,
        getOrder: getOrder,
        placeholder1: `请输入您想要出售该商品的价格-建议出价:￥${price}`
      })
    }
    that.getDefaultRole();
    that.getDefaultMax();
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
    console.log(JSON.parse(that.data.options.getOrder))
    if (wx.getStorageSync('getMoneyOrder')){
      that.setData({
        showSuccess: true
      })
      that.getDeTime()
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
    wx.removeStorageSync('getMoneyOrder')
    wx.removeStorageSync('goShowOrder')
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
  //出价
  getOffer(e) {
    let that = this;
    that.setData({
      getOffer: e.detail.value
    })
  },
  //获取违约金最小值
  getDefaultRole(){
    let that = this;
    app.Util.ajax('mall/paramConfig/getParamConfigByKey', { key:'GOODS_PRE_SALE_LIQUIDATED_DAMAGE_MIN '},'GET').then((res) => {
      if (res.data.content) {
        that.setData({
          placeholder2: `请填写违约金，不可低于￥${res.data.content.value}哦`,
          getDefault1: res.data.content.value
        })
      }
    })
  },
  //获取违约金最大值
  getDefaultMax() {
    let that = this;
    app.Util.ajax('mall/paramConfig/getParamConfigByKey', { key: 'GOODS_PRE_SALE_LIQUIDATED_DAMAGE_MAX ' }, 'GET').then((res) => {
      if (res.data.content) {
        that.setData({
          getDefault2: res.data.content.value
        })
      }
    })
  },
  getDeTime() {
    let that = this;
    app.Util.ajax('mall/paramConfig/getParamConfigByKey', { key: 'GOODS_PRE_SALE_PAID_AUTO_CANCEL_DATE  ' }, 'GET').then((res) => {
      if (res.data.content) {
        that.setData({
          getDeTime: res.data.content.value,
        })
      }
    })
  },
  //违约金
  getDefault(e) {
    let that = this;
    that.setData({
      getDefault: e.detail.value
    })
   
  },
  // 发布
  getMoneyPost(e) {
    let that = this;
    if(that.data.showBtn=='保存'){
      let data = {
        topicId: that.data.getOrder.id,
        expectAmount: that.data.getOffer,
      }
      if (that.data.getDefault == '') {
        wx.showToast({
          title: '出价不能为空',
          icon: 'none'
        })
      } else if (Number(that.data.getOffer) > Number(that.data.getOrder.dctprice)) {
        wx.showToast({
          title: '出价不可大于原价',
          icon: 'none'
        })
      }  else {
        app.Util.ajax('mall/forum/goodsPreSale/updateGoodsPreSaleExpectAmount', data, 'POST').then((res) => {
          if (res.data.messageCode == 'MSG_1001') {
           wx.navigateBack({})
            wx.removeStorageSync('iconurl')
          }else{
            wx.showToast({
              title: res.data.message,
              icon:'none'
            })
          }
        })
      }
    }else{
      let data = {
        type: 5,
        liquidateDamageAmountVendor: that.data.getDefault,
        platformOrgAmount: that.data.getOrder.dctprice,
        expectAmount: that.data.getOffer,
        stockId: that.data.getOrder.stockid,
        goodsQuantity: that.data.getOrder.quantity
      }
      if (that.data.getOffer == '') {
        wx.showToast({
          title: '出价不能为空',
          icon: 'none'
        })
      } else if (that.data.getDefault == '') {
        wx.showToast({
          title: '违约金不能为空',
          icon: 'none'
        })
      } else if (Number(that.data.getOffer) > Number(that.data.getOrder.dctprice)) {
        wx.showToast({
          title: '出价不可大于原价',
          icon: 'none'
        })
      }  else if (that.data.getDefault < that.data.getDefault1) {
        wx.showToast({
          title: `违约金不可低于${that.data.getDefault1}元哦`,
          icon: 'none'
        })
      } else if (Number(that.data.getDefault) > Number(that.data.getDefault2)) {
        wx.showToast({
          title: `违约金最大值为${that.data.getDefault2}元`,
          icon: 'none'
        })
      } else {
        app.Util.ajax('mall/forum/topic/addGoodsPreSaleTopic', data, 'POST').then((res) => {
          if (res.data.messageCode == 'MSG_1001') {
            wx.navigateTo({
              url: `/pages/paymentorder/paymentorder?id=${res.data.content.id}&getMoneyOrder=${1}`,
            })
            wx.removeStorageSync('iconurl')
          } else {
            wx.showToast({
              title: res.data.message,
              icon: 'none'
            })
          }
        })
      }
    }   
  },
  cancelGetMoney(e) {
    let that = this;
    let getOrder = JSON.parse(that.data.options.getOrder)
    if (getOrder.searchOrder=='1'){
      if (wx.getStorageSync('goShowOrder')){
        if (getCurrentPages().length > 2) {
          //获取页面栈
          let pages = getCurrentPages()
          let curPage = pages[pages.length - 2];
          let data = curPage.data;
          curPage.setData({
            showOrder: false
          });
        }
        wx.navigateBack({})
      }else{
        wx.switchTab({
          url: '/pages/forum/forum',
        })
        app.globalData.type = 2
      }    
    }
    that.setData({
      showSuccess: false
    })
    wx.removeStorageSync('getMoneyOrder')
    wx.removeStorageSync('goShowOrder')
  },
})