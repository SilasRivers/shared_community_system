Page({
  data: {
    userInfo: {
      avatarUrl: 'https://c-ssl.duitang.com/uploads/item/201903/15/20190315222520_i48yn.jpeg', // 替换为真实头像地址
      nickName: '用户昵称'
    },
    itemCount: 0, // 我的闲置数量
    familyMemberCount: 0, // 家庭成员数量
    familyMembersList: []
  },
  onLoad() {
    const family_id = wx.getStorageSync('token').family_id;
    if (family_id) {
      wx.cloud.callFunction({
        name: 'getFamilyMembers',
        data: {
          family_id: family_id
        },
        success: res => {
          if (res.result.success) {
            this.setData({
              familyMembersList: res.result.data,
              familyMemberCount: res.result.data.length
            });
          } else {
            console.error('获取家庭成员信息失败', res.result.error);
          }
        },
        fail: err => {
          console.error('调用云函数失败', err);
        }
      });
    } else {
      console.error('未获取到用户 ID');
    }
  },
  // 联系客服
  contactCustomerService() {
    wx.makePhoneCall({
      phoneNumber: 'xxxxxxxxxxx'
    });
  },
  // 退出登录
  handleLogout() {
    // 清除登录相关缓存（如用户信息、token等）
    wx.removeStorageSync('token')

    // 跳转到登录页面（假设登录页路径为 /pages/login/login）
    wx.redirectTo({
      url: '/pages/login/login',
    });
  },
});