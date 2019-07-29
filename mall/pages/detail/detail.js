// pages/detail/detail.js
var time = require('../../utils/util.js');
let app = getApp()
var selectIndex; //选择的大规格key
var attrIndex; //选择的小规格的key
var selectIndexArray = []; //选择属性名字的数组
var selectAttrid = []; //选择的属性id
var count = true //节流阀-限制购买提交次数
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imageUrls: [],
    detail: {},
    content: {}, //客服电话
    autoplay: true,
    circular: true,
    interval: 2000,
    duration: 1000,
    competitorPrices: [], //竞选天猫
    store: {}, //店铺详情
    dctDetail: {}, //节省，返利
    introductions: [], //店铺详情介绍
    recommend: [], //爆品推荐
    spec: [],
    showModalStatus: false, //商品规格弹框
    showModalStatus1: false, //分享弹框
    iconUrl: {},
    stockDetail: {},
    stockDetail1: {},
    num: 1, //初始数量
    amount: 0, //初始金额
    minusStatus: 'disabled',
    plusStatus: 'disabled',
    selectAttrid: [], //选择的属性id
    selectAttridstr: '',
    pageNumber: 1,
    pageSize: 6,
    text: '',
    comment: [], //商品评论
    goodInteractRate: '', //好评率
    selectName: '', //已选规格
    selectNameArr:[],//已选规格
    shareList: {}, //分享数据
    sharingProfit: '', //分享返利
    quantity: 1, //库存
    saveAmount: 1, //省钱
    count: '', //购物车种类个数
    options: {},
    activeIndex: '', //选中的index
    showService: false, //客服弹框
    inviterCode: '', //邀请码
    current: 0, //轮播图当前索引
    cashMoney: '', //将返现金额
    haibao: false, //海报
    path_img: '', //绘制产品图片路径
    shareData: '', //要分享的数据
    appletQrCodeUrl: '', //邀请码路径
    haibaoImg: '', //生成的海报
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
  //分享
  share: function(e) {
    var that = this
    var goodsId = e.currentTarget.dataset.goodsid
    var sharingProfit = e.currentTarget.dataset.profit ? e.currentTarget.dataset.profit : ''
    that.setData({
      goodsId: goodsId,
      sharingProfit: sharingProfit
    })
    //分享数据
    that.chooseShare()

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
  hideModal: function() {
    var that = this
    that.setData({
      showModalStatus1: false
    })
  },
  //查询分享数据
  chooseShare: function() {
    var that = this
    app.Util.ajax('mall/weChat/sharing/target', {
      mode: 1,
      targetId: that.data.goodsId
    }, 'GET').then((res) => {
      if (res.messageCode = 'MSG_1001') {
        var inviterCode = wx.getStorageSync('inviterCode')
        if (inviterCode) {
          res.data.content.link = res.data.content.link.replace(/{inviterCode}/g, inviterCode)
        } else {
          res.data.content.link = res.data.content.link.replace(/{inviterCode}/g, '')
        }
        that.setData({
          shareList: res.data.content
        })
        that.getShareData()
      }
    })
  },
  // 获取分享数据
  getShareData: function() {
    var that = this
    app.Util.ajax('mall/weChat/sharing/snapshot/target', {
      mode: 1,
      targetId: that.data.goodsId
    }, 'GET').then((res) => {
      if (res.messageCode = 'MSG_1001') {
        that.data.shareData = res.data.content
        // 产品图片路径转化为本地路径
        var imageUrl = res.data.content.imageUrl
        wx.getImageInfo({
          src: imageUrl,
          success(res) {
            that.data.path_img = res.path
          }
        })
        //邀请码转换为本地路径
        var appletQrCodeUrl = res.data.content.appletQrCodeUrl
        wx.getImageInfo({
          src: appletQrCodeUrl,
          success(res) {
            that.data.appletQrCodeUrl = res.path
          }
        })
      }
    })
  },
  //分享到朋友圈
  shareFriend: function() {
    var that = this
    if (that.data.path_img && that.data.appletQrCodeUrl) {
      var width
      var height
      wx.getSystemInfo({
        success(res) {
          width = res.screenWidth
          height = res.screenHeight
        }
      })
      console.log(width, height)
      var ctx = wx.createCanvasContext('mycanvas');
      var path_bg = '/assets/images/icon/bg.png'; //背景图片
      var path_logo = '/assets/images/icon/xuncaoji_icon.png'
      var title = '种草达人的欢乐场'
      var inviterCode = `邀请码: ${that.data.shareData.inviterCode}`
      //绘制图片模板的背景图片
      ctx.drawImage(path_bg, 0, 0, 0.88 * width, 0.89 * height);
      //绘制logo
      ctx.drawImage(path_logo, 0.384 * width, 0.055 * height, 0.133 * width, 0.133 * width);
      // 绘制标题
      ctx.setFontSize(13);
      ctx.setFillStyle('#fff');
      ctx.setTextAlign("center")
      ctx.fillText(title, 0.5 * width * 0.88, 26);
      ctx.stroke();
      console.log(inviterCode)
      if (inviterCode != '邀请码: undefined') {
        // 绘制邀请码
        ctx.setFontSize(20);
        ctx.setFillStyle('#FF517A');
        ctx.fillText(inviterCode, 0.5 * width * 0.88, 0.055 * height + 0.133 * width + 20);
        ctx.stroke();
      }
      ctx.setTextAlign("left")
      // 绘制产品图
      ctx.drawImage(that.data.path_img, 0.068 * width, 0.17 * height, 0.74 * width, 0.327 * height);
      ctx.drawImage('/assets/images/icon/bg_yellow.png', 0.068 * width, 0.418 * height, 0.74 * width, 0.08 * height);
      ctx.setFillStyle('#FF96AF');
      ctx.setStrokeStyle('#FF96AF')
      ctx.beginPath()
      ctx.arc(0.54 * width, 0.2 * height - 5, 10, 1.5 * Math.PI, 0.5 * Math.PI, true)
      ctx.closePath()
      ctx.fill()
      ctx.beginPath()
      ctx.moveTo(0.84 * width - 6, 0.2 * height + 5)
      ctx.lineTo(0.84 * width - 6, 0.2 * height - 15)
      ctx.lineTo(0.54 * width, 0.2 * height - 15)
      ctx.lineTo(0.54 * width, 0.2 * height + 5)
      ctx.lineTo(0.84 * width - 6, 0.2 * height + 5)
      ctx.lineTo(0.84 * width - 12, 0.2 * height + 10)
      ctx.lineTo(0.84 * width - 12, 0.2 * height + 5)
      ctx.closePath()
      ctx.fill();
      ctx.beginPath()
      ctx.setFontSize(12);
      ctx.setFillStyle('#fff');
      ctx.fillText(`已抢数量: ${that.data.shareData.grabbed}`, 0.54 * width, 0.2 * height);
      ctx.stroke();
      ctx.closePath()
      ctx.beginPath()
      ctx.setFontSize(25);
      ctx.setFillStyle('#E33A59');
      ctx.fillText(`¥ ${that.data.shareData.price}`, 0.1 * width, 0.485 * height);
      ctx.closePath()
      ctx.stroke();
      ctx.beginPath()
      ctx.setFillStyle('#FF96AF');
      ctx.setStrokeStyle('#FF96AF')
      ctx.moveTo(0.45 * width - 6, 0.48 * height - 4)
      ctx.lineTo(0.45 * width, 0.48 * height - 8)
      ctx.lineTo(0.45 * width, 0.48 * height - 16)
      ctx.lineTo(0.45 * width + 100, 0.48 * height - 16)
      ctx.lineTo(0.45 * width + 100, 0.48 * height + 8)
      ctx.lineTo(0.45 * width, 0.48 * height + 8)
      ctx.lineTo(0.45 * width, 0.48 * height + 2)
      ctx.lineTo(0.45 * width - 6, 0.48 * height - 4)
      ctx.closePath()
      ctx.fill()
      ctx.beginPath()
      ctx.setFontSize(12);
      ctx.setFillStyle('#fff');
      ctx.fillText(`最高返¥ ${that.data.shareData.cashBack}`, 0.45 * width + 6, 0.48 * height);
      ctx.closePath()
      ctx.stroke();
      // 绘制描述
      ctx.setFontSize(14);
      ctx.setFillStyle('#333');
      var test = that.data.shareData.desc
      let chr = test.split('') // 分割为字符串数组
      let temp = ''
      let row = []
      for (let a = 0; a < chr.length; a++) {
        if (ctx.measureText(temp).width < 0.7 * width) {
          temp += chr[a]
        } else {
          a--
          row.push(temp)
          temp = ''
        }
      }
      row.push(temp)
      for (var b = 0; b < row.length; b++) {
        ctx.fillText(row[b], 0.09 * width, 0.53 * height + b * 20);
      }
      ctx.stroke();
      //绘制邀请码
      ctx.drawImage(that.data.appletQrCodeUrl, 0.3 * width, 0.57 * height, 0.3 * width, 0.3 * width);
      //绘制提示语
      ctx.setFontSize(12);
      ctx.setFillStyle('#999');
      ctx.fillText('长按保存图片或识别二维码查看', 0.20 * width, 0.57 * height + 0.3 * width + 20);
      ctx.stroke();
      ctx.draw()
      setTimeout(function() {
        wx.canvasToTempFilePath({
          canvasId: 'mycanvas',
          success: function(res) {
            console.log('res', res)
            that.data.haibaoImg = res.tempFilePath
          }
        })
      }, 1000)
      that.setData({
        showModalStatus1: false,
        haibao: true
      })
    } else {
      wx.showLoading({
        title: '加载中',
      })
      setTimeout(function() {
        that.shareFriend()
        wx.hideLoading()
      }, 2000)
    }
  },
  // 长按保存到相册
  handleLongPress: function() {
    var that = this
    console.log('长按')
    wx.saveImageToPhotosAlbum({
      filePath: that.data.haibaoImg,
      success(res) {
        wx.showToast({
          title: '图片已保存到相册',
          icon: 'none'
        });
      },
      fail(res) {
        console.log(res)
      }
    })
  },
  //关闭海报分享页面
  close_hb: function() {
    var that = this
    that.setData({
      haibao: false
    })
  },
  //跳转到购物车
  toCart: function(e) {
    var that = this
    let token = wx.getStorageSync('token')
    if (token) {
      app.nav(e)
    } else {
      wx.navigateTo({
        url: "/pages/invitationCode/invitationCode?inviterCode=" + that.data.inviterCode
      })
    }
  },
  //客服
  customerService: function() {
    var that = this;
    that.setData({
      showService: true
    })
  },
  //呼叫
  call: function() {
    var that = this;
    that.setData({
      showService: false
    })
    wx.makePhoneCall({
      phoneNumber: that.data.content.serviceTel // 仅为示例，并非真实的电话号码
    })
  },
  hideService: function() {
    var that = this;
    that.setData({
      showService: false
    })
  },
  //跳转到提交订单
  toPlaceorder: function(e) {
    if (count) { //节流阀-限制订单重复提交
      count = false
      var goodsId = e.currentTarget.dataset.goodsid
      var stockId = e.currentTarget.dataset.stockid
      var quantity = e.currentTarget.dataset.quantity
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
        } else {
          wx.navigateTo({
            url: `/pages/placeorder/placeorder?goodsId=${goodsId}&stockId=${stockId}&quantity=${quantity}&cashbackId=${cashbackId}`,
          })
          this.setData({
            showModalStatus: false,
            num: 1
          })
        }
        count = true
      
    }
  },
  //跳转到评价页面
  jumpEvaluate: function(e) {
    var goodsId = e.currentTarget.dataset.goodsid
    wx.navigateTo({
      url: `/pages/evaluate/evaluate?goodsId=${goodsId}`
    })
  },
  //跳转到店铺详情
  jumpShopsDetail: function(e) {
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/storedetails/storedetails?id=' + id
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
            this.queryCount();
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
    var index = e.currentTarget.dataset.index
    var selectAttridStr = that.data.selectAttridStr
    selectAttridStr[index] = that.data.selectAttrid
    if (!that.data.stockDetail[selectAttridStr]){
      return;
    }
    //计算当前商品返现金额
    that.setData({
      stockDetail1: that.data.stockDetail[selectAttridStr],
      cashMoney: that.data.stockDetail[selectAttridStr].cashbackItems ? that.data.stockDetail[selectAttridStr].cashbackItems[0].totalAmount : '',
      cashbackId: that.data.stockDetail[selectAttridStr].cashbackItems ? that.data.stockDetail[selectAttridStr].cashbackItems[0].cashbackId : '',
    })
  },
  //选中规格
  clickAttr: function(e) {
    var that = this
    var selectIndex = e.currentTarget.dataset.selectIndex; //选择大规格的id
    var attrIndex = e.currentTarget.dataset.attrIndex;
    var name = e.currentTarget.dataset.name;
    var spec = this.data.spec;
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
    if (spec[selectIndex].items[attrIndex].isSelect == true){
      if (spec[selectIndex].items[attrIndex].iconUrl){
        this.setData({
          iconUrl: spec[selectIndex].items[attrIndex].iconUrl
        })
      }
    }
    var attrid = spec[selectIndex].items[attrIndex].id;
    selectAttrid[selectIndex] = attrid;
    var selectIndexArraySize = selectIndexArray.length;
    this.setData({
      spec: spec, //变换选择框,
      selectAttrid: e.currentTarget.dataset.attrId,
    })
    for (let i in this.data.stockDetail) {
      if (this.data.selectAttridStr == i) {
        this.setData({
          quantity: this.data.stockDetail[i].quantity,
          cashbackId: this.data.stockDetail[i].cashbackItems ? this.data.stockDetail[i].cashbackItems[0].cashbackId : ''
        })
      }
    }
  },
  //点击我显示底部弹出框
  clickme: function() {
    var token = wx.getStorageSync('token')
    if (token) {
      this.showModal();
    } else {
      wx.navigateTo({
        url: "/pages/invitationCode/invitationCode?inviterCode=" + this.data.inviterCode
      })
      this.setData({
        num: 1
      })
    }
  },
  //显示分期返弹框
  showModalClick: function() {
    var that = this;
    that.setData({
      showModal: true
    })
  },
  //显示对话框
  showModal: function() {
    // 显示遮罩层
    var that = this
    that.setData({
      showModalStatus: true
    })
  },
  //隐藏对话框
  hideModal: function() {
    // 隐藏遮罩层
    var that = this
    that.setData({
      showModalStatus: false
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    console.log(options)
    if (options.scene) {
      //扫描小程序码进入 -- 解析携带参数
      that.setData({
        options: options
      })
      var scene = decodeURIComponent(options.scene);
      console.log("scene is ", scene);
      var arrPara = scene.split("&");
      console.log(arrPara)
      var arr = [];
      for (var i in arrPara) {
        arr = arrPara[i].split("=");
        console.log(arr)
        if (arr[0] == 'id') {
          that.setData({
            goodsId: parseInt(arr[1]),
          })
        }
      }
    } else {
      //不是扫描小程序码进入
      console.log("no scene");
      that.setData({
        goodsId: parseInt(options.id),
        inviterCode: options.inviterCode || '',
        options: options
      })
      //添加商品id缓存
      wx.setStorage({
        key: "goods_id",
        data: parseInt(options.id)
      })
    }
    app.Util.ajax('mall/home/goodsDetail', {
      id: that.data.goodsId
    }, 'GET').then((res) => { // 使用ajax函数
      if (res.messageCode = 'MSG_1001') {
        that.setData({
          imageUrls: res.data.content.imageUrls,
          detail: res.data.content,
          competitorPrices: res.data.content.competitorPrices.length > 0 ? res.data.content.competitorPrices : [],
          store: res.data.content.store,
          spec: res.data.content.specs,
          introductions: res.data.content.introductions,
          stockDetail: res.data.content.stockDetail,
          iconUrl: res.data.content.specs[0].items[0].iconUrl,
          saveAmount: ((res.data.content.orgPrice) - (res.data.content.dctPrice)).toFixed(2)
        })
        for (var i = 0; i < this.data.spec.length; i++) {
          let items = this.data.spec[i].items
          items[0]['isSelect'] = true
        }
        var name=[];
        for (var a = 0; a < this.data.spec.length; a++) {
          for (var b = 0; b < this.data.spec[a].items.length; b++){
            if (this.data.spec[a].items[b].isSelect == true){
              name.push(this.data.spec[a].items[b].name)
              this.setData({
                selectNameArr:name,
                selectName: name.join('/')
              })
            }
          }
        }
        this.setData({
          spec: this.data.spec
        })
        //初始化规格选择
        var spec = this.data.spec
        var size = spec.length;
        var index = 0;
        var selectAttridstr1 = []
        for (var i = 0; i < size; i++) {
          selectIndexArray.push({
            key: i,
            value: spec[i].items[0].name
          });
          selectAttridstr1.push(spec[i].items[0].id)
        }
        this.setData({
          selectAttrid: selectAttrid,
          selectAttridStr: selectAttridstr1,
        });
        for (let i in this.data.stockDetail) {
          var selectAttridStr = this.data.selectAttridStr
          this.data.stockDetail[i].dctPrice = parseFloat((this.data.stockDetail[i].dctPrice).toFixed(2))
          if (selectAttridStr == i) {
            this.setData({
              stockDetail1: this.data.stockDetail[i],
              quantity: this.data.stockDetail[i].quantity,
              cashMoney: this.data.stockDetail[i].cashbackItems ? this.data.stockDetail[i].cashbackItems[0].totalAmount : '',
              cashbackId: this.data.stockDetail[i].cashbackItems ? this.data.stockDetail[i].cashbackItems[0].cashbackId : '',
              activeIndex: 0
            })
          }
        }
        //爆品推荐
        that.initgetMore1()
      }
    })
    //商品评论
    that.comment();
    //客服
    that.service();
    //购物车种类
    that.queryCount();
    //查询分享数据
    that.chooseShare()
  },
  queryCount: function() {
    //查询商品数量
    var that = this
    app.Util.ajax('mall/cart/count', 'GET').then((res) => { // 使用ajax函数
      if (res.messageCode = 'MSG_1001') {
        let a = res.data.content
        that.setData({
          count: a > 99 ? '99+' : res.data.content
        })
      }
    })
  },
  //service
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
      if (res.messageCode = 'MSG_1001') {
        res.data.content.items.forEach((v, i) => {
          v.truePrice = parseFloat((v.dctPrice - v.marketingCashBack.totalAmount).toFixed(2))
        })
        that.setData({
          recommend: res.data.content.items,
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
      if (res.messageCode = 'MSG_1001') {
        if (res.data.content.items == '' && that.data.recommend !== '') {
          that.setData({
            text: '已经到底啦'
          })
        }
        var arr = that.data.recommend
        res.data.content.items.forEach((v, i) => {
          v.truePrice = parseFloat((v.dctPrice - v.marketingCashBack.totalAmount).toFixed(2))
          arr.push(res.data.content.items[i])
        })
        that.setData({
          recommend: arr,
          pageNumber: pageNumber
        })
      }
    })
  },
  //商品评论
  comment: function() {
    var that = this
    app.Util.ajax('mall/interact/queryUserInteract', {
      pageNumber: that.data.pageNumber,
      pageSize: that.data.pageSize,
      goodsId: that.data.goodsId
    }, 'GET').then((res) => {
      if (res.messageCode = 'MSG_1001') {
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
  onShow: function() {
    var that = this;
    that.setData({
      pageNumber: 1
    })
    that.onLoad(that.data.options)
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
    // wx.reLaunch({
    //   url: '/pages/index/index'
    // })
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
        console.log(res.target.id)
        that.setData({
          showModalStatus1: false
        })
        app.Util.ajax('mall/weChat/sharing/onSuccess', {
          mode: 1
        }, 'POST').then((res) => {
          if (res.data.content) {
            wx.showToast({
              title: '分享成功',
              icon: 'none'
            })
          } else {
            wx.showToast({
              title: res.data.message,
              icon: 'none'
            })
          }
        })
        return {
          title: that.data.shareList.desc,
          path: that.data.shareList.link,
          imageUrl: that.data.shareList.imageUrl,
          success: function(res) {

          },
          fail: function(res) {
            // 转发失败
            console.log("转发失败:" + JSON.stringify(res));
          }
        }
      }
    } else {
      app.Util.ajax('mall/weChat/sharing/onSuccess', {
        mode: 1
      }, 'POST').then((res) => {
        if (res.data.content) {
          wx.showToast({
            title: '分享成功',
            icon: 'none'
          })
        } else {
          wx.showToast({
            title: res.data.message,
            icon: 'none'
          })
        }
      })
      return {
        title: that.data.shareList.desc,
        path: that.data.shareList.link,
        imageUrl: that.data.shareList.imageUrl,
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
    var num = this.data.num;
    // 如果大于1时，才可以减
    if (num > 1) {
      num--;
    }
    if (num <= 1) {
      wx.showToast({
        title: '不能再少了哟',
        icon: 'none'
      })
    }
    // 只有大于一件的时候，才能normal状态，否则disable状态
    var minusStatus = num <= 1 ? 'disabled' : 'normal';
    // 将数值与状态写回
    this.setData({
      num: num,
      minusStatus: minusStatus
    });
  },
  bindPlus: function() {
    var num = this.data.num;
    // 不作过多考虑自增1

    if (num >= this.data.quantity) {
      wx.showToast({
        title: '给别人留点吧',
        icon: 'none'
      })
    } else {
      num++;
    }
    // 只有大于一件的时候，才能normal状态，否则disable状态
    var minusStatus = num < 1 ? 'disabled' : 'normal';
    var plusStatus = (num >= this.data.quantity) ? 'disabled' : 'normal';
    // 将数值与状态写回
    this.setData({
      num: num,
      minusStatus: minusStatus,
      plusStatus: plusStatus
    });
  },
  /* 输入框事件 */
  bindManual: function(e) {
    var num = e.detail.value;
    if (isNaN(num)) {
      num = 1;
    }
    // 将数值与状态写回
    this.setData({
      num: parseInt(num)
    });
  },
})