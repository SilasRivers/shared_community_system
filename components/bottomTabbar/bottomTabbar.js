Component({
  properties: {
    navItems: {
      type: Array,
      value: []
    }
  },
  data: {
    activeIndex: 0 // 用于记录当前被点击的导航项索引，初始值为 -1 表示没有被点击
  },
  
  methods: {
    switchToIndex(){
      wx.switchTab({
        url: '/pages/index/index',
      })
    },
    switchToOrder(){
      wx.switchTab({
        url: '/pages/order/order',
      })
    },
    switchToMe(){
      wx.switchTab({
        url: '/pages/me/me',
      })
    },
    switchToItem(){
      wx.switchTab({
        url: '/pages/items/items',
      })
    },
    navigateToPage(e) {
      console.log("点击")
      const url = e.currentTarget.dataset.url;
        wx.navigateTo({
          url: url
        });
      }
  }
});    