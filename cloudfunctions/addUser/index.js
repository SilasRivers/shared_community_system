const cloud = require('wx-server-sdk')
const env = "cloud1-2gtx0pq9d4989b4f"
cloud.init({
  env: env
})

const db = cloud.database();

exports.main = async (event, context) => {
  const { username, age } = event
  try {
    // 向 user 集合中添加一条新记录
    const res = await db.collection('user').add({
      data: {
          username,
          age
      }
    })
    return {
      code: 200,
      message: '用户信息添加成功',
      data: {
          id: res._id // 返回新添加记录的 ID
      }
    }
  }catch (e) {
      console.error('添加用户信息失败：', e)
      return {
          code: 500,
          message: '添加用户信息失败',
          error: e
      }
  }
}
