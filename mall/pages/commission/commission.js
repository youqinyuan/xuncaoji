// pages/commission/commission.js
var time = require('../../utils/util.js');
let app = getApp()
var newCount = true //节流阀-限制购买提交次数
const date = new Date()
const years = []
const months = []
var thisYer = date.getFullYear()
var thisMon = date.getMonth();
for (let i = 1970; i <= date.getFullYear(); i++) {
  years.push(i);
}
for (let i = 1; i <= date.getMonth() + 1; i++) {
  let month = 0;
  month = i < 10 ? '0' + i : i;
  months.push(month);
}
if (0 <= thisMon && thisMon < 9) {
  thisMon = "0" + (thisMon + 1);
} else {
  thisMon = (thisMon + 1);
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    hostUrl: app.Util.getUrlImg().hostUrl,
    years: years,
    year: thisYer,
    months: months,
    month: thisMon,
    value: [thisYer - 1970, thisMon - 1],
    arryList: [thisYer - 1970, thisMon - 1],
    getTime: '', //到账时间
    showRole: false, //规则弹窗
    tempStatus: null,
    tempTitle: null,
    pageNumber: 1,
    pageSize: 20,
    items: [], //佣金明细
    content: {},
    inputValue1: '', //提现金额
    isFocus: false, //聚焦 
    Value: "", //输入的内容 
    text: '',
    show: false,
    Length: 6, //输入框个数 
    ispassword: true, //是否密文显示 true为密文， false为明文。
    showPassword: false, //是否设置支付密码
    showPsw: false, //支付密码弹窗
    show: false, //提现弹框
    isMember: null, //是否是会员
    html: '',
    index: null,
    showWay: false, //筛选条件弹窗
    paymentDate: '', //到账时间
    sourceString: '33,9,41,42,43,44,40,38,39', //佣金来源
    sourceString2: '',
    sourceString1: [41, 42, 43, 44, 40, 38, 39],
    type: 1, //到账、提现
    amountOrder: '', //金额
    navData: [{
      name: '到账时间',
      img: app.Util.getUrlImg().hostUrl+'/add/ic_more.png',
      status: 1
    }, {
      name: '佣金来源',
      img: app.Util.getUrlImg().hostUrl+'/add/ic_more.png',
      status: 2
    }, {
      name: '到账/提现',
      img: app.Util.getUrlImg().hostUrl+'/add/ic_more.png',
      status: 3
    }, {
      name: '金额筛选',
      img: app.Util.getUrlImg().hostUrl+'/add/ic_more.png',
      status: 4
    }],
    arry2: [{
      name: '下级普通购买',
      select: true,
      sourceString: 41
    }, {
      name: '下级一折购',
      select: true,
      sourceString: 42
    }, {
      name: '第5级普通购买',
      select: true,
      sourceString: 43
    }, {
      name: '第5级一折购',
      select: true,
      sourceString: 44
    }, {
      name: '下级转让待返',
      select: true,
      sourceString: 39
    }, {
      name: '下级购买待返',
      select: true,
      sourceString: 40
    }, {
      name: '下级购买钻石合伙人',
      select: true,
      sourceString: 38
    }],
    arry3: [{
      name: '佣金提现',
      select: true
    }, {
      name: '佣金到账',
      select: true
    }],
    arry4: [{
      name: '从高到低',
      select: false
    }, {
      name: '从低到高',
      select: false
    }],

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
    that.init()
    that.commission()
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
      pageNumber: 1,
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    wx.removeStorageSync('sourceString')
    wx.removeStorageSync('arry2')
    wx.removeStorageSync('type')
    wx.removeStorageSync('arry3')
    wx.removeStorageSync('amountOrder')
    wx.removeStorageSync('arry4')
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    wx.removeStorageSync('sourceString')
    wx.removeStorageSync('arry2')
    wx.removeStorageSync('type')
    wx.removeStorageSync('arry3')
    wx.removeStorageSync('amountOrder')
    wx.removeStorageSync('arry4')
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
    if (that.data.isMember == 1) {
      that.getMore1();
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    return {
      path: "/pages/commission/commission?inviterCode=" + wx.getStorageSync('inviterCode'),
    }
  },
  //点击复制
  copyText: function(e) {
    var that = this
    var text = e.currentTarget.dataset.text
    var text1 = text.toString()
    wx.setClipboardData({
      data: text1,
      success: function(res) {
        wx.getClipboardData({
          success: function(res) {
            wx.showToast({
              title: '复制成功',
              icon: 'none'
            })
          }
        })
      }
    })
  },
  //合伙人介绍
  commission: function() {
    var that = this
    app.Util.ajax('mall/page/queryByType', {
      type: 2,
    }, 'GET').then((res) => {
      if (res.data.messageCode = 'MSG_1001') {
        that.setData({
          html: res.data.content.content
        })
      }
    })
  },
  init: function() {
    let that = this
    app.Util.ajax('mall/personal/queryCommissionDetails', {
      pageNumber: that.data.pageNumber,
      pageSize: that.data.pageSize,
      paymentDate: that.data.paymentDate,
      sourceString: that.data.sourceString, //佣金来源
      type: that.data.type, //到账、提现
      amountOrder: that.data.amountOrder, //金额
    }, 'GET').then((res) => {
      if (res.data.content) {
        res.data.content.totalAmount = Number(res.data.content.balance + res.data.content.pendingCommission).toFixed(2)
        for (var i = 0; i < res.data.content.commissionItem.items.length; i++) {
          res.data.content.commissionItem.items[i].tradeTime = time.formatTimeTwo(res.data.content.commissionItem.items[i].tradeTime, 'Y-M-D h:m');
          res.data.content.commissionItem.items[i].remark = res.data.content.commissionItem.items[i].remark ? res.data.content.commissionItem.items[i].remark.slice(0, res.data.content.commissionItem.items[i].remark.length-1)+'：':'未查到数据：'
        }
        that.setData({
          content: res.data.content,
          items: res.data.content.commissionItem.items
        })
        if (that.data.items.length === 0) {
          that.setData({
            textData: '暂无数据'
          })
        } else {
          that.setData({
            textData: ''
          })
        }
      }
    })
    //是否是会员或者钻石会员
    app.Util.ajax('mall/personal/dashboard', null, 'GET').then((res) => {
      if (res.data.content) {
        that.setData({
          isMember: res.data.content.isMember,
          memberType: res.data.content.memberType
        })
      }
    })
    //获取下级级数
    app.Util.ajax('mall/personal/followers', {
      pageNumber: that.data.pageNumber,
      pageSize: that.data.pageSize
    }, 'GET').then((res) => {
      if (res.data.messageCode == 'MSG_1001') {
        that.data.arry2[2].name = `第${res.data.content.level}级普通购买`
        that.data.arry2[3].name = `第${res.data.content.level}级一折购`
        that.setData({
          arry2: that.data.arry2
        })
      }
    })
  },
  getMore1: function() {
    var that = this
    var pageNumber = that.data.pageNumber + 1
    app.Util.ajax('mall/personal/queryCommissionDetails', {
      pageNumber: pageNumber,
      pageSize: that.data.pageSize,
      paymentDate: that.data.paymentDate,
      sourceString: that.data.sourceString, //佣金来源
      type: that.data.type, //到账、提现
      amountOrder: that.data.amountOrder, //金额
    }, 'GET').then((res) => {
      if (res.data.messageCode = 'MSG_1001') {
        if (res.data.content.commissionItem.items == '' && that.data.items !== '') {
          wx.showToast({
            title: '已经到底啦',
            icon: 'none'
          })
        }
        var arr = that.data.items
        for (var i = 0; i < res.data.content.commissionItem.items.length; i++) {
          res.data.content.commissionItem.items[i].tradeTime = time.formatTimeTwo(res.data.content.commissionItem.items[i].tradeTime, 'Y-M-D h:m');
          res.data.content.commissionItem.items[i].remark = res.data.content.commissionItem.items[i].remark ? res.data.content.commissionItem.items[i].remark.slice(0, res.data.content.commissionItem.items[i].remark.length - 1) + '：' : '未查到数据：'
          arr.push(res.data.content.commissionItem.items[i])
        }
        that.setData({
          items: arr,
          pageNumber: pageNumber
        })
      }
    })
  },

  //规则弹窗
  showRole: function() {
    this.setData({
      showRole: true
    })
  },
  closeShow: function() {
    this.setData({
      showRole: false
    })
  },
  //跳转至会员页面
  jumpMember: function() {
    wx.navigateTo({
      url: '/packageA/pages/member/member',
    })
  },
  //跳转到未到账
  jumpCoomDe: function() {
    wx.navigateTo({
      url: '/pages/commissionDetail/commissionDetail',
    })
  },
  //提现
  showDetail: function() {
    var that = this;
    that.setData({
      show: true
    })
  },
  //隐藏提现模态框
  hide: function() {
    var that = this;
    that.setData({
      show: false
    });
  },
  //获取提现金额
  btnSumbit: function(e) {
    var that = this;
    var mesValue = e.detail.value
    if (mesValue !== '') {
      that.setData({
        inputValue1: mesValue,
        showMessage1: ''
      })
    }
  },
  //获取密码框的值
  Focus(e) {
    var that = this;
    var inputValue = e.detail.value;
    that.setData({
      Value: inputValue
    })
    if (newCount) {
      if (that.data.Value.length === 6) {
        newCount = false
        var amount = that.data.inputValue1
        if (that.data.inputValue1 !== '') {
          app.Util.ajax('mall/personal/transferAudit', {
            status: 2,
            amount: Number(amount),
            source: 2,
            paymentPassword: inputValue
          }, 'POST').then((res) => { // 使用ajax函数
            if (res.data.messageCode == 'MSG_1001') {
              that.setData({
                inputValue1: '',
                pageNumber: 1,
                showPsw: false,
                show: false
              })
              wx.showToast({
                title: '提现成功',
                icon: 'none'
              })
              setTimeout(function() {
                that.init()
              }, 500)
            } else {
              that.setData({
                Value: '',
              })
              wx.showToast({
                title: res.data.message,
                icon: 'none'
              })
            }
          })
        }
      }
    }
    setTimeout(function () {
      newCount = true
    }, 1000)
  },
  //取消支付密码弹框
  cancelShow: function() {
    var that = this;
    that.setData({
      showPsw: false,
      Value: ''
    })
  },
  blur: function(e) {
    var that = this;
    that.setData({
      bottom: 0
    })
  },
  Tap() {
    var that = this;
    that.setData({
      isFocus: true,
    })
  },
  // 是否设置支付密码弹框点击取消
  cancel: function() {
    var that = this
    that.setData({
      showPassword: false
    })
  },
  // 是否设置支付密码弹框点击确定
  sure: function() {
    var that = this
    that.setData({
      showPassword: false
    })
    wx.navigateTo({
      url: '/pages/paypassword/paypassword',
    })
  },
  //确认提现
  hideConfirm: function() {
    var that = this;
    if (that.data.inputValue1 !== '') {
      app.Util.ajax('mall/account/paymentPassword/status', 'GET').then((res) => { // 使用ajax函数
        if (res.messageCode = 'MSG_1001') {
          if (res.data.content == 2) {
            //未设置密码
            that.setData({
              showPassword: true
            })
          } else {
            //已设置密码
            that.setData({
              showPsw: true,
              isFocus: true
            })
          }
        }
      })
    } else {
      that.setData({
        showMessage1: true
      })
    }


  },
  //筛选条件弹窗
  screenCondition: function(e) {
    var that = this
    var status = e.currentTarget.dataset.status
    var title = e.currentTarget.dataset.title
    that.setData({
      tempStatus: status,
      tempTitle: title,
      showWay: true
    })
    if (that.data.tempStatus == 2) {
      wx.setStorageSync('sourceString', that.data.sourceString)
      wx.setStorageSync('arry2', that.data.arry2)
    } else if (that.data.tempStatus == 3) {
      wx.setStorageSync('type', that.data.type)
      wx.setStorageSync('arry3', that.data.arry3)
    } else if (that.data.tempStatus == 4) {
      wx.setStorageSync('amountOrder', that.data.amountOrder)
      wx.setStorageSync('arry4', that.data.arry4)
    }
  },
  cancelCondition: function(e) {
    var that = this
    if (that.data.tempStatus == 2) {
      that.setData({
        sourceString: wx.getStorageSync('sourceString'),
        arry2: wx.getStorageSync('arry2')
      })
    } else if (that.data.tempStatus == 3) {
      that.setData({
        type: wx.getStorageSync('type'),
        arry3: wx.getStorageSync('arry3')
      })
    } else if (that.data.tempStatus == 4) {
      that.setData({
        amountOrder: wx.getStorageSync('amountOrder'),
        arry4: wx.getStorageSync('arry4')
      })
    }
    that.setData({
      showWay: false,
    })
  },
  bindChange: function (e) {
    const val = e.detail.value
    var curYear = val[0] + 1970
    var months = []
    if (curYear == new Date().getFullYear()) {
      for (let i = 1; i <= new Date().getMonth() + 1; i++) {
        let month = 0;
        month = i < 10 ? '0' + i : i;
        months.push(month);
      }
      this.setData({
        months: months,
        arryList: val,
        year: this.data.years[val[0]],
      });
    } else {
      for (let i = 1; i <= 12; i++) {
        let month = 0;
        month = i < 10 ? '0' + i : i;
        months.push(month);
      }
      this.setData({
        months: months,
        arryList: val,
      });
    }
  },
  showConfirm: function() {
    var that = this
    that.setData({
      paymentDate: that.data.years[that.data.arryList[0]] + '-' + that.data.months[that.data.arryList[1]],
      showWay: false,
      value: that.data.arryList,
      pageNumber: 1
    })
    that.init()
  },
  watchAllTime: function() {
    var that = this
    that.setData({
      paymentDate: '',
      showWay: false,
      pageNumber: 1
    })
    that.init()
  },
  tap: function(e) {
    var that = this
    var index = e.currentTarget.dataset.index
    that.setData({
      index: index
    })
    if (that.data.tempStatus == 1) {
      console.log('到账时间')
    } else if (that.data.tempStatus == 2) {
      that.data.arry2[index].select = !that.data.arry2[index].select
      that.setData({
        arry2: that.data.arry2
      })
    } else if (that.data.tempStatus == 3) {
      that.data.arry3[index].select = !that.data.arry3[index].select
      that.setData({
        arry3: that.data.arry3
      })
    } else if (that.data.tempStatus == 4) {
      for (var i in that.data.arry4) {
        that.setData({
          [`arry4[${i}].select`]: false
        });
      }
      that.setData({
        [`arry4[${index}].select`]: true,
      });
      that.setData({
        arry4: that.data.arry4
      })
    }
  },
  sureConfirm: function() {
    var that = this
    if (that.data.tempStatus == 2) {
      var sourceString = []
      that.data.arry2.forEach((v, i) => {
        if (v.select == true) {
          sourceString.push(v.sourceString)
        }
      })
      that.setData({
        sourceString1: sourceString
      })
      that.data.sourceString = that.data.sourceString1.join(',')
      that.setData({
        sourceString: that.data.sourceString,
        sourceString1: that.data.sourceString1
      })
      wx.setStorageSync('sourceString', that.data.sourceString)
      wx.setStorageSync('arry2', that.data.arry2)
      if (that.data.sourceString1.length > 0) {
        that.setData({
          pageNumber: 1
        })
        that.init()
        that.setData({
          showWay: false
        })
      } else {
        wx.showToast({
          title: '请选择至少一个佣金来源',
          icon: 'none'
        })
      }
    } else if (that.data.tempStatus == 3) {
      that.data.arry3.forEach((v, i) => {
        if (that.data.arry3[0].select == true && that.data.arry3[1].select !== true) {
          that.data.type = 3
        } else if (that.data.arry3[0].select !== true && that.data.arry3[1].select == true) {
          that.data.type = 2
        } else if (that.data.arry3[0].select == true && that.data.arry3[1].select == true) {
          that.data.type = 1
        } else {
          that.data.type = 4
        }
      })
      that.setData({
        type: that.data.type
      })
      wx.setStorageSync('type', that.data.type)
      wx.setStorageSync('arry3', that.data.arry3)
      if (that.data.type !== 4) {
        that.setData({
          pageNumber: 1
        })
        that.init()
        that.setData({
          showWay: false
        })
      } else {
        wx.showToast({
          title: '请选择至少一个',
          icon: 'none'
        })
      }
    } else if (that.data.tempStatus == 4) {
      var index = that.data.index
      that.data.arry4.forEach((v, i) => {
        if (index == 0) {
          that.data.amountOrder = 1
        } else if (index == 1) {
          that.data.amountOrder = 2
        }
      })
      that.setData({
        amountOrder: that.data.amountOrder
      })
      wx.setStorageSync('amountOrder', that.data.amountOrder)
      wx.setStorageSync('arry4', that.data.arry4)
      that.setData({
        pageNumber: 1
      })
      that.init()
      that.setData({
        showWay: false
      })
    }
  },
})