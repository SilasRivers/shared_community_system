const cloud = require('wx-server-sdk')
const env = "cloud1-2gtx0pq9d4989b4f"
cloud.init({
  env: env
})
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  try {
    const { status, family_id, user_id } = event
    if (status == null) {
      const res = await db.collection('demands')
        .where({
          target_user_id: user_id
        }).get()
      return res.data;
    }
    const res = await db.collection('demands')
      .where({
        status: status,
        family_id: family_id
      })
      .get()
    return res.data
  } catch (e) {
    console.error('查询数据库时出错:', e)
    return []
  }
}    