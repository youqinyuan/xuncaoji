// pages/zeroPurchaseActivity/zeroPurchaseActivity.js
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    indicatorDots: true,
    autoplay: false,
    interval: 5000,
    duration: 1000,
    hours: [], //小时
    minutes: [], //分钟
    seconds: [], //秒
    haoSeconds: [], //毫秒
    goodsItems: [], //商品
    grabbedNumber: 0, //已抢到人数
    show: true, //左滑右滑弹窗
    shareList: {}, //分享数据
    imageUrl: '../../assets/images/icon/shareActive.png',
    showModalStatus1: false, //分享弹框
    shareList: [], //分享数据
    haibao: false, // 是否显示海报
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    that.init();
    that.chooseShare();
    var status = wx.getStorageSync('status')
    if (status) {
      that.setData({
        show: false
      })
    } else {
      that.setData({
        show: true
      })
    }
    //别人通过链接
    if (options.inviterCode) {
      wx.setStorageSync('othersInviterCode', options.inviterCode)
    }
  },
  chooseShare: function() {
    var that = this
    app.Util.ajax('mall/weChat/sharing/target', {
      mode: 3
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
  },
  init: function() {
    var that = this
    app.Util.ajax(`mall/home/activity/freeShopping?mode=${2}`, null, 'GET').then((res) => {
      if (res.data.content) {
        let current = res.data.content.remainingTime
        that.formatDuring(current)
        let interval2 = setInterval(() => {
          if (current > 0) {
            current -= 1000
            that.formatDuring(current)
          } else {
            clearInterval(interval2)
            this.setData({
              hours: [], //小时
              minutes: [], //分钟
              seconds: [], //秒
              haoSeconds: [], //毫秒
            })
          }
        }, 1000)
        that.setData({
          goodsItems: res.data.content.goodsItems,
          grabbedNumber: res.data.content.grabbedNumber
        })
      }
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
  //跳转到详情页
  jumpDetail: function(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/zeroPurchase/zeroPurchase?id=${id}`,
    })
  },
  //左滑右滑蒙版消失
  hide: function() {
    var that = this
    that.setData({
      show: false
    })
    wx.setStorageSync('status', 1)
  },
  // 点击橘色的分享按钮
  shares: function() {
    this.setData({
      showModalStatus1: true
    })
  },
  // 取消分享
  cancelShare: function() {
    this.setData({
      showModalStatus1: false
    })
  },
  //分享朋友圈
  shareFriend: function () {
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
            var path_bg2 = '/assets/images/icon/canvas_title.png';
            var path_logo = '/assets/images/icon/xuncaoji_icon.png'
            var path_partner = '/assets/images/icon/partner.png'
            var title = '"Free Buy"，自由买，免费拿'
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
              ctx.fillText(`我的邀请码：${inviterCode}`, 0.442 * width, 120);
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
            ctx.drawImage('/assets/images/icon/bg_zero.png', 0.1308 * width + 7, 137, 0.617 * width - 14, 0.3 * height - 14);
            ctx.closePath()
            // 绘制拉新人数
            ctx.beginPath()
            var number = `拉新人数：${participants}`
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
            ctx.stroke();
            ctx.closePath()
            // 绘制价格
            ctx.beginPath()
            price = `¥${price}`
            ctx.setFontSize(16);
            ctx.setFillStyle('#F85A53');
            ctx.setTextAlign("left")
            ctx.fillText(price, 0.1308 * width, 0.525 * height - 4);
            ctx.stroke();
            ctx.closePath()
            ctx.beginPath()
            // 绘制参与返
            ctx.setFillStyle('#F85A53');
            ctx.setStrokeStyle('#F85A53')
            var textWidth = ctx.measureText(`参与返¥ ${cashBack}`).width
            var textWidth2 = ctx.measureText(price).width
            ctx.moveTo(0.1 * width + textWidth2 + 24 - 6, 0.525 * height - 8)
            ctx.lineTo(0.1 * width + textWidth2 + 24, 0.525 * height - 12)
            ctx.lineTo(0.1 * width + textWidth2 + 24, 0.525 * height - 20)
            ctx.lineTo(0.1 * width + textWidth2 + 24 + textWidth / 2 + 32, 0.525 * height - 20)
            ctx.lineTo(0.1 * width + textWidth2 + 24 + textWidth / 2 + 32, 0.525 * height + 4)
            ctx.lineTo(0.1 * width + textWidth2 + 24, 0.525 * height + 4)
            ctx.lineTo(0.1 * width + textWidth2 + 24, 0.525 * height - 2)
            ctx.lineTo(0.1 * width + textWidth2 + 24 - 6, 0.525 * height - 8)
            ctx.closePath()
            ctx.fill()
            // 绘制参与返价格
            cashBack = `参与返¥ ${cashBack}`
            ctx.beginPath()
            ctx.setFontSize(12);
            ctx.setFillStyle('#fff');
            ctx.setTextAlign("left")
            ctx.fillText(cashBack, 0.1 * width + textWidth2 + 28, 0.525 * height - 4);
            ctx.stroke();
            ctx.closePath()
            // 绘制广告语
            ctx.beginPath()
            var adTips = '「新人福利」全场商品免费领~所有商品均支持0元购~自由买免费拿~'
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
            ctx.drawImage(appletQrCodeUrl, 0.3 * width, 0.6075 * height - 2, 0.3 * width, 0.3 * width);
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
            setTimeout(function () {
              wx.canvasToTempFilePath({
                canvasId: 'mycanvas',
                success: function (res) {
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
  handleLongPress: function () {
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
  // 返回首页
  backHome: function() {
    wx.switchTab({
      url: '/pages/index/index'
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
  onShareAppMessage: function(ops) {
    var that = this
    if (ops.from === 'button') {
      // 来自页面内转发按钮
      that.setData({
        showModalStatus1: false
      })
      return {
        title: '「新人福利」全场商品免费领~所有商品均支持0元购~自由买免费拿~',
        path: "/pages/zeroBuy/zeroBuy?inviterCode=" + wx.getStorageSync('inviterCode'),
        imageUrl: '/assets/images/icon/zero_share.png',
      }
    } else {
      return {
        title: '「新人福利」全场商品免费领~所有商品均支持0元购~自由买免费拿~',
        path: "/pages/zeroBuy/zeroBuy?inviterCode=" + wx.getStorageSync('inviterCode'),
        imageUrl: '/assets/images/icon/zero_share.png',
      }
    }
  }
})