Page({
  data: {
    item: {},
    productId: '',
    flag: null,
    del: null,
    isOwner: false,
    isDel: false,
    helpUserInfo: {}
  },
  onLoad(options) {
    this.setData({
      isOwner: JSON.parse(options.isOwner),
      productId: options.id,
      isDel: JSON.parse(options.del)
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
          const hours = String(date.getHours()).padStart(2, '0');
          const minutes = String(date.getMinutes()).padStart(2, '0');
          // 处理发布时间
          if (item.create_time) {
            item.create_time = `${year}年${month}月${day}日 ${hours}:${minutes}`;
          }

          if (item.target_user_id != "") {
            this.setData({
              helpUserInfo: res.result.data.targetUserInfo
            })
            const item = res.result.data;
            const date = new Date(item.help_time);
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            // 处理发布时间
            if (item.help_time) {
              item.help_time = `${year}年${month}月${day}日 ${hours}:${minutes}`;
            }
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
  handleEdit() {
    const item = this.data.item;
    // 找到商品类型在 publishTypes 中的索引
    const publishTitle = item.title;
    const publishContent = item.content;
    const publishImages = item.images;
    const productId = this.data.productId
    const publishData = {
      publishTitle,
      publishContent,
      publishImages,
      productId
    };
    // 将数据存储到本地存储中
    wx.setStorageSync('publishData', publishData);
    wx.switchTab({
      url: `/pages/publish/publish`,
      success: function () {
        console.log('跳转到发布页面成功');
      },
      fail: function (err) {
        console.error('跳转到发布页面失败:', err);
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