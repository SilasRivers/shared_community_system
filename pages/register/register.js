// pages/register/register.js
Page({
  data: {
    username: '',
    phone: '',
    password: '',
    confirmPassword: '',
    family_id: '',
    isPhoneValid: false,
    isPasswordMismatch: false,
    avatarUrl: ''
  },
  onUsernameInput(e) {
    this.setData({
      username: e.detail.value
    })
  },
  onPhoneNumberInput(e) {
    const phoneReg = /^1[3-9]\d{9}$/;
    const phone = e.detail.value;
    const isPhoneValid = phoneReg.test(phone);
    this.setData({
      phone,
      isPhoneValid
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
      isPasswordMismatch,
      isPhoneValid
    } = this.data
    if (!username || !phone || !password || !confirmPassword || !family_id) {
      wx.showToast({
        title: '请填写完整信息',
        icon: 'none'
      })
      return
    }
    if (!isPhoneValid) {
      // 手机号码不合法，给出提示
      wx.showToast({
        title: '请输入正确的手机号码',
        icon: 'none'
      });
      return;
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
  async registerUser() {
    const { username, phone, password, family_id } = this.data
    wx.cloud.callFunction({
      name: 'generateRandomAvatar',
      success: res => {
        if (res.result.success) {
          wx.cloud.callFunction({
            name: 'registerUser',
            data: {
              username,
              phone,
              password,
              family_id,
              avatarUrl: res.result.avatarUrl
            },
            success: regRes => {
              if (regRes.result.code === 200) {
                wx.showToast({
                  title: '注册成功',
                  icon: 'success'
                })
                wx.navigateBack()
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
        } else {
          wx.showToast({
            title: res.result.error,
            icon: 'none'
          });
        }
      },
      fail: err => {
        console.error('调用云函数失败:', err);
        wx.showToast({
          title: '调用云函数失败',
          icon: 'none'
        });
      }
    });
  },
  async uploadFile(image) {
    const cloudPath = `avators/${Date.now()}-${Math.floor(Math.random() * 1000)}.png`;
    wx.cloud.uploadFile({
      cloudPath,
      filePath: image,
      success: res => {
        console.log('上传成功', res.fileID);
        return res.fileID
      },
      fail: err => {
        console.error('上传失败', err);
      }
    });
  }
})