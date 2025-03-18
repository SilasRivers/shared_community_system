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
    navigateToPage(e) {
      console.log("点击")
      // const index = e.currentTarget.dataset.index;
      const url = e.currentTarget.dataset.url;
      // const newNavItems = this.properties.navItems.map((item, i) => {
      //   return {
      //     ...item,
      //     isActive: i === index
      //   };
      // });
      // this.setData({
      //   activeIndex: index,
      //   navItems: newNavItems
      // });
      // if (url.startsWith('/pages')) {
      //   wx.switchTab({
      //     url: url
      //   });
      // } else {
        wx.navigateTo({
          url: url
        });
      }
      // this.triggerEvent('navigate', { url }); // 触发事件通知父组件进行页面跳转
    // }
  }
});    