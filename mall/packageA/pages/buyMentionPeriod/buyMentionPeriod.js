// packageA/pages/buyMentionPeriod/buyMentionPeriod.js
let app = getApp()
var time = require('../../../utils/util.js');
var interval2 = null
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tempArr: [],
    pageNumber: 1,
    pageSize: 20,
    shrueDelete: false, //弹窗
    showModal: false,
    timeList: [],
    shareImg: '',
    shareList: {},
    showModalStatus1: false,
    hostUrl: app.Util.getUrlImg().hostUrl,
    seedToast: false,
    haibao:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  init: function () {
    let that = this
    let timeList = []
    let tempArr = []
    app.Util.ajax('mall/forum/MentionPeriod/findPageMentionPeriodTopicList', {
      // pageNumber:that.data.pageNumber,
      // pageSize:that.data.pageSize
    }, 'GET').then((res) => {
      if (res.data.messageCode == 'MSG_1001') {
        for (let i in res.data.content.items) {
          timeList[i] = res.data.content.items[i].effective
          res.data.content.items[i].goodsName = res.data.content.items[i].goodsName.substring(0, 5)
          res.data.content.items[i].updateTime = time.formatTimeTwo(res.data.content.items[i].updateTime, 'Y-M-D h:m:s')
        }
        for (let i = 0; i < res.data.content.items.length; i++) {
          tempArr.push(false)
        }
        console.log(res.data.content)
        that.setData({
          content: res.data.content.items,
          timeList: timeList,
          tempArr: tempArr
        })
        console.log(timeList)
        //倒计时初始化
        that.countDownInit()
      } else {
        wx.showToast({
          title: res.data.message,
          icon: 'none'
        })
      }
    })
  },
  // 倒计时初始化
  countDownInit: function () {
    var that = this
    var temp = that.data.timeList
    that.formatDuring(temp)
    interval2 = setInterval(() => {
      for (var i = 0; i < temp.length; i++) {
        if (temp[i] > 0) {
          temp[i] -= 1000
        } else {
          // clearInterval(interval2)
        }
      }
      that.formatDuring(temp)
    }, 1000)
  },
  formatDuring(temp) {
    var that = this
    var hours = 0
    var minutes = 0
    var seconds = 0
    let day = 0
    var temparr = []
    for (var i = 0; i < temp.length; i++) {
      var tempList = {}
      day = parseInt((temp[i] / 3600000) / 24) > 0 ? parseInt((temp[i] / 3600000) / 24) : 0
      hours = parseInt((temp[i] / 3600000) % 24).toString() >= 10 ? parseInt((temp[i] / 3600000) % 24).toString() : '0' + parseInt((temp[i] / 3600000) % 24).toString()
      minutes = parseInt((temp[i] % (1000 * 60 * 60)) / (1000 * 60)).toString() >= 10 ? parseInt((temp[i] % (1000 * 60 * 60)) / (1000 * 60)).toString() : '0' + parseInt((temp[i] % (1000 * 60 * 60)) / (1000 * 60)).toString()
      seconds = parseInt((temp[i] % (1000 * 60)) / 1000).toString() >= 10 ? parseInt((temp[i] % (1000 * 60)) / 1000).toString() : '0' + parseInt((temp[i] % (1000 * 60)) / 1000).toString()
      if (temp[i] == 0) {
        tempList.status = 0
      } else {
        tempList.status = 1
      }
      tempList.hours = hours
      tempList.day = day
      tempList.minutes = minutes
      tempList.seconds = seconds
      temparr.push(tempList)
    }
    that.setData({
      timeList: temparr
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
    let that = this
    that.setData({
      pageNumber: 1
    })
    clearInterval(interval2)
    that.init()
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
    clearInterval(interval2)
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    clearInterval(interval2)
    this.init()
    wx.stopPullDownRefresh() //停止下拉刷新
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    wx.showToast({
      title: '已经到底了哦~',
      icon: 'none'
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    var that = this
    if (res.from == "button") {
      if (res.target.id === 'btn') {
        // 来自页面内转发按钮
        that.setData({
          showModalStatus1: false
        })
        wx.showTabBar()
        app.Util.ajax('mall/weChat/sharing/onSuccess', {
          mode: 16
        }, 'POST').then((res) => {
          if (res.data.content) {
            wx.showToast({
              title: '分享成功',
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
      } else if (res.target.id === 'btnGroup') {
        that.setData({
          showModalStatus1: false
        })
        wx.showTabBar()
        app.Util.ajax('mall/weChat/sharing/onSuccess', {
          mode: 16
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
          path: that.data.shareList.link,
          imageUrl: that.data.shareList.imageUrl,
        }
      }
    }
  },
  closeModal: function () {
    this.setData({
      showModal: false
    })
  },
  showModal: function (e) {
    let that = this
    let temp = e.currentTarget.dataset.temp
    if (that.data.content[temp].mentionPeriodList.length > 0) {
      this.setData({
        detail: that.data.content[temp].mentionPeriodList,
        showModal: true
      })
    } else {
      wx.showToast({
        title: '暂无明细',
        icon: 'none'
      })
    }
  },
  showShare: function (e) {
    var that = this
    var index = e.currentTarget.dataset.index
    var temp = that.data.tempArr[index]
    if (temp) {
      that.data.tempArr[index] = false
    } else {
      that.data.tempArr[index] = true
    }
    this.setData({
      tempArr: that.data.tempArr
    })
  },
  cancelMentionPeriod: function () {
    let that = this
    let id = that.data.id
    app.Util.ajax('mall/forum/MentionPeriod/revokeForumMentionPeriodTopic', {
      id: id
    }, 'POST').then((res) => {
      if (res.data.messageCode == 'MSG_1001') {
        wx.showToast({
          title: res.data.message,
          icon: 'none'
        })
        setTimeout(function () {
          clearInterval(interval2)
          that.init()
        }, 500)
      } else {
        wx.showToast({
          title: res.data.message,
          icon: 'none'
        })
      }
    })
  },
  deleteMentionPeriod: function () {
    let that = this
    let id = that.data.id
    app.Util.ajax('mall/forum/MentionPeriod/deleteForumMentionPeriodTopic', {
      id: id
    }, 'POST').then((res) => {
      if (res.data.messageCode == 'MSG_1001') {
        wx.showToast({
          title: res.data.message,
          icon: 'none'
        })
        setTimeout(function () {
          clearInterval(interval2)
          that.init()
        }, 500)
      } else {
        wx.showToast({
          title: res.data.message,
          icon: 'none'
        })
      }
    })
  },
  showPrompt: function (e) {
    let that = this
    let index = e.currentTarget.dataset.index //标识点击的按钮
    let temp = e.currentTarget.dataset.temp  //关闭分享与发帖弹窗
    let id = e.currentTarget.dataset.id
    let tempList = that.data.tempArr
    tempList[temp] = false
    if (index == 1) {
      //撤销
      that.setData({
        promptvalue: 1,
        shrueDelete: true,
        functionIndex: index,
        id: id,
        tempArr: tempList
      })
    } else if (index == 2) {
      //删除
      that.setData({
        promptvalue: 2,
        shrueDelete: true,
        functionIndex: index,
        id: id,
        tempArr: tempList
      })
    } else {
      //发布
      that.checkSeed(id)
      if(that.data.seedText.seedAmountConsume>0){
        that.setData({
          promptvalue: 3,
          seedToast: true,
          functionIndex: index,
          id: id,
          tempArr: tempList
        })
      }else{
        that.setData({
          promptvalue: 3,
          functionIndex: index,
          id: id,
          tempArr: tempList
        })
        that.fabu()
      }
    }
  },
  checkSeed: function (id) {
    let that = this
    app.Util.ajax('mall/forum/topic/checkSeed4MentionPeriodTopic', {
      id: id
    }, 'POST').then((res) => {
      if (res.data.messageCode == "MSG_1001") {
        that.setData({
          seedText: res.data.content
        })
      }
    })
  },
  fabu: function () {
    let that = this
    let id = that.data.id
    app.Util.ajax('mall/forum/topic/updateMentionPeriodTopicVisible', {
      id: id
    }, 'POST').then((res) => {
      if (res.data.messageCode == 'MSG_1001') {
        that.setData({
          seedToast: false
        })
        wx.showToast({
          title: res.data.message,
          icon: 'none'
        })
        setTimeout(function () {
          clearInterval(interval2)
          that.init()
        }, 500)
      } else {
        wx.showToast({
          title: res.data.message,
          icon: 'none'
        })
      }
    })
  },
  closeDelete: function () {
    this.setData({
      shrueDelete: false
    })
  },
  shureDelete: function () {
    let that = this
    let functionIndex = that.data.functionIndex
    that.setData({
      shrueDelete: false
    })
    if (functionIndex == 1) {
      //撤销
      that.cancelMentionPeriod()
    } else if (functionIndex == 2) {
      //删除
      that.deleteMentionPeriod()
    }
  },
  shares: function (e) {
    var that = this
    var token = wx.getStorageSync('token')
    let id = e.currentTarget.dataset.id
    console.log(id)
    if (token) {
      that.setData({
        showModalStatus1: true
      })
      that.share(id)
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
  share: function (id) {
    let that = this
    app.Util.ajax('mall/weChat/sharing/target', {
      mode: 16,
      targetId: id
    }, 'GET').then((res) => {
      if (res.data.messageCode == "MSG_1001") {
        var inviterCode = res.data.content.inviterCode
        if (inviterCode) {
          res.data.content.link = res.data.content.link.replace(/{inviterCode}/g, inviterCode)
        } else {
          res.data.content.link = res.data.content.link.replace(/{inviterCode}/g, '')
        }
        // 产品图片路径转换为本地路径
        var imageUrl = res.data.content.imageUrl
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
          shareList: res.data.content
        })
      }
    })
  },
  //隐藏底部分享对话框
  hide: function () {
    var that = this
    that.setData({
      showModalStatus1: false,
    })
  },
  toHelp: function (e) {
    //解决从待返提期完成后的页面跳转问题，清除是为了确保此时无缓存
    app.globalData.helpMentionPeriod = 2
    wx.navigateTo({
      url: `/packageA/pages/helpMentionPeriod/helpMentionPeriod?id=` + e.currentTarget.dataset.id,
    })
  },
  cancle: function () {
    this.setData({
      seedToast: false
    })
  },
  toSeed: function () {
    wx.navigateTo({
      url: "/packageA/pages/seed/seed"
    })
    this.setData({
      seedToast: false
    })
  },
  shareFriend: function () {
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
    var inviterCode = that.data.shareList.inviterCode
    console.log(title, inviterCode)
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
    console.log(that.data.appletQrCodeUrl)
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
  close_hb: function () {
    var that = this
    wx.showTabBar()
    that.setData({
      haibao: false
    })
  },
})