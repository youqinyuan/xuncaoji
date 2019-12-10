// pages/cityPartner/cityPartner.js
var interval = null //倒计时函数
let app = getApp()
var card = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    name: '', //姓名
    city: [], //城市
    cardNum: '', //银行卡号
    cardNumber: '',
    address: '', //开户地址
    phoneNum: '', //手机号码
    codeNum: '', //验证码
    cityColor: '#AAAAAA',
    cityPickerValue: [],
    getcode: '获取验证码',
    color: '#3C8AFF',
    currentTime: 60,
    disabled: false,
    isShowCity: false, //是否显示城市那一行
    isReplace: false, //是否替换城市内容
    shareImg: '', //分享图片
    index: '', //选择的数组哪一个
    districtIdList: [], //区ID
    isCityPartner:false,
    status: null, 
    bgColor: '#f4f4f4',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    //初始化页面
    that.initPage()
    //下载线上图片到本地，用于绘制分享图片
    wx.downloadFile({
      url: 'https://xuncj.yzsaas.cn/_download/img/shre_img.png',
      success: function(res) {
        that.setData({
          shareImg: res.tempFilePath
        })
      },
      fail: function(res) {

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
    var that = this
    return {
      title: '【钻石合伙人招募令】加入寻草记～共赢未来，带你提前实现财富自由！！！',
      path: '/pages/diamondPartner/diamondPartner?inviterCode=' + wx.getStorageSync('inviterCode'),
      imageUrl: that.data.shareImg,
    }
  },
  initPage: function() {
    var that = this
    app.Util.ajax('mall/cityPartner/find', 'GET').then((res) => {
      if (res.data.content) {
        var card = res.data.content.bankCardNumber.replace(/(\d{4})(?=\d)/g, "$1-"); //replace(/\s/g,'');
        that.setData({
          isCityPartner: false,
          bgColor: '#fff',
          status: res.data.content.status,
          cityColor: '#666',
          isShowCity: true,
          id: res.data.content.id,
          name: res.data.content.realName, //真实姓名
          city: res.data.content.cityPartnerAreaList, //城市
          cardNum: card, //银行卡号
          cardNumber: res.data.content.bankCardNumber,
          address: res.data.content.bankAddress, //开户地址 
          phoneNum: res.data.content.applyPhone //申请号码       
        })
        var city = that.data.city
        var cityId = []
        for (var i = 0; i < city.length; i++) {
          cityId.push(city[i].districtId)
        }
        that.setData({
          districtIdList: cityId
        })
      } else {
        that.setData({
          isCityPartner:true,
          bgColor: '#f4f4f4',
          id: '',
          name: '', //姓名
          city: [], //城市
          cardNum: '', //银行卡号
          cardNumber: '',
          address: '', //开户地址
          phoneNum: '', //手机号码
          codeNum: '', //验证码
          districtIdList: []
        })
      }
    })
  },
  //获取姓名
  bindName: function(e) {
    var that = this
    that.setData({
      name: e.detail.value
    })
  },
  //获取银行卡号
  bindCardNum: function(e) {
    var that = this
    var cardNumber = e.detail.value
    that.setData({
      cardNumber: String(cardNumber)
    })
    var card = cardNumber.replace(/(\d{4})(?=\d)/g, "$1-"); //replace(/\s/g,'');
    this.setData({
      cardNum: card
    })
  },
  //获取开户地址
  bindAddress: function(e) {
    var that = this
    that.setData({
      address: e.detail.value
    })
  },
  //城市选择确认
  cityPickerOnSureClick: function(e) {
    var that = this;
    if (that.data.isReplace == false) {
      var cityAdress = e.detail.valueName[0] + '-' + e.detail.valueName[1] + '-' + e.detail.valueName[2];
      var cityObj = {};
      cityObj['address'] = cityAdress
      cityObj['districtId'] = e.detail.valueCode[2]  
      that.data.city.push(cityObj)  
      that.setData({
        city: that.data.city,
        isShowCity: true,        
        cityPickerValue: e.detail.valueCode,
        cityPickerIsShow: false,
        cityColor: '#666'
      });
      var city = that.data.city
      var cityId = []
      for (var i = 0; i < city.length; i++) {
        cityId.push(city[i].districtId)
      }
      that.setData({
        districtIdList: cityId
      })
    } else {
      var city = that.data.city
      for (var i = 0; i < city.length; i++) {
        if (i == that.data.index) {
          city[i].address = e.detail.valueName[0] + '-' + e.detail.valueName[1] + '-' + e.detail.valueName[2],
            city[i].provinceId = e.detail.valueCode[0]
          city[i].cityId = e.detail.valueCode[1]
          city[i].districtId = e.detail.valueCode[2]
        }
      }
      that.setData({
        city: that.data.city,
        cityPickerValue: e.detail.valueCode,
        cityPickerIsShow: false,
      })
      var city = that.data.city
      var cityId = []
      for (var i = 0; i < city.length; i++) {
        cityId.push(city[i].districtId)
      }
      that.setData({
        districtIdList: cityId
      })
    }
  },
  //城市选择取消
  cityPickerOnCancelClick: function(e) {
    var that = this;
    that.setData({
      cityPickerIsShow: false,
    });
  },
  showCityPicker: function(e) {
    var that = this;
    that.setData({
      cityPickerIsShow: true,
      isReplace: false
    });
  },
  showCity: function(e) {
    var that = this;
    that.setData({
      cityPickerIsShow: true,
      isReplace: true,
      index: e.currentTarget.dataset.index
    });
  },
  //删除城市
  delCity: function(e) {
    var that = this
    that.data.city.splice(e.currentTarget.dataset.index, 1)
    that.setData({
      city: that.data.city
    })
  },
  //获取电话号码
  bindPhone: function(e) {
    var that = this;
    that.setData({
      phoneNum: e.detail.value
    })
  },
  //获取验证码
  bindCode: function(e) {
    var that = this;
    that.setData({
      codeNum: e.detail.value
    })
  },
  //获取验证码
  getCode: function() {
    var that = this
    var phoneNumber = String(that.data.phoneNum)
    var currentTime = that.data.currentTime
    if (!(/^1[3456789]\d{9}$/.test(phoneNumber))) {
      wx.showToast({
        title: '请输入正确的手机号码',
        icon: 'none'
      })
      return false;
    }
    if (phoneNumber !== '') {
      interval = setInterval(function() {
        currentTime--;
        that.setData({
          getcode: currentTime + 's重新获取',
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
        business: 4
      }, 'POST').then((res) => { // 使用ajax函数
        if (res.messageCode === 'MSG_1001') {
          console.log(res)
        }
      })
    }
  },
  submit: function() {
    var that = this
    if (!(/^[\u4E00-\u9FA5A-Za-z\s]+(·[\u4E00-\u9FA5A-Za-z]+)*$/.test(that.data.name))) {
      wx.showToast({
        title: '请输入您的真实姓名',
        icon: 'none'
      })
    } else if (that.data.city == '') {
      wx.showToast({
        title: '请选择您要合伙的城市',
        icon: 'none'
      })
    } else if (that.data.cardNumber == '') {
      wx.showToast({
        title: '请输入您的银行卡号',
        icon: 'none'
      })
    } else if (that.data.address == '') {
      wx.showToast({
        title: '请输入您的开户地址',
        icon: 'none'
      })
    } else if (!(/^1[3456789]\d{9}$/.test(that.data.phoneNum))) {
      wx.showToast({
        title: '请输入正确的手机号码',
        icon: 'none'
      })
    } else if (!(/^[0-9]{6}$/.test(that.data.codeNum))) {
      wx.showToast({
        title: '请输入验证码',
        icon: 'none'
      })
    } else if (that.data.name !== '' && that.data.city !== '' && that.data.cardNumber !== '' && that.data.address !== '' && that.data.phoneNum !== '' && that.data.codeNum !== '') {
      app.Util.ajax('mall/cityPartner/apply', {
        id: that.data.id,
        realName: that.data.name,
        bankCardNumber: that.data.cardNumber,
        bankAddress: that.data.address,
        applyPhone: that.data.phoneNum,
        captcha: that.data.codeNum,
        districtIdList: that.data.districtIdList
      }, 'POST').then((res) => {
        if (res.data.content) {
          wx.showToast({
            title: '申请已提交请耐心等待',
            icon: 'none'
          })
        } else {
          wx.showToast({
            title: res.data.message,
            icon: 'none'
          })
        }
      })
    } else {
      wx.showToast({
        title: '输入框不能为空',
        icon: 'none'
      })
    }
  },
  //跳转至申请合伙人页面
  jumpCityPartner: function () {
    var that = this
    that.setData({
      isCityPartner:true,
      bgColor: '#f4f4f4',
    })
  },
  //长按保存
  saveCode: function () {
    var that = this
    var tempFilePath = '/assets/images/icon/code.png'
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.writePhotosAlbum']) {
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success() {
              console.log('授权相册')
              wx.saveImageToPhotosAlbum({
                filePath: tempFilePath,
                success(res) {
                  wx.hideLoading()
                  console.log('保存图片成功回调')
                  wx.showToast({
                    title: '保存成功',
                    icon: 'none'
                  });
                  that.setData({
                    showMark: false
                  })
                },
                fail(res) {
                  wx.hideLoading()
                  console.log('保存图片失败回调')
                  console.log(res);
                }
              })
            },
            fail() {
              wx.hideLoading();
              wx.showModal({
                title: '温馨提示',
                content: '您已拒绝授权，是否去设置打开？',
                confirmText: "确认",
                cancelText: "取消",
                success: function (res) {
                  console.log(res);
                  if (res.confirm) {
                    console.log('用户点击确认')
                    wx.openSetting({
                      success: (res) => {
                        console.log(res)
                        res.authSetting = {
                          "scope.writePhotosAlbum": true,
                        }
                        console.log("openSetting: success");
                        wx.saveImageToPhotosAlbum({
                          filePath: tempFilePath,
                          success(res) {
                            wx.hideLoading()
                            wx.showToast({
                              title: '保存成功',
                              icon: 'none'
                            });
                            that.setData({
                              showMark: false
                            })
                          },
                          fail(res) {
                            wx.hideLoading()
                            console.log(res);
                          }
                        })
                      }
                    });
                  } else {
                    console.log('用户点击取消')
                  }
                }
              });

            }
          })
        } else {
          console.log('保存图片')
          wx.saveImageToPhotosAlbum({
            filePath: tempFilePath,
            success(res) {
              wx.hideLoading()
              console.log('保存图片成功回调')
              wx.showToast({
                title: '保存成功',
                icon: 'none'
              });

              that.setData({
                showMark: false
              })
            },
            fail(res) {
              wx.hideLoading()
              console.log('saveImageToPhotosAlbum 失败回调')
              console.log(res);
            }
          })
        }
      },
      fail(res) {
        wx.hideLoading()
        console.log('wx.getSetting 失败回调')
        console.log(res);
      }
    })
  },
})