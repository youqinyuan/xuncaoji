// pages/finishPosting/finishPosting.js
let app = getApp();
var time = require('../../utils/util.js');
var newCount = true
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hostUrl: app.Util.getUrlImg().hostUrl,
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
    seedIncreased: 0, //种子
    postingStatus: null, //是否显示推荐
    topicId: null,
    topicId1:null,
    showPassword: false,
    isFocus: false, //聚焦 
    Value: "", //输入的内容 
    show: false,
    Length: 6, //输入框个数 
    ispassword: true, //是否密文显示 true为密文， false为明文。
    sure_two_tishi: "",
    sureOne: false,
    sureTwo: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    that.setData({
      seedIncreased: parseInt(options.seedIncreased),
      postingStatus: parseInt(options.postingStatus),
      topicId: parseInt(options.id)
    })
    if (options.postingStatus == 2 || options.postingStatus == 3) {
     
    }
    that.recommend();
    if (wx.getStorageSync('recharge') || wx.getStorageSync('password')) {
      that.setData({
        sureOne: false,
        sureTwo: false,
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

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    wx.removeStorageSync('recharge')
    wx.removeStorageSync('password')
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    wx.navigateBack({
      delta: 1,
    })
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
    var that = this
    that.getRecommend()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  recommend: function() {
    var that = this
    app.Util.ajax('mall/forum/topic/findRecommendList', {
      topicId: that.data.topicId,
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
  getRecommend: function() {
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
  getHeight: function() {
    var that = this;
    setTimeout(() => {
      wx.createSelectorQuery().selectAll('.content-item').boundingClientRect(function(rect) {
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
  notFollow: function(e) {
    var that = this
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
  //点击评论跳转到帖子详情
  jumpForumDetail: function(e) {
    wx.navigateTo({
      url: '/pages/forumDetail/forumDetail?id=' + e.currentTarget.dataset.id,
    })
  },
  jumpComment: function(e) {
    wx.navigateTo({
      url: '/pages/forumDetail/forumDetail?tempStatus=' + 1 + '&id=' + e.currentTarget.dataset.id,
    })
  },

  //交易确认
  sure: function (e) {
    var that = this
    if (wx.getStorageSync('token')) {
      var avatarKey = e.currentTarget.dataset.avatarkey
      var nickname = e.currentTarget.dataset.nickname
      var cashBackAmount = e.currentTarget.dataset.cashbackamount
      var periodLeft = e.currentTarget.dataset.periodleft
      var expectAmount = e.currentTarget.dataset.expectamount
      var mobileNumber = e.currentTarget.dataset.mobilenumber
      var canRemove = e.currentTarget.dataset.canremove
      var id = e.currentTarget.dataset.id
      var returnType = e.currentTarget.dataset.returntype
      that.setData({
        avatarKey: avatarKey,
        nickname: nickname,
        mobileNumber: mobileNumber,
        cashBackAmount: cashBackAmount,
        periodLeft: periodLeft,
        expectAmount: expectAmount,
        topicId: id,
        returnType: returnType,
        sureOne: true
      }) 
    } else {
      wx.navigateTo({
        url: '/pages/invitationCode/invitationCode',
      })
    }
  },
  //第一次确认关闭右上角的按钮
  sureOneClose: function () {
    var that = this
    that.setData({
      sureOne: false
    })
  },
  //第二次确认关闭右上角的按钮
  sureTwoClose: function () {
    var that = this
    that.setData({
      sureTwo: false,
      sure_two_tishi: ""
    })
  },
  //取消交易确认弹窗
  cancle_one: function () {
    var that = this
    that.setData({
      sureOne: false,
      sureTwo_cancle: false
    })
  },
  //确定交易确认弹窗
  sure_one: function () {
    var that = this
    //账户资产数据
    app.Util.ajax('mall/forum/topic/saleTopicTradeCheck', {
      topicId: that.data.topicId1
    }, 'POST').then((res) => {
      if (res.data.messageCode == 'MSG_1001') {
        that.setData({
          sureOne: false,
          sureTwo: true,
          sure_two_tishi: "",
          btnText: '确认'
        })
      } else if (res.data.messageCode == 'MSG_4002') {
        that.setData({
          sureOne: false,
          sureTwo: true,
          sure_two_tishi: "提示：账户余额不足，请先充值。",
          btnText: '去充值'
        })
      } else {
        that.setData({
          sureOne: false,
          sureTwo: true,
          sure_two_tishi: res.data.message,
          btnText: '确认'
        })
      }
    })
  },
  //取消确认交易弹窗
  cancle_two: function () {
    var that = this
    that.setData({
      sureTwo: false,
      sure_two_tishi: "",
      sureOne: false
    })
  },
  //确定确认交易弹窗
  sure_two: function () {
    var that = this
    if (that.data.btnText == '去充值') {
      wx.navigateTo({
        url: '/pages/mine/recharge/recharge?tempStatus=' + 1,
      })
    } else if (that.data.btnText == '确认' && that.data.sure_two_tishi == '') {
      //开启密码输入
      app.Util.ajax('mall/account/paymentPassword/status', 'GET').then((res) => { // 使用ajax函数
        if (res.data.messageCode == 'MSG_1001') {
          if (res.data.content == 2) {
            //未设置密码
            that.setData({
              showPassword: true
            })
          } else {
            //已设置密码
            that.setData({
              show: true,
              // sureTwo: false,
              isFocus: true
            })
          }
        }
      })
    }
  },
  //取消支付密码弹框
  cancelShow: function () {
    var that = this;
    that.setData({
      show: false,
      Value: ''
    })
  },
  //获取密码框的值
  Focus(e) {
    var that = this;
    var inputValue = e.detail.value;
    that.setData({
      Value: inputValue
    })
    if (that.data.Value.length === 6) {
      if (newCount == true) {
        newCount = false
        app.Util.ajax('mall/forum/topic/saleTopicTrade', {
          topicId: that.data.topicId1,
          paymentPassword: e.detail.value
        }, 'POST').then((res) => {
          if (res.data.messageCode == 'MSG_1001') {
            wx.showToast({
              title: '交易已完成，请在待返明细中查看',
              icon: 'none'
            })
            setTimeout(function () {
              that.setData({
                pageNumber: 1
              })
              that.setData({
                topicId: that.data.topicId,
              })
              console.log(that.data.topicId)
              that.recommend();
            }, 1000) //延迟时间 这里是2秒
            that.setData({
              show: false,
              sureTwo: false,
              Value: ''
            })
          } else {
            wx.showToast({
              title: res.data.message,
              icon: 'none'
            })
            that.setData({
              Value: ""
            })
          }
        })
      }
      setTimeout(function () {
        newCount = true
      }, 1000)
    }
  },
  blur: function (e) {
    var that = this;
    that.setData({
      bottom: 0
    })
  },
  hideModal: function () {
    var that = this
    that.setData({
      show: false,
      isFocus: false,
      Value: ''
    })
  },
  Tap() {
    var that = this;
    that.setData({
      isFocus: true,
    })
  },
  // 是否设置支付密码弹框点击取消
  cancel: function () {
    var that = this
    that.setData({
      showPassword: false
    })
  },
  // 是否设置支付密码弹框点击确定
  sureSet: function () {
    var that = this
    that.setData({
      showPassword: false
    })
    wx.navigateTo({
      url: '/pages/paypassword/paypassword',
    })
  },

})