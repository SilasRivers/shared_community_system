// app.js
App({
  onLaunch: function () {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力');
    } else {
      wx.cloud.init({
        // 此处填入你的云开发环境 ID
        env: 'cloud1-2gtx0pq9d4989b4f',
        traceUser: true
      });
    }
  }
})
