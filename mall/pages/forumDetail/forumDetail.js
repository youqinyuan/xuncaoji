// pages/forumDetail/forumDetail.js
let app = getApp();
var time = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showComment: false, //删除评论弹窗
    delCommentId:null,//评论id
    bottom: 0, //输入框距离底部
    focus: false,
    allPost: null, //帖子列表
    showDel: false, //删除帖子弹框
    delId: null,
    showFollow: false, //取消关注弹窗
    followId: null,
    followIndex: null,
    content: null,
    inputValue: '', //评论框的内容
    isDisabled: true,
    placeholderText: '我来说两句'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    that.setData({
      topicId: parseInt(options.id),
      replyUserId: parseInt(options.userId),
      placeholderText: options.nickname ?'回复' + options.nickname + ':':"我来说两句",
    })
    if (options.tempStatus) {
      that.setData({
        focus: true
      })
    }
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
  onShareAppMessage: function() {

  },
  //图片预览 
  imgYu: function(e) {
    var that = this
    var index = e.currentTarget.dataset.index;
    var imgArr = [];
    for (var j = 0; j < that.data.content.attachmentList.length; j++) {
      imgArr.push(that.data.content.attachmentList[j]["fileKey"]);
    }
    wx.previewImage({
      current: imgArr[index], //当前图片地址
      urls: imgArr
    })
  },
  //页面初始化
  allPost: function() {
    var that = this
    app.Util.ajax('mall/forum/topic/findDetail', {
      id: that.data.topicId
    }, 'GET').then((res) => {
      if (res.data.content) {
        if (res.data.content.content) {
          res.data.content.content = res.data.content.content !== "null" ? res.data.content.content : ''
        } else {
          res.data.content.content = ''
        }
        res.data.content.createTime = time.formatTimeTwo(res.data.content.createTime, 'Y-M-D h:m')
        res.data.content.maxReturnTime = time.formatTimeTwo(res.data.content.maxReturnTime, 'Y-M-D')
        that.setData({
          content: res.data.content
        })
      }
    })
  },
  //点击图片评论
  reply: function() {
    var that = this
    that.setData({
      focus: true
    })
  },
  //点击评论评论
  comment: function(e) {
    var that = this
    var canRemove = e.currentTarget.dataset.canremove
    if (canRemove==2){
      that.setData({
        placeholderText: '回复' + e.currentTarget.dataset.nickname + ':',
        focus: true,
        replyUserId: e.currentTarget.dataset.replyuserid,
        nickname: e.currentTarget.dataset.nickname,
      })
    }else{
      that.setData({
        placeholderText:'我来说两句'
      })
    }
  },
  //获取评论框的内容
  onbindinput: function(e) {
    var that = this
    if (e.detail.value.length>40){
      wx.showToast({
        title: '您已超出最大输入限度',
        icon:'none'
      })
    }else{
      that.setData({
        inputValue: e.detail.value
      })
    }   
  },
  //发送评论
  confirmTap: function() {
    var that = this
    if (that.data.inputValue !== '') {
      if (!that.data.replyUserId) {
        app.Util.ajax('mall/forum/comment/add',{
          topicId: that.data.topicId,
          content: that.data.inputValue,
        }, 'POST').then((res) => {
          if (res.data.content) {
            that.setData({
              inputValue: '',
              placeholderText: '我来说两句'
            })
            wx.showToast({
              title: '评论发送成功',
              icon: 'none'
            })

            setTimeout(function() {
              that.allPost();
            }, 1000) //延迟时间 这里是1秒         

          } else {
            wx.showToast({
              title: res.data.message,
              icon: 'none'
            })
          }
        })
      } else if (that.data.replyUserId) {
        app.Util.ajax('mall/forum/comment/add', {
          topicId: that.data.topicId,
          content: that.data.inputValue, 
          replyUserId: that.data.replyUserId
        } ,'POST').then((res) => {
          if (res.data.content) {
            that.setData({
              inputValue: '',
              placeholderText: '我来说两句',
              replyUserId:null
            })
            wx.showToast({
              title: '评论发送成功',
              icon: 'none'
            })
            setTimeout(function() {
              that.allPost();
            }, 1000) //延迟时间 这里是1秒                     
          } else {
            wx.showToast({
              title: res.data.message,
              icon: 'none'
            })
          }
        })
      }
    }
  },
  //删除评论弹框
  delRemark: function(e) {
    var that = this
    var canRemove = e.currentTarget.dataset.canremove
    that.setData({
      delCommentId: e.currentTarget.dataset.commentid
    })
    if (canRemove == 1) {
      that.setData({
        showComment: true
      })
    } else if (canRemove == 2){
      wx.showToast({
        title: '您不能删除此条评论！',
        icon:'none'
      })
    }
  },
  cancelComment: function() {
    var that = this
    that.setData({
      showComment: false
    })
  },
  confirmComment: function() {
    var that = this
    app.Util.ajax('mall/forum/comment/remove',{
      id: that.data.delCommentId
    }, 'POST').then((res) => {
      if (res.data.content) {
        that.setData({
          showComment: false
        })
        wx.showToast({
          title: '评论删除成功',
          icon: 'none'
        })
        setTimeout(function () {
          that.allPost();
        }, 500) //延迟时间                   
      } else {
        wx.showToast({
          title: res.data.message,
          icon: 'none'
        })
      }
    })
  },

  //聚焦软键盘
  onbindfocus: function(e) {
    var that = this
    that.setData({
      bottom: e.detail.height,
    })
  },
  onbindblur: function(e) {
    var that = this
    that.setData({
      bottom: 0,
    })
  },
  //收藏帖子
  collectImg: function(e) {
    var that = this
    app.Util.ajax('mall/forum/topic/favorite', {
      id: e.currentTarget.dataset.id
    }, 'POST').then((res) => {
      if (res.data.content) {
        if (that.data.content.isFavoriate == 2) {
          that.data.content.isFavoriate = 1
        } else if (that.data.content.isFavoriate == 1) {
          that.data.content.isFavoriate = 2
        }
        that.setData({
          content: that.data.content
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
  ativeCollectImg: function(e) {
    var that = this
    app.Util.ajax('mall/forum/topic/favorite', {
      id: e.currentTarget.dataset.id
    }, 'POST').then((res) => {
      if (res.data.content) {
        if (that.data.content.isFavoriate == 2) {
          that.data.content.isFavoriate = 1
        } else if (that.data.content.isFavoriate == 1) {
          that.data.content.isFavoriate = 2
        }
        that.setData({
          content: that.data.content
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
          wx.navigateBack()
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
  //取消关注
  notFollow: function(e) {
    var that = this
    if (wx.getStorageSync('token')) {
      app.Util.ajax('mall/forum/topic/attention',{
        id: e.currentTarget.dataset.id
      }, 'POST').then((res) => {
        if (res.data.content) {
          if (that.data.content.isAttention == 2) {
            that.data.content.isAttention = 1
          } else if (that.data.content.isAttention == 1) {
            that.data.content.isAttention = 2
          }
          that.setData({
            content: that.data.content
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
  //关注
  follow: function(e) {
    var that = this
    that.setData({
      showFollow: true,
      followId: e.currentTarget.dataset.id,
      followIndex: e.currentTarget.dataset.index
    })
  },
  //取消关注弹框
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
        if (that.data.content.isAttention == 2) {
          that.data.content.isAttention = 1
        } else if (that.data.content.isAttention == 1) {
          that.data.content.isAttention = 2
        }
        that.setData({
          content: that.data.content,
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
})