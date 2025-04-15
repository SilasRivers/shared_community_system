Page({
  data: {
    item: {},
    productId: '',
    flag: null,
    del: null
  },
  onLoad(options) {
    if (options.flag != null) {
      this.setData({
        flag: parseInt(options.flag)
      })
    }
    if (options.del != null) {
      this.setData({
        del: parseInt(options.del)
      })
    }
    this.setData({
      productId: options.id,
    })
    const id = options.id
    // 实际开发中应使用以下方式调用云函数获取数据
    wx.cloud.callFunction({
      name: 'getDetails',
      data: {
        id: id
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
  },
  handleHelp() {
    const { productId } = this.data
    console.log(productId)
    const userInfo = wx.getStorageSync('token')
    wx.cloud.callFunction({
      name: 'helpPeople', // 云函数名称
      data: {
        // 传递需要的数据，例如记录的 _id
        id: productId,
        user_id: userInfo._id
      },
      success: res => {
        if (res.result) {
          wx.showToast({
            title: '成功',
            icon: 'success',
            duration: 2000
          });
        } else {
          wx.showToast({
            title: '失败',
            icon: 'none',
            duration: 2000
          });
        }
      },
      fail: err => {
        console.error('调用云函数失败', err);
        wx.showToast({
          title: '调用云函数失败',
          icon: 'none',
          duration: 2000
        });
      }
    });
  }
});