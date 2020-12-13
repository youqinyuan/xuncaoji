// packageB/pages/toSponsor/toSponsor.js
let app = getApp()
var interval2 = null
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show1: false,
    productionWidth: 100,
    pageSize: 10,
    pageNumber: 1,
    showModalStatus1: false,
    haibao: false,
    hostUrl: app.Util.getUrlImg().hostUrl,
    sponsorCancle:false,
    haibao:false,
    path_img:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    that.setData({
      options: options
    })
    //页面基础数据初始化
    // that.init(options)
    //推荐商品
    that.init2()
  },
  init: function(options) {
    var that = this
    app.Util.ajax('mall/marketingAuspicesGoods/queryApplyDetail', {
      id: options.id
    }, 'GET').then((res) => { // 使用ajax函数
      if (res.messageCode = 'MSG_1001') {
        that.setData({
          content: res.data.content.apply,
          sponsorItems: res.data.content.sponsorItems
        })
        //分享数据
        setTimeout(function(){
          that.chooseShare()
        },100)
        //倒计时初始化
        that.countDownInit(res.data.content.apply.leftTime)
      } else {
        wx.showToast({
          title: res.data.message,
          icon: 'none'
        })
      }
    })
    app.Util.ajax('mall/marketingAuspicesGoods/queryAuspices', null, 'GET').then((res) => { // 使用ajax函数
      if (res.messageCode = 'MSG_1001') {
        var tempList = []
        for (let i of res.data.content.configList) {
          var obj = {}
          obj.name = i.key
          obj.value = i.value
          tempList.push(obj)
        }
        that.setData({
          configList: tempList
        })
      } else {
        wx.showToast({
          title: res.data.message,
          icon: "none"
        })
      }
    })
   
  },
  formatDuring(mss) {
    var that = this
    const hours = parseInt(mss / 3600000).toString() > 10 ? parseInt(mss / 3600000).toString() : '0' + parseInt(mss / 3600000).toString()
    const minutes = parseInt((mss % (1000 * 60 * 60)) / (1000 * 60)).toString() >= 10 ? parseInt((mss % (1000 * 60 * 60)) / (1000 * 60)).toString() : '0' + parseInt((mss % (1000 * 60 * 60)) / (1000 * 60)).toString()
    const seconds = parseInt((mss % (1000 * 60)) / 1000).toString() >= 10 ? parseInt((mss % (1000 * 60)) / 1000).toString() : '0' + parseInt((mss % (1000 * 60)) / 1000).toString()
    const day = parseInt(hours / 24)
    const hours1 = parseInt(hours % 24)
    that.setData({
      day: day,
      hours: hours,
      hours1: hours1,
      minutes: minutes,
      seconds: seconds
    })
  },
  // 倒计时初始化
  countDownInit: function(time) {
    var that = this
    var current = time
    that.formatDuring(current)
    interval2 = setInterval(() => {
      if (current > 0) {
        current -= 1000
        that.formatDuring(current)
      } else {
        clearInterval(interval2)
        that.setData({
          day: '00',
          hours1: '00', //小时
          hours: "00",
          minutes: '00', //分钟
          seconds: '00' //秒
        })
      }
    }, 1000)
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
    clearInterval(interval2)
    that.init(that.data.options)
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
    this.getMore2()
  },
  //更多好货
  init2: function() {
    var that = this
    var pageNumber = that.data.pageNumber
    var pageSize = that.data.pageSize
    app.Util.ajax('mall/home/bestChoice', {
      pageNumber: pageNumber,
      pageSize: pageSize
    }, 'GET').then((res) => { // 使用ajax函数
      if (res.messageCode = 'MSG_1001') {
        res.data.content.items.forEach((v, i) => {
          v.truePrice = parseFloat((v.dctPrice - v.marketingCashBack.totalAmount).toFixed(2))
        })
        that.setData({
          list: res.data.content.items
        })
      }
    })
  },
  //加载更多好货
  getMore2: function() {
    var that = this
    var pageNumber = that.data.pageNumber + 1
    app.Util.ajax('mall/home/bestChoice', {
      pageNumber: pageNumber,
      pageSize: that.data.pageSize
    }, 'GET').then((res) => { // 使用ajax函数
      if (res.data.content) {
        if (res.data.content.items == '' && that.data.list !== '') {
          that.setData({
            bottom_tishi:'已到底，去【寻商品】提交吧'
          })
        }
        var arr = that.data.list
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
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(res) {
    var that = this
    if (res.from == "button") {
      if (res.target.id === 'btn') {
        // 来自页面内转发按钮
        that.setData({
          showModalStatus1: false
        })
        return {
          title: that.data.shareList.desc,
          path: that.data.shareList.link,
          imageUrl: that.data.shareList.imageUrl,
          success: function(res) {

          },
          fail: function(res) {
            // 转发失败
            console.log("转发失败:" + JSON.stringify(res));
          }
        }
      } else if (res.target.id === 'btnGroup') {
        that.setData({
          showModalStatus1: false
        })
        return {
          title: that.data.shareList.groupDesc,
          path: that.data.shareList.link,
          imageUrl: that.data.shareList.imageUrl,
        }
      }
    } else {
      return {
        title: that.data.shareList.desc,
        path: that.data.shareList.link,
        imageUrl: that.data.shareList.imageUrl,
        success: function(res) {

        },
        fail: function(res) {
          // 转发失败
          console.log("转发失败:" + JSON.stringify(res));
        }
      }
    }
  },
  closeShow1: function() {
    this.setData({
      show1: false
    })
  },
  Show1: function() {
    this.setData({
      show1: true
    })
  },
  //分享
  share: function(e) {
    var that = this
    // var goodsId = e.currentTarget.dataset.goodsid
    that.setData({
      showModalStatus1: true
    })
  },
  cancelShare: function() {
    var that = this
    that.setData({
      showModalStatus1: false
    })
  },
  //查询分享数据
  chooseShare: function() {
    var that = this
    app.Util.ajax('mall/weChat/sharing/target', {
      mode: 13,
      targetId: that.data.content.id
    }, 'GET').then((res) => {
      if (res.data.messageCode == "MSG_1001") {
        that.data.shareData = res.data.content
        var arr = res.data.content
        var inviterCode = res.data.content.inviterCode
        if (inviterCode) {
          arr.link = arr.link.replace(/{inviterCode}/g, inviterCode)
        } else {
          arr.link = arr.link.replace(/{inviterCode}/g, '')
        }
         // 产品图片路径转换为本地路径
         var imageUrl = res.data.content.imageShareUrl
         if (imageUrl) {
           wx.getImageInfo({
             src: imageUrl,
             success(res) {
               that.data.shareImg = res.path
               that.data.path_img = res.path
             }
           })
         }
         // 产品图片路径转换为本地路径
         var imageUrl2 = res.data.content.appletQrCodeUrl
         if (imageUrl2) {
           wx.getImageInfo({
             src: imageUrl2,
             success(res) {
               that.data.appletQrCodeUrl = res.path
             }
           })
         }
        that.setData({
          shareList: arr
        })
      } else {
        wx.showToast({
          title: res.data.message,
          icon: 'none',
          duration: 3000
        })
      }
    })
  },
  toPlaceOrder: function() {
    var that = this
    if (that.data.content.status == 'ORDERED_PROGRESS_TO_PAY' || that.data.content.status == 'ORDERED_TO_PAY') {
      wx.navigateTo({
        url: `/pages/paymentorder/paymentorder?id=${that.data.content.transStatementId}&buymode=2`,
      })
    } else {
      var sponsorId = that.data.content.id
      var goodsType = 1 //freeBuy单个商品
      wx.navigateTo({
        url: "/pages/placeorder/placeorder?sponsorId=" + sponsorId + "&&goodsType=" + goodsType
      })
    }
  },
  toGoodsDetail: function(e) {
    var id = e.currentTarget.dataset.id
    console.log(id)
    wx.navigateTo({
      url: "/pages/detail/detail?id=" + id
    })
  },
  showCancle:function(e){
    this.setData({
      sponsorCancle:true,
      sponsorId:e.currentTarget.dataset.id
    })
  },
  closeShow:function(){
    this.setData({
      sponsorCancle:false
    })
  },
  shure:function(){
    let that = this
    let sponsorId = that.data.sponsorId
    app.Util.ajax('mall/marketingAuspicesGoods/cancelApply', {id:sponsorId}, 'POST').then((res) => {
      if (res.data.messageCode == 'MSG_1001') {
        that.setData({
          sponsorCancle:false
        })
        wx.showToast({
          title:'取消成功',
          icon:'none'
        })
        setTimeout(function(){
          clearInterval(interval2)
          that.init(that.data.options)
        },1000)
      } else {
        wx.showToast({
          title:res.data.message,
          icon:'none'
        })
      }
    })
  },
    // 分享到朋友圈
    shareFriend: function() {
      var that = this
      var width
      var height
      wx.getSystemInfo({
        success(res) {
          width = res.screenWidth
          height = res.screenHeight
        }
      })
      var ctx = wx.createCanvasContext('mycanvas');
      var path_bg = '/assets/images/icon/bg.png'; //背景图片
      var path_bg2 = '/assets/images/icon/canvas_title.png';
      var path_logo = '/assets/images/icon/xuncaoji_icon.png'
      var path_partner = '/assets/images/icon/partner.png'
      var title = that.data.shareList.title
      var inviterCode = that.data.shareData.inviterCode
      console.log(title,inviterCode)
      //绘制图片模板的背景图片
      ctx.drawImage(path_bg, 0, 0, 0.88 * width, 0.89 * height);
      //绘制红色背景
      ctx.drawImage(path_bg2, 0, 0, 0.885 * width, 0.224 * height);
      // 绘制标题
      ctx.setFontSize(13);
      ctx.setFillStyle('#fff');
      ctx.setTextAlign("center")
      ctx.fillText(title, 0.442 * width, 25);
      ctx.stroke();
      // 绘制中间矩形
      ctx.beginPath()
      ctx.setFillStyle('#fff')
      ctx.setShadow(0, 0, 2, '#eee')
      ctx.fillRect(0.057 * width, 0.08 * height, 0.76 * width, 0.522 * height - 2)
      ctx.closePath()
      //绘制合伙人图标
      ctx.beginPath()
      ctx.drawImage(path_partner, 0.35 * width, 44, 64, 51);
      ctx.closePath()
      // 绘制邀请码
      if (inviterCode) {
        ctx.beginPath()
        ctx.setFontSize(19);
        ctx.setFillStyle('#F85A53');
        ctx.fillText(`我的邀请码:${inviterCode}`, 0.442 * width, 120);
        ctx.stroke();
        ctx.closePath()
      }
      // 绘制最小矩形
      ctx.beginPath()
      ctx.setFillStyle('#fff')
      ctx.setShadow(0, 0, 2, '#eee')
      ctx.fillRect(0.1308 * width, 130, 0.617 * width, 0.3 * height)
      ctx.closePath()
      // 绘制商品图片
      ctx.beginPath()
      ctx.drawImage(that.data.path_img, 0.1308 * width + 7, 137, 0.617 * width - 14, 0.3 * height - 14);
      ctx.closePath()
                // 绘制已抢数量
    ctx.beginPath()
    var number = '赞助中'
    var textWidth = inviterCode ? ctx.measureText(number).width : ctx.measureText(number).width + 50
    ctx.setFillStyle('#F5BA2C');
    ctx.moveTo(0.1308 * width, 174)
    ctx.lineTo(0.1308 * width, 180)
    ctx.lineTo(0.1308 * width - 10, 174)
    ctx.lineTo(0.1308 * width - 10, 150)
    ctx.lineTo(0.1308 * width + textWidth / 2 + 22, 150)
    ctx.lineTo(0.1308 * width + textWidth / 2 + 22, 174)
    ctx.lineTo(0.1308 * width - 10, 174)
    ctx.arc(0.1308 * width + textWidth / 2 + 22, 162, 12, 1.5 * Math.PI, 0.5 * Math.PI, false)
    ctx.closePath()
    ctx.fill()
    ctx.beginPath()
    ctx.setFontSize(12);
    ctx.setFillStyle('#fff');
    ctx.setTextAlign("left")
    ctx.fillText(number, 0.1308 * width, 167);
    ctx.closePath()
    ctx.stroke();
      // 绘制广告语
      ctx.beginPath()
      var adTips = that.data.shareList.imageDesc
      ctx.setFontSize(14);
      ctx.setFillStyle('#333333');
      ctx.setTextAlign("left")
      let chr = adTips.split('') // 分割为字符串数组
      let temp = ''
      let row = []
      for (let a = 0; a < chr.length; a++) {
        if (ctx.measureText(temp).width < 0.65 * width) {
          temp += chr[a]
        } else {
          a--
          row.push(temp)
          temp = ''
        }
      }
      row.push(temp)
      for (var b = 0; b < row.length; b++) {
        ctx.fillText(row[b], 0.1308 * width - 6, 0.565 * height - 4 + b * 20);
      }
      ctx.stroke();
      ctx.closePath()
      // 绘制二维码
      ctx.setShadow(0, 0, 0, '#fff')
      ctx.beginPath()
      ctx.drawImage(that.data.appletQrCodeUrl, 0.3 * width, 0.6075 * height - 2, 0.3 * width, 0.3 * width);
      ctx.closePath()
      // 绘制扫码提示
      ctx.beginPath()
      var codeTips = '长按图片识别二维码查看领取'
      ctx.setFontSize(12);
      ctx.setFillStyle('#999999');
      ctx.setTextAlign("center")
      ctx.fillText(codeTips, 0.44 * width, 0.787 * height - 2);
      ctx.stroke();
      ctx.closePath()
      ctx.draw()
      setTimeout(function() {
        wx.canvasToTempFilePath({
          canvasId: 'mycanvas',
          success: function(res) {
            that.data.haibaoImg = res.tempFilePath
          }
        })
      }, 1000)
      that.setData({
        showModalStatus1: false,
        haibao: true
      })
    },
    // 长按保存到相册
    handleLongPress: function() {
      var that = this
      var tempFilePath = that.data.haibaoImg
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
                      haibao: false
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
                  success: function(res) {
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
                                haibao: false
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
                  haibao: false
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
      // 关闭海报分享页面
      close_hb: function() {
        var that = this
        that.setData({
          haibao: false
        })
      },
})