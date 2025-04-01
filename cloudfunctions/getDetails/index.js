// 云函数入口文件
const cloud = require('wx-server-sdk')
const env = "cloud1-2gtx0pq9d4989b4f"
cloud.init({
  env: env
})
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  try {
    // 从事件对象中获取传入的商品 id
    const { id } = event
    // 从数据库中查询对应 id 的商品信息
    const res = await db.collection('demands').doc(id).get()
    const publishTypeRes = await db.collection('family').where({
      id: res.data.family_id}).get()
    // 返回查询到的商品信息
    res.data.family_name=publishTypeRes.data[0].family_name
    return {
        data: res.data,
    }
  } catch (e) {
    // 若查询过程中出现错误，打印错误信息并返回 null
    console.error('获取商品详情出错', e)
    return null
  }
}