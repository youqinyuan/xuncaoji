var app = getApp()
Page({
  data: {
    items: [],
    id: 1,
    text: '默认',
    startX: 0, //开始坐标
    startY: 0,
    showDialog: false,
    options: {},
    hostUrl: app.Util.getUrlImg().hostUrl,
  },
  onLoad: function(options) {
    var that = this;
    that.setData({
      options: options
    })
    var name = ''
    app.Util.ajax('mall/personal/addressInfo', 'GET').then((res) => { // 使用ajax函数
      if (res.data.content) {
        for (var i = 0; i < res.data.content.length; i++) {
          name = res.data.content[i].receiverName.substring(0, 1)
          res.data.content[i]['name'] = name
        }
        that.setData({
          items: res.data.content
        })
      } else {
        wx.showToast({
          title: res.data.message,
          icon: 'none'
        })
      }
    })

  },
  //返回提交订单页面
  backPlaceorder: function(e) {
    var that = this
    var is_address = wx.getStorageSync('goAddress')
    if (is_address) {
      wx.setStorage({
        key: "address",
        data: that.data.items[e.currentTarget.dataset.index]
      })
      wx.navigateBack({
        delta: 1
      })
    }
  },
  //手指触摸动作开始 记录起点X坐标
  touchstart: function(e) {
    //开始触摸时 重置所有删除
    this.data.items.forEach(function(v, i) {
      if (v.isTouchMove) //只操作为true
        v.isTouchMove = false;
    })
    this.setData({
      startX: e.changedTouches[0].clientX,
      startY: e.changedTouches[0].clientY,
      items: this.data.items
    })
  },
  //滑动事件处理
  touchmove: function(e) {
    var that = this,
      index = e.currentTarget.dataset.index, //当前索引
      startX = that.data.startX, //开始X坐标
      startY = that.data.startY, //开始Y坐标
      touchMoveX = e.changedTouches[0].clientX, //滑动变化坐标
      touchMoveY = e.changedTouches[0].clientY, //滑动变化坐标
      //获取滑动角
      angle = that.angle({
        X: startX,
        Y: startY
      }, {
        X: touchMoveX,
        Y: touchMoveY
      });
    that.data.items.forEach(function(v, i) {
      v.isTouchMove = false
      //滑动超过30度角 retur
      if (Math.abs(angle) > 30) return;
      if (i == index) {
        if (touchMoveX > startX) //右滑
          v.isTouchMove = false
        else //左滑
          v.isTouchMove = true
      }
    })
    //更新数据
    that.setData({
      items: that.data.items
    })
  },

  /**
 
   * 计算滑动角度
 
   * @param {Object} start 起点坐标
 
   * @param {Object} end 终点坐标
 
   */

  angle: function(start, end) {
    var _X = end.X - start.X,
      _Y = end.Y - start.Y
    //返回角度 /Math.atan()返回数字的反正切值
    return 360 * Math.atan(_Y / _X) / (2 * Math.PI);
  },
  //跳转到编辑地址
  jumpEdit: function(e) {
    var province = e.currentTarget.dataset.province
    var city = e.currentTarget.dataset.city
    var district = e.currentTarget.dataset.district
    var districtId = e.currentTarget.dataset.districtid
    var name = e.currentTarget.dataset.name
    var number = e.currentTarget.dataset.number
    var detailed = e.currentTarget.dataset.detailed
    var id = e.currentTarget.dataset.id
    var index = e.currentTarget.dataset.gindex
    wx.navigateTo({
      url: `/pages/editaddress/editaddress?id=${id}&province=${province}&city=${city}&district=${district}&name=${name}&number=${number}&detailed=${detailed}&districtId=${districtId}&index=${index}`,
    })
  },
  //删除事件

  del: function(e) {
    var id = e.currentTarget.dataset.id
    this.setData({
      id: id,
      showDialog: true
    })
  },
  comfirm: function() {
    let id = this.data.id
    var name = ''
    app.Util.ajax(`mall/personal/deleteAddress?id=${id}`, null, 'DELETE').then((res) => { // 使用ajax函数
      if (res.data.content === 1) {
        app.Util.ajax('mall/personal/addressInfo', 'GET').then((res) => { // 使用ajax函数
          if (res.messageCode = 'MSG_1001') {
            for (var i = 0; i < res.data.content.length; i++) {
              name = res.data.content[i].receiverName.substring(0, 1)
              res.data.content[i]['name'] = name
            }
            this.setData({
              items: res.data.content,
              showDialog: false
            })
          }
        })
      } else {
        this.setData({
          showDialog: false
        })
        wx.showToast({
          title: res.data.message,
          icon: 'none'
        })
      }
    })
  },
  reject: function(e) {
    this.setData({
      showDialog: false
    })
  },
  onShow: function() {
    var that = this
    that.onLoad(that.data.options);
  },
  onUnload: function() {
    // var pages = getCurrentPages() //获取加载的页面
    // var currentPage = pages[pages.length - 1] //获取当前页面的对象
    // var url = currentPage.route
    // if (url == 'pages/placeorder/placeorder') {
    //   wx.redirectTo({
    //     url: '/pages/placeorder/placeorder'
    //   })
    // }else{
    //   wx.reLaunch({
    //     url: '/pages/mine/mine',
    //   })
    // }

  }
})