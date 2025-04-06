Page({
  data: {
      currentIdx: 0,
      tabList: ['在卖', '已下架'],
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
  fetchData(index) {
      let status;
      switch (index) {
          case 0:
              status = false;
              break;
          case 1:
              status = true;
              break;
      }
      wx.cloud.callFunction({
          name: 'searchOrder',
          data: {
              status: status,
              family_id: wx.getStorageSync('token').family_id
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
        url: `/pages/detail/detail?id=${productId}`
    });
  },
  goToPublish(e){
    wx.switchTab({
      url: '/pages/publish/publish',
    })
  }
});