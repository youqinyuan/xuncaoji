
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showModal:false,
    choose:false,
    showModal:false,
    shurePeriod:false,
    paymentAmount:'',
    hostUrl: app.Util.getUrlImg().hostUrl,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    console.log("id:"+options.id)
    console.log("缓存id:"+wx.getStorageSync('mentionPeriodId'))
    console.log("inviterCode:"+options.inviterCode)
    if(options.inviterCode){
      wx.setStorageSync('othersInviterCode',options.inviterCode)
      that.setData({
        inviterCode:options.inviterCode
      })
    }
    if(options.id){
      that.setData({
        id:options.id
      })
      wx.setStorageSync('mentionPeriodId',options.id)
    }else{
      that.setData({
        id:wx.getStorageSync('mentionPeriodId')
      })
    }
    that.init()
    //通过分享帮助提期，完成后返回论坛提期
    wx.setStorage({
      key: "mentionPeriodFrom",
      data: '1'
    })
  },
  init:function(){
    let that = this
    app.Util.ajax('mall/forum/topic/findDetail', {
      id:that.data.id
    }, 'GET').then((res) => {
      if (res.data.messageCode == 'MSG_1001') {
        that.setData({
          content:res.data.content,
          mentionPeriodList:res.data.content.mentionPeriodList
        })
        console.log(11)
        console.log(res.data.content)
        that.detail()
      }else{
        wx.showToast({
          title:res.data.message,
          icon:'none'
        })
      }
    })
  },
  detail:function(){
    let that = this
    app.Util.ajax('mall/forum/topic/getMentionPeriod', {
      orderId:that.data.content.orderId,
      orderGoodsId:that.data.content.orderGoodsId,
      transferId:that.data.content.transferId?that.data.content.transferId:'',
      userId:that.data.content.userId,
      code:that.data.content.code?that.data.content.code:'',
    }, 'GET').then((res) => {
      if (res.data.messageCode == 'MSG_1001') {
        that.setData({
          detail:res.data.content
        })
      }else{
        wx.showToast({
          title:res.data.message,
          icon:'none'
        })
      }
    })
  },
  shure:function(e){
    let that = this
    let token = wx.getStorageSync('token')
    let nowTime = Date.now()
    let tempTime = wx.getStorageSync('mentionPeriodTime')
    if (token) {
      app.globalData.helpMentionPeriod = 2
      if(that.data.paymentAmount){
        if(that.data.choose&&!that.data.shurePeriod){
          if(tempTime&&tempTime-nowTime>86400000){
            that.setData({
              shurePeriod:true
            })
            wx.setStorageSync('mentionPeriodTime',nowTime)
          }else if(!tempTime){
            that.setData({
              shurePeriod:true
            })
            wx.setStorageSync('mentionPeriodTime',nowTime)
          }else{
            let id = e.currentTarget.dataset.id?e.currentTarget.dataset.id:that.data.id
          console.log(that.data.paymentAmount)
          app.Util.ajax('mall/forum/topic/addMentionPeriod', {
            topicId:id,
            paymentAmount:that.data.choose?that.data.paymentAmount*2:that.data.paymentAmount,
            period:that.data.choose?0.5:1
          }, 'POST').then((res) => {
            if (res.data.messageCode == 'MSG_1001') {
              if(that.data.choose){
                wx.navigateTo({
                  url: `/pages/paymentorder/paymentorder?transNumber=${res.data.content.transNumber}&id=${res.data.content.id}&helpMentionPeriod=1&isMentionPeriod=1`,
                })
              }else{
                wx.navigateTo({
                  url: `/pages/paymentorder/paymentorder?transNumber=${res.data.content.transNumber}&id=${res.data.content.id}&helpMentionPeriod=1`,
                })
              }
            }else{
              wx.showToast({
                title:res.data.message,
                icon:'none'
              })
            }
          })
          that.setData({
            shurePeriod:false
          })
          }
        }else{
          let id = e.currentTarget.dataset.id?e.currentTarget.dataset.id:that.data.id
          console.log(that.data.paymentAmount)
          app.Util.ajax('mall/forum/topic/addMentionPeriod', {
            topicId:id,
            paymentAmount:that.data.choose?that.data.paymentAmount*2:that.data.paymentAmount,
            period:that.data.choose?0.5:1
          }, 'POST').then((res) => {
            if (res.data.messageCode == 'MSG_1001') {
              if(that.data.choose){
              wx.navigateTo({
                url: `/pages/paymentorder/paymentorder?transNumber=${res.data.content.transNumber}&id=${res.data.content.id}&helpMentionPeriod=1&isMentionPeriod=1`,
              })
            }else{
              wx.navigateTo({
                url: `/pages/paymentorder/paymentorder?transNumber=${res.data.content.transNumber}&id=${res.data.content.id}&helpMentionPeriod=1`,
              })
            }
            }else{
              wx.showToast({
                title:res.data.message,
                icon:'none'
              })
            }
          })
          that.setData({
            shurePeriod:false
          })
        }
      }else{
        wx.showToast({
          title:'请输入帮助金额',
          icon:'none'
        })
      }
    } else {
      wx.navigateTo({
        url: "/pages/invitationCode/invitationCode?inviterCode=" + that.data.inviterCode
      })
      
    }
    
  },
  bindMoney:function(e) {
    let that = this
    let paymentAmount = 0
    that.setData({
      paymentAmountValue:e.detail.value
    })
    paymentAmount = e.detail.value
    let temp = that.data.detail.mentionPeriodDetailList
    let tempPeriod = 0
    if(paymentAmount<temp[0].amount){
      tempPeriod = temp[0].period 
    }else if(paymentAmount>temp[temp.length-1].amount){
        tempPeriod  = temp[temp.length-1].period - 1
    }else{
      for(let i=0;i<=temp.length-1;i++){
        if(temp[i].amount==paymentAmount){
          tempPeriod = temp[i].period - 1
        }else if(temp[i].amount<paymentAmount&&paymentAmount<temp[i+1].amount){
          tempPeriod = temp[i].period - 1
        }
      }
    }
    that.setData({
      paymentAmount:e.detail.value,
      tempPeriod:Math.ceil(temp[0].period-tempPeriod)
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
  toChoose:function(e){
    let that = this
    let index = e.currentTarget.dataset.index
    let paymentAmount = 0
    if(index==1){
      that.setData({
        choose:false
      })
    }else{
      that.setData({
        choose:true
      })
    }
  },
  toRule:function(){
    wx.navigateTo({
      url: '/packageA/pages/mentionPeriodRule/mentionPeriodRule'
    })
  },
  showModal:function(){
    this.setData({
      showModal:true
    })
  },
  closeModal:function(){
    this.setData({
      showModal:false
    })
  },
  clooseShurePeriod:function(){
    this.setData({
      shurePeriod:false
    })
  },
  toMarket:function(){
      app.globalData.type = 5
      wx.switchTab({
        url: '/pages/forum/forum',
      })
  }
})