// pages/zeroPurchase/zeroPurchase.js
var time = require('../../utils/util.js');
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    autoplay: true,
    circular: true,
    interval: 2000,
    duration: 1000,
    goodsId: 1, //商品id
    imageUrls: [], //轮播图
    detail: {}, //详情
    comment: [], //商品评论
    pageNumber: 1,
    pageSize: 6,
    shareList: {}, //分享数据
    introductions: [], //店铺详情
    showModal: false, //公众号弹框
    showModalStatus1: false, //分享弹框
    inputValue1: '', //验证码
    show: false, //分享弹框
    hours: [0, 0], //小时
    minutes: [0, 0], //分钟
    seconds: [0, 0], //秒
    haoSeconds: [0, 0], //毫秒
    inviterCode: '',
    imageUrl: '../../assets/images/icon/shareDetail.png',
    haibao: false,
    appletQrCodeUrl: '', //邀请码路径
    haibaoImg: '', //生成的海报
  },
  imgYu: function(e) {
    var src = e.currentTarget.dataset.src; //获取data-src
    var imgList = e.currentTarget.dataset.list; //获取data-list
    //图片预览
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: imgList // 需要预览的图片http链接列表
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // home / activity / freeShopping / goodsDetail
    console.log(options)
    var that = this
    var id = options.id
    that.setData({
      goodsId: id
    })
    if (options.inviterCode) {
      that.data.inviterCode = options.inviterCode
    }
    that.chooseShare();
    app.Util.ajax(`mall/home/activity/freeShopping/goodsDetail?id=${id}`, null, 'GET').then((res) => { // 使用ajax函数
      if (res.data.content) {
        let current = res.data.content.remainingTime
        let interval2 = setInterval(() => {
          if (current > 0) {
            current -= 1000
            that.formatDuring(current)
          } else {
            clearInterval(interval2)
            this.setData({
              waitPay: ''
            })
          }
        }, 1000)
        that.setData({
          imageUrls: res.data.content.goodsItem.imageUrls,
          detail: res.data.content,
          introductions: res.data.content.goodsItem.introductions.length ? res.data.content.goodsItem.introductions : []
        })
      }
    })
    var token = wx.getStorageSync('token')
    if (token) {
      app.Util.ajax('mall/home/activity/freeShopping/placeOrder/validate', {
        goodsId: that.data.goodsId
      }, 'POST').then((res) => { // 使用ajax函数
        if (res.data.content) {
          if (res.data.content.status === 2) {
            that.setData({
              show: true
            })
            //分享
            that.chooseShare();
          }
        }
      })
    }
    //商品评论
    that.comment();
  },
  //查询分享数据
  chooseShare: function() {
    var that = this
    app.Util.ajax('mall/weChat/sharing/target', {
      mode: 2,
      targetId: that.data.goodsId
    }, 'GET').then((res) => {
      if (res.messageCode = 'MSG_1001') {
        var inviterCode = wx.getStorageSync('inviterCode')
        if (inviterCode) {
          res.data.content.link = res.data.content.link.replace(/{inviterCode}/g, inviterCode)
        } else {
          res.data.content.link = res.data.content.link.replace(/{inviterCode}/g, '')
        }
        that.setData({
          shareList: res.data.content
        })
      }
    })
  },
  //取消分享弹框
  cancelShare: function() {
    var that = this
    that.setData({
      showModalStatus1: false
    })
  },
  formatDuring(mss) {
    var that = this
    const hours = parseInt(mss / (1000 * 60 * 60)).toString()
    const minutes = parseInt((mss % (1000 * 60 * 60)) / (1000 * 60)).toString()
    const seconds = parseInt((mss % (1000 * 60)) / 1000).toString()
    const haoSeconds = parseInt((mss % (60))).toString()
    that.setData({
      hours: hours.split(''),
      minutes: minutes.split(''),
      seconds: seconds.split(''),
      haoSeconds: haoSeconds.split('')
    })
  },
  //商品评论
  comment: function() {
    var that = this
    app.Util.ajax('mall/interact/queryUserInteract', {
      pageNumber: that.data.pageNumber,
      pageSize: that.data.pageSize,
      goodsId: that.data.goodsId
    }, 'GET').then((res) => {
      if (res.messageCode = 'MSG_1001') {
        if (res.data.content.items.length > 0) {
          res.data.content.items[0].createTime = time.formatTimeTwo(res.data.content.items[0].createTime, 'Y-M-D h:m:s')
        }
        that.setData({
          goodInteractRate: res.data.content.goodInteractRate,
          comment: res.data.content.items
        })
      }
    })
  },
  //跳转到评价页面
  jumpEvaluate: function(e) {
    var goodsId = e.currentTarget.dataset.goodsid
    wx.navigateTo({
      url: `/pages/evaluate/evaluate?goodsId=${goodsId}`
    })
  },
  //跳转到提交订单
  toPlaceorder: function(e) {
    var that = this
    var activityGoodsId = e.currentTarget.dataset.activitygoodsid
    var goodsId = e.currentTarget.dataset.goodsid
    var token = wx.getStorageSync('token')
    if (token) {
      app.Util.ajax('mall/home/activity/freeShopping/placeOrder/validate', {
        goodsId: goodsId
      }, 'POST').then((res) => { // 使用ajax函数
        if (res.data.content) {
          if (res.data.content.status === 1) {
            wx.navigateTo({
              url: `/pages/placeorder/placeorder?activityGoodsId=${activityGoodsId}&goodsId=${goodsId}`
            })
          } else if (res.data.content.status === 2) {
            that.setData({
              show: true
            })
            app.Util.ajax('mall/weChat/sharing/target', {
              mode: 2,
              targetId: that.data.goodsId
            }, 'GET').then((res) => {
              if (res.data.content) {
                var inviterCode = wx.getStorageSync('inviterCode')
                if (inviterCode) {
                  res.data.content.link = res.data.content.link.replace(/{inviterCode}/g, inviterCode)
                } else {
                  res.data.content.link = res.data.content.link.replace(/{inviterCode}/g, '')
                }
                that.setData({
                  shareList: res.data.content
                })
              }
            })
          } else if (res.data.content.status === 3) {
            that.setData({
              showModal: true
            })
          }
        } else {
          wx.showToast({
            title: '亲，留点机会给别人吧',
            icon: 'none'
          })
        }
      })
    } else {
      wx.navigateTo({
        url: '/pages/invitationCode/invitationCode?inviterCode=' + that.data.inviterCode,
      })
    }

  },
  //关闭公众号弹框
  hideModal: function() {
    var that = this;
    that.setData({
      showModal: false
    })
  },
  //获取验证码
  btnSumbit: function(e) {
    var that = this;
    var mesValue = e.detail.value
    that.setData({
      inputValue1: mesValue
    })
    console.log(mesValue)
  },
  sure: function() {
    var that = this
    if (that.data.inputValue1 == '') {
      wx.showToast({
        title: '请输入正确的验证码',
        icon: 'none'
      })
    } else {
      app.Util.ajax('mall/weChat/weChatCheckCode', {
        code: that.data.inputValue1
      }, 'POST').then((res) => {
        if (res.data.content === true) {
          wx.showToast({
            title: '关注成功!',
            icon: 'none'
          })
          that.setData({
            showModal: false
          })
        } else {
          wx.showToast({
            title: res.data.message,
            icon: 'none'
          })
        }
      })
    }
  },
  //关闭分享弹框
  cancelShow: function() {
    var that = this
    that.setData({
      show: false,
      showModalStatus1: true
    })
  },
  cancelShare: function() {
    this.setData({
      showModalStatus1: false
    })
  },
  //分享朋友圈
  shareFriend: function() {
    var that = this
    wx.showLoading({
      title: '加载中',
    })
    app.Util.ajax('mall/weChat/sharing/snapshot/target', {
      mode: 3,
    }, 'GET').then((res) => {
      console.log(res)
      if (res.messageCode = 'MSG_1001') {
        var cashBack = res.data.content.cashBack
        var desc = res.data.content.desc
        var participants = res.data.content.participants
        var inviterCode = res.data.content.inviterCode
        var price = res.data.content.price
        var appletQrCodeUrl = res.data.content.appletQrCodeUrl
        //邀请码转换为本地路径
        wx.getImageInfo({
          src: appletQrCodeUrl,
          success(res) {
            appletQrCodeUrl = res.path
            var width
            var height
            wx.getSystemInfo({
              success(res) {
                width = res.screenWidth
                height = res.screenHeight
              }
            })
            console.log(width, height)
            var ctx = wx.createCanvasContext('mycanvas');
            var path_bg = '/assets/images/icon/bg.png'; //背景图片
            var path_logo = '/assets/images/icon/logo_share.png'
            var title = '种草达人的欢乐场'
            inviterCode = `邀请码: ${inviterCode}`
            //绘制图片模板的背景图片
            ctx.drawImage(path_bg, 0, 0, 0.88 * width, 0.89 * height);
            //绘制logo
            ctx.drawImage(path_logo, 0.384 * width, 0.055 * height, 0.133 * width, 0.133 * width);
            // 绘制标题
            ctx.setFontSize(13);
            ctx.setFillStyle('#fff');
            ctx.fillText(title, 0.32 * width, 26);
            ctx.stroke();
            // 绘制邀请码
            if (inviterCode != '邀请码: undefined') {
              ctx.setFontSize(20);
              ctx.setFillStyle('#FF517A');
              ctx.fillText(inviterCode, 0.25 * width, 0.055 * height + 0.14 * width + 20);
              ctx.stroke();
            }
            // 绘制产品图
            ctx.drawImage('/assets/images/icon/bg_zero.png', 0.068 * width, 0.17 * height, 0.74 * width, 0.327 * height);
            ctx.drawImage('/assets/images/icon/bg_yellow.png', 0.068 * width, 0.418 * height, 0.74 * width, 0.08 * height);
            ctx.setFillStyle('#FF96AF');
            ctx.setStrokeStyle('#FF96AF')
            ctx.beginPath()
            ctx.arc(0.54 * width, 0.2 * height - 5, 10, 1.5 * Math.PI, 0.5 * Math.PI, true)
            ctx.closePath()
            ctx.fill()
            ctx.beginPath()
            ctx.moveTo(0.84 * width - 6, 0.2 * height + 5)
            ctx.lineTo(0.84 * width - 6, 0.2 * height - 15)
            ctx.lineTo(0.54 * width, 0.2 * height - 15)
            ctx.lineTo(0.54 * width, 0.2 * height + 5)
            ctx.lineTo(0.84 * width - 6, 0.2 * height + 5)
            ctx.lineTo(0.84 * width - 12, 0.2 * height + 10)
            ctx.lineTo(0.84 * width - 12, 0.2 * height + 5)
            ctx.closePath()
            ctx.fill();
            ctx.beginPath()
            ctx.setFontSize(12);
            ctx.setFillStyle('#fff');
            ctx.fillText(`拉新人数: ${participants}`, 0.54 * width, 0.2 * height);
            ctx.stroke();
            ctx.closePath()
            ctx.beginPath()
            ctx.setFontSize(27);
            ctx.setFillStyle('#E33A59');
            ctx.fillText(`¥ ${price}`, 0.1 * width, 0.485 * height);
            ctx.closePath()
            ctx.stroke();
            ctx.beginPath()
            ctx.setFillStyle('#FF96AF');
            ctx.setStrokeStyle('#FF96AF')
            ctx.moveTo(0.45 * width - 6, 0.48 * height - 4)
            ctx.lineTo(0.45 * width, 0.48 * height - 8)
            ctx.lineTo(0.45 * width, 0.48 * height - 16)
            ctx.lineTo(0.45 * width + 100, 0.48 * height - 16)
            ctx.lineTo(0.45 * width + 100, 0.48 * height + 8)
            ctx.lineTo(0.45 * width, 0.48 * height + 8)
            ctx.lineTo(0.45 * width, 0.48 * height + 2)
            ctx.lineTo(0.45 * width - 6, 0.48 * height - 4)
            ctx.closePath()
            ctx.fill()
            ctx.beginPath()
            ctx.setFontSize(12);
            ctx.setFillStyle('#fff');
            ctx.fillText(`参与返¥ ${cashBack}`, 0.45 * width + 6, 0.48 * height);
            ctx.closePath()
            ctx.stroke();
            // 绘制描述
            ctx.setFontSize(14);
            ctx.setFillStyle('#333');
            var test = desc
            let chr = test.split('') // 分割为字符串数组
            let temp = ''
            let row = []
            for (let a = 0; a < chr.length; a++) {
              if (ctx.measureText(temp).width < 0.7 * width) {
                temp += chr[a]
              } else {
                a--
                row.push(temp)
                temp = ''
              }
            }
            row.push(temp)
            for (var b = 0; b < row.length; b++) {
              ctx.fillText(row[b], 0.076 * width, 0.53 * height + b * 20);
            }
            ctx.stroke();
            //绘制邀请码
            ctx.drawImage(appletQrCodeUrl, 0.3 * width, 0.57 * height, 0.3 * width, 0.3 * width);
            //绘制提示语
            ctx.setFontSize(12);
            ctx.setFillStyle('#999');
            ctx.fillText('长按保存图片或识别二维码查看', 0.20 * width, 0.57 * height + 0.3 * width + 20);
            ctx.stroke();
            ctx.draw()
            setTimeout(function() {
              wx.canvasToTempFilePath({
                canvasId: 'mycanvas',
                success: function(res) {
                  console.log('res', res)
                  that.data.haibaoImg = res.tempFilePath
                }
              })
            }, 1000)
            that.setData({
              showModalStatus1: false,
              haibao: true
            })
            wx.hideLoading()
          }
        })
      }
    })
  },
  // 长按保存到相册
  handleLongPress: function() {
    var that = this
    console.log('长按')
    wx.saveImageToPhotosAlbum({
      filePath: that.data.haibaoImg,
      success(res) {
        wx.showToast({
          title: '图片已保存到相册',
          icon: 'none'
        });
      },
      fail(res) {
        console.log(res)
      }
    })
  },
  //关闭海报分享页面
  close_hb: function() {
    var that = this
    that.setData({
      haibao: false
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
  onShareAppMessage: function(res) {
    var that = this
    if (res.from == "button") {
      if (res.target.id === 'btn') {
        // 来自页面内转发按钮
        console.log(res.target.id)
        that.setData({
          showModalStatus1: false
        })
        app.Util.ajax('mall/weChat/sharing/onSuccess', {
          mode: 1
        }, 'POST').then((res) => {
          if (res.data.content) {
            wx.showToast({
              title: '分享成功',
              icon: 'none'
            })
          } else {
            wx.showToast({
              title: res.data.message,
              icon: 'none'
            })
          }
        })
        return {
          title: that.data.shareList.desc,
          path: that.data.shareList.link,
          imageUrl: that.data.shareList.imageUrl,
          success: function (res) {

          },
          fail: function (res) {
            // 转发失败
            console.log("转发失败:" + JSON.stringify(res));
          }
        }
      }
    } else {
      app.Util.ajax('mall/weChat/sharing/onSuccess', {
        mode: 1
      }, 'POST').then((res) => {
        if (res.data.content) {
          wx.showToast({
            title: '分享成功',
            icon: 'none'
          })
        } else {
          wx.showToast({
            title: res.data.message,
            icon: 'none'
          })
        }
      })
      return {
        title: that.data.shareList.desc,
        path: that.data.shareList.link,
        imageUrl: that.data.shareList.imageUrl,
        success: function (res) {

        },
        fail: function (res) {
          // 转发失败
          console.log("转发失败:" + JSON.stringify(res));
        }
      }
    }
  }
})