const cloud = require('wx-server-sdk')
const env = "cloud1-2gtx0pq9d4989b4f"
cloud.init({
  env: env
})
const db = cloud.database()

exports.main = async (event, context) => {
  try {
    const { postId, userInfo, commentContent } = event;
    // 增加帖子评论数
    await db.collection('posts').doc(postId).update({
      data: {
        commentNum: db.command.inc(1)
      }
    });
    // 记录评论记录
    await db.collection('comments').add({
      data: {
        postId,
        userId: userInfo._id,
        username: userInfo.username,
        // avatarUrl: avatarUrl,
        content: commentContent,
        commentTime: db.serverDate()
      }
    });
    // 触发实时数据推送，通知客户端帖子有新评论
    // await cloud.callFunction({
    //   name: 'pushRealTimeData',
    //   data: {
    //     type: 'comment',
    //     data: {
    //       postId,
    //       userId,
    //       commentContent
    //     }
    //   }
    // });
    return {
      success: true,
      message: '评论成功'
    };
  } catch (e) {
    console.error(e);
    return {
      success: false,
      message: '评论失败',
      error: e
    };
  }
}