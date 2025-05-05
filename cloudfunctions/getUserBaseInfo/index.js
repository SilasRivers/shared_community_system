const cloud = require('wx-server-sdk')
const env = "cloud1-2gtx0pq9d4989b4f"
cloud.init({
  env: env
})
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  const { id } = event
  try {
    const res = await db.collection('user').doc(id).field({
      username: true,
      avatarUrl: true
    }).get()
    return {
      code: 200,
      data: res.data
    }
  } catch (err) {
    console.error('查询发布类型失败', err);
    return null;
  }
}