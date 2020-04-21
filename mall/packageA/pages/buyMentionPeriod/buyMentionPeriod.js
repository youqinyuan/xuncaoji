// packageA/pages/buyMentionPeriod/buyMentionPeriod.js
let app = getApp()
var time = require('../../../utils/util.js');
var interval2 = null
Page({

  /**
   * 页面的初始数据
   */
  data: {
      tempArr:[],
      pageNumber:1,
      pageSize:20,
      shrueDelete:false, //弹窗
      showModal:false,
      timeList:[],
      shareImg:'',
      shareList:{},
      showModalStatus1:false,
      hostUrl: app.Util.getUrlImg().hostUrl,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  init:function(){
    let that = this
    let timeList = []
    let tempArr = []
    app.Util.ajax('mall/forum/MentionPeriod/findPageMentionPeriodTopicList', {
      // pageNumber:that.data.pageNumber,
      // pageSize:that.data.pageSize
    }, 'GET').then((res) => {
      if (res.data.messageCode == 'MSG_1001') {
        for(let i in res.data.content.items){
          timeList[i] = res.data.content.items[i].effective
          res.data.content.items[i].goodsName = res.data.content.items[i].goodsName.substring(0, 5)
          res.data.content.items[i].updateTime = time.formatTimeTwo(res.data.content.items[i].updateTime , 'Y-M-D h:m:s')
        }
        for(let i=0;i<res.data.content.items.length;i++){
          tempArr.push(false)
        }
        console.log(res.data.content)
        that.setData({
          content:res.data.content.items,
          timeList:timeList,
          tempArr:tempArr
        })
        console.log(timeList)
        //倒计时初始化
        that.countDownInit()
      }else{
        wx.showToast({
          title:res.data.message,
          icon:'none'
        })
      }
    })
  },
    // 倒计时初始化
    countDownInit:function(){
      var that = this
      var temp = that.data.timeList
      that.formatDuring(temp)
       interval2 = setInterval(() => {
          for(var i=0;i<temp.length;i++){
            if (temp[i] > 0) {
              temp[i] -= 1000
            } else {
                // clearInterval(interval2)
            }
          }
          that.formatDuring(temp)
      }, 1000)
    },
    formatDuring(temp){
      var that = this
      var hours = 0
      var minutes = 0
      var seconds = 0
      let day = 0
      var temparr = []
      for(var i=0;i<temp.length;i++){
        var tempList = {}
          day = parseInt((temp[i] /3600000)/24) > 0 ?parseInt((temp[i] /3600000)/24):0
          hours = parseInt((temp[i] /3600000)%24).toString() >= 10 ? parseInt((temp[i] /3600000)%24).toString() : '0' + parseInt((temp[i] /3600000)%24).toString()
          minutes = parseInt((temp[i] % (1000 * 60 * 60)) / (1000 * 60)).toString() >= 10 ? parseInt((temp[i] % (1000 * 60 * 60)) / (1000 * 60)).toString() : '0' + parseInt((temp[i] % (1000 * 60 * 60)) / (1000 * 60)).toString()
          seconds = parseInt((temp[i] % (1000 * 60)) / 1000).toString() >= 10 ? parseInt((temp[i] % (1000 * 60)) / 1000).toString() : '0' + parseInt((temp[i] % (1000 * 60)) / 1000).toString()
          if(temp[i]==0){
            tempList.status = 0
          }else{
            tempList.status = 1
          }
          tempList.hours = hours
          tempList.day = day
          tempList.minutes = minutes
          tempList.seconds = seconds
          temparr.push(tempList)
      }
      that.setData({
        timeList:temparr
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
    let that = this
    that.setData({
      pageNumber:1
    })
    clearInterval(interval2)
    that.init()
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
    clearInterval(interval2)
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    clearInterval(interval2)
    this.init()
    wx.stopPullDownRefresh() //停止下拉刷新
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    wx.showToast({
      title:'已经到底了哦~',
      icon:'none'
    })
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
          title: '请助我一臂之力帮我提期，您也可享受超高收益',
          path: that.data.shareList.link,
          imageUrl: that.data.shareImg,
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
          title: '请助我一臂之力帮我提期，您也可享受超高收益',
          path: that.data.shareList.link,
          imageUrl: that.data.shareImg,
        }
      }
    }
  },
  closeModal:function(){
    this.setData({
      showModal:false
    })
  },
  showModal:function(e){
    let that = this
    let temp = e.currentTarget.dataset.temp
    if(that.data.content[temp].mentionPeriodList.length>0){
      this.setData({
        detail:that.data.content[temp].mentionPeriodList,
        showModal:true
      })
    }else{
      wx.showToast({
        title:'暂无明细',
        icon:'none'
      })
    }
  },
  showShare:function(e){
    var that =this
    var index = e.currentTarget.dataset.index
    var temp = that.data.tempArr[index]
    if(temp){
      that.data.tempArr[index] = false
    }else{
      that.data.tempArr[index] = true
    }
    this.setData({
      tempArr:that.data.tempArr
    })
  },
  cancelMentionPeriod:function(){
    let that = this
    let id = that.data.id
    app.Util.ajax('mall/forum/MentionPeriod/revokeForumMentionPeriodTopic', {
      id:id
    }, 'POST').then((res) => {
      if (res.data.messageCode == 'MSG_1001') {
        wx.showToast({
          title:res.data.message,
          icon:'none'
        })
        setTimeout(function(){
          clearInterval(interval2)
          that.init()
        },500)
      }else{
        wx.showToast({
          title:res.data.message,
          icon:'none'
        })
      }
    })
  },
  deleteMentionPeriod:function(){
    let that = this
    let id = that.data.id
    app.Util.ajax('mall/forum/MentionPeriod/deleteForumMentionPeriodTopic', {
      id:id
    }, 'POST').then((res) => {
      if (res.data.messageCode == 'MSG_1001') {
        wx.showToast({
          title:res.data.message,
          icon:'none'
        })
        setTimeout(function(){
          clearInterval(interval2)
          that.init()
        },500)
      }else{
        wx.showToast({
          title:res.data.message,
          icon:'none'
        })
      }
    })
  },
  showPrompt:function(e){
    let that = this
    let index = e.currentTarget.dataset.index //标识点击的按钮
    let temp = e.currentTarget.dataset.temp  //关闭分享与发帖弹窗
    let id = e.currentTarget.dataset.id 
    let tempList = that.data.tempArr
    tempList[temp] = false 
    if(index==1){
      //撤销
      that.setData({
        promptvalue:1,
        shrueDelete:true,
        functionIndex:index,
        id:id,
        tempArr:tempList
      })
    }else if(index==2){
      //删除
      that.setData({
        promptvalue:2,
        shrueDelete:true,
        functionIndex:index,
        id:id,
        tempArr:tempList
      })
    }else{
      //发布
      that.setData({
        promptvalue:3,
        shrueDelete:true,
        functionIndex:index,
        id:id,
        tempArr:tempList
      })
    }
  },
  fabu:function(){
    let that = this
    let id = that.data.id
    app.Util.ajax('mall/forum/topic/updateMentionPeriodTopicVisible', {
      id:id
    }, 'POST').then((res) => {
      if (res.data.messageCode == 'MSG_1001') {
        wx.showToast({
          title:res.data.message,
          icon:'none'
        })
        setTimeout(function(){
          clearInterval(interval2)
          that.init()
        },500)
      }else{
        wx.showToast({
          title:res.data.message,
          icon:'none'
        })
      }
    })
  },
  closeDelete:function(){
    this.setData({
      shrueDelete:false
    })
  },
  shureDelete:function(){
    let that = this
    let functionIndex = that.data.functionIndex
    that.setData({
      shrueDelete:false
    })
    if(functionIndex==1){
      //撤销
      that.cancelMentionPeriod()
    }else if(functionIndex==2){
      //删除
      that.deleteMentionPeriod()
    }else{
      //发布
      that.fabu()
    }
  },
  shares: function (e) {
    var that = this
    var token = wx.getStorageSync('token')
    let id = e.currentTarget.dataset.id
    console.log(id)
    if (token) {
      that.setData({
        showModalStatus1: true
      })
      that.share(id)
    } else {
      wx.navigateTo({
        url: '/pages/invitationCode/invitationCode',
      })
    }
  },
        // 取消分享
        cancelShare: function () {
          var that = this
          that.setData({
            showModalStatus1: false
          })
        },
        share:function(id){
          let that = this
          app.Util.ajax('mall/weChat/sharing/target', {
            mode: 16,
            targetId: id
          }, 'GET').then((res) => {
            if (res.data.messageCode == "MSG_1001") {
              var inviterCode = wx.getStorageSync('inviterCode')
              if (inviterCode) {
                res.data.content.link = res.data.content.link.replace(/{inviterCode}/g, inviterCode)
              } else {
                res.data.content.link = res.data.content.link.replace(/{inviterCode}/g, '')
              }
              // 产品图片路径转换为本地路径
              var imageUrl = res.data.content.imageUrl
              if (imageUrl) {
                wx.getImageInfo({
                  src: imageUrl,
                  success(res) {
                    that.data.shareImg = res.path
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
    toHelp:function(e){
      //此缓存解决从待返提期完成后的页面跳转问题，清除是为了确保此时无缓存
      wx.removeStorageSync("mentionPeriodFrom")
      wx.navigateTo({
        url: `/packageA/pages/helpMentionPeriod/helpMentionPeriod?id=`+e.currentTarget.dataset.id,
      })
    }
})