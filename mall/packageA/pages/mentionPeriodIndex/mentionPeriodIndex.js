// packageA/pages/mentionPeriodIndex/mentionPeriodIndex.js
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hostUrl: app.Util.getUrlImg().hostUrl,
    siftLeft:false,
    siftRight:false,
    siftRightIndex:1,
    tabName:'发布时间新旧',
    isShield:false,
    mentionPeriodPageNum:1,
    pageSize:20,
    sort:1,
    shareImg:'',
    shareList:{},
    showModalStatus1:false,
    mentionPeriodContent:[],
    haibao:false,
    path_img:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  init:function(){
    let that = this
    app.Util.ajax('mall/forum/topic/findPageList', {
      pageNumber:that.data.mentionPeriodPageNum,
      pageSize:that.data.pageSize,
      type:7,
      isShield:that.data.isShield,
      sort:that.data.sort
    }, 'GET').then((res) => {
      if (res.data.messageCode == 'MSG_1001') {
        console.log(res.data.content)
        that.setData({
          content:res.data.content.items
        })
      }else{
        wx.showToast({
          title:res.data.message,
          icon:'none'
        })
      }
    })
  },
  getMentionPeriodInit: function() {
    var that = this
    var mentionPeriodPageNum = that.data.mentionPeriodPageNum + 1
    console.log(mentionPeriodPageNum)
    app.Util.ajax('mall/forum/topic/findPageList', {
      pageNumber: mentionPeriodPageNum,
      pageSize: that.data.pageSize,
      type: 7,
      isShield: that.data.isShield,
      sort: that.data.sort
    }, 'GET').then((res) => {
      if (res.data.content) {
        if (res.data.content.items == '' && that.data.content !== '') {
          wx.showToast({
            title: '已经到底啦',
            icon: 'none'
          })
        }
        let arr = that.data.content
        if (res.data.content.items.length > 0) {
          for (let i = 0; i < res.data.content.items.length; i++) {
            arr.push(res.data.content.items[i])
          }
          that.setData({
            content: arr,
            mentionPeriodPageNum: mentionPeriodPageNum
          })
        }
      }
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
      mentionPeriodPageNum:1
    })
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

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.setData({
      mentionPeriodPageNum:1
    })
    this.init()
    wx.stopPullDownRefresh() //停止下拉刷新
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.getMentionPeriodInit()
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
  selectSiftLeft:function(){
    var that = this
    if(that.data.siftLeft){
      console.log("不筛选")
      that.setData({
        siftLeft:false,
        isShield:false
      })
    }else{
      console.log("筛选")
      that.setData({
        siftLeft:true,
        isShield:true
      })
    }
    setTimeout(function(){
      that.init()
    },300)
  },
  selectSiftShow:function(){
    var that = this
    if(that.data.siftRight){
      console.log("隐藏")
      that.setData({
        siftRight:false
      })
    }else{
      console.log("显示")
      that.setData({
        siftRight:true
      })
    }
  },
  selectSiftRight:function(e){
    var that = this
    var index = e.currentTarget.dataset.index
    if(index==1){
      that.setData({
        siftRightIndex:index,
        sort:index
      })
    }else{
      that.setData({
        siftRightIndex:index,
        sort:index
      })
    }
    setTimeout(function(){
      that.setData({
        siftRight:false
      })
      that.init()
    },300)
  },
  toRule:function(){
    wx.navigateTo({
      url: '/packageA/pages/mentionPeriodRule/mentionPeriodRule'
    })
  },
  toMySet:function(){
    let token = wx.getStorageSync('token')
    let that = this
    if (token) {
      wx.navigateTo({
        url: '/packageA/pages/buyMentionPeriod/buyMentionPeriod'
      })
    } else {
      wx.navigateTo({
        url: "/pages/invitationCode/invitationCode"
      })
    }
  },
  toMyBuy:function(){
    let token = wx.getStorageSync('token')
    if (token) {
      wx.navigateTo({
        url: '/packageA/pages/setMentionPeriod/setMentionPeriod'
      })
    } else {
      wx.navigateTo({
        url: "/pages/invitationCode/invitationCode"
      })
    }
  },
  setMentionPeriod:function(e){
    let token = wx.getStorageSync('token')
    let that = this
    if (token) {
      //此缓存解决从待返提期完成后的页面跳转问题，清除是为了确保此时无缓存
        app.globalData.mentionPeriodFrom = 1
        let id = e.currentTarget.dataset.id
        wx.navigateTo({
          url: '/packageA/pages/mentionPeriod/mentionPeriod'
        })
    } else {
      wx.navigateTo({
        url: "/pages/invitationCode/invitationCode"
      })
    }
  },
  toHelp:function(e){
    let token = wx.getStorageSync('token')
    let that = this
    if (token) {
      //此缓存解决从待返提期完成后的页面跳转问题，清除是为了确保此时无缓存
      app.globalData.helpMentionPeriod = 1
        let id = e.currentTarget.dataset.id
        wx.navigateTo({
          url: '/packageA/pages/helpMentionPeriod/helpMentionPeriod?id='+id
        })
    } else {
      wx.navigateTo({
        url: "/pages/invitationCode/invitationCode"
      })
    }
  },
  shares: function(e) {
    var that = this
    let id = e.currentTarget.dataset.id
      that.setData({
        showModalStatus1: true
      })
      that.share(id)
      wx.hideTabBar()
  },
      // 取消分享
      cancelShare: function () {
        var that = this
        that.setData({
          showModalStatus1: false
        })
      },
      share:function(id){
        let that = this
        app.Util.ajax('mall/weChat/sharing/target', {
          mode: 16,
          targetId: id
        }, 'GET').then((res) => {
          if (res.data.messageCode == "MSG_1001") {
            that.data.shareData = res.data.content
            var inviterCode = wx.getStorageSync('inviterCode')
            if (inviterCode){
              res.data.content.link = res.data.content.link.replace(/{inviterCode}/g, inviterCode)
            } else {
              res.data.content.link = res.data.content.link.replace(/{inviterCode}/g, '')
            }
            console.log(res.data.content.link)
            // 产品图片路径转换为本地路径
            var imageUrl = res.data.content.imageShareUrl
            appletQrCodeUrl
            if (imageUrl) {
              wx.getImageInfo({
                src: imageUrl,
                success(res) {
                  that.data.shareImg = res.path
                  that.data.path_img = res.path
                }
              })
            }
            // 太阳码转换为本地路径
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
  hide: function() {
    var that = this
    that.setData({
      showModalStatus1: false,
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