// pages/xuncaoji/xuncaoji.js
let app = getApp()
var utils = require('../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tempInfo:[],
    returnContent:[],
    returnContent2:[],
    waitReentry3:false,
    waitReentry:false,
    waitReentry2:false,
    autoplay: false,
    showBtn: true, //是否显示首图
    showModalStatus: false, //是否显示底部弹框
    haibao: false, // 是否显示海报
    shareList: {}, //分享数据
    playIndex: null, //用于记录当前播放的视频的索引值
    autoplay: true, //轮播图自动播放
    courseList: [],
    html: '',
    hostUrl: app.Util.getUrlImg().hostUrl
  },
  videoPlay: function(e) {
    var curIdx = e.currentTarget.dataset.index;
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
  //求当前轮播图的索引
  // countIndex: function(e) {
  //   var curIdx = e.detail.current;
  //   // 没有播放时播放视频
  //   if (!this.data.playIndex) {
  //     this.setData({
  //       playIndex: curIdx
  //     })
  //     var videoContext = wx.createVideoContext('video' + curIdx) //这里对应的视频id
  //     videoContext.play()
  //   } else { // 有播放时先将prev暂停，再播放当前点击的current
  //     var videoContextPrev = wx.createVideoContext('video' + this.data.playIndex)
  //     if (this.data.playIndex != curIdx) {
  //       videoContextPrev.pause()
  //     }
  //     this.setData({
  //       playIndex: curIdx
  //     })
  //     var videoContextCurrent = wx.createVideoContext('video' + curIdx)
  //     videoContextCurrent.play()
  //   }
  // },
  /**
   * 弹出框蒙层截断touchmove事件
   */
  preventTouchMove: function() {},
  //查询分享数据
  chooseShare: function() {
    var that = this
    app.Util.ajax('mall/weChat/sharing/target', {
      mode: 5
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
  //分享
  showShare: function(e) {
    var that = this
    that.setData({
      showModalStatus: true
    })
  },
  cancelShare: function() {
    var that = this
    that.setData({
      showModalStatus: false
    })
  },
  //隐藏底部分享对话框
  hideModal: function() {
    var that = this
    that.setData({
      showModalStatus: false,
    })
  },
  // 分享朋友圈 生成海报
  shareFriend: function() {
    var that = this
    app.Util.ajax('mall/weChat/sharing/target', {
      mode: 5,
    }, 'GET').then((res) => {
      if (res.data.messageCode = 'MSG_1001') {
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
            var ctx = wx.createCanvasContext('mycanvas');
            //绘制图片模板的背景图片
            ctx.drawImage('/assets/images/icon/bg.png', 0, 0, 0.88 * width, 0.89 * height);
            //绘制顶部红色背景
            ctx.drawImage('/assets/images/icon/canvas_title.png', 0, 0, 0.88 * width, 0.2 * height);
            //绘制标题
            ctx.setFontSize(13);
            ctx.setFillStyle('#fff');
            ctx.setTextAlign("center")
            ctx.fillText(that.data.shareList.title, 0.5 * width * 0.88, 26);
            ctx.stroke();
            //绘制矩形
            ctx.setFillStyle('#fff')
            ctx.setShadow(0, 0, 2, '#eee')
            ctx.fillRect(0.075 * width * 0.88, 0.095 * height * 0.89, 0.75 * width, 0.485 * height)
            //绘制logo
            ctx.drawImage('/assets/images/icon/partner.png', 0.35 * width, 44, 64, 51);
            //绘制邀请码
            if (inviterCode) {
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
            ctx.drawImage('/packageA/img/xuncaoji_cheats.png', 0.183 * width * 0.85, 0.21 * height * 0.89, 0.56 * width, 0.26 * height);
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
            var test = that.data.shareList.imageDesc
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
              showModalStatus: false,
              haibao: true
            })
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
    // 显示tabbar
  },
  init: function() {
    var that = this
    app.Util.ajax('mall/page/queryByType', {
      type: 1,
    }, 'GET').then((res) => {
      if (res.data.messageCode = 'MSG_1001') {
        var courseList1 = res.data.content.pageSetVideos
        var courseList = {}
        courseList['videoUrl'] = courseList1
        courseList['coverImg'] = app.Util.getUrlImg().hostUrl+ '/icon/video_play.png'
        that.setData({
          html: res.data.content.content,
          courseList: courseList
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    that.init()
    that.chooseShare()
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
    if(wx.getStorageSync("token")){
      that.returnInfo()
    }
    that.init()
    that.setData({
      showModalStatus:false,
      playIndex:null
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
    var that = this
    that.init()
    wx.stopPullDownRefresh() //停止下拉刷新
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
      if (ops.target.id === 'btn') {
        that.setData({
          showModalStatus: false
        })
        app.Util.ajax('mall/weChat/sharing/onSuccess', {
          mode: 5
        }, 'POST').then((res) => {
          if (res.data.content) {
            wx.showToast({
              title: '分享成功',
              icon: 'none'
            })
          } else {
            // wx.showToast({
            //   title: res.data.message,
            //   icon: 'none'
            // })
          }
        })
        return {
          title: that.data.shareList.desc,
          path: that.data.shareList.link,
          imageUrl: '/packageA/img/xuncaoji_cheats.png',
          success: function(res) {

          },
          fail: function(res) {
            // 转发失败
            console.log("转发失败:" + JSON.stringify(res));
          }
        }
      } else if (ops.target.id === 'btnGroup') {
        that.setData({
          showModalStatus: false
        })
        app.Util.ajax('mall/weChat/sharing/onSuccess', {
          mode: 5
        }, 'POST').then((res) => {
          if (res.data.content) {
            wx.showToast({
              title: '分享成功',
              icon: 'none'
            })
          } else {
            // wx.showToast({
            //   title: res.data.message,
            //   icon: 'none'
            // })
          }
        })
        return {
          title: that.data.shareList.groupDesc,
          path: that.data.shareList.link,
          imageUrl: '/packageA/img/xuncaoji_cheats.png',
          success: function(res) {

          },
          fail: function(res) {
            // 转发失败
            console.log("转发失败:" + JSON.stringify(res));
          }
        }
      }

    } else {
      return {
        title: that.data.shareList.desc,
        path: that.data.shareList.link,
        imageUrl: '/packageA/img/xuncaoji_cheats.png',
      }
    }
  },
   //转让弹窗
   waitReentryClose:function(){
    this.setData({
      waitReentry:false
    })
    this.returnInfo3()
  },
  waitReentryClose2:function(){
    this.setData({
      waitReentry2:false
    })
    this.returnInfo2()
  },
  waitReentryClose3:function(){
    this.setData({
      waitReentry3:false
    })
    wx.navigateTo({
      url:"/packageB/pages/waitReentryDetail/waitReentryDetail"
    })
  },
  //转让信息弹窗查询
  returnInfo: function () {
    var that = this
    app.Util.ajax('mall/transfer/gainNotice', null, 'GET').then((res) => {
      if (res.data.content.length > 0) {
        that.setData({
          tempInfo: res.data.content
        })
        for (let i of res.data.content) {
          if (i.type == 2) {
            //转让完成消息
            that.setData({
              waitReentry2: true,
              returnContent2: i.standard
            })
          }
        }
        if (that.data.waitReentry2 == false) {
          for (let i of res.data.content) {
            if (i.type == 3) {
              //转让取消消息
              that.setData({
                waitReentry: true,
                returnContent: i.standard
              })
            }
          }
        }
        if (that.data.waitReentry == false) {
          for (let i of res.data.content) {
            if (i.type == 1) {
              //转让消息
              that.setData({
                waitReentry3: true,
              })
            }
          }
        }
      }
    })
  },
  returnInfo2:function(){
    var that = this
      if(that.data.tempInfo.length>0){
        for(let i of that.data.tempInfo){
          if(i.type==3){
            //转让取消消息
            that.setData({
            waitReentry:true,
            returnContent:i.standard
          })
        }
      }
      if( that.data.waitReentry == false){
          for (let i of that.data.tempInfo) {
            if (i.type == 1) {
              //转让消息
              that.setData({
                waitReentry3: true,
              })
            }
          }
        }
      
    } 
  },
  returnInfo3:function(){
    var that = this
      if(that.data.tempInfo.length>0){
        for(let i of that.data.tempInfo){
          if(i.type==1){
          //转让消息
          that.setData({
            waitReentry3:true,
          })
        }
      }
    } 
  },
})