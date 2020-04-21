// packageA/pages/placeorderSearch/placeorderSearch.js
let app = getApp()
let selectIndex; //选择的大规格key
let attrIndex; //选择的小规格的key
let selectAttrid = []; //选择的属性id
let count = true //节流阀-限制购买提交次数
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hostUrl: app.Util.getUrlImg().hostUrl,
    bgColor: '#AAAAAA',//按钮颜色
    showOrder: false,//弹窗
    num: 1,
    inputValue: '',
    show: false,
    pageNumber: 1,
    pageSize: 20,
    goodsResult: [],
    history: wx.getStorageSync('search2') || [],
    textToast: '',//已经到底啦
    storeId: null,//店铺ID
    store:{},//店铺信息
    shoppingCart:null,//购物袋信息
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
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
    that.setData({
      storeId: options.id ? options.id : wx.getStorageSync('takeoutStoreId'),
      history: wx.getStorageSync('search2') || [],
    })
    //初始化店铺信息
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

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
      }
    })
  },
  //查询购物车
  queryCart() {
    let that = this
    app.Util.ajax('mall/bag/queryShoppingCart', {
      storeId: that.data.storeId
    }, 'GET').then((res) => {
      if (res.data.messageCode = 'MSG_1001') {
        if (res.data.content.goodsCount == 0) {
          that.setData({
            shoppingCart: null
          })
        } else {
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
  bindManual: function (e) {
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
    setTimeout(function () {
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
    setTimeout(function () {
      count = true
    }, 1000)
  },
  hideShowOrder(e) {
    let that = this
    that.setData({
      showOrder: false
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
    let store = JSON.stringify(that.data.store)
    if (that.data.shoppingCart) {
      wx.navigateTo({
        url: '../takeoutPlaceorder/takeoutPlaceorder?store=' + store,
      })
    }
  },

  /**
  * 搜索
  */
  search: function () {
    let that = this
    if (that.data.inputValue === '') {
      wx.showToast({
        title: '搜索内容不能为空',
        icon: 'none',
        duration: 2000
      })
    } else {
      const value = that.data.inputValue;
      const text = that.data.history
      const title = text.filter(item => item !== value)
      title.unshift(value)
      that.setData({
        history:title.slice(0, 10),
        inputValue: value,
        textToast: ''
      })
      wx.setStorageSync("search2", that.data.history)
      that.data.pageNumber == 1
      let data = {
        keyword: value,
        scope: 1,
        pageNumber: that.data.pageNumber,
        pageSize: that.data.pageSize,
        storeId: that.data.storeId
      }
      app.Util.ajax('mall/home/_search', data, 'GET').then((res) => {  // 使用ajax函数
        if (res.data.messageCode == 'MSG_1001') {
          res.data.content.goodsResult.items.forEach((v, i) => {
            v.truePrice = parseFloat((v.dctPrice - v.marketingCashBack.totalAmount).toFixed(2))
          })
          that.setData({
            goodsResult: res.data.content.goodsResult.items
          })
          if (that.data.goodsResult.length == 0) {
            wx.showToast({
              title: '暂无相关商品',
              icon: 'none',
            })
          }

        } else {
          wx.showToast({
            title: res.data.message,
            icon: 'none'
          })
        }
      })
    }
  },
  confirmTap: function (e) {
    let that = this
    that.data.inputValue = e.detail.value
    if (that.data.inputValue === '') {
      wx.showToast({
        title: '搜索内容不能为空',
        icon: 'none',
        duration: 2000
      })
    } else {
      const value = that.data.inputValue;
      const text = that.data.history
      const title = text.filter(item => item !== value)
      title.unshift(value)
      that.setData({
        history: title.slice(0, 10),
        inputValue: value,
        textToast: ''
      })
      wx.setStorageSync("search2", that.data.history)
      that.data.pageNumber == 1
      let data = {
        keyword: value,
        scope: 1,
        pageNumber: that.data.pageNumber,
        pageSize: that.data.pageSize,
        storeId: that.data.storeId
      }
      app.Util.ajax('mall/home/_search', data, 'GET').then((res) => {  // 使用ajax函数
        if (res.data.messageCode == 'MSG_1001') {
          res.data.content.goodsResult.items.forEach((v, i) => {
            v.truePrice = parseFloat((v.dctPrice - v.marketingCashBack.totalAmount).toFixed(2))
          })
          that.setData({
            goodsResult: res.data.content.goodsResult.items,
          })
          if (that.data.goodsResult.length == 0) {
            wx.showToast({
              title: '暂无相关商品',
              icon: 'none',
            })
          }

        } else {
          wx.showToast({
            title: res.data.message,
            icon: 'none'
          })
        }
      })
    }
  },
  //点击搜索历史
  searchClick: function (e) {
    let that = this
    const text = e.target.dataset.item
    that.setData({
      show: true,
      inputValue: text
    })
    let data = {
      keyword: text,
      scope: 1,
      pageNumber: that.data.pageNumber,
      pageSize: that.data.pageSize,
      storeId: that.data.storeId
    }
    app.Util.ajax('mall/home/_search', data, 'GET').then((res) => {  // 使用ajax函数
      if (res.data.messageCode == 'MSG_1001') {
        res.data.content.goodsResult.items.forEach((v, i) => {
          v.truePrice = parseFloat((v.dctPrice - v.marketingCashBack.totalAmount).toFixed(2))
        })
        that.setData({
          goodsResult: res.data.content.goodsResult.items
        })
        if (that.data.goodsResult.length == 0) {
          wx.showToast({
            title: '暂无相关商品',
            icon: 'none',
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
  //加载更多
  getMore: function () {
    let that = this
    let pageNumber = that.data.pageNumber + 1
    let data = {
      keyword: that.data.inputValue,
      scope: 1,
      pageNumber: that.data.pageNumber,
      pageSize: that.data.pageSize,
      storeId: that.data.storeId
    }
    app.Util.ajax('mall/home/_search', data, 'GET').then((res) => { // 使用ajax函数
      if (res.messageCode = 'MSG_1001') {
        if (res.data.content.goodsResult.items == '' && that.data.goodsResult !== '') {
          that.setData({
            textToast: '已经到底啦'
          })
        }
        let arr = that.data.goodsResult
        res.data.content.goodsResult.items.forEach((v, i) => {
          v.truePrice = parseFloat((v.dctPrice - v.marketingCashBack.totalAmount).toFixed(2))
        })
        for (let i = 0; i < res.data.content.goodsResult.items.length; i++) {
          arr.push(res.data.content.goodsResult.items[i])
        }
        that.setData({
          goodsResult: arr,
          pageNumber: pageNumber
        })
      }
    })
  },
  cancel: function () {
    let that = this;
    that.setData({
      pageNumber: 1,
      show: false,
      template: 1,
      inputValue: '',
      textToast: '',
      goodsResult: []
    })
  },
  bindInput: function (e) {
    let that = this;
    let value = e.detail.value
    if (value !== '') {
      that.setData({
        inputValue: value,
        show: true
      })
    } else {
      that.setData({
        show: false
      })
    }
  },
  /**
  * 清空
  */
  detele: function () {
    let that = this
    wx.removeStorage({
      key: 'search2',
      success: function (res) {
        that.setData({
          history: []
        })
      },
    })
    wx.showToast({
      title: '历史记录已删除',
      icon: 'none',
      duration: 2000
    })
  },
})