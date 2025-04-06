const cloud = require('wx-server-sdk')
const env = "cloud1-2gtx0pq9d4989b4f"
cloud.init({
  env: env
})
const db = cloud.database()
exports.main = async (event, context) => {
  const { family_id, family_name } = event
  try {
    const res = await db.collection('family').add({
      data: {
        family_id,
        family_name
      }
    })
    return {
      code: 200,
      message: '家庭信息创建成功',
      data: {
        id: res.family_id
      }
    }
  } catch (e) {
    console.error('创建家庭信息出错：', e)
    return {
      code: 500,
      message: '创建家庭信息失败'
    }
  }
}