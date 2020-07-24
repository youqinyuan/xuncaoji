// packageA/pages/storeEnter/storeEnter.js
const app = getApp()
const util = require('../../../utils/util.js') // 将工具函数导入进来
Page({

  /**
   * 页面的初始数据
   */
  data: {
    business:'',
    businessId:'',
    content:{},
    hostUrl: app.Util.getUrlImg().hostUrl,
    inviterCode:'',
    mobileNumber:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options){
    let that = this
    let token = wx.getStorageSync('token')
    console.log(options)
    if(options.mobileNumber){
       wx.setStorageSync('mobileNumber',options.mobileNumber)
      that.setData({
        inviterCode: options.inviterCode,
        mobileNumber:wx.getStorageSync('mobileNumber')
      })
    } 
    if(token){
                //查询商家入驻信息
                app.Util.ajax('mall/merchant/status', null, 'GET').then((res) => {
                  if(res.data.content){
                    app.globalData.moveData.id = res.data.content.id
                    if(res.data.content.status==3){
                      wx.setStorageSync("storeEnterStatus",1)
                    }else if(res.data.content.status==2){
                      wx.setStorageSync("storeEnterStatus",2)
                    }
                    if(!options.check){
                      if(res.data.content.status==1||res.data.content.status==2||res.data.content.status==3){
                        wx.redirectTo({
                          url: '/packageA/pages/check/check?status='+res.data.content.status+'&remark='+res.data.content.remark+'&inviterCode='+that.data.inviterCode+'&mobileNumber='+that.data.mobileNumber+'&phone='+res.data.content.mobileNumber,
                        })
                      }
                    }
                    //获取商家入驻信息
                          app.Util.ajax('mall/merchant/detail', {
                            id: res.data.content.id
                          }, 'GET').then((res) => { // 使用ajax函数
                            if (res.data.content) {
                              if(wx.getStorageSync("storeEnterStatus")==1){
                                app.globalData.moveData = res.data.content
                                app.globalData.moveData.referrerMobileNumber = that.data.mobileNumber?that.data.mobileNumber:app.globalData.moveData.referrerMobileNumber
                                that.setData({
                                  content : res.data.content
                                })
                              }else{
                                app.globalData.moveData.id = res.data.content.id
                              }
        
                            }
                      })
                  }
                })
    }else{
      wx.navigateTo({
        url: "/pages/invitationCode/invitationCode?inviterCode=" + that.data.inviterCode
      })
    }
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
  next:function(e){
    let that = this
    let token = wx.getStorageSync('token')
    console.log(e.detail.value)
    console.log(e.detail.value.idCard)
    console.log(that.data.businessId)
    if(e.detail.value.name==''){
      wx.showToast({
        title:'姓名不能为空',
        icon:'none'
      })
    }else if(e.detail.value.idCard==''){
      wx.showToast({
        title:'身份证号码不能为空',
        icon:'none'
      })
    }else if(that.data.businessId==''&&!that.data.content.businessId){
      wx.showToast({
        title:'请选择所属行业',
        icon:'none'
      })
    }else{
      wx.request({
        url: util.getUrlImg().publicUrl+'mall/merchant/checkRegisterIdCard',
        method: "GET",
        data: {
          name: e.detail.value.name,
          idNumber: e.detail.value.idCard
        },
        header: {
          "content-type": 'application/x-www-form-urlencoded',
          token: '' || token,
        },
        success: function(res) {
          if (res.data.messageCode == "MSG_1001") {
            app.globalData.moveData.name = e.detail.value.name
            app.globalData.moveData.idNumber = e.detail.value.idCard
            app.globalData.moveData.businessId = that.data.businessId?that.data.businessId:that.data.content.businessId
            wx.navigateTo({
              url: '/packageA/pages/storeInfo/storeInfo'
            })
            } else {
              wx.showToast({
                title:res.data.message,
                icon:'none'
               })
            }
        }
      })
    }
  },
  getName:function(e){
    this.setData({
      name:e.detail.value
    })
    console.log(this.data.name)
  },
  getNumber:function(e){
    this.setData({
      number:e.detail.value
    })
  },
  toBusiness:function(){
    wx.navigateTo({
      url: '/packageA/pages/business/business'
    })
  },
  toFastDetail:function(){
    let that = this
    let business = that.data.business?that.data.business:''
    let businessId = that.data.businessId?that.data.businessId:''
    let name = that.data.name?that.data.name:''
    let number = that.data.number?that.data.number:''
    wx.navigateTo({
      url: '/packageA/pages/fastStoreInfo/fastStoreInfo?business='+business+'&&businessId='+businessId+'&&name='+name+'&&number='+number
    })
  }
})