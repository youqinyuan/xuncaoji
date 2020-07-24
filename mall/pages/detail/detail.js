// pages/detail/detail.js
var time = require('../../utils/util.js');
let app = getApp()
var selectIndex; //选择的大规格key
var attrIndex; //选择的小规格的key
var selectAttrid = []; //选择的属性id
var selectAttrid2 = []; //选择的属性id
var count = true //节流阀-限制购买提交次数
var newpeoplecount1 = true
var newpeoplecount2 = true //只在每次进入页面时规格弹窗初始化
Page({

  /**
   * 页面的初始数据
   */
  data: {
    buyMode:1,
    allPost: [], //省钱帖
    allPost1: [], //省钱帖
    allPost2: [],
    saveForum: [], //赚钱帖
    hostUrl: app.Util.getUrlImg().hostUrl,
    stages: null, //分期专区
    commodity: null, //商品专区
    xiajia: false,
    isCart: false,
    buyType: 1,
    imageUrls: [],
    detail: {},
    content: {}, //客服电话
    autoplay: true,
    circular: true,
    interval: 2000,
    duration: 1000,
    competitorPrices: [], //竞选天猫
    dctDetail: {}, //节省，返利
    introductions: [], //店铺详情介绍
    list: [], //爆品推荐
    spec: [],
    showModalStatus: false, //商品规格弹框
    showModalStatus1: false, //分享弹框
    iconUrl: {},
    stockDetail: {},
    stockDetail1: {},
    num: 1, //初始数量
    num2: 1, //初始数量
    amount: 0, //初始金额
    minusStatus: 'disabled',
    plusStatus: 'disabled',
    selectAttrid: [], //选择的属性id
    selectAttrid2: [], //选择的属性id
    selectAttridstr: '',
    selectAttridstr2: '',
    pageNumber: 1,
    pageSize: 20,
    text: '',
    comment: [], //商品评论
    goodInteractRate: '', //好评率
    selectName: '', //已选规格
    selectName2: '', //已选规格
    selectNameArr: [], //已选规格
    selectName2: '', //已选规格
    selectNameArr2: [], //已选规格
    shareList: {}, //分享数据
    sharingProfit: '', //分享返利
    quantity: null, //库存
    quantity2: null, //库存
    saveAmount: 1, //省钱
    saveMoney: 0, //节约得钱
    options: {},
    activeIndex: '', //选中的index
    inviterCode: '', //邀请码
    current: 0, //轮播图当前索引
    cashMoney: '', //将返现金额
    haibao: false, //海报
    path_img: '', //绘制产品图片路径
    shareData: '', //要分享的数据
    appletQrCodeUrl: '', //邀请码路径
    haibaoImg: '', //生成的海报
    shareImg: '', //需要分享的产品图片
    zero: false, //弹框是否显示0元购按钮
    installment: null, //分期购参数
    newPeopleActivity: 1, //新人专区跳转页面状态
    show2: false, //新人专区活动未开始或过期弹窗
    show3: false, //商品专区活动未开始或过期弹窗
    showModalStatus2: false,
    yuShow: false,
    isOrder: false,
    showRole: false, //赚钱购省钱购
    showOrder: false, //省钱赚钱规格弹框
    showText1: '选择您想出售的规格型号',
    showText2: '选好了，下一步',
    yindao1:false,
    yindao2:false
  },
  //赚钱省钱规则
  getIntoMoney: function(e) {
    var that = this
    that.setData({
      money: 1,
      showRole: true
    })
  },
  saveIntoMoney: function(e) {
    var that = this
    that.setData({
      money: 2,
      showRole: true
    })
  },
  closeShow: function(e) {
    var that = this
    that.setData({
      showRole: false
    })
  },
  //全部省钱订单
  getIntoGetMoney: function(e) {
    let that = this
    wx.navigateTo({
      url: '/packageA/pages/getMoney/getMoney?goodsId=' + that.data.goodsId,
    })
  },
  //省钱赚钱弹框弹框
  goShowOrder: function() {
    let that = this;
    that.data.options.searchOrder = 1
    that.setData({
      options: that.data.options
    })
    that.setData({
      showText1: '选择您想出售的规格型号',
      showOrder: true
    })
    wx.setStorageSync('goShowOrder', 1)
  },
  saveShowOrder() {
    let that = this;
    wx.navigateTo({
      url: '/packageA/pages/saveBuy/saveBuy?goodsId=' + that.data.goodsId,
    })
  },
  hideShowOrder: function() {
    let that = this;
    that.data.options.source = null
    that.setData({
      showOrder: false,
      num: 1,
      options: that.data.options
    })
    that.getGoodsData()
  },
  //跳转到服务问题页面
  goIntoProblem: function(e) {
    wx.navigateTo({
      url: '/packageA/pages/serviceProblem/serviceProblem',
    })
  },
  //立即体验
  experience: function(e) {
    var that = this
    //引导服务页面
    if (wx.getStorageSync('experienceStatus')) {
      if (that.data.newPeopleActivity == 2) {
        that.setData({
          isCart: false,
          showModalStatus2: true,
          buyMode:2,
          isOrder: true
        })
        app.globalData.isShowBook = 2
      } else {
        that.setData({
          zero: true,
          showModalStatus: true,
          buyMode: 2,
          isCart: false,
          isOrder: true
        })
        app.globalData.isShowBook = 2
      }
    } else {
      that.setData({
        yuShow: true
      })
      wx.setStorageSync('experienceStatus', 1)
    }
  },
  noNeed: function(e) {
    var that = this
    that.setData({
      yuShow: false
    })
    wx.setStorageSync('experienceStatus', 1)
  },
  need: function(e) {
    var that = this
    that.setData({
      yuShow: false
    })
    wx.setStorageSync('experienceStatus', 1)
    wx.navigateTo({
      url: '/packageA/pages/serviceProblem/serviceProblem',
    })
  },
  //申请分期购买
  toApplyStage: function(e) {
    var that = this
    if (that.data.quantity === 0) {
      wx.showToast({
        title: '所选商品库存为0不可申请分期购买',
        icon: 'none'
      })
    } else {
      app.Util.ajax('mall/installment/status', {
        goodsId: e.currentTarget.dataset.goodsid,
        stockId: e.currentTarget.dataset.stockid
      }, 'GET').then((res) => {
        if (res.data.content) {
          var objStatus = JSON.stringify(res.data.content)
          var installment = e.currentTarget.dataset.installment
          installment['goodsId'] = e.currentTarget.dataset.goodsid
          installment['stockId'] = e.currentTarget.dataset.stockid
          installment['status'] = res.data.content.status
          wx.setStorageSync('installment', installment)
          if (res.data.content.status == 0) {
            wx.navigateTo({
              url: '/pages/goodsStage/goodsStage?installment=' + that.data.installment,
            })
          } else if (res.data.content.status == 1 || res.data.content.status == 2 || res.data.content.status == 3) {
            wx.navigateTo({
              url: '/pages/goodsStage3/goodsStage3?objStatus=' + objStatus,
            })
          }
          that.setData({
            showModalStatus: false
          })
        }
      })
    }
  },
  //可申请0元购
  applyZero: function(e) {
    let that = this
    //0成本引导2
    if (wx.getStorageSync('token')) {
      if (e.detail.formId !== 'the formId is a mock one') {
        app.Util.ajax('mall/userFromRecord/addRecord', {
          formId: e.detail.formId
        }, 'POST').then((res) => { // 使用ajax函数
          console.log(res.data)
        })
      } else {}
    }
    if (wx.getStorageSync('token')) {
        that.setData({
          zero: true,
          showModalStatus: true,
          buyMode:2,
          isCart: false
        })
    } else {
      wx.navigateTo({
        url: "/pages/invitationCode/invitationCode?inviterCode=" + that.data.inviterCode
      })
      that.setData({
        num: 1
      })
    }
  },
  //跳转到申请0元购规则
  applyZeroBuy: function(e) {
    var that = this
    var goodsId = e.currentTarget.dataset.goodsid
    var stockId = e.currentTarget.dataset.stockid
    var quantity = e.currentTarget.dataset.quantity
    var price = e.currentTarget.dataset.price
    var activityId = e.currentTarget.dataset.activityid ? e.currentTarget.dataset.activityid : ''
    if (that.data.quantity === 0) {
      wx.showToast({
        title: '所选商品库存为0不可购买',
        icon: 'none'
      })
    } else if (that.data.num > that.data.quantity) {
      wx.showToast({
        title: '已超出最大库存',
        icon: 'none'
      })
    } else if (that.data.num < 1) {
      wx.showToast({
        title: '不能再少了哟',
        icon: 'none'
      })
    } else if (isNaN(that.data.num)) {
      wx.showToast({
        title: '数量不能少于1',
        icon: 'none'
      })
      that.setData({
        num: 1
      })
    } else {
      if (this.data.buyType == 2) {
        if (activityId == '') {
          wx.navigateTo({
            url: `/packageB/pages/applyZero/applyZero?goodsId=${goodsId}&stockId=${stockId}&quantity=${quantity}&buyType=2&freeBuyMode`,
          })
        } else {
          wx.navigateTo({
            url: `/packageB/pages/applyZero/applyZero?goodsId=${goodsId}&stockId=${stockId}&quantity=${quantity}&activityId=${activityId}&buyType=2`,
          })
        }
      } else {
        if (app.globalData.isShowBook == 2) {
          if (activityId == '') {
            wx.navigateTo({
              url: `/packageB/pages/applyZero/applyZero?goodsId=${goodsId}&stockId=${stockId}&quantity=${quantity}&isShowBook=2`,
            })
          } else {
            wx.navigateTo({
              url: `/packageB/pages/applyZero/applyZero?goodsId=${goodsId}&stockId=${stockId}&quantity=${quantity}&activityId=${activityId}&isShowBook=2`,
            })
          }
        } else {
          if (activityId == '') {
            wx.navigateTo({
              url: `/packageB/pages/applyZero/applyZero?goodsId=${goodsId}&stockId=${stockId}&quantity=${quantity}`,
            })
          } else {
            wx.navigateTo({
              url: `/packageB/pages/applyZero/applyZero?goodsId=${goodsId}&stockId=${stockId}&quantity=${quantity}&activityId=${activityId}`,
            })
          }
        }
      }

    }
  },
  //新人活动
  applyZeroBuy1: function(e) {
    var that = this
    var goodsId = e.currentTarget.dataset.goodsid
    var stockId = e.currentTarget.dataset.stockid
    var quantity = e.currentTarget.dataset.quantity
    var price = e.currentTarget.dataset.price
    var activityGoodsId = e.currentTarget.dataset.activitygoodsid
    var newPeople = e.currentTarget.dataset.newpeople
    if (that.data.quantity === 0) {
      wx.showToast({
        title: '所选商品库存为0不可购买',
        icon: 'none'
      })
    } else if (that.data.num2 > that.data.quantity) {
      wx.showToast({
        title: '已超出最大库存',
        icon: 'none'
      })
    } else if (that.data.num2 < 1) {
      wx.showToast({
        title: '不能再少了哟',
        icon: 'none'
      })
    } else if (isNaN(that.data.num2)) {
      wx.showToast({
        title: '数量不能少于1',
        icon: 'none'
      })
      that.setData({
        num2: 1
      })
    } else {
      if (that.data.buyType == 2) {
        wx.navigateTo({
          url: `/packageB/pages/applyZero/applyZero?activityGoodsId=${activityGoodsId}&stockId=${stockId}&quantity=${quantity}&newPeopleActivity=2&buyType=2&newPeople=1`,
        })
      } else {
        if (app.globalData.isShowBook == 2) {
          wx.navigateTo({
            url: `/packageB/pages/applyZero/applyZero?activityGoodsId=${activityGoodsId}&stockId=${stockId}&newPeopleActivity=2&newPeople=1&quantity=${quantity}&isShowBook=2`,
          })
        } else {
          wx.navigateTo({
            url: `/packageB/pages/applyZero/applyZero?activityGoodsId=${activityGoodsId}&stockId=${stockId}&newPeopleActivity=2&newPeople=1&quantity=${quantity}`,
          })
        }
      }
      that.setData({
        showModalStatus2: false,
        zero: false
      })
    }
  },
  //客服分享图片回到指定的小程序页面
  handleContact: function(e) {
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
  //求当前轮播图的索引
  countIndex: function(e) {
    this.setData({
      current: e.detail.current
    })
  },
  //图片预览 
  imgYu: function(e) {
    var src = e.currentTarget.dataset.src; //获取data-src
    var imgList = e.currentTarget.dataset.list; //获取data-list
    //图片预览
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: imgList // 需要预览的图片http链接列表
    })
  },
  watchImg: function(e) {
    var src = e.currentTarget.dataset.src; //获取data-src
    var imgList = e.currentTarget.dataset.list; //获取data-list
    //图片预览
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: imgList // 需要预览的图片http链接列表
    })
  },
  //分享
  share: function(e) {
    var that = this
    var goodsId = e.currentTarget.dataset.goodsid
    var sharingProfit = e.currentTarget.dataset.profit ? e.currentTarget.dataset.profit : ''
    that.setData({
      goodsId: goodsId,
      sharingProfit: sharingProfit
    })
    that.setData({
      showModalStatus1: true
    })
  },
  cancelShare: function() {
    var that = this
    that.setData({
      showModalStatus1: false
    })
  },
  //隐藏底部分享对话框
  hide: function() {
    var that = this
    that.setData({
      showModalStatus1: false,
    })
  },
  //查询分享数据
  chooseShare: function () {
    var that = this
    if (that.data.commodity || wx.getStorageSync("isCommodity")) {
      app.Util.ajax('mall/weChat/sharing/target', {
        mode: 15,
        activityId: that.data.commodity,
        targetId: that.data.goodsId
      }, 'GET').then((res) => {
        if (res.data.messageCode == "MSG_1001") {
          var inviterCode = wx.getStorageSync('inviterCode')
          if (inviterCode) {
            res.data.content.link = res.data.content.link.replace(/{inviterCode}/g, inviterCode)
          } else {
            res.data.content.link = res.data.content.link.replace(/{inviterCode}/g, '')
          }
          // 产品图片路径转换为本地路径
          var imageUrl = res.data.content.imageUrl
          if (imageUrl) {
            wx.getImageInfo({
              src: imageUrl,
              success(res) {
                var ctx = wx.createCanvasContext('canvas');
                var path_bg = res.path; //背景图片
                var path_logo = '/assets/images/icon/apply_icon.png'
                // 绘制产品图片
                ctx.drawImage(path_bg, 0, 0, 400, 400);
                //绘制申请0元购logo
                ctx.drawImage(path_logo, 240, 245, 130, 64);
                ctx.draw()
                setTimeout(function () {
                  wx.canvasToTempFilePath({
                    canvasId: 'canvas',
                    success: function (res) {
                      that.data.shareImg = res.tempFilePath
                    }
                  })
                }, 1000)
              }
            })
          }
          that.setData({
            shareList: res.data.content
          })
          that.getShareData();
        } else if (res.data.messageCode == "MSG_4002") {

        } else {
          wx.showToast({
            title: res.data.message,
            icon: 'none',
            duration: 3000
          })
        }
      })
    } else {
      var mode;
      if (that.data.newPeopleActivity == 2 || wx.getStorageSync("isNewPeopleActivity")) {
        mode = 14
      } else {
        mode = 1
      }
      app.Util.ajax('mall/weChat/sharing/target', {
        mode: mode,
        targetId: that.data.goodsId
      }, 'GET').then((res) => {
        if (res.data.messageCode == "MSG_1001") {
          var inviterCode = wx.getStorageSync('inviterCode')
          if (inviterCode) {
            res.data.content.link = res.data.content.link.replace(/{inviterCode}/g, inviterCode)
          } else {
            res.data.content.link = res.data.content.link.replace(/{inviterCode}/g, '')
          }
          // 产品图片路径转换为本地路径
          var imageUrl = res.data.content.imageUrl
          if (imageUrl) {
            wx.getImageInfo({
              src: imageUrl,
              success(res) {
                var ctx = wx.createCanvasContext('canvas');
                var path_bg = res.path; //背景图片
                var path_logo = '/assets/images/icon/apply_icon.png'
                // 绘制产品图片
                ctx.drawImage(path_bg, 0, 0, 400, 400);
                //绘制申请0元购logo
                ctx.drawImage(path_logo, 240, 245, 130, 64);
                ctx.draw()
                setTimeout(function () {
                  wx.canvasToTempFilePath({
                    canvasId: 'canvas',
                    success: function (res) {
                      that.data.shareImg = res.tempFilePath
                    }
                  })
                }, 1000)
              }
            })
          }
          that.setData({
            shareList: res.data.content
          })
          that.getShareData();
        } else if (res.data.messageCode == "MSG_4002") {

        } else {
          wx.showToast({
            title: res.data.message,
            icon: 'none',
            duration: 3000
          })
        }
      })
    }
  },
  // 获取分享数据
  getShareData: function () {
    var that = this
    if (that.data.commodity || wx.getStorageSync("isCommodity")) {
      app.Util.ajax('mall/weChat/sharing/target', {
        mode: 15,
        targetId: that.data.goodsId,
        activityId: that.data.commodity,
      }, 'GET').then((res) => {
        if (res.data.messageCode = 'MSG_1001') {
          that.data.shareData = res.data.content
          // 产品图片路径转换为本地路径
          var imageUrl = res.data.content.imageUrl
          if (imageUrl) {
            wx.getImageInfo({
              src: imageUrl,
              success(res) {
                that.data.path_img = res.path
              }
            })
          }
          //邀请码转换为本地路径
          var appletQrCodeUrl = res.data.content.appletQrCodeUrl
          if (appletQrCodeUrl) {
            wx.getImageInfo({
              src: appletQrCodeUrl,
              success(res) {
                that.data.appletQrCodeUrl = res.path
              }
            })
          }
        }
      })
    } else {
      var mode;
      if (that.data.newPeopleActivity == 2 || wx.getStorageSync("isNewPeopleActivity")) {
        mode = 14
      } else {
        mode = 1
      }
      app.Util.ajax('mall/weChat/sharing/target', {
        mode: mode,
        targetId: that.data.goodsId,
      }, 'GET').then((res) => {
        if (res.data.messageCode = 'MSG_1001') {
          that.data.shareData = res.data.content
          // 产品图片路径转换为本地路径
          var imageUrl = res.data.content.imageUrl
          if (imageUrl) {
            wx.getImageInfo({
              src: imageUrl,
              success(res) {
                that.data.path_img = res.path
              }
            })
          }
          //邀请码转换为本地路径
          var appletQrCodeUrl = res.data.content.appletQrCodeUrl
          if (appletQrCodeUrl) {
            wx.getImageInfo({
              src: appletQrCodeUrl,
              success(res) {
                that.data.appletQrCodeUrl = res.path
              }
            })
          }
        }
      })
    }
  },
  // 分享到朋友圈
  shareFriend: function() {
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
    // 绘制已抢数量
    ctx.beginPath()
    var number = `已抢数量：${that.data.shareData.grabbed}`
    var textWidth = inviterCode ? ctx.measureText(number).width : ctx.measureText(number).width + 50
    ctx.setFillStyle('#F5BA2C');
    ctx.moveTo(0.1308 * width, 174)
    ctx.lineTo(0.1308 * width, 180)
    ctx.lineTo(0.1308 * width - 10, 174)
    ctx.lineTo(0.1308 * width - 10, 150)
    ctx.lineTo(0.1308 * width + textWidth / 2 + 22, 150)
    ctx.lineTo(0.1308 * width + textWidth / 2 + 22, 174)
    ctx.lineTo(0.1308 * width - 10, 174)
    ctx.arc(0.1308 * width + textWidth / 2 + 22, 162, 12, 1.5 * Math.PI, 0.5 * Math.PI, false)
    ctx.closePath()
    ctx.fill()
    ctx.beginPath()
    ctx.setFontSize(12);
    ctx.setFillStyle('#fff');
    ctx.setTextAlign("left")
    ctx.fillText(number, 0.1308 * width, 167);
    ctx.closePath()
    ctx.stroke();
    // 绘制0元购图标
    var path_zero = "/assets/images/icon/apply free.png"
    ctx.beginPath()
    ctx.drawImage(path_zero, 0.52 * width, 0.36 * height, 0.2 * width, 0.2 * width);
    ctx.closePath()
    // 绘制价格
    ctx.beginPath()
    var price = `一折购¥${that.data.shareData.price}`
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
    var textWidth = ctx.measureText(`最高返¥ ${that.data.shareData.cashBack}`).width
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
    var cashBack = `最高返¥ ${that.data.shareData.cashBack}`
    ctx.beginPath()
    ctx.setFontSize(12);
    ctx.setFillStyle('#fff');
    ctx.setTextAlign("left")
    ctx.fillText(cashBack, 0.1 * width + textWidth2 + 28, 0.525 * height - 4);
    ctx.stroke();
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
    setTimeout(function() {
      wx.canvasToTempFilePath({
        canvasId: 'mycanvas',
        success: function(res) {
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
  handleLongPress: function() {
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
  close_hb: function() {
    var that = this
    that.setData({
      haibao: false
    })
  },
  // 跳转到购物车
  toCart: function() {
    var that = this
    that.setData({
      isCart: true
    })
  },
  cartCancle: function() {
    var that = this
    that.setData({
      isCart: false
    })
  },
  // 跳转到提交订单
  toPlaceorder: function(e) {
    if (count) { // 节流阀 - 限制订单重复提交
      count = false
      var goodsId = e.currentTarget.dataset.goodsid
      var stockId = e.currentTarget.dataset.stockid
      var quantity = e.currentTarget.dataset.quantity
      var activityId = e.currentTarget.dataset.activityid ? e.currentTarget.dataset.activityid : ''
      var cashbackId = e.currentTarget.dataset.cashbackid ? e.currentTarget.dataset.cashbackid : ''
      if (this.data.quantity === 0) {
        wx.showToast({
          title: '所选商品库存为0不可购买',
          icon: 'none'
        })
      } else if (this.data.num > this.data.quantity) {
        wx.showToast({
          title: '已超出最大库存',
          icon: 'none'
        })
      } else if (this.data.num < 1) {
        wx.showToast({
          title: '不能再少了哟',
          icon: 'none'
        })
      } else if (isNaN(this.data.num)) {
        wx.showToast({
          title: '数量不能少于1',
          icon: 'none'
        })
        this.setData({
          num: 1
        })
      } else {
        if (this.data.buyType == 2) {
          if (activityId == '') {
            wx.navigateTo({
              url: `/pages/placeorder/placeorder?goodsId=${goodsId}&stockId=${stockId}&quantity=${quantity}&cashbackId=${cashbackId}&buyType=2`,
            })
          } else {
            wx.navigateTo({
              url: `/pages/placeorder/placeorder?goodsId=${goodsId}&stockId=${stockId}&quantity=${quantity}&cashbackId=${cashbackId}&activityId=${activityId}&buyType=2`,
            })
          }
        } else {
          if (activityId == '') {
            wx.navigateTo({
              url: `/pages/placeorder/placeorder?goodsId=${goodsId}&stockId=${stockId}&quantity=${quantity}&cashbackId=${cashbackId}`,
            })
          } else {
            wx.navigateTo({
              url: `/pages/placeorder/placeorder?goodsId=${goodsId}&stockId=${stockId}&quantity=${quantity}&cashbackId=${cashbackId}&activityId=${activityId}`,
            })
          }
        }
      }
    }
    setTimeout(function() {
      count = true
    }, 1000)
  },
  //跳转到评价页面
  jumpEvaluate: function(e) {
    var goodsId = e.currentTarget.dataset.goodsid
    wx.navigateTo({
      url: `/pages/evaluate/evaluate?goodsId=${goodsId}`
    })
  },
  //跳转到详情页
  toDetail: function(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/detail/detail?id=${id}`,
    })
  },
  //跳转到购物车
  addTocart: function(e) {
    var that = this
    if (count == true) {
      count = false
      let token = wx.getStorageSync('token')
      var goodsId = e.currentTarget.dataset.goodsid
      var stockId = e.currentTarget.dataset.stockid
      var quantity = e.currentTarget.dataset.quantity
      var cashbackId = e.currentTarget.dataset.cashbackid ? e.currentTarget.dataset.cashbackid : ''
      if (token) {
        //添加购物车
        app.Util.ajax('mall/cart/addShoppingCart', {
          goodsId: goodsId,
          stockId: stockId,
          quantity: quantity,
          cashBackId: cashbackId
        }, 'POST').then((res) => { // 使用ajax函数
          if (res.data.messageCode === 'MSG_1001') {
            if (this.data.num > this.data.quantity) {
              wx.showToast({
                title: '已超出最大库存',
                icon: 'none'
              })
            } else if (this.data.num < 1) {
              wx.showToast({
                title: '不能再少了哟',
                icon: 'none'
              })
            } else {
              wx.showToast({
                title: '添加商品成功',
                icon: 'none'
              })
              this.setData({
                showModalStatus: false,
                num: 1
              })
            }
          } else {
            wx.showToast({
              title: res.data.message,
              icon: 'none'
            })
          }
        })
      } else {
        wx.navigateTo({
          url: "/pages/invitationCode/invitationCode?inviterCode=" + this.data.inviterCode
        })
      }
    }
    setTimeout(function() {
      count = true
    }, 1000)
  },
  //选中返现
  clickCashback: function(e) {
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
  specIndex: function(e) {
    var that = this
    if (that.data.options.source) {
      return false;
    } else {
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
        activeIndex: 0
      })
    }
  },
  //选择规格index值
  specIndex2: function(e) {
    var that = this
    var index = e.currentTarget.dataset.index
    var selectAttridStr2 = that.data.selectAttridStr2
    selectAttridStr2[index] = that.data.selectAttrid2
    if (!that.data.activityStockDetail[selectAttridStr2]) {
      return;
    }
    // 计算当前商品返现金额
    that.setData({
      activityStockDetail1: that.data.activityStockDetail[selectAttridStr2],
      quantity: that.data.activityStockDetail[selectAttridStr2].quantity,
      cashMoney: that.data.activityStockDetail[selectAttridStr2].cashbackItems ? that.data.activityStockDetail[selectAttridStr2].cashbackItems[0].totalAmount : '',
      cashbackId: that.data.activityStockDetail[selectAttridStr2].cashbackItems ? that.data.activityStockDetail[selectAttridStr2].cashbackItems[0].cashbackId : '',
      activeIndex: 0
    })
  },
  //选中规格
  clickAttr: function(e) {
    var that = this
    if (that.data.options.source) {
      return false;
    } else {
      var selectIndex = e.currentTarget.dataset.selectIndex; //选择大规格的id
      var attrIndex = e.currentTarget.dataset.attrIndex;
      var name = e.currentTarget.dataset.name;
      var spec = that.data.spec;
      var count = spec[selectIndex].items.length;
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
    }
  },
  //选中规格
  clickAttr2: function(e) {
    var that = this
    var selectIndex = e.currentTarget.dataset.selectIndex; //选择大规格的id
    var attrIndex = e.currentTarget.dataset.attrIndex;
    var name = e.currentTarget.dataset.name;
    var activitySpecs = that.data.activitySpecs;
    var count = activitySpecs[selectIndex].items.length;
    //已选
    that.data.selectNameArr2[selectIndex] = e.currentTarget.dataset.name
    that.setData({
      selectName2: that.data.selectNameArr2.join('/'),
    })
    for (var i = 0; i < count; i++) {
      activitySpecs[selectIndex].items[i].isSelect = false;
    }
    activitySpecs[selectIndex].items[attrIndex].isSelect = true;
    if (activitySpecs[selectIndex].items[attrIndex].isSelect == true) {
      if (activitySpecs[selectIndex].items[attrIndex].iconUrl) {
        that.setData({
          iconUrl2: activitySpecs[selectIndex].items[attrIndex].iconUrl
        })
      }
    }
    var attrid = activitySpecs[selectIndex].items[attrIndex].id;
    selectAttrid2[selectIndex] = attrid;
    that.setData({
      activitySpecs: activitySpecs, //变换选择框,
      selectAttrid2: e.currentTarget.dataset.attrId,
    })
    for (let i in that.data.activityStockDetail) {
      if (that.data.selectAttridStr2 == i) {
        that.setData({
          cashbackId: that.data.activityStockDetail[i].cashbackItems ? that.data.activityStockDetail[i].cashbackItems[0].cashbackId : ''
        })
      }
    }
  },
  // 点击我显示底部弹出框
  clickme: function() {
    var that = this
    var token = wx.getStorageSync('token')
    if (token) {
      that.showModal();
      that.setData({
        isCart: false,
        buyMode:1
      })
    } else {
      wx.navigateTo({
        url: "/pages/invitationCode/invitationCode?inviterCode=" + that.data.inviterCode
      })
      that.setData({
        num: 1,
        buyMode: 2
      })
    }
  },
  // 新人活动显示底部弹出框
  clickme1: function() {
    var that = this
    var token = wx.getStorageSync('token')
    if (token) {
      that.setData({
        isCart: false,
        buyMode: 2,
        showModalStatus2: true
      })
    } else {
      wx.navigateTo({
        url: "/pages/invitationCode/invitationCode?inviterCode=" + that.data.inviterCode
      })
      that.setData({
        num: 1
      })
    }
  },
  //申请分期购买
  applyStage: function() {
    var that = this
    var token = wx.getStorageSync('token')
    if (token) {
      that.showModal();
    } else {
      wx.setStorageSync('stages', 1)
      wx.navigateTo({
        url: "/pages/invitationCode/invitationCode?inviterCode=" + that.data.inviterCode
      })
    }
  },
  //显示对话框
  showModal: function() {
    // 显示遮罩层
    var that = this
    that.setData({
      showModalStatus: true,
      buyMode: 1,
    })
  },
  //隐藏规格对话框
  hideModal: function() {
    // 隐藏遮罩层
    var that = this
    that.setData({
      showModalStatus: false,
      zero: false,
      buyMode: 1,
      isOrder: false
    })
    app.globalData.isShowBook = 1
  },
  hideModal2: function() {
    // 隐藏遮罩层
    var that = this
    that.setData({
      showModalStatus2: false,
      zero: false,
      isOrder: false,
      buyMode: 1
    })
    app.globalData.isShowBook = 1
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    if (options.scene) {
      //扫描小程序码进入 -- 解析携带参数
      that.setData({
        options: options
      })
      var scene = decodeURIComponent(options.scene);
      var arrPara = scene.split("&");
      var arr = [];
      for (var i in arrPara) {
        arr = arrPara[i].split("=");
        if (arr[0] == 'id') {
          that.setData({
            goodsId: parseInt(arr[1]),
          })
          //添加商品id缓存
          wx.setStorage({
            key: "goods_id",
            data: parseInt(arr[1])
          })
        }
        if (arr[0] == 'type') {
          that.setData({
            buyType: 2,
          })
        }
      }
    } else {
      if (options.type) {
        that.setData({
          buyType: 2
        })
      }
      if (wx.getStorageSync("isNewPeopleActivity")) {
        that.setData({
          newPeopleActivity: 2,
        })
      } else if (wx.getStorageSync("isCommodity")) {
        that.setData({
          commodity: 1,
        })
      }
      if (options.newPeopleActivity || options.activityType == 1) {
        wx.setStorageSync("isNewPeopleActivity", 1)
        that.setData({
          newPeopleActivity: 2,
        })
      }
      if (options.stages) {
        that.setData({
          stages: options.stages
        })
      }
      if (options.commodity) {
        wx.setStorageSync("isCommodity", 1)
        that.setData({
          commodity: options.commodity,
        })
      } else if (options.activityType == 2 && options.activityId) {
        wx.setStorageSync("isCommodity", 1)
        that.setData({
          commodity: options.activityId,
        })
      }
      //发布赚钱省钱订单
      if (options.searchOrder==2) {
        that.setData({
          showText1: '选择您想购买的规格型号',
          showOrder: true
        })
      } else if (options.searchOrder == 1){
        that.setData({
          showText1: '选择您想出售的规格型号',
          showOrder: true
        })        
      }
      if (options.source) {
        that.setData({
          showText1: '选中的是对方要求的规格型号，不可更换哦',
          showText2: '下一步',
          showOrder: true
        })
      }
      //不是扫描小程序码进入
      that.setData({
        goodsId: parseInt(options.id) || wx.getStorageSync('goods_id'),
        inviterCode: options.inviterCode || '',
        options: options
      })
      if (options) {
        //添加商品id缓存
        wx.setStorage({
          key: "goods_id",
          data: parseInt(options.id)
        })
      }
      //是发起赞助，自动弹起规格选择
      if (options.sponsorId) {
        setTimeout(function() {
          that.setData({
            zero: true,
            showModalStatus: true,
          })
        }, 200)
      }
    }
    // 请求商品详情
    if (that.data.stages) {
      that.getGoodsStages()
    } else if (that.data.commodity || wx.getStorageSync("isCommodity")) {
      that.getGoodsArea()
    } else if (that.data.newPeopleActivity == 2 || wx.getStorageSync("isNewPeopleActivity")) {
      that.newPeopleGoodsData()
    } else {
      that.getGoodsData()
      //0成本购引导
      if(app.globalData.freeBuyYinDao==1){
        that.setData({
          yindao1:true
        })
      }
    }
    //查询分享数据
    that.chooseShare();
  },
  // 请求商品详情
  getGoodsData: function() {
    let that = this
    app.Util.ajax('mall/home/goodsDetail', {
      id: that.data.goodsId
    }, 'GET').then((res) => {
      if (res.data.messageCode == "MSG_1001") {
        var saveAmount = ((res.data.content.orgPrice) - (res.data.content.dctPrice)).toFixed(2)
        that.setData({
          commodity: res.data.content.activityItem ? res.data.content.activityItem.activityId : null,
          imageUrls: res.data.content.imageUrls,
          detail: res.data.content,
          competitorPrices: res.data.content.competitorPrices.length > 0 ? res.data.content.competitorPrices : [],
          store: res.data.content.store,
          spec: res.data.content.specs,
          introductions: res.data.content.introductions,
          stockDetail: res.data.content.stockDetail,
          saveAmount: saveAmount,
          saveMoney: res.data.content.cashBack ? (parseFloat(saveAmount) + parseFloat(res.data.content.cashBack.totalAmount)).toFixed(2) : '',
        })
        // stockDetail1: that.data.stockDetail[selectAttridStr],
        if (that.data.options.source) {
          let selectAttridstr1 = []
          let specitemids = that.data.options.specitemids.split(',')
          for (let i = 0; i < that.data.spec.length; i++) {
            let items = that.data.spec[i].items
            for (let j = 0; j < items.length; j++) {
              for (let a = 0; a < specitemids.length; a++) {
                if (items[j].id == specitemids[a]) {
                  items[j]['isSelect'] = true
                  selectAttridstr1.push(items[j].id)
                  that.setData({
                    iconUrl: items[j].iconUrl,
                    selectAttridStr: selectAttridstr1,
                  })
                }
              }
            }
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
            spec: that.data.spec,
            num: that.data.options.quantity,
          })
          for (let i in that.data.stockDetail) {
            var selectAttridStr = that.data.selectAttridStr
            that.data.stockDetail[i].dctPrice = parseFloat((that.data.stockDetail[i].dctPrice).toFixed(2))
            if (selectAttridStr == i) {
              that.setData({
                stockDetail1: that.data.stockDetail[i],
                quantity: that.data.stockDetail[i].quantity,
                cashMoney: that.data.stockDetail[i].cashbackItems ? that.data.stockDetail[i].cashbackItems[0].totalAmount : '',
              })
            }
          }
        } else {
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
            spec: that.data.spec,
            iconUrl: res.data.content.specs[0].items[0].iconUrl,
          })
          var spec = that.data.spec
          var size = spec.length;
          var index = 0;
          var selectAttridstr1 = []
          for (var i = 0; i < size; i++) {
            selectAttridstr1.push(spec[i].items[0].id)
          }
          that.setData({
            selectAttridStr: selectAttridstr1,
          });

          for (let i in that.data.stockDetail) {
            var selectAttridStr = that.data.selectAttridStr
            that.data.stockDetail[i].dctPrice = parseFloat((that.data.stockDetail[i].dctPrice).toFixed(2))
            if (selectAttridStr == i) {
              that.setData({
                stockDetail1: that.data.stockDetail[i],
                quantity: that.data.stockDetail[i].quantity,
                cashMoney: that.data.stockDetail[i].cashbackItems ? that.data.stockDetail[i].cashbackItems[0].totalAmount : '',
                cashbackId: that.data.stockDetail[i].cashbackItems ? that.data.stockDetail[i].cashbackItems[0].cashbackId : '',
                activeIndex: 0
              })
            }
          }
        }
        if (that.data.detail.activityItem) {
          if (that.data.detail.activityItem.status == 1) {
            that.setData({
              goodsText1: '当前活动还未开始',
              show3: true
            })
          } else if (that.data.detail.activityItem.status == 3 || that.data.detail.activityItem.status == 4) {
            that.setData({
              goodsText1: '当前活动已结束',
              show3: true
            })
          }
        }
        //爆品推荐
        that.initgetMore1();
      } else if (res.data.messageCode == "MSG_4002") {
        that.setData({
          xiajia: true
        })
      } else {
        wx.showToast({
          title: res.data.message,
          icon: "none"
        })
      }
    })
    //查询省钱帖
    that.getMoney();
    //查询赚钱帖
    that.saveForum();
  },
  //查询省钱帖
  getMoney() {
    var that = this
    let data = {
      pageNumber: that.data.pageNumber,
      pageSize: that.data.pageSize,
      type: 6,
      goodsId: that.data.goodsId
    }
    app.Util.ajax('mall/forum/topic/findPageList', data, 'GET').then((res) => {
      if (res.data.content) {
        let arr = res.data.content.items
        that.setData({
          allPost: arr
        })
        if (arr.length > 2) {
          let allPost1 = []
          let allPost2 = []
          for (let i = 0; i < arr.length; i++) {
            if (i % 2 == 0) {
              allPost1.push(arr[i])
              that.setData({
                allPost1: allPost1
              })
            } else {
              allPost2.push(arr[i])
              that.setData({
                allPost2: allPost2
              })
            }
          }
        } else {
          that.setData({
            allPost1: arr
          })
        }
      }
    })
  },
  //查询赚钱帖
  saveForum() {
    var that = this
    let data = {
      pageNumber: that.data.pageNumber,
      pageSize: that.data.pageSize,
      type: 5,
      goodsId: that.data.goodsId
    }
    app.Util.ajax('mall/forum/topic/findPageList', data, 'GET').then((res) => {
      if (res.data.content) {
        that.setData({
          saveForum: res.data.content.items
        })
      }
    })
  },
  //购买赚钱
  earnMoney(e) {
    let that = this
    if (wx.getStorageSync('token')) {
      let id = e.currentTarget.dataset.id
      let specitemids = e.currentTarget.dataset.specitemids
      let topicid = e.currentTarget.dataset.topicid
      let quantity = e.currentTarget.dataset.quantity
      let stockid = e.currentTarget.dataset.stockid
      let source = 1
      that.data.options.source = source
      that.data.options.specitemids = specitemids
      that.data.options.topicid = topicid
      that.data.options.stockid = stockid
      that.data.options.quantity = quantity
      that.setData({
        options: that.data.options
      })
      that.getGoodsData()
      setTimeout(function() {
        that.setData({
          showText1: '选中的是对方要求的规格型号，不可更换哦',
          showText2: '下一步',
          showOrder: true
        })
      }, 500)
    } else {
      wx.navigateTo({
        url: "/pages/invitationCode/invitationCode?inviterCode=" + that.data.inviterCode
      })
    }
  },
  //新人专区商品详情
  newPeopleGoodsData: function() {
    var that = this
    app.Util.ajax('mall/newPeople/findGoodsDetail', {
      activityAreaGoodsId: that.data.goodsId
    }, 'GET').then((res) => {
      if (res.data.messageCode == "MSG_1001") {
        var saveAmount = ((res.data.content.goodsItem.orgPrice) - (res.data.content.goodsItem.dctPrice)).toFixed(2)
        that.setData({
          labelImage: res.data.content.labelImage,
          labelName: res.data.content.labelName,
          buttonText: res.data.content.buttonText,
          imageUrls: res.data.content.goodsItem.imageUrls,
          detail: res.data.content.goodsItem,
          competitorPrices: res.data.content.goodsItem.competitorPrices && res.data.content.goodsItem.competitorPrices.length > 0 ? res.data.content.goodsItem.competitorPrices : [],
          store: res.data.content.goodsItem.store,
          spec: res.data.content.goodsItem.specs,
          activitySpecs: res.data.content.goodsItem.activitySpecs,
          introductions: res.data.content.goodsItem.introductions,
          stockDetail: res.data.content.goodsItem.stockDetail,
          activityStockDetail: res.data.content.goodsItem.activityStockDetail,
          iconUrl: res.data.content.goodsItem.specs[0].items[0].iconUrl,
          saveAmount: saveAmount,
          saveMoney: res.data.content.cashBack ? (parseFloat(saveAmount) + parseFloat(res.data.content.cashBack.totalAmount)).toFixed(2) : '',
        })
        //加载评论
        that.comment2(res.data.content.goodsItem.id)
        if (res.data.content.status == 1) {
          that.setData({
            show2: true,
            goodsText: '当前活动还未开始'
          })
        } else if (res.data.content.status == 3) {
          that.setData({
            show2: true,
            goodsText: '当前活动已结束'
          })
        }
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
        var selectAttridstr1 = []
        for (var i = 0; i < size; i++) {
          selectAttridstr1.push(spec[i].items[0].id)
        }
        that.setData({
          selectAttridStr: selectAttridstr1,
        });
        for (let i in that.data.stockDetail) {
          var selectAttridStr = that.data.selectAttridStr
          that.data.stockDetail[i].dctPrice = parseFloat((that.data.stockDetail[i].dctPrice).toFixed(2))
          if (selectAttridStr == i) {
            that.setData({
              stockDetail1: that.data.stockDetail[i],
              quantity: that.data.stockDetail[i].quantity,
              cashMoney: that.data.stockDetail[i].cashbackItems ? that.data.stockDetail[i].cashbackItems[0].totalAmount : '',
              cashbackId: that.data.stockDetail[i].cashbackItems ? that.data.stockDetail[i].cashbackItems[0].cashbackId : '',
              activeIndex: 0
            })
          }
        }
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
        for (var i = 0; i < that.data.activitySpecs.length; i++) {
          let items = that.data.activitySpecs[i].items
          items[0]['isSelect'] = true
        }
        var name = [];
        for (var a = 0; a < that.data.activitySpecs.length; a++) {
          for (var b = 0; b < that.data.activitySpecs[a].items.length; b++) {
            if (that.data.activitySpecs[a].items[b].isSelect == true) {
              name.push(that.data.activitySpecs[a].items[b].name)
              that.setData({
                selectNameArr2: name,
                selectName2: name.join('/')
              })
            }
          }
        }
        that.setData({
          activitySpecs: that.data.activitySpecs
        })
        //初始化规格选择
        var activitySpecs = that.data.activitySpecs
        var size = activitySpecs.length;
        var index = 0;
        var selectAttridstr1 = []
        for (var i = 0; i < size; i++) {
          selectAttridstr1.push(activitySpecs[i].items[0].id)
        }
        that.setData({
          selectAttridStr2: selectAttridstr1,
        });
        for (let i in that.data.activityStockDetail) {
          var selectAttridStr2 = that.data.selectAttridStr2
          that.data.activityStockDetail[i].dctPrice = parseFloat((that.data.activityStockDetail[i].dctPrice).toFixed(2))
          if (selectAttridStr2 == i) {
            that.setData({
              activityStockDetail1: that.data.activityStockDetail[i],
              quantity2: that.data.activityStockDetail[i].quantity,
              cashMoney: that.data.activityStockDetail[i].cashbackItems ? that.data.activityStockDetail[i].cashbackItems[0].totalAmount : '',
              cashbackId: that.data.activityStockDetail[i].cashbackItems ? that.data.activityStockDetail[i].cashbackItems[0].cashbackId : '',
              activeIndex: 0
            })
          }
        }

        //爆品推荐
        that.initgetMore1();
      } else if (res.data.messageCode == "MSG_4002") {
        that.setData({
          xiajia: true
        })
      } else {
        wx.showToast({
          title: res.data.message,
          icon: "none"
        })
      }
    })
  },
  //申请分期
  getGoodsStages: function() {
    var that = this
    app.Util.ajax('mall/installment/goodsDetail', {
      id: that.data.goodsId
    }, 'GET').then((res) => {
      if (res.data.messageCode == "MSG_1001") {
        var saveAmount = ((res.data.content.goodsResponse.orgPrice) - (res.data.content.goodsResponse.dctPrice)).toFixed(2)
        that.setData({
          installmentGoodsResponse: res.data.content.installmentGoodsResponse,
          imageUrls: res.data.content.goodsResponse.imageUrls,
          detail: res.data.content.goodsResponse,
          competitorPrices: res.data.content.goodsResponse.competitorPrices.length > 0 ? res.data.content.goodsResponse.competitorPrices : [],
          store: res.data.content.goodsResponse.store,
          spec: res.data.content.goodsResponse.specs,
          introductions: res.data.content.goodsResponse.introductions,
          stockDetail: res.data.content.goodsResponse.stockDetail,
          iconUrl: res.data.content.goodsResponse.specs[0].items[0].iconUrl,
          saveAmount: saveAmount,
          saveMoney: res.data.content.goodsResponse.cashBack ? (parseFloat(saveAmount) + parseFloat(res.data.content.goodsResponse.cashBack.totalAmount)).toFixed(2) : '',
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
        var selectAttridstr1 = []
        for (var i = 0; i < size; i++) {
          selectAttridstr1.push(spec[i].items[0].id)
        }
        that.setData({
          selectAttridStr: selectAttridstr1,
        });
        for (let i in that.data.stockDetail) {
          var selectAttridStr = that.data.selectAttridStr
          that.data.stockDetail[i].dctPrice = parseFloat((that.data.stockDetail[i].dctPrice).toFixed(2))
          if (selectAttridStr == i) {
            that.setData({
              stockDetail1: that.data.stockDetail[i],
              quantity: that.data.stockDetail[i].quantity,
              cashMoney: that.data.stockDetail[i].cashbackItems ? that.data.stockDetail[i].cashbackItems[0].totalAmount : '',
              cashbackId: that.data.stockDetail[i].cashbackItems ? that.data.stockDetail[i].cashbackItems[0].cashbackId : '',
              activeIndex: 0
            })
          }
        }
        //爆品推荐
        that.initgetMore1();
      } else if (res.data.messageCode == "MSG_4002") {
        that.setData({
          xiajia: true
        })
      } else {
        wx.showToast({
          title: res.data.message,
          icon: "none"
        })
      }
    })
  },
  // 商品专区
  getGoodsArea: function() {
    var that = this
    app.Util.ajax('mall/mdse/activity/goodsDetail', {
      goodsId: parseInt(that.data.goodsId),
      activityId: parseInt(that.data.commodity)
    }, 'GET').then((res) => {
      if (res.data.messageCode == "MSG_1001") {
        var saveAmount = ((res.data.content.orgPrice) - (res.data.content.dctPrice)).toFixed(2)
        that.setData({
          imageUrls: res.data.content.imageUrls,
          detail: res.data.content,
          competitorPrices: res.data.content.competitorPrices.length > 0 ? res.data.content.competitorPrices : [],
          store: res.data.content.store,
          spec: res.data.content.specs,
          introductions: res.data.content.introductions,
          stockDetail: res.data.content.stockDetail,
          iconUrl: res.data.content.specs[0].items[0].iconUrl,
          saveAmount: saveAmount,
          saveMoney: res.data.content.cashBack ? (parseFloat(saveAmount) + parseFloat(res.data.content.cashBack.totalAmount)).toFixed(2) : '',
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
        var selectAttridstr1 = []
        for (var i = 0; i < size; i++) {
          selectAttridstr1.push(spec[i].items[0].id)
        }
        that.setData({
          selectAttridStr: selectAttridstr1,
        });
        for (let i in that.data.stockDetail) {
          var selectAttridStr = that.data.selectAttridStr
          that.data.stockDetail[i].dctPrice = parseFloat((that.data.stockDetail[i].dctPrice).toFixed(2))
          if (selectAttridStr == i) {
            that.setData({
              stockDetail1: that.data.stockDetail[i],
              quantity: that.data.stockDetail[i].quantity,
              cashMoney: that.data.stockDetail[i].cashbackItems ? that.data.stockDetail[i].cashbackItems[0].totalAmount : '',
              cashbackId: that.data.stockDetail[i].cashbackItems ? that.data.stockDetail[i].cashbackItems[0].cashbackId : '',
              activeIndex: 0
            })
          }
        }
        if (that.data.detail.activityItem) {
          if (that.data.detail.activityItem.status == 1) {
            that.setData({
              goodsText1: '当前活动还未开始',
              show3: true
            })
          } else if (that.data.detail.activityItem.status == 3 || that.data.detail.activityItem.status == 4) {
            that.setData({
              goodsText1: '当前活动已结束',
              show3: true
            })
          }
        }
        //爆品推荐
        that.initgetMore1();
      } else if (res.data.messageCode == "MSG_4002") {
        that.setData({
          xiajia: true
        })
      } else {
        wx.showToast({
          title: res.data.message,
          icon: "none"
        })
      }
    })
  },
  //客服
  service: function() {
    var that = this
    app.Util.ajax('mall/contact', 'GET').then((res) => { // 使用ajax函数
      if (res.messageCode = 'MSG_1001') {
        that.setData({
          content: res.data.content ? res.data.content : ''
        })
      }
    })
  },
  //爆品推荐
  initgetMore1: function() {
    var that = this
    var pageNumber = that.data.pageNumber
    app.Util.ajax('mall/home/goods', {
      categoryId: that.data.detail.categoryId,
      excludedGoodsId: that.data.detail.id,
      sortBy: 1,
      pageNumber: pageNumber,
      pageSize: that.data.pageSize
    }, 'GET').then((res) => { // 使用ajax函数
      if (res.data.messageCode = 'MSG_1001') {
        res.data.content.items.forEach((v, i) => {
          v.truePrice = parseFloat((v.dctPrice - v.marketingCashBack.totalAmount).toFixed(2))
        })
        that.setData({
          list: res.data.content.items,
        })
      }
    })
  },
  //加载更多
  getMore1: function() {
    var that = this
    var pageNumber = that.data.pageNumber + 1
    //品质优选
    app.Util.ajax('mall/home/goods', {
      categoryId: that.data.detail.categoryId,
      excludedGoodsId: that.data.detail.id,
      sortBy: 1,
      pageNumber: pageNumber,
      pageSize: that.data.pageSize
    }, 'GET').then((res) => { // 使用ajax函数
      if (res.data.messageCode = 'MSG_1001') {
        if (res.data.content.items == '' && that.data.list !== '') {
          that.setData({
            text: '已到底，去【寻商品】提交吧'
          })
        }
        var arr = that.data.list
        res.data.content.items.forEach((v, i) => {
          v.truePrice = parseFloat((v.dctPrice - v.marketingCashBack.totalAmount).toFixed(2))
          arr.push(res.data.content.items[i])
        })
        that.setData({
          list: arr,
          pageNumber: pageNumber
        })
      }
    })
  },
  // 商品评论
  comment: function() {
    var that = this
    app.Util.ajax('mall/interact/queryUserInteract', {
      pageNumber: that.data.pageNumber,
      pageSize: that.data.pageSize,
      goodsId: that.data.goodsId
    }, 'GET').then((res) => {
      if (res.data.messageCode == 'MSG_1001') {
        if (res.data.content.items.length > 0) {
          res.data.content.items[0].createTime = time.formatTimeTwo(res.data.content.items[0].createTime, 'Y-M-D h:m')
        }
        that.setData({
          goodInteractRate: res.data.content.goodInteractRate,
          comment: res.data.content.items
        })
      }
    })
  },
  comment2: function(goodsId) {
    var that = this
    app.Util.ajax('mall/interact/queryUserInteract', {
      pageNumber: that.data.pageNumber,
      pageSize: that.data.pageSize,
      goodsId: goodsId
    }, 'GET').then((res) => {
      if (res.data.messageCode == 'MSG_1001') {
        if (res.data.content.items.length > 0) {
          res.data.content.items[0].createTime = time.formatTimeTwo(res.data.content.items[0].createTime, 'Y-M-D h:m')
        }
        that.setData({
          goodInteractRate: res.data.content.goodInteractRate,
          comment: res.data.content.items
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
  onShow: function(options) {
    let that = this;
    that.setData({
      pageNumber: 1,
      num: 1,
    })
    // 请求商品详情
    if (that.data.stages) {
      that.getGoodsStages()
    } else if (that.data.commodity || wx.getStorageSync("isCommodity")) {
      that.getGoodsArea()
    } else if (that.data.newPeopleActivity == 2 || wx.getStorageSync("isNewPeopleActivity")) {
      that.newPeopleGoodsData()
    } else {
      that.getGoodsData()
    }
    //商品评论
    that.comment();
    //客服
    that.service();
  },

  /**
   * 生命周期函数 -- 监听页面隐藏
   */
  onHide: function() {
    wx.removeStorageSync('params')
  },

  /**
   * 生命周期函数 -- 监听页面卸载
   */
  onUnload: function() {
    var that = this
    app.globalData.freeBuyYinDao = 1
    wx.removeStorageSync('stages')
    wx.removeStorageSync('goods_id')
    setTimeout(function() {
      wx.removeStorageSync('isNewPeopleActivity')
      wx.removeStorageSync('isCommodity')
    }, 15000)
    newpeoplecount1 = true
    newpeoplecount2 = true
    that.setData({
      isOrder: false
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    var that = this;
    that.getMore1();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(res) {
    var that = this
    if (res.from == "button") {
      if (res.target.id === 'btn') {
        // 来自页面内转发按钮
        that.setData({
          showModalStatus1: false
        })
        var mode;
        if (that.data.activityId) {
          mode = 15
        } else if (that.data.newPeopleActivity == 2) {
          mode = 14
        } else {
          mode = 1
        }
        app.Util.ajax('mall/weChat/sharing/onSuccess', {
          mode: mode
        }, 'POST').then((res) => {
          if (res.data.content) {
            wx.showToast({
              title: '分享成功',
              icon: 'none'
            })
          } else {}
        })
        return {
          title: that.data.shareList.desc,
          path: that.data.shareList.link,
          imageUrl: that.data.shareImg,
          success: function(res) {

          },
          fail: function(res) {
            // 转发失败
            console.log("转发失败:" + JSON.stringify(res));
          }
        }
      } else if (res.target.id === 'btnGroup') {
        that.setData({
          showModalStatus1: false
        })
        var mode;
        if (that.data.activityId) {
          mode = 15
        } else if (that.data.newPeopleActivity == 2) {
          mode = 14
        } else {
          mode = 1
        }
        app.Util.ajax('mall/weChat/sharing/onSuccess', {
          mode: mode
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
          imageUrl: that.data.shareImg,
        }
      }
    } else {
      var mode;
      if (that.data.activityId) {
        mode = 15
      } else if (that.data.newPeopleActivity == 2) {
        mode = 14
      } else {
        mode = 1
      }
      app.Util.ajax('mall/weChat/sharing/onSuccess', {
        mode: mode
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
        path: that.data.shareList.link,
        imageUrl: that.data.shareImg,
        success: function(res) {

        },
        fail: function(res) {
          // 转发失败
          console.log("转发失败:" + JSON.stringify(res));
        }
      }
    }

  },
  /* 点击减号 */
  bindMinus: function() {
    var that = this
    if (that.data.options.source) {
      return false;
    } else {
      var num = that.data.num;
      // 如果大于1时，才可以减
      if (num > 1) {
        num--;
      }else if (num <= 1) {
        wx.showToast({
          title: '不能再少了哟',
          icon: 'none'
        })
      }
      // 只有大于一件的时候，才能normal状态，否则disable状态
      var minusStatus = num <= 1 ? 'disabled' : 'normal';
      // 将数值与状态写回
      that.setData({
        num: num,
        minusStatus: minusStatus
      });
    }
  },
  bindPlus: function() {
    var that = this
    var that = this
    if (that.data.options.source) {
      return false;
    } else {
      var num = that.data.num;
      // 不作过多考虑自增1
      if (num >= that.data.quantity) {
        wx.showToast({
          title: '给别人留点吧',
          icon: 'none'
        })
      } else {
        num++;
      }
      // 只有大于一件的时候，才能normal状态，否则disable状态
      var minusStatus = num < 1 ? 'disabled' : 'normal';
      var plusStatus = (num >= that.data.quantity) ? 'disabled' : 'normal';
      // 将数值与状态写回
      that.setData({
        num: num,
        minusStatus: minusStatus,
        plusStatus: plusStatus
      });
    }
  },
  /* 输入框事件 */
  bindManual: function(e) {
    var that = this
    var num = e.detail.value;
    if (isNaN(num)) {
      num = 1;
    }
    // 将数值与状态写回
    that.setData({
      num: parseInt(num)
    });
  },
  /* 点击减号 */
  bindMinus2: function() {
    var that = this
    var num2 = that.data.num2;
    // 如果大于1时，才可以减
    if (num2 > 1) {
      num2--;
    }
    if (num2 <= 1) {
      wx.showToast({
        title: '不能再少了哟',
        icon: 'none'
      })
    }
    // 只有大于一件的时候，才能normal状态，否则disable状态
    var minusStatus = num2 <= 1 ? 'disabled' : 'normal';
    // 将数值与状态写回
    that.setData({
      num2: num2,
      minusStatus: minusStatus
    });
  },
  bindPlus2: function() {
    var that = this
    var num2 = that.data.num2;
    // 不作过多考虑自增1
    if (num2 >= that.data.quantity2) {
      wx.showToast({
        title: '给别人留点吧',
        icon: 'none'
      })
    } else {
      num2++;
    }
    // 只有大于一件的时候，才能normal状态，否则disable状态
    var minusStatus = num2 < 1 ? 'disabled' : 'normal';
    var plusStatus = (num2 >= that.data.quantity2) ? 'disabled' : 'normal';
    // 将数值与状态写回
    that.setData({
      num2: num2,
      minusStatus: minusStatus,
      plusStatus: plusStatus
    });
  },
  /* 输入框事件 */
  bindManual2: function(e) {
    var that = this
    var num2 = e.detail.value;
    if (isNaN(num2)) {
      num2 = 1;
    }
    // 将数值与状态写回
    that.setData({
      num2: parseInt(num2)
    });
  },
  xiajia: function() {
    this.setData({
      xiajia: false
    })
  },
  toindex: function() {
    wx.setStorageSync('params', 1)
    wx.switchTab({
      url: '/pages/index/index',
    })
  },
  toReturn: function() {
    wx.navigateBack({})
  },
  toIndex:function(){
    wx.switchTab({
      url: '/pages/newIndex/newIndex',
    })
  },
  toSponsor: function(e) {
    var that = this
    var token = wx.getStorageSync('token')
    if (token) {
      if (that.data.isOrder == false) {
        var goodsId = e.currentTarget.dataset.goodsid
        var stockId = e.currentTarget.dataset.stockid
        var quantity = e.currentTarget.dataset.quantity
        var supportCount = e.currentTarget.dataset.supportcount
        if (that.data.num > 1) {
          wx.showToast({
            title: '赞助每次仅限一个数量',
            icon: 'none'
          })
          that.setData({
            num: 1
          })
        } else {
          wx.navigateTo({
            url: '/packageB/pages/applyZero/applyZero?sponsor=1&&goodsId=' + goodsId + '&&stockId=' + stockId + '&&quantity=' + quantity + '&&supportCount=' + supportCount
          })
          that.setData({
            showModalStatus: false,
            zero: false
          })
        }
      } else {
        wx.showToast({
          title: '抱歉预售返现服务不支持赞助。',
          icon: 'none'
        })
      }
    } else {
      wx.navigateTo({
        url: "/pages/invitationCode/invitationCode?inviterCode=" + that.data.inviterCode
      })
      that.setData({
        num: 1
      })
      that.setData({
        showModalStatus: false,
        zero: false
      })
    }
  },
  toSponsorDetail: function(e) {
    var id = e.currentTarget.dataset.sponsorid
    wx.navigateTo({
      url: "/pages/toSponsor/toSponsor?id=" + id
    })
    that.setData({
      showModalStatus: false,
      zero: false
    })
  },
  toIndex2: function() {
    wx.switchTab({
      url: '/pages/index/index'
    })
  },

  //发布订单
  getOrder(e) {
    let that = this
    let img = e.currentTarget.dataset.iconurl
    let iconurl = img ? img.split('?') : null
    let iconurl1 = iconurl ? iconurl[0] : null
    wx.setStorageSync('iconurl', iconurl1 ? iconurl[1] : null)
    if (that.data.showText2 == '选好了，下一步') {
      let data = {
        dctprice: e.currentTarget.dataset.dctprice,
        name: e.currentTarget.dataset.name,
        spec: e.currentTarget.dataset.spec,
        stockid: e.currentTarget.dataset.stockid,
        iconurl: iconurl1,
        expressfee: e.currentTarget.dataset.expressfee,
        quantity: e.currentTarget.dataset.num,
        searchOrder: that.data.options.searchOrder
      }
      let getOrder = JSON.stringify(data)
      if (e.currentTarget.dataset.quantity1 == 0) {
        wx.showToast({
          title: '所选商品库存为0不可发布',
          icon: 'none'
        })
      } else {
        if (that.data.options.searchOrder == 1) {
          wx.navigateTo({
            url: "/packageA/pages/getMoneyMessage/getMoneyMessage?getOrder=" + getOrder
          })
        } else if (that.data.options.searchOrder == 2) {
          wx.navigateTo({
            url: "/packageA/pages/saveMoneyMessage/saveMoneyMessage?getOrder=" + getOrder
          })
        }
      }
    } else if (that.data.showText2 == '下一步') {
      if (e.currentTarget.dataset.quantity1 == 0) {
        wx.showToast({
          title: '所选商品库存为0不可购买',
          icon: 'none'
        })
      } else {
        let data = {
          quantity: e.currentTarget.dataset.quantity,
          source: e.currentTarget.dataset.source,
          topicid: e.currentTarget.dataset.topicid,
          stock: e.currentTarget.dataset.stockid,
          goodsid: e.currentTarget.dataset.goodsid
        }
        let getOrder = JSON.stringify(data)
        wx.navigateTo({
          url: '/packageB/pages/applyZero/applyZero?getOrder=' + getOrder,
        })
      }
    }
  },
  closeyindao1:function(){
    this.setData({
      yindao1:false
    })
  },
  closeyindao2:function(){
    let that = this
    that.setData({
      yindao2:false
    })
    setTimeout(function(){
      that.setData({
        zero: true,
        showModalStatus: true,
        isCart: false
      })
    },200)
  },
  closeyindao:function(){
    let that = this
    that.setData({
      yindao1:false
    })
    app.globalData.freeBuyYinDao = 2
  }
})