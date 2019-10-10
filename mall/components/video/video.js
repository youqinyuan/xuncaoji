// component/video/video.js
const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    datas: Object
  },
  ready () {
    this.videoContext = wx.createVideoContext('myVideo',this)
   // console.log(this.videoCtx)
  },
  /**
   * 组件的初始数据
   */
  data: {
    // host:app.globalObj.host,
    playIcon: '/assets/images/icon/video_play.png',
    videoimage: '/assets/images/icon/video_cover.png', //默认显示封面
    videoPlay: null,
    videoUrl:app.Util.getUrlImg().hostVideo+'video/intro.mp4'
  },

  /**
   * 组件的方法列表
   */
  attached() {
  },
  methods: {
    bindplay: function(e) {
      this.videoCtx.play();
    },
    videoPlay: function (e) {
      this.setData({
        videoimage:'none'
      })
        this.videoContext.play();
    }
  },
})