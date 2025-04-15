Page({
  data: {
    currentIdx: 0,
    tabList: ['待处理', '已处理', '我的帮助'],
    contentList: []
  },
  onLoad() {
    this.fetchData(this.data.currentIdx);
  },
  switchTab(e) {
    const index = e.currentTarget.dataset.index;
    this.setData({
      currentIdx: index
    });
    this.fetchData(index);
  },
  async fetchData(index) {
    let status;
    switch (index) {
      case 0:
        status = false;
        break;
      case 1:
        status = true;
        break;
      case 2:
        status = null;
        break;
    }
    const userInfo = wx.getStorageSync('token')
    wx.cloud.callFunction({
      name: 'searchOrder',
      data: {
        status: status,
        user_id: userInfo._id,
        family_id: userInfo.family_id
      },
      success: res => {
        this.setData({
          contentList: res.result
        });
      },
      fail: err => {
        console.error('调用云函数失败', err);
      }
    });
  },
  goToDetail(e) {
    const productId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/detail/detail?id=${productId}&flag=1&del=${this.data.currentIdx}`
    });
  },
  goToPublish(e) {
    wx.switchTab({
      url: '/pages/publish/publish',
    })
  }
});