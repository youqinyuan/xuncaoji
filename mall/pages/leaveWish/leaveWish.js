// pages/leaveWish/leaveWish.js
let app = getApp()
var newCount = true //节流阀-限制购买提交次数
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hostUrl: app.Util.getUrlImg().hostUrl,
    goodsData: {},
    imgList: [], //上传的图片列表
    wishImg: '',
    imgList_compress: [], //压缩后的图片列表
    goodsComment: '', //商品评论内容
    index: '',
    showGet: false, //心愿池是什么  
    showText:true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    that.getData();
  },
  // FreeBuy心愿池是什么?
  showGetMark: function () {
    var that = this
    that.setData({
      showGet: true,
      showText:false,
    })
  },
  cancelGet: function () {
    var that = this
    that.setData({
      showGet: false,
      showText: true,
    })
  },
  //客服分享图片回到指定的小程序页面
  handleContact: function(e) {
    var path = e.detail.path,
      query = e.detail.query,
      params = '';
    if (path) {
      for (var key in query) {
        params = key + '=' + query[key] + '&';
      }
      params = params.slice(0, params.length - 1);
      wx.navigateTo({
        url: path + '?' + params
      })
    }
  },
  getData: function() {
    var that = this
    that.data.goodsData['imgList'] = []
    that.data.goodsData['img_compress'] = []
    that.data.goodsData['goodsComment'] = ''
    that.data.goodsData['contentDetail'] = ''
    that.setData({
      goodsData: that.data.goodsData
    })
  },
  //获取文本框的内容
  getTextareaValue: function(e) {
    var that = this
    that.data.goodsData.goodsComment = e.detail.value
    that.setData({
      goodsData: that.data.goodsData
    })
  },
  //获取细节的内容
  getContentDetail: function (e) {
    var that = this
    that.data.goodsData.contentDetail = e.detail.value
    that.setData({
      goodsData: that.data.goodsData
    })
  },
  //提交心愿
  submit: function() {
    var that = this
    if(newCount){
      newCount = false
      if (that.data.goodsData.goodsComment == '') {
        wx.showToast({
          title: '请填写内容后提交',
          icon: 'none',
          duration: 1000
        })
      } else {
        app.Util.ajax('mall/wishZone/encodedWish', {
          content: that.data.goodsData.goodsComment,
          contentDetail: that.data.goodsData.contentDetail,
          encodedImages: that.data.goodsData.img_compress,
        }, 'POST').then((res) => {
          if (res.data.messageCode == 'MSG_1001') {
            if (!wx.getStorageSync('jumpStatus')){
              var messages = '我们已收到您的心愿，我们会在两天内替您满足心愿，常回来看看哦'
              wx.navigateTo({
                url: '/pages/myWish/myWish?messages=' + messages,
              }) 
            }else{
              wx.navigateBack({})
              wx.setStorageSync('messages', '我们已收到您的心愿，我们会在两天内替您满足心愿，常回来看看哦')  
              wx.setStorageSync('pageNum',1)     
            }                
          } else {
            wx.showToast({
              title: res.data.message,
              icon: 'none',
              duration: 1000
            })
          }
        })
      }
    }
    setTimeout(function(){
      newCount=true
    },1000)
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
      count: 5,
      sizeType: 'compressed',
      sourceType: ['album'],
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths
        var imgs = that.data.goodsData.imgList
        if ((imgs.length + tempFilePaths.length) > 5) {
          wx.showToast({
            title: '您最多可以上传5张图片',
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
    if (index < tempFilePaths.length) {
      const ctx = wx.createCanvasContext('canvas');
      ctx.drawImage(tempFilePaths[index], 0, 0, 200, 200);
      ctx.draw(true, function () {
        index = index + 1; //上传成功的数量，上传成功则加1
        wx.canvasToTempFilePath({
          canvasId: 'canvas',
          success: function success(res) {
            wx.getFileSystemManager().readFile({
              filePath: res.tempFilePath,
              encoding: "base64",
              success: function (res) {
                // console.log(res.data)
                that.data.goodsData.img_compress.push(res.data)
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