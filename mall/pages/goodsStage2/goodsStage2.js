// pages/goodsStage2/goodsStage2.js
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hostUrl: app.Util.getUrlImg().hostUrl,
    choose: false,
    choose1: false,
    relation: '',
    ship: '',
    arry: [{
      name: '父亲',
      select: false,
      status: 1
    }, {
      name: '母亲',
      select: false,
      status: 2
    }, {
      name: '兄弟',
      select: false,
      status: 3
    }, {
      name: '姐妹',
      select: false,
      status: 4
    }, {
      name: '爱人',
      select: false,
      status: 5
    }],
    arry1: [{
      name: '同事',
      select: false,
      status: 1
    }, {
      name: '朋友',
      select: false,
      status: 2
    }, {
      name: '亲戚',
      select: false,
      status: 3
    }]

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    var goodsMessage = wx.getStorageSync('goodsMessage')
    console.log(goodsMessage)
    for (var i in that.data.arry) {
      if (that.data.arry[i].status == goodsMessage.familyRelationship) {
        that.setData({
          [`arry[${i}].select`]: true,
          relation: that.data.arry[i].name
        });       
      }
    }
    for (var i in that.data.arry1) {
      if (that.data.arry1[i].status == goodsMessage.otherRelationship) {
        that.setData({
          [`arry1[${i}].select`]: true,
          ship: that.data.arry1[i].name
        });
      }
    }
    goodsMessage.type = 3
    wx.setStorageSync('goodsMessage', goodsMessage)
    that.setData({
      goodsMessage: goodsMessage
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
  showRelation: function() {
    var that = this
    that.setData({
      choose: !that.data.choose
    })
  },
  tap: function(e) {
    var that = this
    for (var i in that.data.arry) {
      that.setData({
        [`arry[${i}].select`]: false
      });
    }
    that.setData({
      [`arry[${e.currentTarget.dataset.index}].select`]: true,
    });
    that.setData({
      relation: e.currentTarget.dataset.name,
      choose: !that.data.choose
    })
    var goodsMessage = wx.getStorageSync('goodsMessage')
    goodsMessage.familyRelationship = e.currentTarget.dataset.status
    wx.setStorageSync('goodsMessage', goodsMessage)
  },
  showShip: function() {
    var that = this
    that.setData({
      choose1: !that.data.choose1
    })
  },
  tap1: function(e) {
    var that = this
    for (var i in that.data.arry1) {
      that.setData({
        [`arry1[${i}].select`]: false
      });
    }
    that.setData({
      [`arry1[${e.currentTarget.dataset.index}].select`]: true
    });
    that.setData({
      ship: e.currentTarget.dataset.name,
      choose1: false
    })
    var goodsMessage = wx.getStorageSync('goodsMessage')
    goodsMessage.otherRelationship = e.currentTarget.dataset.status
    wx.setStorageSync('goodsMessage', goodsMessage)
  },
  //家庭联系人姓名
  getContactName: function(e) {
    var goodsMessage = wx.getStorageSync('goodsMessage')
    goodsMessage.familyContactName = e.detail.value
    wx.setStorageSync('goodsMessage', goodsMessage)
  },
  //联系电话
  getContactPhone: function(e) {
    var goodsMessage = wx.getStorageSync('goodsMessage')
    goodsMessage.familyContactPhone = e.detail.value
    wx.setStorageSync('goodsMessage', goodsMessage)
  },
  //其他联系人姓名
  getOtherName: function(e) {
    var goodsMessage = wx.getStorageSync('goodsMessage')
    goodsMessage.otherContactName = e.detail.value
    wx.setStorageSync('goodsMessage', goodsMessage)
  },
  //其他联系人电话
  getOtherPhone: function(e) {
    var goodsMessage = wx.getStorageSync('goodsMessage')
    goodsMessage.otherContactPhone = e.detail.value
    wx.setStorageSync('goodsMessage', goodsMessage)
  },
  submit: function() {
    var goodsMessage = wx.getStorageSync('goodsMessage')
    if (!(/^[\u4e00-\u9fa5a-z]+$/gi).test(goodsMessage.familyContactName)) {
      wx.showToast({
        title: '请输入家庭联系人姓名',
        icon: 'none'
      })
    } else if (!(/^1[3456789]\d{9}$/).test(goodsMessage.familyContactPhone)) {
      wx.showToast({
        title: '请输入正确的电话号码',
        icon: 'none'
      })
    } else if (!goodsMessage.familyRelationship) {
      wx.showToast({
        title: '请选择关系',
        icon: 'none'
      })
    } else if (!(/^[\u4e00-\u9fa5a-z]+$/gi).test(goodsMessage.otherContactName)) {
      wx.showToast({
        title: '请输入其他联系人姓名',
        icon: 'none'
      })
    } else if (!(/^1[3456789]\d{9}$/).test(goodsMessage.otherContactPhone)) {
      wx.showToast({
        title: '请输入正确的电话号码',
        icon: 'none'
      })
    } else if (!goodsMessage.otherRelationship) {
      wx.showToast({
        title: '请选择关系',
        icon: 'none'
      })
    } else if (goodsMessage.familyContactName && goodsMessage.familyContactPhone && goodsMessage.familyRelationship && goodsMessage.otherContactName && goodsMessage.otherContactPhone && goodsMessage.otherRelationship) {
      app.Util.ajax('mall/installment/apply', goodsMessage, 'POST').then((res) => {
        if (res.data.messageCode == 'MSG_1001') {
          var objStatus1 = {
            status: 1
          }
          var objStatus = JSON.stringify(objStatus1)
          wx.navigateTo({
            url: '/pages/goodsStage3/goodsStage3?objStatus=' + objStatus,
          })
          wx.setStorageSync('detailPage', 1)
        } else {
          wx.showToast({
            title: res.data.message,
            icon: 'none'
          })
        }
      })
    } else {
      wx.showToast({
        title: '请完整填写内容',
        icon: 'none'
      })
    }
  }
})