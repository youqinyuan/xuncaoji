// components/go_home/go_home.js

const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    img_show:Boolean
  },

  /**
   * 组件的初始数据
   */
  data: {
    img_show: false,
  },

  attached() {
    var that = this
    var scene = app.globalData.scene
    console.log(scene, 'scene')
    console.log(that.data.img_show, 'img_show')
    if (scene == 1007 || scene == 1008 || scene == 1011 || scene == 1012 || scene == 1013 || scene == 1036 || scene == 1047 || scene == 1048 || scene == 1049) {
      that.setData({
        img_show: true
      })
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    go_home: function() {
      wx.switchTab({
        url: '/pages/index/index'
      })
    }
  }
})