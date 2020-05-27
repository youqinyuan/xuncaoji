// packageA/pages/mentionPeriod/mentionPeriod.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // waitReentry:{}
    hostUrl: app.Util.getUrlImg().hostUrl,
    choose:true
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
    let waitReentry = wx.getStorageSync('waitReentry')?wx.getStorageSync('waitReentry'):''
    if(waitReentry){
      waitReentry.goodsName = waitReentry.goodsName.substring(0, 5)
      console.log(waitReentry)
      that.setData({
        waitReentry:waitReentry
      })
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
    wx.removeStorageSync('goWaitReentry')
    wx.removeStorageSync('waitReentry')
    wx.removeStorageSync('goMentionPeriod')
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
  toRule:function(){
    wx.navigateTo({
      url: '/packageA/pages/mentionPeriodRule/mentionPeriodRule'
    })
  },
  chooseReturn:function(){
    wx.navigateTo({
        url: '/pages/waitReentryDetail/waitReentryDetail?goMentionPeriod=1',
      })
      wx.setStorage({
        key: "goMentionPeriod",
        data: "1"
      })
  },
    //跳转返现明细
    Reentry_detail: function(e) {
      var defaultAmountStatus = e.currentTarget.dataset.defaultamountstatus
      var whetherAdvanceSale = e.currentTarget.dataset.whetheradvancesale
      var orderId = e.currentTarget.dataset.orderid
      var orderGoodsId = e.currentTarget.dataset.ordergoodsid
      var transferId = e.currentTarget.dataset.transferid == null ? "" : e.currentTarget.dataset.transferid
      var proStatus = e.currentTarget.dataset.prostatus
      var newPeopleActivity = e.currentTarget.dataset.returntype==3?2:1
      // if (proStatus == 1) {
        wx.navigateTo({
          url: "/pages/cashBack/cashBack?from=2&proStatus=1&orderId=" + orderId + "&orderGoodsId=" + orderGoodsId + "&transferId=" + transferId + "&newPeopleActivity=" + newPeopleActivity + "&whetherAdvanceSale="+whetherAdvanceSale + "&defaultAmountStatus="+defaultAmountStatus
      //   })
      // } else {
      //   wx.navigateTo({
      //     url: "/pages/cashBack/cashBack?from=2&orderId=" + orderId + "&orderGoodsId=" + orderGoodsId + "&transferId=" + transferId+ "&newPeopleActivity=" + newPeopleActivity + "&whetherAdvanceSale="+whetherAdvanceSale + "&defaultAmountStatus="+defaultAmountStatus
         })
      // }
    },
    getMoney:function(e){
       console.log(e.detail.value)
       this.setData({
        commission:e.detail.value
       })
    },
    getNianHua:function(){
      let that = this
      if(that.data.commission){
        app.Util.ajax('mall/forum/topic/getMentionPeriodAnnualized', {
          amount:that.data.waitReentry.maxMentionPeriodAmount,
          commission:that.data.commission
        }, 'GET').then((res) => { // 使用ajax函数
          if (res.data.messageCode=="MSG_1001"){
            that.setData({
              nianhua:res.data.content
            })
          }else{
            wx.showToast({
              title:res.data.message,
              icon:'none'
            })
          }
        })
      }
    },
    setMentionPeriod:function(){
      let that = this
      console.log(that.data.commission)
      if(that.data.waitReentry){
        if(that.data.commission){
           if(that.data.commission>1||that.data.commission==1){
            app.Util.ajax('mall/forum/topic/addMentionPeriodTopic', {
              orderId: that.data.waitReentry.orderId,
              orderGoodsId: that.data.waitReentry.orderGoodsId,
              transferId:that.data.waitReentry.transferId,
              commissionAmount:that.data.commission,
              code:that.data.waitReentry.code,
              visible:that.data.choose?1:2
            }, 'POST').then((res) => { // 使用ajax函数
              if (res.data.messageCode=="MSG_1001"){
                console.log(res.data.content.id)
                wx.navigateTo({
                  url: `/pages/paymentorder/paymentorder?transNumber=${res.data.content.transNumber}&id=${res.data.content.id}&mentionPeriod=1`,
                })
              }else{
                wx.showToast({
                  title:res.data.message,
                  icon:'none'
                })
              }
            })
           }else{
            wx.showToast({
              title:'请检查佣金金额输入是否正确',
              icon:'none'
            })
        }
        }else{
          wx.showToast({
            title:'请输入佣金金额，最低1元',
            icon:'none'
          })
        }
      }else{
        wx.showToast({
          title:'请选择需要提期的待返订单',
          icon:'none'
        })
      }
      
    },
    choose:function(){
      let that = this
      if(that.data.choose){
        wx.showToast({
          title:'再次发帖请至“我发起的提期”页面进行操作',
          icon:'none'
        })
      }
        that.setData({
          choose:!that.data.choose
        })
    }
})