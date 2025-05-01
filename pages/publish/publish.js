Page({
  data: {
    publishTypes: [],
    selectedTypeIndex: 0,
    selectedTypeId: null,
    publishTitle: '',
    publishContent: '',
    publishImages: [],
    isUpdate: false,
    productId: null
  },
  onLoad(options) {
    // 从本地存储中获取数据
    const publishData = wx.getStorageSync('publishData');
    if (publishData) {
      this.setData({
        productId: publishData.productId,
        publishTitle: publishData.publishTitle,
        publishContent: publishData.publishContent,
        publishImages: publishData.publishImages
      });
      // 使用完后删除本地存储中的数据
      wx.removeStorageSync('publishData');
    }
    this.fetchPublishTypes();
  },
  fetchPublishTypes() {
    wx.cloud.callFunction({
      name: 'getPublishTypes',
      success: res => {
        if (res.result.code === 200) {
          this.setData({
            publishTypes: res.result.data.data
            //.map(item => item.type)
          }, () => {
            // 在回调函数中查看更新后的值
            console.log('更新后的 publishTypes: ', this.data.publishTypes);
          });
        }
      },
      fail: err => {
        console.error('获取发布类型失败', err);
      }
    });
  },
  onPublishTypeChange(e) {
    const index = e.detail.value
    const selectedType = this.data.publishTypes[index];
    this.setData({
      selectedTypeIndex: index,
      selectedTypeId: selectedType.id // 更新选择的类型的 id
    });
  },
  handleFocus: function (e) {
    if (inputTitleValue != '')
      this.setData({
        inputTitleValue: '' // 输入框获得焦点时，设置 value 为空字符串，隐藏占位符
      });
  },
  handleBlur: function (e) {
    const value = e.detail.value;
    if (value === '') {
      this.setData({
        inputTitleValue: null // 输入框失去焦点且值为空时，设置 value 为 null，显示占位符
      });
    } else {
      this.setData({
        publishTitle: value // 有输入内容时，更新发布标题
      });
    }
  },
  handleTitleInput(e) {
    this.setData({
      publishTitle: e.detail.value
    });
  },
  handleContentInput(e) {
    this.setData({
      publishContent: e.detail.value
    });
  },
  chooseImage() {
    wx.chooseImage({
      count: 9,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        this.setData({
          publishImages: this.data.publishImages.concat(res.tempFilePaths)
        });
      }
    });
  },
  deleteImage(e) {
    const index = e.currentTarget.dataset.index;
    const images = this.data.publishImages;
    images.splice(index, 1);
    this.setData({
      publishImages: images
    });
  },
  async publish() {
    const { publishTypes, selectedTypeIndex, selectedTypeId, publishTitle, publishContent, publishImages,productId } = this.data;
    const publishType = publishTypes[selectedTypeIndex];
    if (!publishType) {
      wx.showToast({
        title: '请选择发布类型',
        icon: 'none'
      });
      return;
    }
    if (!publishTitle) {
      wx.showToast({
        title: '请输入发布标题',
        icon: 'none'
      });
      return;
    }
    if (!publishContent) {
      wx.showToast({
        title: '请输入发布内容',
        icon: 'none'
      });
      return;
    }

    // 上传图片到云存储
    const imageUrls = await this.uploadImages(publishImages);
    const userInfo = wx.getStorageSync('token')
    wx.cloud.callFunction({
      name: 'publish',  // 调用的云函数名称，需要与云函数实际名称一致
      data: {
        type: publishTypes[selectedTypeIndex].id,
        title: publishTitle,
        content: publishContent,
        family_id: userInfo.family_id,
        images: imageUrls,
        status: false,
        user_id: userInfo._id,
        createTime: new Date(),  // 添加发布时间
        productId: productId
      },
      success: res => {
        if (res.result.code == 200) {
          wx.showToast({
            title: res.result.message,
            icon: 'success'
          });
          console.log("发布成功")
          // 清空发布标题和内容
          this.setData({
            publishTitle: '',
            publishContent: '',
            publishImages: []
          }, () => {
            // 页面更新完成后返回上一页
            wx.navigateBack({
              delta: 1
            });
          });
          // wx.navigateTo({
          //   url: '/pages/index/index',
          // })
        } else {
          wx.showToast({
            title: res.result.message,
            icon: 'none'
          });
        }
      },
      fail: err => {
        console.error('调用云函数失败', err);
        wx.showToast({
          title: '发布失败',
          icon: 'none'
        });
      }
    });
  },
  async uploadImages(images) {
    const imageUrls = [];
    for (let i = 0; i < images.length; i++) {
      if (images[i].startsWith('cloud')) {
        imageUrls.push(images[i]);
      } else {
        const imagePath = images[i];
        const cloudPath = `images/${Date.now()}-${i}-${Math.floor(Math.random() * 1000)}.png`;
        try {
          const uploadRes = await wx.cloud.uploadFile({
            cloudPath,
            filePath: imagePath
          });
          const fileID = uploadRes.fileID;
          imageUrls.push(fileID);
        } catch (error) {
          console.error(`图片上传失败: ${error}`);
        }
      }
    }
    return imageUrls;
  }
})