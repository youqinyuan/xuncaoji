// pages/detail/detail.js
var time = require('../../utils/util.js');
let app = getApp()
var selectIndex; //选择的大规格key
var attrIndex; //选择的小规格的key
var selectIndexArray = []; //选择属性名字的数组
var selectAttrid = []; //选择的属性id
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
    cashbackItems: [],
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
    selectAttridStr: '',
    pageNumber: 1,
    pageSize: 6,
    text: '',
    comment: [], //商品评论
    goodInteractRate: '', //好评率
    // goodsId: 1, //商品id
    shareList: {},//分享数据
    sharingProfit: '',//分享返利
    quantity: 1, //库存
    saveAmount: 1, //省钱
    showPassword: false, //设置支付密码弹框
    password: 1,
    count:'',//购物车种类个数
    options:{},
    activeIndex:'',//选中的index
    showService: false //客服弹框
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
    var sharingProfit = e.currentTarget.dataset.profit ? e.currentTarget.dataset.profit:''
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
      }
    })
  },
  //跳转到购物车
  toCart: function(e) {
    let token = wx.getStorageSync('token')
    if (token) {
      app.nav(e)
    } else {
      wx.navigateTo({
        url: "/pages/invitationCode/invitationCode"
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
      phoneNumber: that.data.content.servicePhone // 仅为示例，并非真实的电话号码
    })
  },
  hideService:function(){
    var that = this;
    that.setData({
      showService: false
    })
  },
  //跳转到提交订单
  toPlaceorder: function(e) {
    var goodsId = e.currentTarget.dataset.goodsid
    var stockId = e.currentTarget.dataset.stockid
    var quantity = e.currentTarget.dataset.quantity
    var cashbackId = e.currentTarget.dataset.cashbackid ? e.currentTarget.dataset.cashbackid : ''
    var token = wx.getStorageSync('token')
    if (token) {
      if (this.data.password === 1) {
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
        }else {
          wx.navigateTo({
            url: `/pages/placeorder/placeorder?goodsId=${goodsId}&stockId=${stockId}&quantity=${quantity}&cashbackId=${cashbackId}`,
          })
          this.setData({
            showModalStatus: false,
            num: 1
          })
        }
      } else{
        this.setData({
          showPassword: true,
          showModalStatus: false,
          num: 1
        })
      }
    } else {
      wx.navigateTo({
        url: '/pages/invitationCode/invitationCode'
      })
      this.setData({
        showModalStatus: false,
        num: 1
      })
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
      if (this.data.password === 1) {
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
            } else if (this.data.num<1){
              wx.showToast({
                title: '不能再少了哟',
                icon: 'none'
              })
            }else{
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
        this.setData({
          showPassword: true,
          showModalStatus: false,
          num:1
        })
      }
    } else {
      wx.navigateTo({
        url: "/pages/invitationCode/invitationCode"
      })
    }
  },
  cancel: function() {
    var that = this
    that.setData({
      showPassword: false
    })
  },
  sure: function() {
    var that = this
    that.setData({
      showPassword: false
    })
    wx.navigateTo({
      url: '/pages/paypassword/paypassword',
    })
  },
  //选中返现
  clickCashback: function(e) {
    var that = this
    var id = e.currentTarget.dataset.id
    var cur = e.currentTarget.dataset.gindex
    that.setData({
      cashbackId: id,
      activeIndex:cur
    })
  },
  //选中规格
  clickAttr: function(e) {
    var selectIndex = e.currentTarget.dataset.selectIndex; //选择大规格的id
    var attrIndex = e.currentTarget.dataset.attrIndex;
    var spec = this.data.spec;
    var count = spec[selectIndex].items.length;
    for (var i = 0; i < count; i++) {
      spec[selectIndex].items[i].isSelect = false;
    }
    spec[selectIndex].items[attrIndex].isSelect = true;
    var attrid = spec[selectIndex].items[attrIndex].id;
    selectAttrid[selectIndex] = attrid;
    var selectIndexArraySize = selectIndexArray.length;
    this.setData({
      spec: spec, //变换选择框,
      selectAttrid: selectAttrid,
      selectAttridStr: this.data.selectAttrid.join(",")
    })
    for (let i in this.data.stockDetail) {
      if (this.data.selectAttridStr == i) {
        if (this.data.stockDetail[i].cashbackItems) {
          this.setData({
            cur: this.data.stockDetail[i].cashbackItems[0].period
          })
        }
        this.setData({
          stockDetail1: this.data.stockDetail[i],
          quantity: this.data.stockDetail[i].quantity,
          cashbackItems: this.data.stockDetail[i].cashbackItems,
          cashbackId: this.data.stockDetail[i].cashbackItems ? this.data.stockDetail[i].cashbackItems[0].cashbackId : ''
        })
      }
    }
  },
  //点击我显示底部弹出框
  clickme: function() {
    this.showModal();
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
    that.setData({
      goodsId: parseInt(options.id),
      options:options
    })
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
          iconUrl: res.data.content.specs[0].items,
          saveAmount: ((res.data.content.orgPrice) - (res.data.content.dctPrice)).toFixed(2)
        })
        for (var i = 0; i < this.data.spec.length; i++) {
          let items = this.data.spec[i].items
          items[0]['isSelect'] = true
        }
        this.setData({
          spec: this.data.spec
        })
        //初始化规格选择
        var spec = this.data.spec
        var size = spec.length;
        var index = 0;
        for (var i = 0; i < size; i++) {
          selectIndexArray.push({
            key: i,
            value: spec[i].items[0].name
          });
          var selectAttrid1 = spec[i].items[0].id
          this.data.selectAttridstr += selectAttrid1 + ','
          var selectAttridstr1 = this.data.selectAttridstr
          var reg = /,$/gi;
          selectAttridstr1 = selectAttridstr1.replace(reg, "");
        }
        this.setData({
          selectAttrid: selectAttrid,
          selectAttridStr: selectAttridstr1
        });
        for (let i in this.data.stockDetail) {
          if (this.data.selectAttridStr == i) {
            this.setData({
              stockDetail1: this.data.stockDetail[i],
              quantity: this.data.stockDetail[i].quantity,
              cashbackItems: this.data.stockDetail[i].cashbackItems,
              cashbackId: this.data.stockDetail[i].cashbackItems ? this.data.stockDetail[i].cashbackItems[0].cashbackId : '',
              activeIndex:0
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
    //是否设置支付密码
    that.setPassword();
  },
  queryCount:function(){
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
    app.Util.ajax('mall/personal/dashboard', 'GET').then((res) => { // 使用ajax函数
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
      sortBy :1,
      pageNumber: pageNumber,
      pageSize: that.data.pageSize
    }, 'GET').then((res) => { // 使用ajax函数
      if (res.messageCode = 'MSG_1001') {
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
        for (var i = 0; i < res.data.content.items.length; i++) {
          arr.push(res.data.content.items[i])
        }
        that.setData({
          recommend: arr,
        })
        that.setData({
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
  setPassword:function(){
    var that = this
    //是否设置支付密码
    app.Util.ajax('mall/account/paymentPassword/status', 'GET').then((res) => { // 使用ajax函数
      if (res.messageCode = 'MSG_1001') {
        that.setData({
          password: res.data.content
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
  onPullDownRefresh: function() {
  },

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
  onShareAppMessage: function(ops) {
    var that = this
    if (ops.from === 'button') {
      // 来自页面内转发按钮
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
    }
    return {
      title: that.data.shareList.title,
      path: that.data.shareList.link,
      imageUrl: that.data.shareList.imageUrl,
      success: function(res) {

      },
      fail: function(res) {
        // 转发失败
        console.log("转发失败:" + JSON.stringify(res));
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