// pages/myteam/myteam.js
var time = require('../../utils/util.js');
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show: false,
    pageNumber: 1,
    pageSize: 20,
    content: {},
    followers: [],//团队成员
    shareList: {},
    inviterCode: '',
    text: '',
    haibao: false,
    haibaoImg: '',
    top: '',
    hostUrl: app.Util.getUrlImg().hostUrl
  },
  //显示弹框
  recurit: function() {
    var that = this;
    var top = (wx.getSystemInfoSync().windowHeight) * 0.02
    var height = (wx.getSystemInfoSync().windowHeight) * 0.92
    that.setData({
      show: true,
      top: top,
      height: height
    })
  },
  cancel: function() {
    var that = this;
    that.setData({
      show: false
    })
  },
  /**
   * 弹出框蒙层截断touchmove事件
   */
  preventTouchMove: function() {

  },
  //查询分享数据
  chooseShare: function() {
    var that = this
    app.Util.ajax('mall/weChat/sharing/target', {
      mode: 4
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    that.chooseShare();
    that.init();
  },
  init: function () {
    var that = this
    app.Util.ajax('mall/personal/followers', {
      pageNumber: that.data.pageNumber,
      pageSize: that.data.pageSize
    }, 'GET').then((res) => {
      if (res.data.messageCode = 'MSG_1001') {
        var inviterCode = wx.getStorageSync('inviterCode')
        for (var i = 0; i < res.data.content.followers.items.length; i++) {
          res.data.content.followers.items[i].regTime = time.formatTimeTwo(res.data.content.followers.items[i].regTime, 'Y-M-D h:m:s');
        }
        that.setData({
          content: res.data.content,
          followers: res.data.content.followers.items,
          inviterCode: inviterCode
        })
      }
    })
  },
  getMore: function () {
    var that = this
    var pageNumber = that.data.pageNumber + 1
    app.Util.ajax('mall/personal/followers', {
      pageNumber: pageNumber,
      pageSize: that.data.pageSize
    }, 'GET').then((res) => {
      if (res.data.messageCode = 'MSG_1001') {
        var inviterCode = wx.getStorageSync('inviterCode')
        var followers = res.data.content.followers.items
        if (followers == '' && that.data.followers !== '') {
          that.setData({
            text: '已经到底啦'
          })
        }
        var arr = that.data.followers
        for (var i = 0; i < res.data.content.followers.items.length; i++) {
          res.data.content.followers.items[i].regTime = time.formatTimeTwo(res.data.content.followers.items[i].regTime, 'Y-M-D h:m:s');
          arr.push(res.data.content.followers.items[i])
        }
        that.setData({
          followers: arr,
          inviterCode: inviterCode,
          pageNumber: pageNumber
        })
      }
    })
  },
  // 分享朋友圈 生成海报
  shareFriend: function() {
    var that = this
    app.Util.ajax('mall/weChat/sharing/snapshot/target', {
      mode: 4,
    }, 'GET').then((res) => {
      console.log(res)
      if (res.data.messageCode = 'MSG_1001') {
        wx.showLoading()
        var cashBack = res.data.content.cashBack
        var desc = res.data.content.desc
        var inviterCode = res.data.content.inviterCode
        var appletQrCodeUrl = res.data.content.appletQrCodeUrl
        //邀请码转换为本地路径
        wx.getImageInfo({
          src: appletQrCodeUrl,
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
            console.log(ctx)
            //绘制图片模板的背景图片
            ctx.drawImage('/assets/images/icon/bg.png', 0, 0, 0.88 * width, 0.89 * height);
            //绘制顶部红色背景
            ctx.drawImage('/assets/images/icon/canvas_title.png', 0, 0, 0.88 * width, 0.2 * height);
            //绘制标题
            ctx.setFontSize(13);
            ctx.setFillStyle('#fff');
            ctx.setTextAlign("center")
            ctx.fillText('"Free Buy"，自由买，免费拿', 0.5 * width * 0.88, 26);
            ctx.stroke();
            //绘制矩形
            ctx.setFillStyle('#fff')
            ctx.setShadow(0, 0, 2, '#eee')
            ctx.fillRect(0.075 * width * 0.88, 0.095 * height * 0.89, 0.75 * width, 0.485 * height)
            //绘制logo
            ctx.drawImage('/assets/images/icon/partner.png', 0.35 * width, 44, 64, 51);
            //绘制邀请码
            if (inviterCode != 'undefined') {
              ctx.setFontSize(19);
              ctx.setFillStyle('#F85A53');
              ctx.setTextAlign("center")
              ctx.setFontSize(20);
              ctx.setFillStyle('#FF2644');
              ctx.fillText(`我的邀请码：${inviterCode}`, 0.5 * width * 0.88, 0.06 * height + 0.133 * width + 20);
              ctx.stroke();
            }
            //绘制矩形
            ctx.setFillStyle('#fff')
            ctx.setShadow(0, 0, 2, '#eee')
            ctx.fillRect(0.172 * width * 0.85, 0.205 * height * 0.89, 0.58 * width, 0.27 * height)
            //绘制产品图片
            ctx.drawImage('/assets/images/icon/xuncaoji_cheats.png', 0.183 * width * 0.85, 0.21 * height * 0.89, 0.56 * width, 0.26 * height);
            // ctx.setFontSize(13);
            // ctx.setFillStyle('#F85A53');
            // ctx.fillText('平台累计返现金额', 0.3 * width * 0.88, 0.49 * height);
            // ctx.stroke();
            // ctx.setFontSize(13);
            // ctx.setFillStyle('#F85A53');
            // ctx.fillText('￥', 0.52 * width * 0.88, 0.49 * height);
            // ctx.stroke();
            // ctx.setFontSize(19);
            // ctx.setFillStyle('#F85A53');
            // ctx.fillText(`${cashBack}`, 0.658 * width * 0.88, 0.49 * height);
            // ctx.stroke();
            // 绘制描述
            ctx.setFontSize(13);
            ctx.setFillStyle('#333');
            var test = '寻草记商城所有商品均支持0元购买，自由买免费拿随时购随时取。'
            let chr = test.split('') // 分割为字符串数组
            let temp = ''
            let row = []
            for (let a = 0; a < chr.length; a++) {
              if (ctx.measureText(temp).width < 0.638 * width) {
                temp += chr[a]
              } else {
                a--
                row.push(temp)
                temp = ''
              }
            }
            row.push(temp)
            for (var b = 0; b < row.length; b++) {
              ctx.setTextAlign("left")
              ctx.fillText(row[b], 0.13 * width * 0.88, 0.52 * height + b * 20);
            }
            ctx.stroke();
            //绘制邀请码
            ctx.setShadow(0, 0, 0, '#fff')
            ctx.drawImage(appletQrCodeUrl, 0.3 * width, 0.58 * height, 0.3 * width, 0.3 * width);
            //绘制提示语
            ctx.setFontSize(12);
            ctx.setFillStyle('#999');
            ctx.setTextAlign("center")
            ctx.fillText('长按保存图片或识别二维码查看', 0.5 * width * 0.88, 0.58 * height + 0.3 * width + 20);
            ctx.stroke();
            ctx.draw();
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
              show: false,
              haibao: true
            })
            wx.hideLoading()
          }
        })
      } else if (res.data.messageCode == 'MSG_4001') {
        wx.showToast({
          title: res.data.message,
          icon: 'none',
          duration: 2000
        })
      }
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
    var that = this;
    that.setData({
      pageNumber: 1
    })
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
    var that = this;
    that.getMore(); 
  },

  /**
   * 用户点击右上角分享
   */
 onShareAppMessage: function(ops) {
    var that = this
    if (ops.from === 'button') {
      // 来自页面内转发按钮
      if (ops.target.id === 'btn') {
        that.setData({
          show: false
        })
        //显示tabbar
        wx.showTabBar()
        app.Util.ajax('mall/weChat/sharing/onSuccess', {
          mode: 4
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
          title: '我是合伙人，全品0元购，帮朋友省钱，也能赚钱！来加入吧',
          path: that.data.shareList.link,
          imageUrl: '../../assets/images/icon/xuncaoji_cheats.png',
          success: function (res) {

          },
          fail: function (res) {
            // 转发失败
            console.log("转发失败:" + JSON.stringify(res));
          }
        }
      } else if (ops.target.id === 'btnGroup') {
        that.setData({
          show: false
        })
        //显示tabbar
        wx.showTabBar()
        app.Util.ajax('mall/weChat/sharing/onSuccess', {
          mode: 4
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
          title: '亲们，全品0元购，省钱有赚钱，想成为合伙人的群友，加入吧',
          path: that.data.shareList.link,
          imageUrl: '../../assets/images/icon/xuncaoji_cheats.png',
          success: function (res) {

          },
          fail: function (res) {
            // 转发失败
            console.log("转发失败:" + JSON.stringify(res));
          }
        }
      }
      
    } else {
      return {
        title: '我是合伙人，全品0元购，帮朋友省钱，也能赚钱！来加入吧',
        path: that.data.shareList.link,
        imageUrl: '../../assets/images/icon/xuncaoji_cheats.png',
      }
    }
  }
})