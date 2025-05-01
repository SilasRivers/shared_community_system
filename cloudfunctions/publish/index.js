const cloud = require('wx-server-sdk')
const env = "cloud1-2gtx0pq9d4989b4f"
cloud.init({
  env: env
})
const db = cloud.database()

exports.main = async (event, context) => {
  const {
    type,
    title,
    content,
    family_id,
    images,
    user_id,
    status,
    productId
  } = event
  if (productId == null) {
    try {
      const res = await db.collection('demands').add({
        data: {
          type,
          title,
          content,
          family_id,
          user_id,
          images,
          status,
          target_user_id: '',
          create_time: db.serverDate(),
          help_time: ""
        }
      })
      return {
        code: 200,
        message: "发布成功"
      }
    } catch (e) {
      return {
        code: 500,
        message: "发布失败"
      }
    }
  } else {
    try {
      const res = await db.collection('demands').doc(productId).update({
        data: {
          type,
          title,
          content,
          images,
          // 这里如果需要更新 create_time，可以去掉注释
          create_time: db.serverDate()
        }
      })
      return {
        code: 200,
        message: "修改成功"
      }
    } catch (e) {
      return {
        code: 500,
        message: "修改失败: " + e.message
      }
    }
  }
}