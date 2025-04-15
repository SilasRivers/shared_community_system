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
    status
  } = event
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
      create_time: db.serverDate()
    }
  })
  return {
    code:200,
    message: "发布成功"
  }
}