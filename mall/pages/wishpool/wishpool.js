// pages/wishpool/wishpool.js
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tempInfo:[],
    returnContent:[],
    returnContent2:[],
    waitReentry3:false,
    waitReentry:false,
    waitReentry2:false,
    showGet: false, //心愿池是什么  
    pageNumber: 1,
    pageSize: 20,
    recommend: [], //推荐商品
    returnCanclePeople:false,
    hostUrl: app.Util.getUrlImg().hostUrl,
  },
  // FreeBuy心愿池是什么?
  showGetMark: function() {
    var that = this
    that.setData({
      showGet: true
    })
  },
  cancelGet: function() {
    var that = this
    that.setData({
      showGet: false
    })
  },
  //跳到心愿池
  jumpMyWish:function(){
    var token = wx.getStorageSync('token')
    if (token) {
      wx.navigateTo({
        url: '/pages/myWish/myWish',
      })
    } else {
      wx.navigateTo({
        url: '/pages/invitationCode/invitationCode',
      })
    }
  },
  //跳转到留下心愿页面
  leaveWish: function() {
    var token = wx.getStorageSync('token')
    if (token) {
      wx.navigateTo({
        url: '/pages/leaveWish/leaveWish',
      })
    } else {
      wx.navigateTo({
        url: '/pages/invitationCode/invitationCode',
      })
    }
  },
  //推荐商品跳转到详情页
  jumpToDetail: function(e) {
    var that = this
    app.Util.ajax('mall/wishZone/public/wish/increase', {
      goodsId: e.currentTarget.dataset.id
    }, 'POST').then((res) => { // 使用ajax函数
      if (res.data.messageCode == "MSG_1001") {
        setTimeout(function () {
          that.data.recommend.forEach((v, i) => {
            if (v.id == e.currentTarget.dataset.id) {
              if (v.wishCount == '1000万') {
                return
              } else {
                v.wishCount += res.data.content.increasedCount
                that.setData({
                  recommend: that.data.recommend
                })
              }
            }
          }) 
        }, 500)        
        wx.navigateTo({
          url: `/pages/detail/detail?id=${e.currentTarget.dataset.id}`,
        })
      }
    })
  },
 
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    that.init();
  },
  init: function() {
    var that = this
    app.Util.ajax('mall/wishZone/public/recommendedGoods', {
      pageNumber: that.data.pageNumber,
      pageSize: that.data.pageSize
    }, 'GET').then((res) => { // 使用ajax函数
      if (res.data.messageCode == "MSG_1001") {
        res.data.content.forEach((v, i) => {
          v.wishCount = v.wishCount > 10000 ? (v.wishCount / 10000).toFixed(1) + '万' : v.wishCount
        })
        that.setData({
          recommend: res.data.content
        })
      }
    })
  },
  
  getMore: function() {
    var that = this
    var pageNumber = that.data.pageNumber + 1
    app.Util.ajax('mall/wishZone/public/recommendedGoods', {
      pageNumber: pageNumber,
      pageSize: that.data.pageSize
    }, 'GET').then((res) => {
      if (res.data.content) {
        if (res.data.content == '' && that.data.recommend !== '') {
          wx.showToast({
            title: '已经到底啦',
            icon:'none',
            duration:1000
          })
        }
        var arr = that.data.recommend
        for (var i = 0; i < res.data.content.length; i++) {
          res.data.content[i].wishCount = res.data.content[i].wishCount > 10000 ? res.data.content[i].wishCount / 10000 + '万' : res.data.content[i].wishCount
          arr.push(res.data.content[i])
        }
        that.setData({
          recommend: arr,
          pageNumber: pageNumber
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
    var that = this
    if(wx.getStorageSync("token")){
      that.returnInfo()
    }
    that.init();  
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
    var that = this
    that.setData({
      pageNumber: 1
    })
    that.init()
    setTimeout(function() {
      wx.stopPullDownRefresh() //停止下拉刷新
    }, 1000)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    var that = this
    that.getMore();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
   //转让弹窗
   waitReentryClose:function(){
    this.setData({
      waitReentry:false
    })
    this.returnInfo6()
  },
  waitReentryClose2:function(){
    this.setData({
      waitReentry2:false
    })
    this.returnInfo2()
  },
  waitReentryClose3:function(){
    this.setData({
      waitReentry3:false
    })
    wx.navigateTo({
      url:"/pages/waitReentryDetail/waitReentryDetail"
    })
  },
  //转让信息弹窗查询
  returnInfo: function () {
    var that = this
    app.Util.ajax('mall/transfer/gainNotice', null, 'GET').then((res) => {
      if (res.data.content.length > 0) {
        that.setData({
          tempInfo: res.data.content
        })
        for (let i of res.data.content) {
          if (i.type == 2) {
            //转让完成消息
            that.setData({
              waitReentry2: true,
              returnContent2: i.userItems
            })
          }
        }
        if (that.data.waitReentry2 == false) {
          for (let i of res.data.content) {
            if (i.type == 3) {
              //转让取消消息
              that.setData({
                waitReentry: true,
                returnContent: i.userItems
              })
            }
          }
        }
        if (that.data.waitReentry == false) {
          for (let i of res.data.content) {
            if (i.type == 4) {
              //撤销消息
              that.setData({
                returnCanclePeople: true,
                returnContent3: i.userItems
              })
            }
          }
        }
        if (that.data.returnCanclePeople == false) {
          for (let i of res.data.content) {
            if (i.type == 1) {
              //转让消息
              that.setData({
                waitReentry3: true,
              })
            }
          }
        }
      }
    })
  },
  returnInfo2:function(){
    var that = this
      if(that.data.tempInfo.length>0){
        for(let i of that.data.tempInfo){
          if(i.type==3){
            //转让取消消息
            that.setData({
            waitReentry:true,
            returnContent:i.userItems
          })
        }
      }
      if( that.data.waitReentry == false){
          for (let i of that.data.tempInfo) {
            if (i.type == 1) {
              //转让消息
              that.setData({
                waitReentry3: true,
              })
            }
          }
        }
      
    } 
  },
  returnInfo6: function() {
    var that = this
    if (that.data.tempInfo.length > 0) {
      for (let i of that.data.tempInfo) {
        if (i.type == 4) {
          //转让取消消息
          that.setData({
            waitReentry: true,
            returnContent3: i.userItems
          })
        }
      }
      if (that.data.waitReentry == false) {
        for (let i of that.data.tempInfo) {
          if (i.type == 1) {
            //转让消息
            that.setData({
              returnCanclePeople: true,
            })
          }
        }
      }

    }
  },
  returnInfo3:function(){
    var that = this
      if(that.data.tempInfo.length>0){
        for(let i of that.data.tempInfo){
          if(i.type==1){
          //转让消息
          that.setData({
            waitReentry3:true,
          })
        }
      }
    } 
  },
  returnCanclePeople:function(){
    var that = this 
    that.setData({
      returnCanclePeople:false
    })
    that.returnInfo3()
  }
})