Page({
  data: {
    communityNotice: null,
    hotItems: [
      {
        id: 1,
        imageUrl: "/image/swiper/1.png",
        isActive: true
      },
      {
        id: 2,
        imageUrl: "/image/swiper/2.png",
        isActive: true
      },
      {
        id: 3,
        imageUrl: "/image/swiper/3.png",
        isActive: true
      }
    ]
  },
  // 页面初次加载时触发
  onLoad() {
    wx.cloud.callFunction({
      name: 'find_latest_notice',
      success: res => {
        if (res.result.code === 200) {
          this.setData({
            communityNotice: res.result.data.res
          })
          console.log(communityNotice)
        }
      }, fail: err => {
        console.error('调用云函数失败', err)
      }
    })
  }
  //   handleNavigate(e) {
  //     const { url } = e.detail;
  //     console.log("点击啦")
  //     // 这里可以根据需要进行额外的处理，比如页面跳转前的一些逻辑判断等
  //     if (url.startsWith('/pages')) {
  //       wx.switchTab({
  //         url: url
  //       });
  //     } else {
  //       wx.navigateTo({
  //         url: url
  //       });
  //     }
  //   }
  // }

});    