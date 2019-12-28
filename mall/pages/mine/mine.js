// pages/mine/mine.js
const app = getApp()
var time = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    messageNum: null,
    tempInfo: [],
    returnContent: [],
    returnContent2: [],
    waitReentry3: false,
    waitReentry: false,
    waitReentry2: false,
    content: {},
    slist: [{
      img: 'https://xuncj.yzsaas.cn/_download/img/icon/my_order_list1_icon.png',
      txt: '待支付',
      status: '1'
    }, {
        img: 'https://xuncj.yzsaas.cn/_download/img/add/my_order_list5_icon.png',
        txt: '待发货',
        status: '2'
      }, {
      img: 'https://xuncj.yzsaas.cn/_download/img/icon/my_order_list2_icon.png',
      txt: '待收货',
      status: '4'
    }, {
      img: 'https://xuncj.yzsaas.cn/_download/img/icon/my_order_list3_icon.png',
      txt: '待评价',
      status: '5'
    }, {
      img: 'https://xuncj.yzsaas.cn/_download/img/icon/my_order_list4_icon.png',
      txt: '退款/售后',
      status: '7, 8, 9, 10, 11'
    }],
    showInviterCode: false, //邀请码
    orderCount: [],
    token: null,
    downAppStatus: false,
    QRUrl: '',
    noCashBackAmount: 0,
    DownloadAddress: 'https://a.app.qq.com/o/simple.jsp?pkgname=com.jiutian.yzsotreapp',
    imgSrc: app.Util.getUrlImg().hostUrl + '/download_android.png'
  },
  //客服分享图片回到指定的小程序页面
  handleContact: function (e) {
    var path = e.detail.path,
      query = e.detail.query,
      params = '';
    if (path) {
      for (var key in query) {
        params = key + '=' + query[key] + '&';
      }
      params = params.slice(0, params.length - 1);
      wx.navigateTo({
        url: path + '?' + params
      })
    }
  },
  //跳转到登录页面
  jumpLogin: function () {
    wx.setStorageSync("loginStatus", 1)
    wx.navigateTo({
      url: '/pages/invitationCode/invitationCode',
    })
  },
  //跳转到全部订单页面
  navOrder: function (e) {
    if(e.currentTarget.dataset.index==4){
      wx.setStorageSync("orderShowStatus",1)
    }
    if (e.currentTarget.dataset.index == 1) {
      if (wx.getStorageSync('token')) {
        if (e.detail.formId !== 'the formId is a mock one') {
          // console.log(e.detail.formId)
          app.Util.ajax('mall/userFromRecord/addRecord', {
            formId: e.detail.formId
          }, 'POST').then((res) => { // 使用ajax函数
            // console.log(res.data)
          })
        } else {
          // console.log(e.detail.formId)
        }
      }
    }
    app.nav(e);
  },
  /**
   * 跳转到开通会员页面
   */
  open: function () {
    var that = this
    wx.navigateTo({
      url: '/pages/member/member',
    })
  },
  /**
   * 跳转到充值页面
   */
  recharge: function (e) {
    wx.navigateTo({
      url: '/pages/mine/recharge/recharge'
    })
  },
  /**
   * 跳转到个人资料页面
   */
  personalData: function (e) {
    let img = e.currentTarget.dataset.img
    wx.navigateTo({
      url: `/pages/mine/personal/personal?img=${img}`,
    })
  },
  //跳转至钻石合伙人页面
  jumpDiamond: function () {
    wx.navigateTo({
      url: '/pages/diamondPartner/diamondPartner',
    })
  },
  //付钱页面
  payMoney: function () {
    wx.navigateTo({
      url: '/pages/undeveloped/undeveloped',
    })
  },
  //跳转到佣金页面
  commission: function () {
    wx.navigateTo({
      url: '/pages/commission/commission',
    })
  },
  //跳到我的论坛页面
  myForum: function () {
    wx.navigateTo({
      url: '/pages/myForum/myForum',
    })
  },
  //跳转到我的团队页面
  myTeam: function () {
    wx.navigateTo({
      url: '/pages/myteam/myteam',
    })
  },
  //跳转到购物车
  toCart: function () {
    wx.navigateTo({
      url: '/pages/index/cart/cart',
    })
  },
  //我的心情
  toMyPeriod: function () {
    wx.navigateTo({
      url: '/pages/myPeriod/myPeriod',
    })
  },
  //跳转到修改地址页面
  toAdress: function () {
    wx.navigateTo({
      url: '/pages/address/address',
    })
  },
  //跳转到支付密码页面
  toPassword: function () {
    wx.navigateTo({
      url: '/pages/paypassword/paypassword',
    })
  },
  //邀请码
  showInviterCode: function () {
    var that = this;
    that.setData({
      showInviterCode: true
    })
    wx.hideTabBar()
  },
  hideModal: function () {
    var that = this
    that.setData({
      showInviterCode: false
    })
    wx.showTabBar()
  },
  //点击复制
  copyText: function (e) {
    var that = this
    var text = e.currentTarget.dataset.text
    var text1 = text.toString()
    wx.setClipboardData({
      data: text1,
      success: function (res) {
        wx.getClipboardData({
          success: function (res) {
            wx.showToast({
              title: '复制成功',
              icon: 'none'
            })
            wx.showTabBar({})
            that.setData({
              showInviterCode: false
            })
          }
        })
      }
    })
  },
  onLoad: function (options) {
    var that = this
    if (options) {
      if (options.inviterCode) {
        wx.setStorage({
          key: "othersInviterCode",
          data: options.inviterCode
        })
      }
    }
    var token = wx.getStorageSync('token')
    that.setData({
      token: token
    })
    if (!token) {
      return
    } else {
      //新消息总数
      that.getMessage();
      that.init()
    }
    //下载线上图片到本地，用于绘制分享图片
    wx.downloadFile({
      url: app.Util.getUrlImg().hostUrl + '/download_android.png',
      success: function (res) {
        that.setData({
          QRUrl: res.tempFilePath
        })
      },
      fail: function (res) {

      }
    })
  },
  init: function () {
    var that = this
    app.Util.ajax('mall/personal/dashboard', null, 'GET').then((res) => { // 使用ajax函数
      if (res.data.content) {
        if (res.data.content.orderCount.length > 0) {
          for (var i = 0; i < res.data.content.orderCount.length; i++) {
            res.data.content.orderCount[i].count = res.data.content.orderCount[i].count > 99 ? res.data.content.orderCount[i].count + '+' : res.data.content.orderCount[i].count
          }
          // res.data.content.memberExpireTime = time.formatTimeTwo(res.data.content.memberExpireTime, 'Y-M-D');
        }
        that.setData({
          content: res.data.content ? res.data.content : '',
          orderCount: res.data.content ? res.data.content.orderCount : [],
        })
      }
    })
    //账户余额与未到账金额
    // app.Util.ajax('mall/personal/balanceDetails', {
    //   pageNumber: 1,
    //   pageSize: 1,
    //   status: 1
    // }, 'GET').then((res) => {
    //   if (res.data.content){
    //     that.setData({
    //       noCashBackAmount: res.data.content.noCashBackAmount,
    //       balance: res.data.content.balance,
    //       commissionBalance: res.data.content.commissionBalance
    //     })
    //   }
    // })
    //账户资产数据
    app.Util.ajax('mall/personal/assets', null, 'GET').then((res) => {
      if(res.data.content){
        that.setData({
          seedContent: res.data.content,
          noCashBackAmount: res.data.content.noCashBackAmount,
          balance: res.data.content.balance,
          commissionBalance: res.data.content.commissionBalance + res.data.content.pendingCommission
        })
      }      
    })
  },
  //新消息总数
  getMessage: function () {
    var that = this
    app.Util.ajax('mall/forum/comment/findMyRemindMsgCount', 'GET').then((res) => {
      if (res.data.messageCode == 'MSG_1001') {
        that.setData({
          messageNum: res.data.content
        })
      }
    })
  },
  toReentryDetail: function () {
    wx.navigateTo({
      url: '/pages/waitReentryDetail/waitReentryDetail'
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
    var that = this
    //钻石合伙人入口是否开启
    app.Util.ajax('mall/paramConfig/getParamConfigByKey', {
      key: "DIAMOND_PARTNER_H5_SHOW"
    }, 'GET').then((res) => {
      that.setData({
        entrance: res.data.content.value
      })
    })
    if (wx.getStorageSync("token")) {
      that.returnInfo()
    }
    that.onLoad(that.data.options)

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
    var that = this
    that.onLoad(that.data.options)
    wx.stopPullDownRefresh() //停止下拉刷新
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
    return {
      path: "/pages/mine/mine?inviterCode=" + wx.getStorageSync('inviterCode'),
    }
  },
  //下载APP弹窗(显示)
  downAppShow: function () {
    console.log("下载弹窗已显示")
    this.setData({
      downAppStatus: true
    })
  },
  //下载APP弹窗(隐藏)
  downAppHiden: function () {
    console.log("下载弹窗已隐藏")
    this.setData({
      downAppStatus: false
    })
  },
  //保存二维码到相册
  saveQR: function () {
    var that = this
    var tempFilePath = that.data.QRUrl
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

                  that.setData({
                    downAppStatus: false
                  });

                  wx.hideLoading()
                  console.log('保存图片成功回调')
                  wx.showToast({
                    title: '保存成功',
                    icon: 'none'
                  }, 2000);

                },
                fail(res) {
                  wx.hideLoading()
                  console.log('保存图片失败回调')
                  console.log(res);
                  wx.showToast({
                    title: '保存失败，请稍后重试',
                    icon: 'none'
                  }, 2000);
                  that.setData({
                    downAppStatus: false
                  });
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
                success: function (res) {
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

                            that.setData({
                              downAppStatus: false
                            });

                            wx.hideLoading()
                            wx.showToast({
                              title: '保存成功',
                              icon: 'none'
                            }, 2000);
                          },
                          fail(res) {
                            wx.hideLoading()
                            console.log(res);
                            wx.showToast({
                              title: '保存失败，请稍后重试',
                              icon: 'none'
                            }, 2000);
                            that.setData({
                              downAppStatus: false
                            });
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
              }, 2000);

              that.setData({
                downAppStatus: false
              });
            },
            fail(res) {
              wx.hideLoading()
              console.log('saveImageToPhotosAlbum 失败回调')
              console.log(res);
              wx.showToast({
                title: '保存失败，请稍后重试',
                icon: 'none'
              }, 2000);
              that.setData({
                downAppStatus: false
              });
            }
          })
        }
      },
      fail(res) {
        wx.hideLoading()
        wx.showToast({
          title: '保存失败，请稍后重试',
          icon: 'none'
        }, 2000);
        console.log('wx.getSetting 失败回调')
        console.log(res);
      }
    })

  },
  copyDownloadAddress: function () {
    var that = this
    wx.setClipboardData({
      //准备复制的数据
      data: that.data.DownloadAddress,
      success: function (res) {
        wx.showToast({
          title: '复制成功',
          icon: "none"
        }, 2000);

        that.setData({
          downAppStatus: false
        });
      }
    });
  },
  //转让弹窗
  waitReentryClose: function () {
    this.setData({
      waitReentry: false
    })
    this.returnInfo3()
  },
  waitReentryClose2: function () {
    this.setData({
      waitReentry2: false
    })
    this.returnInfo2()
  },
  waitReentryClose3: function () {
    this.setData({
      waitReentry3: false
    })
    wx.navigateTo({
      url: "/pages/waitReentryDetail/waitReentryDetail"
    })
  },
  //转让信息弹窗查询
  returnInfo: function () {
    var that = this
    app.Util.ajax('mall/transfer/gainNotice', null, 'GET').then((res) => {
      if (res.data.content.length > 0) {
        that.setData({
          tempInfo: res.data.content
        })
        for (let i of res.data.content) {
          if (i.type == 2) {
            //转让完成消息
            that.setData({
              waitReentry2: true,
              returnContent2: i.standard
            })
          }
        }
        if (that.data.waitReentry2 == false) {
          for (let i of res.data.content) {
            if (i.type == 3) {
              //转让取消消息
              that.setData({
                waitReentry: true,
                returnContent: i.standard
              })
            }
          }
        }
        if (that.data.waitReentry == false) {
          for (let i of res.data.content) {
            if (i.type == 1) {
              //转让消息
              that.setData({
                waitReentry3: true,
              })
            }
          }
        }
      }
    })
  },
  returnInfo2: function () {
    var that = this
    if (that.data.tempInfo.length > 0) {
      for (let i of that.data.tempInfo) {
        if (i.type == 3) {
          //转让取消消息
          that.setData({
            waitReentry: true,
            returnContent: i.standard
          })
        }
      }
      if (that.data.waitReentry == false) {
        for (let i of that.data.tempInfo) {
          if (i.type == 1) {
            //转让消息
            that.setData({
              waitReentry3: true,
            })
          }
        }
      }

    }
  },
  returnInfo3: function () {
    var that = this
    if (that.data.tempInfo.length > 0) {
      for (let i of that.data.tempInfo) {
        if (i.type == 1) {
          //转让消息
          that.setData({
            waitReentry3: true,
          })
        }
      }
    }
  },
  toSeed:function(){
    if(wx.getStorageSync("token")){
      wx.navigateTo({
        url:"/pages/seed/seed"
      })
    }else{
      wx.navigateTo({
        url: '/pages/invitationCode/invitationCode',
      })
    }
  },
  column:function(e){
    var columnTemp = e.currentTarget.dataset.index
    if(wx.getStorageSync("token")){
      if(columnTemp==1){
        app.Util.ajax('mall/seed/sign', {
        }, 'POST').then((res) => {
          // console.log(res)
          if(res.data.content){
            wx.showToast({
              title:"签到成功，奖励"+res.data.content+"种子",
              icon:"none"
             })
          }else{
            wx.showToast({
              title:res.data.message,
              icon:"none"
             })
          }
        })
      }else if(columnTemp==2){
        wx.navigateTo({
          url: '/pages/mine/recharge/recharge?temp=1',
        })
      }else if(columnTemp==3){
        wx.switchTab({
          url: '/pages/index/index',
        })
      }else if(columnTemp==4){
        console.log("论坛首页")
        wx.switchTab({
          url: '/pages/forum/forum',
        })
      }else if(columnTemp==5){
        wx.navigateTo({
          url: '/pages/waitReentryDetail/waitReentryDetail?temp=1',
        })
      }
      else if(columnTemp==6){
        wx.showToast({
          title:"暂未开放哦，敬请期待",
          icon:"none"
        })
      }
    }else{
      wx.navigateTo({
        url: '/pages/invitationCode/invitationCode',
      })
    }
  }
})