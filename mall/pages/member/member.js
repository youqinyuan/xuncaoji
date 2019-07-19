// pages/mine/member/member.js
var time = require('../../utils/util.js');
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show: false,
    taskItems:[],
    expireTime:'',
    inviterCode: '',
    shareList:{},
    imageUrl: '../../assets/images/icon/team_share.png',
    haibao: false,
    haibaoImg: '',
  },
  //显示弹框
  recurit: function () {
    var that = this;
    that.setData({
      show: true
    })
  },
  cancel: function () {
    var that = this;
    that.setData({
      show: false
    })
  },
  //跳转至充值界面
  jumpRecharge:function(){
    wx.navigateTo({
      url: '/pages/mine/recharge/recharge',
    })
  },
  //跳转至首页
  jumpIndex:function(){
    wx.switchTab({
     url:'/pages/index/index'
   })
  },
  /**
  * 弹出框蒙层截断touchmove事件
  */
  preventTouchMove: function () {
  },
  //查询分享数据
  chooseShare: function () {
    var that = this
    app.Util.ajax('mall/weChat/sharing/target', { mode: 4 }, 'GET').then((res) => {
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    var token = wx.getStorageSync('token')
    if (!token) {
      wx.navigateTo({
        url: '/pages/invitationCode/invitationCode',
      })
    }else{
      app.Util.ajax('mall/personal/myMember', 'GET').then((res) => { // 使用ajax函数
        if (res.data.content) {
          var inviterCode = wx.getStorageSync('inviterCode')
          if (res.data.content.expireTime) {
            res.data.content.expireTime = time.formatTimeTwo(res.data.content.expireTime, 'Y年M月D日');
          }
          that.setData({
            taskItems: res.data.content.taskItems,
            expireTime: res.data.content.expireTime,
            inviterCode: inviterCode
          })
        }
      })
    }
    that.chooseShare()
  },
  // 分享朋友圈 生成海报
  shareFriend: function () {
    var that = this
    app.Util.ajax('mall/weChat/sharing/snapshot/target', {
      mode: 4,
    }, 'GET').then((res) => {
      console.log(res)
      if (res.messageCode = 'MSG_1001') {
        var cashBack = res.data.content.cashBack
        var desc = res.data.content.desc
        var inviterCode = res.data.content.inviterCode
        //邀请码转换为本地路径
        wx.getImageInfo({
          src: res.data.content.appletQrCodeUrl,
          success(res) {
            var appletQrCodeUrl = res.path
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
            var path_logo = '/assets/images/icon/xuncaoji_icon.png'
            var title = '种草达人的欢乐场'
            inviterCode = `邀请码: ${inviterCode}`
            //绘制图片模板的背景图片
            ctx.drawImage(path_bg, 0, 0, 0.88 * width, 0.89 * height);
            //绘制logo
            ctx.drawImage(path_logo, 0.384 * width, 0.055 * height, 0.133 * width, 0.133 * width);
            // 绘制标题
            ctx.setFontSize(13);
            ctx.setFillStyle('#fff');
            ctx.setTextAlign("center")
            ctx.fillText(title, 0.5 * width * 0.88, 26);
            ctx.stroke();
            // 绘制邀请码
            ctx.setFontSize(20);
            ctx.setFillStyle('#FF517A');
            ctx.fillText(inviterCode, 0.5 * width * 0.88, 0.055 * height + 0.133 * width + 20);
            ctx.stroke();
            // 绘制产品图
            ctx.drawImage('/assets/images/icon/bg_pic.png', 0.068 * width, 0.17 * height, 0.74 * width, 0.327 * height);
            ctx.drawImage('/assets/images/icon/bg_yellow.png', 0.068 * width, 0.418 * height, 0.74 * width, 0.08 * height);
            ctx.setFontSize(17);
            ctx.setFillStyle('#E33A59');
            ctx.fillText(`平台累计返现金额¥ ${cashBack}`, 0.5 * width * 0.88, 0.48 * height);
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
              ctx.fillText(row[b], 0.5 * width * 0.88, 0.53 * height + b * 20);
            }
            ctx.stroke();
            //绘制邀请码
            ctx.drawImage(appletQrCodeUrl, 0.3 * width, 0.57 * height, 0.3 * width, 0.3 * width);
            //绘制提示语
            ctx.setFontSize(12);
            ctx.setFillStyle('#999');
            ctx.fillText('长按保存图片或识别二维码查看', 0.5 * width * 0.88, 0.57 * height + 0.3 * width + 20);
            ctx.stroke();
            ctx.draw(true, () => {
              wx.canvasToTempFilePath({
                canvasId: 'mycanvas',
                success: res => {
                  that.data.haibaoImg = res.tempFilePath
                }
              })
            })
            that.setData({
              show: false,
              haibao: true
            })
            wx.hideTabBar()
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
  close_hb: function () {
    var that = this
    that.setData({
      haibao: false
    })
    wx.showTabBar()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this
    that.onLoad();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    var that = this
    that.onLoad()
    wx.stopPullDownRefresh() //停止下拉刷新
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (ops) {
    var that = this
    if (ops.from === 'button') {
      // 来自页面内转发按钮
      that.setData({
        show: false
      })
      app.Util.ajax('mall/weChat/sharing/onSuccess', { mode: 4 }, 'POST').then((res) => {
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
    }
    return {
      title: that.data.shareList.desc,
      path: that.data.shareList.link,
      imageUrl: that.data.imageUrl,
      success: function (res) {

      },
      fail: function (res) {
        // 转发失败
        console.log("转发失败:" + JSON.stringify(res));
      }
    }
  }
})