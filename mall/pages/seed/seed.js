const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    system: '',
    animation: '',
    show:false,
    show2:false,
    title1:"购物优惠",
    title2:"新品兑换",
    title3:"游戏特权",
    value1:"您可在寻草记商城享受全程购物优惠，使用您获取的种子进行现金抵扣。",
    value2:"使用种子在商城的新品专区内进行商品兑换全额兑换不花一分钱。",
    value3:"本特权即将上线，使用种子可在游戏中兑换各种特权。敬请期待哟。",
    canGetSeed:{},
    seedNumber:0,
    seedGoodsContent:{},
    pageNumber:1,
    pageSize:10,
    seedTemp:0,
    count:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
    that.setData({
      system: wx.getSystemInfoSync()
    })
    that.seedInit()
    setTimeout(function() {
      let anmition = wx.createAnimation({
        duration: 1200,
        timingFunction: 'ease',
      })
      that.setData({
        animation: anmition
      })
      let arryList = new Array();
      for (let i = 0; i < that.data.seedTemp; i++) {
        var obj = {
          // num: Math.floor(Math.random() * 15 + 1) + 'C',
          num: that.data.canGetSeed[i].amount,
          title: i % 3 == 0 ? '' : i % 3 == 1 ? '' : i % 3 == 2 ? '' : '',
          anima: '',
          styleObject: '',
          seedId: that.data.canGetSeed[i].id,
          isShow: true,
          realItem: true
        }
        arryList.push(obj)
      }
      //随机左边距 上边距 动画延时
      let left_width, top_height, anm_time;
      for (let i = 0; i < arryList.length; i++) {
        left_width = Math.floor(Math.random() * 20 + 1);
        top_height = Math.floor(Math.random() * 15 + 5);
        anm_time = 0.3;
        // console.log('id:' + i + '左边距:' + left_width + ',上边距:' + top_height + ',动画时间:' + anm_time);
        arryList[i].top = top_height;
        arryList[i].styleObject = that.formatStyle({
          "left": left_width + 'px',
          "top": top_height + 'px',
          "animation": 'heart 1.3s ease-in-out ' + anm_time + 's infinite alternate'
        })
      }
      // 空数组
      var emptarry = new Array();
      for (var i = 0; i < 11 - arryList.length; i++) {
        emptarry.push({
          realItem: false
        })
      }
      that.setData({
        myList: that.randomArry(arryList.concat(emptarry))
      })
      const query = wx.createSelectorQuery()
      query.select('#my_collect').boundingClientRect()
      query.selectViewport().scrollOffset()
      query.exec(function(res) {
        that.setData({
          my_collect: res[0]
        })
      })
    }, 1000)

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },
  //随机数组
  randomArry(arr) {
    var len = arr.length;
    for (var i = len - 1; i >= 0; i--) {
      var randomIndex = Math.floor(Math.random() * (i + 1));
      var itemIndex = arr[randomIndex];
      arr[randomIndex] = arr[i];
      arr[i] = itemIndex;
    }
    return arr;
  },
  /**
   * 格式化Style
   */
  formatStyle(position) {
    let styles = []
    for (let key in position) {
      styles.push(`${key}: ${position[key]};`)
    }
    return styles.join(' ')
  },
  //收集能量 
  bindTab(e) {
    let that = this;
    if(that.data.count){
      that.setData({
        count:false
      })
    // console.log("aa"+that.data.seedTemp)
    if(that.data.seedTemp==1){
      // console.log(1111111)
      app.Util.ajax('mall/seed/receiveSeed', {
        id: e.currentTarget.dataset.seedid
      }, 'POST').then((res) => {
        if (res.data.messageCode == "MSG_1001") {
          that.setData({
            seedNumber: that.data.seedNumber + e.currentTarget.dataset.num,
          })
        }
      })
      let myItm = that.data.myList[e.currentTarget.id];
      myItm.styleObject = myItm.styleObject.split("animation")[0];
      let itd = 'myList[' + e.currentTarget.id + '].styleObject';
      that.setData({
        [itd]: myItm.styleObject
      })
      setTimeout(function() {
        let dpi = that.data.system.screenWidth / 750; //计算像素密度
        //元素的位置
        let view_x = e.detail.x,
          view_y = e.detail.y + dpi * 116 / 2;
        let myCollect_x = that.data.my_collect.left + dpi * 130 / 2 + dpi * 260 / 2 * 0.5,
          myCollect_y = that.data.my_collect.right + that.data.myList[e.currentTarget.id].top - 70 + dpi * 116 / 2 + dpi * 113 * 0.5;
        var animation = wx.createAnimation({
          duration: 1200,
          timingFunction: 'ease',
        })

        that.animation = animation;
        animation.translate(0, 0).opacity(0).step();
        animation.translateX(0).step();
        animation.translateY(0).step();
        let anmi = 'myList[' + e.currentTarget.id + '].anima';
        that.setData({
          [anmi]: animation.export()
        })
          setTimeout(function () {
            that.setData({
              ['myList[' + e.currentTarget.id + '].isShow']: false,
              ['myList[' + e.currentTarget.id + '].realItem']: false
            })
          }, 500)
      }, 100)
      setTimeout(function() {
        that.setData({
          system: wx.getSystemInfoSync()
        })
        // console.log("aa" + that.data.system)
        that.seedInit()
        setTimeout(function() {
          let anmition = wx.createAnimation({
            duration: 1200,
            timingFunction: 'ease',
          })
          that.setData({
            animation: anmition
          })
          let arryList = new Array();
          // console.log(4444 + JSON.stringify(that.data.canGetSeed))
          // console.log(that.data.seedTemp)
          for (let i = 0; i < that.data.seedTemp; i++) {
            var obj = {
              // num: Math.floor(Math.random() * 15 + 1) + 'C',
              num: that.data.canGetSeed[i].amount,
              title: i % 3 == 0 ? '' : i % 3 == 1 ? '' : i % 3 == 2 ? '' : '',
              anima: '',
              styleObject: '',
              seedId: that.data.canGetSeed[i].id,
              isShow: true,
              realItem: true
            }
            arryList.push(obj)
          }
          //随机左边距 上边距 动画延时
          let left_width, top_height, anm_time;
          for (let i = 0; i < arryList.length; i++) {
            left_width = Math.floor(Math.random() * 20 + 1);
            top_height = Math.floor(Math.random() * 15 + 5);
            anm_time = (Math.random() * 1.1 + 0).toFixed(1);
            // console.log('id:' + i + '左边距:' + left_width + ',上边距:' + top_height + ',动画时间:' + anm_time);
            arryList[i].top = top_height;
            arryList[i].styleObject = that.formatStyle({
              "left": left_width + 'px',
              "top": top_height + 'px',
              "animation": 'heart 1.3s ease-in-out ' + anm_time + 's infinite alternate'
            })
          }
          // 空数组
          var emptarry = new Array();
          for (var i = 0; i < 11 - arryList.length; i++) {
            emptarry.push({
              realItem: false
            })
          }
          that.setData({
            myList: that.randomArry(arryList.concat(emptarry))
          })
          const query = wx.createSelectorQuery()
          query.select('#my_collect').boundingClientRect()
          query.selectViewport().scrollOffset()
          query.exec(function(res) {
            that.setData({
              my_collect: res[0]
            })
          })
        },200)
      }, 1100)
    } else {
      that.setData({
        seedTemp:that.data.seedTemp - 1
      })
      app.Util.ajax('mall/seed/receiveSeed', {
        id: e.currentTarget.dataset.seedid
      }, 'POST').then((res) => {
        if (res.data.messageCode == "MSG_1001") {
          that.setData({
            seedNumber:that.data.seedNumber + e.currentTarget.dataset.num
          })
        }
      })
      let myItm = that.data.myList[e.currentTarget.id];
      myItm.styleObject = myItm.styleObject.split("animation")[0];
      let itd = 'myList[' + e.currentTarget.id + '].styleObject';
      that.setData({
        [itd]: myItm.styleObject
      })
      setTimeout(function() {
        let dpi = that.data.system.screenWidth / 750; //计算像素密度
        //元素的位置
        let view_x = e.detail.x,
          view_y = e.detail.y + dpi * 116 / 2;
        let myCollect_x = that.data.my_collect.left + dpi * 130 / 2 + dpi * 260 / 2 * 0.5,
          myCollect_y = that.data.my_collect.right + that.data.myList[e.currentTarget.id].top - 70 + dpi * 116 / 2 + dpi * 113 * 0.5;
        var animation = wx.createAnimation({
          duration: 1200,
          timingFunction: 'ease',
        })

        that.animation = animation;
        animation.translate(0, 0).opacity(0).step();
        animation.translateX(0).step();
        animation.translateY(0).step();
        let anmi = 'myList[' + e.currentTarget.id + '].anima';
        // console.log(anmi)
        that.setData({
          [anmi]: animation.export()
        })
          setTimeout(function () {
            that.setData({
              ['myList[' + e.currentTarget.id + '].isShow']: false,
              ['myList[' + e.currentTarget.id + '].realItem']: false
            })
          }, 500)
      }, 100)
    }
    }
    setTimeout(function(){
      that.setData({
        count:true
      })
    },1500)
  },
  toSeedDetail: function() {
    wx.navigateTo({
      url: '/pages/seedDetail/seedDetail',
    })
  },
  show: function(e) {
    var temp = e.currentTarget.dataset.index
    if (temp == 1) {
      this.setData({
        title: this.data.title1,
        value: this.data.value1,
        show: true
      })
    } else if (temp == 2) {
      this.setData({
        title: this.data.title2,
        value: this.data.value2,
        show: true
      })
    } else {
      this.setData({
        title: this.data.title3,
        value: this.data.value3,
        show: true
      })
    }
  },
  show2: function() {
    this.setData({
      show2: true
    })
  },
  closeShow: function() {
    this.setData({
      show: false
    })
  },
  closeShow2: function() {
    this.setData({
      show2: false
    })
  },
  preventTouchMove: function() {},
  column: function(e) {
    var columnTemp = e.currentTarget.dataset.index
    if (columnTemp == 1) {
      app.Util.ajax('mall/seed/sign', {}, 'POST').then((res) => {
        // console.log(res)
        if (res.data.messageCode == "MSG_1001") {
          wx.showToast({
            title: "签到成功，奖励" + res.data.content + "种子",
            icon: "none"
          })
        } else {
          wx.showToast({
            title: res.data.message,
            icon: "none"
          })
        }
      })
    } else if (columnTemp == 2) {
      wx.navigateTo({
        url: '/pages/mine/recharge/recharge?temp=1',
      })
    } else if (columnTemp == 3) {
      wx.switchTab({
        url: '/pages/index/index',
      })
    } else if (columnTemp == 4) {
      wx.switchTab({
        url: '/pages/forum/forum',
      })
    } else if (columnTemp == 5) {
      wx.navigateTo({
        url: '/pages/waitReentryDetail/waitReentryDetail?temp=1',
      })
    } else if (columnTemp == 6) {
      wx.showToast({
        title: "暂未开放哦，敬请期待",
        icon: "none"
      })
    }
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    var that = this
    that.getMore();
  },
  getMore: function() {
    var that = this
    var pageNumber = that.data.pageNumber + 1
    app.Util.ajax('mall/seed/queryGoodsBySeed', {
      pageNumber: pageNumber,
      pageSize: that.data.pageSize
    }, 'GET').then((res) => { // 使用ajax函数
      if (res.data.content) {
        if (res.data.content.items == '' && that.data.seedGoodsContent !== '') {
          wx.showToast({
            title: '已经到底啦',
            icon: 'none'
          })
        }
        var arr = that.data.seedGoodsContent
        for (var i = 0; i < res.data.content.items.length; i++) {
          arr.push(res.data.content.items[i])
        }
        that.setData({
          seedGoodsContent: arr,
          pageNumber: pageNumber
        })
      }
    })
  },
  seedInit: function() {
    var that = this
    //种子数量
    app.Util.ajax('mall/personal/assets', null, 'GET').then((res) => {
      that.setData({
        seedNumber: res.data.content.seedAmount,
      })
    })
    //种子数量
    app.Util.ajax('mall/seed/queryUnFinishRecord', null, 'GET').then((res) => {
      // console.log(res.data.content)
      if (res.data.content.length > 10) {
        that.setData({
          seedTemp: 10
        })
      } else {
        that.setData({
          seedTemp: res.data.content.length
        })
      }
      that.setData({
        canGetSeed: res.data.content,
        totalSize: res.data.content.length
      })
    })
    app.Util.ajax('mall/seed/queryGoodsBySeed', {
      pageNumber: 1,
      pageSize: 10,
    }, 'GET').then((res) => {
      that.setData({
        seedGoodsContent: res.data.content.items
      })
    })
  },
  toGoodsDetail: function(e) {
    wx.navigateTo({
      url: '/pages/detail/detail?id=' + e.currentTarget.dataset.goodsid
    })
  }

})