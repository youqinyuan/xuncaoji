// components/swiper-show/swiper-show.js
let app = getApp()
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
    interval: 6000,
    duration: 0,
    easingFunction: "linear", //指定 swiper 切换缓动动画类型
    swiperData: [], //请求回来的页面数据
    pageNumber: 1,
    pageSize: 20,
  },

  /**
   * 组件的方法列表
   */
  attached() {
    var that = this
    that.getPageData()
  },
  methods: {
    // 获取页面数据
    getPageData: function() {
      var that = this
      app.Util.ajax('mall/home/textSlideShow', {
        pageNumber: that.data.pageNumber,
        pageSize: that.data.pageSize
      }, 'GET').then((res) => { // 使用ajax函数
        console.log(res)
        if (res.data.messageCode == "MSG_1001") {
          that.setData({
            swiperData: res.data.content.items
          })
        }
      })
    },
    // 轮播图current改变的事件
    currentChange: function(e) {
      var that = this
      var current = e.detail.current
      var pageNumber = that.data.pageNumber
      var pageSize = that.data.pageSize
      var swiperData = that.data.swiperData
      var index = current + 1
      if (index == pageNumber * pageSize) {
        that.data.pageNumber++;
        app.Util.ajax('mall/home/textSlideShow', {
          pageNumber: that.data.pageNumber,
          pageSize: that.data.pageSize
        }, 'GET').then((res) => {
          if (res.data.messageCode == "MSG_1001") {
            res.data.content.items.forEach(item=>{
              swiperData.push(item)
            })
            that.setData({
              swiperData: swiperData
            })
          }
        })
      }
    },
  }
})