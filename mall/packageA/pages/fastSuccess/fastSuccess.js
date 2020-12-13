// packageA/pages/fastSuccess/fastSuccess.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hostUrl: app.Util.getUrlImg().hostUrl,
    remark: '',
    DownloadAddress: 'https://xuncaoji.net:8087',
    DownloadImg: '/assets/images/mine/store.png',
    QRUrl:'/assets/images/mine/store.png'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //下载线上图片到本地，用于绘制分享图片
    let that = this
    wx.downloadFile({
      url: that.data.DownloadImg,
      success: function (res) {
        that.setData({
          QRUrl: res.tempFilePath
        })
      },
      fail: function (res) {

      }
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
    wx.switchTab({
      url:'/pages/mine/mine'
    })
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
   //保存二维码到相册
   saveQR: function () {
    var that = this
    var tempFilePath = that.data.QRUrl
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.writePhotosAlbum']) {
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success() {
              console.log('授权相册')
              wx.saveImageToPhotosAlbum({
                filePath: tempFilePath,
                success(res) {

                  that.setData({
                    downAppStatus: false
                  });

                  wx.hideLoading()
                  console.log('保存图片成功回调')
                  wx.showToast({
                    title: '保存成功',
                    icon: 'none'
                  }, 2000);

                },
                fail(res) {
                  wx.hideLoading()
                  console.log('保存图片失败回调')
                  console.log(res);
                  wx.showToast({
                    title: '保存失败，请稍后重试',
                    icon: 'none'
                  }, 2000);
                  that.setData({
                    downAppStatus: false
                  });
                }
              })
            },
            fail() {
              wx.hideLoading();
              wx.showModal({
                title: '温馨提示',
                content: '您已拒绝授权，是否去设置打开？',
                confirmText: "确认",
                cancelText: "取消",
                success: function (res) {
                  console.log(res);
                  if (res.confirm) {
                    console.log('用户点击确认')
                    wx.openSetting({
                      success: (res) => {
                        console.log(res)
                        res.authSetting = {
                          "scope.writePhotosAlbum": true,
                        }
                        console.log("openSetting: success");
                        wx.saveImageToPhotosAlbum({
                          filePath: tempFilePath,
                          success(res) {

                            that.setData({
                              downAppStatus: false
                            });

                            wx.hideLoading()
                            wx.showToast({
                              title: '保存成功',
                              icon: 'none'
                            }, 2000);
                          },
                          fail(res) {
                            wx.hideLoading()
                            console.log(res);
                            wx.showToast({
                              title: '保存失败，请稍后重试',
                              icon: 'none'
                            }, 2000);
                            that.setData({
                              downAppStatus: false
                            });
                          }
                        })
                      }
                    });
                  } else {
                    console.log('用户点击取消')
                  }
                }
              });

            }
          })
        } else {
          console.log('保存图片')
          wx.saveImageToPhotosAlbum({
            filePath: tempFilePath,
            success(res) {
              wx.hideLoading()
              console.log('保存图片成功回调')
              wx.showToast({
                title: '保存成功',
                icon: 'none'
              }, 2000);

              that.setData({
                downAppStatus: false
              });
            },
            fail(res) {
              wx.hideLoading()
              console.log('saveImageToPhotosAlbum 失败回调')
              console.log(res);
              wx.showToast({
                title: '保存失败，请稍后重试',
                icon: 'none'
              }, 2000);
              that.setData({
                downAppStatus: false
              });
            }
          })
        }
      },
      fail(res) {
        wx.hideLoading()
        wx.showToast({
          title: '保存失败，请稍后重试',
          icon: 'none'
        }, 2000);
        console.log('wx.getSetting 失败回调')
        console.log(res);
      }
    })

  },
})