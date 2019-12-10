// pages/finishPosting/finishPosting.js
let app = getApp();
var time = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageNumber: 1,
    pageSize: 20,
    allPost: [], //帖子列表
    showDel: false, //删除帖子弹框
    delId: null,
    showFollow: false, //取消关注弹窗
    followId: null,
    followIndex: null,
    messageNum: null,
    showClassify: false, //帖子类型弹框
    seedIncreased:null,//种子
    postingStatus: null,//是否显示推荐
    topicId:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.setData({
      seedIncreased:parseInt(options.seedIncreased),
      postingStatus:parseInt(options.postingStatus),
      topicId: parseInt(options.id)
    })
    if (options.postingStatus == 2 || options.postingStatus == 3){
      that.recommend(); 
    } 
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
    wx.navigateBack({
      delta: 1,
    })
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
    var that = this
    that.getRecommend()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  recommend: function () {
    var that = this
    app.Util.ajax('mall/forum/topic/findRecommendList', {
      topicId:that.data.topicId,
      pageNumber: that.data.pageNumber,
      pageSize: that.data.pageSize,
    }, 'GET').then((res) => {
      if (res.data.content) {
        var arr = []
        var arr1 = arr.concat(res.data.content.items)
        for (let i in arr1) {
          if (arr1[i].content) {
            arr1[i].content = arr1[i].content
          } else {
            arr1[i].content = ''
          }
          arr1[i].commentPageResponse.items = arr1[i].commentPageResponse.items.slice(0, 2)
          arr1[i].isShowAll = 2
          arr1[i].isText = ''
          arr1[i].ellipsis = true
          arr1[i].flag = 1
        }
        that.setData({
          allPost: arr1
        })
        //获取元素高度
        that.getHeight();
      }
    })
  },
  getRecommend: function () {
    var that = this
    var pageNumber = that.data.pageNumber + 1
    app.Util.ajax('mall/forum/topic/findRecommendList', {
      topicId: that.data.topicId,
      pageNumber: pageNumber,
      pageSize: that.data.pageSize,
    }, 'GET').then((res) => {
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
            for (let i in arr1) {
              if (arr1[i].content) {
                arr1[i].content = arr1[i].content
              } else {
                arr1[i].content = ''
              }
              arr1[i].commentPageResponse.items = arr1[i].commentPageResponse.items.slice(0, 2)
              arr1[i].isShowAll = 2
              arr1[i].isText = ''
              arr1[i].ellipsis = true
              arr1[i].flag = 1
            }
          }
          that.setData({
            allPost: arr1,
            pageNumber: pageNumber
          })
          //获取元素高度
          that.getHeight();
        }
      }
    })
  },
  getHeight: function () {
    var that = this;
    setTimeout(() => {
      wx.createSelectorQuery().selectAll('.content-item').boundingClientRect(function (rect) {
        for (var i = 0; i < that.data.allPost.length; i++) {
          if (rect[i].height > 80) {
            that.data.allPost[i].isShowAll = 1
            that.data.allPost[i].isText = '全部'
          } else {
            that.data.allPost[i].isShowAll = 2
            that.data.allPost[i].isText = ''
          }
        }
        that.setData({
          allPost: that.data.allPost
        })
      }).exec();
    }, 300)
  },
  //收起/展开按钮点击事件
  ellipsis: function (e) {
    var that = this
    for (var i = 0; i < that.data.allPost.length; i++) {
      if (i == e.currentTarget.dataset.index) {
        that.data.allPost[e.currentTarget.dataset.index].flag = that.data.allPost[e.currentTarget.dataset.index].flag + 1
      }
      if (that.data.allPost[e.currentTarget.dataset.index].flag % 2 === 0) {
        that.data.allPost[e.currentTarget.dataset.index].isText = '收起'
        that.data.allPost[e.currentTarget.dataset.index].ellipsis = false
      } else if (that.data.allPost[e.currentTarget.dataset.index].flag % 2 !== 0) {
        that.data.allPost[e.currentTarget.dataset.index].isText = '全部'
        that.data.allPost[e.currentTarget.dataset.index].ellipsis = true
      }
    }
    that.setData({
      allPost: that.data.allPost,
    })
  },
  //收藏帖子
  collectImg: function (e) {
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
  },
  ativeCollectImg: function (e) {
    var that = this
    app.Util.ajax('mall/forum/topic/favorite', {
      id:e.currentTarget.dataset.id
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
      id:that.data.delId
    }, 'POST').then((res) => {
      if (res.data.content) {
        wx.showToast({
          title: '删除成功',
          icon: 'none'
        })
        setTimeout(function () {
          that.allPost()
        }, 1000) //延迟时间
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
    app.Util.ajax('mall/forum/topic/attention',{
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
      showFollow: false
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
  //点击评论跳转到帖子详情
  jumpForumDetail: function (e) {
    wx.navigateTo({
      url: '/pages/forumDetail/forumDetail?id=' + e.currentTarget.dataset.id,
    })
  },
  jumpComment: function (e) {
    wx.navigateTo({
      url: '/pages/forumDetail/forumDetail?tempStatus=' + 1 + '&id=' + e.currentTarget.dataset.id,
    })
  },
  
})