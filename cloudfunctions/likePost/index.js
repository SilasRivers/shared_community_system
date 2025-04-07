const cloud = require('wx-server-sdk')
const env = "cloud1-2gtx0pq9d4989b4f"
cloud.init({
  env: env
})
const db = cloud.database()

exports.main = async (event, context) => {
  try {
    const { postId, userId } = event;
    // 增加帖子点赞数
    await db.collection('posts').doc(postId).update({
      data: {
        likeNum: db.command.inc(1)
      }
    });
    // 记录点赞记录
    await db.collection('likes').add({
      data: {
        postId,
        userId
      }
    });
    // 触发实时数据推送，通知客户端帖子被点赞
    await cloud.callFunction({
      name: 'pushRealTimeData',
      data: {
        type: 'like',
        data: {
          postId,
          userId
        }
      }
    });
    return {
      success: true,
      message: '点赞成功'
    };
  } catch (e) {
    console.error(e);
    return {
      success: false,
      message: '点赞失败',
      error: e
    };
  }
}