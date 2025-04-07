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

  removeImage: function () {
    this.setData({
      imageUrl: ''
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
          wx.navigateBack({});
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