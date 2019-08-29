// pages/goodsComment/goodsComment.js
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgList: [], //上传的图片列表
    imgList_compress: [], //压缩后的图片列表
    commentNum: 5, //商品评分
    goodsComment: '', //商品评论内容
    goodsData: '', //商品详情
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    // 请求商品详情
    that.getData(options.orderid)
  },

  // 请求商品信息
  getData: function(orderId) {
    var that = this
    app.Util.ajax('mall/order/queryOrder', {
      orderId: orderId
    }, 'GET').then((res) => {
      console.log(res.data.content.orderGoodsDetail)
      if (res.data.messageCode == 'MSG_1001') {
        that.setData({
          goodsData: res.data.content.orderGoodsDetail
        })
      }
    })
  },

  //评分
  getScore: function(e) {
    var that = this
    let num = e.target.dataset.num
    that.setData({
      commentNum: num
    })
  },
  // 获取textarea输入内容
  getTextareaValue: function(e) {
    this.data.goodsComment = e.detail.value
  },
  // 添加图片
  choiceImg: function() {
    var that = this
    wx.chooseImage({
      count: 6,
      sizeType: 'compressed',
      sourceType: ['album'],
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths
        let imgs = that.data.imgList
        if (imgs.length + tempFilePaths.length > 6) {
          wx.showToast({
            title: '您最多可以上传6张图片',
            icon: 'none',
            duration: 1000
          })
          return;
        }
        that.data.imgList_compress = []
        imgs = imgs.concat(tempFilePaths)
        that.getCanvasImg(0, 0, imgs)
        that.setData({
          imgList: imgs
        })
        console.log(JSON.stringify(that.data.imgList))
      }
    })
  },
  // 删除用户上传的图片评论
  deleteImg: function(e) {
    var that = this
    let index = e.target.dataset.index
    let img = that.data.imgList
    img.splice(index, 1)
    var img_compress = that.data.imgList_compress
    img_compress.splice(index, 1)
    that.setData({
      imgList: img,
      imgList_compress: img_compress
    })
  },
  //图片预览 
  imgYu: function(e) {
    console.log(e)
    var src = e.currentTarget.dataset.src; //获取data-src
    var imgList = this.data.imgList; //获取data-list
    //图片预览
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: imgList // 需要预览的图片http链接列表
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
            that.data.imgList_compress.push(res.tempFilePath)
            that.getCanvasImg(index, failNum, tempFilePaths);
          },
          fail: function(e) {
            failNum += 1; //失败数量，可以用来提示用户
            that.getCanvasImg(inedx, failNum, tempFilePaths);
          }
        });
      });
    }
  },
  //发布
  submit: function() {
    var that = this
    let goodsComment = that.data.goodsComment
    var goodsData = that.data.goodsData[0]
    if (goodsComment == '') {
      wx.showToast({
        title: '请输入评论内容',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    let imgs = that.data.imgList_compress
    console.log(imgs)
    // for(let item in imgs){
    //   wx.getFileSystemManager().readFile({
    //     filePath: imgs[item],
    //     encoding: "base64",
    //     success: function (data) {
    //       console.log(data.data)
    //     },
    //   })
    // }
    // return;
    wx.getFileSystemManager().readFile({
      filePath: imgs[0],
      encoding: "base64",
      success: function (data) {
        console.log(data.data)//返回base64编码结果，但是图片的话没有data:image/png
        app.Util.ajax('mall/interact/addUserInteractGoods', {
          orderId: goodsData.orderId,
          action: 1,
          userInteractGoodsList: [{
            interactImageFiles: [{url:data.data}],
            score: that.data.commentNum,
            content: that.data.goodsComment,
            goodsId: goodsData.goodsId,
            orderDetailId: goodsData.id,
          }]
        }, 'POST').then((res) => {
          console.log(res)
          if (res.data.messageCode == 'MSG_1001') {
            wx.redirectTo({
              url: '/pages/goodsEvaluate/goodsEvaluate?goodsId=' + goodsData.goodsId,
            })
          } else {
            wx.showToast({
              title: '发布失败',
              icon: 'none',
              duration: 2000
            })
          }
        })
      }
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
  onShareAppMessage: function() {

  }
})