// pages/forum/forum.js
var app = getApp()
var time = require('../../utils/util.js')
var newCount = true
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hostUrl: app.Util.getUrlImg().hostUrl,
    currentTab: 1,
    pageNumber: 1,
    pageNum: 1,
    mentionPeriodPageNum: 1,
    isRecommend: false,
    pageSize: 20,
    navData: [{
      type: 7,
      text: '关注'
    }, {
      type: 9,
      text: '全部'
    }, {
      type: 2,
      text: '返现交易'
    }, {
      type: 6,
      text: '商品交易'
    }, {
      type: 8,
      text: '提期'
    }, {
      type: 1,
      text: '普通帖'
    }],
    showClass: 1, //省钱/赚钱订单
    selectClass: 2, //订单交易
    type: 8,
    tempStatus: null,
    allPost: {}, //帖子列表
    allPost1: {}, //帖子列表
    emptyText: '', //空数据的时候
    showDel: false, //删除帖子弹框
    delId: null,
    showFollow: false, //取消关注弹窗
    followId: null,
    followIndex: null,
    showDel1: false, //删除帖子弹框（推荐）
    delId1: null,
    showFollow1: false, //取消关注弹窗
    followId1: null,
    followIndex1: null,
    messageNum: null,
    showClassify: false, //帖子类型弹框
    list: [
      {
        img: app.Util.getUrlImg().hostUrl + '/changeImg/ic_sale1.png',
        remark: '发布返现卖帖',
        status: 3
      },{
      img: app.Util.getUrlImg().hostUrl + '/changeImg/ic_buy1.png',
      remark: '发布返现买帖',
      status: 2
    }],
    list1: [{
      img: app.Util.getUrlImg().hostUrl + '/supplement/ic_save.png',
      remark: '发布预定商品',
      status: 2
    },{
      img: app.Util.getUrlImg().hostUrl + '/supplement/ic_earn.png',
      remark: '发布预售商品',
      status: 1
    }],
    list2: ['普通贴', '返现卖帖', '返现买帖', '预定商品', '预售商品'],
    weihu: false,
    showPassword: false,
    isFocus: false, //聚焦 
    Value: "", //输入的内容 
    show: false,
    Length: 6, //输入框个数 
    ispassword: true, //是否密文显示 true为密文， false为明文。
    sure_two_tishi: "",
    sureOne: false,
    sureTwo: false,
    waitReentry3: false,
    waitReentry: false,
    waitReentry2: false,
    returnCanclePeople: false,
    showDialog: false,
    typeStatus: null,
    siftLeft: false, //提期
    siftRight: false, //提期
    siftRightIndex: 1, //提期
    tabName: '发布时间新旧', //提期
    isShield: false, //提期
    sort: 1, //提期
    showModalStatus1: false, //提期分享
    host: app.Util.getUrlImg().host,
    isPublish: false, //变换按钮
    imgPublish: app.Util.getUrlImg().hostUrl + '/changeImg/btn_publish.png',
    attr: 1,
    haibao:false,
    path_img:'',
    popShow:false,
    floatShow:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  getMoney: function(e) {
    let that = this;
    that.setData({
      showClass: 1,
      type: 6
    })
    that.allPost()
  },
  saveMoney: function(e) {
    let that = this;
    that.setData({
      showClass: 2,
      type: 5
    })
    that.allPost()
  },
  yuOrder: function(e) {
    let that = this;
    that.setData({
      selectClass: 4,
      type: 4
    })
    that.ordinaryPost()
  },
  saleOrder: function(e) {
    let that = this;
    that.setData({
      selectClass: 3,
      type: 3
    })
    that.ordinaryPost()
  },
  buyOrder: function(e) {
    let that = this;
    that.setData({
      selectClass: 2,
      type: 2
    })
    that.ordinaryPost()
  },
  onLoad: function(options) {
    var that = this
    if(app.globalData.type!=0&&app.globalData.type!=4){
      if (app.globalData.type == 5) {
        that.setData({
          type: 8,
          currentTab: 4
        })
        that.mentionPeriodInit()
      }else if (app.globalData.type == 10) {
        that.setData({
          type: 9,
          currentTab: 1
        })
        that.allOrder()
      }else if (app.globalData.type == 6) {
        that.setData({
          type: 7,
          currentTab: 0
        })
        that.followPost()
      }else if (app.globalData.type == 7) {
        that.setData({
          type: 2,
          currentTab: 2
        })
        that.ordinaryPost()
      }else if (app.globalData.type == 8) {
        that.setData({
          type: 6,
          currentTab: 3
        })
        that.allPost()
      }else if (app.globalData.type == 9) {
        that.setData({
          type: 1,
          currentTab: 5
        })
        that.ordinaryPost()
      }
    }else{
      if (that.data.currentTab == 1) {
        that.allOrder()
      } else if (that.data.currentTab == 3) {
        that.allPost()
      } else if (that.data.currentTab == 2 || that.data.currentTab == 5) {
        that.ordinaryPost()
      } else if (that.data.currentTab == 0) {
        that.followPost()
      } else if (that.data.currentTab == 4) {
        that.mentionPeriodInit()
      }
    }
    // //新消息总数
    // if (wx.getStorageSync('token')) {
    //   that.getMessage();
    // }
  },
  mentionPeriodInit: function() {
    let that = this
    app.Util.ajax('mall/forum/topic/findPageList', {
      pageNumber: 1,
      pageSize: that.data.pageSize,
      type: 7,
      isShield: that.data.isShield,
      sort: that.data.sort
    }, 'GET').then((res) => {
      if (res.data.messageCode == 'MSG_1001') {
        that.setData({
          mentionPeriodContent: res.data.content.items
        })
      } else {
        wx.showToast({
          title: res.data.message,
          icon: 'none'
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
    if (wx.getStorageSync('recharge') || wx.getStorageSync('password')) {
      that.setData({
        sureOne: false,
        sureTwo: false,
      })
    }
    if (wx.getStorageSync('comment')) {
      if (that.data.currentTab == 3) {
        that.allPost(); //商品交易
      } else if (that.data.currentTab == 2 || that.data.currentTab == 5) {
        that.ordinaryPost()
      } else if (that.data.currentTab == 0) {
        that.followPost()
      }
      wx.removeStorageSync('comment')
    } else if (wx.getStorageSync('wait')) {
      if (that.data.currentTab == 3) {
        that.allPost(); //商品交易
      } else if (that.data.currentTab == 2 || that.data.currentTab == 5) {
        that.ordinaryPost()
      } else if (that.data.currentTab == 0) {
        that.followPost()
      }
      wx.removeStorageSync('wait')
    } else if (app.globalData.type == 2) {
      that.setData({
        type: 5,
        currentTab: 3,
        showClass: 2
      })
      that.allPost()
    } else if (app.globalData.type == 3) {
      that.setData({
        type: 6,
        currentTab: 3,
        showClass: 1
      })
      that.allPost()
    } else if (app.globalData.type == 4) {
      that.setData({
        type: 4,
        currentTab: 2,
        selectClass: 4
      })
      that.ordinaryPost()
    } else if (app.globalData.type == 5) {
      that.setData({
        type: 8,
        currentTab: 4
      })
      that.mentionPeriodInit()
    }else if (app.globalData.type == 10) {
      that.setData({
        type: 9,
        currentTab: 1
      })
      that.allOrder()
    }else if (app.globalData.type == 6) {
      that.setData({
        type: 7,
        currentTab: 0
      })
      that.followPost()
    }else if (app.globalData.type == 7) {
      that.setData({
        type: 2,
        currentTab: 2
      })
      that.ordinaryPost()
    }else if (app.globalData.type == 8) {
      that.setData({
        type: 6,
        currentTab: 3
      })
      that.allPost()
    }else if (app.globalData.type == 9) {
      that.setData({
        type: 1,
        currentTab: 5
      })
      that.ordinaryPost()
    } else {
      that.onPullDownRefresh()
    }
      //弹窗浮窗
      if (wx.getStorageSync('token')) {
        that.floatAndPop()
      }
          //新消息总数
    if (wx.getStorageSync('token')) {
      that.getMessage();
    }
  },
  floatAndPop:function(){
    var that = this
    app.Util.ajax('mall/floatingWindow/navigation/queryNavigation', {
      pageNumber:4 //订单交易
    }, 'GET').then((res) => {
      if (res.data.content) {
        let arr = res.data.content
        if(arr.length>0){
          for (let i = 0; i < arr.length; i++) {
            if (arr[i].navType == 1) {
              that.setData({
                popContent: arr[i],
                popShow: true
              })
            } else if (arr[i].navType == 2) {
              that.setData({
                floatContent: arr[i],
                floatShow: true
              })
            }
          }
        }else{
          that.setData({
            popShow: false,
            floatShow: false
          })
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    wx.removeStorageSync('posting')
    wx.removeStorageSync('recharge')
    wx.removeStorageSync('password')
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
      pageNumber: 1,
      pageNum: 1,
      mentionPeriodPageNum: 1
    })
    if (that.data.currentTab == 0) {
      that.followPost()
    } else if (that.data.currentTab == 1) {
      that.allOrder()
    } else if (that.data.currentTab == 3) {
      that.allPost()
    } else if (that.data.currentTab == 4) {
      that.mentionPeriodInit()
    } else {
      that.ordinaryPost()
    }
    wx.stopPullDownRefresh() //停止下拉刷新
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    var that = this
    if (that.data.currentTab == 0 && that.data.isRecommend == false) {
      that.getFollowPost()
    } else if (that.data.currentTab == 0 && that.data.isRecommend == true) {
      that.getRecommend()
    } else if (that.data.currentTab == 1) {
      that.getAllOrder()
    } else if (that.data.currentTab == 3) {
      that.getAllPost()
    } else if (that.data.currentTab == 4) {
      that.getMentionPeriodInit()
    } else {
      that.getOrdinary()
    }
  },
  getMentionPeriodInit: function() {
    var that = this
    var mentionPeriodPageNum = that.data.mentionPeriodPageNum + 1
    app.Util.ajax('mall/forum/topic/findPageList', {
      pageNumber: mentionPeriodPageNum,
      pageSize: that.data.pageSize,
      type: 7,
      isShield: that.data.isShield,
      sort: that.data.sort
    }, 'GET').then((res) => {
      if (res.data.content) {
        if (res.data.content.items == '' && that.data.mentionPeriodContent !== '') {
          wx.showToast({
            title: '已经到底啦',
            icon: 'none'
          })
        }
        var arr = that.data.mentionPeriodContent
        if (res.data.content.items.length > 0) {
          for (var i = 0; i < res.data.content.items.length; i++) {
            var arr1 = arr.concat(res.data.content.items)
            for (let i in arr1) {
              if (arr1[i].content) {
                arr1[i].content = arr1[i].content
              } else {
                arr1[i].content = ''
              }
              arr1[i].commentPageResponse.items = arr1[i].commentPageResponse.items.slice(0, 2)
              arr1[i].isShowAll = 2
              arr1[i].isText = ''
              arr1[i].ellipsis = true
              arr1[i].flag = 1
            }
          }
          that.setData({
            mentionPeriodContent: arr1,
            mentionPeriodPageNum: mentionPeriodPageNum
          })
        }
      }
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(res) {
    var that = this
    if (res.from == "button") {
      if (res.target.id === 'btn') {
        // 来自页面内转发按钮
        that.setData({
          showModalStatus1: false
        })
        wx.showTabBar()
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
          success: function(res) {

          },
          fail: function(res) {
            // 转发失败
            console.log("转发失败:" + JSON.stringify(res));
          }
        }
      } else if (res.target.id === 'btnGroup') {
        that.setData({
          showModalStatus1: false
        })
        wx.showTabBar()
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
  //新消息总数
  getMessage: function() {
    var that = this
    if (wx.getStorageSync('token')) {
      app.Util.ajax('mall/forum/comment/findMyRemindMsgCount', 'GET').then((res) => {
        if (res.data.messageCode == 'MSG_1001') {
          that.setData({
            messageNum: res.data.content
          })
        }
      })
    }
  },
  //图片预览 
  imgYu: function(e) {
    var that = this
    var index = e.currentTarget.dataset.index;
    var idx = e.currentTarget.dataset.idx;
    var imgArr = [];
    for (var i = 0; i < that.data.allPost[idx].attachmentList.length; i++) {
      imgArr.push(that.data.allPost[idx].attachmentList[i]["fileKey"]);
    }
    wx.previewImage({
      current: imgArr[index], //当前图片地址
      urls: imgArr
    })
  },
  //公共部分加载更多
  utilsData: function() {
    let that = this
    let pageNumber = that.data.pageNumber + 1
    let data = {
      pageNumber: pageNumber,
      pageSize: that.data.pageSize,
      type: that.data.type
    }
    app.Util.ajax('mall/forum/topic/findPageList', data, 'GET').then((res) => { // 使用ajax函数
      if (res.data.content) {
        if (res.data.content.items == '' && that.data.allPost !== '') {
          wx.showToast({
            title: '已经到底啦',
            icon: 'none'
          })
        }
        var arr = that.data.allPost
        if (res.data.content.items.length > 0) {
          for (var i = 0; i < res.data.content.items.length; i++) {
            var arr1 = arr.concat(res.data.content.items)
            for (let i in arr1) {
              if (arr1[i].content) {
                arr1[i].content = arr1[i].content
              } else {
                arr1[i].content = ''
              }
              arr1[i].commentPageResponse.items = arr1[i].commentPageResponse.items.slice(0, 2)
              arr1[i].isShowAll = 2
              arr1[i].isText = ''
              arr1[i].ellipsis = true
              arr1[i].flag = 1
            }
          }
          that.setData({
            allPost: arr1,
            pageNumber: pageNumber
          })
          if (that.data.allPost.length > 0) {
            //获取元素高度
            that.getHeight();
          }
        }
      } else {
        wx.showToast({
          title: res.data.message,
          icon: 'none'
        })
      }
    })
  },
  //全部
  allOrder() {
    var that = this
    let data = {
      pageNumber: that.data.pageNumber,
      pageSize: that.data.pageSize,
    }
    app.Util.ajax('mall/forum/topic/findPageList', data, 'GET').then((res) => {
      if (res.data.content) {
        var arr = []
        var arr1 = arr.concat(res.data.content.items)
        for (let i in arr1) {
          if (arr1[i].content) {
            arr1[i].content = arr1[i].content
          } else {
            arr1[i].content = ''
          }
          arr1[i].commentPageResponse.items = arr1[i].commentPageResponse.items.slice(0, 2)
          arr1[i].isShowAll = 2
          arr1[i].isText = ''
          arr1[i].ellipsis = true
          arr1[i].flag = 1
        }
        that.setData({
          allPost: arr1
        })

        if (that.data.allPost.length > 0) {
          that.getHeight();
        }
        //转让消息提示 
        //新消息总数
        if (wx.getStorageSync('token')) {
          that.getMessage();
          that.returnInfo()
        }
      } else {
        that.setData({
          weihu: true
        })
      }
    })
  },
  getAllOrder: function() {
    let that = this
    let pageNumber = that.data.pageNumber + 1
    let data = {
      pageNumber: pageNumber,
      pageSize: that.data.pageSize
    }
    app.Util.ajax('mall/forum/topic/findPageList', data, 'GET').then((res) => { // 使用ajax函数
      if (res.data.content) {
        if (res.data.content.items == '' && that.data.allPost !== '') {
          wx.showToast({
            title: '已经到底啦',
            icon: 'none'
          })
        }
        var arr = that.data.allPost
        if (res.data.content.items.length > 0) {
          for (var i = 0; i < res.data.content.items.length; i++) {
            var arr1 = arr.concat(res.data.content.items)
            for (let i in arr1) {
              if (arr1[i].content) {
                arr1[i].content = arr1[i].content
              } else {
                arr1[i].content = ''
              }
              arr1[i].commentPageResponse.items = arr1[i].commentPageResponse.items.slice(0, 2)
              arr1[i].isShowAll = 2
              arr1[i].isText = ''
              arr1[i].ellipsis = true
              arr1[i].flag = 1
            }
          }
          that.setData({
            allPost: arr1,
            pageNumber: pageNumber
          })
          if (that.data.allPost.length > 0) {
            //获取元素高度
            that.getHeight();
          }
        }
      } else {
        wx.showToast({
          title: res.data.message,
          icon: 'none'
        })
      }
    })
  },
  //省钱赚钱
  allPost: function() {
    var that = this
    let data = {
      pageNumber: that.data.pageNumber,
      pageSize: that.data.pageSize,
      type: that.data.type
    }
    app.Util.ajax('mall/forum/topic/findPageList', data, 'GET').then((res) => {
      if (res.data.content) {
        var arr = []
        var arr1 = arr.concat(res.data.content.items)
        for (let i in arr1) {
          if (arr1[i].content) {
            arr1[i].content = arr1[i].content
          } else {
            arr1[i].content = ''
          }
          arr1[i].commentPageResponse.items = arr1[i].commentPageResponse.items.slice(0, 2)
          arr1[i].isShowAll = 2
          arr1[i].isText = ''
          arr1[i].ellipsis = true
          arr1[i].flag = 1
        }
        that.setData({
          allPost: arr1
        })
      }
    })
  },
  getAllPost: function() {
    var that = this
    that.utilsData();
  },
  //关注
  followPost: function() {
    var that = this
    app.Util.ajax('mall/forum/topic/findAttentionPageList', {
      pageNumber: that.data.pageNumber,
      pageSize: that.data.pageSize,
    }, 'GET').then((res) => {
      if (res.data.content) {
        var arr = []
        var arr1 = arr.concat(res.data.content.items)
        for (let i in arr1) {
          if (arr1[i].content) {
            arr1[i].content = arr1[i].content
          } else {
            arr1[i].content = ''
          }
          arr1[i].commentPageResponse.items = arr1[i].commentPageResponse.items.slice(0, 2)
          arr1[i].isShowAll = 2
          arr1[i].isText = ''
          arr1[i].ellipsis = true
          arr1[i].flag = 1
        }
        that.setData({
          allPost: arr1
        })
        if (that.data.allPost.length < 20) {
          that.setData({
            isRecommend: true
          })
          that.recommend();
        }
        if (that.data.allPost.length > 0) {
          that.getHeight();
        }
      } else {
        wx.showToast({
          title: res.data.message,
          icon: 'none'
        })
      }
    })
  },
  getFollowPost: function() {
    var that = this
    var pageNumber = that.data.pageNumber + 1
    app.Util.ajax('mall/forum/topic/findAttentionPageList', {
      pageNumber: pageNumber,
      pageSize: that.data.pageSize,
    }, 'GET').then((res) => { // 使用ajax函数
      if (res.data.content) {
        if (res.data.content.items == '' && that.data.allPost !== '') {
          that.setData({
            isRecommend: true
          })
          that.recommend();
        }
        var arr = that.data.allPost
        if (res.data.content.items.length > 0) {
          for (var i = 0; i < res.data.content.items.length; i++) {
            var arr1 = arr.concat(res.data.content.items)
            for (let i in arr1) {
              if (arr1[i].content) {
                arr1[i].content = arr1[i].content
              } else {
                arr1[i].content = ''
              }
              arr1[i].commentPageResponse.items = arr1[i].commentPageResponse.items.slice(0, 2)
              arr1[i].isShowAll = 2
              arr1[i].isText = ''
              arr1[i].ellipsis = true
              arr1[i].flag = 1
            }
          }
          that.setData({
            allPost: arr1,
            pageNumber: pageNumber
          })
          if (that.data.allPost.length > 0) {
            that.getHeight();
          }
        }
      } else {
        wx.showToast({
          title: res.data.message,
          icon: 'none'
        })
      }
    })
  },
  //普通帖,卖帖，买帖,预售返现
  ordinaryPost: function() {
    var that = this
    app.Util.ajax('mall/forum/topic/findPageList', {
      pageNumber: that.data.pageNumber,
      pageSize: that.data.pageSize,
      type: that.data.type
    }, 'GET').then((res) => {
      if (res.data.content) {
        var arr = []
        var arr1 = arr.concat(res.data.content.items)
        for (let i in arr1) {
          if (arr1[i].content) {
            arr1[i].content = arr1[i].content
          } else {
            arr1[i].content = ''
          }
          arr1[i].commentPageResponse.items = arr1[i].commentPageResponse.items.slice(0, 2)
          arr1[i].isShowAll = 2
          arr1[i].isText = ''
          arr1[i].ellipsis = true
          arr1[i].flag = 1
        }
        that.setData({
          allPost: arr1
        })
        if (that.data.allPost.length > 0) {
          that.getHeight();
        }
      } else {
        wx.showToast({
          title: res.data.message,
          icon: 'none'
        })
      }
    })
  },
  getOrdinary: function() {
    var that = this
    that.utilsData();
  },
  //为您推荐
  recommend: function() {
    var that = this
    app.Util.ajax('mall/forum/topic/findRecommendList4Attention', {
      pageNumber: that.data.pageNum,
      pageSize: that.data.pageSize,
    }, 'GET').then((res) => {
      if (res.data.content) {
        var arr = []
        var arr1 = arr.concat(res.data.content.items)
        for (let i in arr1) {
          if (arr1[i].content) {
            arr1[i].content = arr1[i].content
          } else {
            arr1[i].content = ''
          }
          arr1[i].commentPageResponse.items = arr1[i].commentPageResponse.items.slice(0, 2)
          arr1[i].isShowAll = 2
          arr1[i].isText = ''
          arr1[i].ellipsis = true
          arr1[i].flag = 1
        }
        that.setData({
          allPost1: arr1
        })
        if (that.data.allPost1.length > 0) {
          that.getHeight1();
        }
      }
    })
  },
  getRecommend: function() {
    var that = this
    var pageNumber = that.data.pageNum + 1
    app.Util.ajax('mall/forum/topic/findRecommendList4Attention', {
      pageNumber: pageNumber,
      pageSize: that.data.pageSize,
    }, 'GET').then((res) => {
      if (res.data.content) {
        if (res.data.content.items == '' && that.data.allPost1 !== '') {
          wx.showToast({
            title: '已经到底啦',
            icon: 'none'
          })
        }
        var arr = that.data.allPost1
        if (res.data.content.items.length > 0) {
          for (var i = 0; i < res.data.content.items.length; i++) {
            var arr1 = arr.concat(res.data.content.items)
            for (let i in arr1) {
              if (arr1[i].content) {
                arr1[i].content = arr1[i].content
              } else {
                arr1[i].content = ''
              }
              arr1[i].commentPageResponse.items = arr1[i].commentPageResponse.items.slice(0, 2)
              arr1[i].isShowAll = 2
              arr1[i].isText = ''
              arr1[i].ellipsis = true
              arr1[i].flag = 1
            }
          }
          that.setData({
            allPost1: arr1,
            pageNum: pageNumber
          })
          if (that.data.allPost1.length > 0) {
            that.getHeight1();
          }
        }
      }
    })
  },
  //顶部导航切换
  switchNav: function(e) {
    var that = this
    var cur = e.currentTarget.dataset.index; //导航栏数组的index
    var type = e.currentTarget.dataset.type
    that.setData({
      type: type,
      pageNumber: 1,
      pageNum: 1,
      mentionPeriodPageNum: 1,
      allPost: {},
      emptyText: '',
      currentTab: cur
    })
    if (type == 1 || type == 2) {
      that.setData({
        isRecommend: false,
        isPublish: false,
        imgPublish: app.Util.getUrlImg().hostUrl + '/changeImg/btn_publish.png',
        selectClass: 2,
      })
      that.ordinaryPost()
    } else if (type == 7) {
      that.setData({
        isRecommend: true,
        isPublish: false,
        attr: 1,
        imgPublish: app.Util.getUrlImg().hostUrl + '/changeImg/btn_publish.png',
      })
      that.followPost()
    } else if (type == 6) {
      that.setData({
        isRecommend: false,
        isPublish: false,
        attr: 1,
        imgPublish: app.Util.getUrlImg().hostUrl + '/changeImg/btn_publish.png',
        showClass: 1
      })
      that.allPost()
    } else if (type == 8) {
      that.setData({
        isRecommend: false,
        isPublish: false,
        attr: 1,
        imgPublish: app.Util.getUrlImg().hostUrl + '/changeImg/btn_publish.png',
      })
      that.mentionPeriodInit()
    } else if (type == 9) {
      that.setData({
        isRecommend: false,
      })
      that.allOrder()
    }
  },
  getHeight: function() {
    var that = this;
    setTimeout(() => {
      wx.createSelectorQuery().selectAll('.content-item').boundingClientRect(function(rect) {
        for (var i = 0; i < that.data.allPost.length; i++) {
          var viewHeight = wx.getSystemInfoSync().windowWidth
          if (viewHeight > 375 && viewHeight <= 414) {
            if (rect[i].height > 96) {
              that.data.allPost[i].ellipsis = false
              that.data.allPost[i].isShowAll = 2
              that.data.allPost[i].isText = '全部'
            } else {
              that.data.allPost[i].ellipsis = true
              that.data.allPost[i].isShowAll = 1
              that.data.allPost[i].isText = ''
            }
          } else if (viewHeight <= 375) {
            if (rect[i].height > 88) {
              that.data.allPost[i].ellipsis = false
              that.data.allPost[i].isShowAll = 2
              that.data.allPost[i].isText = '全部'
            } else {
              that.data.allPost[i].ellipsis = true
              that.data.allPost[i].isShowAll = 1
              that.data.allPost[i].isText = ''
            }
          }
        }
        that.setData({
          allPost: that.data.allPost
        })
      }).exec();
    }, 300)
  },
  //收起/展开按钮点击事件
  ellipsis: function(e) {
    var that = this
    for (var i = 0; i < that.data.allPost.length; i++) {
      if (i == e.currentTarget.dataset.index) {
        that.data.allPost[e.currentTarget.dataset.index].flag = that.data.allPost[e.currentTarget.dataset.index].flag + 1
      }
      if (that.data.allPost[e.currentTarget.dataset.index].flag % 2 === 0) {
        that.data.allPost[e.currentTarget.dataset.index].isText = ''
        that.data.allPost[e.currentTarget.dataset.index].ellipsis = true
      }
    }
    that.setData({
      allPost: that.data.allPost,
    })
  },
  //收藏帖子
  collectImg: function(e) {
    var that = this
    if (wx.getStorageSync('token')) {
      app.Util.ajax('mall/forum/topic/favorite', {
        id: e.currentTarget.dataset.id
      }, 'POST').then((res) => {
        if (res.data.content) {
          if (that.data.allPost[e.currentTarget.dataset.index].isFavoriate == 2) {
            that.data.allPost[e.currentTarget.dataset.index].isFavoriate = 1
          } else if (that.data.allPost[e.currentTarget.dataset.index].isFavoriate == 1) {
            that.data.allPost[e.currentTarget.dataset.index].isFavoriate = 2
          }
          that.setData({
            allPost: that.data.allPost
          })
          wx.showToast({
            title: '收藏成功',
            icon: 'none'
          })
        } else {
          wx.showToast({
            title: res.data.message,
            icon: 'none'
          })
        }
      })
    } else {
      wx.navigateTo({
        url: '/pages/invitationCode/invitationCode',
      })
    }
  },
  ativeCollectImg: function(e) {
    var that = this
    app.Util.ajax('mall/forum/topic/favorite', {
      id: e.currentTarget.dataset.id
    }, 'POST').then((res) => {
      if (res.data.content) {
        if (that.data.allPost[e.currentTarget.dataset.index].isFavoriate == 2) {
          that.data.allPost[e.currentTarget.dataset.index].isFavoriate = 1
        } else if (that.data.allPost[e.currentTarget.dataset.index].isFavoriate == 1) {
          that.data.allPost[e.currentTarget.dataset.index].isFavoriate = 2
        }
        that.setData({
          allPost: that.data.allPost
        })
        wx.showToast({
          title: '取消收藏',
          icon: 'none'
        })
      } else {
        wx.showToast({
          title: res.data.message,
          icon: 'none'
        })
      }
    })
  },
  //删除帖子弹框
  delContent: function(e) {
    var that = this
    that.setData({
      showDel: true,
      delId: e.currentTarget.dataset.id
    })
  },
  cancelDel: function() {
    var that = this
    that.setData({
      showDel: false
    })
  },
  confirmDel: function() {
    var that = this
    app.Util.ajax('mall/forum/topic/remove', {
      id: that.data.delId
    }, 'POST').then((res) => {
      if (res.data.content) {
        wx.showToast({
          title: '删除成功',
          icon: 'none'
        })
        setTimeout(function() {
          that.setData({
            pageNumber: 1
          })
          if (that.data.type == 1 || that.data.type == 2 || that.data.type == 3 || that.data.type == 4) {
            that.ordinaryPost()
          } else if (that.data.type == 6) {
            that.followPost()
          } else if (that.data.type == 8) {
            that.allOrder()
          } else {
            that.allPost()
          }
        }, 1000)
        that.setData({
          showDel: false
        })
      } else {
        wx.showToast({
          title: res.data.message,
          icon: 'none'
        })
      }
    })
  },
  //关注
  notFollow: function(e) {
    var that = this
    if (wx.getStorageSync('token')) {
      app.Util.ajax('mall/forum/topic/attention?', {
        id: e.currentTarget.dataset.id
      }, 'POST').then((res) => {
        if (res.data.content) {
          if (that.data.allPost[e.currentTarget.dataset.index].isAttention == 2) {
            that.data.allPost[e.currentTarget.dataset.index].isAttention = 1
          } else if (that.data.allPost[e.currentTarget.dataset.index].isAttention == 1) {
            that.data.allPost[e.currentTarget.dataset.index].isAttention = 2
          }
          that.setData({
            allPost: that.data.allPost
          })
          wx.showToast({
            title: '关注成功',
            icon: 'none'
          })
        } else {
          wx.showToast({
            title: res.data.message,
            icon: 'none'
          })
        }
      })
    } else {
      wx.navigateTo({
        url: '/pages/invitationCode/invitationCode',
      })
    }
  },
  //取消关注
  follow: function(e) {
    var that = this
    that.setData({
      showFollow: true,
      followId: e.currentTarget.dataset.id,
      followIndex: e.currentTarget.dataset.index
    })
  },
  cancelFollow: function() {
    var that = this
    that.setData({
      showFollow: false
    })
  },
  confirmFollow: function() {
    var that = this
    app.Util.ajax('mall/forum/topic/attention', {
      id: that.data.followId
    }, 'POST').then((res) => {
      if (res.data.content) {
        if (that.data.allPost[that.data.followIndex].isAttention == 2) {
          that.data.allPost[that.data.followIndex].isAttention = 1
        } else if (that.data.allPost[that.data.followIndex].isAttention == 1) {
          that.data.allPost[that.data.followIndex].isAttention = 2
        }
        that.setData({
          allPost: that.data.allPost,
          showFollow: false
        })
        wx.showToast({
          title: '取消关注',
          icon: 'none'
        })
      } else {
        wx.showToast({
          title: res.data.message,
          icon: 'none'
        })
      }
    })
  },
  //帖子类型弹框
  publish: function() {
    var that = this
    var token = wx.getStorageSync('token')
    if (token) {
      //普通帖
      if (that.data.currentTab == 5) {
        wx.navigateTo({
          url: '/pages/posting/posting?status=' + 1,
        })
      } else if (that.data.currentTab == 4) { //提期
        wx.navigateTo({
          url: '/packageA/pages/mentionPeriod/mentionPeriod'
        })
      } else if (that.data.currentTab == 1) {
        that.data.attr++;
        if (that.data.attr % 2 == 0) {
          that.setData({
            isPublish: true,
            imgPublish: '/assets/images/icon/btn_publish.png'
          })
        } else {
          that.setData({
            isPublish: false,
            imgPublish: app.Util.getUrlImg().hostUrl + '/changeImg/btn_publish.png'
          })
        }
      } else {
        that.setData({
          showClassify: true
        })
      }
    } else {
      wx.navigateTo({
        url: '/pages/invitationCode/invitationCode',
      })
    }
  },
  //全部发帖
  getPublish(e) {
    let that = this
    var token = wx.getStorageSync('token')
    if (token) {
      let tempAtrr = e.currentTarget.dataset.index
      that.setData({
        isPublish: false,
        attr: 1,
        imgPublish: app.Util.getUrlImg().hostUrl + '/changeImg/btn_publish.png'
      })
      if (tempAtrr == 0) {
        wx.navigateTo({
          url: '/pages/posting/posting?status=' + 1,
        })
      } else if (tempAtrr == 1) {
        wx.navigateTo({
          url: '/pages/posting/posting?status=' + 3,
        })
      } else if (tempAtrr == 2) {
        wx.navigateTo({
          url: '/pages/posting/posting?status=' + 2,
        })
      } else if (tempAtrr == 3) {
        wx.navigateTo({
          url: '/packageA/pages/searchOrder/searchOrder?status=' + 2,
        })
      } else if (tempAtrr == 4) {
        wx.navigateTo({
          url: '/packageA/pages/searchOrder/searchOrder?status=' + 1,
        })
      }
    } else {
      wx.navigateTo({
        url: '/pages/invitationCode/invitationCode',
      })
    }
  },
  jumpPosting: function(e) {
    let that = this
    wx.navigateTo({
      url: '/pages/posting/posting?status=' + e.currentTarget.dataset.status,
    })
    that.setData({
      showClassify: false
    })
  },
  postingMoney(e) {
    let that = this
    wx.navigateTo({
      url: '/packageA/pages/searchOrder/searchOrder?status=' + e.currentTarget.dataset.status,
    })
    that.setData({
      showClassify: false
    })
  },
  cancelClassify: function() {
    var that = this
    that.setData({
      showClassify: false
    })
  },
  //点击评论跳转到帖子详情
  jumpForumDetail: function(e) {
    var token = wx.getStorageSync('token')
    if (token) {
      wx.navigateTo({
        url: '/pages/forumDetail/forumDetail?id=' + e.currentTarget.dataset.id,
      })
      wx.setStorageSync('comment', 1)
    } else {
      wx.navigateTo({
        url: '/pages/invitationCode/invitationCode',
      })
    }
  },
  jumpComment: function(e) {
    var token = wx.getStorageSync('token')
    if (token) {
      wx.navigateTo({
        url: '/pages/forumDetail/forumDetail?tempStatus=' + 1 + '&id=' + e.currentTarget.dataset.id,
      })
      wx.setStorageSync('comment', 1)
    } else {
      wx.navigateTo({
        url: '/pages/invitationCode/invitationCode',
      })
    }
  },
  //跳转到新消息
  jumpMessage: function() {
    wx.navigateTo({
      url: '/pages/newMessage/newMessage',
    })
  },



  getHeight1: function() {
    var that = this;
    setTimeout(() => {
      wx.createSelectorQuery().selectAll('.content-item1').boundingClientRect(function(rect) {
        for (var i = 0; i < that.data.allPost1.length; i++) {
          var viewHeight = wx.getSystemInfoSync().windowWidth
          if (viewHeight > 375 && viewHeight <= 414) {
            if (rect[i].height > 96) {
              that.data.allPost1[i].ellipsis = false
              that.data.allPost1[i].isShowAll = 2
              that.data.allPost1[i].isText = '全部'
            } else {
              that.data.allPost1[i].ellipsis = true
              that.data.allPost1[i].isShowAll = 1
              that.data.allPost1[i].isText = ''
            }
          } else if (viewHeight <= 375) {
            if (rect[i].height > 88) {
              that.data.allPost1[i].ellipsis = false
              that.data.allPost1[i].isShowAll = 2
              that.data.allPost1[i].isText = '全部'
            } else {
              that.data.allPost1[i].ellipsis = true
              that.data.allPost1[i].isShowAll = 1
              that.data.allPost1[i].isText = ''
            }
          }
        }
        that.setData({
          allPost1: that.data.allPost1
        })
      }).exec();
    }, 300)
  },
  //收起/展开按钮点击事件
  ellipsis1: function(e) {
    var that = this
    for (var i = 0; i < that.data.allPost1.length; i++) {
      if (i == e.currentTarget.dataset.index) {
        that.data.allPost1[e.currentTarget.dataset.index].flag = that.data.allPost1[e.currentTarget.dataset.index].flag + 1
      }
      if (that.data.allPost1[e.currentTarget.dataset.index].flag % 2 === 0) {
        that.data.allPost1[e.currentTarget.dataset.index].isText = ''
        that.data.allPost1[e.currentTarget.dataset.index].ellipsis = true
      }
    }
    that.setData({
      allPost1: that.data.allPost1,
    })
  },
  //收藏帖子
  collectImg1: function(e) {
    var that = this
    if (wx.getStorageSync('token')) {
      app.Util.ajax('mall/forum/topic/favorite', {
        id: e.currentTarget.dataset.id
      }, 'POST').then((res) => {
        if (res.data.content) {
          console.log(that.data.allPost1[e.currentTarget.dataset.index])
          if (that.data.allPost1[e.currentTarget.dataset.index].isFavoriate == 2) {
            that.data.allPost1[e.currentTarget.dataset.index].isFavoriate = 1
          } else if (that.data.allPost1[e.currentTarget.dataset.index].isFavoriate == 1) {
            that.data.allPost1[e.currentTarget.dataset.index].isFavoriate = 2
          }
          that.setData({
            allPost1: that.data.allPost1
          })
          wx.showToast({
            title: '收藏成功',
            icon: 'none'
          })
        } else {
          wx.showToast({
            title: res.data.message,
            icon: 'none'
          })
        }
      })
    } else {
      wx.navigateTo({
        url: '/pages/invitationCode/invitationCode',
      })
    }
  },
  ativeCollectImg1: function(e) {
    var that = this
    app.Util.ajax('mall/forum/topic/favorite', {
      id: e.currentTarget.dataset.id
    }, 'POST').then((res) => {
      if (res.data.content) {
        console.log(that.data.allPost1[e.currentTarget.dataset.index])
        if (that.data.allPost1[e.currentTarget.dataset.index].isFavoriate == 2) {
          that.data.allPost1[e.currentTarget.dataset.index].isFavoriate = 1
        } else if (that.data.allPost1[e.currentTarget.dataset.index].isFavoriate == 1) {
          that.data.allPost1[e.currentTarget.dataset.index].isFavoriate = 2
        }
        that.setData({
          allPost1: that.data.allPost1
        })
        wx.showToast({
          title: '取消收藏',
          icon: 'none'
        })
      } else {
        wx.showToast({
          title: res.data.message,
          icon: 'none'
        })
      }
    })
  },
  //删除帖子弹框
  delContent1: function(e) {
    var that = this
    that.setData({
      showDel1: true,
      delId1: e.currentTarget.dataset.id
    })
  },
  cancelDel1: function() {
    var that = this
    that.setData({
      showDel1: false
    })
  },
  confirmDel1: function() {
    var that = this
    app.Util.ajax('mall/forum/topic/remove', {
      id: that.data.delId1
    }, 'POST').then((res) => {
      if (res.data.content) {
        wx.showToast({
          title: '删除成功',
          icon: 'none'
        })
        setTimeout(function() {
          that.setData({
            pageNumber: 1,
            pageNum: 1
          })
          that.followPost();
        }, 2000) //延迟时间 这里是2秒
        that.setData({
          showDel1: false
        })
      } else {
        wx.showToast({
          title: res.data.message,
          icon: 'none'
        })
      }
    })
  },
  //关注
  notFollow1: function(e) {
    var that = this
    if (wx.getStorageSync('token')) {
      app.Util.ajax('mall/forum/topic/attention?', {
        id: e.currentTarget.dataset.id
      }, 'POST').then((res) => {
        if (res.data.content) {
          if (that.data.allPost1[e.currentTarget.dataset.index].isAttention == 2) {
            that.data.allPost1[e.currentTarget.dataset.index].isAttention = 1
          } else if (that.data.allPost1[e.currentTarget.dataset.index].isAttention == 1) {
            that.data.allPost1[e.currentTarget.dataset.index].isAttention = 2
          }
          that.setData({
            allPost1: that.data.allPost1
          })
          that.setData({
            showDel1: false
          })
          wx.showToast({
            title: '关注成功',
            icon: 'none'
          })
        } else {
          wx.showToast({
            title: res.data.message,
            icon: 'none'
          })
        }
      })
    } else {
      wx.navigateTo({
        url: '/pages/invitationCode/invitationCode',
      })
    }
  },
  //取消关注
  follow1: function(e) {
    var that = this
    that.setData({
      showFollow1: true,
      followId1: e.currentTarget.dataset.id,
      followIndex1: e.currentTarget.dataset.index
    })
  },
  cancelFollow1: function() {
    var that = this
    that.setData({
      showFollow1: false
    })
  },
  confirmFollow1: function() {
    var that = this
    app.Util.ajax('mall/forum/topic/attention', {
      id: that.data.followId1
    }, 'POST').then((res) => {
      if (res.data.content) {
        if (that.data.allPost1[that.data.followIndex1].isAttention == 2) {
          that.data.allPost1[that.data.followIndex1].isAttention = 1
        } else if (that.data.allPost1[that.data.followIndex1].isAttention == 1) {
          that.data.allPost1[that.data.followIndex1].isAttention = 2
        }
        that.setData({
          allPost1: that.data.allPost1,
          showFollow1: false
        })
        wx.showToast({
          title: '取消关注',
          icon: 'none'
        })
      } else {
        wx.showToast({
          title: res.data.message,
          icon: 'none'
        })
      }
    })
  },
  //立即预订
  subscribe: function(e) {
    var that = this
    if (wx.getStorageSync('token')) {
      var id = e.currentTarget.dataset.id
      var typeStatus = e.currentTarget.dataset.type
      console.log(id)
      that.setData({
        topicId: id,
        typeStatus: typeStatus,
      })
      //开启密码输入
      app.Util.ajax('mall/account/paymentPassword/status', 'GET').then((res) => { // 使用ajax函数
        if (res.data.messageCode == 'MSG_1001') {
          if (res.data.content == 2) {
            //未设置密码
            that.setData({
              showPassword: true
            })
          } else {
            //已设置密码
            that.setData({
              show: true,
              isFocus: true
            })
          }
        }
      })
    } else {
      wx.navigateTo({
        url: '/pages/invitationCode/invitationCode',
      })
    }
  },
  //交易确认
  sure: function(e) {
    var that = this
    if (wx.getStorageSync('token')) {
      var avatarKey = e.currentTarget.dataset.avatarkey
      var nickname = e.currentTarget.dataset.nickname
      var cashBackAmount = e.currentTarget.dataset.cashbackamount
      var periodLeft = e.currentTarget.dataset.periodleft
      var expectAmount = e.currentTarget.dataset.expectamount
      var mobileNumber = e.currentTarget.dataset.mobilenumber
      var canRemove = e.currentTarget.dataset.canremove
      var id = e.currentTarget.dataset.id
      var returnType = e.currentTarget.dataset.returntype
      var typeStatus = e.currentTarget.dataset.type
      that.setData({
        avatarKey: avatarKey,
        nickname: nickname,
        mobileNumber: mobileNumber,
        cashBackAmount: cashBackAmount,
        periodLeft: periodLeft,
        expectAmount: expectAmount,
        topicId: id,
        returnType: returnType,
        sureOne: true,
        typeStatus: typeStatus
      })
    } else {
      wx.navigateTo({
        url: '/pages/invitationCode/invitationCode',
      })
    }
  },
  //第一次确认关闭右上角的按钮
  // sureOneClose: function() {
  //   var that = this
  //   that.setData({
  //     sureOne: false
  //   })
  // },
  //第二次确认关闭右上角的按钮
  // sureTwoClose: function() {
  //   var that = this
  //   that.setData({
  //     sureTwo: false,
  //     sure_two_tishi: ""
  //   })
  // },
  //取消交易确认弹窗
  cancle_one: function() {
    var that = this
    that.setData({
      sureOne: false,
      sureTwo_cancle: false
    })
  },
  //确定交易确认弹窗
  sure_one: function() {
    var that = this
    //账户资产数据
    app.Util.ajax('mall/forum/topic/saleTopicTradeCheck', {
      topicId: that.data.topicId
    }, 'POST').then((res) => {
      if (res.data.messageCode == 'MSG_1001') {
        that.setData({
          sureOne: false,
          sureTwo: true,
          sure_two_tishi: "",
          btnText: '确认'
        })
      } else if (res.data.messageCode == 'MSG_4002') {
        that.setData({
          sureOne: false,
          sureTwo: true,
          sure_two_tishi: "提示：账户余额不足，请先充值。",
          btnText: '去充值'
        })
      } else {
        that.setData({
          sureOne: false,
          sureTwo: true,
          sure_two_tishi: res.data.message,
          btnText: '确认'
        })
      }
    })
  },
  //取消确认交易弹窗
  cancle_two: function() {
    var that = this
    that.setData({
      sureTwo: false,
      sure_two_tishi: "",
      sureOne: false
    })
  },
  //确定确认交易弹窗
  sure_two: function() {
    var that = this
    if (that.data.btnText == '去充值') {
      wx.navigateTo({
        url: '/pages/mine/recharge/recharge?tempStatus=' + 1,
      })
    } else if (that.data.btnText == '确认' && that.data.sure_two_tishi == '') {
      //开启密码输入
      app.Util.ajax('mall/account/paymentPassword/status', 'GET').then((res) => { // 使用ajax函数
        if (res.data.messageCode == 'MSG_1001') {
          if (res.data.content == 2) {
            //未设置密码
            that.setData({
              showPassword: true
            })
          } else {
            //已设置密码
            that.setData({
              show: true,
              isFocus: true
            })
          }
        }
      })
    }
  },
  //取消支付密码弹框
  cancelShow: function() {
    var that = this;
    that.setData({
      show: false,
      Value: ''
    })
  },
  //获取密码框的值
  Focus(e) {
    var that = this;
    var inputValue = e.detail.value;
    that.setData({
      Value: inputValue
    })
    if (that.data.Value.length === 6) {
      if (newCount == true) {
        newCount = false
        if (that.data.typeStatus == 4) {
          app.Util.ajax('mall/forum/topic/advanceOrderSchedule', {
            topicId: that.data.topicId,
            paymentPassword: e.detail.value
          }, 'POST').then((res) => {
            if (res.data.messageCode == 'MSG_1001') {
              wx.navigateTo({
                url: '/packageB/pages/waitReentryDetail/waitReentryDetail',
              })
              that.setData({
                show: false,
                Value: ''
              })
              wx.setStorageSync('wait', 1)
            } else if (res.data.messageCode == 'MSG_4002') {
              that.setData({
                showDialog: true
              })
            } else {
              wx.showToast({
                title: res.data.message,
                icon: 'none'
              })
              that.setData({
                Value: ""
              })
            }
          })
        } else {
          app.Util.ajax('mall/forum/topic/saleTopicTrade', {
            topicId: that.data.topicId,
            paymentPassword: e.detail.value
          }, 'POST').then((res) => {
            if (res.data.messageCode == 'MSG_1001') {
              wx.showToast({
                title: '交易已完成，请在待返明细中查看',
                icon: 'none'
              })
              setTimeout(function() {
                that.setData({
                  pageNumber: 1
                })
                if (that.data.type == 1 || that.data.type == 2 || that.data.type == 3 || that.data.type == 4) {
                  that.ordinaryPost()
                } else if (that.data.type == 6) {
                  that.followPost()
                } else if (that.data.type == 8) {
                  that.allOrder()
                } else {
                  that.allPost()
                }
              }, 1000) //延迟时间 这里是2秒
              that.setData({
                show: false,
                sureTwo: false,
                Value: ''
              })
            } else {
              wx.showToast({
                title: res.data.message,
                icon: 'none'
              })
              that.setData({
                Value: ""
              })
            }
          })
        }

      }
      setTimeout(function() {
        newCount = true
      }, 1000)
    }
  },
  //充值余额返回
  back: function() {
    var that = this;
    that.setData({
      showDialog: false
    })
  },
  //去充值余额
  continuePay: function() {
    var that = this;
    wx.navigateTo({
      url: '/pages/mine/recharge/recharge?tempStatus=' + 1,
    })
    that.setData({
      showDialog: false
    })
  },
  blur: function(e) {
    var that = this;
    that.setData({
      bottom: 0
    })
  },
  hideModal: function() {
    var that = this
    that.setData({
      show: false,
      isFocus: false,
      Value: ''
    })
  },
  Tap() {
    var that = this;
    that.setData({
      isFocus: true,
    })
  },
  // 是否设置支付密码弹框点击取消
  cancel: function() {
    var that = this
    that.setData({
      showPassword: false
    })
  },
  // 是否设置支付密码弹框点击确定
  sureSet: function() {
    var that = this
    that.setData({
      showPassword: false
    })
    wx.navigateTo({
      url: '/pages/paypassword/paypassword',
    })
  },
  //转让弹窗
  waitReentryClose: function() {
    this.setData({
      waitReentry: false
    })
    this.returnInfo6()
  },
  waitReentryClose2: function() {
    this.setData({
      waitReentry2: false
    })
    this.returnInfo2()
  },
  waitReentryClose3: function() {
    this.setData({
      waitReentry3: false
    })
    wx.navigateTo({
      url: "/packageB/pages/waitReentryDetail/waitReentryDetail"
    })
  },
  //转让信息弹窗查询
  returnInfo: function() {
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
  returnInfo2: function() {
    var that = this
    if (that.data.tempInfo.length > 0) {
      for (let i of that.data.tempInfo) {
        if (i.type == 3) {
          //转让取消消息
          that.setData({
            waitReentry: true,
            returnContent: i.userItems
          })
        }
      }
      if (that.data.waitReentry == false) {
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
  returnInfo3: function() {
    var that = this
    if (that.data.tempInfo.length > 0) {
      for (let i of that.data.tempInfo) {
        if (i.type == 1) {
          //转让消息
          that.setData({
            waitReentry3: true,
          })
        }
      }
    }
  },
  returnCanclePeople: function() {
    var that = this
    that.setData({
      returnCanclePeople: false
    })
    that.returnInfo3()
  },

  //购买赚钱
  earnMoney(e) {
    if (wx.getStorageSync('token')) {
      let id = e.currentTarget.dataset.id
      let specitemids = e.currentTarget.dataset.specitemids
      let topicid = e.currentTarget.dataset.topicid
      let quantity = e.currentTarget.dataset.quantity
      let stockid = e.currentTarget.dataset.stockid
      let source = 1
      wx.navigateTo({
        url: `/pages/detail/detail?id=${id}&specitemids=${specitemids}&topicid=${topicid}&source=${source}&quantity=${quantity}&stockid=${stockid}`,
      })
    } else {
      wx.navigateTo({
        url: '/pages/invitationCode/invitationCode',
      })
    }
  },
  //购买省钱
  buySaveMoney(e) {
    if (wx.getStorageSync('token')) {
      let img = e.currentTarget.dataset.item.goodsImageUrl
      let iconurl = img ? img.split('?') : null
      let iconurl1 = iconurl ? iconurl[0] : null
      e.currentTarget.dataset.item.goodsImageUrl = iconurl1
      e.currentTarget.dataset.item.avatarKey = null
      e.currentTarget.dataset.item.commentPageResponse = null
      wx.setStorageSync('goodsImageUrl', iconurl1 ? iconurl[1] : null)
      let goods = JSON.stringify(e.currentTarget.dataset.item)
      wx.navigateTo({
        url: '/pages/placeorder/placeorder?goods=' + goods,
      })
    } else {
      wx.navigateTo({
        url: '/pages/invitationCode/invitationCode',
      })
    }
  },
  //跳转到商品详情页
  toDetail(e) {
    wx.navigateTo({
      url: '/pages/detail/detail?id=' + e.currentTarget.dataset.id,
    })
  },
  //提期
  selectSiftLeft: function() {
    var that = this
    if (that.data.siftLeft) {
      console.log("不筛选")
      that.setData({
        siftLeft: false,
        isShield: false
      })
    } else {
      console.log("筛选")
      that.setData({
        siftLeft: true,
        isShield: true
      })
    }
    setTimeout(function() {
      that.mentionPeriodInit()
    }, 300)
  },
  selectSiftShow: function() {
    var that = this
    if (that.data.siftRight) {
      console.log("隐藏")
      that.setData({
        siftRight: false
      })
    } else {
      console.log("显示")
      that.setData({
        siftRight: true
      })
    }
  },
  selectSiftRight: function(e) {
    var that = this
    var index = e.currentTarget.dataset.index
    if (index == 1) {
      that.setData({
        siftRightIndex: index,
        sort: index
      })
    } else {
      that.setData({
        siftRightIndex: index,
        sort: index
      })
    }
    setTimeout(function() {
      that.setData({
        siftRight: false
      })
      that.mentionPeriodInit()
    }, 300)
  },
  toRule: function() {
    wx.navigateTo({
      url: '/packageA/pages/mentionPeriodRule/mentionPeriodRule'
    })
  },
  toMySet: function() {
    let token = wx.getStorageSync('token')
    let that = this
    if (token) {
      wx.navigateTo({
        url: '/packageA/pages/buyMentionPeriod/buyMentionPeriod'
      })
    } else {
      wx.navigateTo({
        url: "/pages/invitationCode/invitationCode"
      })
    }
  },
  toMyBuy: function() {
    let token = wx.getStorageSync('token')
    if (token) {
      wx.navigateTo({
        url: '/packageA/pages/setMentionPeriod/setMentionPeriod'
      })
    } else {
      wx.navigateTo({
        url: "/pages/invitationCode/invitationCode"
      })
    }
  },
  setMentionPeriod: function() {
    wx.navigateTo({
      url: '/packageA/pages/mentionPeriod/mentionPeriod'
    })
  },
  toHelp: function(e) {
    let token = wx.getStorageSync('token')
    let that = this
    if (token) {
      //此缓存解决从待返提期完成后的页面跳转问题，清除是为了确保此时无缓存
      let id = e.currentTarget.dataset.id
      app.globalData.helpMentionPeriod = 1
      wx.navigateTo({
        url: '/packageA/pages/helpMentionPeriod/helpMentionPeriod?id=' + id
      })
    } else {
      wx.navigateTo({
        url: "/pages/invitationCode/invitationCode?"
      })
    }
  },
  shares: function(e) {
    var that = this
    let id = e.currentTarget.dataset.id
    that.setData({
      showModalStatus1: true
    })
    that.share(id)
    wx.hideTabBar()
  },
  // 取消分享
  cancelShare: function() {
    var that = this
    that.setData({
      showModalStatus1: false
    })
    wx.showTabBar()
  },
  share: function(id) {
    let that = this
    app.Util.ajax('mall/weChat/sharing/target', {
      mode: 16,
      targetId: id
    }, 'GET').then((res) => {
      if (res.data.messageCode == "MSG_1001") {
        that.data.shareData = res.data.content
        var inviterCode = wx.getStorageSync('inviterCode')
        if (inviterCode) {
          res.data.content.link = res.data.content.link.replace(/{inviterCode}/g, inviterCode)
        } else {
          res.data.content.link = res.data.content.link.replace(/{inviterCode}/g, '')
        }
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
        // 产品图片路径转换为本地路径
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
  //隐藏底部分享对话框
  hide: function() {
    var that = this
    that.setData({
      showModalStatus1: false,
    })
  },
  // 增加曝光
  addAppear(e) {
    wx.navigateTo({
      url: '/packageA/pages/addAppear/addAppear?topicid=' + e.currentTarget.dataset.id,
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
    console.log(that.data.appletQrCodeUrl)
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
      wx.showTabBar()
      that.setData({
        haibao: false
      })
    },
    closePop:function(){
      let that = this
      app.Util.ajax('mall/floatingWindow/navigation/userClick', {
        type:1, //关闭
        id:that.data.popContent.id
      }, 'POST').then((res) => {
        if (res.data.messageCode=="MSG_1001") {
          that.setData({
            popShow:false
          })
        }
      })
    },
    closeFloat:function(){
      let that = this
      app.Util.ajax('mall/floatingWindow/navigation/userClick', {
        type:1, //关闭
        id:that.data.floatContent.id
      }, 'POST').then((res) => {
        if (res.data.messageCode=="MSG_1001") {
          that.setData({
            floatShow:false
          })
        }
      })
    },
    toPages:function(e){
      let that = this
      let tempContent = e.currentTarget.dataset.navtype==1?that.data.popContent:that.data.floatContent
      let navtype = e.currentTarget.dataset.navtype
      app.Util.ajax('mall/floatingWindow/navigation/userClick', {
        type:2, //跳转
        id:tempContent.id
      }, 'POST').then((res) => {
        if (res.data.messageCode=="MSG_1001") {
          if(navtype==1){
            that.setData({
              popShow:false
            })
          }else{
            that.setData({
              floatShow:false
            })
          }
        }
      })
      if (tempContent.category == 1) {
        if (tempContent.param == 1) {
          wx.navigateTo({
            url: '/packageA/pages/xuncaoji/xuncaoji',
          })
        } else if (tempContent.param == 2) {
          wx.navigateTo({
            url: '/pages/commission/commission',
          })
        } else if (tempContent.param == 3) {
          wx.navigateTo({
            url: '/packageB/pages/waitReentryDetail/waitReentryDetail',
          })
        } else if (tempContent.param == 4) {
          wx.navigateTo({
            url: '/pages/mine/personal/personal',
          })
        } else if (tempContent.param == 5) {
          wx.setStorageSync('params', 1)
          wx.navigateTo({
            url: '/pages/myorder/myorder?status=' + 0,
          })
        } else if (tempContent.param == 6) {
          wx.navigateTo({
            url: '/packageA/pages/myteam/myteam',
          })
        } else if (tempContent.param == 7) {
          wx.navigateTo({
            url: '/pages/index/cart/cart',
          })
        } else if (tempContent.param == 8) {
  
        } else if (tempContent.param == 9) {
          wx.navigateTo({
            url: '/pages/diamondPartner/diamondPartner',
          })
        } else if (tempContent.param == 10) {
          wx.navigateTo({
            url: '/packageA/pages/seed/seed',
          })
        } else if (tempContent.param == 11) {
          wx.navigateTo({
            url: '/packageB/pages/zeroBuy/zeroBuy?type=' + 2,
          })
        } else if (tempContent.param == 12) {
          wx.navigateTo({
            url: '/packageB/pages/zeroBuy/zeroBuy?type=' + 1,
          })
        } else if (tempContent.param == 13) {
          wx.navigateTo({
            url: '/packageB/pages/zeroBuy/zeroBuy?type=' + 4,
          })
        } else if (tempContent.param == 14) {
          wx.navigateTo({
            url: '/packageB/pages/freeBuy/freeBuy',
          })
        } else if (tempContent.param == 15) {
          wx.switchTab({
            url: '/pages/wishpool/wishpool',
          })
        } else if (tempContent.param == 16) {
          wx.navigateTo({
            url: '/pages/cityPartner/cityPartner',
          })
        } else if (tempContent.param == 17) {
          wx.navigateTo({
            url: '/pages/byStages/byStages',
          })
        } else if (tempContent.param == 18) {
          wx.navigateTo({
            url: '/pages/sponsor/sponsor',
          })
        } else if (tempContent.param == 19) {
          wx.navigateTo({
            url: '/packageA/pages/mentionPeriodIndex/mentionPeriodIndex',
          })
        } else if (tempContent.param == 20) {
          wx.navigateTo({
            url: '/packageA/pages/allStore/allStore',
          })
        } else if (tempContent.param == 21) {
          wx.navigateTo({
            url: '/packageA/pages/guidePage/guidePage',
          })
        } else if (tempContent.param == 22) {
          let token = wx.getStorageSync('token')
          if (token) {
            wx.navigateTo({
              url: '/packageA/pages/hero/hero',
            })
          } else {
            wx.navigateTo({
              url: "/pages/invitationCode/invitationCode"
            })
          }
        } else if (tempContent.param == 23) {
          wx.navigateTo({
            url: '/packageA/pages/profitDetail/profitDetail',
          })
        } else if (tempContent.param == 24) {
          wx.switchTab({
            url: '/pages/index/index',
          })
        } else if (tempContent.param == 25) {
          wx.navigateTo({
            url: '/packageA/pages/payAttention/payAttention',
          })
        } else if (tempContent.param == 26) {
          //订单交易-全部
          wx.switchTab({
            url: '/pages/forum/forum',
          })
          app.globalData.type = 10
        } else if (tempContent.param == 27) {
          //订单交易-关注
          if (wx.getStorageSync('token')) {
            wx.switchTab({
              url: '/pages/forum/forum',
            })
            app.globalData.type = 6
          } else {
            wx.navigateTo({
              url: `/pages/invitationCode/invitationCode?inviterCode=${that.data.inviterCode}`,
            })
          }
        } else if (tempContent.param == 28) {
          //订单交易-返现交易
          wx.switchTab({
            url: '/pages/forum/forum',
          })
          app.globalData.type = 7
        } else if (tempContent.param == 29) {
          //订单交易-商品交易
          wx.switchTab({
            url: '/pages/forum/forum',
          })
          app.globalData.type = 8
        } else if (tempContent.param == 30) {
          //订单交易-提期
          wx.switchTab({
            url: '/pages/forum/forum',
          })
          app.globalData.type = 5
        } else if (tempContent.param == 31) {
          //订单交易-普通贴
          wx.switchTab({
            url: '/pages/forum/forum',
          })
          app.globalData.type = 9
        } else if (tempContent.param == 32) {
          wx.navigateTo({
            url: '/packageA/pages/seed/seed?status=1',
          })
        } else if (tempContent.param == 33) {
          wx.navigateTo({
            url: '/packageA/pages/seedRecharge/seedRecharge',
          })
        }
      } else if (tempContent.category == 2) {
        wx.navigateTo({
          url: '/pages/detail/detail?id=' + tempContent.param + '&&status=' + tempContent.status,
        })
      } else if (tempContent.category == 3) {
        if (tempContent.paramExt == 1) {
          wx.navigateTo({
            url: `/pages/oneList/oneList?id=${tempContent.param}&name=${tempContent.pageName}`,
          })
        } else if (tempContent.paramExt == 2) {
          wx.navigateTo({
            url: `/pages/index/twolist/twolist?id=${tempContent.param}&name=${tempContent.pageName}`,
          })
        }
      } else if (tempContent.category == 4) {
        wx.navigateTo({
          url: `/pages/longActivity/longActivity?id=${tempContent.param}`,
        })
      } else if (tempContent.category == 5) {
        wx.navigateTo({
          url: `/pages/commodityArea/commodityArea?id=${tempContent.param}`,
        })
      } else if (tempContent.category == 6) {
        wx.navigateTo({
          url: `/pages/h5Page/h5Page?srcItem=${tempContent.paramExt}`,
        })
      } else if (tempContent.category == 7) {
        if (e.currentTarget.dataset.storetype == 1) {
          wx.navigateTo({
            url: `/packageA/pages/ecommerceStore/ecommerceStore?id=${tempContent.param}`,
          })
        } else {
          wx.navigateTo({
            url: `/packageA/pages/takeoutHomeage/takeoutHomeage?storeId=${tempContent.param}`,
          })
        }
      } else if (tempContent.category == 8) {
        wx.navigateTo({
          url: `/packageA/pages/takeoutStore/takeoutStore?id=${tempContent.param}`,
        })
      }
    }
})