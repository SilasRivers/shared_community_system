const cloud = require('wx-server-sdk')
const env = "cloud1-2gtx0pq9d4989b4f"
cloud.init({
  env: env
})
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  try {
      const { status,family_id } = event
      const res = await db.collection('demands')
         .where({
              status: status?true:false,
              family_id: family_id
          })
         .get()
      return res.data
  } catch (e) {
      console.error('查询数据库时出错:', e)
      return []
  }
}    