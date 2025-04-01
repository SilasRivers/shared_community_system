// 云函数入口文件
const cloud = require('wx-server-sdk')
const env = "cloud1-2gtx0pq9d4989b4f"
cloud.init({
  env: env
})
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  // 从事件对象中获取传入的商品 id
  const { id } = event
  // 从数据库中查询对应 id 的商品信息
  const res = await db.collection('family').doc(id).get()
  // 返回查询到的商品信息
  return res.data
}