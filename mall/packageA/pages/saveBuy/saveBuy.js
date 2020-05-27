// packageA/pages/saveBuy/saveBuy.js
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageNumber: 1,
    pageSize: 20,
    type: 5,
    goodsId: null,
    hostUrl: app.Util.getUrlImg().hostUrl,
    delId: null,
    showFollow: false, //取消关注弹窗
    followId: null,
    followIndex: null,
    showDel: false, //删除帖子弹框
    showFollow: false, //取消关注弹窗
    followStatus: false, //是否关注
    imgPublish: app.Util.getUrlImg().hostUrl + '/changeImg/btn_publish.png',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    console.log(options)
    that.setData({
      goodsId: options.goodsId ? options.goodsId : null
    })
    that.saveForum()
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
    let that = this
    that.setData({
      pageNumber: 1,
    })
    that.saveForum()
    setTimeout(function () {
      wx.stopPullDownRefresh() //停止下拉刷新
    }, 500)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let that = this;
    that.getAllPost();

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  //查询赚钱帖
  saveForum() {
    let that = this
    let data = {
      pageNumber: that.data.pageNumber,
      pageSize: that.data.pageSize,
      type: that.data.type,
      goodsId: that.data.goodsId
    }
    app.Util.ajax('mall/forum/topic/findPageList', data, 'GET').then((res) => {
      if (res.data.content) {
        that.setData({
          allPost: res.data.content.items
        })
      }
    })
  },
  getAllPost: function () {
    var that = this
    var pageNumber = that.data.pageNumber + 1
    let data = {
      pageNumber: pageNumber,
      pageSize: that.data.pageSize,
      type: that.data.type,
      goodsId: that.data.goodsId
    }
    app.Util.ajax('mall/forum/topic/findPageList', data, 'GET').then((res) => { // 使用ajax函数
      if (res.data.content) {
        if (res.data.content.items == '' && that.data.allPost !== '') {
          wx.showToast({
            title: '已经到底啦',
            icon: 'none'
          })
        }
        var arr = that.data.allPost
        if (res.data.content.items.length > 0) {
          for (var i = 0; i < res.data.content.items.length; i++) {
            var arr1 = arr.concat(res.data.content.items)
          }
          that.setData({
            allPost: arr1,
            pageNumber: pageNumber
          })
        }
      }
    })
  },
  //购买省钱
  buySaveMoney(e) {
    if (wx.getStorageSync('token')) {
      let img = e.currentTarget.dataset.item.goodsImageUrl
      let iconurl = img ? img.split('?') : null
      let iconurl1 = iconurl ? iconurl[0] : null
      e.currentTarget.dataset.item.goodsImageUrl = iconurl1
      e.currentTarget.dataset.item.avatarKey = null
      e.currentTarget.dataset.item.commentPageResponse = null
      wx.setStorageSync('goodsImageUrl', iconurl1 ? iconurl[1] : null)
      let goods = JSON.stringify(e.currentTarget.dataset.item)
      wx.navigateTo({
        url: '/pages/placeorder/placeorder?goods=' + goods,
      })
    } else {
      wx.navigateTo({
        url: '/pages/invitationCode/invitationCode',
      })
    }
  },
  //跳转到商品详情页
  toDetail(e) {
    wx.navigateBack({})
  },
  saveShowOrder() {
    let that = this;
    if (getCurrentPages().length > 2) {
      //获取页面栈
      let pages = getCurrentPages()
      //给上一个页面设置状态
      let curPage = pages[pages.length - 2];
      let data = curPage.data;
      data.options.searchOrder = 2
      curPage.setData({
        showOrder: true,
        showText1:'选择您想购买的规格型号',
        options: data.options
      });
      wx.navigateBack({})
    }
    wx.setStorageSync('goShowOrder', 1)
  },
  //收藏帖子
  collectImg: function (e) {
    var that = this
    if (wx.getStorageSync('token')) {
      app.Util.ajax('mall/forum/topic/favorite', {
        id: e.currentTarget.dataset.id
      }, 'POST').then((res) => {
        if (res.data.content) {
          if (that.data.allPost[e.currentTarget.dataset.index].isFavoriate == 2) {
            that.data.allPost[e.currentTarget.dataset.index].isFavoriate = 1
          } else if (that.data.allPost[e.currentTarget.dataset.index].isFavoriate == 1) {
            that.data.allPost[e.currentTarget.dataset.index].isFavoriate = 2
          }
          that.setData({
            allPost: that.data.allPost
          })
          wx.showToast({
            title: '收藏成功',
            icon: 'none'
          })
        } else {
          wx.showToast({
            title: res.data.message,
            icon: 'none'
          })
        }
      })
    } else {
      wx.navigateTo({
        url: '/pages/invitationCode/invitationCode',
      })
    }
  },
  ativeCollectImg: function (e) {
    var that = this
    app.Util.ajax('mall/forum/topic/favorite', {
      id: e.currentTarget.dataset.id
    }, 'POST').then((res) => {
      if (res.data.content) {
        if (that.data.allPost[e.currentTarget.dataset.index].isFavoriate == 2) {
          that.data.allPost[e.currentTarget.dataset.index].isFavoriate = 1
        } else if (that.data.allPost[e.currentTarget.dataset.index].isFavoriate == 1) {
          that.data.allPost[e.currentTarget.dataset.index].isFavoriate = 2
        }
        that.setData({
          allPost: that.data.allPost
        })
        wx.showToast({
          title: '取消收藏',
          icon: 'none'
        })
      } else {
        wx.showToast({
          title: res.data.message,
          icon: 'none'
        })
      }
    })
  },
  //删除帖子弹框
  delContent: function (e) {
    var that = this
    that.setData({
      showDel: true,
      delId: e.currentTarget.dataset.id
    })
  },
  cancelDel: function () {
    var that = this
    that.setData({
      showDel: false
    })
  },
  confirmDel: function () {
    var that = this
    app.Util.ajax('mall/forum/topic/remove', {
      id: that.data.delId
    }, 'POST').then((res) => {
      if (res.data.content) {
        wx.showToast({
          title: '删除成功',
          icon: 'none'
        })
        setTimeout(function () {
          that.setData({
            pageNumber: 1
          })
          if (that.data.type == 2) {
            that.followPost()
          } else if (that.data.type == 1) {
            that.allPost()
          }
        }, 500) //延迟时间
        that.setData({
          showDel: false
        })
      } else {
        wx.showToast({
          title: res.data.message,
          icon: 'none'
        })
      }
    })
  },
  //关注
  notFollow: function (e) {
    var that = this
    if (wx.getStorageSync('token')) {
      app.Util.ajax('mall/forum/topic/attention', {
        id: e.currentTarget.dataset.id
      }, 'POST').then((res) => {
        if (res.data.content) {
          if (that.data.allPost[e.currentTarget.dataset.index].isAttention == 2) {
            that.data.allPost[e.currentTarget.dataset.index].isAttention = 1
          } else if (that.data.allPost[e.currentTarget.dataset.index].isAttention == 1) {
            that.data.allPost[e.currentTarget.dataset.index].isAttention = 2
          }
          that.setData({
            allPost: that.data.allPost
          })
          wx.showToast({
            title: '关注成功',
            icon: 'none'
          })
        } else {
          wx.showToast({
            title: res.data.message,
            icon: 'none'
          })
        }
      })
    } else {
      wx.navigateTo({
        url: '/pages/invitationCode/invitationCode',
      })
    }
  },
  //取消关注
  follow: function (e) {
    var that = this
    that.setData({
      showFollow: true,
      followId: e.currentTarget.dataset.id,
      followIndex: e.currentTarget.dataset.index
    })
  },
  cancelFollow: function () {
    var that = this
    that.setData({
      showFollow: false,
      follow: that.data.follow - 1
    })
  },
  confirmFollow: function () {
    var that = this
    app.Util.ajax('mall/forum/topic/attention', {
      id: that.data.followId
    }, 'POST').then((res) => {
      if (res.data.content) {
        if (that.data.allPost[that.data.followIndex].isAttention == 2) {
          that.data.allPost[that.data.followIndex].isAttention = 1
        } else if (that.data.allPost[that.data.followIndex].isAttention == 1) {
          that.data.allPost[that.data.followIndex].isAttention = 2
        }
        that.setData({
          allPost: that.data.allPost,
          showFollow: false
        })
        wx.showToast({
          title: '取消关注',
          icon: 'none'
        })
      } else {
        wx.showToast({
          title: res.data.message,
          icon: 'none'
        })
      }
    })
  },
  jumpComment: function (e) {
    wx.navigateTo({
      url: '/pages/forumDetail/forumDetail?id=' + e.currentTarget.dataset.id,
    })
  },
  jumpForumDetail: function (e) {
    wx.navigateTo({
      url: '/pages/forumDetail/forumDetail?tempStatus=' + 1 + '&id=' + e.currentTarget.dataset.id,
    })
  },
})