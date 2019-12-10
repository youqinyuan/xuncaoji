// pages/applyZero/applyZero.js
var time = require('../../utils/util.js');
let app = getApp()
var newCount = true //节流阀-限制购买提交次数
Page({

  /**
   * 页面的初始数据
   */
  data: {
    buyType:1,
    showPeriod: false, //想要的分期月数
    showDialog: false, //返现明细表
    showModal: false, //利息明细表
    showStop: false, //可随时终止
    showGet: false, //怎么赚的钱
    status: 1, //我要平台弹框是否点击自定义
    isFocus: false, //是否自动聚焦
    buttonText: '加入购物车',
    buttonText2: '下一步',
    disabled: true, //分期返现月数input是否禁用
    goodsMsg: {}, //页面初始化需要传的数据
    cashMsg: {}, //页面初始化分期数据
    payMsg: {}, //需要支付的金额
    reviseStatus: 0,
    reviseStatus2: 0,
    reviseStatus3: 1,
    shoppingcartgoodsid: 0,
    expectedAmount: 0,
    cashbackperiods: 0,
    monthStatus: false,
    expectedAmountStatus: false,
    expectedAmountNumber: 0,
    monthNumber: 0,
    monthInput: "请输出分期数",
    expectedAmountInput: "请输入最终成本价",
    inputBorder: "border: #DBDBDB 2rpx solid;",
    expectedAmountNumbertemp: 0,
    monthNumbertemp: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    if(options.buyType){
      //  var goodsType = JSON.parse(options.detailObj).goodsType
      //  console.log("goodsType:"+goodsType)
       that.setData({
        buyType:options.buyType
       })
    }
    if (options.arr) {
      console.log(111)
      var arr = JSON.parse(options.arr)
      //  console.log('购物车id：'+arr.shoppingcartgoodsid)
      var obj = {}
      obj.goodsId = arr.goodsid
      obj.stockId = arr.stockid
      obj.quantity = arr.quantity
      // console.log('obj'+JSON.stringify(obj))
      that.setData({
        goodsMsg: obj,
        reviseStatus: 1,
        shoppingcartgoodsid: arr.shoppingcartgoodsid,
        cashbackperiods: arr.cashbackperiods,
        expectedAmount: arr.expectedAmount,
      })
      that.getInit(obj.stockId)
    } else {
      // console.log(222)
      if (options.reviseStatus2) {
        var obj = JSON.parse(options.detailObj)
        // console.log("aaa"+JSON.stringify(obj))
        that.setData({
          goodsMsg: obj,
          reviseStatus2: options.reviseStatus2,
          shoppingcartgoodsid: options.shoppingcartgoodsid
        })
        that.getInit(obj.stockId)
      } else {
        // console.log(33)
        // console.log(options)
         var obj = {}
        obj.goodsId = options.goodsId
        obj.stockId = options.stockId
        obj.quantity = options.quantity
        // console.log(JSON.stringify(obj))
        //  console.log("aaa"+JSON.stringify(obj))
        that.setData({
          goodsMsg: obj
        })
        that.getInit(obj.stockId)
      }

    }

  },
  //请求初始化数据
  getInit: function(stockId) {
    var that = this
    app.Util.ajax('mall/freeShopping/request/default', {
      stockId: stockId
    }, 'GET').then((res) => {
      //获取页面分期判断数据
    //  console.log("分期月数:" + JSON.stringify(res.data.content))
      if (res.data.messageCode == 'MSG_1001') {
        //  console.log('stockId:'+stockId)
        //  console.log('bbb'+JSON.stringify(res.data.content))
        //计算需要支付的金额
        if (that.data.expectedAmount !== 0) {
          that.compute2(that.data.expectedAmount, that.data.cashbackperiods);
          var tempList = res.data.content;
          tempList.expectedAmount = that.data.expectedAmount
          tempList.cashBackPeriods = that.data.cashbackperiods
          that.setData({
            cashMsg: tempList
          })
        } else {
          that.setData({
            cashMsg: res.data.content
          })
          that.compute();
        }

      }else{
        wx.showToast({
          title: res.data.message,
          icon:'none',
          duration:1000
        })
      }
    })
  },
  //分期的月数弹框(出现)
  periodMonth: function() {
    var that = this;

    that.setData({
      showPeriod: true
    })

  },
  //分期的月数弹框(隐藏)
  cancelPeriod: function() {
    var that = this;
    that.setData({
      showPeriod: false
    })
  },
  //自定义月数
  custom: function() {
    var that = this;
    that.setData({
      showPeriod: false,
      status: 0,
      monthStatus: true
    })
  },
  //获取分期月数的值
  getMonthText: function(e) {
    var that = this
    var cashMsg = that.data.cashMsg
    cashMsg.cashBackPeriods = e.currentTarget.dataset.text
    that.setData({
      showPeriod: false,
      cashMsg: cashMsg,
      monthNumbertemp: e.currentTarget.dataset.text
    })
    that.monthButton()
  },
  //获取我想花输入框的值
  wantAmount: function(e) {
    var that = this
    var cashMsg = that.data.cashMsg
    cashMsg.expectedAmount = e.detail.value
  },
  //自定义分期数
  needAmount: function(e) {
    var that = this
    var cashMsg = that.data.cashMsg
    cashMsg.cashBackPeriods = e.detail.value
  },
  //计算支付的金额
  compute: function() {
    var that = this
    //console.log('cashMsg:'+JSON.stringify(that.data.cashMsg))
    app.Util.ajax('mall/freeShopping/request/calculate', {
      stockId: Number(that.data.goodsMsg.stockId),
      // stockId:3,
      quantity: Number(that.data.goodsMsg.quantity),
      // quantity: 2,
      expectedAmount: that.data.cashMsg.expectedAmount,
      cashBackPeriods: that.data.cashMsg.cashBackPeriods
    }, 'POST').then((res) => {
    //  console.log('计算需要支付的金额：' + JSON.stringify(res.data))
      if (res.data.messageCode == 'MSG_1001') {
        var cashBackDetails = res.data.content.cashBackDetails
        cashBackDetails.forEach((v, i) => {
          v.cashBackDate = time.formatTimeTwo(v.cashBackDate, 'Y-M-D')
        })
        var interestDetails = res.data.content.interestDetails
        interestDetails.forEach((v, i) => {
          v.cashBackDate = time.formatTimeTwo(v.cashBackDate, 'Y-M-D')
        })
       // console.log("aaaaaaaa" + JSON.stringify(res.data.content))
        that.setData({
          payMsg: res.data.content
        })
      } else {
        wx.showToast({
          title: res.data.message,
          icon: 'none',
          duration: 1000
        })
      }
    })
  },
  compute2: function(expectedAmount, cashBackPeriods) {
    var that = this
    // console.log('计算页面初始化:'+JSON.stringify(that.data.goodsMsg.stockId+','+expectedAmount+','+cashBackPeriods+','))
    app.Util.ajax('mall/freeShopping/request/calculate', {
      stockId: Number(that.data.goodsMsg.stockId),
      // stockId:3,
      quantity: Number(that.data.goodsMsg.quantity),
      // quantity: 2,
      expectedAmount: expectedAmount,
      cashBackPeriods: cashBackPeriods
    }, 'POST').then((res) => {
     // console.log('计算需要支付的金额：' + JSON.stringify(res.data))
      if (res.data.messageCode == 'MSG_1001') {
        var cashBackDetails = res.data.content.cashBackDetails
        cashBackDetails.forEach((v, i) => {
          v.cashBackDate = time.formatTimeTwo(v.cashBackDate, 'Y-M-D')
        })
        var interestDetails = res.data.content.interestDetails
        interestDetails.forEach((v, i) => {
          v.cashBackDate = time.formatTimeTwo(v.cashBackDate, 'Y-M-D')
        })
        that.setData({
          payMsg: res.data.content
        })
      } else {
        wx.showToast({
          title: res.data.message,
          icon: 'none',
          duration: 1000
        })
      }
    })
  },
  addOrCompute: function() {
    var that = this
    // if(this.data.reviseStatus3==0){
    //   wx.showToast({
    //     title:'请刷新计算',
    //     icon:"none"
    //   })
    // }else{
    if (that.data.reviseStatus == 1 || that.data.reviseStatus2 == 1) {
     // console.log(that.data.shoppingcartgoodsid + "," + that.data.cashMsg.expectedAmount + "," + that.data.cashMsg.cashBackPeriods)
      app.Util.ajax('mall/cart/updateShoppingCartApply', {
        shoppingCartGoodsId: that.data.shoppingcartgoodsid, //修改购物车的id
        expectedAmount: that.data.cashMsg.expectedAmount, //用户预期花费
        cashBackPeriods: that.data.cashMsg.cashBackPeriods //返现期数
        // cashBackId: cashbackId
      }, 'GET').then((res) => {
        if (res.data.messageCode == "MSG_1001") {
          wx.showToast({
            title: '修改成功',
            icon: 'none'
          })

        } else {
          wx.showToast({
            title: '修改失败,请稍后再试',
            icon: 'none'
          })
        }
        //  console.log("修改成功")
        //   console.log(res.data)
      })
    } else {
      app.Util.ajax('mall/cart/addShoppingCart', {
        goodsId: that.data.goodsMsg.goodsId,
        stockId: that.data.goodsMsg.stockId,
        quantity: that.data.goodsMsg.quantity,
        expectedAmount: that.data.cashMsg.expectedAmount, //用户预期花费
        cashBackPeriods: that.data.cashMsg.cashBackPeriods //返现期数
        // cashBackId: cashbackId
      }, 'POST').then((res) => { // 使用ajax函数
        //   console.log(JSON.stringify(res.data))
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
            that.setData({
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
    }
    // }


  },
  //返现明细弹框(出现)
  returnDetail: function() {
    var that = this;
    that.setData({
      showDialog: true
    })
  },
  //返现明细弹框(隐藏)
  cancelDialog: function() {
    var that = this;
    that.setData({
      showDialog: false
    })
  },
  //利息明细弹框(出现)
  interestDetail: function() {
    var that = this;
    that.setData({
      showModal: true
    })
  },
  //利息明细弹框(隐藏)
  cancelModal: function() {
    var that = this;
    that.setData({
      showModal: false
    })
  },
  //可随时终止(出现)
  stopZero: function() {
    var that = this;
    that.setData({
      showStop: true
    })
  },
  //可随时终止(隐藏)
  cancelStop: function() {
    var that = this;
    that.setData({
      showStop: false
    })
  },
  //期限(隐藏)
  monthStop: function() {
    var that = this;
    //that.getInit(that.data.goodsMsg.stockId)
    that.setData({
      monthStatus: false,
      cashMsg: that.data.cashMsg
    })
  },
  //期限(显示)
  monthShow: function() {
    var that = this;
    that.setData({
      monthStatus: true
    })
  },
  //预期金额(隐藏)
  expectedAmountStop: function() {
    var that = this;
    that.setData({
      expectedAmountStatus: false,
      cashMsg: that.data.cashMsg
    })
  },
  //预期金额(显示)
  expectedAmountShow: function() {
    var that = this;
    that.setData({
      expectedAmountStatus: true
    })
  },
  //怎么赚的钱(出现)
  payNum: function() {
    var that = this
    that.setData({
      showGet: true
    })
  },
  //怎么赚的钱(隐藏)
  cancelGet: function() {
    var that = this
    that.setData({
      showGet: false
    })
  },
  understand: function() {
    var that = this
    that.setData({
      showGet: false
    })
  },
  //刷新计算
  refurbish: function() {
    var that = this
    app.Util.ajax('mall/freeShopping/request/calculate', {
      stockId: Number(that.data.goodsMsg.stockId),
      // stockId:3,
      quantity: Number(that.data.goodsMsg.quantity),
      //  quantity: 2,
      expectedAmount: that.data.cashMsg.expectedAmount,
      cashBackPeriods: that.data.cashMsg.cashBackPeriods
    }, 'POST').then((res) => {
    //  console.log(JSON.stringify(res.data))
      if (res.data.messageCode == 'MSG_1001') {
        var cashBackDetails = res.data.content.cashBackDetails
        cashBackDetails.forEach((v, i) => {
          v.cashBackDate = time.formatTimeTwo(v.cashBackDate, 'Y-M-D')
        })
        var interestDetails = res.data.content.interestDetails
        interestDetails.forEach((v, i) => {
          v.cashBackDate = time.formatTimeTwo(v.cashBackDate, 'Y-M-D')
        })
        var obj = that.data.cashMsg
        //  obj.expectedAmount = that.data.expectedAmountNumbertemp
        //  obj.cashBackPeriods = that.data.monthNumbertemp
        that.setData({
          cashMsg: obj,
          payMsg: res.data.content,
          reviseStatus3: 1
        })
        wx.showToast({
          title: '刷新计算成功',
          icon: 'none',
          duration: 2000
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
  //自定义输入点击计
  payNow: function() {
    var that = this;
    if(newCount){
      newCount = false
      wx.navigateTo({
        url: '/pages/placeorder/placeorder?goodsId=' + this.data.goodsMsg.goodsId + '&&stockId=' + this.data.goodsMsg.stockId + '&&quantity=' + this.data.goodsMsg.quantity + '&&goodsType=applyZero' + '&&needPaymentAmount=' + this.data.payMsg.needPaymentAmount + '&&cashBackPeriods=' + this.data.cashMsg.cashBackPeriods + '&&expectedAmount=' + this.data.cashMsg.expectedAmount+'&&buyType='+this.data.buyType
      })
    }
    setTimeout(function(){
      newCount=true
    },1000)
  },
  //期望付款
  expectedAmountNumber: function(e) {
    var that = this
    console.log(e.detail.value)
    var expectedAmount = e.detail.value
    // that.setData({
    //   expectedAmountNumbertemp:e.detail.value
    // }) 
    // var obj = that.data.cashMsg
    // obj.expectedAmount = expectedAmount
    if (e.detail.value) {
      that.setData({
        // cashMsg:obj,
        // expectedAmountNumber:expectedAmount,
        expectedAmountNumbertemp: e.detail.value
      })
      //   var expectedAmount = e.detail.value
      //   app.Util.ajax('mall/freeShopping/request/calculate', {
      //     stockId: Number(that.data.goodsMsg.stockId),
      //   // stockId:3,
      //     quantity: Number(that.data.goodsMsg.quantity),
      //  //  quantity: 2,
      //    expectedAmount: expectedAmount,
      //    cashBackPeriods: that.data.cashMsg.cashBackPeriods
      //  }, 'POST').then((res) => {
      //    console.log("ssssssss"+JSON.stringify(res))
      //   if (res.data.messageCode == 'MSG_1001') {
      //     var obj = that.data.cashMsg
      //     obj.expectedAmount = expectedAmount
      //     console.log("res.data.messageCode"+JSON.stringify(obj))
      //     console.log("res.data.messageCode"+JSON.stringify(expectedAmount))
      //       that.setData({
      //         cashMsg:obj,
      //         expectedAmountNumber:expectedAmount
      //         expectedAmountNumbertemp:e.detail.value
      // })
      //   }
      //  })
    }

  },
  //分月
  monthNumber: function(e) {
    console.log(e.detail.value)
    var that = this
    var monthNumber = e.detail.value
    var monthNumbertemp = e.detail.value
    that.setData({
      monthNumbertemp: monthNumbertemp
    })
    // if(e.detail.value){
    //   var month = e.detail.value
    //   app.Util.ajax('mall/freeShopping/request/calculate', {
    //     stockId: Number(that.data.goodsMsg.stockId),
    //     quantity: Number(that.data.goodsMsg.quantity),
    //    expectedAmount: that.data.cashMsg.expectedAmount,
    //    cashBackPeriods: month
    //  }, 'POST').then((res) => {
    //   that.setData({
    //     monthNumber:monthNumber
    //   })
    //   console.log("数据正确")
    //   if (res.data.messageCode == 'MSG_1001'){
    //     var obj = that.data.cashMsg
    //     obj.cashBackPeriods = monthNumber
    //     that.setData({
    //       cashMsg:obj,
    //     })
    //   }else{
    //     that.setData({
    //       monthNumber:monthNumber2
    //     })
    //   }
    //  })
    // }
  },
  monthButton: function() {
    var that = this
    //保留一位小数
    var reg = /^\d{0,5}([\b]*|\.|\.\d{0,1}|$)$/
    if (that.data.monthNumbertemp&&reg.test(that.data.monthNumbertemp)) {
  //  console.log("提交月份" + that.data.monthNumbertemp)
   //   console.log(("不满足条件"))
      var month = that.data.monthNumbertemp
      app.Util.ajax('mall/freeShopping/request/calculate', {
        stockId: Number(that.data.goodsMsg.stockId),
        quantity: Number(that.data.goodsMsg.quantity),
        expectedAmount: that.data.cashMsg.expectedAmount,
        cashBackPeriods: month
      }, 'POST').then((res) => {
        console.log("aaaa" + JSON.stringify(res))
        if (res.data.messageCode == 'MSG_1001') {
          var cashBackDetails = res.data.content.cashBackDetails
          cashBackDetails.forEach((v, i) => {
            v.cashBackDate = time.formatTimeTwo(v.cashBackDate, 'Y-M-D')
          })
          var interestDetails = res.data.content.interestDetails
          interestDetails.forEach((v, i) => {
            v.cashBackDate = time.formatTimeTwo(v.cashBackDate, 'Y-M-D')
          })
          var cashMsg = that.data.cashMsg
         // console.log("提交数据：" + that.data.cashMsg)
          var obj = that.data.cashMsg
          obj.cashBackPeriods = that.data.monthNumbertemp
          that.setData({
            cashMsg: obj,
            payMsg: res.data.content,
            monthStatus: false,
            reviseStatus3: 0
          })
          wx.showToast({
            title: "修改成功",
            icon: 'none',
            duration: 2000
          })
        } else if (res.data.messageCode == 'MSG_4001') {
          wx.showToast({
            title: res.data.message,
            icon: 'none',
            duration: 2000
          })
        }else{
          wx.showToast({
            title: '分期不可同时存在整月和非整月',
            icon: 'none',
            duration: 2000
          })
        }
      })
    } else {
      wx.showToast({
        title: '请输入正确的数字',
        icon: 'none'
      })
    }

  },
  expectedAmountButton: function() {
    var that = this
   // console.log("提交期望价格" + that.data.expectedAmountNumbertemp)
    var reg = /^\d{0,5}([\b]*|\.|\.\d{0,2}|$)$/
    if (that.data.expectedAmountNumbertemp&&reg.test(that.data.expectedAmountNumbertemp)){
      var expectedAmount = that.data.expectedAmountNumbertemp
      app.Util.ajax('mall/freeShopping/request/calculate', {
        stockId: Number(that.data.goodsMsg.stockId),
        // stockId:3,
        quantity: Number(that.data.goodsMsg.quantity),
        //  quantity: 2,
        expectedAmount: expectedAmount,
        cashBackPeriods: that.data.cashMsg.cashBackPeriods
      }, 'POST').then((res) => {
        //console.log("bbb" + JSON.stringify(res))
        if (res.data.messageCode == 'MSG_1001') {
          var cashBackDetails = res.data.content.cashBackDetails
          cashBackDetails.forEach((v, i) => {
            v.cashBackDate = time.formatTimeTwo(v.cashBackDate, 'Y-M-D')
          })
          var interestDetails = res.data.content.interestDetails
          interestDetails.forEach((v, i) => {
            v.cashBackDate = time.formatTimeTwo(v.cashBackDate, 'Y-M-D')
          })
          var obj = that.data.cashMsg
          obj.expectedAmount = expectedAmount
          that.setData({
            cashMsg: obj,
            payMsg: res.data.content,
            expectedAmountStatus: false,
            reviseStatus3: 0
          })
          wx.showToast({
            title: "修改成功",
            icon: 'none',
            duration: 2000
          })
        } else if (res.data.messageCode == 'MSG_4001') {
          wx.showToast({
            title: res.data.message,
            icon: 'none',
            duration: 2000
          })
        }
      })
    } else {
      wx.showToast({
        title: '请输入正确的数字',
        icon: 'none'
      })
    }
  },
  phoneNumberInputs(e) {
    if (e.detail.value != this.data.inputs[e.currentTarget.dataset.index]) {
      this.setData({
        [`inputs[${e.currentTarget.dataset.index}]`]: e.detail.value
      })
      console.log(this.data.inputs[e.currentTarget.dataset.index])
    }
    let value = this.validateNumber(e.detail.value)
    this.setData({
      expectedAmountValue: value
    })
  },
  validateNumber(val) {
    return val.replace(/\D/g, '')
  },
  //阻止弹框之后的页面滑动问题
  preventTouchMove: function() {

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
  toapplyRule:function(){
    wx.navigateTo({
      url: "/pages/applyRule/applyRule"
    })
  }
})