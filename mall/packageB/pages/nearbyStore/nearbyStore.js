// packageB/pages/nearbyStore/nearbyStore.js
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navData: [{
      name: '全部行业',
      img: '/assets/images/temp/nearby_d.png',
      status: 0
    }, {
      name: '附近',
      img: '/assets/images/temp/nearby_d.png',
      status: 1,
    }, {
      name: '离我最近',
      img: '/assets/images/temp/nearby_d.png',
      status: 2,
    }],
    arry: [],
    arry1: [{
      name: '附近',
      unit: ''
    }, {
      name: 500,
      unit: 'm'
    }, {
      name: 1,
      unit: 'km'
    }, {
      name: 3,
      unit: 'km'
    }, {
      name: 5,
      unit: 'km'
    }, {
      name: 10,
      unit: 'km'
    }],
    arry2: [{
      name: '离我最近',
    }, {
      name: '好评优先',
    }, {
      name: '销量最高',
    }],
    hostUrl: app.Util.getUrlImg().hostUrl,
    pageNumber: 1,
    pageSize: 20,
    text: '', //底部提示
    choose: false, //筛选弹框
    current: 0, //全部行业选择
    current1: 0, //附近选择
    current2: 0, //离我最近选择
    business: 1, //全部行业
    nearby: 1, //附近
    compare: 1, //离我最近
    sortBy: 1, //按离我最近排序
    businessId: '', //行业id
    distance: '', //距离
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    if (options.nearList) {
      that.setData({
        nearList: JSON.parse(options.nearList)
      })
    }
    // 精选商品
    that.selectedGoods();
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
    let that = this
    // 加载精选商品
    that.getSelectedGoods();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  screenCondition(e) {
    let that = this
    let status = e.currentTarget.dataset.status
    that.setData({
      status: status
    })
    if (status == 0) {
      that.data.navData.forEach((v, i) => {
        that.data.navData[1].img = '/assets/images/temp/nearby_d.png'
        that.data.navData[2].img = '/assets/images/temp/nearby_d.png'
      })
      that.setData({
        navData: that.data.navData,
        nearby: 1,
        compare: 1
      })
      that.data.business++;
      if (that.data.business % 2 !== 0) {
        that.data.navData.forEach((v, i) => {
          that.data.navData[0].img = '/assets/images/temp/nearby_d.png'
        })
        that.setData({
          navData: that.data.navData,
          choose: false
        })
      } else {
        that.data.navData.forEach((v, i) => {
          that.data.navData[0].img = '/assets/images/temp/nearby_u.png'
        })
        that.setData({
          navData: that.data.navData,
          choose: true
        })
      }
    } else if (status == 1) {
      that.data.navData.forEach((v, i) => {
        that.data.navData[0].img = '/assets/images/temp/nearby_d.png'
        that.data.navData[2].img = '/assets/images/temp/nearby_d.png'
      })
      that.setData({
        navData: that.data.navData,
        business: 1,
        compare: 1
      })
      that.data.nearby++;
      if (that.data.nearby % 2 !== 0) {
        that.data.navData.forEach((v, i) => {
          that.data.navData[1].img = '/assets/images/temp/nearby_d.png'
        })
        that.setData({
          navData: that.data.navData,
          choose: false
        })
      } else {
        that.data.navData.forEach((v, i) => {
          that.data.navData[1].img = '/assets/images/temp/nearby_u.png'
        })
        that.setData({
          navData: that.data.navData,
          choose: true
        })
      }
    } else if (status == 2) {
      that.data.navData.forEach((v, i) => {
        that.data.navData[0].img = '/assets/images/temp/nearby_d.png'
        that.data.navData[1].img = '/assets/images/temp/nearby_d.png'
      })
      that.setData({
        navData: that.data.navData,
        business: 1,
        nearby: 1
      })
      that.data.compare++;
      if (that.data.compare % 2 !== 0) {
        that.data.navData.forEach((v, i) => {
          that.data.navData[2].img = '/assets/images/temp/nearby_d.png'
        })
        that.setData({
          navData: that.data.navData,
          choose: false
        })
      } else {
        that.data.navData.forEach((v, i) => {
          that.data.navData[2].img = '/assets/images/temp/nearby_u.png'
        })
        that.setData({
          navData: that.data.navData,
          choose: true
        })
      }
    }

  },
  chooseCondition(e) {
    let that = this
    let name = e.currentTarget.dataset.name
    let index = e.currentTarget.dataset.index
    if (that.data.status == 0) {
      let index = e.currentTarget.dataset.index
      let businessId = e.currentTarget.dataset.id
      that.data.navData.forEach((v, i) => {
        that.data.navData[0].name = name
        that.data.navData[0].img = '/assets/images/temp/nearby_d.png'
      })

      that.setData({
        navData: that.data.navData,
        current: index,
        businessId: businessId ? businessId : '',
        choose: false,
        business: 1,
        text: ''
      })
      // 精选商品
      that.selectedGoods();
    } else if (that.data.status == 1) {
      let unit = e.currentTarget.dataset.unit
      that.data.navData.forEach((v, i) => {
        that.data.navData[1].name = name + unit
        that.data.navData[1].img = '/assets/images/temp/nearby_d.png'
      })
      if (name == '附近') {
        that.setData({
          distance: ''
        })
      } else if (name == 500) {
        that.setData({
          distance: 0.5
        })
      } else {
        that.setData({
          distance: name
        })
      }
      that.setData({
        navData: that.data.navData,
        current1: index,
        choose: false,
        nearby: 1,
        text: ''
      })
      // 精选商品
      that.selectedGoods();
    } else if (that.data.status == 2) {
      let unit = e.currentTarget.dataset.unit
      that.data.navData.forEach((v, i) => {
        that.data.navData[2].name = name
        that.data.navData[2].img = '/assets/images/temp/nearby_d.png'
      })
      if (name == '离我最近') {
        that.setData({
          sortBy: 1
        })
      } else if (name == '好评优先') {
        that.setData({
          sortBy: 2
        })
      } else if (name == '销量最高') {
        that.setData({
          sortBy: 3
        })
      }
      that.setData({
        navData: that.data.navData,
        current2: index,
        choose: false,
        compare: 1,
        text: ''
      })
      // 精选商品
      that.selectedGoods();
    }
  },
  // 精选商品
  selectedGoods() {
    let that = this
    let data = {
      pageSize: that.data.pageSize,
      pageNumber: that.data.pageNumber,
      sortBy: that.data.sortBy,
      businessId: that.data.businessId,
      distance: that.data.distance,
      longitude: that.data.nearList.longitude,
      latitude: that.data.nearList.latitude
    }
    console.log(data)
    app.Util.ajax('mall/home/packageGoods', data, 'GET').then((res) => {
      if (res.data.messageCode == 'MSG_1001') {
        that.setData({
          selectedGoods: res.data.content.items
        })
        app.Util.ajax('mall/merchant/getMerchantBusinessList', null, 'GET').then((res) => {
          res.data.content.unshift({
            id: null,
            name: "全部行业"
          })
          that.setData({
            arry: res.data.content
          })
        })
      }
    })
  },
  // 加载精选商品
  getSelectedGoods() {
    let that = this
    let pageNumber = that.data.pageNumber + 1
    let data = {
      pageSize: that.data.pageSize,
      pageNumber: pageNumber,
      sortBy: that.data.sortBy,
      businessId: that.data.businessId,
      distance: that.data.distance,
      longitude: that.data.nearList.longitude,
      latitude: that.data.nearList.latitude
    }
    app.Util.ajax('mall/home/packageGoods', data, 'GET').then((res) => { // 使用ajax函数
      if (res.data.messageCode = 'MSG_1001') {
        if (res.data.content.items == '' && that.data.selectedGoods !== '') {
          that.setData({
            text: '已到底，去【寻商品】提交吧'
          })
        }
        var arr = that.data.selectedGoods
        res.data.content.items.forEach((v, i) => {
          arr.push(res.data.content.items[i])
        })
        that.setData({
          selectedGoods: arr,
          pageNumber: pageNumber
        })
      }
    })
  },
  // 去搜索
  toSearch() {
    wx.navigateTo({
      url: '/packageA/pages/storeSearch/storeSearch',
    })
  },
  // 跳转到有拼团的商家首页
  toTakePages() {
    wx.navigateTo({
      url: '/packageB/pages/takePages/takePages',
    })
  },
})