// packageA/pages/hero/hero.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shaixuan:false,
    shaixuanText:'收益排名',
    hostUrl: app.Util.getUrlImg().hostUrl,
    pageNumber:1,
    pageSize:20,
    status:1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.init()
  },
  init:function(){
    let that = this
    app.Util.ajax('mall/userHome/queryHeroList', {
      pageNumber:that.data.pageNumber,
      pageSize:that.data.pageSize,
      sortType:that.data.status
    }, 'GET').then((res) => { // 使用ajax函数
      if (res.data.messageCode=="MSG_1001"){
        let arr = res.data.content.list.items
        let temp = ''
        let tempList = []
        arr.forEach((v,i)=>{
          temp = (Number(v.profitAmount).toLocaleString('en-US')).toString()
          tempList = temp.split(".");
          if(tempList[1]){
            if(tempList[1].length==2){
              v.profitAmount = temp
            }else if(tempList[1].length==1){
              v.profitAmount = temp+'0'
            }
          }else{
            v.profitAmount = temp+'.00'
          }
          v.annualizedRate = (v.annualizedRate).toFixed(2)
        })
        that.setData({
          content:res.data.content,
          arr:arr
        })
      }else{
        wx.showToast({
          title:res.data.message,
          icon:'none'
        })
      }
    })
  },
  getInitDetail: function() {
    var that = this
    var pageNumber = that.data.pageNumber + 1
    app.Util.ajax('mall/userHome/queryHeroList', {
      pageNumber:pageNumber,
      pageSize:that.data.pageSize,
      sortType:that.data.status
    }, 'GET').then((res) => { // 使用ajax函数
      if (res.data.content) {
        if (res.data.content.list.items == '' && that.data.arr !== '') {
          wx.showToast({
            title:'已经到底啦',
            icon:'none'
          })
        }
        var arr = that.data.arr
        let temp = ''
        let tempList = []
        for (var i = 0; i < res.data.content.list.items.length; i++) {
          res.data.content.list.items[i].annualizedRate = (res.data.content.list.items[i].annualizedRate).toFixed(2)
          temp = (Number(res.data.content.list.items[i].profitAmount).toLocaleString('en-US')).toString()
          tempList = temp.split(".");
          if(tempList[1]){
            if(tempList[1].length==2){
              res.data.content.list.items[i].profitAmount = temp
            }else if(tempList[1].length==1){
              res.data.content.list.items[i].profitAmount = temp+'0'
            }
          }else{
            res.data.content.list.items[i].profitAmount = temp+'.00'
          }
          arr.push(res.data.content.list.items[i])
        }
        that.setData({
          arr: arr,
          pageNumber: pageNumber
        })
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
    this.getInitDetail()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  show:function(){
    let that = this
    if(that.data.shaixuan){
      that.setData({
        shaixuan:false
      })
    }else{
      that.setData({
        shaixuan:true
      })
    }
  },
  shaixuan:function(e){
    let that = this
    let index = e.currentTarget.dataset.index
    if(index==1){
      that.setData({
        shaixuanText:'年收益率排名',
        status:2,
        pageNumber:1
      })
    }else if(index==2){
      that.setData({
        shaixuanText:'收益排名',
        status:1,
        pageNumber:1
      })
    }
    setTimeout(function(){
      that.setData({
        shaixuan:false
      })
      that.init()
      wx.pageScrollTo({
        scrollTop: 0,
        duration: 100
      })
    },100)
  }
})