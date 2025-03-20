// 云函数入口文件
const cloud = require('wx-server-sdk')
const env = "cloud1-2gtx0pq9d4989b4f"
cloud.init({
  env: env
})
const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    // 获取当前时间
    const now = new Date()
    // 计算一周前的时间
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    const res = await db.collection('notice')
        .where({
          create_time: _.gt(oneWeekAgo) // 筛选出 create_time 大于一周前时间的数据
        }).orderBy('create_time', 'desc').limit(1).get()
    if (res.data.length > 0) {
      return {
        code: 200,
        data: {
          res: res.data[0].text
        }
      }
    } else {
      return {
        code: '201'
      }
    }
  } catch (e) {
    console.error('公告获取失败：', e)
    return {
      code: 500
    }
  }
}