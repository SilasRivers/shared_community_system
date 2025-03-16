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
      this.setData({ checked: wx.getStorageSync('checked') })
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


  onUsernameInput(e) {
    this.setData({
      username: e.detail.value
    })

  },


  onPasswordInput(e) {
    this.setData({
      password: e.detail.value
    })
  },

  /**
   * 注册
   */
  onLogin() {
    const {
      username,
      password
    } = this.data
    if (username.trim() === '') {
      wx.showToast({
        title: '请输入用户名',
        icon: "error"
      })
      return
    }

    if (password.trim() === '') {
      wx.showToast({
        title: '请输入密码',
        icon: "error"
      })
      return
    }
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {
        username,
        password
      },
      success: res => {
        if (res.result.code === 200) {
          wx.showToast({
            title: '登录成功',
            icon: 'success'
          })
          // 存储 token 到本地
          wx.setStorageSync('token', res.result.token)
          // 跳转到首页
          wx.navigateTo({
            url: '/pages/index/index'
          })
        } else {
          wx.showToast({
            title: res.result.message,
            icon: 'none'
          })
        }
      },
      fail: err => {
        console.error('登录调用云函数失败：', err)
        wx.showToast({
          title: '登录失败',
          icon: 'none'
        })
      }
    })
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
