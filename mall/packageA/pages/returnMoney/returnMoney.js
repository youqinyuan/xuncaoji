// pages/returnMoney/returnMoney.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    index1: 2,
    index2: 1,
    goodsValue: '已经收到了货物',
    goodsValue1: '质量问题',
    goodsData: {},
    imgList: [], //上传的图片列表
    wishImg: '',
    imgList_compress: [], //压缩后的图片列表
    index: '',
    show1: false,
    show2: false,
    maxMoney: {},
    shuoMing:'',
    expMoney:null,
    hostUrl: app.Util.getUrlImg().hostUrl,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.data.goodsData['imgList'] = []
    that.data.goodsData['img_compress'] = []
    that.data.goodsData['goodsComment'] = ''
    var arr = wx.getStorageSync("goodsList")
    that.setData({
      goodsData: that.data.goodsData,
      goodsDetail: arr
    })
    that.init()
  },
  init: function () {
    var that = this
    app.Util.ajax('mall/orderRefund/getRefundQuota', {
      orderGoodsId: that.data.goodsDetail.id,
      cargoStatus: 2
    }, 'GET').then((res) => {
      that.setData({
        maxMoney: res.data.content
      })
    })
  },
  init2: function () {
    var that = this
    app.Util.ajax('mall/orderRefund/getRefundQuota', {
      orderGoodsId: that.data.goodsDetail.id,
      cargoStatus: 1
    }, 'GET').then((res) => {
      that.setData({
        maxMoney: res.data.content
      })
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  // 删除用户上传的图片评论
  deleteImg: function (e) {
    var that = this
    let dex = e.target.dataset.index
    that.data.goodsData.imgList.splice(dex, 1)
    that.data.goodsData.img_compress.splice(dex, 1)
    that.setData({
      goodsData: that.data.goodsData,
    })
  },

  //图片预览 
  imgYu: function (e) {
    var that = this
    var src = e.currentTarget.dataset.src;
    var imgList = that.data.goodsData.imgList;
    wx.previewImage({
      current: src,
      urls: imgList
    })
  },
  // 添加图片
  choiceImg: function () {
    var that = this
    wx.chooseImage({
      count: 3,
      sizeType: 'compressed',
      sourceType: ['album'],
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths
        var imgs = that.data.goodsData.imgList
        if ((imgs.length + tempFilePaths.length) > 3) {
          wx.showToast({
            title: '您最多可以上传3张图片',
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
  getCanvasImg: function (index, failNum, tempFilePaths) {
    var that = this;
    var tempList = {}
    if (index < tempFilePaths.length) {
      const ctx = wx.createCanvasContext('canvas');
      ctx.drawImage(tempFilePaths[index], 0, 0, 200, 200);
      ctx.draw(true, function () {
        // console.log(tempFilePaths)
        index = index + 1; //上传成功的数量，上传成功则加1
        wx.canvasToTempFilePath({
          canvasId: 'canvas',
          success: function success(res) {
            wx.getFileSystemManager().readFile({
              filePath: res.tempFilePath,
              encoding: "base64",
              success: function (res) {
                // console.log(res.data)
                tempList.key = index
                tempList.url = res.data
                that.data.goodsData.img_compress.push(tempList)
                that.getCanvasImg(index, failNum, tempFilePaths);
              }
            })
          },
          fail: function (e) {
            failNum += 1; //失败数量，可以用来提示用户
            that.getCanvasImg(inedx, failNum, tempFilePaths);
          }
        });
      });
    }
  },
  close1: function () {
    this.setData({
      show1: false
    })
  },
  close2: function () {
    this.setData({
      show2: false
    })
  },
  goodsStatus: function (e) {
    var that = this
    var temp = e.currentTarget.dataset.index
    if (temp == 1) {
      this.setData({
        show1: true
      })
    } else {
      this.setData({
        show2: true
      })
    }
  },
  goodsChoose: function (e) {
    var that = this
    // console.log(e.currentTarget.dataset.index)
    if (e.currentTarget.dataset.index == 1) {
      that.setData({
        index1: 2,
        goodsValue: '已经收到了货物',
        expMoney:null
      })
      that.init()
    } else {
      that.setData({
        index1: 1,
        goodsValue: '还没有收到货物',
        expMoney:null
      })
      that.init2()
    }
    setTimeout(function () {
      that.setData({
        show1: false
      })
    }, 300)
  },
  goodsChoose2: function (e) {
    var that = this
    // console.log(e.currentTarget.dataset.index)
    if (e.currentTarget.dataset.index == 1) {
      that.setData({
        index2: 1,
        goodsValue1: '质量问题'
      })
    } else if (e.currentTarget.dataset.index == 2) {
      that.setData({
        index2: 2,
        goodsValue1: '长时间未发货'
      })
    }
    else if (e.currentTarget.dataset.index == 3) {
      that.setData({
        index2: 3,
        goodsValue1: '我不想买了'
      })
    }
    else if (e.currentTarget.dataset.index == 4) {
      that.setData({
        index2: 4,
        goodsValue1: '商品损坏/空包'
      })
    }
    else {
      that.setData({
        index2: 5,
        goodsValue1: '其他原因'
      })
    }
    setTimeout(function () {
      that.setData({
        show2: false
      })
    }, 300)
  },
  toDealWith: function () {
    var that = this
    // console.log(that.data.goodsData.img_compress)
    // console.log(that.data.goodsDetail.id,)
    if(that.data.goodsData.img_compress.length>0){
      app.Util.ajax('mall/orderRefund/applyRefund', {
        orderGoodsId: that.data.goodsDetail.id,
        cargoStatus: that.data.index1,
        desc:that.data.goodsValue1,
        refundAmount:that.data.expMoney==null?that.data.maxMoney.refundQuota:that.data.expMoney,
        remark:that.data.shuoMing,
        imageFiles:that.data.goodsData.img_compress
      }, 'POST').then((res) => {
        if(res.data.messageCode=="MSG_1001"){
          wx.redirectTo({
            url: '/packageA/pages/dealWithReturn/dealWithReturn'
          })
        }else{
          wx.showToast({
            title:res.data.message,
            icon:"none"
          })
        }
      })
    }else{
      app.Util.ajax('mall/orderRefund/applyRefund', {
        orderGoodsId: that.data.goodsDetail.id,
        cargoStatus: that.data.index1,
        desc:that.data.goodsValue1,
        refundAmount:that.data.expMoney==null?that.data.maxMoney.refundQuota:that.data.expMoney,
        remark:that.data.shuoMing
      }, 'POST').then((res) => {
        if(res.data.messageCode=="MSG_1001"){
          wx.redirectTo({
            url: '/packageA/pages/dealWithReturn/dealWithReturn'
          })
        }else{
          wx.showToast({
            title:res.data.message,
            icon:"none"
          })
        }
      })
    }
    
  },
  getMoney: function (e) {
    var val = e.detail.value;
    this.setData({
      expMoney: val
    })
  },
  getShuoMing: function (e) {
    var val = e.detail.value;
    console.log(val)
    this.setData({
      shuoMing: val
    })
  }
})