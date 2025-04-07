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
    }).orderBy('commentTime','desc').get({
      success: (res) => {
        const comments = res.data;
        comments.forEach((comment) => {
          const commentDate = new Date(comment.commentTime);
          const commentYear = commentDate.getFullYear();
          const commentMonth = String(commentDate.getMonth() + 1).padStart(2, '0');
          const commentDay = String(commentDate.getDate()).padStart(2, '0');
          comment.commentTime = `${commentYear}-${commentMonth}-${commentDay}`;
        });
        this.setData({ comments: comments });
      },
      fail: (err) => {
        console.error(err);
      }
    });
  }
});