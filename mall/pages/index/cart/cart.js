// pages/index/cart/cart.js
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shops: [], //店铺以及商品
    pageNumber: 1,
    pageSize: 20,
    checkedAll: false, //全选
    checkeedAll:false,//店铺选择
    showDialog: false,
    priceAll: 0, //选择的价格
    cardIds: [], //购物车id集合
    cartDetails: [],
    id: 1,
    text: '',
    color: '#BDBDBD'

  },
  //单个店铺全选
  checkall: function(e) {
    var that = this;
    console.log(e)
    var index = e.target.dataset.index;
    var list = that.data.shops[index].cartDetails;
    var status = that.data.shops[index].checkeedAll;
    for (var i = 0; i < list.length; i++) {
      list[i].checked = !status;
    };
    var dataIndex = 'shops[' + index + '].cartDetails';
    var dataStatus = 'shops[' + index + '].checkeedAll';
    that.setData({
      [dataIndex]: list,
      [dataStatus]: !status
    });
    //只有所有单选的都选中了当前单选的这块的的父级就会选中,将选中的 父级 添加在一个数组当中如果过它本身的数据的length == 它被选中的length 就让三级的全选选中
    var data = that.data.shops;
    var datarr = [];
    var cardIds = [];
    for (var a = 0; a < data.length; a++) {
      if (data[a].checkeedAll == true) {
        datarr.push(data[a]);
        for (var i = 0; i < data[a].cartDetails.length; i++) {
          cardIds.push(data[a].cartDetails[i].id)
        }
      }
    }
    that.setData({
      cardIds: cardIds
    })
    if (data.length === datarr.length) {
      that.setData({
        checkedAll: true
      });
    } else {
      that.setData({
        checkedAll: false,
        color: '#BDBDBD'
      });
    }
    //选中店铺商品的时候的结算为多少
    var priceAll = 0;
    for (var b = 0; b < data.length; b++) {
      var datacount = data[b].cartDetails;
      for (var c = 0; c < datacount.length; c++) {
        if (datacount[c].checked == true) {
          priceAll += datacount[c].goodsPrice * datacount[c].quantity;
          that.setData({
            color: '#FF2644'
          });
        }
      }
    }
    var price = Number(priceAll).toFixed(2);
    that.setData({
      priceAll: price
    });
  },
  //点击商品上的checkbox
  Checks1: function(e) {
    var that = this
    var groupIndex = e.target.dataset.groupindex; // 店铺index
    var index = e.target.dataset.index; // 店铺下点击的商品的index
    var list = that.data.shops[groupIndex].cartDetails; // 店铺下的所有商品
    var list2 = that.data.shops[groupIndex].cartDetails[index].checked; // 点击的店铺的商品的选中转态
    var dataIndexchecked = 'shops[' + groupIndex + '].cartDetails[' + index + '].checked';
    var dataStatus = 'shops[' + groupIndex + '].checkeedAll';
    that.setData({
      [dataIndexchecked]: !list2,
    });
    var listcheckedarr = []
    var cardIds = [];
    var data = that.data.shops;
    for (var i = 0; i < data.length; i++) {
      var shopGoodsList = that.data.shops[i].cartDetails;
      for (var a = 0; a < shopGoodsList.length; a++) {
        if (shopGoodsList[a].checked == true) {
          cardIds.push(shopGoodsList[a].id)
        }
      }
    }
    that.setData({
      cardIds: cardIds
    })
    for (var b = 0; b < list.length; b++) {
      if (list[b].checked == true) {
        listcheckedarr.push(list[b]);
      }
    }
    if (list.length === listcheckedarr.length) {
      that.setData({
        [dataStatus]: true
      });
    } else {
      that.setData({
        [dataStatus]: false
      });
    }
    //只有所有单选的都选中了当前单选的这块的的父级就会选中,将选中的 父级 添加在一个数组当中如果过它本身的数据的length == 它被选中的length 就让三级的全选选中
    var data = that.data.shops;
    var datarr = [];
    for (var a = 0; a < data.length; a++) {
      if (data[a].checkeedAll == true) {
        datarr.push(data[a]);
      }
    }
    if (data.length === datarr.length) {
      that.setData({
        checkedAll: true
      });
    } else {
      that.setData({
        checkedAll: false,
        color: '#BDBDBD'
      });
    }

    //单选选中的时候的结算为多少价格为多少
    var priceAll = 0;
    for (var b = 0; b < data.length; b++) {
      var datacount = data[b].cartDetails;
      for (var c = 0; c < datacount.length; c++) {
        if (datacount[c].checked == true) {
          priceAll += datacount[c].goodsPrice * datacount[c].quantity;
          that.setData({
            color: '#FF2644'
          });
        }
      }
    }
    var price = Number(priceAll).toFixed(2);
    that.setData({
      priceAll: price
    });
  },
  //点击全选
  AllTap: function(e) {
    var that = this
    var checkedAll = that.data.checkedAll;
    var list1 = that.data.shops;
    var cardIds = [];
    for (var i = 0; i < list1.length; i++) {
      list1[i].checkeedAll = !checkedAll;
      var list2 = that.data.shops[i].cartDetails;
      for (var a = 0; a < list2.length; a++) {
        list2[a].checked = !checkedAll;
        cardIds.push(list2[a].id)
      }
    }
    that.setData({
      cardIds: cardIds,
      color: '#BDBDBD'
    })
    //全选选中的时候的结算为多少
    var priceAll = 0;
    for (var b = 0; b < list1.length; b++) {
      var datacount = list1[b].cartDetails;
      for (var c = 0; c < datacount.length; c++) {
        if (datacount[c].checked == true) {
          priceAll += datacount[c].goodsPrice * datacount[c].quantity;
          that.setData({
            color: '#FF2644'
          });
        }
      }
    }
    var price = Number(priceAll).toFixed(2);
    that.setData({
      checkedAll: (!checkedAll),
      shops: list1,
      priceAll: price
    });
    if (that.data.checkedAll == false) {
      that.setData({
        cardIds: []
      })
    }
  },
  /* 点击减号 */
  bindMinus: function(e) {
    var that = this
    const quantity = e.target.dataset.num - 1
    const id = e.target.dataset.id
    var shops = that.data.shops //购物车数据    
    let index = e.currentTarget.dataset.index //当前商品所在店铺中的下标  
    let idx = e.currentTarget.dataset.groupindex //当前店铺下标     
    let cai = shops[idx].cartDetails; //当前商品的店铺shops.cartDetails
    let curt = cai[index]; //当前商品数组    
    var num = curt.quantity; //当前商品的数量    
    if (num <= 1) {  
      wx.showToast({
        title: '宝贝不能再瘦了',
        icon: 'none'
      }) 
      return false;  
    }  
    num--;  
    shops[idx].cartDetails[index].quantity = num //点击后当前店铺下当前商品的数量 
    var priceAll = 0;
    for (var b = 0; b < shops.length; b++) {
      var datacount = shops[b].cartDetails;
      for (var c = 0; c < datacount.length; c++) {
        if (datacount[c].checked == true) {
          priceAll += datacount[c].goodsPrice * datacount[c].quantity;
        }
      }
    }
    var price = Number(priceAll).toFixed(2);
    that.setData({   
      shops: shops,
      priceAll: price
    })  
    app.Util.ajax('mall/cart/updateShoppingCart', {
      id: id,
      quantity: quantity
    }, 'POST').then((res) => { // 使用ajax函数
      if (res.messageCode = 'MSG_1001') {

      }
    })
  },
  /*点击加号*/
  bindPlus: function(e) {
    var that = this
    const quantity = e.target.dataset.num + 1
    const id = e.target.dataset.id
    var shops = that.data.shops //购物车数据    
    let index = e.currentTarget.dataset.index //当前商品所在店铺中的下标  
    let idx = e.currentTarget.dataset.groupindex //当前店铺下标     
    let cai = shops[idx].cartDetails; //当前商品的店铺shops.cartDetails
    let curt = cai[index]; //当前商品数组    
    var num = curt.quantity; //当前商品的数量    
    app.Util.ajax('mall/cart/updateShoppingCart', {
      id: id,
      quantity: quantity
    }, 'POST').then((res) => { // 使用ajax函数
      if (res.data.content) {
        num++;
        shops[idx].cartDetails[index].quantity = num //点击后当前店铺下当前商品的数量 
        var priceAll = 0;
        for (var b = 0; b < shops.length; b++) {
          var datacount = shops[b].cartDetails;
          for (var c = 0; c < datacount.length; c++) {
            if (datacount[c].checked == true) {
              priceAll += datacount[c].goodsPrice * datacount[c].quantity;
            }
          }
        }
        var price = Number(priceAll).toFixed(2);
        that.setData({
          shops: shops, //店铺下商品的数量  
          priceAll: price
        })
      } else {
        wx.showToast({
          title: res.data.message,
          icon: 'none'
        })
      }
    })

  },
  //结算
  jumpPlaceOrder: function() {
    var that = this
    var cardIds = that.data.cardIds;
    var shops = that.data.shops
    var status = []
    if (cardIds.length > 0) {
      var cardIds = JSON.stringify(that.data.cardIds);
      var cardIds2 = that.data.cardIds;
      for (var i = 0; i < shops.length; i++) {
        for (var j = 0; j < shops[i].cartDetails.length; j++) {
          if (shops[i].cartDetails[j].checked == true) {
            status.push(shops[i].cartDetails[j].status)
          }
        }
      }
      if (status.indexOf(2) !== -1 || status.indexOf(3) !== -1) {
        wx.showToast({
          title: '当前选择商品存在失效商品无法提交订单',
          icon: 'none'
        })
      } else {
        app.Util.ajax('mall/order/checkCart',
        {
          cardIds:cardIds2
        }, 'POST').then((res) => {
          //  console.log('cardIds:'+cardIds)
          //  console.log('购物车结算：'+JSON.stringify(res.data))
          if (res.data.content) {
            wx.navigateTo({
              url: `/pages/placeorder/placeorder?cardIds=${cardIds}`
            })
            //跳转页面后，合计为0，结算按钮变灰色,取消全选状态,选中的商品为空
            setTimeout(function() {
              that.setData({
                priceAll: 0,
                color: '#BDBDBD',
                checkedAll: false,
                cardIds: ''
              })
            }, 500)
          } else {
            wx.showToast({
              title: res.data.message,
              icon: 'none'
            })
          }
        })
      }
    } else if (cardIds.length === 0) {
      wx.showToast({
        title: '请选择你想购买的商品',
        icon: 'none'
      })
    }
  },
  //跳转至店铺详情
  jumpStoreDetail: function(e) {
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/storedetails/storedetails?id=${id}`,
    })
  },
  //跳转到详情页
  toDetail: function(e) {
    const id = e.currentTarget.dataset.id
    const status = e.currentTarget.dataset.status
    if (status == 2) {
      wx.showToast({
        title: '商品已下架',
        icon: 'none'
      })
    } else if (status == 3) {
      wx.showToast({
        title: '商品已失效',
        icon: 'none'
      })
    } else {
      wx.navigateTo({
        url: `/pages/detail/detail?id=${id}`,
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    if (options) {
      if (options.inviterCode) {
        wx.setStorage({
          key: "othersInviterCode",
          data: options.inviterCode
        })
      }
    }
    that.init();
  },
  init: function() {
    var that = this
    var cartDetails = []
    //查询购物车
    app.Util.ajax('mall/cart/queryShoppingCart', {
      pageNumber: that.data.pageNumber,
      pageSize: that.data.pageSize
    }, 'GET').then((res) => { // 使用ajax函数
      //  console.log("购物车详情:"+JSON.stringify(res.data))
      if (res.data.content) {
        that.setData({
          shops: res.data.content.items
        })
        for (var i = 0; i < that.data.shops.length; i++) {
          that.data.shops[i]['checkeedAll'] = false
          that.data.shops[i]['index'] = 0
          for (var j = 0; j < that.data.shops[i].cartDetails.length; j++) {
            that.data.shops[i].cartDetails[j]['checked'] = false
            that.data.shops[i].cartDetails[j]['index'] = j
          }
        }
      } else {
        wx.showToast({
          title: res.data.message,
          icon: 'none',
          duration: 1500
        })
      }
    })
  },
  getMore: function() {
    var that = this
    var cartDetails = []
    var pageNumber = that.data.pageNumber + 1
    app.Util.ajax('mall/cart/queryShoppingCart', {
      pageNumber: pageNumber,
      pageSize: that.data.pageSize
    }, 'GET').then((res) => { // 使用ajax函数
      if (res.messageCode = 'MSG_1001') {
        if (res.data.content.items == '' && that.data.shops !== '') {
          that.setData({
            text: '已经到底啦'
          })
        }
        var arr = that.data.shops
        if (res.data.content.items.length > 0) {
          for (var i = 0; i < res.data.content.items.length; i++) {
            arr.push(res.data.content.items[i])
          }
          that.setData({
            shops: arr,
            pageNumber: pageNumber
          })
        }
        if (that.data.checkedAll == false) {

        } else {
          that.setData({
            cardIds: [],
            checkedAll: false,
            priceAll: 0
          })
          that.AllTap()
        }

      }
    })
  },
  //删除
  del: function(e) {
    var id = e.currentTarget.dataset.id
    this.setData({
      id: id,
      showDialog: true
    })
  },
  comfirm: function() {
    let id = this.data.id
    app.Util.ajax(`mall/cart/deleteById?id=${id}`, null, 'DELETE').then((res) => { // 使用ajax函数
      if (res.messageCode = 'MSG_1001') {
        app.Util.ajax('mall/cart/queryShoppingCart', {
          pageNumber: this.data.pageNumber,
          pageSize: this.data.pageSize
        }, 'GET').then((res) => { // 使用ajax函数
          if (res.data.content) {
            this.setData({
              shops: res.data.content.items,
              showDialog: false,
              color: '#BDBDBD',
              checkedAll: false,
              priceAll: 0,
              cardIds: []
            })
          } else {
            wx.showToast({
              title: res.data.message,
              icon: 'none'
            })
          }
        })
      }
    })
  },
  reject: function(e) {
    this.setData({
      showDialog: false
    })
  },
  toApplyZero: function(e) {
    // console.log("查看零元购"+JSON.stringify(e.target.dataset))
    //零元购期数，预期钱，需要的钱，规格，数量
    var arr = {}
    arr.cashbackperiods = e.target.dataset.cashbackperiods
    arr.expectedamount = e.target.dataset.expectedamount
    arr.needpaymentamount = e.target.dataset.needpaymentamount
    arr.quantity = e.target.dataset.quantity
    arr.stockid = e.target.dataset.stockid
    arr.goodsid = e.target.dataset.goodsid
    arr.shoppingcartgoodsid = e.target.dataset.shoppingcartgoodsid,
      arr.cashbackperiods = e.target.dataset.cashbackperiods,
      arr.expectedAmount = e.target.dataset.expectedamount
    var obj = JSON.stringify(arr)
    wx.navigateTo({
      url: '/pages/applyZero/applyZero?arr=' + obj
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
    var that = this
    if (wx.getStorageSync('cartStatus')) {
      that.setData({
        pageNumber: 1
      })
      wx.pageScrollTo({
        scrollTop: 0,
      })
      that.onLoad()
      wx.removeStorageSync('cartStatus')
    } else {
      var priceAll = 0;
      var cardIds = [];
      var datarr = [];
      for (var b = 0; b < that.data.shops.length; b++) {
        if (that.data.shops[b].checkeedAll == true) {
          datarr.push(that.data.shops[b]);
        }
        var datacount = that.data.shops[b].cartDetails;
        for (var c = 0; c < datacount.length; c++) {
          if (datacount[c].checked == true) {
            cardIds.push(datacount[c].id)
            priceAll += datacount[c].goodsPrice * datacount[c].quantity;
            that.setData({
              color: '#FF2644',
              priceAll: priceAll,
              cardIds: cardIds,
            });
          }
        }
      }
      if (that.data.shops.length > 0) {
        if (that.data.shops.length === datarr.length) {
          that.setData({
            checkedAll: true
          });
        } else {
          that.setData({
            checkedAll: false,
          });
        }
      }
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
    var that = this
    that.setData({
      pageNumber: 1,
      cardIds: [],
      checkedAll: false,
      priceAll: 0,
      color: '#BDBDBD'
    })
    that.onLoad()
    wx.stopPullDownRefresh() //停止下拉刷新
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    var that = this
    that.getMore()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    return {
      path: "/pages/index/cart/cart?inviterCode=" + wx.getStorageSync('inviterCode'),
    }
  },
  againCalculate: function(e) {
    //  console.log("重新计算:"+e.target.dataset.shoppingcartgoodsid)
    var arr = {}
    arr.stockId = e.target.dataset.stockid
    arr.goodsId = e.target.dataset.goodsid
    arr.quantity = e.target.dataset.quantity
    e.target.dataset.shoppingcartgoodsid
    var tempList = JSON.stringify(arr)
    wx.navigateTo({
      url: '/pages/applyZero/applyZero?detailObj=' + tempList + '&&reviseStatus2=1' + '&&shoppingcartgoodsid=' + e.target.dataset.shoppingcartgoodsid
    })
  }
})