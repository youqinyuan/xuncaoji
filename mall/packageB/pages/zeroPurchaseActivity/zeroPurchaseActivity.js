// pages/zeroPurchaseActivity/zeroPurchaseActivity.js

let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    content: null,
    type: 2, //活动类型
    zeroText: '', //活动文案
    hours: '00:00:00',
    hours1: '00:00:00',
    showMask: false,
    haibao: false, // 是否显示海报
    showModalStatus1: false, //分享弹框
    shareList: '', //分享数据详情
    showGet: false, //提示
    showText:'',
    btnText: '免费领取', //按钮
    orderTabItem: [{
        title: '信用卡用户免费领',
        select: true,
        type: 2
      },
      {
        title: '新人免费领',
        select: false,
        type: 1
      },
      {
        title: 'Freebuy首单免费领',
        select: false,
        type: 4
      }
    ],
    hostUrl: app.Util.getUrlImg().hostUrl,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    if (options) {
      if (options.inviterCode) {
        wx.setStorage({
          key: "othersInviterCode",
          data: options.inviterCode
        })
      }
    }
    if (options.scene) {
      var scene = decodeURIComponent(options.scene);
      var arrPara = scene.split("&");
      var arr = [];
      for (var i in arrPara) {
        arr = arrPara[i].split("=");
        console.log(arr)
        if (arr[0] == 'type') {
          that.setData({
            type: parseInt(arr[1]),
          })
        }
      }
      app.Util.ajax(`mall/home/activity/freeShopping?mode=${2}&type=${that.data.type}`, null, 'GET').then((res) => {
        if (res.data.content) {
          if (res.data.content.type == 1) {
            that.setData({
              btnText: '免费领取',
              zeroText: '需支付1分钱，支付成功后立刻返还至余额;每期新品限领一份，分享好友即可再领一份。'
            })
            let current = res.data.content.remainingTime
            that.formatDuring(current)
            let interval = setInterval(() => {
              if (current > 0) {
                current -= 1000
                that.formatDuring(current)
              } else {
                clearInterval(interval)
                this.setData({
                  hours: '00:00:00:00',
                })
              }
            }, 1000)
            var priceActivityTimeIntervalList = res.data.content.priceActivityTimeIntervalList
            if (priceActivityTimeIntervalList.length == 1) {
              that.setData({
                numCh: '一'
              })
            } else if (priceActivityTimeIntervalList.length == 2) {
              that.setData({
                numCh: '二'
              })
            } else if (priceActivityTimeIntervalList.length == 3) {
              that.setData({
                numCh: '三'
              })
            } else if (priceActivityTimeIntervalList.length == 4) {
              that.setData({
                numCh: '四'
              })
            } else if (priceActivityTimeIntervalList.length == 5) {
              that.setData({
                numCh: '五'
              })
            }
            for (var i = 0; i < priceActivityTimeIntervalList.length; i++) {
              if (i !== priceActivityTimeIntervalList.length - 1) {
                priceActivityTimeIntervalList[i].endTime = priceActivityTimeIntervalList[i].endTime + ','
              }
            }
            that.setData({
              content: res.data.content,
              type: res.data.content.type
            })
          } else if (res.data.content.type == 2) {
            that.setData({
              zeroText: '领取商品，支付时选择微信绑定的信用卡支付一分钱，支付成功后立刻返还至余额，仅限领取一份！',
              btnText: '免费领取'
            })
            let cur = res.data.content.remainingTime
            that.formatDuring1(cur)
            let interval2 = setInterval(() => {
              if (cur > 0) {
                cur -= 1000
                that.formatDuring1(cur)
              } else {
                clearInterval(interval2)
                that.setData({
                  hours1: '00:00:00:00',
                })
              }
            }, 1000)
            that.setData({
              content: res.data.content,
              type: res.data.content.type
            })
          } else if (res.data.content.type == 4) {
            // let cur = res.data.content.remainingTime
            // that.formatDuring1(cur)
            // let interval2 = setInterval(() => {
            //   if (cur > 0) {
            //     cur -= 1000
            //     that.formatDuring1(cur)
            //   } else {
            //     clearInterval(interval2)
            //     that.setData({
            //       hours1: '00:00:00:00',
            //     })
            //   }
            // }, 1000)
            that.setData({
              btnText: '免费领取',
              content: res.data.content,
              type: res.data.content.type
            })
          }
        }
      })
      if (that.data.type === 1) {
        that.setData({
          [`orderTabItem[${1}].select`]: true
        });
        that.setData({
          [`orderTabItem[${0}].select`]: false
        });
        that.setData({
          [`orderTabItem[${2}].select`]: false
        });
      } else if (that.data.type === 2) {
        that.setData({
          [`orderTabItem[${0}].select`]: true
        });
        that.setData({
          [`orderTabItem[${1}].select`]: false
        });
        that.setData({
          [`orderTabItem[${2}].select`]: false
        });
      } else if (that.data.type === 4) {
        that.setData({
          [`orderTabItem[${2}].select`]: true
        });
        that.setData({
          [`orderTabItem[${1}].select`]: false
        });
        that.setData({
          [`orderTabItem[${0}].select`]: false
        });
      }
    } else if (options.type) {
        app.Util.ajax(`mall/home/activity/freeShopping?mode=${2}&type=${options.type}`, null, 'GET').then((res) => {
          if (res.data.content) {
            if (res.data.content.type == 1) {
              if (res.data.content.shoppingCount >= 1) {
                that.setData({
                  btnText: '免费领取'
                })
              } else if (res.data.content.shoppingCount === 0) {
                that.setData({
                  btnText: '进入公众号免费拿'
                })
              }
              that.setData({
                zeroText: '需支付1分钱，支付成功后立刻返还至余额;每期新品限领一份，分享好友即可再领一份。'
              })
              let current = res.data.content.remainingTime
              that.formatDuring(current)
              let interval = setInterval(() => {
                if (current > 0) {
                  current -= 1000
                  that.formatDuring(current)
                } else {
                  clearInterval(interval)
                  this.setData({
                    hours: '00:00:00:00',
                  })
                }
              }, 1000)
              var priceActivityTimeIntervalList = res.data.content.priceActivityTimeIntervalList
              if (priceActivityTimeIntervalList.length == 1) {
                that.setData({
                  numCh: '一'
                })
              } else if (priceActivityTimeIntervalList.length == 2) {
                that.setData({
                  numCh: '二'
                })
              } else if (priceActivityTimeIntervalList.length == 3) {
                that.setData({
                  numCh: '三'
                })
              } else if (priceActivityTimeIntervalList.length == 4) {
                that.setData({
                  numCh: '四'
                })
              } else if (priceActivityTimeIntervalList.length == 5) {
                that.setData({
                  numCh: '五'
                })
              }
              for (var i = 0; i < priceActivityTimeIntervalList.length; i++) {
                if (i !== priceActivityTimeIntervalList.length - 1) {
                  priceActivityTimeIntervalList[i].endTime = priceActivityTimeIntervalList[i].endTime + ','
                }
              }
              that.setData({
                content: res.data.content,
                type: res.data.content.type
              })
            } else if (res.data.content.type == 2) {
              that.setData({
                zeroText: '领取商品，支付时选择微信绑定的信用卡支付一分钱，支付成功后立刻返还至余额，仅限领取一份！',
                btnText: '免费领取'
              })
              let cur = res.data.content.remainingTime
              that.formatDuring1(cur)
              let interval2 = setInterval(() => {
                if (cur > 0) {
                  cur -= 1000
                  that.formatDuring1(cur)
                } else {
                  clearInterval(interval2)
                  that.setData({
                    hours1: '00:00:00:00',
                  })
                }
              }, 1000)
              that.setData({
                content: res.data.content,
                type: res.data.content.type
              })
            } else if (res.data.content.type == 4) {
              // let cur = res.data.content.remainingTime
              // that.formatDuring1(cur)
              // let interval2 = setInterval(() => {
              //   if (cur > 0) {
              //     cur -= 1000
              //     that.formatDuring1(cur)
              //   } else {
              //     clearInterval(interval2)
              //     that.setData({
              //       hours1: '00:00:00:00',
              //     })
              //   }
              // }, 1000)
              that.setData({
                btnText: '免费领取',
                content: res.data.content,
                type: res.data.content.type
              })
            }
          }
        })
        if (parseInt(options.type) === 1) {
          that.setData({
            [`orderTabItem[${1}].select`]: true
          });
          that.setData({
            [`orderTabItem[${0}].select`]: false
          });
          that.setData({
            [`orderTabItem[${2}].select`]: false
          });
        } else if (parseInt(options.type) === 2) {
          that.setData({
            [`orderTabItem[${0}].select`]: true
          });
          that.setData({
            [`orderTabItem[${1}].select`]: false
          });
          that.setData({
            [`orderTabItem[${2}].select`]: false
          });
        } else if (parseInt(options.type) === 4) {
          that.setData({
            [`orderTabItem[${2}].select`]: true
          });
          that.setData({
            [`orderTabItem[${1}].select`]: false
          });
          that.setData({
            [`orderTabItem[${0}].select`]: false
          });
        }
      }else {
      that.init()
    }

    that.chooseShare()
    //下载线上图片到本地，用于绘制分享图片
    // wx.downloadFile({
    //   url: app.Util.getUrlImg().hostUrl + '/xuncaoji_cheats.png',
    //   success: function(res) {
    //     console.log("背景图本地储存：" + JSON.stringify(res.tempFilePath));
    //     that.setData({
    //       shareBgImg: res.tempFilePath
    //     })
    //   },
    //   fail: function(res) {

    //   }
    // })

  },
  // 取消未满足条件弹框
  cancelGet: function() {
    var that = this
    that.setData({
      showGet: false
    })
  },
  //切换导航栏
  tabTop: function(e) {
    var that = this
    var type = e.currentTarget.dataset.type
    that.setData({
      type: type
    })
    that.chooseShare()
    app.Util.ajax(`mall/home/activity/freeShopping?mode=${2}&type=${type}`, null, 'GET').then((res) => {
      if (res.data.content) {
        if (res.data.content.type == 1) {
          that.setData({
            zeroText: '需支付1分钱，支付成功后立刻返还至余额;每期新品限领一份，分享好友即可再领一份。'
          })
          let current = res.data.content.remainingTime
          that.formatDuring(current)
          let interval = setInterval(() => {
            if (current > 0) {
              current -= 1000
              that.formatDuring(current)
            } else {
              clearInterval(interval)
              this.setData({
                hours: '00:00:00:00',
              })
            }
          }, 1000)
          var priceActivityTimeIntervalList = res.data.content.priceActivityTimeIntervalList
          if (priceActivityTimeIntervalList.length == 1) {
            that.setData({
              numCh: '一'
            })
          } else if (priceActivityTimeIntervalList.length == 2) {
            that.setData({
              numCh: '二'
            })
          } else if (priceActivityTimeIntervalList.length == 3) {
            that.setData({
              numCh: '三'
            })
          } else if (priceActivityTimeIntervalList.length == 4) {
            that.setData({
              numCh: '四'
            })
          } else if (priceActivityTimeIntervalList.length == 5) {
            that.setData({
              numCh: '五'
            })
          }
          for (var i = 0; i < priceActivityTimeIntervalList.length; i++) {
            if (i !== priceActivityTimeIntervalList.length - 1) {
              priceActivityTimeIntervalList[i].endTime = priceActivityTimeIntervalList[i].endTime + ','
            }
          }
          that.setData({
            content: res.data.content
          })
        } else {
          that.setData({
            zeroText: '领取商品，支付时选择微信绑定的信用卡支付一分钱，支付成功后立刻返还至余额，仅限领取一份！'
          })
          let cur = res.data.content.remainingTime
          that.formatDuring1(cur)
          let interval2 = setInterval(() => {
            if (cur > 0) {
              cur -= 1000
              that.formatDuring1(cur)
            } else {
              clearInterval(interval2)
              that.setData({
                hours1: '00:00:00:00',
              })
            }
          }, 1000)
          that.setData({
            content: res.data.content
          })
        }
      } else {
        that.setData({
          content: []
        })
      }
    })
    for (var i in that.data.orderTabItem) {
      that.setData({
        [`orderTabItem[${i}].select`]: false
      });
    }
    that.setData({
      [`orderTabItem[${e.currentTarget.dataset.index}].select`]: true
    });
  },
  //跳转到详情页
  jumpDetail: function(e) {
    var that = this
    if (that.data.type == 4) {
      app.Util.ajax('mall/home/activity/freeShopping/obtaining/validate', {
        type: that.data.type,
        goodsId: e.currentTarget.dataset.id
      }, 'POST').then((res) => {
        if (res.data.messageCode == 'MSG_1001') {
          wx.navigateTo({
            url: `/packageB/pages/zeroPurchase/zeroPurchase?orgPrice=${e.currentTarget.dataset.price}&id=${e.currentTarget.dataset.id}&type=${that.data.type}&text=${e.currentTarget.dataset.text}`
          })
        } else {
          that.setData({
            showText: res.data.message
          })
          setTimeout(function () {
            that.setData({
              showGet: true
            })
          }, 100)
        }
      })
    } else {
      wx.navigateTo({
        url: `/packageB/pages/zeroPurchase/zeroPurchase?orgPrice=${e.currentTarget.dataset.price}&id=${e.currentTarget.dataset.id}&text=${e.currentTarget.dataset.text}&type=${that.data.type}`,
      })
    } 
  },
  init: function() {
    var that = this
    app.Util.ajax(`mall/home/activity/freeShopping?mode=${2}&type=${that.data.type}`, null, 'GET').then((res) => {
      if (res.data.content) {
        let current = res.data.content.remainingTime
        that.formatDuring(current)
        let interval = setInterval(() => {
          if (current > 0) {
            current -= 1000
            that.formatDuring(current)
          } else {
            clearInterval(interval)
            this.setData({
              hours: '00:00:00:00',
            })
          }
        }, 1000)
        that.setData({
          content: res.data.content,
          zeroText: ' 领取商品，支付时选择微信绑定的信用卡支付一分钱，支付成功后立刻返还至余额，仅限领取一份！'
        })
      }
    })
  },
  formatDuring(mss) {
    var that = this
    const hours = parseInt(mss / (1000 * 60 * 60)).toString().slice(0, 2) >= 10 ? parseInt(mss / (1000 * 60 * 60)).toString().slice(0, 2) : '0' + parseInt(mss / (1000 * 60 * 60)).toString().slice(0, 2)
    const minutes = parseInt((mss % (1000 * 60 * 60)) / (1000 * 60)).toString() >= 10 ? parseInt((mss % (1000 * 60 * 60)) / (1000 * 60)).toString() : '0' + parseInt((mss % (1000 * 60 * 60)) / (1000 * 60)).toString()
    const seconds = parseInt((mss % (1000 * 60)) / 1000).toString() >= 10 ? parseInt((mss % (1000 * 60)) / 1000).toString() : '0' + parseInt((mss % (1000 * 60)) / 1000).toString()
    const haoSeconds = parseInt((mss % (60))).toString() >= 10 ? parseInt((mss % (60))).toString() : '0' + parseInt((mss % (60))).toString()
    that.setData({
      hours: hours + ':' + minutes + ':' + seconds + ':' + haoSeconds,
    })
  },
  formatDuring1(mss) {
    var that = this
    const hours1 = parseInt(mss / (1000 * 60 * 60)).toString().slice(0, 2) >= 10 ? parseInt(mss / (1000 * 60 * 60)).toString().slice(0, 2) : '0' + parseInt(mss / (1000 * 60 * 60)).toString().slice(0, 2)
    const minutes1 = parseInt((mss % (1000 * 60 * 60)) / (1000 * 60)).toString() >= 10 ? parseInt((mss % (1000 * 60 * 60)) / (1000 * 60)).toString() : '0' + parseInt((mss % (1000 * 60 * 60)) / (1000 * 60)).toString()
    const seconds1 = parseInt((mss % (1000 * 60)) / 1000).toString() >= 10 ? parseInt((mss % (1000 * 60)) / 1000).toString() : '0' + parseInt((mss % (1000 * 60)) / 1000).toString()
    const haoSeconds1 = parseInt((mss % (60))).toString() >= 10 ? parseInt((mss % (60))).toString() : '0' + parseInt((mss % (60))).toString()
    that.setData({
      hours1: hours1 + ':' + minutes1 + ':' + seconds1 + ':' + haoSeconds1,
    })
  },
  // 获取分享数据详情
  chooseShare: function() {
    var that = this
    if(that.data.type==1){
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
    } else if (that.data.type == 2){
      app.Util.ajax('mall/weChat/sharing/target', {
        mode: 6
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
    }else{
      app.Util.ajax('mall/weChat/sharing/target', {
        mode: 11
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
    }  
  },
  showBtn: function(e) {
    var that = this
    if (that.data.type == 4) {
      app.Util.ajax('mall/home/activity/freeShopping/obtaining/validate', {
        type: that.data.type,
        goodsId: e.currentTarget.dataset.goodsid
      }, 'POST').then((res) => {
        if (res.data.messageCode == 'MSG_1001') {
          wx.navigateTo({
            url: `/packageB/pages/zeroPurchase/zeroPurchase?orgPrice=${e.currentTarget.dataset.price}&id=${e.currentTarget.dataset.goodsid}&type=${that.data.type}&text=${e.currentTarget.dataset.text}`
          })
        } else {
          that.setData({
            showText: res.data.message
          })
          setTimeout(function () {
            that.setData({
              showGet: true
            })
          }, 100)
        }
      })
    } else {
      wx.navigateTo({
        url: `/packageB/pages/zeroPurchase/zeroPurchase?orgPrice=${e.currentTarget.dataset.price}&id=${e.currentTarget.dataset.goodsid}&type=${that.data.type}&text=${e.currentTarget.dataset.text}`,
      })
    }
  },
  //显示或隐藏弹框
  show: function() {
    var that = this
    that.setData({
      showMask: false
    })
  },
  //阻止弹框之后的页面滑动问题
  preventTouchMove: function() {

  },
  // 点击橘色的分享按钮
  shares: function() {
    var that = this
    that.setData({
      showModalStatus1: true
    })
  },
  // 取消分享
  cancelShare: function() {
    var that = this
    that.setData({
      showModalStatus1: false
    })
  },
  //分享朋友圈
  shareFriend: function() {
    var that = this
    wx.showLoading({
      title: '加载中',
    })
    if (that.data.type == 1) {
      app.Util.ajax('mall/weChat/sharing/target', {
        mode: 3,
      }, 'GET').then((res) => {
        if (res.data.messageCode == 'MSG_1001') {
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
              ctx.drawImage('/packageA/img/xuncaoji_cheats.png', 0.1308 * width + 7, 137, 0.617 * width - 14, 0.3 * height - 14);
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
        } else if (res.data.messageCode == 'MSG_4001') {
          wx.showToast({
            title: res.data.message,
            icon: 'none',
            duration: 2000
          })
        }
      })
    } else if (that.data.type == 2) {
      app.Util.ajax('mall/weChat/sharing/target', {
        mode: 6,
      }, 'GET').then((res) => {
        if (res.data.messageCode == 'MSG_1001') {
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
              ctx.drawImage('/packageA/img/xuncaoji_cheats.png', 0.1308 * width + 7, 137, 0.617 * width - 14, 0.3 * height - 14);
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
              // // 绘制价格
              // ctx.beginPath()
              // price = `¥${price}`
              // ctx.setFontSize(16);
              // ctx.setFillStyle('#F85A53');
              // ctx.setTextAlign("left")
              // ctx.fillText(price, 0.1308 * width, 0.525 * height - 4);
              // ctx.stroke();
              // ctx.closePath()
              // ctx.beginPath()
              // // 绘制参与返
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
              // // 绘制参与返价格
              // cashBack = `参与返¥ ${cashBack}`
              // ctx.beginPath()
              // ctx.setFontSize(12);
              // ctx.setFillStyle('#fff');
              // ctx.setTextAlign("left")
              // ctx.fillText(cashBack, 0.1 * width + textWidth2 + 28, 0.525 * height - 4);
              // ctx.stroke();
              // ctx.closePath()
              //绘制活动支付一分
              ctx.beginPath()
              ctx.setFontSize(15);
              ctx.setFillStyle('#F85A53');
              ctx.fillText('活动需支付1分钱，即可返还到账户内', 0.1308 * width + 120, 0.442 * height + 60);
              ctx.stroke();
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
        } else if (res.data.messageCode == 'MSG_4001') {
          wx.showToast({
            title: res.data.message,
            icon: 'none',
            duration: 2000
          })
        }
      })
    } else if (that.data.type == 4) {
      app.Util.ajax('mall/weChat/sharing/target', {
        mode: 11,
      }, 'GET').then((res) => {
        if (res.data.messageCode == 'MSG_1001') {
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
              ctx.drawImage('/packageA/img/xuncaoji_cheats.png', 0.1308 * width + 7, 137, 0.617 * width - 14, 0.3 * height - 14);
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
              // // 绘制价格
              // ctx.beginPath()
              // price = `¥${price}`
              // ctx.setFontSize(16);
              // ctx.setFillStyle('#F85A53');
              // ctx.setTextAlign("left")
              // ctx.fillText(price, 0.1308 * width, 0.525 * height - 4);
              // ctx.stroke();
              // ctx.closePath()
              // ctx.beginPath()
              // // 绘制参与返
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
              // // 绘制参与返价格
              // cashBack = `参与返¥ ${cashBack}`
              // ctx.beginPath()
              // ctx.setFontSize(12);
              // ctx.setFillStyle('#fff');
              // ctx.setTextAlign("left")
              // ctx.fillText(cashBack, 0.1 * width + textWidth2 + 28, 0.525 * height - 4);
              // ctx.stroke();
              // ctx.closePath()
              //绘制活动支付一分
              // ctx.beginPath()
              // ctx.setFontSize(15);
              // ctx.setFillStyle('#F85A53');
              // ctx.fillText('活动需支付1分钱，即可返还到账户内', 0.1308 * width + 120, 0.442 * height + 60);
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
                ctx.fillText(row[b], 0.1308 * width - 6, 0.565 * height - 24 + b * 20);
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
        } else if (res.data.messageCode == 'MSG_4001') {
          wx.showToast({
            title: res.data.message,
            icon: 'none',
            duration: 2000
          })
        }
      })
    }

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
  onShareAppMessage: function(ops) {
    var that = this
    if (ops.from === 'button') {
      console.log(ops.target.id)
      if (ops.target.id === 'btn') {
        that.setData({
          showModalStatus1: false
        })
        if (that.data.type == 1) {
          app.Util.ajax('mall/weChat/sharing/onSuccess', {
            mode: 3
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
            path: that.data.shareList.link,
            imageUrl: '/packageA/img/xuncaoji_cheats.png',
          }
        } else if (that.data.type == 2) {
          app.Util.ajax('mall/weChat/sharing/onSuccess', {
            mode: 6
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
            path: that.data.shareList.link,
            imageUrl: '/packageA/img/xuncaoji_cheats.png',
          }
        } else if (that.data.type == 4) {
          app.Util.ajax('mall/weChat/sharing/onSuccess', {
            mode: 11
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
            path: that.data.shareList.link,
            imageUrl: '/packageA/img/xuncaoji_cheats.png',
          }
        }
      } else if (ops.target.id === 'btnGroup') {
        that.setData({
          showModalStatus1: false
        })
        if (that.data.type == 1) {
          app.Util.ajax('mall/weChat/sharing/onSuccess', {
            mode: 3
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
            imageUrl: '/packageA/img/xuncaoji_cheats.png',
          }
        } else if (that.data.type == 2) {
          app.Util.ajax('mall/weChat/sharing/onSuccess', {
            mode: 6
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
            imageUrl: '/packageA/img/xuncaoji_cheats.png',
          }
        } else if (that.data.type == 4) {
          app.Util.ajax('mall/weChat/sharing/onSuccess', {
            mode: 11
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
            imageUrl: '/packageA/img/xuncaoji_cheats.png',
          }
        }
      }
    } else {
      if (that.data.type == 1) {
        app.Util.ajax('mall/weChat/sharing/onSuccess', {
          mode: 3
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
          path: that.data.shareList.link,
          imageUrl: '/packageA/img/xuncaoji_cheats.png',
        }
      } else if (that.data.type == 2) {
        app.Util.ajax('mall/weChat/sharing/onSuccess', {
          mode: 6
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
          path: that.data.shareList.link,
          imageUrl: '/packageA/img/xuncaoji_cheats.png',
        }
      } else if (that.data.type == 4) {
        app.Util.ajax('mall/weChat/sharing/onSuccess', {
          mode: 11
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
          path: that.data.shareList.link,
          imageUrl: '/packageA/img/xuncaoji_cheats.png',
        }
      }
    }
  }
})