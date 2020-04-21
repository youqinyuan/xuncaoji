// packageA/pages/businessLicence/businessLicence.js
let app = getApp()
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
    businessLicenses:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    let temp1 = []
    let temp2 = []
    if(app.globalData.moveData.businessLicenseList){
      let temp = app.globalData.moveData.businessLicenseList
      for(let i of temp){
        let temp5 = {}
        console.log(i)
        temp5.url = i.imageKey
        temp1.push(i.imageUrl)
        temp2.push(temp5)
      }
    }
    that.data.goodsData['imgList'] = temp1
    that.data.goodsData['img_compress'] = []
    that.data.businessLicenses = temp2
    console.log(that.data.goodsData)
    that.setData({
      goodsData: that.data.goodsData
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
    that.data.businessLicenses.splice(dex, 1)
    console.log(that.data.businessLicenses)
    console.log("删除："+that.data.businessLicenses)
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
  choiceImg: function (){
    var that = this
    wx.chooseImage({
      count: 1,
      sizeType: 'compressed',
      sourceType: ['album'],
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths
        var imgs = that.data.goodsData.imgList
        if ((imgs.length + tempFilePaths.length) > 10) {
          wx.showToast({
            title: '您最多可以上传10张图片',
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
        that.upload(res.tempFilePaths)
      }
    })
  },
  upload: function(imgUrl){
    var that = this
    console.log(imgUrl)
    var token = wx.getStorageSync('token')
    wx.uploadFile({
      url: app.Util.getUrlImg().publicUrl+'mall/personal/uploadFile',
      filePath: imgUrl[0],
      name: 'file',
      header: {
        'token': token,
        "content-type": "multipart/form-data"
      },
      success: function(res) {
        let temp = {}
        temp.url = JSON.parse(res.data).content.key
        that.data.businessLicenses.push(temp)
        console.log(that.data.businessLicenses)
      },
      fail: function(res) {
       
      }
    })
  },
  save:function(){
    let that = this
    let storeEnterStatus = wx.getStorageSync("storeEnterStatus") //区别注册与修改
    if(storeEnterStatus==1){
      if(that.data.businessLicenses.length>0){
        let temp = app.globalData.moveData
        temp.source = 2    //小程序渠道
        temp.businessLicenses = JSON.stringify(that.data.businessLicenses)  //营业执照
        wx.setStorageSync('registerInfo',temp)
        console.log(app.globalData.moveData)
        app.Util.ajax('mall/merchant/update', temp, 'POST').then((res) => { // 使用ajax函数
          if (res.data.messageCode=="MSG_1001") {
            wx.navigateTo({
              url: '/packageA/pages/check/check?status=1'
            })
            wx.removeStorageSync("storeEnterStatus") 
          }else{
            wx.showToast({
              title:res.data.message,
              icon:'none'
            })
          }
        })
      }else{
        wx.showToast({
          title:'请上传营业执照',
          icon:'none'
        })
      }
    }else{
      if(that.data.businessLicenses.length>0){
        let temp = app.globalData.moveData
        temp.source = 2    //小程序渠道
        temp.businessLicenses = JSON.stringify(that.data.businessLicenses)  //营业执照
        wx.setStorageSync('registerInfo',temp)
        console.log(app.globalData.moveData)
        app.Util.ajax('mall/merchant/register', temp, 'POST').then((res) => { // 使用ajax函数
          if (res.data.messageCode=="MSG_1001") {
            wx.navigateTo({
              url: '/packageA/pages/check/check?status=1'
            })
            wx.removeStorageSync("storeEnterStatus") 
          }else{
            wx.showToast({
              title:res.data.message,
              icon:'none'
            })
          }
        })
      }else{
        wx.showToast({
          title:'请上传营业执照',
          icon:'none'
        })
      }
    }
  }
})