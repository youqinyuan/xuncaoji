// pages/forum/forum.js
let app = getApp();
var time = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTab: 1,
    pageNumber: 1,
    pageNum: 1,
    isRecommend: false,
    pageSize: 20,
    navData: [{
      type: 4,
      text: '关注'
    }, {
      type: 5,
      text: '全部'
    }, {
      type: 1,
      text: '普通帖'
    }, {
      type: 2,
      text: '卖帖'
    }, {
      type: 3,
      text: '买帖'
    }],
    type: null,
    tempStatus: null,
    allPost: [], //帖子列表
    emptyText: '', //空数据的时候
    showDel: false, //删除帖子弹框
    delId: null,
    showFollow: false, //取消关注弹窗
    followId: null,
    followIndex: null,
    showDel1: false, //删除帖子弹框（推荐）
    delId1: null,
    showFollow1: false, //取消关注弹窗
    followId1: null,
    followIndex1: null,
    messageNum: null,
    showClassify: false, //帖子类型弹框
    list: [{
      img: '/assets/images/add/ic_ordinary.png',
      text: '普通帖',
      remark: '',
      status: 1
    }, {
      img: '/assets/images/add/ic_buy.png',
      text: '买帖',
      remark: '我要买',
      status: 2
    }, {
      img: '/assets/images/add/ic_sale.png',
      text: '卖帖',
      remark: '我要卖',
      status: 3
    }],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    //新消息总数
    that.getMessage();
    //页面初始化数据
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
    if (wx.getStorageSync('posting')) {
      that.setData({
        pageNumber: 1,
        allPost: [],
        currentTab: 1,
        pageNum: 1
      })
      if (that.data.currentTab == 1) {
        that.allPost()
      } else if (that.data.currentTab == 2 || that.data.currentTab == 3 || that.data.currentTab == 4) {
        that.ordinaryPost()
      } else if (that.data.currentTab == 0) {
        that.followPost()
      }
    } else if (wx.getStorageSync('comment')) {
      if (that.data.currentTab == 1) {
        that.allPost()
      } else if (that.data.currentTab == 2 || that.data.currentTab == 3 || that.data.currentTab == 4) {
        that.ordinaryPost()
      } else if (that.data.currentTab == 0) {
        that.followPost()
      }
      wx.removeStorageSync('comment')
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    wx.removeStorageSync('posting')
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
      pageNum: 1,
    })
    if (that.data.currentTab == 0) {
      that.followPost()
    }else if (that.data.currentTab == 1) {
      that.allPost()
    } else {
      that.ordinaryPost()
    }
    wx.stopPullDownRefresh() //停止下拉刷新
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    var that = this
    if (that.data.currentTab == 0 && that.data.isRecommend == false) {
      that.getFollowPost()
    } else if (that.data.currentTab == 0 && that.data.isRecommend == true) {
      that.getRecommend()
    } else if (that.data.currentTab == 1) {
      that.getAllPost()
    } else {
      that.getOrdinary()
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
    if (wx.getStorageSync('token')) {
      app.Util.ajax('mall/forum/comment/findMyRemindMsgCount', 'GET').then((res) => {
        if (res.data.messageCode == 'MSG_1001') {
          that.setData({
            messageNum: res.data.content
          })
        }
      })
    }
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
    app.Util.ajax('mall/forum/topic/findPageList', {
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
        if (that.data.allPost.length > 0) {
          //获取元素高度
          that.getHeight();
        }
      }
    })
  },
  getAllPost: function() {
    var that = this
    var pageNumber = that.data.pageNumber + 1
    app.Util.ajax('mall/forum/topic/findPageList', {
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
          if (that.data.allPost.length > 0) {
            //获取元素高度
            that.getHeight();
          }
        }
      }
    })
  },
  //关注
  followPost: function() {
    var that = this
    app.Util.ajax('mall/forum/topic/findAttentionPageList', {
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
        if (that.data.allPost.length < 20) {
          that.setData({
            isRecommend: true
          })
          that.recommend();
        }
        if (that.data.allPost.length > 0) {
          //获取元素高度
          that.getHeight();
        }
      }
    })
  },
  getFollowPost: function() {
    var that = this
    var pageNumber = that.data.pageNumber + 1
    app.Util.ajax('mall/forum/topic/findAttentionPageList', {
      pageNumber: pageNumber,
      pageSize: that.data.pageSize,
    }, 'GET').then((res) => { // 使用ajax函数
      if (res.data.content) {
        if (res.data.content.items == '' && that.data.allPost !== '') {
          that.setData({
            isRecommend: true
          })
          that.recommend();
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
          if (that.data.allPost.length > 0) {
            //获取元素高度
            that.getHeight();
          }
        }
      }
    })
  },
  //普通帖,卖帖，买帖
  ordinaryPost: function() {
    var that = this
    app.Util.ajax('mall/forum/topic/findPageList', {
      pageNumber: that.data.pageNumber,
      pageSize: that.data.pageSize,
      type: that.data.type
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
        if (that.data.allPost.length > 0) {
          //获取元素高度
          that.getHeight();
        }
      }
    })
  },
  getOrdinary: function() {
    var that = this
    var pageNumber = that.data.pageNumber + 1
    app.Util.ajax('mall/forum/topic/findPageList', {
      pageNumber: pageNumber,
      pageSize: that.data.pageSize,
      type: that.data.type
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
          if (that.data.allPost.length > 0) {
            //获取元素高度
            that.getHeight();
          }  
        }
      }
    })
  },
  //为您推荐
  recommend: function() {
    var that = this
    app.Util.ajax('mall/forum/topic/findRecommendList4Attention', {
      pageNumber: that.data.pageNum,
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
          allPost1: arr1
        })
        if (that.data.allPost1.length > 0) {
          //获取元素高度
          that.getHeight1();
        }  
      }
    })
  },
  getRecommend: function() {
    var that = this
    var pageNumber = that.data.pageNum + 1
    app.Util.ajax('mall/forum/topic/findRecommendList4Attention', {
      pageNumber: pageNumber,
      pageSize: that.data.pageSize,
    }, 'GET').then((res) => {
      if (res.data.content) {
        if (res.data.content.items == '' && that.data.allPost1 !== '') {
          wx.showToast({
            title: '已经到底啦',
            icon: 'none'
          })
        }
        var arr = that.data.allPost1
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
            allPost1: arr1,
            pageNum: pageNumber
          })
          if(that.data.allPost1.length>0){
            //获取元素高度
            that.getHeight1();
          }         
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
      pageNum:1,
      allPost: [],
      emptyText: ''
    })
    if (that.data.currentTab == cur) {
      return false;
    } else {
      that.setData({
        currentTab: cur
      })
      if (type == 1 || type == 2 || type == 3) {
        that.setData({
          isRecommend: false
        })
        that.ordinaryPost()
      } else if (type == 4) {
        that.followPost()
      } else if (type == 5) {
        that.setData({
          isRecommend: false
        })
        that.allPost()
      }
    }
  },
  getHeight: function() {
    var that = this;
    setTimeout(() => {
      wx.createSelectorQuery().selectAll('.content-item').boundingClientRect(function(rect) {
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
  ellipsis: function(e) {
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
          if (that.data.type == 1 || that.data.type == 2 || that.data.type == 3) {
            that.ordinaryPost()
          } else if (that.data.type == 4) {
            that.followPost()
          } else {
            that.allPost()
          }
        }, 2000) //延迟时间 这里是2秒
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
      app.Util.ajax('mall/forum/topic/attention?', {
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
      showFollow: false
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
  //取消帖子类型弹框
  publish: function() {
    var that = this
    var token = wx.getStorageSync('token')
    if (token) {
      that.setData({
        showClassify: true
      })
    } else {
      wx.navigateTo({
        url: '/pages/invitationCode/invitationCode',
      })
    }
  },
  cancelClassify: function() {
    var that = this
    that.setData({
      showClassify: false
    })
  },
  //点击评论跳转到帖子详情
  jumpForumDetail: function(e) {
    var token = wx.getStorageSync('token')
    if (token) {
      wx.navigateTo({
        url: '/pages/forumDetail/forumDetail?id=' + e.currentTarget.dataset.id,
      })
      wx.setStorageSync('comment', 1)
    } else {
      wx.navigateTo({
        url: '/pages/invitationCode/invitationCode',
      })
    }
  },
  jumpComment: function(e) {
    var token = wx.getStorageSync('token')
    if (token) {
      wx.navigateTo({
        url: '/pages/forumDetail/forumDetail?tempStatus=' + 1 + '&id=' + e.currentTarget.dataset.id,
      })
      wx.setStorageSync('comment', 1)
    } else {
      wx.navigateTo({
        url: '/pages/invitationCode/invitationCode',
      })
    }
  },
  jumpPosting: function(e) {
    var that = this
    wx.navigateTo({
      url: '/pages/posting/posting?status=' + e.currentTarget.dataset.status,
    })
    that.setData({
      showClassify: false
    })
  },
  //跳转到新消息
  jumpMessage: function() {
    wx.navigateTo({
      url: '/pages/newMessage/newMessage',
    })
  },



  getHeight1: function() {
    var that = this;
    setTimeout(() => {
      wx.createSelectorQuery().selectAll('.content-item1').boundingClientRect(function(rect) {
        for (var i = 0; i < that.data.allPost1.length; i++) {
          if (rect[i].height > 80) {
            that.data.allPost1[i].isShowAll = 1
            that.data.allPost1[i].isText = '全部'
          } else {
            that.data.allPost1[i].isShowAll = 2
            that.data.allPost1[i].isText = ''
          }
        }
        that.setData({
          allPost1: that.data.allPost1
        })
      }).exec();
    }, 300)
  },
  //收起/展开按钮点击事件
  ellipsis1: function(e) {
    var that = this
    for (var i = 0; i < that.data.allPost1.length; i++) {
      if (i == e.currentTarget.dataset.index) {
        that.data.allPost1[e.currentTarget.dataset.index].flag = that.data.allPost1[e.currentTarget.dataset.index].flag + 1
      }
      if (that.data.allPost1[e.currentTarget.dataset.index].flag % 2 === 0) {
        that.data.allPost1[e.currentTarget.dataset.index].isText = '收起'
        that.data.allPost1[e.currentTarget.dataset.index].ellipsis = false
      } else if (that.data.allPost1[e.currentTarget.dataset.index].flag % 2 !== 0) {
        that.data.allPost1[e.currentTarget.dataset.index].isText = '全部'
        that.data.allPost1[e.currentTarget.dataset.index].ellipsis = true
      }
    }
    that.setData({
      allPost1: that.data.allPost1,
    })
  },
  //收藏帖子
  collectImg1: function(e) {
    var that = this
    console.log(e)
    if (wx.getStorageSync('token')) {
      app.Util.ajax('mall/forum/topic/favorite', {
        id: e.currentTarget.dataset.id
      }, 'POST').then((res) => {
        if (res.data.content) {
          console.log(that.data.allPost1[e.currentTarget.dataset.index])
          if (that.data.allPost1[e.currentTarget.dataset.index].isFavoriate == 2) {
            that.data.allPost1[e.currentTarget.dataset.index].isFavoriate = 1
          } else if (that.data.allPost1[e.currentTarget.dataset.index].isFavoriate == 1) {
            that.data.allPost1[e.currentTarget.dataset.index].isFavoriate = 2
          }
          that.setData({
            allPost1: that.data.allPost1
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
  ativeCollectImg1: function(e) {
    var that = this
    app.Util.ajax('mall/forum/topic/favorite', {
      id: e.currentTarget.dataset.id
    }, 'POST').then((res) => {
      if (res.data.content) {
        console.log(that.data.allPost1[e.currentTarget.dataset.index])
        if (that.data.allPost1[e.currentTarget.dataset.index].isFavoriate == 2) {
          that.data.allPost1[e.currentTarget.dataset.index].isFavoriate = 1
        } else if (that.data.allPost1[e.currentTarget.dataset.index].isFavoriate == 1) {
          that.data.allPost1[e.currentTarget.dataset.index].isFavoriate = 2
        }
        that.setData({
          allPost1: that.data.allPost1
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
  delContent1: function(e) {
    var that = this
    that.setData({
      showDel1: true,
      delId1: e.currentTarget.dataset.id
    })
  },
  cancelDel1: function() {
    var that = this
    that.setData({
      showDel1: false
    })
  },
  confirmDel1: function() {
    var that = this
    app.Util.ajax('mall/forum/topic/remove', {
      id: that.data.delId1
    }, 'POST').then((res) => {
      if (res.data.content) {
        wx.showToast({
          title: '删除成功',
          icon: 'none'
        })
        setTimeout(function() {
          that.setData({
            pageNumber: 1,
            pageNum: 1
          })
          that.followPost();
        }, 2000) //延迟时间 这里是2秒
        that.setData({
          showDel1: false
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
  notFollow1: function(e) {
    var that = this
    if (wx.getStorageSync('token')) {
      app.Util.ajax('mall/forum/topic/attention?', {
        id: e.currentTarget.dataset.id
      }, 'POST').then((res) => {
        if (res.data.content) {
          if (that.data.allPost1[e.currentTarget.dataset.index].isAttention == 2) {
            that.data.allPost1[e.currentTarget.dataset.index].isAttention = 1
          } else if (that.data.allPost1[e.currentTarget.dataset.index].isAttention == 1) {
            that.data.allPost1[e.currentTarget.dataset.index].isAttention = 2
          }
          that.setData({
            allPost1: that.data.allPost1
          })
          that.setData({
            showDel1: false
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
  follow1: function(e) {
    var that = this
    that.setData({
      showFollow1: true,
      followId1: e.currentTarget.dataset.id,
      followIndex1: e.currentTarget.dataset.index
    })
  },
  cancelFollow1: function() {
    var that = this
    that.setData({
      showFollow1: false
    })
  },
  confirmFollow1: function() {
    var that = this
    app.Util.ajax('mall/forum/topic/attention', {
      id: that.data.followId1
    }, 'POST').then((res) => {
      if (res.data.content) {
        if (that.data.allPost1[that.data.followIndex1].isAttention == 2) {
          that.data.allPost1[that.data.followIndex1].isAttention = 1
        } else if (that.data.allPost1[that.data.followIndex1].isAttention == 1) {
          that.data.allPost1[that.data.followIndex1].isAttention = 2
        }
        that.setData({
          allPost1: that.data.allPost1,
          showFollow1: false
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
})