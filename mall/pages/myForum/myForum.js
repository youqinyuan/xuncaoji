// pages/myForum/myForum.js
let app = getApp();
var time = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTab: 0,
    type: 1,
    allPost: [], //帖子列表
    emptyText:'',
    showDel: false, //删除帖子弹框
    delId: null,
    showFollow: false, //取消关注弹窗
    followId: null,
    followIndex: null,
    messageNum: null,
    navData: [{
      type: 1,
      text: '我的主页'
    }, {
      type: 2,
      text: '我的收藏'
    }],
    showDel: false, //删除帖子弹框
    showFollow: false, //取消关注弹窗
    followStatus: false, //是否关注
    pageNumber: 1, //分页记录数
    pageSize: 20, //分页大小
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    //新消息总数
    that.getMessage();
    //页面加载
    that.allPost();
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
    var that = this
    //页面初始化数据
    //新消息总数
    that.getMessage();
     if (wx.getStorageSync('comment1')) {
      if (that.data.currentTab == 1) {
        that.followPost()
       
      } else if (that.data.currentTab == 0) {
        that.allPost()
      }   
      wx.removeStorageSync('comment1')
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

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    var that = this
    that.setData({
      pageNumber: 1,
    })
    if (that.data.currentTab == 1) {
      that.followPost()
    } else if (that.data.currentTab == 0) {
      that.allPost()
    }
    wx.stopPullDownRefresh() //停止下拉刷新
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    var that = this
    if (that.data.currentTab == 1) {
      that.getFollowPost()
    } else if (that.data.currentTab == 0) {
      that.getAllPost()
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  //新消息总数
  getMessage: function() {
    var that = this
    app.Util.ajax('mall/forum/comment/findMyRemindMsgCount', 'GET').then((res) => {
      if (res.data.messageCode == 'MSG_1001') {
        that.setData({
          messageNum: res.data.content
        })
      }
    })
  },
  //图片预览 
  imgYu: function(e) {
    var that = this
    var index = e.currentTarget.dataset.index;
    var idx = e.currentTarget.dataset.idx;
    var imgArr = [];
    for (var i = 0; i < that.data.allPost[idx].attachmentList.length; i++) {
      imgArr.push(that.data.allPost[idx].attachmentList[i]["fileKey"]);
    }
    wx.previewImage({
      current: imgArr[index], //当前图片地址
      urls: imgArr
    })
  },
  //全部分类
  allPost: function() {
    var that = this
    app.Util.ajax('mall/forum/topic/findMyTopicPageList', {
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
          // arr1[i].createTime = time.formatTimeTwo(arr1[i].createTime, 'Y-M-D h:m')
          // arr1[i].maxReturnTime = time.formatTimeTwo(arr1[i].maxReturnTime, 'Y-M-D')
          arr1[i].commentPageResponse.items = arr1[i].commentPageResponse.items.slice(0, 2)
          arr1[i].isShowAll = 2
          arr1[i].isText = ''
          arr1[i].ellipsis = true
          arr1[i].flag = 1
        }
        that.setData({
          allPost: arr1
        })
        if (that.data.allPost.length === 0) {
          that.setData({
            emptyText: '暂无数据'
          })
        }
        //获取元素高度
        that.getHeight();
      }
    })
  },
  getAllPost: function() {
    var that = this
    var pageNumber = that.data.pageNumber + 1
    app.Util.ajax('mall/forum/topic/findMyTopicPageList', {
      pageNumber: pageNumber,
      pageSize: that.data.pageSize,
    }, 'GET').then((res) => { // 使用ajax函数
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
              // arr1[i].createTime = time.formatTimeTwo(arr1[i].createTime, 'Y-M-D h:m')
              // arr1[i].maxReturnTime = time.formatTimeTwo(arr1[i].maxReturnTime, 'Y-M-D')
              arr1[i].commentPageResponse.items = arr1[i].commentPageResponse.items.slice(0, 2)
              arr1[i].content = arr1[i].content ? arr1[i].content : ''
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
          if (that.data.allPost.length === 0) {
            that.setData({
              emptyText: '暂无数据'
            })
          }
          //获取元素高度
          that.getHeight();
        }
      }
    })
  },
  //关注
  followPost: function() {
    var that = this
    app.Util.ajax('mall/forum/topic/findFavoritePageList', {
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
          // arr1[i].createTime = time.formatTimeTwo(arr1[i].createTime, 'Y-M-D h:m')
          // arr1[i].maxReturnTime = time.formatTimeTwo(arr1[i].maxReturnTime, 'Y-M-D')
          arr1[i].commentPageResponse.items = arr1[i].commentPageResponse.items.slice(0, 2)
          arr1[i].isShowAll = 2
          arr1[i].isText = ''
          arr1[i].ellipsis = true
          arr1[i].flag = 1
        }
        that.setData({
          allPost: arr1
        })
        if (that.data.allPost.length === 0) {
          that.setData({
            emptyText: '暂无数据'
          })
        }
        //获取元素高度
        that.getHeight();
      }
    })
  },
  getFollowPost: function() {
    var that = this
    var pageNumber = that.data.pageNumber + 1
    app.Util.ajax('mall/forum/topic/findFavoritePageList', {
      pageNumber: pageNumber,
      pageSize: that.data.pageSize,
    }, 'GET').then((res) => { // 使用ajax函数
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
              // arr1[i].createTime = time.formatTimeTwo(arr1[i].createTime, 'Y-M-D h:m')
              // arr1[i].maxReturnTime = time.formatTimeTwo(arr1[i].maxReturnTime, 'Y-M-D')
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
          if (that.data.allPost.length === 0) {
            that.setData({
              emptyText: '暂无数据'
            })
          }
          //获取元素高度
          that.getHeight();
        }
      }
    })
  },
  //顶部导航切换
  switchNav: function(e) {
    var that = this
    var cur = e.currentTarget.dataset.current; //导航栏数组的index
    var type = e.currentTarget.dataset.type
    that.setData({
      type: type,
      pageNumber: 1,
      allPost:[],
      emptyText:''
    })
    that.getMessage();
    if (that.data.currentTab == cur) {
      return false;
    } else {
      that.setData({
        currentTab: cur
      })
      if (type == 2) {
        that.followPost()
      } else if (type == 1) {
        that.allPost()
      }
    }
  },
  getHeight: function () {
    var that = this;
    setTimeout(() => {
      wx.createSelectorQuery().selectAll('.content-item').boundingClientRect(function (rect) {
        for (var i = 0; i < that.data.allPost.length; i++) {
          var viewHeight = wx.getSystemInfoSync().windowWidth
          if (viewHeight > 375 && viewHeight <= 414) {
            if (rect[i].height > 96) {
              that.data.allPost[i].ellipsis = false
              that.data.allPost[i].isShowAll = 2
              that.data.allPost[i].isText = '全部'
            } else {
              that.data.allPost[i].ellipsis = true
              that.data.allPost[i].isShowAll = 1
              that.data.allPost[i].isText = ''
            }
          } else if (viewHeight <= 375) {
            if (rect[i].height > 88) {
              that.data.allPost[i].ellipsis = false
              that.data.allPost[i].isShowAll = 2
              that.data.allPost[i].isText = '全部'
            } else {
              that.data.allPost[i].ellipsis = true
              that.data.allPost[i].isShowAll = 1
              that.data.allPost[i].isText = ''
            }
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
        that.data.allPost[e.currentTarget.dataset.index].isText = ''
        that.data.allPost[e.currentTarget.dataset.index].ellipsis = true
      }
    }
    that.setData({
      allPost: that.data.allPost,
    })
  },
  //收藏帖子
  collectImg: function(e) {
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
  ativeCollectImg: function(e) {
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
  delContent: function(e) {
    var that = this
    that.setData({
      showDel: true,
      delId: e.currentTarget.dataset.id
    })
  },
  cancelDel: function() {
    var that = this
    that.setData({
      showDel: false
    })
  },
  confirmDel: function() {
    var that = this
    app.Util.ajax('mall/forum/topic/remove', {
      id: that.data.delId
    }, 'POST').then((res) => {
      if (res.data.content) {
        wx.showToast({
          title: '删除成功',
          icon: 'none'
        })
        setTimeout(function() {
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
  notFollow: function(e) {
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
  follow: function(e) {
    var that = this
    that.setData({
      showFollow: true,
      followId: e.currentTarget.dataset.id,
      followIndex: e.currentTarget.dataset.index
    })
  },
  cancelFollow: function() {
    var that = this
    that.setData({
      showFollow: false,
      follow: that.data.follow - 1
    })
  },
  confirmFollow: function() {
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
  jumpComment: function(e) {
    wx.navigateTo({
      url: '/pages/forumDetail/forumDetail?id=' + e.currentTarget.dataset.id,
    })
    wx.setStorageSync('comment1', 1)
  },
  jumpForumDetail: function (e) {
    wx.navigateTo({
      url: '/pages/forumDetail/forumDetail?tempStatus=' + 1 + '&id=' + e.currentTarget.dataset.id,
    })
    wx.setStorageSync('comment1', 1)
  },
  //跳转到新消息
  jumpMessage: function() {
    wx.navigateTo({
      url: '/pages/newMessage/newMessage',
    })
  }
})