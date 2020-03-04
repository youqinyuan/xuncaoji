// pages/longActivity/longActivity.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hostUrl: app.Util.getUrlImg().hostUrl,
    tab:1,
    show1:false,
    fixed: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.setData({
      options:options
    })
    that.init()
  },
  init:function(){
    var that = this
    app.Util.ajax('mall/newPeople/findDetail', {
      id:that.data.options.id
    }, 'GET').then((res) => {
      if(res.data.messageCode=='MSG_1001'){
        if(res.data.content){
          that.setData({
            content:res.data.content
          })
          if (that.data.content.status == 1) {
            wx.switchTab({
              url: '/pages/index/index',
            })
            wx.setStorageSync('indexMsg', '很抱歉，当前活动暂未开始哦')
          } else if (that.data.content.status == 3) {
            wx.switchTab({
              url: '/pages/index/index',
            })
            wx.setStorageSync('indexMsg', '很抱歉，当前活动已结束')
          } else if (that.data.content.status == 2){
            that.getHeight1()
            that.getHeight2()
            that.getHeight3()
            that.getHeight4()
            that.getHeight5()
            that.getHeight6()
          }
          //页面标题
          wx.setNavigationBarTitle({
            title: res.data.content.theme
          })
          //购买按钮文案
          app.globalData.buttonText = res.data.content.buttonText
        }
      }else{
        wx.showToast({
          title:res.data.message,
          icon:'none'
        })
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
  closeShow1: function() {
    this.setData({
      show1: false
    })
  },
  toGoodsDetail:function(e){
    var goodsId = e.currentTarget.dataset.goodsid
    wx.navigateTo({
      url: '/pages/detail/detail?newPeopleActivity=2&&id='+goodsId,
    })
  },
  ruleShow:function(){
    this.setData({
      show1:true
    })
  },
  toViewClick: function(e) {
    var that = this
    var index = e.currentTarget.dataset.index
    var tab = 0
    if (index == 1) {
      setTimeout(function() {
        wx.pageScrollTo({
          selector: '#one',
          duration: 300
        })
      }, 500)
      tab = 1
    } else if (index == 2) {
      setTimeout(function() {
        wx.pageScrollTo({
          selector: '#two',
          duration: 300
        })
      }, 500)
      tab = 2
    } else if (index == 3) {
      setTimeout(function() {
        wx.pageScrollTo({
          selector: '#three',
          duration: 300
        })
      }, 500)
      tab = 3
    } else if (index == 4) {
      setTimeout(function() {
        wx.pageScrollTo({
          selector: '#four',
          duration: 300
        })
      }, 500)
      tab = 4
    }
    that.setData({
      tab:tab
    })
  },
  getHeight1: function() {
    var that = this;
    setTimeout(() => {
      wx.createSelectorQuery().selectAll('#one').boundingClientRect(function(rect) {
        that.setData({
          heightView1: rect[0].top
        })
      }).exec();
    }, 300)
  },
  getHeight2: function() {
    var that = this;
    setTimeout(() => {
      wx.createSelectorQuery().selectAll('#two').boundingClientRect(function(rect) {
        that.setData({
          heightView2: rect[0].top
        })
      }).exec();
    }, 300)
  },
  getHeight3: function() {
    var that = this;
    setTimeout(() => {
      wx.createSelectorQuery().selectAll('#three').boundingClientRect(function(rect) {
        that.setData({
          heightView3: rect[0].top
        })
      }).exec();
    }, 300)
  },
  getHeight4: function() {
    var that = this;
    setTimeout(() => {
      wx.createSelectorQuery().selectAll('#four').boundingClientRect(function(rect) {
        that.setData({
          heightView4: rect[0].top
        })
      }).exec();
    }, 300)
  },
  getHeight5: function() {
    var that = this;
    setTimeout(() => {
      wx.createSelectorQuery().selectAll('.classify').boundingClientRect(function(rect) {
        that.setData({
          heightView5: rect[0].height
        })
      }).exec();
    }, 300)
  },
  getHeight6: function() {
    var that = this;
    setTimeout(() => {
      wx.createSelectorQuery().selectAll('.classify').boundingClientRect(function(rect) {
        that.setData({
          heightView6: rect[0].top
        })
      }).exec();
    }, 300)
  },
  onPageScroll: function(e) {
    var that = this
    that.setData({
      scrollTop: e.scrollTop + (that.data.heightView5) * 2
    })
    if (e.scrollTop >= that.data.heightView6) {
      that.setData({
        fixed: true
      })
    } else if (e.scrollTop < that.data.heightView6 && e.scrollTop > 0) {
      that.setData({
        fixed: false,
      })
    } else if (e.scrollTop == 0) {
      that.setData({
        fixed: false
      })
    }
    setTimeout(function() {
      if (that.data.scrollTop >= that.data.heightView1 && that.data.scrollTop < that.data.heightView2) {
        that.setData({
          tab : 1
        })
      } else if (that.data.scrollTop >= that.data.heightView2 && that.data.scrollTop < that.data.heightView3) {
        that.setData({
          tab : 2
        })
      } else if (that.data.scrollTop >= that.data.heightView3 && that.data.scrollTop < that.data.heightView4) {
        that.setData({
          tab : 3
        })
      } else if (that.data.scrollTop >= that.data.heightView4) {
        that.setData({
          tab : 4
        })
      }
    }, 300)
  },

})