// pages/classify/classify.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:null,
    currentTab: 0,
    text:'',
    firstId:null,
    navData: [], //导航栏
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
    app.Util.ajax('mall/home/categories', { isHome: 0 }, 'GET').then((res) => {
      if (res.data.messageCode = 'MSG_1001') {
        that.setData({
          navData: res.data.content,
          firstId: res.data.content[0].id
        })
        app.Util.ajax('mall/home/categories', {
          parentId: that.data.firstId
        }, 'GET').then((res) => {
          if (res.data.messageCode === 'MSG_1001') {
            if (res.data.content.length > 0) {
              that.setData({
                text: '',
                classfy: res.data.content
              })
            } else {
              that.setData({
                text: '暂无数据',
                classfy: []
              })
            }
          }
        })
      }
    })
  },
  switchNav: function(e) {
    var that = this    
    var cur = e.currentTarget.dataset.current; //导航栏数组的index
    var id = e.currentTarget.dataset.id; //导航栏数组的id  
    that.setData({
      id: id,
      currentTab:cur
    })
    if (that.data.currentTab == cur) {
      app.Util.ajax('mall/home/categories', {
        parentId: id
      }, 'GET').then((res) => {
        if (res.data.messageCode === 'MSG_1001') {
          if (res.data.content.length>0){
            that.setData({
              text: '',
              classfy: res.data.content
            })
          }else{
            that.setData({
              text: '暂无数据',
              classfy:[]
            })
          }         
        }
      })
    }
  },
  //跳转到二级列表页面
  twoList: function (e) {
    var id = e.currentTarget.dataset.id //当前点击的id 
    var name = e.currentTarget.dataset.name //当前点击的名字
    wx.navigateTo({
      url: `/pages/index/twolist/twolist?id=${id}&name=${name}`,
    })
  },
})