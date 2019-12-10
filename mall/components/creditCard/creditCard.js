// components/creditCard/creditCard.js
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    showStop: true,
    stopStatus: 1
  },
  ready: function() {
    var that = this
    that.setData({
      stopStatus: 1
    })
    console.log("status:" + that.data.stopStatus)
    setTimeout(function() {
      that.setData({
        stopStatus: 2
      })
    }, 5000)
  },
  /**
   * 组件的方法列表
   */
  methods: {
    // cancelStop:function(){
    //   console.log("关闭弹窗")
    //   // console.log('1'+this.data.child)
    //   app.globalData.creditCard=2
    //   this.setData({
    //     showStop:false
    //   })
    // },
    know: function() {
      app.globalData.creditCard = 1
      this.setData({
        showStop: false
      })
    }
  }
})