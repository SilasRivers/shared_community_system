// pages/register/register.js
Page({
  data: {
    username: '',
    phone: '',
    password: '',
    confirmPassword: '',
    family_id: '',
    isPasswordMismatch: false
  },
  onUsernameInput(e) {
    this.setData({
      username: e.detail.value
    })
  },
  onPhoneNumberInput(e) {
    this.setData({
      phone: e.detail.value
    })
  },
  onPasswordInput(e) {
    this.setData({
      password: e.detail.value,
      isPasswordMismatch: false
    })
  },
  onConfirmPasswordInput(e) {
    const confirmPassword = e.detail.value
    this.setData({
      confirmPassword: confirmPassword,
      isPasswordMismatch: confirmPassword !== this.data.password
    })
  },
  onFamilyNumberInput(e) {
    this.setData({
      family_id: e.detail.value
    })
  },
  onRegister() {
    const {
      username,
      phone,
      password,
      confirmPassword,
      family_id,
      isPasswordMismatch
    } = this.data
    if (!username || !phone || !password || !confirmPassword || !family_id) {
      wx.showToast({
        title: '请填写完整信息',
        icon: 'none'
      })
      return
    }
    if (isPasswordMismatch) {
      wx.showToast({
        title: '两次密码不同，请重新输入',
        icon: 'none'
      })
      return
    }
    wx.cloud.database().collection('family').where({
      family_id: family_id
    }).get({
      success: res => {
        if (res.data.length === 0) {
          // 家庭号不存在，弹出弹框让用户输入家庭名
          wx.showModal({
            title: '家庭名输入',
            content: '请输入家庭名',
            editable: true,
            placeholderText: '请输入家庭名',
            success: modalRes => {
              if (modalRes.confirm) {
                const family_name = modalRes.content
                // 创建家庭信息
                wx.cloud.callFunction({
                  name: 'addFamily',
                  data: {
                    family_id,
                    family_name
                  },
                  success: createRes => {
                    if (createRes.result.code === 200) {
                      // 家庭信息创建成功，进行用户注册
                      this.registerUser()
                    } else {
                      wx.showToast({
                        title: '创建家庭信息失败',
                        icon: 'none'
                      })
                    }
                  },
                  fail: createErr => {
                    console.error('创建家庭信息调用云函数失败：', createErr)
                    wx.showToast({
                      title: '创建家庭信息失败',
                      icon: 'none'
                    })
                  }
                })
              }
            }
          })
        } else {
          // 家庭号已存在，直接进行用户注册
          this.registerUser()
        }
      },
      fail: err => {
        console.error('检查家庭号出错：', err)
        wx.showToast({
          title: '检查家庭号出错',
          icon: 'none'
        })
      }
    })
  },
  registerUser() {
    const { username, phone, password, family_id } = this.data
    wx.cloud.callFunction({
      name: 'registerUser',
      data: {
        username,
        phone,
        password,
        family_id
      },
      success: regRes => {
        if (regRes.result.code === 200) {
          wx.showToast({
            title: '注册成功',
            icon: 'success'
          })
          wx.navigateTo({
            url: '/pages/login/login'
          })
        } else if (regRes.result.code === 400) {
          wx.showToast({
            title: regRes.result.message,
            icon: 'none'
          })
        } else {
          wx.showToast({
            title: '注册失败',
            icon: 'none'
          })
        }
      },
      fail: regErr => {
        console.error('注册调用云函数失败：', regErr)
        wx.showToast({
          title: '注册失败',
          icon: 'none'
        })
      }
    })
  }
})