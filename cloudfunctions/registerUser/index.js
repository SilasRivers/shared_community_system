const cloud = require('wx-server-sdk')
const env = "cloud1-2gtx0pq9d4989b4f"
cloud.init({
  env: env
})
const db = cloud.database()

exports.main = async (event, context) => {
  const {
    username,
    phone,
    password,
    family_id
  } = event
  try {
    const isRepeatReg = await db.collection('user').where({
      phone: phone
    }).get()
    if (isRepeatReg.data.length > 0) {
      return {
        code: 400,
        message: '手机号已注册'
      }
    }
    const res = await db.collection('user').add({
      data: {
        username,
        phone,
        password,
        family_id,
        createTime: db.serverDate()
      }
    })
    return {
      code: 200,
      message: '注册成功',
      data: {
        id: res._id
      }
    }
  } catch (e) {
    console.error('注册出错：', e)
    return {
      code: 500,
      message: '注册失败'
    }
  }
}