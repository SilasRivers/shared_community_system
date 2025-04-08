Page({
  data: {
    communityNotice: null,
    hotItems: [],
    showOtherCommunity: false,
    visiblePublishTypes: [],
    allPublishTypes: [],
    selectedTypeIndex: 0,
    selectedTabIndex: 0, // 初始选中的索引,
    selectedTypeId: 1,
    hasMoreTypes: false,
    isExpanded: false,
    originalWidth: null, // 新增，记录滚动视图初始宽度
    // 商品加载
    goodsList: [],       // 商品列表数据
    page: 1,             // 当前页码
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
    this.loadNotice();
    this.fetchPublishTypes();
    this.loadGoodsList();
    // this.startWatching();
    this.loadSwiper();
  },

  onUnload() {
    if (this.data.watcher) {
      this.data.watcher.close();
    }
  },
  async loadSwiper() {
    wx.cloud.callFunction({
      name: 'getSwiper',
      success: res => {
        if (res.result.code == 200) {
          this.setData({
            hotItems: res.result.data.data
          })
        }
      }
    })
  },
  async loadNotice() {
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
    const { page, pageSize, goodsList, selectedTypeId } = this.data
    try {
      const res = await wx.cloud.callFunction({
        name: 'searchGoodsListByPage',
        data: {
          publishType: selectedTypeId,
          page: page,
          pageSize: pageSize
        }
      });
      this.setData({
        goodsList: [...goodsList, ...res.result.list],
        page: page + 1
      });
    } catch (error) {
      console.error('加载商品列表失败:', error);
    }
  },
  async fetchPublishTypes(e) {
    wx.cloud.callFunction({
      name: 'getPublishTypes',
      success: res => {
        if (res.result.code === 200) {
          const visible = res.result.data.data.slice(0, 4);
          const hasMore = res.result.data.data.length > 4;
          this.setData({
            allPublishTypes: res.result.data.data,
            visiblePublishTypes: visible,
            hasMoreTypes: hasMore
            //.map(item => item.type)
          }, () => {
            // 在回调函数中查看更新后的值
            console.log('更新后的 publishTypes: ', this.data.allPublishTypes);
          });
        }
      },
      fail: err => {
        console.error('获取发布类型失败', err);
      }
    });
  },
  filterPostsByType(e) {
    const index = e.currentTarget.dataset.index;
    const selectedTypeId = this.data.allPublishTypes[index].id;
    this.setData({
      selectedTypeIndex: index,
      selectedTypeId: selectedTypeId,
      goodsList: [],
      page: 1
    }, () => {
      const query = wx.createSelectorQuery();
      query.select('.tab-scroll').boundingClientRect((rect) => {
        this.setData({
          originalWidth: rect.width // 获取滚动视图初始宽度
        });
      }).exec();
    })
    this.loadGoodsList();
  },
  goToDetail(e) {
    const productId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/detail/detail?id=${productId}`
    });
  },
  showMoreTypes() {
    const { allPublishTypes, originalWidth, isExpanded } = this.data;
    if (!isExpanded) {
      this.setData({
        visiblePublishTypes: allPublishTypes,
        hasMoreTypes: false,
        isExpanded: true
      }, () => {
        const query = wx.createSelectorQuery();
        query.select('.tab-scroll').boundingClientRect((rect) => {
          const newWidth = rect.width;
          wx.createAnimation({
            duration: 300,
            timingFunction: 'ease'
          }).width(newWidth).step();
          this.setData({
            ['animationData.width']: newWidth
          });
        }).exec();
      });
    } else {
      this.setData({
        visiblePublishTypes: allPublishTypes.slice(0, 4),
        hasMoreTypes: true,
        isExpanded: false
      }, () => {
        const query = wx.createSelectorQuery();
        query.select('.tab-scroll').boundingClientRect((rect) => {
          const newWidth = originalWidth;
          wx.createAnimation({
            duration: 300,
            timingFunction: 'ease'
          }).width(newWidth).step();
          this.setData({
            ['animationData.width']: newWidth
          });
        }).exec();
      });
    }
  },
  // 滚动到底部触发加载
  onReachBottom() {
    this.loadGoodsList();
  }

});    