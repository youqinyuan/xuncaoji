const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isShowSeed:false,
    getSeedMoney:false,
    seedMoney:0,
    oneShow: false,//一折购物
    showModalStatus1: false,//好友下单
    querySeedSwitch:null,
    system: '',
    animation: '',
    showBuy:false,
    show:false,
    show2:false,
    title1:"购物优惠",
    title2:"新品兑换",
    title3:"游戏特权",
    value1:"您可在寻草记商城享受全程购物优惠，使用您获取的种子进行现金抵扣。",
    value2:"使用种子在商城的新品专区内进行商品兑换全额兑换不花一分钱。",
    value3:"本特权即将上线，使用种子可在游戏中兑换各种特权。敬请期待哟。",
    canGetSeed:{},
    seedNumber:0,
    list:[],
    pageNumber:1,
    pageSize:10,
    seedTemp:0,
    count:true,
    hostUrl: app.Util.getUrlImg().hostUrl,
    haibao:false,
    path_img:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
    if(options.status){
      setTimeout(function(){
        that.setData({
          showBuy:true
        })
      },1000)
    }
    if (options.isSeed) {
      setTimeout(function () {
        that.setData({
          isShowSeed: true
        })
      }, 1000)
    }
    that.setData({
      system: wx.getSystemInfoSync()
    })
    that.seedInit()
    setTimeout(function() {
      let anmition = wx.createAnimation({
        duration: 1200,
        timingFunction: 'ease',
      })
      that.setData({
        animation: anmition
      })
      let arryList = new Array();
      for (let i = 0; i < that.data.seedTemp; i++) {
        var obj = {
          // num: Math.floor(Math.random() * 15 + 1) + 'C',
          num: that.data.canGetSeed[i].amount,
          title: i % 3 == 0 ? '' : i % 3 == 1 ? '' : i % 3 == 2 ? '' : '',
          anima: '',
          styleObject: '',
          seedId: that.data.canGetSeed[i].id,
          isShow: true,
          realItem: true
        }
        arryList.push(obj)
      }
      //随机左边距 上边距 动画延时
      let left_width, top_height, anm_time;
      for (let i = 0; i < arryList.length; i++) {
        left_width = Math.floor(Math.random() * 20 + 1);
        top_height = Math.floor(Math.random() * 15 + 5);
        anm_time = 0.3;
        // console.log('id:' + i + '左边距:' + left_width + ',上边距:' + top_height + ',动画时间:' + anm_time);
        arryList[i].top = top_height;
        arryList[i].styleObject = that.formatStyle({
          "left": left_width + 'px',
          "top": top_height + 'px',
          "animation": 'heart 1.3s ease-in-out ' + anm_time + 's infinite alternate'
        })
      }
      // 空数组
      var emptarry = new Array();
      for (var i = 0; i < 11 - arryList.length; i++) {
        emptarry.push({
          realItem: false
        })
      }
      that.setData({
        myList: that.randomArry(arryList.concat(emptarry))
      })
      const query = wx.createSelectorQuery()
      query.select('#my_collect').boundingClientRect()
      query.selectViewport().scrollOffset()
      query.exec(function(res) {
        that.setData({
          my_collect: res[0]
        })
      })
    }, 1000)
    //首单分享
    that.getShareData()
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
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    let that = this
    that.querySeedSwitch()
  },
  // 获取种子红包
  getSeedMoney(){
    let that = this
    app.Util.ajax('mall//integral/seed/drawRedEnvelope', null, 'POST').then((res) => {
      if (res.data.content) {
        console.log(res.data.content)
        that.setData({
          isShowSeed:false,
          getSeedMoney:true,
          seedMoney: res.data.content.seedCount
        })
      }else{
        wx.showToast({
          title: res.data.message,
          icon:'none'
        })
      }
    })
  },
  getSeedHidden(){
    let that = this
    that.setData({
      getSeedMoney:false
    })
  },
  //查询种子开关
  querySeedSwitch() {
    let that = this
    app.Util.ajax('mall/seed/querySeedSwitch', null, 'GET').then((res) => {
      if (res.data.content) {
        that.setData({
          querySeedSwitch: res.data.content
        })
      }
    })
  },
  //随机数组
  randomArry(arr) {
    var len = arr.length;
    for (var i = len - 1; i >= 0; i--) {
      var randomIndex = Math.floor(Math.random() * (i + 1));
      var itemIndex = arr[randomIndex];
      arr[randomIndex] = arr[i];
      arr[i] = itemIndex;
    }
    return arr;
  },
  /**
   * 格式化Style
   */
  formatStyle(position) {
    let styles = []
    for (let key in position) {
      styles.push(`${key}: ${position[key]};`)
    }
    return styles.join(' ')
  },
  //收集能量 
  bindTab(e) {
    let that = this;
    if(that.data.count){
      that.setData({
        count:false
      })
    // console.log("aa"+that.data.seedTemp)
    if(that.data.seedTemp==1){
      // console.log(1111111)
      app.Util.ajax('mall/seed/receiveSeed', {
        id: e.currentTarget.dataset.seedid
      }, 'POST').then((res) => {
        if (res.data.messageCode == "MSG_1001") {
          that.setData({
            seedNumber: that.data.seedNumber + e.currentTarget.dataset.num,
          })
        }
      })
      let myItm = that.data.myList[e.currentTarget.id];
      myItm.styleObject = myItm.styleObject.split("animation")[0];
      let itd = 'myList[' + e.currentTarget.id + '].styleObject';
      that.setData({
        [itd]: myItm.styleObject
      })
      setTimeout(function() {
        let dpi = that.data.system.screenWidth / 750; //计算像素密度
        //元素的位置
        let view_x = e.detail.x,
          view_y = e.detail.y + dpi * 116 / 2;
        let myCollect_x = that.data.my_collect.left + dpi * 130 / 2 + dpi * 260 / 2 * 0.5,
          myCollect_y = that.data.my_collect.right + that.data.myList[e.currentTarget.id].top - 70 + dpi * 116 / 2 + dpi * 113 * 0.5;
        var animation = wx.createAnimation({
          duration: 1200,
          timingFunction: 'ease',
        })

        that.animation = animation;
        animation.translate(0, 0).opacity(0).step();
        animation.translateX(0).step();
        animation.translateY(0).step();
        let anmi = 'myList[' + e.currentTarget.id + '].anima';
        that.setData({
          [anmi]: animation.export()
        })
          setTimeout(function () {
            that.setData({
              ['myList[' + e.currentTarget.id + '].isShow']: false,
              ['myList[' + e.currentTarget.id + '].realItem']: false
            })
          }, 500)
      }, 100)
      setTimeout(function() {
        that.setData({
          system: wx.getSystemInfoSync()
        })
        // console.log("aa" + that.data.system)
        that.seedInit()
        setTimeout(function() {
          let anmition = wx.createAnimation({
            duration: 1200,
            timingFunction: 'ease',
          })
          that.setData({
            animation: anmition
          })
          let arryList = new Array();
          // console.log(4444 + JSON.stringify(that.data.canGetSeed))
          // console.log(that.data.seedTemp)
          for (let i = 0; i < that.data.seedTemp; i++) {
            var obj = {
              // num: Math.floor(Math.random() * 15 + 1) + 'C',
              num: that.data.canGetSeed[i].amount,
              title: i % 3 == 0 ? '' : i % 3 == 1 ? '' : i % 3 == 2 ? '' : '',
              anima: '',
              styleObject: '',
              seedId: that.data.canGetSeed[i].id,
              isShow: true,
              realItem: true
            }
            arryList.push(obj)
          }
          //随机左边距 上边距 动画延时
          let left_width, top_height, anm_time;
          for (let i = 0; i < arryList.length; i++) {
            left_width = Math.floor(Math.random() * 20 + 1);
            top_height = Math.floor(Math.random() * 15 + 5);
            anm_time = (Math.random() * 1.1 + 0).toFixed(1);
            // console.log('id:' + i + '左边距:' + left_width + ',上边距:' + top_height + ',动画时间:' + anm_time);
            arryList[i].top = top_height;
            arryList[i].styleObject = that.formatStyle({
              "left": left_width + 'px',
              "top": top_height + 'px',
              "animation": 'heart 1.3s ease-in-out ' + anm_time + 's infinite alternate'
            })
          }
          // 空数组
          var emptarry = new Array();
          for (var i = 0; i < 11 - arryList.length; i++) {
            emptarry.push({
              realItem: false
            })
          }
          that.setData({
            myList: that.randomArry(arryList.concat(emptarry))
          })
          const query = wx.createSelectorQuery()
          query.select('#my_collect').boundingClientRect()
          query.selectViewport().scrollOffset()
          query.exec(function(res) {
            that.setData({
              my_collect: res[0]
            })
          })
        },200)
      }, 1100)
    } else {
      that.setData({
        seedTemp:that.data.seedTemp - 1
      })
      app.Util.ajax('mall/seed/receiveSeed', {
        id: e.currentTarget.dataset.seedid
      }, 'POST').then((res) => {
        if (res.data.messageCode == "MSG_1001") {
          that.setData({
            seedNumber:that.data.seedNumber + e.currentTarget.dataset.num
          })
        }
      })
      let myItm = that.data.myList[e.currentTarget.id];
      myItm.styleObject = myItm.styleObject.split("animation")[0];
      let itd = 'myList[' + e.currentTarget.id + '].styleObject';
      that.setData({
        [itd]: myItm.styleObject
      })
      setTimeout(function() {
        let dpi = that.data.system.screenWidth / 750; //计算像素密度
        //元素的位置
        let view_x = e.detail.x,
          view_y = e.detail.y + dpi * 116 / 2;
        let myCollect_x = that.data.my_collect.left + dpi * 130 / 2 + dpi * 260 / 2 * 0.5,
          myCollect_y = that.data.my_collect.right + that.data.myList[e.currentTarget.id].top - 70 + dpi * 116 / 2 + dpi * 113 * 0.5;
        var animation = wx.createAnimation({
          duration: 1200,
          timingFunction: 'ease',
        })

        that.animation = animation;
        animation.translate(0, 0).opacity(0).step();
        animation.translateX(0).step();
        animation.translateY(0).step();
        let anmi = 'myList[' + e.currentTarget.id + '].anima';
        // console.log(anmi)
        that.setData({
          [anmi]: animation.export()
        })
          setTimeout(function () {
            that.setData({
              ['myList[' + e.currentTarget.id + '].isShow']: false,
              ['myList[' + e.currentTarget.id + '].realItem']: false
            })
          }, 500)
      }, 100)
    }
    }
    setTimeout(function(){
      that.setData({
        count:true
      })
    },1500)
  },
  toSeedDetail: function() {
    wx.navigateTo({
      url: '/packageA/pages/seedDetail/seedDetail',
    })
  },
  show: function(e) {
    var temp = e.currentTarget.dataset.index
    if (temp == 1) {
      this.setData({
        title: this.data.title1,
        value: this.data.value1,
        show: true
      })
    } else if (temp == 2) {
      this.setData({
        title: this.data.title2,
        value: this.data.value2,
        show: true
      })
    } else {
      this.setData({
        title: this.data.title3,
        value: this.data.value3,
        show: true
      })
    }
  },
  show2: function() {
    this.setData({
      show2: true
    })
  },
  closeShow: function() {
    this.setData({
      show: false
    })
  },
  closeShow2: function() {
    this.setData({
      show2: false
    })
  },
  preventTouchMove: function() {},
  column: function (e) {
    let that = this
    let columnTemp = e.currentTarget.dataset.index
    if (wx.getStorageSync("token")) {
      if (columnTemp == 1) {
        wx.navigateTo({
          url: '/packageA/pages/seedMask/seedMask',
        })
      } else if (columnTemp == 2) {
        that.setData({
          showModalStatus1: true
        })
      } else if (columnTemp == 3) {
        return;
      } else if (columnTemp == 4) {
        that.setData({
          oneShow: true
        })
      } else if (columnTemp == 5) {
        wx.navigateTo({
          url: '/packageA/pages/mentionPeriodIndex/mentionPeriodIndex',
        })
      }
      else if (columnTemp == 6) {
        wx.showToast({
          title: "暂未开放哦，敬请期待",
          icon: "none"
        })
      }
    } else {
      wx.navigateTo({
        url: '/pages/invitationCode/invitationCode',
      })
    }
  },
  cancelShare() {
    let that = this
    that.setData({
      showModalStatus1: false
    })
  },
  cancelOneShow() {
    let that = this
    that.setData({
      oneShow: false
    })
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    var that = this
    that.getMore();
  },
  getMore: function() {
    var that = this
    var pageNumber = that.data.pageNumber + 1
    app.Util.ajax('mall/seed/queryGoodsBySeed', {
      pageNumber: pageNumber,
      pageSize: that.data.pageSize
    }, 'GET').then((res) => { // 使用ajax函数
      if (res.data.content) {
        if (res.data.content.items == '' && that.data.list !== '') {
          that.setData({
            bottom_tishi:'已到底，去【寻商品】提交吧'
          })
        }
        var arr = that.data.list
        for (var i = 0; i < res.data.content.items.length; i++) {
          arr.push(res.data.content.items[i])
        }
        that.setData({
          list: arr,
          pageNumber: pageNumber
        })
      }
    })
  },
  seedInit: function() {
    var that = this
    //种子数量
    app.Util.ajax('mall/personal/assets', null, 'GET').then((res) => {
      that.setData({
        seedNumber: res.data.content.seedAmount,
      })
    })
    //种子数量
    app.Util.ajax('mall/seed/queryUnFinishRecord', null, 'GET').then((res) => {
      // console.log(res.data.content)
      if (res.data.content.length > 10) {
        that.setData({
          seedTemp: 10
        })
      } else {
        that.setData({
          seedTemp: res.data.content.length
        })
      }
      that.setData({
        canGetSeed: res.data.content,
        totalSize: res.data.content.length
      })
    })
    app.Util.ajax('mall/seed/queryGoodsBySeed', {
      pageNumber: 1,
      pageSize: 10,
    }, 'GET').then((res) => {
      that.setData({
        list: res.data.content.items
      })
    })
  },
  toDetail: function(e) {
    wx.navigateTo({
      url: '/pages/detail/detail?id=' + e.currentTarget.dataset.id
    })
  },
  //种子兑换
  showDetail: function () {
    let that = this;
    that.setData({
      showBuy: true
    })
  },
  //隐藏提现模态框
  hide: function () {
    let that = this;
    that.setData({
      showBuy: false,
    });
  },
  seedRecharge:function(){
    wx.navigateTo({
      url: '/packageA/pages/seedRecharge/seedRecharge'
    })
  },
    // 获取分享数据
    getShareData: function () {
      var that = this
        app.Util.ajax('mall/weChat/sharing/target', {
          mode: 18
        }, 'GET').then((res) => {
          if (res.data.messageCode = 'MSG_1001') {
            that.data.shareData = res.data.content
            // 产品图片路径转换为本地路径
            var imageUrl = res.data.content.imageShareUrl
            if (imageUrl) {
              wx.getImageInfo({
                src: imageUrl,
                success(res) {
                  that.data.shareImg = res.path
                  that.data.path_img = res.path
                }
              })
            }
            //邀请码转换为本地路径
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