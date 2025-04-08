Page({
  data: {
    content: '',
    imageUrl: ''
  },
  handleContentInput(e) {
    this.setData({
      content: e.detail.value
    });
  },

  submitPost: function () {
    const { content } = this.data;
    if (content.trim() === '') {
      wx.showToast({
        title: '请输入帖子内容',
        icon: 'none'
      });
      return;
    }
    const userInfo = wx.getStorageSync('token'); // 假设用户信息已存储在本地缓存中
    wx.cloud.callFunction({
      name: 'newPost',
      data: {
        postData: {
          userId: userInfo._id,
          name: userInfo.username,
          content,
          postTime: new Date(),
          likeNum: 0,
          commentNum: 0,
          isLiked: false
        }
      },
      success: res => {
        if (res.result.success) {
          wx.showToast({
            title: '发布成功',
            icon: 'success'
          });
          const pages = getCurrentPages();
          const prevPage = pages[pages.length - 2]; // 获取上一个页面（即 community 页面）
          if (prevPage) {
            prevPage.setData({
              page: 1
            })
            // 调用 community 页面的重新加载数据方法
            if (typeof prevPage.loadPosts === 'function') {
              prevPage.loadPosts();
            }
            // 返回上一个页面
            wx.navigateBack({
              delta: 1
            });
          }
        } else {
          wx.showToast({
            title: '发布失败',
            icon: 'none'
          });
        }
      },
      fail: err => {
        wx.showToast({
          title: '发布失败',
          icon: 'none'
        });
        console.error(err);
      }
    });
  }
});