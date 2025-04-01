Page({
  data: {
    item: {}
  },
  onLoad(options) {
    const productId = options.id;
    // 实际开发中应使用以下方式调用云函数获取数据
    wx.cloud.callFunction({
      name: 'getDetails',
      data: {
        id: productId
      },
      success: res => {
        if (res.result) {
          const item = res.result.data;
          const date = new Date(item.create_time);
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
          // 处理发布时间
          if (item.create_time) {
            item.create_time = `${year}年${month}月${day}日`;
          }
          this.setData({
            item: item
          });
        }
      },
      fail: err => {
        console.error('获取商品详情失败', err);
      }
    });
  }
});