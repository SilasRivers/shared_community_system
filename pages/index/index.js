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
    ],
    selectedTabIndex: 0, // 初始选中的索引,
    // 商品加载
    goodsList: [],       // 商品列表数据
    currentPage: 1,             // 当前页码
    pageSize: 10,        // 每页显示数量
    hasMore: true,        // 是否还有更多数据,
    isLoading: false,
    watcher: null       //  用于监听页面变化
  },

  onShow: function () {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: this.data.selectedTabIndex
      });
    }
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
    }),
      this.loadGoodsList();
    this.startWatching();
  },

  onUnload() {
    if (this.data.watcher) {
      this.data.watcher.close();
    }
  },

  startWatching() {
    const db = wx.cloud.database();
    const watcher = db.collection('demands').watch({
      onChange: () => {
        // 数据发生变化，重置状态并重新加载数据
        this.setData({
          currentPage: 1,
          hasMore: true,
          goodsList: []
        });
        this.loadGoodsList();
      },
      onError: (err) => {
        console.error('监听数据变化出错:', err);
      }
    });
    this.setData({ watcher });
  },
  async loadGoodsList() {
    const { currentPage, pageSize, hasMore, isLoading } = this.data;
    if (!hasMore || isLoading) {
      return;
    }
    try {
      this.setData({ isLoading: true });
      const res = await wx.cloud.callFunction({
        name: 'searchGoodsListByPage',
        data: {
          page: currentPage,
          pageSize: pageSize
        }
      });
      const { list, total } = res.result;
      const newHasMore = currentPage * pageSize < total;
      this.setData({
        goodsList: this.data.goodsList.concat(list),
        currentPage: currentPage + 1,
        hasMore: newHasMore,
        isLoading: false
      });
    } catch (error) {
      console.error('加载商品列表失败:', error);
    }
  },
  // 滚动到底部触发加载
  onReachBottom() {
    this.loadGoodsList();
  }

});    