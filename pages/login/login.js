// pages/login/login.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    username: "",
    password: "",
    checked: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    if (wx.getStorageSync("checked")) {
      this.setData({
        username: wx.getStorageSync("username"),
        password: wx.getStorageSync("password"),
      })
      this.setData({checked:wx.getStorageSync('checked')})
    }
  },



  /**
   * 点击记住密码
   */
  checkboxChange(event) {
    this.setData({
      checked: event.detail.value
    })
    wx.setStorageSync('checked', this.data.checked)
  },


  eventUsernameHandle(options) {
    this.setData({
      username: options.detail.value
    })

  },


  eventPasswordHandle(options) {
    this.setData({
      password: options.detail.value
    })
  },

  /**
   * 注册
   */
  onLoginHandle() {
    if (this.data.username.trim() === '') {
      wx.showToast({
        title: '请输入用户名',
        icon: "error"
      })
      return
    }

    if (this.data.password.trim() === '') {
      wx.showToast({
        title: '请输入密码',
        icon: "error"
      })
      return
    }


    if (this.data.username === wx.getStorageSync("username") && this.data.password === wx.getStorageSync("password")) {
      wx.showToast({
        title: '登录成功',
        icon: 'success',
        success: () => {
          setTimeout(() => {
            wx.navigateBack()
          }, 1000);
        }
      })
    } else {
      wx.showToast({
        title: '用户名或密码错误',
        icon: 'error',

      })
    }
  },


  /**
   * 注册
   */
  onRegisterHandle() {

    wx.navigateTo({
      url: '/pages/register/register',
    })
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})
