const cloud = require('wx-server-sdk')
const env = "cloud1-2gtx0pq9d4989b4f"
cloud.init({
  env: env
})
const db = cloud.database()
exports.main = async (event, context) => {
  const { username, password } = event
  try {
    const userResp = await db.collection('user').where({
      username: username,
      password: password
    }).get()
    if (userResp.data.length === 0) {
      return {
        code: 500,
        message: "用户名不存在"
      }
    }
 
    return {
      code: 200,
      message: '登录成功',
      data: userResp
    }
  } catch (e) {
    console.log("登录出错：" + e)
    return {
      code: 500,
      message: "登录失败"
    }
  }
}