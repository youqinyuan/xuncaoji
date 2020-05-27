// packageA/pages/seedMask/seedMask.js
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shareList:{},
    seedNumber:null,
    seedNum:0,
    seedAmount:0,
    seedRole:0,
    hostUrl: app.Util.getUrlImg().hostUrl,
    seedList: [{
      img: app.Util.getUrlImg().hostUrl +'/newIndex/seedSave.png',
      text: '账户存钱',
      texts: '去存钱 >',
      imgs: app.Util.getUrlImg().hostUrl +'/newIndex/seedSign.png'
    }, {
        img: app.Util.getUrlImg().hostUrl +'/newIndex/seedBuy.png',
      text: '购买商品',
      texts: '去购买 >',
        imgs: app.Util.getUrlImg().hostUrl +'/newIndex/seedSign.png'
    }, {
        img: app.Util.getUrlImg().hostUrl +'/newIndex/seedForum.png',
      text: '社区发帖',
      texts: '去发帖 >',
        imgs: app.Util.getUrlImg().hostUrl +'/newIndex/seedSign.png'
    }, {
        img: app.Util.getUrlImg().hostUrl +'/newIndex/seedGet.png',
      text: '待返转让',
      texts: '去转让 >',
        imgs: app.Util.getUrlImg().hostUrl +'/newIndex/seedSign.png'
    }],
    inviterCode: '',
    showModalStatus: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (options.inviterCode) {
      wx.setStorage({
        key: "othersInviterCode",
        data: options.inviterCode
      })
      that.setData({
        inviterCode: options.inviterCode
      })
    }
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
    if(wx.getStorageSync('token')){
      that.querySignSeed()   
      that.seedAmount()
    }
    that.querySeedProportion()
    that.initShare()
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
  onShareAppMessage: function(res) {
    let that = this
    if (res.from == "button") {
      if (res.target.id === 'btn' || res.target.id === 'btnGroup') {
        that.setData({
          showModalStatus:false
        })
        return {
          title: that.data.shareList.desc,
          path: that.data.shareList.link,
          imageUrl: app.Util.getUrlImg().hostUrl+'/newIndex/seedShare.png',
          success: function(res) {},
          fail: function(res) {
            console.log("转发失败:" + JSON.stringify(res));
          }
        }
      }
    }
  },
  initShare(){
    let that = this
    app.Util.ajax('mall/weChat/sharing/target', { mode : 17}, 'GET').then((res) => {
      if (res.data.content) {
        let inviterCode = wx.getStorageSync('inviterCode')
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
  //立即签到
  getSeed() {
    let that = this
    if (wx.getStorageSync("token")) {
      app.Util.ajax('mall/seed/sign', null, 'POST').then((res) => {
        if (res.data.content) {
          wx.showToast({
            title: `签到成功+${res.data.content}颗种子`,
            icon: 'none'
          })
          that.setData({
            seedNumber: res.data.content
          })
        }else{
          wx.showToast({
            title: '你今天已经签到啦，明天再来吧',
            icon:'none'
          })
        }
      })
    } else {
      wx.navigateTo({
        url: '/pages/invitationCode/invitationCode?inviterCode=' + that.data.inviterCode,
      })
    }
  },
  //查询签到种子数量
  querySignSeed(){
    let that = this
    app.Util.ajax('mall/seed/querySignSeed', null, 'GET').then((res) => {
      if (res.data.content) {
        that.setData({
          seedNum:res.data.content
        })
      }
    })
  },
  //查询兑换比例
  querySeedProportion() {
    let that = this
    app.Util.ajax('mall/seed/querySeedProportion', null, 'GET').then((res) => {
      if (res.data.content) {
        that.setData({
          seedRole: res.data.content
        })
      }
    })
  },
  //查询种子数量
  seedAmount() {
    let that = this
    app.Util.ajax('mall/seed/seedAmount', null, 'GET').then((res) => {
      if (res.data.content) {
        that.setData({
          seedAmount: res.data.content
        })
      }
    })
  },
  jumpPages(e) {
    let that = this
    let index = e.currentTarget.dataset.index
    if (index == 0) {
      if (wx.getStorageSync("token")) {
        wx.navigateTo({
          url: '/pages/mine/recharge/recharge?temp=1',
        })
      } else {
        wx.navigateTo({
          url: '/pages/invitationCode/invitationCode?inviterCode=' + that.data.inviterCode,
        })
      }
    } else if (index == 1) {
      wx.switchTab({
        url: '/pages/index/index',
      })
    } else if (index == 2) {
      wx.switchTab({
        url: '/pages/forum/forum',
      })
    } else if (index == 3) {
      if (wx.getStorageSync("token")) {
        wx.navigateTo({
          url: '/pages/waitReentryDetail/waitReentryDetail?temp=1',
        })
      } else {
        wx.navigateTo({
          url: '/pages/invitationCode/invitationCode?inviterCode=' + that.data.inviterCode,
        })
      }
    }
  },
  jumpIndex() {
    wx.switchTab({
      url: '/pages/index/index',
    })
  },
  getMessage() {
    wx.showToast({
      title: '即将开通，敬请期待',
      icon: 'none'
    })
  },
  seedMaskBtn() {
    let that = this
    if (wx.getStorageSync("token")) {
      that.setData({
        showModalStatus: true
      })
    } else {
      wx.navigateTo({
        url: '/pages/invitationCode/invitationCode?inviterCode=' + that.data.inviterCode,
      })
    }
  },
  cancelShare() {
    let that = this
    that.setData({
      showModalStatus: false
    })
  },
})