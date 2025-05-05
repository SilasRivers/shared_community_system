Page({
  data: {
    post: {},
    comments: []
  },
  onLoad: function (options) {
    const postData = decodeURIComponent(options.postData); // 解码数据
    const post = JSON.parse(postData); // 转换回对象
    this.setData({ post });

    // 以下是获取评论的代码，可根据需要调整
    wx.cloud.database().collection('comments').where({
      postId: post._id
    }).orderBy('commentTime', 'desc').get({
      success: async (res) => {
        const comments = res.data;
        const promises = comments.map(async (comment) => {
          const commentDate = new Date(comment.commentTime);
          const commentYear = commentDate.getFullYear();
          const commentMonth = String(commentDate.getMonth() + 1).padStart(2, '0');
          const commentDay = String(commentDate.getDate()).padStart(2, '0');
          const hours = String(commentDate.getHours()).padStart(2, '0');
          const minutes = String(commentDate.getMinutes()).padStart(2, '0');
          comment.commentTime = `${commentYear}-${commentMonth}-${commentDay}  ${hours}:${minutes}`;

          try {
            const res = await wx.cloud.callFunction({
              name: "getUserBaseInfo",
              data: { id: comment.userId }
            });
            if (res.result.data != "") {
              comment.avatarUrl = res.result.data.avatarUrl;
              comment.username = res.result.data.username
            }
          } catch (err) {
            console.error('查询评论详细失败', err);
          }
          return comment;
        });

        const updatedComments = await Promise.all(promises);
        console.log(updatedComments);
        this.setData({ comments: updatedComments });
      },
      fail: (err) => {
        console.error(err);
      }
    });
  }
});