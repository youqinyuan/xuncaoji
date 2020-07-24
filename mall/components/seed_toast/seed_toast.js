// components/seed_toast/seed_toast.js
let app = getApp();
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
    title:'确定撤销一折购吗',
    text_one:'撤销后将退您：N元，并将扣除您N颗种子！',
    text_two:'您的种子数量：N颗',
    message:'您的种子不足，请先获得足够的种子再进行终止！',
    button_one_name:'获取种子',
    button_two_name:'确认撤销',
    hostUrl: app.Util.getUrlImg().hostUrl,
    status:false
  },

  /**
   * 组件的方法列表
   */
  ready () {
    console.log(1111)
    console.log(this.data.list)
   // console.log(this.videoCtx)
  },
  attached() {
    console.log(this.data.list)
  },
  methods: {
    cancle:function(){
      this.setData({
        status:false
      })
    },
    toSeed:function(){
      wx.navigateTo({
        url:"/packageA/pages/seed/seed"
      })
      this.setData({
        status:false
      })
    }
  }
})
