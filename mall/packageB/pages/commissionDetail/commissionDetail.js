// packageB/pages/commissionDetail/commissionDetail.js
var time = require('../../../utils/util.js');
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
    items: [],
    pageNumber: 1,
    pageSize: 20,
    index: null,
    showWay: false, //筛选条件弹窗
    paymentDate: '', //到账时间
    sourceString: '33,9,41,42,43,44,40,38,39', //佣金来源
    sourceString1: [41, 42, 43, 44, 40, 38, 39],
    // sourceString: '', //佣金来源
    amountOrder:'', //金额
    navData: [{
      name: '时间筛选',
      img: app.Util.getUrlImg().hostUrl+'/add/ic_more.png',
      status: 1
    }, {
      name: '金额筛选',
      img: app.Util.getUrlImg().hostUrl+'/add/ic_more.png',
      status: 2
    }, {
      name: '佣金来源',
      img: app.Util.getUrlImg().hostUrl+'/add/ic_more.png',
      status: 3
    }],
    arry2: [{
      name: '从高到低',
      select: false
    }, {
      name: '从低到高',
      select: false
    }],
    arry3: [{
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

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    that.init()
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
    wx.removeStorageSync('amountOrder')
    wx.removeStorageSync('arry2')
    wx.removeStorageSync('sourceString')
    wx.removeStorageSync('arry3')
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    wx.removeStorageSync('amountOrder')
    wx.removeStorageSync('arry2')
    wx.removeStorageSync('sourceString')
    wx.removeStorageSync('arry3')
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
  onShareAppMessage: function() {

  },
  init: function() {
    let that = this
    app.Util.ajax('mall/personal/queryPendingCommissionDetails', {
      pageNumber: that.data.pageNumber,
      pageSize: that.data.pageSize,
      paymentDate: that.data.paymentDate,
      sourceString: that.data.sourceString, //佣金来源
      amountOrder: that.data.amountOrder, //金额
    }, 'GET').then((res) => {
      if (res.data.content) {
        for (var i = 0; i < res.data.content.pendingCommissionItems.items.length; i++) {
          res.data.content.pendingCommissionItems.items[i].createTime = time.formatTimeTwo(res.data.content.pendingCommissionItems.items[i].createTime, 'Y-M-D h:m');
          res.data.content.pendingCommissionItems.items[i].remark = res.data.content.pendingCommissionItems.items[i].remark ? res.data.content.pendingCommissionItems.items[i].remark.slice(0, res.data.content.pendingCommissionItems.items[i].remark.length - 1) + '：' : '未查到数据：'
        }
        that.setData({
          content: res.data.content,
          items: res.data.content.pendingCommissionItems.items
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
    //获取下级级数
    app.Util.ajax('mall/personal/followers', {
      pageNumber: that.data.pageNumber,
      pageSize: that.data.pageSize
    }, 'GET').then((res) => {
      if (res.data.messageCode == 'MSG_1001') {
        that.data.arry3[2].name = `第${res.data.content.level}级普通购买`
        that.data.arry3[3].name = `第${res.data.content.level}级一折购`
        that.setData({
          arry3: that.data.arry3
        })
      }
    })
  },
  getMore1: function() {
    var that = this
    var pageNumber = that.data.pageNumber + 1
    app.Util.ajax('mall/personal/queryPendingCommissionDetails', {
      pageNumber: pageNumber,
      pageSize: that.data.pageSize,
      paymentDate: that.data.paymentDate,
      sourceString: that.data.sourceString, //佣金来源
      amountOrder: that.data.amountOrder, //金额
    }, 'GET').then((res) => {
      if (res.data.messageCode = 'MSG_1001') {
        if (res.data.content.pendingCommissionItems.items == '' && that.data.items !== '') {
          wx.showToast({
            title: '已经到底啦',
            icon: 'none'
          })
        }
        var arr = that.data.items
        for (var i = 0; i < res.data.content.pendingCommissionItems.items.length; i++) {
          res.data.content.pendingCommissionItems.items[i].createTime = time.formatTimeTwo(res.data.content.pendingCommissionItems.items[i].createTime, 'Y-M-D h:m');
          res.data.content.pendingCommissionItems.items[i].remark = res.data.content.pendingCommissionItems.items[i].remark ? res.data.content.pendingCommissionItems.items[i].remark.slice(0, res.data.content.pendingCommissionItems.items[i].remark.length - 1) + '：' : '未查到数据：'
          arr.push(res.data.content.pendingCommissionItems.items[i])
        }
        that.setData({
          items: arr,
          pageNumber: pageNumber
        })
      }
    })
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
      wx.setStorageSync('amountOrder', that.data.amountOrder)
      wx.setStorageSync('arry2', that.data.arry2)
    } else if (that.data.tempStatus == 3) {
      wx.setStorageSync('sourceString', that.data.sourceString)
      wx.setStorageSync('arry3', that.data.arry3)
    }
  },
  cancelCondition: function(e) {
    var that = this
    if (that.data.tempStatus == 2) {
      that.setData({
        amountOrder: wx.getStorageSync('amountOrder'),
        arry2: wx.getStorageSync('arry2')
      })
    } else if (that.data.tempStatus == 3) {
      that.setData({
        sourceString: wx.getStorageSync('sourceString'),
        arry3: wx.getStorageSync('arry3')
      })
    }
    that.setData({
      showWay: false
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
    if (that.data.tempStatus == 2) {
      for (var i in that.data.arry2) {
        that.setData({
          [`arry2[${i}].select`]: false
        });
      }
      that.setData({
        [`arry2[${index}].select`]: true,
      });
      that.setData({
        arry2: that.data.arry2
      })
    } else if (that.data.tempStatus == 3) {
      that.data.arry3[index].select = !that.data.arry3[index].select
      that.setData({
        arry3: that.data.arry3
      })
    }
  },
  sureConfirm: function() {
    var that = this
    if (that.data.tempStatus == 2) {
      var index = that.data.index
      that.data.arry2.forEach((v, i) => {
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
      wx.setStorageSync('arry2', that.data.arry2)
      that.setData({
        pageNumber: 1
      })
      that.init()
      that.setData({
        showWay: false
      })
    } else if (that.data.tempStatus == 3) {
      var sourceString = []
      that.data.arry3.forEach((v, i) => {
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
      wx.setStorageSync('arry3', that.data.arry3)
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
    }
  },
})