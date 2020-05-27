// packageA/pages/profitDetail/profitDetail.js
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hostUrl: app.Util.getUrlImg().hostUrl,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  init:function(){
    let that = this
    // 总收益
    if(wx.getStorageSync('token')){
      app.Util.ajax('mall/userHome/queryUserIncomeTypeTotal', null, 'GET').then((res) => {
        if (res.data.messageCode = 'MSG_1001') {
          that.setData({
            content:res.data.content,
          })
          const ctx = wx.createCanvasContext('Canvas');
          // 设置圆点 x  y   中心点
          let number = {
            x: 75,
            y: 75
          };
          // 获取数据 各类项的个数
          let term = [{
            color: '#FFA9A9',
            num: this.data.content.sellingGoodsProportion,
            flownum:this.data.content.sellingGoodsProportion,
          },
          {
            color: '#D4F1FE',
            num: this.data.content.mentionPeriodProportion,
            flownum: this.data.content.mentionPeriodProportion,
          },
          {
            color: '#ACD4E4',
            num: this.data.content.buyBackProportion,
            flownum: this.data.content.buyBackProportion,
          },
          {
            color: '#FA5252',
            num: this.data.content.commodityProportion,
            flownum: this.data.content.commodityProportion,
          },
          {
            color: '#FFE2BE',
            num: this.data.content.commissionProportion,
            flownum: this.data.content.commissionProportion,
          },
          {
            color: '#FFBA93',
            num: this.data.content.preOrderProportion,
            flownum: this.data.content.preOrderProportion,
          }
        ];
          let termarr = [];
          for (let t = 0; t < term.length; t++) {
            // flownum
            let thisterm = Number(term[t].flownum)
            let thiscolor = term[t].color
            termarr.push({
              data: thisterm,
              color: thiscolor
            })
          }
          console.log(termarr)
          // 设置总数
          let sign = 0;
          for (var s = 0; s < termarr.length; s++) {
            sign += termarr[s].data
          }
          //设置半径 
          let radius = 75;
          for (var i = 0; i < termarr.length; i++) {
            var start = 0;
            // 开始绘制
            ctx.beginPath()
            if (i > 0) {
              for (var j = 0; j < i; j++) {
                start += termarr[j].data / sign * 2 * Math.PI
              }
            }
            var end = start + termarr[i].data / sign * 2 * Math.PI
            ctx.arc(number.x, number.y, radius, start, end,false);
            ctx.setLineWidth(1);
            ctx.lineTo(number.x, number.y);
            ctx.setStrokeStyle('#fff');
            ctx.setFillStyle(termarr[i].color);
            ctx.fill();
            ctx.closePath();
            ctx.stroke();
          }
          ctx.beginPath()
          ctx.arc(number.x, number.y, 45, 0, 2 * Math.PI,false);
          ctx.setLineWidth(1);
          ctx.lineTo(number.x, number.y);
          ctx.setFillStyle('#fff');
          ctx.fill();
          ctx.closePath();
          ctx.stroke();
          ctx.draw()
        }
      })
    }
  },
  onReady: function () {
    let that = this
    that.init()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that = this
    that.init()
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
    let that = this
    that.init()
    wx.stopPullDownRefresh() 
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
  todetail:function(e){
    let index = e.currentTarget.dataset.index
    if(index==1){
      wx.navigateTo({
        url: "/packageA/pages/profitOrder/profitOrder"
      })
    }else if(index==2){
      wx.navigateTo({
        url: "/packageA/pages/profitMentionPeriod/profitMentionPeriod"
      })
    }else if(index==3){
      wx.navigateTo({
        url: "/packageA/pages/profitGoodsSell/profitGoodsSell"
      })
    }else if(index==4){
      wx.navigateTo({
        url: "/packageA/pages/profitGoodsBuy/profitGoodsBuy"
      })
    }else if(index==5){
      wx.navigateTo({
        url: "/packageA/pages/profitBook/profitBook"
      })
    }
  }
})