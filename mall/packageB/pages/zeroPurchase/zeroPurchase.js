// pages/zeroPurchase/zeroPurchase.js
var time = require('../../../utils/util.js');
let app = getApp()
var selectIndex; //选择的大规格key
var attrIndex; //选择的小规格的key
var selectAttrid = []; //选择的属性id
Page({

  /**
   * 页面的初始数据
   */
  data: {
    autoplay: true,
    circular: true,
    interval: 2000,
    duration: 1000,
    goodsId: 1, //商品id
    imageUrls: [], //轮播图
    detail: {}, //详情
    spec: [],
    iconUrl: {},
    stockDetail: {},
    stockDetail1: {},
    selectAttrid: [], //选择的属性id
    selectName: '', //已选规格
    selectNameArr: [], //已选规格
    activeIndex: '', //选中返现的index
    comment: [], //商品评论
    pageNumber: 1,
    pageSize: 20,
    shareList: {}, //分享数据
    introductions: [], //店铺详情
    showModalStatus: false, //规格弹框
    showModalStatus1: false, //分享弹框
    showMask: false, //关注公众号弹框
    inputValue1: '', //验证码
    show: false, //购买后一次需要的弹框
    hours: '', //小时
    minutes: '', //分钟
    seconds: '', //秒
    haoSeconds: '', //毫秒
    current: 0, //当前轮播图索引
    inviterCode: '',
    haibao: false,
    appletQrCodeUrl: '', //邀请码路径
    haibaoImg: '', //生成的海报
    shareImg: '',
    allGoodsStock: 0,
    btnText: '免费领取', //按钮名字
    message: '', //通知消息
    type: null, //活动类型
    mode: null, //分享朋友圈
    card: false,
    stopStatus: 1,
    hostUrl: app.Util.getUrlImg().hostUrl,
  },
  //求当前轮播图的索引
  countIndex: function (e) {
    this.setData({
      current: e.detail.current
    })
  },
  imgYu: function (e) {
    var src = e.currentTarget.dataset.src; //获取data-src
    var imgList = e.currentTarget.dataset.list; //获取data-list
    //图片预览
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: imgList // 需要预览的图片http链接列表
    })
  },
  commentYu: function (e) {
    var src = e.currentTarget.dataset.src; //获取data-src
    var imgList = e.currentTarget.dataset.list; //获取data-list
    //图片预览
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: imgList // 需要预览的图片http链接列表
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.setData({
      goodsId: options.id,
      type: options.type,
      orgPrice: options.orgPrice,
    })
    if (options.text) {
      that.setData({
        btnText: options.text
      })
    } else {
      that.setData({
        btnText: '免费领取'
      })
    }
    if(that.data.btnText == '一元包邮领取'){
      wx.setNavigationBarTitle({
        title: '合作商渠道',
      })
    }else{
      wx.setNavigationBarTitle({
        title: '新品体验',
      })
    }
    if (that.data.type == 1) {
      that.setData({
        message: '成功邀请好友一起来拿可多得一次免费体验机会哟'
      })
    } else if (that.data.type == 2) {
      that.setData({
        message: '微信支付时，请在支付方式内选择信用卡支付，其他方式支付自动退款。'
      })
    } else if (that.data.type == 3) {
      that.setData({
        message: ''
      })
    }
    //添加商品id缓存
    if (!wx.getStorageSync('token')) {
      wx.setStorage({
        key: "zeroGoods_id",
        data: parseInt(options.id)
      })
      wx.setStorage({
        key: "type",
        data: parseInt(options.type)
      })
      wx.setStorage({
        key: "orgPrice",
        data: parseInt(options.orgPrice)
      })
    }

    if (options.inviterCode) {
      that.data.inviterCode = options.inviterCode
    }
    //查询商品详情
    that.getDetailData();
    //商品评论
    that.comment();
  },
  //查询商品详情
  getDetailData: function () {
    var that = this
    app.Util.ajax(`mall/home/activity/freeShopping/goodsDetail?id=${that.data.goodsId}&type=${that.data.type}`, null, 'GET').then((res) => {
      if (res.data.content) {
        var current = res.data.content.remainingTime
        that.formatDuring(current)
        let interval2 = setInterval(() => {
          if (current > 0) {
            current -= 50
            that.formatDuring(current)
          } else {
            clearInterval(interval2)
            that.setData({
              hours: '', //小时
              minutes: '', //分钟
              seconds: '', //秒
              haoSeconds: '', //毫秒
            })
          }
        }, 50)
        that.setData({
          imageUrls: res.data.content.goodsItem.imageUrls,
          detail: res.data.content,
          spec: res.data.content.goodsItem.specs,
          stockDetail: res.data.content.goodsItem.stockDetail,
          iconUrl: res.data.content.goodsItem.specs[0].items[0].iconUrl,
          introductions: res.data.content.goodsItem.introductions.length ? res.data.content.goodsItem.introductions : []
        })
        for (var i = 0; i < that.data.spec.length; i++) {
          let items = that.data.spec[i].items
          items[0]['isSelect'] = true
        }
        var name = [];
        for (var a = 0; a < that.data.spec.length; a++) {
          for (var b = 0; b < that.data.spec[a].items.length; b++) {
            if (that.data.spec[a].items[b].isSelect == true) {
              name.push(that.data.spec[a].items[b].name)
              that.setData({
                selectNameArr: name,
                selectName: name.join('/')
              })
            }
          }
        }
        that.setData({
          spec: that.data.spec
        })
        //初始化规格选择
        var spec = that.data.spec
        var size = spec.length;
        var index = 0;
        var selectAttridstr1 = [];
        var allGoodsStock = 0;
        for (var i = 0; i < size; i++) {
          selectAttridstr1.push(spec[i].items[0].id)
        }
        that.setData({
          selectAttridStr: selectAttridstr1,
        });
        for (let i in that.data.stockDetail) {
          var selectAttridStr = that.data.selectAttridStr
          allGoodsStock = parseFloat((allGoodsStock + that.data.stockDetail[i].quantity).toFixed(0))
          that.data.stockDetail[i].dctPrice = parseFloat((that.data.stockDetail[i].dctPrice).toFixed(2))
          if (selectAttridStr == i) {
            that.setData({
              stockDetail1: that.data.stockDetail[i],
              cashbackId: that.data.stockDetail[i].cashbackItems ? that.data.stockDetail[i].cashbackItems[0].cashbackId : '',
              activeIndex: 0,
            })
          }
        }
        that.setData({
          allGoodsStock: allGoodsStock
        })
        // app.Util.ajax('mall/home/activity/freeShopping/placeOrder/validate', {
        //   stockId: that.data.stockDetail1.stockId
        // }, 'POST').then((res) => { // 使用ajax函数
        //   if (res.data.content) {
        //     if (res.data.content.status === 2) {
        //       if (that.data.btnText == '进入公众号免费拿') {
        //         that.setData({
        //           show: false
        //         })
        //       } else {
        //         that.setData({
        //           show: true
        //         })
        //       }
        //     }
        //   }
        // })
      } else {
        wx.showToast({
          title: res.data.message,
          icon: 'none',
          duration: 1500
        })
      }
    })
  },
  formatDuring(mss) {
    var that = this
    const hours = parseInt(mss / (1000 * 60 * 60)).toString().slice(0, 2) >= 10 ? parseInt(mss / (1000 * 60 * 60)).toString().slice(0, 2) : '0' + parseInt(mss / (1000 * 60 * 60)).toString().slice(0, 2)
    const minutes = parseInt((mss % (1000 * 60 * 60)) / (1000 * 60)).toString() >= 10 ? parseInt((mss % (1000 * 60 * 60)) / (1000 * 60)).toString() : '0' + parseInt((mss % (1000 * 60 * 60)) / (1000 * 60)).toString()
    const seconds = parseInt((mss % (1000 * 60)) / 1000).toString() >= 10 ? parseInt((mss % (1000 * 60)) / 1000).toString() : '0' + parseInt((mss % (1000 * 60)) / 1000).toString()
    const haoSeconds = parseInt((mss % (60))).toString() >= 10 ? parseInt((mss % (60))).toString() : '0' + parseInt((mss % (60))).toString()
    that.setData({
      hours: hours,
      minutes: minutes,
      seconds: seconds,
      haoSeconds: haoSeconds
    })
  },
  //选中返现
  clickCashback: function (e) {
    var that = this
    var id = e.currentTarget.dataset.id
    var cur = e.currentTarget.dataset.gindex
    that.setData({
      cashbackId: id,
      activeIndex: cur,
      cashMoney: e.currentTarget.dataset.total
    })
  },
  //选择规格index值
  specIndex: function (e) {
    var that = this
    var index = e.currentTarget.dataset.index
    var selectAttridStr = that.data.selectAttridStr
    selectAttridStr[index] = that.data.selectAttrid
    if (!that.data.stockDetail[selectAttridStr]) {
      return;
    }
    // 计算当前商品返现金额
    that.setData({
      stockDetail1: that.data.stockDetail[selectAttridStr],
      quantity: that.data.stockDetail[selectAttridStr].quantity,
      cashMoney: that.data.stockDetail[selectAttridStr].cashbackItems ? that.data.stockDetail[selectAttridStr].cashbackItems[0].totalAmount : '',
      cashbackId: that.data.stockDetail[selectAttridStr].cashbackItems ? that.data.stockDetail[selectAttridStr].cashbackItems[0].cashbackId : '',
    })
  },
  //选中规格
  clickAttr: function (e) {
    var that = this
    var selectIndex = e.currentTarget.dataset.selectIndex; //选择大规格的id
    var attrIndex = e.currentTarget.dataset.attrIndex;
    var name = e.currentTarget.dataset.name;
    var spec = that.data.spec;
    var count = spec[selectIndex].items.length;
    //已选
    that.data.selectNameArr[selectIndex] = e.currentTarget.dataset.name
    that.setData({
      selectName: that.data.selectNameArr.join('/'),
    })
    for (var i = 0; i < count; i++) {
      spec[selectIndex].items[i].isSelect = false;
    }
    spec[selectIndex].items[attrIndex].isSelect = true;
    if (spec[selectIndex].items[attrIndex].isSelect == true) {
      if (spec[selectIndex].items[attrIndex].iconUrl) {
        that.setData({
          iconUrl: spec[selectIndex].items[attrIndex].iconUrl
        })
      }
    }
    var attrid = spec[selectIndex].items[attrIndex].id;
    selectAttrid[selectIndex] = attrid;
    that.setData({
      spec: spec, //变换选择框,
      selectAttrid: e.currentTarget.dataset.attrId,
    })
    for (let i in that.data.stockDetail) {
      if (that.data.selectAttridStr == i) {
        that.setData({
          cashbackId: that.data.stockDetail[i].cashbackItems ? that.data.stockDetail[i].cashbackItems[0].cashbackId : ''
        })
      }
    }
  },
  //正常的提交订单
  zeroButton: function (e) {
    var that = this
    var activityGoodsId = e.currentTarget.dataset.activitygoodsid
    var goodsId = e.currentTarget.dataset.goodsid
    var stockId = e.currentTarget.dataset.stockid
    wx.navigateTo({
      url: `/pages/placeorder/placeorder?activityGoodsId=${activityGoodsId}&goodsId=${goodsId}&stockId=${stockId}&type=${that.data.type}`
    })
    that.setData({
      showModalStatus: false
    })
  },
  //查询分享数据
  chooseShare: function () {
    var that = this
    if (that.data.type == 1) {
      app.Util.ajax('mall/weChat/sharing/target', {
        mode: 2,
        type: that.data.type,
        targetId: that.data.goodsId
      }, 'GET').then((res) => {
        if (res.data.messageCode == 'MSG_1001') {
          var inviterCode = wx.getStorageSync('inviterCode')
          console.log(res.data.content.link)
          if (inviterCode) {
            res.data.content.link = res.data.content.link.replace(/{inviterCode}/g, inviterCode)
          } else {
            res.data.content.link = res.data.content.link.replace(/{inviterCode}/g, '')
          }
          //下载线上图片到本地，用于绘制分享图片
          wx.downloadFile({
            url: res.data.content.imageUrl,
            success: function (res) {
              that.setData({
                share: res.tempFilePath
              })
            },
            fail: function (res) { }
          })
          that.setData({
            shareList: res.data.content,
          })
        }
      })
    } else if (that.data.type == 2) {
      app.Util.ajax('mall/weChat/sharing/target', {
        mode: 7,
        type: that.data.type,
        targetId: that.data.goodsId
      }, 'GET').then((res) => {
        if (res.data.messageCode == 'MSG_1001') {
          var inviterCode = wx.getStorageSync('inviterCode')
          if (inviterCode) {
            res.data.content.link = res.data.content.link.replace(/{inviterCode}/g, inviterCode)
          } else {
            res.data.content.link = res.data.content.link.replace(/{inviterCode}/g, '')
          }
          //下载线上图片到本地，用于绘制分享图片
          wx.downloadFile({
            url: res.data.content.imageUrl,
            success: function (res) {
              that.setData({
                share: res.tempFilePath
              })
            },
            fail: function (res) { }
          })
          that.setData({
            shareList: res.data.content,
          })
        }
      })
    } else if (that.data.type == 3) {
      app.Util.ajax('mall/weChat/sharing/target', {
        mode: 9,
        type: that.data.type,
        targetId: that.data.goodsId
      }, 'GET').then((res) => {
        if (res.data.messageCode == 'MSG_1001') {
          res.data.content.link = res.data.content.link.replace(/{inviterCode}/g, app.globalData.cooperateInvitionCode)
          //下载线上图片到本地，用于绘制分享图片
          wx.downloadFile({
            url: res.data.content.imageUrl,
            success: function (res) {
              that.setData({
                share: res.tempFilePath
              })
            },
            fail: function (res) { }
          })
          that.setData({
            shareList: res.data.content,
          })
        }
      })
    } else if (that.data.type == 4) {
      app.Util.ajax('mall/weChat/sharing/target', {
        mode: 12,
        type: that.data.type,
        targetId: that.data.goodsId
      }, 'GET').then((res) => {
        if (res.data.messageCode == 'MSG_1001') {
          var inviterCode = wx.getStorageSync('inviterCode')
          console.log(res.data)
          if (inviterCode) {
            res.data.content.link = res.data.content.link.replace(/{inviterCode}/g, inviterCode)
          } else {
            res.data.content.link = res.data.content.link.replace(/{inviterCode}/g, '')
          }
          //下载线上图片到本地，用于绘制分享图片
          wx.downloadFile({
            url: res.data.content.imageUrl,
            success: function (res) {
              that.setData({
                share: res.tempFilePath
              })
            },
            fail: function (res) { }
          })
          that.setData({
            shareList: res.data.content,
          })
        }
      })
    }

  },
  //取消分享弹框
  cancelShare: function () {
    var that = this
    that.setData({
      showModalStatus1: false
    })
  },
  //商品评论
  comment: function () {
    var that = this
    app.Util.ajax('mall/interact/queryUserInteract', {
      pageNumber: that.data.pageNumber,
      pageSize: that.data.pageSize,
      goodsId: that.data.goodsId
    }, 'GET').then((res) => {
      if (res.messageCode = 'MSG_1001') {
        if (res.data.content.items.length > 0) {
          res.data.content.items[0].createTime = time.formatTimeTwo(res.data.content.items[0].createTime, 'Y-M-D h:m:s')
        }
        that.setData({
          goodInteractRate: res.data.content.goodInteractRate,
          comment: res.data.content.items
        })
      }
    })
  },
  //跳转到评价页面
  jumpEvaluate: function (e) {
    var goodsId = e.currentTarget.dataset.goodsid
    wx.navigateTo({
      url: `/pages/evaluate/evaluate?goodsId=${goodsId}`
    })
  },
  know: function () {
    this.setData({
      card: false,
      showModalStatus: true
    })
  },
  //一进页面底部0元购按钮
  toPlaceorder: function (e) {
    var that = this
    var type = that.data.type
    if (that.data.btnText === '免费领取' || that.data.btnText === '一元包邮领取') {
      var activityGoodsId = e.currentTarget.dataset.activitygoodsid
      var goodsId = e.currentTarget.dataset.goodsid
      var stockId = e.currentTarget.dataset.stockid
      var token = wx.getStorageSync('token')
      console.log("token:" + token)
      if (token) {
        app.Util.ajax('mall/home/activity/freeShopping/placeOrder/validate', {
          stockId: stockId,
          type: that.data.type
        }, 'POST').then((res) => { // 使用ajax函数
          if (res.data.content) {
            if (res.data.content.status === 1) {
              if (that.data.type == 2) {
                var tempCard = wx.getStorageSync('cardStatus')
                if (tempCard == 1) {
                  that.setData({
                    showModalStatus: true
                  })
                } else {
                  //信用卡活动弹窗已提示
                  wx.setStorageSync('cardStatus', 1)
                  that.setData({
                    card: true,
                    stopStatus: 1
                  })
                  setTimeout(function () {
                    that.setData({
                      stopStatus: 2
                    })
                  }, 5000)
                }

              } else {
                that.setData({
                  showModalStatus: true
                })
              }
            } else if (res.data.content.status === 2) {
              that.setData({
                show: true
              })
              app.Util.ajax('mall/weChat/sharing/target', {
                mode: 2,
                targetId: that.data.goodsId
              }, 'GET').then((res) => {
                if (res.data.content) {
                  var inviterCode = wx.getStorageSync('inviterCode')
                  if (inviterCode) {
                    res.data.content.link = res.data.content.link.replace(/{inviterCode}/g, inviterCode)
                  } else {
                    res.data.content.link = res.data.content.link.replace(/{inviterCode}/g, '')
                  }
                  that.setData({
                    shareList: res.data.content
                  })
                }
              })
            }
          } else {
            wx.showToast({
              title: res.data.message,
              icon: 'none',
              duration: 1500
            })
          }
        })
      } else {
        if (that.data.type == 1 || that.data.type == 2) {
          wx.navigateTo({
            url: '/pages/invitationCode/invitationCode?inviterCode=' + that.data.inviterCode,
          })
        } else if (that.data.type == 3) {
          wx.navigateTo({
            url: '/pages/invitationCode/invitationCode?type=3',
          })
        }
      }
    } else if (that.data.btnText === '进入公众号免费拿') {
      that.setData({
        showMask: true
      })
    }
  },
  //保存公众号二维码图片到相册
  saveImg: function () {
    var that = this
    var tempFilePath = '/assets/images/icon/code.png'
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
                    showMask: false
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
                              showMask: false
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
                showMask: false
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
  //关闭公众号弹窗
  show: function () {
    var that = this
    that.setData({
      showMask: false
    })
  },
  //关闭弹窗
  hideModal: function () {
    var that = this
    that.setData({
      showModalStatus: false
    })
  },
  //关闭分享弹框
  cancelShow: function () {
    var that = this
    that.setData({
      show: false
    })
  },
  cancelShare: function () {
    this.setData({
      showModalStatus1: false
    })
  },
  // 点击右上方红色的分享按钮
  shares: function () {
    //查询分享数据
    this.chooseShare();
    this.setData({
      showModalStatus1: true
    })
  },
  // 取消分享
  cancelShare: function () {
    this.setData({
      showModalStatus1: false
    })
  },
  //分享朋友圈
  shareFriend: function () {
    var that = this
    if (that.data.type == 1) {
      that.setData({
        mode: 2
      })
    } else if (that.data.type == 2) {
      that.setData({
        mode: 7
      })
    } else if (that.data.type == 3) {
      that.setData({
        mode: 9
      })
    } else if (that.data.type == 4) {
      that.setData({
        mode: 12
      })
    }
    wx.showLoading({
      title: '加载中',
    })
    app.Util.ajax('mall/weChat/sharing/target', {
      mode: that.data.mode,
      type: that.data.type,
      targetId: that.data.goodsId
    }, 'GET').then((res) => {
      if (res.data.messageCode == 'MSG_1001') {
        var cashBack = res.data.content.cashBack
        var desc = res.data.content.desc
        var participants = res.data.content.participants
        var inviterCode = res.data.content.inviterCode
        var price = res.data.content.price
        var appletQrCodeUrl = res.data.content.appletQrCodeUrl
        //邀请码转换为本地路径
        wx.getImageInfo({
          src: appletQrCodeUrl,
          success(res) {
            appletQrCodeUrl = res.path
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
              ctx.fillText(`我的邀请码：${inviterCode}`, 0.442 * width, 120);
              ctx.stroke();
              ctx.closePath()
            }
            // 绘制最小矩形
            ctx.beginPath()
            ctx.setFillStyle('#fff')
            ctx.setShadow(0, 0, 2, '#eee')
            ctx.fillRect(0.1308 * width, 130, 0.617 * width, 0.3 * height)
            ctx.closePath()
            // 绘制商品图片(图片错误)
            ctx.beginPath()
            ctx.drawImage(that.data.share, 0.1308 * width + 7, 137, 0.617 * width - 14, 0.3 * height - 14);
            ctx.closePath()
            //绘制免费领取按钮
            // ctx.beginPath()
            // ctx.drawImage('/assets/images/icon/-s-btn.png', 0.1308 * width + 35, 0.273 * height + 105, 0.517 * width - 35, 24);
            // ctx.closePath()
            // 绘制参与人数
            // ctx.beginPath()
            // var number = `参与人数：${participants}`
            // var textWidth = inviterCode ? ctx.measureText(number).width : ctx.measureText(number).width + 50
            // ctx.setFillStyle('#F5BA2C');
            // ctx.moveTo(0.1308 * width, 174)
            // ctx.lineTo(0.1308 * width, 180)
            // ctx.lineTo(0.1308 * width - 10, 174)
            // ctx.lineTo(0.1308 * width - 10, 150)
            // ctx.lineTo(0.1308 * width + textWidth / 2 + 22, 150)
            // ctx.lineTo(0.1308 * width + textWidth / 2 + 22, 174)
            // ctx.lineTo(0.1308 * width - 10, 174)
            // ctx.arc(0.1308 * width + textWidth / 2 + 22, 162, 12, 1.5 * Math.PI, 0.5 * Math.PI, false)
            // ctx.closePath()
            // ctx.fill()
            // ctx.beginPath()
            // ctx.setFontSize(12);
            // ctx.setFillStyle('#fff');
            // ctx.setTextAlign("left")
            // ctx.fillText(number, 0.1308 * width, 167);
            // ctx.stroke();
            // ctx.closePath();
            // 绘制价格
            ctx.beginPath()
            price = `¥${price}`
            ctx.setFontSize(16);
            ctx.setFillStyle('#F85A53');
            ctx.setTextAlign("left")
            ctx.fillText(price, 0.1308 * width, 0.525 * height - 4);
            ctx.stroke();
            ctx.closePath()
            ctx.beginPath()
            // 绘制参与返
            ctx.setFillStyle('#F85A53');
            ctx.setStrokeStyle('#F85A53')
            var textWidth = ctx.measureText(`参与返¥ ${cashBack}`).width
            var textWidth2 = ctx.measureText(price).width
            ctx.moveTo(0.1 * width + textWidth2 + 24 - 6, 0.525 * height - 8)
            ctx.lineTo(0.1 * width + textWidth2 + 24, 0.525 * height - 12)
            ctx.lineTo(0.1 * width + textWidth2 + 24, 0.525 * height - 20)
            ctx.lineTo(0.1 * width + textWidth2 + 24 + textWidth / 2 + 32, 0.525 * height - 20)
            ctx.lineTo(0.1 * width + textWidth2 + 24 + textWidth / 2 + 32, 0.525 * height + 4)
            ctx.lineTo(0.1 * width + textWidth2 + 24, 0.525 * height + 4)
            ctx.lineTo(0.1 * width + textWidth2 + 24, 0.525 * height - 2)
            ctx.lineTo(0.1 * width + textWidth2 + 24 - 6, 0.525 * height - 8)
            ctx.closePath()
            ctx.fill()
            // 绘制参与返价格
            cashBack = `参与返¥ ${cashBack}`
            ctx.beginPath()
            ctx.setFontSize(12);
            ctx.setFillStyle('#fff');
            ctx.setTextAlign("left")
            ctx.fillText(cashBack, 0.1 * width + textWidth2 + 28, 0.525 * height - 4);
            ctx.stroke();
            ctx.closePath()
            // 绘制广告语
            ctx.beginPath()
            var adTips = desc
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
            ctx.drawImage(appletQrCodeUrl, 0.3 * width, 0.6075 * height - 2, 0.3 * width, 0.3 * width);
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
            wx.hideLoading()
          }
        })
      } else if (res.data.messageCode == 'MSG_4001') {
        wx.showToast({
          title: res.data.message,
          icon: 'none',
          duration: 2000
        })
      }
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

                            that.setData({
                              downAppStatus: false
                            });

                            wx.hideLoading()
                            wx.showToast({
                              title: '保存成功'
                            });
                          },
                          fail(res) {
                            wx.hideLoading()
                            console.log(res);

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
  //关闭海报分享页面
  close_hb: function () {
    var that = this
    that.setData({
      haibao: false
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
    var temp = app.globalData.creditCard
    if (temp == 1) {
      that.setData({
        showModalStatus: true
      })
    }
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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (ops) {
    var that = this
    if (ops.from === 'button') {
      if (ops.target.id === 'btn') {
        that.setData({
          showModalStatus1: false
        })
        if (that.data.type == 1) {
          app.Util.ajax('mall/weChat/sharing/onSuccess', {
            mode: 2
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
            title: that.data.shareList.desc,
            path: `/packageB/pages/zeroPurchase/zeroPurchase?inviterCode=${wx.getStorageSync('inviterCode')}&type=${that.data.type}&id=${that.data.goodsId}&orgPrice=${that.data.orgPrice}&text=${that.data.btnText}`,
            imageUrl: that.data.shareList.imageUrl,
          }
        } else if (that.data.type == 2) {
          app.Util.ajax('mall/weChat/sharing/onSuccess', {
            mode: 7
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
            title: that.data.shareList.desc,
            path: `/packageB/pages/zeroPurchase/zeroPurchase?inviterCode=${wx.getStorageSync('inviterCode')}&type=${that.data.type}&id=${that.data.goodsId}&orgPrice=${that.data.orgPrice}&text=${that.data.btnText}`,
            imageUrl: that.data.shareList.imageUrl,
          }
        } else if (that.data.type == 3) {
          app.Util.ajax('mall/weChat/sharing/onSuccess', {
            mode: 9
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
            title: that.data.shareList.desc,
            path: `/pages/zeroPurchase/zeroPurchase?inviterCode=${wx.getStorageSync('inviterCode')}&type=${that.data.type}&id=${that.data.goodsId}&orgPrice=${that.data.orgPrice}&text=${that.data.btnText}`,
            imageUrl: that.data.shareList.imageUrl,
          }
        } else if (that.data.type == 4) {
          app.Util.ajax('mall/weChat/sharing/onSuccess', {
            mode: 12
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
            title: that.data.shareList.desc,
            path: `/packageB/pages/zeroPurchase/zeroPurchase?inviterCode=${wx.getStorageSync('inviterCode')}&type=${that.data.type}&id=${that.data.goodsId}&orgPrice=${that.data.orgPrice}&text=${that.data.btnText}`,
            imageUrl: that.data.shareList.imageUrl,
          }
        }
      } else if (ops.target.id === 'btnGroup') {
        that.setData({
          showModalStatus1: false
        })
        if (that.data.type == 1) {
          app.Util.ajax('mall/weChat/sharing/onSuccess', {
            mode: 2
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
            path: `/packageB/pages/zeroPurchase/zeroPurchase?inviterCode=${wx.getStorageSync('inviterCode')}&type=${that.data.type}&id=${that.data.goodsId}&orgPrice=${that.data.orgPrice}&text=${that.data.btnText}`,
            imageUrl: that.data.shareList.imageUrl,
          }
        } else if (that.data.type == 2) {
          app.Util.ajax('mall/weChat/sharing/onSuccess', {
            mode: 7
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
            path: `/packageB/pages/zeroPurchase/zeroPurchase?inviterCode=${wx.getStorageSync('inviterCode')}&type=${that.data.type}&id=${that.data.goodsId}&orgPrice=${that.data.orgPrice}&text=${that.data.btnText}`,
            imageUrl: that.data.shareList.imageUrl,
          }
        } else if (that.data.type == 3) {
          app.Util.ajax('mall/weChat/sharing/onSuccess', {
            mode: 9
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
            path: `/packageB/pages/zeroPurchase/zeroPurchase?inviterCode=${wx.getStorageSync('inviterCode')}&type=${that.data.type}&id=${that.data.goodsId}&orgPrice=${that.data.orgPrice}&text=${that.data.btnText}`,
            imageUrl: that.data.shareList.imageUrl
          }
        } else if (that.data.type == 4) {
          app.Util.ajax('mall/weChat/sharing/onSuccess', {
            mode: 12
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
            path: `/packageB/pages/zeroPurchase/zeroPurchase?inviterCode=${wx.getStorageSync('inviterCode')}&type=${that.data.type}&id=${that.data.goodsId}&orgPrice=${that.data.orgPrice}&text=${that.data.btnText}`,
            imageUrl: that.data.shareList.imageUrl
          }
        }
      }
    } else {
      if (that.data.type == 1) {
        app.Util.ajax('mall/weChat/sharing/onSuccess', {
          mode: 2
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
          title: that.data.shareList.desc,
          path: `/packageB/pages/zeroPurchase/zeroPurchase?inviterCode=${wx.getStorageSync('inviterCode')}&type=${that.data.type}&id=${that.data.goodsId}&orgPrice=${that.data.orgPrice}&text=${that.data.btnText}`,
          imageUrl: that.data.shareList.imageUrl,
        }
      } else if (that.data.type == 2) {
        app.Util.ajax('mall/weChat/sharing/onSuccess', {
          mode: 7
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
          title: that.data.shareList.desc,
          path: `/packageB/pages/zeroPurchase/zeroPurchase?inviterCode=${wx.getStorageSync('inviterCode')}&type=${that.data.type}&id=${that.data.goodsId}&orgPrice=${that.data.orgPrice}&text=${that.data.btnText}`,
          imageUrl: that.data.shareList.imageUrl,
        }
      } else if (that.data.type == 3) {
        app.Util.ajax('mall/weChat/sharing/onSuccess', {
          mode: 9
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
          title: that.data.shareList.desc,
          path: `/packageB/pages/zeroPurchase/zeroPurchase?inviterCode=${wx.getStorageSync('inviterCode')}&type=${that.data.type}&id=${that.data.goodsId}&orgPrice=${that.data.orgPrice}&text=${that.data.btnText}`,
          imageUrl: that.data.shareList.imageUrl,
        }
      } else if (that.data.type == 4) {
        app.Util.ajax('mall/weChat/sharing/onSuccess', {
          mode: 12
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
          title: that.data.shareList.desc,
          path: `/packageB/pages/zeroPurchase/zeroPurchase?inviterCode=${wx.getStorageSync('inviterCode')}&type=${that.data.type}&id=${that.data.goodsId}&orgPrice=${that.data.orgPrice}&text=${that.data.btnText}`,
          imageUrl: that.data.shareList.imageUrl,
        }
      }
    }
  }
})