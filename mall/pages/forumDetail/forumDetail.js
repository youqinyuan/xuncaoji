// pages/forumDetail/forumDetail.js
let app = getApp();
var time = require('../../utils/util.js');
var newCount = true
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hostUrl: app.Util.getUrlImg().hostUrl,
    showComment: false, //删除评论弹窗
    delCommentId: null, //评论id
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
    placeholderText: '我来说两句',
    showPassword: false,
    isFocus: false, //聚焦 
    Value: "", //输入的内容 
    show: false,
    Length: 6, //输入框个数 
    ispassword: true, //是否密文显示 true为密文， false为明文。
    sure_two_tishi: "",
    sureOne: false,
    sureTwo: false,
    showDialog: false,
    typeStatus: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    if (wx.getStorageSync('recharge') || wx.getStorageSync('password')) {
      that.setData({
        sureOne: false,
        sureTwo: false,
      })
    }
    that.setData({
      topicId: parseInt(options.id),
      replyUserId: parseInt(options.userId),
      placeholderText: options.nickname ? '回复' + options.nickname + ':' : "我来说两句",
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
    var that = this
    if (wx.getStorageSync('wait')) {
      that.allPost()
      wx.removeStorageSync('wait')
    }
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
    if (canRemove == 2) {
      that.setData({
        placeholderText: '回复' + e.currentTarget.dataset.nickname + ':',
        focus: true,
        replyUserId: e.currentTarget.dataset.replyuserid,
        nickname: e.currentTarget.dataset.nickname,
      })
    } else {
      that.setData({
        placeholderText: '我来说两句'
      })
    }
  },
  //获取评论框的内容
  onbindinput: function(e) {
    var that = this
    if (e.detail.value.length > 40) {
      wx.showToast({
        title: '您已超出最大输入限度',
        icon: 'none'
      })
    } else {
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
        app.Util.ajax('mall/forum/comment/add', {
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
        }, 'POST').then((res) => {
          if (res.data.content) {
            that.setData({
              inputValue: '',
              placeholderText: '我来说两句',
              replyUserId: null
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
    } else if (canRemove == 2) {
      wx.showToast({
        title: '您不能删除此条评论！',
        icon: 'none'
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
    app.Util.ajax('mall/forum/comment/remove', {
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
        setTimeout(function() {
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
      app.Util.ajax('mall/forum/topic/attention', {
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


  //立即预订
  subscribe: function(e) {
    var that = this
    if (wx.getStorageSync('token')) {
      var id = e.currentTarget.dataset.id
      var typeStatus = e.currentTarget.dataset.type
      console.log(id)
      that.setData({
        topicId: id,
        typeStatus: typeStatus,
      })
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
              isFocus: true
            })
          }
        }
      })
    } else {
      wx.navigateTo({
        url: '/pages/invitationCode/invitationCode',
      })
    }
  },

  //交易确认
  sure: function(e) {
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
      var typeStatus = e.currentTarget.dataset.type
      that.setData({
        avatarKey: avatarKey,
        nickname: nickname,
        mobileNumber: mobileNumber,
        cashBackAmount: cashBackAmount,
        periodLeft: periodLeft,
        expectAmount: expectAmount,
        topicId: id,
        returnType: returnType,
        sureOne: true,
        typeStatus: typeStatus
      }) 
    } else {
      wx.navigateTo({
        url: '/pages/invitationCode/invitationCode',
      })
    }
  },
  //第一次确认关闭右上角的按钮
  // sureOneClose: function() {
  //   var that = this
  //   that.setData({
  //     sureOne: false
  //   })
  // },
  //第二次确认关闭右上角的按钮
  // sureTwoClose: function() {
  //   var that = this
  //   that.setData({
  //     sureTwo: false,
  //     sure_two_tishi: ""
  //   })
  // },
  //取消交易确认弹窗
  cancle_one: function() {
    var that = this
    that.setData({
      sureOne: false,
      sureTwo_cancle: false
    })
  },
  //确定交易确认弹窗
  sure_one: function() {
    var that = this
    //账户资产数据
    app.Util.ajax('mall/forum/topic/saleTopicTradeCheck', {
      topicId: that.data.topicId
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
  cancle_two: function() {
    var that = this
    that.setData({
      sureTwo: false,
      sure_two_tishi: "",
      sureOne: false
    })
  },
  //确定确认交易弹窗
  sure_two: function() {
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
  cancelShow: function() {
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
        if (that.data.typeStatus == 4) {
          app.Util.ajax('mall//forum/topic/advanceOrderSchedule', {
            topicId: that.data.topicId,
            paymentPassword: e.detail.value
          }, 'POST').then((res) => {
            if (res.data.messageCode == 'MSG_1001') {
              wx.navigateTo({
                url: '/packageB/pages/waitReentryDetail/waitReentryDetail',
              })
              that.setData({
                show: false,
                Value: ''
              })
              wx.setStorageSync('wait', 1)
            } else if (res.data.messageCode == 'MSG_4002') {
              that.setData({
                showDialog: true
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
        } else {
          app.Util.ajax('mall/forum/topic/saleTopicTrade', {
            topicId: that.data.topicId,
            paymentPassword: e.detail.value
          }, 'POST').then((res) => {
            if (res.data.messageCode == 'MSG_1001') {
              wx.showToast({
                title: '交易已完成，请在待返明细中查看',
                icon: 'none'
              })
              setTimeout(function() {
                that.allPost()
              }, 1000) //延迟时间 这里是1
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
      }
      setTimeout(function() {
        newCount = true
      }, 1000)
    }
  },
  //去充值余额
  continuePay: function() {
    var that = this;
    wx.navigateTo({
      url: '/pages/mine/recharge/recharge?tempStatus=' + 1,
    })
    that.setData({
      showDialog: false
    })
  },
  blur: function(e) {
    var that = this;
    that.setData({
      bottom: 0
    })
  },
  blur: function(e) {
    var that = this;
    that.setData({
      bottom: 0
    })
  },
  hideModal: function() {
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
  cancel: function() {
    var that = this
    that.setData({
      showPassword: false
    })
  },
  // 是否设置支付密码弹框点击确定
  sureSet: function() {
    var that = this
    that.setData({
      showPassword: false
    })
    wx.navigateTo({
      url: '/pages/paypassword/paypassword',
    })
  },

  //购买赚钱
  earnMoney(e) {
    if (wx.getStorageSync('token')) {
      let id = e.currentTarget.dataset.id
      let specitemids = e.currentTarget.dataset.specitemids
      let topicid = e.currentTarget.dataset.topicid
      let quantity = e.currentTarget.dataset.quantity
      let stockid = e.currentTarget.dataset.stockid
      let source = 1
      wx.navigateTo({
        url: `/pages/detail/detail?id=${id}&specitemids=${specitemids}&topicid=${topicid}&source=${source}&quantity=${quantity}&stockid=${stockid}`,
      })
    } else {
      wx.navigateTo({
        url: '/pages/invitationCode/invitationCode',
      })
    }
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
    wx.navigateTo({
      url: '/pages/detail/detail?id=' + e.currentTarget.dataset.id,
    })
  },
  // 增加曝光
  addAppear(e) {
    wx.navigateTo({
      url: '/packageA/pages/addAppear/addAppear?topicid=' + e.currentTarget.dataset.id,
    })
  }
})