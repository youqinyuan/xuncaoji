// packageA/pages/businessInfo/businessInfo.js
let app = getApp()
let time = require('../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hostUrl: app.Util.getUrlImg().hostUrl,
    storeId: null,
    store: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this
    that.setData({
      storeId: options.storeId ? options.storeId : null
    })
    that.initStore()
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
  initStore() {
    let that = this;
    let start = ''
    let end = ''
    app.Util.ajax('mall/home/storeDetail', {
      id: that.data.storeId
    }, 'GET').then((res) => {
      if (res.data.content) {
        res.data.content.createTime = time.formatTimeTwo(res.data.content.createTime, 'Y/M/D h:m');
        if (res.data.content.days instanceof Array){
          if(res.data.content.days[res.data.content.days.length-1]-res.data.content.days[0]==res.data.content.days.length-1&&res.data.content.days[res.data.content.days.length-1]!==res.data.content.days[0]){
            for (let i = 0; i < 7; i++){
              if (res.data.content.days[0] == 1) {
                start = '一'
              } else if (res.data.content.days[0] == 2) {
                start = '二'
              } else if (res.data.content.days[0] == 3) {
                start = '三'
              } else if (res.data.content.days[0] == 4) {
                start = '四'
              } else if (res.data.content.days[0] == 5) {
                start = '五'
              } else if (res.data.content.days[0] == 6) {
                start = '六'
              } else if (res.data.content.days[0] == 7) {
                start = '日'
              }
            }
              for (let i = 0; i < 7; i++){
                if (res.data.content.days[res.data.content.days.length-1] == 1) {
                  end = '一'
                } else if (res.data.content.days[res.data.content.days.length-1] == 2) {
                  end = '二'
                } else if (res.data.content.days[res.data.content.days.length-1] == 3) {
                  end = '三'
                } else if (res.data.content.days[res.data.content.days.length-1] == 4) {
                  end = '四'
                } else if (res.data.content.days[res.data.content.days.length-1] == 5) {
                  end = '五'
                } else if (res.data.content.days[res.data.content.days.length-1] == 6) {
                  end = '六'
                } else if (res.data.content.days[res.data.content.days.length-1] == 7) {
                  end = '日'
                } 
              } 
              that.setData({
                start:start,
                end:end
              })
          }else{
            if (res.data.content.days.length>0){
              for (let i = 0; i < res.data.content.days.length; i++){
                if (res.data.content.days[i] == 1) {
                  res.data.content.days[i] = '一'
                } else if (res.data.content.days[i] == 2) {
                  res.data.content.days[i] = '二'
                } else if (res.data.content.days[i] == 3) {
                  res.data.content.days[i] = '三'
                } else if (res.data.content.days[i] == 4) {
                  res.data.content.days[i] = '四'
                } else if (res.data.content.days[i] == 5) {
                  res.data.content.days[i] = '五'
                } else if (res.data.content.days[i] == 6) {
                  res.data.content.days[i] = '六'
                } else if (res.data.content.days[i] == 7) {
                  res.data.content.days[i] = '日'
                }
              }         
            }
          }
        }
        that.setData({
          store: res.data.content
        })
      }
    })
  },
  nav: function () {
    let that = this;
    wx.getLocation({
      type: 'gcj02',
      altitude: true,
      success: function (res) {
        wx.openLocation({ //?使用微信内置地图查看位置。
          latitude: that.data.store.lat, //要去地点的纬度
          longitude: that.data.store.lng, ///要去地点的经度-地址
          name: that.data.store.name, //
          address: that.data.store.addressDetail
        })
      },
      fail: function (res) {
        let is_first = wx.getStorageSync('is_first')
        if (is_first) {
          wx.showModal({
            title: '获取位置信息',
            content: '是否允许获取你的地理位置呢？',
            success: function (res) {
              if (res.confirm) {
                wx.getSetting({
                  success(res) {
                    if (!res.authSetting['scope.userLocation']) {
                      wx.openSetting({
                        success: function (res) {
                          wx.openLocation({ //?使用微信内置地图查看位置。
                            latitude: that.data.store.lat, //要去地点的纬度
                            longitude: that.data.store.lng, ///要去地点的经度-地址
                            name: that.data.orderContent.order.storeName, //
                            address: that.data.store.addressDetail
                          })
                        },
                        fail: function (res) {
                          //用户拒绝位置授权
                        }
                      })
                    }
                  }
                })
              }
              if (res.cancel) {
                //用户拒绝位置授权
              }
            }
          })
        } else {
          //用户拒绝位置授权
          wx.setStorageSync('is_first', true)
        }
      }
    })
  },
  freeTell: function () {
    let that = this
    wx.makePhoneCall({
      phoneNumber: that.data.store.mobileNumber
    })
  },
  //图片预览 - 获取当前显示的http连接
  imgYu: function (e) {
    var that = this
    var src = e.currentTarget.dataset.src; //获取data-src
    that.data.src = src
  },
})