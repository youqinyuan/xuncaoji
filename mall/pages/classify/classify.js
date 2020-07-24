// pages/classify/classify.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: null,
    currentTab: 0,
    showText: '',
    showBtn:'查看全部',
    attr:1,
    navData: [], //导航栏
    hostUrl: app.Util.getUrlImg().hostUrl,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    //导航栏
    that.navigationBar()

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

  },
  //导航栏
  navigationBar: function() {
    var that = this
    app.Util.ajax('mall/home/categories', {
      isHome: 0
    }, 'GET').then((res) => {
      if (res.data.messageCode = 'MSG_1001') {
        res.data.content.categoryResponse.unshift({
          name: '品牌专区'
        })
        that.setData({
          navData: res.data.content.categoryResponse,
        })
        app.Util.ajax('mall/home/brand', {
          pageNumber: 1,
          pageSize: 100
        }, 'GET').then((res) => {
          if (res.data.messageCode = 'MSG_1001') {
            that.setData({
              brandList: res.data.content.items
            })
          }
        })
      }
    })
  },
  switchNav: function(e) {
    var that = this
    var cur = e.currentTarget.dataset.current; //导航栏数组的index
    var id = e.currentTarget.dataset.id; //导航栏数组的id 
    var name = e.currentTarget.dataset.name
    that.setData({
      id: id,
      currentTab: cur,
    })
    if (cur==0){
      app.Util.ajax('mall/home/brand', {
        pageNumber: 1,
        pageSize: 100
      }, 'GET').then((res) => {
        if (res.data.messageCode = 'MSG_1001') {
          that.setData({
            brandList: res.data.content.items
          })
        }
      })
    }else if (that.data.currentTab == cur) {
      app.Util.ajax('mall/home/categories', {
        parentId: id,
      }, 'GET').then((res) => {
        if (res.data.messageCode === 'MSG_1001') {
          let tempList = JSON.stringify(res.data.content.brandResponse)
          let tempList1 = JSON.parse(tempList)
          that.setData({
            showText: name,
            brand: res.data.content.brandResponse.length > 0 ? res.data.content.brandResponse.slice(0,6): [],
            tempList: tempList1,
            classfy: res.data.content.categoryResponse.length > 0 ? res.data.content.categoryResponse: []
          })
        }
      })
    }
  },
  watchAll(){
    let that = this
    that.data.attr++
    if (that.data.attr%2==0){
      that.setData({
        showBtn:'收起',
        brand: that.data.tempList,
      })
    }else{
      app.Util.ajax('mall/home/categories', {
        parentId: that.data.id,
      }, 'GET').then((res) => {
        if (res.data.messageCode === 'MSG_1001') {
          let tempList = JSON.stringify(res.data.content.brandResponse)
          let tempList1 = JSON.parse(tempList)
          that.setData({
            brand: res.data.content.brandResponse.length > 0 ? res.data.content.brandResponse.slice(0, 6) : [],
            tempList: tempList1,
            showBtn: '查看全部',
          })
        }
      })
    }
  },
  //跳转到二级列表页面
  twoList: function(e) {
    var id = e.currentTarget.dataset.id //当前点击的id 
    var name = e.currentTarget.dataset.name //当前点击的名字
    wx.navigateTo({
      url: `/pages/index/twolist/twolist?id=${id}&name=${name}`,
    })
  },
  // 跳转到品牌详情
  jumpBrand(e) {
    let id = e.currentTarget.dataset.id
    let type = e.currentTarget.dataset.type
    let name = e.currentTarget.dataset.name
    let posterimage = e.currentTarget.dataset.posterimage
    let iconurl = posterimage ? posterimage.split('?') : null
    let iconurl1 = iconurl ? iconurl[0] : null
    wx.setStorageSync('posterimage', iconurl1 ? iconurl[1] : null)
    wx.navigateTo({
      url: `/pages/oneList/oneList?id=${id}&type=${type}&name=${name}&iconurl=${iconurl1}`,
    })
  },
})