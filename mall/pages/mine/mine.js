// pages/mine/mine.js
const app = getApp()
var time = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    oneShow: false,//一折购物
    showModalStatus1: false,//好友下单
    storeEnterStatus: '',
    hostUrl: app.Util.getUrlImg().hostUrl,
    messageNum: null,
    tempInfo: [],
    returnContent: [],
    returnContent2: [],
    waitReentry3: false,
    waitReentry: false,
    waitReentry2: false,
    content: {},
    slist: [{
      img: app.Util.getUrlImg().hostUrl + '/twoSix/my_order_list1_icon.png',
      txt: '待支付',
      status: '1'
    }, {
      img: app.Util.getUrlImg().hostUrl + '/twoSix/my_order_list2_icon.png',
      txt: '待发货',
      status: '2'
    }, {
      img: app.Util.getUrlImg().hostUrl + '/twoSix/my_order_list3_icon.png',
      txt: '待收货',
      status: '4'
    }, {
      img: app.Util.getUrlImg().hostUrl + '/twoSix/my_order_list4_icon.png',
      txt: '待评价',
      status: '5'
    }, {
      img: app.Util.getUrlImg().hostUrl + '/twoSix/my_order_list5_icon.png',
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
    imgSrc: app.Util.getUrlImg().hostUrl + '/download_android.png',
    returnCanclePeople: false,
    haibao: false,
    path_img: '',
    popShow: false,
    floatShow: false
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
    // wx.setStorageSync("loginStatus", 1)
    wx.navigateTo({
      url: '/pages/invitationCode/invitationCode',
    })
  },
  //跳转到全部订单页面
  navOrder: function (e) {
    var token = wx.getStorageSync('token')
    if (token) {
      if (e.currentTarget.dataset.index == 4) {
        wx.setStorageSync("orderShowStatus", 1)
      }
      app.nav(e);
      wx.setStorageSync('myOrder', 1)
    } else {
      wx.navigateTo({
        url: '/pages/invitationCode/invitationCode',
      })
    }
  },
  /**
   * 跳转到开通会员页面
   */
  open: function () {
    var token = wx.getStorageSync('token')
    if (token) {
      wx.navigateTo({
        url: '/packageA/pages/member/member',
      })
    } else {
      wx.navigateTo({
        url: '/pages/invitationCode/invitationCode',
      })
    }

  },
  /**
   * 跳转到充值页面
   */
  recharge: function (e) {
    var token = wx.getStorageSync('token')
    if (token) {
      wx.navigateTo({
        url: '/pages/mine/recharge/recharge'
      })
    } else {
      wx.navigateTo({
        url: '/pages/invitationCode/invitationCode',
      })
    }
  },
  /**
   * 跳转到个人资料页面
   */
  personalData: function (e) {
    let img = e.currentTarget.dataset.img
    var token = wx.getStorageSync('token')
    if (token) {
      wx.navigateTo({
        url: `/pages/mine/personal/personal?img=${img}`,
      })
    } else {
      wx.navigateTo({
        url: '/pages/invitationCode/invitationCode',
      })
    }
  },
  //跳转至钻石合伙人页面
  jumpDiamond: function () {
    var token = wx.getStorageSync('token')
    if (token) {
      wx.navigateTo({
        url: '/pages/diamondPartner/diamondPartner',
      })
    } else {
      wx.navigateTo({
        url: '/pages/invitationCode/invitationCode',
      })
    }
  },
  //付钱页面
  saveAndmake: function () {
    var token = wx.getStorageSync('token')
    if (token) {
      wx.navigateTo({
        url: '/packageA/pages/saveAndMake/saveAndMake',
      })
    } else {
      wx.navigateTo({
        url: '/packageA/pages/invitationCode/invitationCode',
      })
    }
  },
  //跳转到佣金页面
  commission: function () {
    var token = wx.getStorageSync('token')
    if (token) {
      wx.navigateTo({
        url: '/packageB/pages/commission/commission',
      })
    } else {
      wx.navigateTo({
        url: '/pages/invitationCode/invitationCode',
      })
    }
  },
  //跳到我的论坛页面
  myForum: function () {
    var token = wx.getStorageSync('token')
    if (token) {
      wx.navigateTo({
        url: '/pages/myForum/myForum',
      })
    } else {
      wx.navigateTo({
        url: '/pages/invitationCode/invitationCode',
      })
    }
  },
  //跳转到我的团队页面
  myTeam: function () {
    var token = wx.getStorageSync('token')
    if (token) {
      wx.navigateTo({
        url: '/packageA/pages/myteam/myteam',
      })
    } else {
      wx.navigateTo({
        url: '/pages/invitationCode/invitationCode',
      })
    }
  },
  //跳转到提现银行卡
  toBankCard: function () {
    let token = wx.getStorageSync('token')
    if (token) {
      wx.navigateTo({
        url: '/packageA/pages/bankCard/bankCard',
      })
    } else {
      wx.navigateTo({
        url: '/pages/invitationCode/invitationCode',
      })
    }
  },
  //跳转到购物车
  toCart: function () {
    var token = wx.getStorageSync('token')
    if (token) {
      wx.navigateTo({
        url: '/pages/index/cart/cart',
      })
    } else {
      wx.navigateTo({
        url: '/pages/invitationCode/invitationCode',
      })
    }
  },
  //我的心情
  toMyPeriod: function () {
    var token = wx.getStorageSync('token')
    if (token) {
      wx.navigateTo({
        url: '/packageB/pages/stagesOrder/stagesOrder',
      })
    } else {
      wx.navigateTo({
        url: '/pages/invitationCode/invitationCode',
      })
    }

  },
  //跳转到修改地址页面
  toAdress: function () {
    var token = wx.getStorageSync('token')
    if (token) {
      wx.navigateTo({
        url: '/pages/address/address',
      })
    } else {
      wx.navigateTo({
        url: '/pages/invitationCode/invitationCode',
      })
    }
  },
  //跳转到支付密码页面
  toPassword: function () {
    var token = wx.getStorageSync('token')
    if (token) {
      wx.navigateTo({
        url: '/pages/paypassword/paypassword',
      })
    } else {
      wx.navigateTo({
        url: '/pages/invitationCode/invitationCode',
      })
    }
  },
  //邀请码
  showInviterCode: function () {
    var that = this;
    var token = wx.getStorageSync('token')
    if (token) {
      that.setData({
        showInviterCode: true
      })
    } else {
      wx.navigateTo({
        url: '/pages/invitationCode/invitationCode',
      })
    }
  },
  hideModal: function () {
    var that = this
    that.setData({
      showInviterCode: false
    })
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
    //首单分享
    that.getShareData()
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
    //账户资产数据
    app.Util.ajax('mall/personal/assets', null, 'GET').then((res) => {
      if (res.data.content) {
        that.setData({
          seedContent: res.data.content,
          noCashBackAmount: (res.data.content.noCashBackAmount+res.data.content.noWithdrawalAmount).toFixed(2),
          balance: (res.data.content.balance).toFixed(2),
          commissionBalance: (res.data.content.totalCommission).toFixed(2)
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
      url: '/packageB/pages/waitReentryDetail/waitReentryDetail'
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
    //弹窗浮窗
    if (wx.getStorageSync('token')) {
      that.floatAndPop()
    }
  },
  floatAndPop: function () {
    var that = this
    app.Util.ajax('mall/floatingWindow/navigation/queryNavigation', {
      pageNumber: 5 //我的
    }, 'GET').then((res) => {
      if (res.data.content) {
        let arr = res.data.content
        if(arr.length>0){
          for (let i = 0; i < arr.length; i++) {
            if (arr[i].navType == 1) {
              that.setData({
                popContent: arr[i],
                popShow: true
              })
            } else if (arr[i].navType == 2) {
              that.setData({
                floatContent: arr[i],
                floatShow: true
              })
            }
          }
        }else{
          that.setData({
            popShow: false,
            floatShow: false
          })
        }
      }
    })
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
  onShareAppMessage: function (res) {
    var that = this
    if (res.from == "button") {
      if (res.target.id === 'btn') {
        // 来自页面内转发按钮
        that.setData({
          showModalStatus1: false
        })
        wx.showTabBar()
        app.Util.ajax('mall/weChat/sharing/onSuccess', {
          mode: 16
        }, 'POST').then((res) => {
          if (res.data.content) {
            wx.showToast({
              title: '分享成功',
              icon: 'none'
            })
          }
        })
        return {
          title: that.data.shareList.desc,
          path: that.data.shareList.link,
          imageUrl: that.data.shareList.imageUrl,
          success: function (res) {

          },
          fail: function (res) {
            // 转发失败
            console.log("转发失败:" + JSON.stringify(res));
          }
        }
      } else if (res.target.id === 'btnGroup') {
        that.setData({
          showModalStatus1: false
        })
        wx.showTabBar()
        app.Util.ajax('mall/weChat/sharing/onSuccess', {
          mode: 16
        }, 'POST').then((res) => {
          if (res.data.content) {
            wx.showToast({
              title: '分享成功',
              icon: 'none'
            })
          } else {

          }
        })
        return {
          title: that.data.shareList.groupDesc,
          path: that.data.shareList.link,
          imageUrl: that.data.shareList.imageUrl,
        }
      }
    } else {
      return {
        path: "/pages/mine/mine?inviterCode=" + wx.getStorageSync('inviterCode'),
      }
    }
  },
  //下载APP弹窗(显示)
  downAppShow: function () {
    var token = wx.getStorageSync('token')
    if (token) {
      this.setData({
        downAppStatus: true
      })
    } else {
      wx.navigateTo({
        url: '/pages/invitationCode/invitationCode',
      })
    }
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
    this.returnInfo6()
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
      url: "/packageB/pages/waitReentryDetail/waitReentryDetail"
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
              returnContent2: i.userItems
            })
          }
        }
        if (that.data.waitReentry2 == false) {
          for (let i of res.data.content) {
            if (i.type == 3) {
              //转让取消消息
              that.setData({
                waitReentry: true,
                returnContent: i.userItems
              })
            }
          }
        }
        if (that.data.waitReentry == false) {
          for (let i of res.data.content) {
            if (i.type == 4) {
              //撤销消息
              that.setData({
                returnCanclePeople: true,
                returnContent3: i.userItems
              })
            }
          }
        }
        if (that.data.returnCanclePeople == false) {
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
            returnContent: i.userItems
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
  returnInfo6: function () {
    var that = this
    if (that.data.tempInfo.length > 0) {
      for (let i of that.data.tempInfo) {
        if (i.type == 4) {
          //转让取消消息
          that.setData({
            waitReentry: true,
            returnContent3: i.userItems
          })
        }
        console.log(that.data.returnContent3)
      }
      if (that.data.waitReentry == false) {
        for (let i of that.data.tempInfo) {
          if (i.type == 1) {
            //转让消息
            that.setData({
              returnCanclePeople: true,
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
  toSeed: function () {
    if (wx.getStorageSync("token")) {
      wx.navigateTo({
        url: "/packageA/pages/seed/seed"
      })
    } else {
      wx.navigateTo({
        url: '/pages/invitationCode/invitationCode',
      })
    }
  },
  column: function (e) {
    let that = this
    let columnTemp = e.currentTarget.dataset.index
    if (wx.getStorageSync("token")) {
      if (columnTemp == 1) {
        wx.navigateTo({
          url: '/packageA/pages/seedMask/seedMask',
        })
      } else if (columnTemp == 2) {
        that.setData({
          showModalStatus1: true
        })
        wx.hideTabBar()
      } else if (columnTemp == 3) {
        return;
      } else if (columnTemp == 4) {
        that.setData({
          oneShow: true
        })
      } else if (columnTemp == 5) {
        wx.navigateTo({
          url: '/packageA/pages/mentionPeriodIndex/mentionPeriodIndex',
        })
      }
      else if (columnTemp == 6) {
        wx.showToast({
          title: "暂未开放哦，敬请期待",
          icon: "none"
        })
      }
    } else {
      wx.navigateTo({
        url: '/pages/invitationCode/invitationCode',
      })
    }
  },
  cancelShare() {
    let that = this
    that.setData({
      showModalStatus1: false
    })
    wx.showTabBar()
  },
  cancelOneShow() {
    let that = this
    that.setData({
      oneShow: false
    })
  },
  returnCanclePeople: function () {
    var that = this
    that.setData({
      returnCanclePeople: false
    })
    that.returnInfo3()
  },
  toMerchantEntry: function () {
    wx.navigateTo({
      url: '/packageA/pages/storeEnter/storeEnter',
    })
  },
  topayAttention: function () {
    wx.navigateTo({
      url: '/packageA/pages/payAttention/payAttention',
    })
  },
  toDistributionAddress: function () {
    wx.navigateTo({
      url: '/packageA/pages/distributionAddress/distributionAddress',
    })
  },
  // 获取分享数据
  getShareData: function () {
    var that = this
    app.Util.ajax('mall/weChat/sharing/target', {
      mode: 18
    }, 'GET').then((res) => {
      if (res.data.messageCode = 'MSG_1001') {
        that.data.shareData = res.data.content
        // 产品图片路径转换为本地路径
        var imageUrl = res.data.content.imageShareUrl
        if (imageUrl) {
          wx.getImageInfo({
            src: imageUrl,
            success(res) {
              that.data.shareImg = res.path
              that.data.path_img = res.path
            }
          })
        }
        //邀请码转换为本地路径
        var imageUrl2 = res.data.content.appletQrCodeUrl
        if (imageUrl2) {
          wx.getImageInfo({
            src: imageUrl2,
            success(res) {
              that.data.appletQrCodeUrl = res.path
            }
          })
        }
        that.setData({
          shareList: res.data.content
        })
      }
    })
  },
  // 分享到朋友圈
  shareFriend: function () {
    var that = this
    var width
    var height
    wx.getSystemInfo({
      success(res) {
        width = res.screenWidth
        height = res.screenHeight
      }
    })
    var ctx = wx.createCanvasContext('mycanvas');
    var path_bg = '/assets/images/icon/bg.png'; //背景图片
    var path_bg2 = '/assets/images/icon/canvas_title.png';
    var path_logo = '/assets/images/icon/xuncaoji_icon.png'
    var path_partner = '/assets/images/icon/partner.png'
    var title = that.data.shareList.title
    var inviterCode = that.data.shareData.inviterCode
    console.log(title, inviterCode)
    //绘制图片模板的背景图片
    ctx.drawImage(path_bg, 0, 0, 0.88 * width, 0.89 * height);
    //绘制红色背景
    ctx.drawImage(path_bg2, 0, 0, 0.885 * width, 0.224 * height);
    // 绘制标题
    ctx.setFontSize(13);
    ctx.setFillStyle('#fff');
    ctx.setTextAlign("center")
    ctx.fillText(title, 0.442 * width, 25);
    ctx.stroke();
    // 绘制中间矩形
    ctx.beginPath()
    ctx.setFillStyle('#fff')
    ctx.setShadow(0, 0, 2, '#eee')
    ctx.fillRect(0.057 * width, 0.08 * height, 0.76 * width, 0.522 * height - 2)
    ctx.closePath()
    //绘制合伙人图标
    ctx.beginPath()
    ctx.drawImage(path_partner, 0.35 * width, 44, 64, 51);
    ctx.closePath()
    // 绘制邀请码
    if (inviterCode) {
      ctx.beginPath()
      ctx.setFontSize(19);
      ctx.setFillStyle('#F85A53');
      ctx.fillText(`我的邀请码:${inviterCode}`, 0.442 * width, 120);
      ctx.stroke();
      ctx.closePath()
    }
    // 绘制最小矩形
    ctx.beginPath()
    ctx.setFillStyle('#fff')
    ctx.setShadow(0, 0, 2, '#eee')
    ctx.fillRect(0.1308 * width, 130, 0.617 * width, 0.3 * height)
    ctx.closePath()
    // 绘制商品图片
    ctx.beginPath()
    ctx.drawImage(that.data.path_img, 0.1308 * width + 7, 137, 0.617 * width - 14, 0.3 * height - 14);
    ctx.closePath()
    // 绘制广告语
    ctx.beginPath()
    var adTips = that.data.shareList.imageDesc
    ctx.setFontSize(14);
    ctx.setFillStyle('#333333');
    ctx.setTextAlign("left")
    let chr = adTips.split('') // 分割为字符串数组
    let temp = ''
    let row = []
    for (let a = 0; a < chr.length; a++) {
      if (ctx.measureText(temp).width < 0.65 * width) {
        temp += chr[a]
      } else {
        a--
        row.push(temp)
        temp = ''
      }
    }
    row.push(temp)
    for (var b = 0; b < row.length; b++) {
      ctx.fillText(row[b], 0.1308 * width - 6, 0.565 * height - 4 + b * 20);
    }
    ctx.stroke();
    ctx.closePath()
    // 绘制二维码
    ctx.setShadow(0, 0, 0, '#fff')
    ctx.beginPath()
    ctx.drawImage(that.data.appletQrCodeUrl, 0.3 * width, 0.6075 * height - 2, 0.3 * width, 0.3 * width);
    ctx.closePath()
    // 绘制扫码提示
    ctx.beginPath()
    var codeTips = '长按图片识别二维码查看领取'
    ctx.setFontSize(12);
    ctx.setFillStyle('#999999');
    ctx.setTextAlign("center")
    ctx.fillText(codeTips, 0.44 * width, 0.787 * height - 2);
    ctx.stroke();
    ctx.closePath()
    ctx.draw()
    setTimeout(function () {
      wx.canvasToTempFilePath({
        canvasId: 'mycanvas',
        success: function (res) {
          that.data.haibaoImg = res.tempFilePath
        }
      })
    }, 1000)
    that.setData({
      showModalStatus1: false,
      haibao: true
    })
  },
  // 长按保存到相册
  handleLongPress: function () {
    var that = this
    var tempFilePath = that.data.haibaoImg
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
                    haibao: false
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
                            wx.hideLoading()
                            wx.showToast({
                              title: '保存成功',
                              icon: 'none'
                            });
                            that.setData({
                              haibao: false
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
                haibao: false
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
  // 关闭海报分享页面
  close_hb: function () {
    var that = this
    that.setData({
      haibao: false
    })
    wx.showTabBar()
  },
  closePop: function () {
    let that = this
    app.Util.ajax('mall/floatingWindow/navigation/userClick', {
      type: 1, //关闭
      id: that.data.popContent.id
    }, 'POST').then((res) => {
      if (res.data.messageCode == "MSG_1001") {
        that.setData({
          popShow: false
        })
      }
    })
  },
  closeFloat: function () {
    let that = this
    app.Util.ajax('mall/floatingWindow/navigation/userClick', {
      type: 1, //关闭
      id: that.data.floatContent.id
    }, 'POST').then((res) => {
      if (res.data.messageCode == "MSG_1001") {
        that.setData({
          floatShow: false
        })
      }
    })
  },
  toPages: function (e) {
    let that = this
    let tempContent = e.currentTarget.dataset.navtype == 1 ? that.data.popContent : that.data.floatContent
    let navtype = e.currentTarget.dataset.navtype
    app.Util.ajax('mall/floatingWindow/navigation/userClick', {
      type: 2, //跳转
      id: tempContent.id
    }, 'POST').then((res) => {
      if (res.data.messageCode == "MSG_1001") {
        if (navtype == 1) {
          that.setData({
            popShow: false
          })
        } else {
          that.setData({
            floatShow: false
          })
        }
      }
    })
    if (tempContent.category == 1) {
      if (tempContent.param == 1) {
        wx.navigateTo({
          url: '/packageA/pages/xuncaoji/xuncaoji',
        })
      } else if (tempContent.param == 2) {
        wx.navigateTo({
          url: '/packageB/pages/commission/commission',
        })
      } else if (tempContent.param == 3) {
        wx.navigateTo({
          url: '/packageB/pages/waitReentryDetail/waitReentryDetail',
        })
      } else if (tempContent.param == 4) {
        wx.navigateTo({
          url: '/pages/mine/personal/personal',
        })
      } else if (tempContent.param == 5) {
        wx.setStorageSync('params', 1)
        wx.navigateTo({
          url: '/pages/myorder/myorder?status=' + 0,
        })
      } else if (tempContent.param == 6) {
        wx.navigateTo({
          url: '/packageA/pages/myteam/myteam',
        })
      } else if (tempContent.param == 7) {
        wx.navigateTo({
          url: '/pages/index/cart/cart',
        })
      } else if (tempContent.param == 8) {

      } else if (tempContent.param == 9) {
        wx.navigateTo({
          url: '/pages/diamondPartner/diamondPartner',
        })
      } else if (tempContent.param == 10) {
        wx.navigateTo({
          url: '/packageA/pages/seed/seed',
        })
      } else if (tempContent.param == 11) {
        wx.navigateTo({
          url: '/packageB/pages/zeroBuy/zeroBuy?type=' + 2,
        })
      } else if (tempContent.param == 12) {
        wx.navigateTo({
          url: '/packageB/pages/zeroBuy/zeroBuy?type=' + 1,
        })
      } else if (tempContent.param == 13) {
        wx.navigateTo({
          url: '/packageB/pages/zeroBuy/zeroBuy?type=' + 4,
        })
      } else if (tempContent.param == 14) {
        wx.navigateTo({
          url: '/packageB/pages/freeBuy/freeBuy',
        })
      } else if (tempContent.param == 15) {
        wx.navigateTo({
          url: '/packageB/pages/wishpool/wishpool',
        })
      } else if (tempContent.param == 16) {
        wx.navigateTo({
          url: '/pages/cityPartner/cityPartner',
        })
      } else if (tempContent.param == 17) {
        wx.navigateTo({
          url: '/pages/byStages/byStages',
        })
      } else if (tempContent.param == 18) {
        wx.navigateTo({
          url: '/pages/sponsor/sponsor',
        })
      } else if (tempContent.param == 19) {
        wx.navigateTo({
          url: '/packageA/pages/mentionPeriodIndex/mentionPeriodIndex',
        })
      } else if (tempContent.param == 20) {
        wx.navigateTo({
          url: '/packageA/pages/allStore/allStore',
        })
      } else if (tempContent.param == 21) {
        wx.navigateTo({
          url: '/packageA/pages/guidePage/guidePage',
        })
      } else if (tempContent.param == 22) {
        let token = wx.getStorageSync('token')
        if (token) {
          wx.navigateTo({
            url: '/packageA/pages/hero/hero',
          })
        } else {
          wx.navigateTo({
            url: "/pages/invitationCode/invitationCode"
          })
        }
      } else if (tempContent.param == 23) {
        wx.navigateTo({
          url: '/packageA/pages/profitDetail/profitDetail',
        })
      } else if (tempContent.param == 24) {
        wx.switchTab({
          url: '/pages/index/index',
        })
      } else if (tempContent.param == 25) {
        wx.navigateTo({
          url: '/packageA/pages/payAttention/payAttention',
        })
      } else if (tempContent.param == 26) {
        //订单交易-全部
        wx.switchTab({
          url: '/pages/forum/forum',
        })
        app.globalData.type = 10
      } else if (tempContent.param == 27) {
        //订单交易-关注
        if (wx.getStorageSync('token')) {
          wx.switchTab({
            url: '/pages/forum/forum',
          })
          app.globalData.type = 6
        } else {
          wx.navigateTo({
            url: `/pages/invitationCode/invitationCode?inviterCode=${that.data.inviterCode}`,
          })
        }
      } else if (tempContent.param == 28) {
        //订单交易-返现交易
        wx.switchTab({
          url: '/pages/forum/forum',
        })
        app.globalData.type = 7
      } else if (tempContent.param == 29) {
        //订单交易-商品交易
        wx.switchTab({
          url: '/pages/forum/forum',
        })
        app.globalData.type = 8
      } else if (tempContent.param == 30) {
        //订单交易-提期
        wx.switchTab({
          url: '/pages/forum/forum',
        })
        app.globalData.type = 5
      } else if (tempContent.param == 31) {
        //订单交易-普通贴
        wx.switchTab({
          url: '/pages/forum/forum',
        })
        app.globalData.type = 9
      } else if (tempContent.param == 32) {
        wx.navigateTo({
          url: '/packageA/pages/seed/seed?status=1',
        })
      } else if (tempContent.param == 33) {
        wx.navigateTo({
          url: '/packageA/pages/seedRecharge/seedRecharge',
        })
      }
    } else if (tempContent.category == 2) {
      wx.navigateTo({
        url: '/pages/detail/detail?id=' + tempContent.param + '&&status=' + tempContent.status,
      })
    } else if (tempContent.category == 3) {
      if (tempContent.paramExt == 1) {
        wx.navigateTo({
          url: `/pages/oneList/oneList?id=${tempContent.param}&name=${tempContent.pageName}`,
        })
      } else if (tempContent.paramExt == 2) {
        wx.navigateTo({
          url: `/pages/index/twolist/twolist?id=${tempContent.param}&name=${tempContent.pageName}`,
        })
      }
    } else if (tempContent.category == 4) {
      wx.navigateTo({
        url: `/pages/longActivity/longActivity?id=${tempContent.param}`,
      })
    } else if (tempContent.category == 5) {
      wx.navigateTo({
        url: `/pages/commodityArea/commodityArea?id=${tempContent.param}`,
      })
    } else if (tempContent.category == 6) {
      wx.navigateTo({
        url: `/pages/h5Page/h5Page?srcItem=${tempContent.paramExt}`,
      })
    } else if (tempContent.category == 7) {
      if (e.currentTarget.dataset.storetype == 1) {
        wx.navigateTo({
          url: `/packageA/pages/ecommerceStore/ecommerceStore?id=${tempContent.param}`,
        })
      } else {
        wx.navigateTo({
          url: `/packageA/pages/takeoutHomeage/takeoutHomeage?storeId=${tempContent.param}`,
        })
      }
    } else if (tempContent.category == 8) {
      wx.navigateTo({
        url: `/packageB/pages/nearbyStore/nearbyStore?id=${tempContent.param}`,
      })
    }
  }
})