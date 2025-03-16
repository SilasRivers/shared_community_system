Component({
  methods: {
      navigateToPage(e) {
          const url = e.currentTarget.dataset.url;
          wx.navigateTo({
              url: url
          });
      }
  }
});    