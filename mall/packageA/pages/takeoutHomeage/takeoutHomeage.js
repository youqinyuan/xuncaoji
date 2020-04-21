// packageA/pages/takeoutHomeage/takeoutHomeage.js
let app = getApp();
let selectIndex; //选择的大规格key
let attrIndex; //选择的小规格的key
let selectAttrid = []; //选择的属性id
let count = true //节流阀-限制购买提交次数
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTab: 0,
    hostUrl: app.Util.getUrlImg().hostUrl,
    navData: [], //店铺分类
    store: null,//店铺详情
    list: [],
    pageNumber: 1, //分页记录数
    pageSize: 20, //分页大小
    storeId: null, //店铺Id
    shoppingCart: null, //查询购物车
    fixed: 1,
    merchantCategoryId: 0,
    showText: '关注',
    bgColor: '#AAAAAA', //按钮颜色
    showOrder: false, //弹窗
    num: 1,
    iconUrl: null,
    stockDetail: null,
    stockDetail1: null,
    quantity: null, //库存
    cashMoney: '', //将返现金额
    selectName: '', //已选规格名字
    selectNameArr: [], //已选规格名字
    minusStatus: 'disabled',
    plusStatus: 'disabled',
    selectAttrid: [], //选择的属性id
    spec: null, //规格
    goodsId: null, //商品id
    showModal:false,//清空购物车弹窗
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this
    //缓存为去登陆返回加载店铺数据
    if(options.storeId){
      wx.setStorageSync('takeoutStoreId',parseInt(options.storeId) )
    }
    if(options.goodsId){
      wx.setStorageSync('takeoutGoodsId',options.goodsId)
    }
    that.setData({
      storeId: parseInt(options.id) ||wx.getStorageSync('takeoutStoreId')
    })
    if(options.inviterCode){
      wx.setStorageSync('othersInviterCode',options.inviterCode)
      that.setData({
        inviterCode:options.inviterCode
      })
    }
    if(!options.goodsId){
      //取消缓存商品id对参数没有商品id时的影响
      wx.removeStorageSync('takeoutGoodsId')
    }
    if(options.goodsId||wx.getStorageSync('takeoutGoodsId')){
      that.setData({
        goodsId:options.goodsId||wx.getStorageSync('takeoutGoodsId')
      })
      that.showOrder2()
    }
    that.init();
    that.initgetMore();
    that.initStore();
    
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
    let that = this
    //查询购物车
    if (wx.getStorageSync('token')) {
      that.queryCart()
    }
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
    let that = this
    that.getMore()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  getHeight1() {
    let that = this;
    setTimeout(() => {
      wx.createSelectorQuery().selectAll('.section-wrapper').boundingClientRect(function(rect) {
        that.setData({
          heightView: rect[0].top
        })
      }).exec();
    }, 300)
  },
  onPageScroll(e) {
    let that = this
    if (e.scrollTop > that.data.heightView) {
      that.setData({
        fixed: 2
      })
    } else if (e.scrollTop < 50) {
      that.setData({
        fixed: 1
      })
    }
  },
  switchNav(e) {
    let that = this;
    let index = e.currentTarget.dataset.index
    let id = e.currentTarget.dataset.id
    that.setData({
      currentTab: index,
      merchantCategoryId: id,
      pageNumber: 1
    })
    that.initgetMore()
  },
  //店铺细节
  init() {
    let that = this;
    app.Util.ajax('mall/home/store/categories', {
      storeId: that.data.storeId,
    }, 'GET').then((res) => {
      if (res.data.content) {
        that.setData({
          navData: res.data.content
        })
      }
    })

  },
  initStore() {
    let that = this;
    app.Util.ajax('mall/home/storeDetail', {
      id: that.data.storeId
    }, 'GET').then((res) => {
      if (res.data.content) {
        if (res.data.content.isFollow == 2) {
          that.setData({
            showText: '关注'
          })
        } else {
          that.setData({
            showText: '已关注'
          })
        }
        that.setData({
          store: res.data.content
        })
        that.getHeight1();
      }else{
        that.setData({
          store: null
        })
      }
    })
  },
  //店铺商品
  initgetMore: function() {
    let that = this
    let pageNumber = that.data.pageNumber
    let data = {
      storeId: that.data.storeId,
      pageNumber: pageNumber,
      pageSize: that.data.pageSize,
      merchantCategoryId: that.data.merchantCategoryId
    }
    app.Util.ajax('mall/home/store/goods', data, 'GET').then((res) => {
      if (res.data.messageCode = 'MSG_1001') {
        res.data.content.items.forEach((v, i) => {
          v.truePrice = parseFloat((v.dctPrice - v.marketingCashBack.totalAmount).toFixed(2))
        })
        that.setData({
          list: res.data.content.items
        })
      }
    })
  },
  //加载更多店铺商品
  getMore() {
    let that = this
    let pageNumber = that.data.pageNumber + 1
    let data = {
      storeId: that.data.storeId,
      pageNumber: pageNumber,
      pageSize: that.data.pageSize
    }
    app.Util.ajax('mall/home/store/goods', data, 'GET').then((res) => {
      if (res.data.messageCode = 'MSG_1001') {
        if (res.data.content.items == '' && that.data.list !== '') {
          wx.showToast({
            title: '已经到底啦',
            icon: 'none'
          })
        }
        let arr = that.data.list
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
  //查询购物车
  queryCart() {
    let that = this
    app.Util.ajax('mall/bag/queryShoppingCart', {
      storeId: that.data.storeId
    }, 'GET').then((res) => {
      if (res.data.messageCode == 'MSG_1001') {
        if (res.data.content.goodsCount==0){
          that.setData({
            shoppingCart: null
          })
        }else{
          res.data.content.goodsCount = res.data.content.goodsCount > 99 ? '99+' : res.data.content.goodsCount
          that.setData({
            shoppingCart: res.data.content
          })
        }       
        if (that.data.shoppingCart) {
          that.setData({
            bgColor: '#FF2644'
          })
        } else {
          that.setData({
            bgColor: '#AAAAAA'
          })
        }
      }
    })
  },
  //删除购物车
  delete(){
    let that = this
    that.setData({
      showModal: true
    })
  },
  need() {
    let that = this
    app.Util.ajax('mall/bag/deleteBatch?storeId=' + that.data.storeId, null, 'DELETE').then((res) => {
      if (res.data.messageCode = 'MSG_1001') {
        that.queryCart()
        that.setData({
          showModal: false
        })
      }
    })
  },
  noNeed: function (e) {
    let that = this
    that.setData({
      showModal: false
    })
  },
  //规格弹框
  showOrder(e) {
    let that = this
    if (that.data.store.status == 2) {
      return false;
    } else if (that.data.store.status == 1) {
      that.setData({
        goodsId: e.currentTarget.dataset.id
      })
      app.Util.ajax('mall/home/goodsDetail', {
        id: that.data.goodsId
      }, 'GET').then((res) => {
        if (res.data.messageCode == "MSG_1001") {
          that.setData({
            stockDetail: res.data.content.stockDetail,
            iconUrl: res.data.content.specs ? res.data.content.specs[0].items[0].iconUrl : null,
          })
          for (let i = 0; i < res.data.content.specs.length; i++) {
            let items = res.data.content.specs[i].items
            items[0]['isSelect'] = true
          }
          let name = [];
          for (let a = 0; a < res.data.content.specs.length; a++) {
            for (let b = 0; b < res.data.content.specs[a].items.length; b++) {
              if (res.data.content.specs[a].items[b].isSelect == true) {
                name.push(res.data.content.specs[a].items[b].name)
                that.setData({
                  selectNameArr: name,
                  selectName: name.join('/')
                })
              }
            }
          }
          that.setData({
            spec: res.data.content.specs
          })
          let size = that.data.spec.length;
          let index = 0;
          let selectAttridstr1 = []
          for (let i = 0; i < size; i++) {
            selectAttridstr1.push(that.data.spec[i].items[0].id)
          }
          that.setData({
            selectAttridStr: selectAttridstr1,
          });
          for (let i in that.data.stockDetail) {
            let selectAttridStr = that.data.selectAttridStr
            that.data.stockDetail[i].dctPrice = parseFloat((that.data.stockDetail[i].dctPrice).toFixed(2))
            if (selectAttridStr == i) {
              that.setData({
                stockDetail1: that.data.stockDetail[i],
                quantity: that.data.stockDetail[i].quantity,
                cashMoney: that.data.stockDetail[i].cashbackItems ? that.data.stockDetail[i].cashbackItems[0].totalAmount : '',
                cashbackId: that.data.stockDetail[i].cashbackItems ? that.data.stockDetail[i].cashbackItems[0].cashbackId : '',
              })

            }
          }
        }
      })
      that.setData({
        showOrder: true
      })
    }
  },
    //线下扫码规格弹框
    showOrder2() {
      let that = this
        that.setData({
          goodsId: that.data.goodsId
        })
        app.Util.ajax('mall/home/goodsDetail', {
          id: that.data.goodsId
        }, 'GET').then((res) => {
          if (res.data.messageCode == "MSG_1001") {
            that.setData({
              stockDetail: res.data.content.stockDetail,
              iconUrl: res.data.content.specs ? res.data.content.specs[0].items[0].iconUrl : null,
            })
            for (let i = 0; i < res.data.content.specs.length; i++) {
              let items = res.data.content.specs[i].items
              items[0]['isSelect'] = true
            }
            let name = [];
            for (let a = 0; a < res.data.content.specs.length; a++) {
              for (let b = 0; b < res.data.content.specs[a].items.length; b++) {
                if (res.data.content.specs[a].items[b].isSelect == true) {
                  name.push(res.data.content.specs[a].items[b].name)
                  that.setData({
                    selectNameArr: name,
                    selectName: name.join('/')
                  })
                }
              }
            }
            that.setData({
              spec: res.data.content.specs
            })
            let size = that.data.spec.length;
            let index = 0;
            let selectAttridstr1 = []
            for (let i = 0; i < size; i++) {
              selectAttridstr1.push(that.data.spec[i].items[0].id)
            }
            that.setData({
              selectAttridStr: selectAttridstr1,
            });
            for (let i in that.data.stockDetail) {
              let selectAttridStr = that.data.selectAttridStr
              that.data.stockDetail[i].dctPrice = parseFloat((that.data.stockDetail[i].dctPrice).toFixed(2))
              if (selectAttridStr == i) {
                that.setData({
                  stockDetail1: that.data.stockDetail[i],
                  quantity: that.data.stockDetail[i].quantity,
                  cashMoney: that.data.stockDetail[i].cashbackItems ? that.data.stockDetail[i].cashbackItems[0].totalAmount : '',
                  cashbackId: that.data.stockDetail[i].cashbackItems ? that.data.stockDetail[i].cashbackItems[0].cashbackId : '',
                })
  
              }
            }
          }
        })
        that.setData({
          showOrder: true
        })
    },
  //选择规格index值
  specIndex(e) {
    let that = this
    let index = e.currentTarget.dataset.index
    let selectAttridStr = that.data.selectAttridStr
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
  clickAttr(e) {
    let that = this
    let selectIndex = e.currentTarget.dataset.selectIndex; //选择大规格的id
    let attrIndex = e.currentTarget.dataset.attrIndex;
    let name = e.currentTarget.dataset.name;
    let spec = that.data.spec;
    let count = spec[selectIndex].items.length;
    that.data.selectNameArr[selectIndex] = e.currentTarget.dataset.name
    that.setData({
      selectName: that.data.selectNameArr.join('/'),
    })
    for (let i = 0; i < count; i++) {
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
    let attrid = spec[selectIndex].items[attrIndex].id;
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
  /* 点击减号 */
  bindMinus() {
    let that = this
    let num = that.data.num;
    if (num > 1) {
      num--;
    }
    if (num <= 1) {
      wx.showToast({
        title: '不能再少了哟',
        icon: 'none'
      })
    }
    let minusStatus = num <= 1 ? 'disabled' : 'normal';
    that.setData({
      num: num,
      minusStatus: minusStatus
    });

  },
  bindPlus() {
    let that = this
    let num = that.data.num;
    if (num >= that.data.quantity) {
      wx.showToast({
        title: '给别人留点吧',
        icon: 'none'
      })
    } else {
      num++;
    }
    let minusStatus = num < 1 ? 'disabled' : 'normal';
    let plusStatus = (num >= that.data.quantity) ? 'disabled' : 'normal';
    that.setData({
      num: num,
      minusStatus: minusStatus,
      plusStatus: plusStatus
    });

  },
  /* 输入框事件 */
  bindManual: function(e) {
    let that = this
    let num = e.detail.value;
    if (isNaN(num)) {
      num = 1;
    }
    that.setData({
      num: parseInt(num)
    });
  },
  //普通加入购物车
  addTocart(e) {
    let that = this
    if (count == true) {
      count = false
      let data = {
        goodsId: e.currentTarget.dataset.goodsid,
        stockId: e.currentTarget.dataset.stockid,
        quantity: e.currentTarget.dataset.quantity,
        buyMode: 1,
        cashBackId: that.data.cashBackId
      }
      //添加购物车
      if (wx.getStorageSync('token')) {
        app.Util.ajax('mall/bag/addShoppingCart', data, 'POST').then((res) => {
          if (res.data.messageCode === 'MSG_1001') {
            if (that.data.num > that.data.quantity) {
              wx.showToast({
                title: '已超出最大库存',
                icon: 'none'
              })
            } else if (that.data.num < 1) {
              wx.showToast({
                title: '不能再少了哟',
                icon: 'none'
              })
            } else {
              wx.showToast({
                title: '添加商品成功',
                icon: 'none'
              })
              that.queryCart()
              that.setData({
                showOrder: false,
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
          url: "/pages/invitationCode/invitationCode?inviterCode=" + that.data.inviterCode
        })
      }
    }
    setTimeout(function() {
      count = true
    }, 1000)
  },
  //0成本购加入购物车
  getZeroCart(e) {
    let that = this
    if (count == true) {
      count = false
      let data = {
        goodsId: e.currentTarget.dataset.goodsid,
        stockId: e.currentTarget.dataset.stockid,
        quantity: e.currentTarget.dataset.quantity,
        buyMode: 2,
      }
      //添加购物车
      if (wx.getStorageSync('token')) {
        app.Util.ajax('mall/bag/addShoppingCart', data, 'POST').then((res) => {
          if (res.data.messageCode === 'MSG_1001') {
            if (that.data.num > that.data.quantity) {
              wx.showToast({
                title: '已超出最大库存',
                icon: 'none'
              })
            } else if (that.data.num < 1) {
              wx.showToast({
                title: '不能再少了哟',
                icon: 'none'
              })
            } else {
              wx.showToast({
                title: '添加商品成功',
                icon: 'none'
              })
              that.queryCart()
              that.setData({
                showOrder: false,
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
          url: "/pages/invitationCode/invitationCode?inviterCode=" + that.data.inviterCode
        })
      }
    }
    setTimeout(function() {
      count = true
    }, 1000)
  },
  hideShowOrder(e) {
    let that = this
    that.setData({
      showOrder: false,
      num:1,
    })
  },
  jumpZero(e) {
    let that = this
    wx.navigateTo({
      url: '/pages/applyRule/applyRule',
    })
  },
  //跳转到下单
  toPlaceorde(e) {
    let that = this
    that.data.store.logoUrl=null
    that.data.store.appletQrCodeUrl = null
    let store = JSON.stringify(that.data.store)
    if (that.data.shoppingCart) {
      wx.navigateTo({
        url: '../takeoutPlaceorder/takeoutPlaceorder?store=' + store,
      })
    }
  },
  //跳转到搜索页面
  toSearch(e) {
    wx.navigateTo({
      url: '../placeorderSearch/placeorderSearch?id=' + e.currentTarget.dataset.id,
    })
  },
  //关注
  follow(e) {
    let that = this
    if (wx.getStorageSync('token')) {
      wx.request({
        url: app.Util.getUrlImg().publicUrl + 'mall/personal/followStore',
        method: "POST",
        data: {
          storeId: that.data.storeId
        },
        header: {
          "content-type": 'application/json',
          token: '' || wx.getStorageSync('token'),
        },
        success: function(res) {
          if (res.data.messageCode === 'MSG_1001') {
            that.initStore()
          }
        }
      })
    } else {
      wx.navigateTo({
        url: "/pages/invitationCode/invitationCode?inviterCode=" + that.data.inviterCode
      })
    }
  },
  //返回首页
  goIndex() {
    wx.switchTab({
      url: '/pages/index/index',
    })
  }
})