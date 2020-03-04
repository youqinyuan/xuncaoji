// pages/diamondPartner/diamondPartner.js
let app = getApp();
var time = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hostUrl: app.Util.getUrlImg().hostUrl,
    showMark: false, //加导师弹窗
    showReward: false, //平台奖励
    disabled: true, //按钮禁用
    disBtn: '',
    disBtn1: '',
    tempStatus: 1,
    firstStep: false, //第一级明细
    commissionDetail: [],
    moveText:null,
    collocation: [{
      type: 1,
      level: 1,
      totalAmount: 0
    }, {
      type: 1,
      level: 2,
      totalAmount: 0
    }, {
      type: 2,
      level: 1,
      totalAmount: 0
    }, {
      type: 3,
      level: 1,
      totalAmount: 0
    }, {
      type: 4,
      level: 1,
      totalAmount: 0
    }, ],
    shareImg: '', //分享图片
    list: [{
        img: app.Util.getUrlImg().hostUrl+'/diamondPartner/card_a.png',
        status: '1'
      }, {
        img: app.Util.getUrlImg().hostUrl+'/diamondPartner/card_b.png',
        status: '6'
      }, {
        img: app.Util.getUrlImg().hostUrl+'/diamondPartner/card_c.png',
        status: '2'
      }, {
        img: app.Util.getUrlImg().hostUrl+'/diamondPartner/card_d.png',
        status: '3'
      },
      {
        img: app.Util.getUrlImg().hostUrl+'/diamondPartner/card_e.png',
        status: '4'
      },
      {
        img: app.Util.getUrlImg().hostUrl+'/diamondPartner/card_f.png',
        status: '5'
      }
    ],
    content: null,
    initialize: {}, //奖励金，购物金
    initMember: {}, //是否是钻石合伙人
    backWidth: 100,
    pageNumber: 1,
    pageSize: 10,
    type: null,
    level: null,
    day: null, //剩余天数
    photoNickname: null, //头像和昵称
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    //下载线上图片到本地，用于绘制分享图片
    that.getData();
    that.initDiamond();
    wx.downloadFile({
      url: app.Util.getUrlImg().hostUrl+'/shre_img.png',
      success: function(res) {
        that.setData({
          shareImg: res.tempFilePath
        })
      },
      fail: function(res) {

      }
    })
    app.Util.ajax('mall/personal/followers', {
      pageNumber: that.data.pageNumber,
      pageSize: that.data.pageSize
    }, 'GET').then((res) => {
      if (res.data.messageCode = 'MSG_1001') {
        that.data.collocation[1].level=res.data.content.level
        that.setData({
          collocation:that.data.collocation
        })
      }
    })
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
    this.onLoad()
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
    var that = this
    return {
      title: '【钻石合伙人招募令】加入寻草记～共赢未来，带你提前实现财富自由！！！',
      path: '/pages/diamondPartner/diamondPartner?inviterCode=' + wx.getStorageSync('inviterCode'),
      imageUrl: that.data.shareImg,
    }
  },
  getData: function() {
    var that = this
    that.initPrice();
    that.baseMessage();
  },
  baseMessage: function() {
    var that = this
    app.Util.ajax('mall/personal/queryBaseData', null, 'POST').then((res) => { // 使用ajax函数
      if (res.data.content) {
        that.setData({
          photoNickname: res.data.content
        })
      } else {
        that.setData({
          photoNickname: null
        })
      }
    })
  },
  //初始化页面的价格
  initPrice: function() {
    var that = this
    app.Util.ajax('mall/paramConfig/getMemberParamConfig', 'GET').then((res) => {
      if (res.data.content) {
        res.data.content.forEach((v, i) => {
          if (v.key == "PAYMENT_AMOUNT") {
            that.data.initialize['payMent'] = v.value
          } else if (v.key == "DIAMOND_FREE_BUY_AMOUNT") {
            that.data.initialize['diamond'] = v.value
          } else if (v.key == "SUBORDINATES_NUMBER") {
            that.data.initialize['subordiates'] = v.value
          } else if (v.key == "INVITEES_COUNT") {
            that.data.initialize['invitees'] = v.value
          }
        })
        that.setData({
          initialize: that.data.initialize
        })
        that.initMember();
      } else {
        wx.showToast({
          title: res.data.message,
          icon: 'none'
        })
      }
    })
  },
  //是否是钻石会员
  initMember: function() {
    var that = this
    app.Util.ajax('mall/personal/myMember', null, 'GET').then((res) => {
      if (res.data.content) {
        var timestamp = new Date().getTime()
        var current = res.data.content.expireTime - timestamp
        that.formatDuring(current)
        res.data.content.expireTime = time.formatTimeTwo(res.data.content.expireTime, 'Y.M.D');
        // res.data.content.shoppingGoldFreeBuyTimes = -(res.data.content.shoppingGoldFreeBuyTimes)
        that.setData({
          initMember: res.data.content,
        })
        if (that.data.initMember.rewardTime == null) {
          that.setData({
            disBtn: '领取奖励' + that.data.initialize.payMent,
            disBtn1: '奖金权益',
            tempStatus: 1
          })
        } else {
          that.setData({
            disBtn: '免费续约',
            disBtn1: '免费续约权益',
            tempStatus: 2
          })
        }
        if (that.data.initMember.validTeamCount > 0) {
          if (that.data.tempStatus == 1) {
            if (that.data.initMember.rewardTime == null && that.data.initMember.validTeamCount / that.data.initialize.subordiates >= 1) {
              that.setData({
                disabled: false
              })
            }
          } else {
            if (that.data.initMember.validTeamCount / that.data.initialize.subordiates >= 1) {
              that.setData({
                disabled: false
              })
            }
          }
        }
        if (that.data.initMember.validTeamCount > that.data.initialize.subordiates) {
          var backWidth = Number(that.data.initMember.validTeamCount) % Number(that.data.initialize.subordiates)
          if (backWidth == 0) {
            that.setData({
              backWidth: 100
            })
          } else {
            var backWidth1 = backWidth / Number(that.data.initialize.subordiates)
            that.setData({
              backWidth: backWidth1 * 100
            })
          }
        } else {
          var backWidth = Number(that.data.initMember.validTeamCount) / Number(that.data.initialize.subordiates)
          that.setData({
            backWidth: backWidth * 100
          })
        }

      } else {
        wx.showToast({
          title: res.data.message,
          icon: 'none'
        })
      }
    })
  },

  formatDuring: function(mss) {
    var that = this
    var days = parseInt(mss / (1000 * 60 * 60 * 24));
    that.setData({
      days: days
    })
  },
  //跳到平台服务协议
  userAgreement: function() {
    wx.navigateTo({
      url: '/pages/userAgreement/userAgreement',
    })
  },
  //钻石会员的分佣权益
  initDiamond: function() {
    var that = this
    app.Util.ajax('mall/member/commissionStatistics', 'GET').then((res) => {
      if (res.data.content) {
        for (var i = 0; i < res.data.content.length; i++) {
          if (res.data.content[i].type == 1 && res.data.content[i].level == 1) {
            that.data.collocation[0].type = res.data.content[i].type
            that.data.collocation[0].level = res.data.content[i].level
            that.data.collocation[0].totalAmount = res.data.content[i].totalAmount
          } else if (res.data.content[i].type == 1 && res.data.content[i].level !== 1) {
            that.data.collocation[1].type = res.data.content[i].type
            that.data.collocation[1].level = res.data.content[i].level
            that.data.collocation[1].totalAmount = res.data.content[i].totalAmount
          } else if (res.data.content[i].type == 2) {
            that.data.collocation[2].type = res.data.content[i].type
            that.data.collocation[2].level = res.data.content[i].level
            that.data.collocation[2].totalAmount = res.data.content[i].totalAmount
          } else if (res.data.content[i].type == 3) {
            that.data.collocation[3].type = res.data.content[i].type
            that.data.collocation[3].level = res.data.content[i].level
            that.data.collocation[3].totalAmount = res.data.content[i].totalAmount
          } else if (res.data.content[i].type == 4) {
            that.data.collocation[4].type = res.data.content[i].type
            that.data.collocation[4].level = res.data.content[i].level
            that.data.collocation[4].totalAmount = res.data.content[i].totalAmount
          }
          that.setData({
            collocation: that.data.collocation
          })
        }        
      } else {
        wx.showToast({
          title: res.data.message,
          icon: 'none'
        })
      }
    })
  },
  //加导师弹窗
  showMark: function() {
    var that = this
    that.setData({
      showMark: true
    })
  },
  showMarkCancel: function() {
    var that = this
    that.setData({
      showMark: false
    })
  },
  //开通钻石会员
  openDiamond: function() {
    var that = this
    app.Util.ajax('mall/order/addDiamondPartnerOrder', {
      amount: that.data.initialize.payMent
    }, 'POST').then((res) => {
      if (res.data.content) {
        wx.navigateTo({
          url: `/pages/paymentorder/paymentorder?id=${res.data.content.id}&amount1=${1}`,
        })
      } else {
        wx.showToast({
          title: res.data.message,
          icon: 'none'
        })
      }
    })
  },
  //续费
  payDiamond: function() {
    var that = this
    app.Util.ajax('mall/order/addDiamondPartnerOrder', {
      amount: that.data.initialize.payMent
    }, 'POST').then((res) => {
      if (res.data.content) {
        wx.navigateTo({
          url: `/pages/paymentorder/paymentorder?id=${res.data.content.id}&amount1=${1}`,
        })
      } else {
        wx.showToast({
          title: res.data.message,
          icon: 'none'
        })
      }
    })
  },
  //跳转至6大回报
  jumpDiamondPay: function(e) {
    var that = this
    var initialize = JSON.stringify(that.data.initialize)
    wx.navigateTo({
      url: `/pages/diamondPay/diamondPay?status=${e.currentTarget.dataset.status}&payMent=${that.data.initialize.payMent}&subordiates=${that.data.initialize.subordiates}&diamond=${that.data.initialize.diamond}`,
    })
  },
  //跳转至申请合伙人
  jumpCityPartner: function() {
    var that = this
    wx.navigateTo({
      url: '/pages/cityPartner/cityPartner'
    })
  },
  //领取奖励
  getPrice: function() {
    var that = this
    app.Util.ajax('mall/member/rewardMember', null, 'POST').then((res) => {
      if (res.data.content) {
        if (that.data.tempStatus == 1) {
          that.setData({
            showReward: true
          })
        } else {
          wx.showToast({
            title: '免费续约成功',
            icon: 'none'
          })
        }
        that.setData({
          disabled: true,
          disBtn: '免费续约',
          disBtn1: '免费续约权益'
        })
      } else {
        wx.showToast({
          title: res.data.message,
          icon: 'none'
        })
      }
    })
  },
  understand: function() {
    var that = this
    that.setData({
      showReward: false
    })
  },
  cancelReward: function() {
    var that = this
    that.setData({
      showReward: false
    })
  },
  // 明细表
  // 第一级
  showFirstStep: function(e) {
    var that = this
    that.setData({
      type: e.currentTarget.dataset.type,
      level: e.currentTarget.dataset.level,
      pageNumber: 1
    })
    app.Util.ajax('mall/member/commissionDetailList', {
      pageNumber: that.data.pageNumber,
      pageSize: that.data.pageSize,
      type: e.currentTarget.dataset.type,
      level: e.currentTarget.dataset.level
    }, 'GET').then((res) => {
      if (res.data.content) {
        that.setData({
          firstStep: true
        })
        if (res.data.content.items.length===0){
          that.setData({
            commissionDetail: res.data.content.items,
            moveText: '暂无数据'
          })
        }else{
          that.setData({
            commissionDetail: res.data.content.items,
            moveText:'提示：滑动查看'
          })
        }
      } else {
        wx.showToast({
          title: res.data.message,
          icon: 'none'
        })
      }
    })

  },
  cancelFirstStep: function() {
    var that = this
    that.setData({
      firstStep: false
    })
  },
  preventTouchMove: function() {

  },
  showLastStep: function() {
    wx.showToast({
      title: '暂无数据',
      icon: 'none'
    })
  },
  getMore: function() {
    var that = this
    var pageNumber = that.data.pageNumber + 1
    app.Util.ajax('mall/member/commissionDetailList', {
      pageNumber: pageNumber,
      pageSize: that.data.pageSize,
      type: that.data.type,
      level: that.data.level
    }, 'GET').then((res) => { // 使用ajax函数
      if (res.data.messageCode == 'MSG_1001') {
        if (res.data.content.items == '' && that.data.commissionDetail !== '') {
          wx.showToast({
            title: '没有更多数据了',
            icon: 'none'
          })
        }
        var arr = that.data.commissionDetail
        res.data.content.items.forEach((v, i) => {
          arr.push(res.data.content.items[i])
        })
        that.setData({
          commissionDetail: arr,
          pageNumber: pageNumber
        })
      } else {
        wx.showToast({
          title: res.data.message,
          icon: 'none'
        })
      }
    })
  },
  //长按保存
  saveCode: function() {
    var that = this
    var tempFilePath = '/assets/images/diamondPartner/code_img.png'
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.writePhotosAlbum']) {
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success() {
              console.log('授权相册')
              wx.saveImageToPhotosAlbum({
                filePath: tempFilePath,
                success(res) {
                  wx.hideLoading()
                  console.log('保存图片成功回调')
                  wx.showToast({
                    title: '保存成功',
                    icon: 'none'
                  });
                  that.setData({
                    showMark: false
                  })
                },
                fail(res) {
                  wx.hideLoading()
                  console.log('保存图片失败回调')
                  console.log(res);
                }
              })
            },
            fail() {
              wx.hideLoading();
              wx.showModal({
                title: '温馨提示',
                content: '您已拒绝授权，是否去设置打开？',
                confirmText: "确认",
                cancelText: "取消",
                success: function(res) {
                  console.log(res);
                  if (res.confirm) {
                    console.log('用户点击确认')
                    wx.openSetting({
                      success: (res) => {
                        console.log(res)
                        res.authSetting = {
                          "scope.writePhotosAlbum": true,
                        }
                        console.log("openSetting: success");
                        wx.saveImageToPhotosAlbum({
                          filePath: tempFilePath,
                          success(res) {
                            wx.hideLoading()
                            wx.showToast({
                              title: '保存成功',
                              icon: 'none'
                            });
                            that.setData({
                              showMark: false
                            })
                          },
                          fail(res) {
                            wx.hideLoading()
                            console.log(res);
                          }
                        })
                      }
                    });
                  } else {
                    console.log('用户点击取消')
                  }
                }
              });

            }
          })
        } else {
          console.log('保存图片')
          wx.saveImageToPhotosAlbum({
            filePath: tempFilePath,
            success(res) {
              wx.hideLoading()
              console.log('保存图片成功回调')
              wx.showToast({
                title: '保存成功',
                icon: 'none'
              });

              that.setData({
                showMark: false
              })
            },
            fail(res) {
              wx.hideLoading()
              console.log('saveImageToPhotosAlbum 失败回调')
              console.log(res);
            }
          })
        }
      },
      fail(res) {
        wx.hideLoading()
        console.log('wx.getSetting 失败回调')
        console.log(res);
      }
    })
  },
})