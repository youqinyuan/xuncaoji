// pages/freeBuy/freeBuy.js
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageNumber: 1,
    pageSize: 20,
    goodsList: {},
    toIndex: false,
    showModalStatus1: false,
    haibao: false,
    hostUrl: app.Util.getUrlImg().hostUrl,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.init()
    this.chooseShare()
  },
  init: function () {
    var that = this
    //视屏加载
    app.Util.ajax('mall/home/activity/freeBuy', null, 'GET').then((res) => {
      // console.log("视屏：" + JSON.stringify(res.data))
      if (res.data.messageCode = 'MSG_1001') {
        var courseList1 = res.data.content.videos
        var courseList = {}
        courseList['videoUrl'] = courseList1
        courseList['coverImg'] = app.Util.getUrlImg().hostUrl+'/icon/video_play.png'
        that.setData({
          courseList: courseList
        })
      }
    })
    //加载商品
    app.Util.ajax('mall/home/activity/freeBuy/goods', {
      pageNumber: that.data.pageNumber,
      pageSize: that.data.pageSize
    }, 'GET').then((res) => {
      that.setData({
        goodsList: res.data.content
      })

    })
  },
  //跳转首页销量排行
  toIndex: function () {
    console.log("跳转首页")
    wx.setStorageSync('toindex', 1)
    wx.switchTab({
      url: '/pages/index/index'
    })
  },
  //跳转商品详情页
  toGoodsDetail: function (e) {
    // console.log(e.currentTarget.dataset.goodsid)
    var goodsId = e.currentTarget.dataset.goodsid
    wx.navigateTo({
      url: "/pages/detail/detail?id=" + goodsId,
    })
  },
  //跳转商品详情页面
  toFreeBuy: function () {
    wx.navigateTo({
      url: "/packageB/pages/zeroBuy/zeroBuy?type=4",
    })
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
    if(wx.getStorageSync("freeBuyStatus")){
      wx.switchTab({
        url: '/pages/index/index',
      })
    }
    wx.removeStorageSync("freeBuyStatus");
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this
    that.getMore();
  },
  getMore: function () {
    var that = this
    var pageNumber = that.data.pageNumber + 1
    app.Util.ajax('mall/home/activity/freeBuy/goods', { pageNumber: pageNumber, pageSize: that.data.pageSize }, 'GET').then((res) => { // 使用ajax函数
      if (res.data.content) {
        if (res.data.content == '' && that.data.goodsList !== '') {
          wx.showToast({
            title:'已经到底啦',
            icon:'none'
          })
        }
        var arr = that.data.goodsList
        for (var i = 0; i < res.data.content.length; i++) {
          arr.push(res.data.content[i])
        }
        that.setData({
          goodsList: arr,
          pageNumber: pageNumber
        })
      }
    })
  },

  videoPlay: function (e) {
    var curIdx = e.currentTarget.dataset.index;
    console.log(curIdx)
    // 没有播放时播放视频
    if (!this.data.playIndex) {
      this.setData({
        playIndex: curIdx
      })
      var videoContext = wx.createVideoContext('video' + curIdx) //这里对应的视频id
      videoContext.play()
    } else { // 有播放时先将prev暂停，再播放当前点击的current
      var videoContextPrev = wx.createVideoContext('video' + this.data.playIndex)
      if (this.data.playIndex != curIdx) {
        videoContextPrev.pause()
      }
      this.setData({
        playIndex: curIdx
      })
      var videoContextCurrent = wx.createVideoContext('video' + curIdx)
      videoContextCurrent.play()
    }
  },
  onPageScroll(e) {
    // console.log(e.scrollTop)
    if (e.scrollTop > 750) {
      this.setData({
        toIndex: true
      })
    } else {
      this.setData({
        toIndex: false
      })
    }
  },
  // 点击橘色的分享按钮
  shares: function () {
    var that = this
    var token = wx.getStorageSync('token')
    if (token) {
      that.setData({
        showModalStatus1: true
      })
    } else {
      wx.navigateTo({
        url: '/pages/invitationCode/invitationCode',
      })
    }
  },
  // 取消分享
  cancelShare: function () {
    var that = this
    that.setData({
      showModalStatus1: false
    })
  },
  chooseShare: function () {
    var that = this
    app.Util.ajax('mall/weChat/sharing/target', {
      mode: 10
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
  shareFriend: function () {
    var that = this
    wx.showLoading({
      title: '加载中',
    })
    app.Util.ajax('mall/weChat/sharing/target', {
      mode: 10,
    }, 'GET').then((res) => {
      if (res.data.messageCode == 'MSG_1001') {
        // console.log(JSON.stringify(res.data))
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
            console.log(appletQrCodeUrl)

            var ctx = wx.createCanvasContext('mycanvas');
            var path_bg = '/assets/images/icon/bg.png'; //背景图片
            var path_bg2 = '/assets/images/icon/canvas_title.png';
            var path_logo = '/assets/images/icon/xuncaoji_icon.png'
            var path_partner = '/assets/images/icon/partner.png'
            var title = that.data.shareList.title
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
            ctx.drawImage(path_partner, 0.35 * width, 32, 64, 51);
            ctx.closePath()
            // 绘制邀请码
            if (inviterCode) {
              ctx.beginPath()
              ctx.setFontSize(19);
              ctx.setFillStyle('#F85A53');
              ctx.fillText(`我的邀请码：${inviterCode}`, 0.442 * width, 110);
              ctx.stroke();
              ctx.closePath()
            }
            // 绘制最小矩形
            ctx.beginPath()
            ctx.setFillStyle('#fff')
            ctx.setShadow(0, 0, 2, '#eee')
            ctx.fillRect(0.1308 * width, 120, 0.617 * width, 0.3 * height)
            ctx.closePath()
            // 绘制商品图片
            ctx.beginPath()
            ctx.drawImage('/packageA/img/freeBuy.png', 0.1308 * width + 7, 127, 0.617 * width - 14, 0.3 * height - 14);
            ctx.closePath()
            // 绘制参与人数
            // ctx.beginPath()
            // var number = `参与人数：${participants}`
            // var textWidth = inviterCode ? ctx.measureText(number).width : ctx.measureText(number).width + 50
            // ctx.setFillStyle('#F5BA2C');
            // ctx.moveTo(0.1308 * width, 174)
            // ctx.lineTo(0.1308 * width, 180)
            // ctx.lineTo(0.1308 * width - 10, 174)
            // ctx.lineTo(0.1308 * width - 10, 150)
            // ctx.lineTo(0.1308 * width + textWidth / 2 + 22, 150)
            // ctx.lineTo(0.1308 * width + textWidth / 2 + 22, 174)
            // ctx.lineTo(0.1308 * width - 10, 174)
            // ctx.arc(0.1308 * width + textWidth / 2 + 22, 162, 12, 1.5 * Math.PI, 0.5 * Math.PI, false)
            // ctx.closePath()
            // ctx.fill()
            // ctx.beginPath()
            // ctx.setFontSize(12);
            // ctx.setFillStyle('#fff');
            // ctx.setTextAlign("left")
            // ctx.fillText(number, 0.1308 * width, 167);
            // ctx.stroke();
            // ctx.closePath()
            // 绘制价格
            ctx.beginPath()
            price = `一折领取后，还有好礼送哦`
            ctx.setFontSize(16);
            ctx.setFillStyle('#F85A53');
            ctx.setTextAlign("left")
            ctx.fillText(price, 0.1308 * width, 0.525 * height - 9);
            ctx.stroke();
            ctx.closePath()
            ctx.beginPath()
            // 绘制参与返
            // ctx.setFillStyle('#F85A53');
            // ctx.setStrokeStyle('#F85A53')
            // var textWidth = ctx.measureText(`参与返¥ ${cashBack}`).width
            // var textWidth2 = ctx.measureText(price).width
            // ctx.moveTo(0.1 * width + textWidth2 + 24 - 6, 0.525 * height - 8)
            // ctx.lineTo(0.1 * width + textWidth2 + 24, 0.525 * height - 12)
            // ctx.lineTo(0.1 * width + textWidth2 + 24, 0.525 * height - 20)
            // ctx.lineTo(0.1 * width + textWidth2 + 24 + textWidth / 2 + 32, 0.525 * height - 20)
            // ctx.lineTo(0.1 * width + textWidth2 + 24 + textWidth / 2 + 32, 0.525 * height + 4)
            // ctx.lineTo(0.1 * width + textWidth2 + 24, 0.525 * height + 4)
            // ctx.lineTo(0.1 * width + textWidth2 + 24, 0.525 * height - 2)
            // ctx.lineTo(0.1 * width + textWidth2 + 24 - 6, 0.525 * height - 8)
            // ctx.closePath()
            // ctx.fill()
            // 绘制参与返价格
            // cashBack = `参与返¥ ${cashBack}`
            // ctx.beginPath()
            // ctx.setFontSize(12);
            // ctx.setFillStyle('#fff');
            // ctx.setTextAlign("left")
            // ctx.fillText(cashBack, 0.1 * width + textWidth2 + 28, 0.525 * height - 4);
            // ctx.stroke();
            // ctx.closePath()
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
              ctx.fillText(row[b], 0.1308 * width - 6, 0.565 * height - 9 + b * 20);
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
      } else if (res.data.messageCode == 'MSG_4001') {
        wx.showToast({
          title: res.data.message,
          icon: 'none',
          duration: 2000
        })
      }
    })
  },
  //关闭海报分享页面
  close_hb: function () {
    var that = this
    that.setData({
      haibao: false
    })
  },
  // 长按保存到相册
  handleLongPress: function () {
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

                            that.setData({
                              downAppStatus: false
                            });

                            wx.hideLoading()
                            wx.showToast({
                              title: '保存成功'
                            });
                          },
                          fail(res) {
                            wx.hideLoading()
                            console.log(res);

                            that.setData({
                              downAppStatus: false
                            });
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
  onShareAppMessage: function (ops) {
    var that = this
    if (ops.from === 'button') {
      if (ops.target.id === 'btn') {
        that.setData({
          showModalStatus1: false
        })

        app.Util.ajax('mall/weChat/sharing/onSuccess', {
          mode: 10
        }, 'POST').then((res) => {
          if (res.data.content) {
            wx.showToast({
              title: '分享成功',
              icon: 'none'
            })
          } else {

          }
        })
        return {
          title: that.data.shareList.desc,
          path: "/packageB/pages/freeBuy/freeBuy?inviterCode=" + wx.getStorageSync('inviterCode'),
          imageUrl: '/packageA/img/freeBuy.png',
        }
      } else if (ops.target.id === 'btnGroup') {
        that.setData({
          showModalStatus1: false
        })

        app.Util.ajax('mall/weChat/sharing/onSuccess', {
          mode: 10
        }, 'POST').then((res) => {
          if (res.data.content) {
            wx.showToast({
              title: '分享成功',
              icon: 'none'
            })
          } else {

          }
        })
        return {
          title: that.data.shareList.groupDesc,
          path: "/packageB/pages/freeBuy/freeBuy?inviterCode=" + wx.getStorageSync('inviterCode'),
          imageUrl: '/packageA/img/freeBuy.png',
        }
      }
    }else{
      app.Util.ajax('mall/weChat/sharing/onSuccess', {
        mode: 10
      }, 'POST').then((res) => {
        if (res.data.content) {
          wx.showToast({
            title: '分享成功',
            icon: 'none'
          })
        } else {

        }
      })
      return {
        title: that.data.shareList.desc,
        path: "/packageB/pages/freeBuy/freeBuy?inviterCode=" + wx.getStorageSync('inviterCode'),
        imageUrl: '/packageA/img/freeBuy.png',
      }
    }
  }
})