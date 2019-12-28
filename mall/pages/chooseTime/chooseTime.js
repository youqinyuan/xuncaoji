// pages/chooseTime/chooseTime.js
const date = new Date()
const years = []
const months = []
const days = []
var thisYer = date.getFullYear()
var thisMon = date.getMonth();
var thisDay = date.getDate();
for (let i = 1970; i <= date.getFullYear() + 1000; i++) {
  years.push(i);
}
for (let i = 1; i <= date.getMonth() + 1; i++) {
  let month = 0;
  month = i < 10 ? '0' + i : i;
  months.push(month);
}
if (0 <= thisMon && thisMon < 9) {
  thisMon = "0" + (thisMon + 1);
} else {
  thisMon = (thisMon + 1);
}
if (0 <= thisDay && thisDay < 10) {
  thisDay = "0" + thisDay;
}
var totalDay = mGetDate(date.getFullYear(), thisMon);
for (let i = 1; i <= 31; i++) {
  var k = i;
  if (0 <= i && i < 10) {
    k = "0" + i
  }
  days.push(k)
}
function mGetDate(year, month) {
  var d = new Date(year, month, 0);
  return d.getDate();
}
Page({
  

  /**
   * 页面的初始数据
   */
  data: {
    buttonStatus:1,
    startTime:'',
    endTime:'',
    years: years,
    year: thisYer,
    months: months,
    month: thisMon,
    days: days,
    day: thisDay,
    value: [thisYer-1970, thisMon - 1, thisDay - 1],
    showWay: false,
    bindStart:1,
    arryList: [thisYer-1970, thisMon - 1, thisDay - 1]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(wx.getStorageSync('startTime')||wx.getStorageSync('endTime')){
      this.setData({
        startTime:wx.getStorageSync('startTime'),
        endTime:wx.getStorageSync('endTime'),
        buttonStatus:2
      })
    }
  },
  bindChange: function(e) {
    const val = e.detail.value
    this.setData({
      arryList: val,
      year: this.data.years[val[0]],
      month: this.data.months[val[1]],
      day: this.data.days[val[2]],      
    })
    var totalDay = mGetDate(this.data.year, this.data.month);
    var changeDate = [];
    for (let i = 1; i <= totalDay; i++) {
      var k = i;
      if (0 <= i && i < 10) {
        k = "0" + i
      }
      changeDate.push(k)
    }
    this.setData({
      days: changeDate
    })

  },
  showConfirm:function(){
    var that = this
    that.setData({
      startTime: that.data.years[that.data.arryList[0]] + '-' + that.data.months[that.data.arryList[1]] + '-' + that.data.days[that.data.arryList[2]],
      showWay: false,
      buttonStatus: 2,
      value: that.data.arryList
    })
  },
  showConfirm1: function () {
    var that = this
    that.setData({
      endTime: that.data.years[that.data.arryList[0]] + '-' + that.data.months[that.data.arryList[1]] + '-' + that.data.days[that.data.arryList[2]],
      showWay: false,
      buttonStatus: 2,
      value: that.data.arryList
    })
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  showDate:function(){
    this.setData({
      showWay:true,
      bindStart:1
    })
  },
  showDate2:function(){
    console.log(111)
    this.setData({
      showWay:true,
      bindStart:2
    })
  },

  clear:function(){
    this.setData({
      startTime:'',
      endTime:'',
      buttonStatus:1
    })
  },
  allWait:function(){
    wx.setStorageSync('startTime',"")
    wx.setStorageSync('endTime',"")
    wx.setStorageSync('pageNumber2',1)
    wx.navigateBack({
      delta: 1
    })
  },
  wait:function(){
    var that = this
    wx.setStorageSync('startTime',that.data.startTime)
    wx.setStorageSync('endTime',that.data.endTime)
    wx.setStorageSync('pageNumber2',1)
    wx.navigateBack({
      delta: 1
    })
  },
  cancelCondition: function(e) {
    var that = this
    that.setData({
      showWay: false
    })
  },
})