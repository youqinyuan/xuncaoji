Component({
  data: {
    selected: 0,
    showTabbar:true,//是否显示tababr
    "color": "#333333",
    "selectedColor": "#FF2644",
    "backgroundColor": "#fff",
    "list": [
      {
        "pagePath": "/pages/index/index",
        "text": "首页",
        "iconPath": "/assets/images/icon/ic_home_n.png",
        "selectedIconPath": "/assets/images/icon/ic_activehome_n.png"
      },
      {
        "pagePath": "/pages/member/member",
        "text": "会员",
        "iconPath": "/assets/images/icon/ic_member_n.png",
        "selectedIconPath": "/assets/images/icon/ic_activemember_n.png"
      },
      {
        "pagePath": "/pages/mine/mine",
        "text": "我的",
        "iconPath": "/assets/images/icon/ic_my_n.png",
        "selectedIconPath": "/assets/images/icon/ic_activemy_n.png"
      }
    ]
  },
  attached() {
  },
  methods: {
    switchTab(e) {
      const data = e.currentTarget.dataset
      const url = data.path
      wx.switchTab({ url })
      this.setData({
        selected: data.index
      })
    }
  }
})