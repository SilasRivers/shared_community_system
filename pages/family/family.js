Page({
  data: {
    familyMembers: [] // 家庭成员信息列表
  },
  onLoad(options) {
    if (options.members) {
      console.log(options)
      const members = JSON.parse(decodeURIComponent(options.members));
      this.setData({
        familyMembers: members
      });
    }
  }
});