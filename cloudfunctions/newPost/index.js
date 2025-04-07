const cloud = require('wx-server-sdk')
const env = "cloud1-2gtx0pq9d4989b4f"
cloud.init({
  env: env
})
const db = cloud.database()
exports.main = async (event, context) => {
  try {
    const { postData } = event;
    const res = await db.collection('posts').add({
      data: postData
    });
    // 触发实时数据推送，通知客户端有新帖子
    // await cloud.callFunction({
    //   name: 'pushRealTimeData',
    //   data: {
    //     type: 'new_post',
    //     data: {
    //      ...postData,
    //       _id: res._id
    //     }
    //   }
    // });
    return {
      success: true,
      message: '帖子发布成功'
    };
  } catch (e) {
    console.error(e);
    return {
      success: false,
      message: '帖子发布失败',
      error: e
    };
  }
}