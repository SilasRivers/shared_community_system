const cloud = require('wx-server-sdk')
const env = "cloud1-2gtx0pq9d4989b4f"
cloud.init({
  env: env
})
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    const res = await db.collection('swiper')
      .orderBy('create_time', 'desc')
      .limit(5)
      .get()
    return {
      code: 200,
      data: res
    };
  } catch (e) {
    console.error('查询发布类型失败', e);
    return null;
  }
}