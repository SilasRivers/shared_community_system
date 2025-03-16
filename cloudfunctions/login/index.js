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
    // 生成唯一的token
    const token = Math.random().toString(36).substring(2) + Date.now().toString(36)
    const expireTime = Date.now() + 1800 * 1000 // 设置过期时间为半小时
    // 构造要存储的登录信息对象
    const loginInfo = {
      userId: userResp.data[0]._id,
      token,
      createTime: Date.now(),
      expireTime
    }
    // 将登录信息存储到Storage
    // wx.setStorage({
    //   key:'loginInfo',
    //   data: loginInfo
    // })
    return {
      code: 200,
      message: '登录成功',
      token: token
    }
  } catch (e) {
    console.log("登录出错：" + e)
    return {
      code: 500,
      message: "登录失败"
    }
  }
}