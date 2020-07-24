// pages/login/login.js
var interval = null //倒计时函数
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hostUrl: app.Util.getUrlImg().hostUrl,
    phoneNumber: '',
    codeNumber: '',
    text: '',
    content: '',
    getcode: '获取验证码',
    color: '#FF2644',
    currentTime: 60,
    disabled: false,
    provinces: [],
    url: '', //记录从哪个页面跳转进来登录的
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    console.log(options)
    //给当前地址添加缓存，授权之后跳转回原页面
    var pages = getCurrentPages() //获取加载的页面
    var currentPage = pages[pages.length - Number(options.pageNum)]?pages[pages.length - Number(options.pageNum)]:'' //获取当前页面的对象
    var url = currentPage.route?currentPage.route:''
    if (url == 'pages/detail/detail') {
      if (wx.getStorageSync('stages')){
        that.data.url = '/' + url + '?id=' + wx.getStorageSync('goods_id') + '&&stages=' + wx.getStorageSync('stages')
      }else{
        that.data.url = '/' + url + '?id=' + wx.getStorageSync('goods_id')
      }     
    } else if (url == 'packageB/pages/zeroPurchase/zeroPurchase') {
      that.data.url = '/' + url + '?id=' + wx.getStorageSync('zeroGoods_id') + '&&type=' + wx.getStorageSync('type') + '&&orgPrice=' + wx.getStorageSync('orgPrice')
    } else if (url == 'packageB/pages/cooperate/cooperate') {
      that.data.url = '/' + url
    } else if (url == 'packageB/pages/zeroBuy/zeroBuy') {
      that.data.url = '/' + url
    } else if (url == 'packageA/pages/seedMask/seedMask') {
      that.data.url = '/' + url
    } else if (url == 'packageB/pages/zeroPurchaseActivity/zeroPurchaseActivity') {
      that.data.url = '/' + url
    } else if (url == 'pages/wishpool/wishpool') {
      that.data.url = '/' + url
    } else if (url == 'packageB/pages/freeBuy/freeBuy') {
      that.data.url = '/' + url
    }else if (url == 'pages/lovingHeart/lovingHeart') {
      that.data.url = '/' + url
    }else if (url == 'pages/friendSponsor/friendSponsor') {
      that.data.url = '/' + url
    }else if (url == 'pages/sponsor/sponsor') {
      that.data.url = '/' + url
    } else if (url == 'pages/takeoutHomeage/takeoutHomeage') {
      that.data.url = '/' + url
    } else if (url == 'packageA/pages/shareMentionPeriod/shareMentionPeriod') {
      that.data.url = '/' + url
    } else if (url == 'packageA/pages/storeEnter/storeEnter') {
      that.data.url = '/' + url
    }else if (url == 'packageA/pages/takeoutHomeage/takeoutHomeage') {
      that.data.url = '/' + url
    }else if (url == 'packageA/pages/placeorderSearch/placeorderSearch') {
      that.data.url = '/' + 'packageA/pages/takeoutHomeage/takeoutHomeage'
    }
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
    // wx.switchTab({
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  //获取input的值
  bindInput: function(e) {
    var that = this;
    var value = e.detail.value
    that.setData({
      phoneNumber: value
    })
  },
  bindCode: function(e) {
    var that = this;
    var value1
    //验证码限制输入6位数字
    if (e.detail.value.toString().length > 6) {
      value1 = e.detail.value.substring(0, e.detail.value.length - 1);
    } else {
      value1 = e.detail.value
    }
    that.setData({
      codeNumber: value1
    })
  },
  //获取验证码
  getCode: function() {
    var that = this
    var phoneNumber = String(that.data.phoneNumber)
    var currentTime = that.data.currentTime
    if (!(/^1[3456789]\d{9}$/.test(phoneNumber))) {
      // that.setData({
      //   text: '请输入正确的手机号码'
      // })
      wx.showToast({
        title:'请输入正确的手机号码',
        icon:'none'
      })
      return;
    }
    if (/^1[3456789]\d{9}$/.test(phoneNumber)) {
      interval = setInterval(function() {
        currentTime--;
        that.setData({
          getcode: currentTime + 's再次获取',
          color: '#AAAAAA',
          disabled: true
        })
        if (currentTime <= 0) {
          clearInterval(interval)
          that.setData({
            getcode: '重新发送',
            currentTime: 60,
            disabled: false
          })
        }
      }, 1000)
      app.Util.ajax('mall/captcha/send', {
        mobileNumber: phoneNumber,
        business: 1
      }, 'POST').then((res) => { // 使用ajax函数
        if (res.messageCode = 'MSG_1001') {
          // console.log(res)
        }
      })
    } else {
      // that.setData({
      //   text: '请输入手机号码'
      // })
      wx.showToast({
        title:'请输入手机号码',
        icon:'none'
      })
    }

  },
  toIndex: function() {
    var that = this
    var phone = that.data.phoneNumber
    var codeNumber = that.data.codeNumber
    if (phone == '') {
      // that.setData({
      //   text: '请输入手机号码'
      // })
      wx.showToast({
        title:'请输入手机号码',
        icon:'none'
      })
    } else if (!(/^1[3456789]\d{9}$/.test(phone))) {
      // that.setData({
      //   text: '请输入正确的手机号码'
      // })
      wx.showToast({
        title:'请输入正确的手机号码',
        icon:'none'
      })
    } else if (codeNumber == '') {
      // that.setData({
      //   text: '请输入验证码'
      // })
      wx.showToast({
        title:'请输入验证码',
        icon:'none'
      })
    } else if (!(/^[0-9]{6}$/.test(codeNumber))) {
      // that.setData({
      //   text: '验证码输入错误'
      // })
      wx.showToast({
        title:'验证码输入错误',
        icon:'none'
      })
    }
    if (phone !== '' && codeNumber !== '') {
      //刷新code
      wx.login({
        success(res) {
          console.log("获取code成功");
          console.log('res.code:', res.code, res);
          wx.setStorageSync('code', res.code)
          var code = res.code
          var inviterCode1 = wx.getStorageSync('inviterCode1') || ''
          wx.request({
            url: app.Util.getUrlImg().publicUrl + 'mall/account/login',
            method: "POST",
            data: {
              mobileNumber: phone,
              captcha: codeNumber,
              source: 2,
              code: code,
              inviterCode: inviterCode1
            },
            header: {
              "content-type": 'application/json'
            },
            success: function(res) {
              if (res.data.messageCode === 'MSG_1001') {
                console.log(that.data.url)
                wx.removeStorageSync('token')
                wx.setStorageSync('token', res.header.token)
                wx.setStorageSync('inviterCode', res.data.content.inviterCode)
                wx.setStorageSync('newUserCourtesyStatus', res.data.content.fresher)
                app.Util.ajax('mall/personal/cityData', 'GET').then((res) => { // 使用ajax函数
                  if (res.data.content) {
                    that.setData({
                      provinces: res.data.content
                    })
                    wx.setStorageSync('provinces', res.data.content)
                  }
                })
                wx.removeStorageSync('othersInviterCode')
                if (that.data.url !== '') {
                  if (that.data.url == '/pages/wishpool/wishpool') {
                    console.log("心愿池")
                    wx.switchTab({
                      url: '/pages/wishpool/wishpool'
                    })
                  } else {
                    wx.navigateTo({
                      url: that.data.url,
                    })
                  }
                }else{
                  wx.switchTab({
                    url: '/pages/index/index',
                  })
                }
              } else if (res.data.messageCode === 'MSG_4001') {
                wx.navigateBack({
                  delta: 1
                })
                wx.setStorageSync('tips', '请填写正确的邀请码')
                // wx.redirectTo({
                //   url: '/pages/invitationCode/invitationCode?tips=' + '请填写正确的邀请码'
                // })
              } else {
                // that.setData({
                //   text: res.data.message
                // })
                wx.showToast({
                  title:res.data.message,
                  icon:'none'
                })
              }

            }
          })
          // app.Util.ajax('mall/account/login', {
          //   mobileNumber: phone,
          //   captcha: codeNumber,
          //   source: 2,
          //   code: code,
          //   inviterCode: inviterCode1
          // }, 'POST').then((res) => { // 使用ajax函数
          //   console.log(111 + JSON.stringify(res))
          //   if (res.data.messageCode === 'MSG_1001') {
          //     //登录成功，设置登录授权首选项
          //     // app.Util.ajax('mall/personal/preference', {
          //     //   authAvatarNikeName: 1
          //     // }, 'POST').then((res) => {
          //     //   console.log("设置登录授权1:" + res, res)
          //     // })
          //     console.log(222)
          //     wx.setStorageSync('token', res.header.token)
          //     wx.setStorageSync('inviterCode', res.data.content.inviterCode)
          //     wx.setStorageSync('newUserCourtesyStatus', res.data.content.fresher)
          //     app.Util.ajax('mall/personal/cityData', 'GET').then((res) => { // 使用ajax函数
          //       if (res.data.content) {
          //         that.setData({
          //           provinces: res.data.content
          //         })
          //         wx.setStorageSync('provinces', res.data.content)
          //       }
          //     })
          //     wx.removeStorageSync('othersInviterCode')
          //     if (that.data.url != '') {
          //       wx.navigateTo({
          //         url: that.data.url
          //       })
          //     } else {
          //       wx.switchTab({
          //         url: '/pages/index/index'
          //       })
          //     }
          //   } else if (res.data.messageCode === 'MSG_4001') {
          //     wx.redirectTo({
          //       url: '/pages/invitationCode/invitationCode?tips=' + '请填写正确的邀请码'
          //     })
          //   } else {
          //     that.setData({
          //       text: '验证码输入错误'
          //     })
          //   }
          // })
        }
      })
    }
  }
})