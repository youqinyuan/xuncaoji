// pages/posting/posting.js
let app = getApp();
var time = require('../../utils/util.js');
var newCount = true;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    postingStatus: null, //显示帖子类型
    showModal: false, //期望价格弹窗
    inputValue: '', //期望价格
    expectAmount: '请输入售价',
    goodsData: {},
    imgList: [], //上传的图片列表
    wishImg: '',
    imgList_compress: [], //压缩后的图片列表
    index: '',
    isShow: false,
    waitReentry: null,
    saleText: null,
    buyText: null,
    annualizedRate: null, //年收益率
    isdisabled: true,
    cashBackAmount: '',
    cashBackAmountEnd: '',
    periodLeft: '',
    periodLeftEnd: '',
    annualizedRateBegin: '',
    annualizedRateEnd: '',
    msgText: '',
    hostUrl: app.Util.getUrlImg().hostUrl,
    seedToast: false //预售种子消耗弹窗
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    that.setData({
      postingStatus: parseInt(options.status)
      // postingStatus: 2
    })
    if (options.returnStatus) {
      this.setData({
        returnStatus: options.returnStatus
      })
    }
    that.getData();
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
    var waitReentry = wx.getStorageSync('waitReentry')
    if (waitReentry) {
      waitReentry.maxReturnTime = time.formatTimeTwo(waitReentry.maxReturnTime, 'Y-M-D')
      waitReentry['cashBackAmount'] = waitReentry.noCashBackAmount
      that.setData({
        isShow: true,
        waitReentry: waitReentry
      })
    }
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
    wx.removeStorageSync('goWaitReentry')
    wx.removeStorageSync('waitReentry')
    if (this.data.returnStatus) {
      wx.navigateTo({
        url: `/pages/myorder/myorder?status=${2}`,
      })
    }
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
  onShareAppMessage: function() {

  },
  getData: function() {
    var that = this
    that.data.goodsData['imgList'] = []
    that.data.goodsData['img_compress'] = []
    that.data.goodsData['goodsComment'] = ''
    that.setData({
      goodsData: that.data.goodsData
    })
  },
  //普通帖获取文本框的内容
  getTextareaValue: function(e) {
    var that = this
    if (e.detail.value.length == 0) {
      that.data.goodsData.goodsComment = ''
    } else {
      if (e.detail.value.length > 200) {
        that.setData({
          msgText: '您已经输入超出最大限度!'
        })
      } else {
        that.data.goodsData.goodsComment = e.detail.value
        that.setData({
          goodsData: that.data.goodsData,
          msgText: ''
        })
      }
    }
  },
  //卖帖
  getSaleTextarea: function(e) {
    var that = this
    if (e.detail.value.length == 0) {
      saleText: null
    }
    else {
      if (e.detail.value.length > 200) {
        that.setData({
          msgText: '您已经输入超出最大限度!'
        })
      } else {
        that.setData({
          saleText: e.detail.value,
          msgText: ''
        })
      }
    }
  },
  //买帖
  getBuyTextarea: function(e) {
    var that = this
    if (e.detail.value.length == 0) {
      buyText: null
    }
    else {
      if (e.detail.value.length > 200) {
        that.setData({
          msgText: '您已经输入超出最大限度!'
        })
      } else {
        that.setData({
          buyText: e.detail.value,
          msgText: ''
        })
      }
    }
  },
  cashBackAmount: function(e) {
    var that = this
    that.setData({
      cashBackAmount: e.detail.value
    })
  },
  cashBackAmountEnd: function(e) {
    var that = this
    that.setData({
      cashBackAmountEnd: e.detail.value
    })
  },
  periodLeft: function(e) {
    var that = this
    that.setData({
      periodLeft: e.detail.value
    })

  },
  periodLeftEnd: function(e) {
    var that = this
    that.setData({
      periodLeftEnd: e.detail.value
    })
  },
  annualizedRateBegin: function(e) {
    var that = this
    that.setData({
      annualizedRateBegin: e.detail.value
    })
  },
  annualizedRateEnd: function(e) {
    var that = this
    that.setData({
      annualizedRateEnd: e.detail.value
    })
  },
  //发布
  submit: function() {
    if (newCount == true) {
      newCount = false
      var that = this
      if (that.data.postingStatus == 1) {
        if (that.data.goodsData.goodsComment == '') {
          wx.showToast({
            title: '不能一言不发哦',
            icon: 'none',
            duration: 1000
          })
        } else {
          app.Util.ajax('mall/forum/topic/addNormalTopicBase64', {
            content: that.data.goodsData.goodsComment,
            encodedImages: that.data.goodsData.img_compress,
          }, 'POST').then((res) => {
            if (res.data.content) {
              wx.navigateTo({
                url: '/pages/finishPosting/finishPosting?seedIncreased=' + res.data.content.seedIncreased + '&postingStatus=' + that.data.postingStatus,
              })
              wx.setStorageSync('posting', 1)
            } else {
              wx.showToast({
                title: res.data.message,
                icon: 'none',
                duration: 1000
              })
            }
          })
        }

      } else if (that.data.postingStatus == 2) {
        if (that.data.buyText) {
          if (that.data.cashBackAmount !== '' && that.data.cashBackAmountEnd !== '' && that.data.periodLeft !== '' && that.data.periodLeftEnd !== '' && that.data.annualizedRateBegin !== '' && that.data.annualizedRateEnd !== '') {
            if (Number(that.data.cashBackAmount) >= Number(that.data.cashBackAmountEnd)) {
              wx.showToast({
                title: '最低共返金额应小于最高共返金额',
                icon: 'none'
              })
            } else if (Number(that.data.periodLeft) >= Number(that.data.periodLeftEnd)) {
              wx.showToast({
                title: '最短返还期数应小于最长返还期数',
                icon: 'none'
              })
            } else if (Number(that.data.annualizedRateBegin) >= Number(that.data.cashBackAmountEnd)) {
              wx.showToast({
                title: '最小年收益率应小于最大年收益率',
                icon: 'none'
              })
            } else {
              app.Util.ajax('mall/forum/topic/addBuyTopic', {
                content: that.data.buyText,
                cashBackAmount: that.data.cashBackAmount,
                cashBackAmountEnd: that.data.cashBackAmountEnd,
                periodLeft: that.data.periodLeft,
                periodLeftEnd: that.data.periodLeftEnd,
                annualizedRate: that.data.annualizedRateBegin,
                annualizedRateEnd: that.data.annualizedRateEnd,
              }, 'POST').then((res) => {
                if (res.data.content) {
                  wx.navigateTo({
                    url: '/pages/finishPosting/finishPosting?seedIncreased=' + res.data.content.seedIncreased + '&postingStatus=' + that.data.postingStatus + '&id=' + res.data.content.id,
                  })
                  wx.setStorageSync('posting', 1)
                } else {
                  wx.showToast({
                    title: res.data.message,
                    icon: 'none',
                    duration: 1000
                  })
                }
              })
            }
          } else {
            wx.showToast({
              title: '输入框不能为空',
              icon: 'none'
            })
          }
        } else {
          if (that.data.cashBackAmount !== '' && that.data.cashBackAmountEnd !== '' && that.data.periodLeft !== '' && that.data.periodLeftEnd !== '' && that.data.annualizedRateBegin !== '' && that.data.annualizedRateEnd !== '') {
            if (Number(that.data.cashBackAmount) >= Number(that.data.cashBackAmountEnd)) {
              wx.showToast({
                title: '最低共返金额应小于最高共返金额',
                icon: 'none'
              })
            } else if (Number(that.data.periodLeft) >= Number(that.data.periodLeftEnd)) {
              wx.showToast({
                title: '最短返还期数应小于最长返还期数',
                icon: 'none'
              })
            } else if (Number(that.data.annualizedRateBegin) >= Number(that.data.cashBackAmountEnd)) {
              wx.showToast({
                title: '最小年收益率应小于最大年收益率',
                icon: 'none'
              })
            } else {
              app.Util.ajax('mall/forum/topic/addBuyTopic', {
                cashBackAmount: that.data.cashBackAmount,
                cashBackAmountEnd: that.data.cashBackAmountEnd,
                periodLeft: that.data.periodLeft,
                periodLeftEnd: that.data.periodLeftEnd,
                annualizedRate: that.data.annualizedRateBegin,
                annualizedRateEnd: that.data.annualizedRateEnd,
              }, 'POST').then((res) => {
                if (res.data.content) {
                  wx.navigateTo({
                    url: '/pages/finishPosting/finishPosting?seedIncreased=' + res.data.content.seedIncreased + '&postingStatus=' + that.data.postingStatus + '&id=' + res.data.content.id,
                  })
                  wx.setStorageSync('posting', 1)
                } else {
                  wx.showToast({
                    title: res.data.message,
                    icon: 'none',
                    duration: 1000
                  })
                }
              })
            }
          } else {
            wx.showToast({
              title: '输入框不能为空',
              icon: 'none'
            })
          }
        }
      } else if (that.data.postingStatus == 3) {
        var waitReentry = wx.getStorageSync('waitReentry')
        if (!waitReentry) {
          wx.showToast({
            title: '请选择待返订单',
            icon: 'none'
          })
        } else {
          if (that.data.expectAmount == '请输入售价') {
            wx.showToast({
              title: '请输入售价',
              icon: 'none'
            })
          } else {
            app.Util.ajax('mall/forum/topic/checkSeed4AddSaleTopic', {
              content: that.data.saleText,
              orderId: that.data.waitReentry.orderId,
              orderGoodsId: that.data.waitReentry.orderGoodsId,
              expectAmount: that.data.expectAmount,
              cashBackAmount: that.data.waitReentry.cashBackAmount,
              perReturnAmount: that.data.waitReentry.perReturnAmount,
              maxReturnTime: waitReentry.maxReturnTime,
              transferId: that.data.waitReentry.transferId,
              periodLeft: that.data.waitReentry.periodLeft,
              code: that.data.waitReentry.code,
              lastReturnAmount: that.data.waitReentry.lastReturnAmount ? that.data.waitReentry.lastReturnAmount : ''
            }, 'POST').then((res) => {
              if (res.data.messageCode == "MSG_1001") {
                if(res.data.content.seedAmountConsume>0){
                  this.setData({
                    seedText: res.data.content,
                    seedToast: true,
                    isdisabled: false
                  })
                }else{
                  that.payShure()
                }
              }else{
                wx.showToast({
                  title: res.data.message,
                  icon:'none'
                })
              }
            })
            // let data = {
            //   content: that.data.saleText,
            //   orderId: that.data.waitReentry.orderId,
            //   orderGoodsId: that.data.waitReentry.orderGoodsId,
            //   expectAmount: that.data.expectAmount,
            //   cashBackAmount: that.data.waitReentry.cashBackAmount,
            //   perReturnAmount: that.data.waitReentry.perReturnAmount,
            //   maxReturnTime: waitReentry.maxReturnTime,
            //   periodLeft: that.data.waitReentry.periodLeft,
            //   code: that.data.waitReentry.code,
            //   lastReturnAmount:that.data.waitReentry.lastReturnAmount?that.data.waitReentry.lastReturnAmount:''
            // }
            // let data1 = {
            //   content: that.data.saleText,
            //   orderId: that.data.waitReentry.orderId,
            //   orderGoodsId: that.data.waitReentry.orderGoodsId,
            //   expectAmount: that.data.expectAmount,
            //   cashBackAmount: that.data.waitReentry.cashBackAmount,
            //   perReturnAmount: that.data.waitReentry.perReturnAmount,
            //   transferId: waitReentry.transferId,
            //   maxReturnTime: waitReentry.maxReturnTime,
            //   periodLeft: that.data.waitReentry.periodLeft,
            //   code: that.data.waitReentry.code,
            //   lastReturnAmount:that.data.waitReentry.lastReturnAmount?that.data.waitReentry.lastReturnAmount:''
            // }
            // if (that.data.saleText) {
            //   if (!waitReentry.transferId) {
            //     app.Util.ajax('mall/forum/topic/addSaleTopic',data, 'POST').then((res) => {
            //       if (res.data.content) {
            //         wx.navigateTo({
            //           url: '/pages/finishPosting/finishPosting?seedIncreased=' + res.data.content.seedIncreased + '&postingStatus=' + that.data.postingStatus + '&id=' + res.data.content.id,
            //         })
            //         wx.setStorageSync('posting', 1)
            //         wx.removeStorageSync('goWaitReentry')
            //         wx.removeStorageSync('waitReentry')
            //       } else {
            //         wx.showToast({
            //           title: res.data.message,
            //           icon: 'none',
            //           duration: 1000
            //         })
            //       }
            //     })
            //   } else {
            //     app.Util.ajax('mall/forum/topic/addSaleTopic', data1, 'POST').then((res) => {
            //       if (res.data.content) {
            //         wx.navigateTo({
            //           url: '/pages/finishPosting/finishPosting?seedIncreased=' + res.data.content.seedIncreased + '&postingStatus=' + that.data.postingStatus + '&id=' + res.data.content.id,
            //         })
            //         wx.setStorageSync('posting', 1)
            //         wx.removeStorageSync('goWaitReentry')
            //         wx.removeStorageSync('waitReentry')
            //       } else {
            //         wx.showToast({
            //           title: res.data.message,
            //           icon: 'none',
            //           duration: 1000
            //         })
            //       }
            //     })
            //   }
            // } else {
            //   if (!waitReentry.transferId) {
            //     app.Util.ajax('mall/forum/topic/addSaleTopic', {
            //       orderId: that.data.waitReentry.orderId,
            //       orderGoodsId: that.data.waitReentry.orderGoodsId,
            //       expectAmount: that.data.expectAmount,
            //       cashBackAmount: that.data.waitReentry.cashBackAmount,
            //       perReturnAmount: that.data.waitReentry.perReturnAmount,
            //       maxReturnTime: waitReentry.maxReturnTime,
            //       periodLeft: that.data.waitReentry.periodLeft,
            //       code: that.data.waitReentry.code,
            //       lastReturnAmount:that.data.waitReentry.lastReturnAmount?that.data.waitReentry.lastReturnAmount:''
            //     }, 'POST').then((res) => {
            //       if (res.data.content) {
            //         wx.navigateTo({
            //           url: '/pages/finishPosting/finishPosting?seedIncreased=' + res.data.content.seedIncreased + '&postingStatus=' + that.data.postingStatus + '&id=' + res.data.content.id,
            //         })
            //         wx.setStorageSync('posting', 1)
            //         wx.removeStorageSync('goWaitReentry')
            //         wx.removeStorageSync('waitReentry')
            //       } else {
            //         wx.showToast({
            //           title: res.data.message,
            //           icon: 'none',
            //           duration: 1000
            //         })
            //       }
            //     })
            //   } else {
            //     app.Util.ajax('mall/forum/topic/addSaleTopic', {
            //       orderId: that.data.waitReentry.orderId,
            //       orderGoodsId: that.data.waitReentry.orderGoodsId,
            //       expectAmount: that.data.expectAmount,
            //       cashBackAmount: that.data.waitReentry.cashBackAmount,
            //       perReturnAmount: that.data.waitReentry.perReturnAmount,
            //       transferId: waitReentry.transferId,
            //       maxReturnTime: waitReentry.maxReturnTime,
            //       periodLeft: that.data.waitReentry.periodLeft,
            //       code: that.data.waitReentry.code,
            //       lastReturnAmount:that.data.waitReentry.lastReturnAmount?that.data.waitReentry.lastReturnAmount:''
            //     }, 'POST').then((res) => {
            //       if (res.data.content) {
            //         wx.navigateTo({
            //           url: '/pages/finishPosting/finishPosting?seedIncreased=' + res.data.content.seedIncreased + '&postingStatus=' + that.data.postingStatus + '&id=' + res.data.content.id,
            //         })
            //         wx.setStorageSync('posting', 1)
            //         wx.removeStorageSync('goWaitReentry')
            //         wx.removeStorageSync('waitReentry')
            //       } else {
            //         wx.showToast({
            //           title: res.data.message,
            //           icon: 'none',
            //           duration: 1000
            //         })
            //       }
            //     })
            //   }
            // }
          }
        }
      }
    }
    setTimeout(function() {
      newCount = true
    }, 1000)
  },
  payShure: function() {
    let that = this
    let waitReentry = wx.getStorageSync('waitReentry')
    let data = {
      content: that.data.saleText,
      orderId: that.data.waitReentry.orderId,
      orderGoodsId: that.data.waitReentry.orderGoodsId,
      expectAmount: that.data.expectAmount,
      cashBackAmount: that.data.waitReentry.cashBackAmount,
      perReturnAmount: that.data.waitReentry.perReturnAmount,
      transferId: waitReentry.transferId,
      maxReturnTime: waitReentry.maxReturnTime,
      periodLeft: that.data.waitReentry.periodLeft,
      code: that.data.waitReentry.code,
      lastReturnAmount: that.data.waitReentry.lastReturnAmount ? that.data.waitReentry.lastReturnAmount : ''
    }
    let data1 = {
      orderId: that.data.waitReentry.orderId,
      orderGoodsId: that.data.waitReentry.orderGoodsId,
      expectAmount: that.data.expectAmount,
      cashBackAmount: that.data.waitReentry.cashBackAmount,
      perReturnAmount: that.data.waitReentry.perReturnAmount,
      transferId: waitReentry.transferId,
      maxReturnTime: waitReentry.maxReturnTime,
      periodLeft: that.data.waitReentry.periodLeft,
      code: that.data.waitReentry.code,
      lastReturnAmount: that.data.waitReentry.lastReturnAmount ? that.data.waitReentry.lastReturnAmount : ''
    }
    if (that.data.saleText) {
      app.Util.ajax('mall/forum/topic/addSaleTopic', data, 'POST').then((res) => {
        if (res.data.content) {
          wx.navigateTo({
            url: '/pages/finishPosting/finishPosting?seedIncreased=' + res.data.content.seedIncreased + '&postingStatus=' + that.data.postingStatus + '&id=' + res.data.content.id,
          })
          wx.setStorageSync('posting', 1)
          wx.removeStorageSync('goWaitReentry')
          wx.removeStorageSync('waitReentry')
        } else {
          wx.showToast({
            title: res.data.message,
            icon: 'none'
          })
        }
      })
    } else {
      app.Util.ajax('mall/forum/topic/addSaleTopic',data1, 'POST').then((res) => {
        if (res.data.content) {
          wx.navigateTo({
            url: '/pages/finishPosting/finishPosting?seedIncreased=' + res.data.content.seedIncreased + '&postingStatus=' + that.data.postingStatus + '&id=' + res.data.content.id,
          })
          wx.setStorageSync('posting', 1)
          wx.removeStorageSync('goWaitReentry')
          wx.removeStorageSync('waitReentry')
        } else {
          wx.showToast({
            title: res.data.message,
            icon: 'none'
          })
        }
      })
    }
  },
  // 删除用户上传的图片评论
  deleteImg: function(e) {
    var that = this
    let dex = e.target.dataset.index
    that.data.goodsData.imgList.splice(dex, 1)
    that.data.goodsData.img_compress.splice(dex, 1)
    that.setData({
      goodsData: that.data.goodsData,
    })
  },

  //图片预览 
  imgYu: function(e) {
    var that = this
    var src = e.currentTarget.dataset.src;
    var imgList = that.data.goodsData.imgList;
    wx.previewImage({
      current: src,
      urls: imgList
    })
  },
  // 添加图片
  choiceImg: function() {
    var that = this
    wx.chooseImage({
      count: 9,
      sizeType: 'compressed',
      sourceType: ['album'],
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths
        var imgs = that.data.goodsData.imgList
        if ((imgs.length + tempFilePaths.length) > 9) {
          wx.showToast({
            title: '您最多可以上传9张图片',
            icon: 'none',
            duration: 1000
          })
          return;
        }
        that.data.goodsData.img_compress = []
        imgs = imgs.concat(tempFilePaths)
        var goodsData = that.data.goodsData
        goodsData.imgList = imgs
        that.setData({
          goodsData: goodsData
        })
        that.getCanvasImg(0, 0, imgs);
      }
    })
  },
  //压缩并获取图片，这里用了递归的方法来解决canvas的draw方法延时的问题
  getCanvasImg: function(index, failNum, tempFilePaths) {
    var that = this;
    if (index < tempFilePaths.length) {
      const ctx = wx.createCanvasContext('canvas');
      ctx.drawImage(tempFilePaths[index], 0, 0, 200, 200);
      ctx.draw(true, function() {
        index = index + 1; //上传成功的数量，上传成功则加1
        wx.canvasToTempFilePath({
          canvasId: 'canvas',
          success: function success(res) {
            wx.getFileSystemManager().readFile({
              filePath: res.tempFilePath,
              encoding: "base64",
              success: function(res) {
                that.data.goodsData.img_compress.push(res.data)
                that.getCanvasImg(index, failNum, tempFilePaths);
              }
            })
          },
          fail: function(e) {
            failNum += 1; //失败数量，可以用来提示用户
            that.getCanvasImg(inedx, failNum, tempFilePaths);
          }
        });
      });
    }
  },
  //卖帖跳转到待返合约
  jumpWaitReentry: function() {
    var that = this
    that.setData({
      expectAmount: '请输入售价',
      annualizedRate: null,
      saleText: null
    })
    wx.navigateTo({
      url: '/packageB/pages/waitReentryDetail/waitReentryDetail',
    })
    wx.setStorage({
      key: "goWaitReentry",
      data: "1"
    })
  },
  // 显示售价弹框
  showModal: function() {
    var that = this;
    that.setData({
      showModal: true,
      isdisabled: false
    })
  },
  //隐藏售价弹框
  hideModal: function() {
    var that = this;
    that.setData({
      showModal: false,
      inputValue: '',
      isdisabled: true
    });
  },
  onConfirm: function() {
    var that = this;
    var amount = Number(that.data.inputValue)
    var waitReentry = wx.getStorageSync('waitReentry')
    if (that.data.inputValue !== '') {
      if (amount > that.data.waitReentry.cashBackAmount) {
        that.setData({
          showMessage: '不能大于共返金额哦！',
          inputValue: ''
        })
      } else {
        that.setData({
          showModal: false,
          isdisabled: true,
          inputValue: '',
          expectAmount: that.data.inputValue
        })
        app.Util.ajax('mall/forum/topic/calcuateAnnualizedRate', {
          expectAmount: that.data.expectAmount,
          cashBackAmount: that.data.waitReentry.cashBackAmount,
          perReturnAmount: that.data.waitReentry.perReturnAmount,
          maxReturnTime: waitReentry.maxReturnTime,
          periodLeft: that.data.waitReentry.periodLeft,
        }, 'POST').then((res) => {
          if (res.data.content) {
            that.setData({
              annualizedRate: res.data.content
            })
          }
        })
      }
    } else {
      that.setData({
        showMessage: '请输入售价'
      })
    }
  },
  onCancel: function() {
    var that = this
    that.setData({
      showModal: false,
      inputValue: '',
      isdisabled: true
    });
  },
  //获取售价
  btnInput: function(e) {
    var that = this;
    var mesValue
    //正则验证，充值金额仅支持小数点前8位小数点后2位
    if (e.detail.value > 0) {
      if (/^\d{1,8}(\.\d{0,2})?$/.test(e.detail.value)) {
        mesValue = e.detail.value;
        that.setData({
          showMessage: ''
        })
      } else {
        mesValue = e.detail.value.substring(0, e.detail.value.length - 1);
        that.setData({
          showMessage: '售价仅支持小数点前8位,小数点后2位'
        })
      }
    } else {
      that.setData({
        showMessage: '请输入大于0的售价'
      })
    }
    that.setData({
      inputValue: mesValue
    })
  },
  cancle: function() {
    this.setData({
      seedToast: false,
      isdisabled: true
    })
  },
  toSeed: function() {
    wx.navigateTo({
      url: "/packageA/pages/seed/seed"
    })
    this.setData({
      seedToast: false,
      isdisabled: true
    })
  },
  toMentionPeriod: function() {
    wx.navigateTo({
      url: "/packageA/pages/mentionPeriod/mentionPeriod?status=1"
    })
  }
})