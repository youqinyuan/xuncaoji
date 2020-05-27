// packageA/pages/mentionPeriodIndex/mentionPeriodIndex.js
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hostUrl: app.Util.getUrlImg().hostUrl,
    siftLeft:false,
    siftRight:false,
    siftRightIndex:1,
    tabName:'发布时间新旧',
    isShield:false,
    mentionPeriodPageNum:1,
    pageSize:20,
    sort:1,
    shareImg:'',
    shareList:{},
    showModalStatus1:false,
    mentionPeriodContent:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  init:function(){
    let that = this
    app.Util.ajax('mall/forum/topic/findPageList', {
      pageNumber:that.data.mentionPeriodPageNum,
      pageSize:that.data.pageSize,
      type:7,
      isShield:that.data.isShield,
      sort:that.data.sort
    }, 'GET').then((res) => {
      if (res.data.messageCode == 'MSG_1001') {
        console.log(res.data.content)
        that.setData({
          content:res.data.content.items
        })
      }else{
        wx.showToast({
          title:res.data.message,
          icon:'none'
        })
      }
    })
  },
  getMentionPeriodInit: function() {
    var that = this
    var mentionPeriodPageNum = that.data.mentionPeriodPageNum + 1
    console.log(mentionPeriodPageNum)
    app.Util.ajax('mall/forum/topic/findPageList', {
      pageNumber: mentionPeriodPageNum,
      pageSize: that.data.pageSize,
      type: 7,
      isShield: that.data.isShield,
      sort: that.data.sort
    }, 'GET').then((res) => {
      if (res.data.content) {
        if (res.data.content.items == '' && that.data.content !== '') {
          wx.showToast({
            title: '已经到底啦',
            icon: 'none'
          })
        }
        let arr = that.data.content
        if (res.data.content.items.length > 0) {
          for (let i = 0; i < res.data.content.items.length; i++) {
            arr.push(res.data.content.items[i])
          }
          that.setData({
            content: arr,
            mentionPeriodPageNum: mentionPeriodPageNum
          })
        }
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
    let that = this
    that.setData({
      mentionPeriodPageNum:1
    })
    that.init()
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
    this.setData({
      mentionPeriodPageNum:1
    })
    this.init()
    wx.stopPullDownRefresh() //停止下拉刷新
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.getMentionPeriodInit()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    var that = this
    if (res.from == "button") {
      if (res.target.id === 'btn') {
        // 来自页面内转发按钮
        that.setData({
          showModalStatus1: false
        })
        app.Util.ajax('mall/weChat/sharing/onSuccess', {
          mode: 16
        }, 'POST').then((res) => {
          if (res.data.content) {
            wx.showToast({
              title: '分享成功',
              icon: 'none'
            })
          }
        })
        return {
          title: '请助我一臂之力帮我提期，您也可享受超高收益',
          path: that.data.shareList.link,
          imageUrl: that.data.shareImg,
          success: function(res) {

          },
          fail: function(res) {
            // 转发失败
            console.log("转发失败:" + JSON.stringify(res));
          }
        }
      } else if (res.target.id === 'btnGroup') {
        that.setData({
          showModalStatus1: false
        })
        app.Util.ajax('mall/weChat/sharing/onSuccess', {
          mode: 16
        }, 'POST').then((res) => {
          if (res.data.content) {
            wx.showToast({
              title: '分享成功',
              icon: 'none'
            })
          } else {

          }
        })
        return {
          title: '请助我一臂之力帮我提期，您也可享受超高收益',
          path: that.data.shareList.link,
          imageUrl: that.data.shareImg,
        }
      }
    }
  },
  selectSiftLeft:function(){
    var that = this
    if(that.data.siftLeft){
      console.log("不筛选")
      that.setData({
        siftLeft:false,
        isShield:false
      })
    }else{
      console.log("筛选")
      that.setData({
        siftLeft:true,
        isShield:true
      })
    }
    setTimeout(function(){
      that.init()
    },300)
  },
  selectSiftShow:function(){
    var that = this
    if(that.data.siftRight){
      console.log("隐藏")
      that.setData({
        siftRight:false
      })
    }else{
      console.log("显示")
      that.setData({
        siftRight:true
      })
    }
  },
  selectSiftRight:function(e){
    var that = this
    var index = e.currentTarget.dataset.index
    if(index==1){
      that.setData({
        siftRightIndex:index,
        tabName:'发布时间新旧',
        sort:index
      })
    }else{
      that.setData({
        siftRightIndex:index,
        tabName:'收益率高低',
        sort:index
      })
    }
    setTimeout(function(){
      that.setData({
        siftRight:false
      })
      that.init()
    },300)
  },
  toRule:function(){
    wx.navigateTo({
      url: '/packageA/pages/mentionPeriodRule/mentionPeriodRule'
    })
  },
  toMySet:function(){
    let token = wx.getStorageSync('token')
    let that = this
    if (token) {
      wx.navigateTo({
        url: '/packageA/pages/buyMentionPeriod/buyMentionPeriod'
      })
    } else {
      wx.navigateTo({
        url: "/pages/invitationCode/invitationCode"
      })
    }
  },
  toMyBuy:function(){
    let token = wx.getStorageSync('token')
    if (token) {
      wx.navigateTo({
        url: '/packageA/pages/setMentionPeriod/setMentionPeriod'
      })
    } else {
      wx.navigateTo({
        url: "/pages/invitationCode/invitationCode"
      })
    }
  },
  setMentionPeriod:function(e){
    let token = wx.getStorageSync('token')
    let that = this
    if (token) {
      //此缓存解决从待返提期完成后的页面跳转问题，清除是为了确保此时无缓存
        app.globalData.mentionPeriodFrom = 1
        let id = e.currentTarget.dataset.id
        wx.navigateTo({
          url: '/packageA/pages/mentionPeriod/mentionPeriod'
        })
    } else {
      wx.navigateTo({
        url: "/pages/invitationCode/invitationCode"
      })
    }
  },
  toHelp:function(e){
    let token = wx.getStorageSync('token')
    let that = this
    if (token) {
      //此缓存解决从待返提期完成后的页面跳转问题，清除是为了确保此时无缓存
      app.globalData.helpMentionPeriod = 1
        let id = e.currentTarget.dataset.id
        wx.navigateTo({
          url: '/packageA/pages/helpMentionPeriod/helpMentionPeriod?id='+id
        })
    } else {
      wx.navigateTo({
        url: "/pages/invitationCode/invitationCode"
      })
    }
  },
  shares: function(e) {
    var that = this
    let id = e.currentTarget.dataset.id
      that.setData({
        showModalStatus1: true
      })
      that.share(id)
      wx.hideTabBar()
  },
      // 取消分享
      cancelShare: function () {
        var that = this
        that.setData({
          showModalStatus1: false
        })
      },
      share:function(id){
        let that = this
        app.Util.ajax('mall/weChat/sharing/target', {
          mode: 16,
          targetId: id
        }, 'GET').then((res) => {
          if (res.data.messageCode == "MSG_1001") {
            var inviterCode = wx.getStorageSync('inviterCode')
            if (inviterCode) {
              res.data.content.link = res.data.content.link.replace(/{inviterCode}/g, inviterCode)
            } else {
              res.data.content.link = res.data.content.link.replace(/{inviterCode}/g, '')
            }
            console.log(res.data.content.link)
            // 产品图片路径转换为本地路径
            var imageUrl = res.data.content.imageUrl
            if (imageUrl) {
              wx.getImageInfo({
                src: imageUrl,
                success(res) {
                  that.data.shareImg = res.path
                }
              })
            }
            that.setData({
              shareList: res.data.content
            })
          }
      })
    },
      //隐藏底部分享对话框
  hide: function() {
    var that = this
    that.setData({
      showModalStatus1: false,
    })
  },
})