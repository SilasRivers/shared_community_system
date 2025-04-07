const cloud = require('wx-server-sdk')
const env = "cloud1-2gtx0pq9d4989b4f"
cloud.init({
  env: env
})
const db = cloud.database()
exports.main = async (event, context) => {
  try {
    const { page = 1, pageSize = 10 } = event; // 默认第一页，每页10条数据
    const skip = (page - 1) * pageSize;
    const res = await db.collection('posts')
     .orderBy('postTime', 'desc') // 按发布时间倒序排列
     .skip(skip)
     .limit(pageSize)
     .get();
    return {
      success: true,
      message: '帖子获取成功',
      data: res.data
    };
  } catch (e) {
    console.error(e);
    return {
      success: false,
      message: '帖子获取失败',
      error: e
    };
  }
}