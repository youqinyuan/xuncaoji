// pages/commodityArea/commodityArea.js
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showRole: false, //规则弹窗
    nowstatus: 'infoBox1',
    fixed: false,
    activityId: null, //活动id
    listItem: null,
    category: [],
    titleName: '',
    hostUrl: app.Util.getUrlImg().hostUrl,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    if (options.id) {
      that.setData({
        activityId: parseInt(options.id)
      })
    }
    that.initData() //初始化数据   
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    var that = this
    wx.setNavigationBarTitle({
      title: that.data.titleName
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var that = this

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
    wx.removeStorageSync('labelImage')
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
  initData: function() {
    var that = this
    app.Util.ajax('mall/mdse/activity/activityDetail', {
      id: that.data.activityId
    }, 'GET').then((res) => {
      if (res.data.content) {
        console.log(res.data.content)
        var category = []
        res.data.content.activityAreaInfo.forEach((v, i) => {
          category.push(v.categoryName)
        })
        that.setData({
          listItem: res.data.content,
          category: category
        })
        that.data.titleName = decodeURIComponent(that.data.listItem.theme);
        wx.setNavigationBarTitle({
          title: decodeURIComponent(that.data.listItem.theme)
        });
        if (that.data.listItem.status == 1) {
          wx.switchTab({
            url: '/pages/index/index',
          })
          wx.setStorageSync('indexMsg', '很抱歉，当前活动暂未开始哦')
        } else if (that.data.listItem.status == 3 || that.data.listItem.status == 4) {
          wx.switchTab({
            url: '/pages/index/index',
          })
          wx.setStorageSync('indexMsg', '很抱歉，当前活动已结束')
        } else if (that.data.listItem.status == 2) {
          that.getHeight1()
          that.getHeight2()
          that.getHeight3()
          that.getHeight4()
          that.getHeight5()
          that.getHeight6()
        }
      }
    })
  },
  //跳转到详情页
  toDetail: function(e) {
    var that = this
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/detail/detail?id=' + id + '&commodity=' + that.data.activityId,
    })
  },
  getHeight1: function() {
    var that = this;
    setTimeout(() => {
      wx.createSelectorQuery().selectAll('#infoBox1').boundingClientRect(function(rect) {
        that.setData({
          heightView1: rect[0].top
        })
      }).exec();
    }, 300)
  },
  getHeight2: function() {
    var that = this;
    setTimeout(() => {
      wx.createSelectorQuery().selectAll('#infoBox2').boundingClientRect(function(rect) {
        that.setData({
          heightView2: rect[0].top
        })
      }).exec();
    }, 300)
  },
  getHeight3: function() {
    var that = this;
    setTimeout(() => {
      wx.createSelectorQuery().selectAll('#infoBox3').boundingClientRect(function(rect) {
        that.setData({
          heightView3: rect[0].top
        })
      }).exec();
    }, 300)
  },
  getHeight4: function() {
    var that = this;
    setTimeout(() => {
      wx.createSelectorQuery().selectAll('#infoBox4').boundingClientRect(function(rect) {
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
          nowstatus: 'infoBox1'
        })
      } else if (that.data.scrollTop >= that.data.heightView2 && that.data.scrollTop < that.data.heightView3) {
        that.setData({
          nowstatus: 'infoBox2'
        })
      } else if (that.data.scrollTop >= that.data.heightView3 && that.data.scrollTop < that.data.heightView4) {
        that.setData({
          nowstatus: 'infoBox3'
        })
      } else if (that.data.scrollTop >= that.data.heightView4) {
        that.setData({
          nowstatus: 'infoBox4'
        })
      }
    }, 300)
  },
  //规则弹窗
  showRole: function() {
    this.setData({
      showRole: true
    })
  },
  closeShow: function() {
    this.setData({
      showRole: false
    })
  },
  toViewClick: function(e) {
    var that = this
    that.setData({
      nowstatus: e.target.dataset.hash
    })
    if (that.data.nowstatus == 'infoBox1') {
      setTimeout(function() {
        wx.pageScrollTo({
          selector: '#infoBox1',
          duration: 300
        })
      }, 300)
    } else if (that.data.nowstatus == 'infoBox2') {
      setTimeout(function() {
        wx.pageScrollTo({
          selector: '#infoBox2',
          duration: 300
        })
      }, 300)
    } else if (that.data.nowstatus == 'infoBox3') {
      setTimeout(function() {
        wx.pageScrollTo({
          selector: '#infoBox3',
          duration: 300
        })
      }, 300)
    } else if (that.data.nowstatus == 'infoBox4') {
      setTimeout(function() {
        wx.pageScrollTo({
          selector: '#infoBox4',
          duration: 300
        })
      }, 300)
    }
  }
})