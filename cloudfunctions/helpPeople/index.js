const cloud = require('wx-server-sdk')
const env = "cloud1-2gtx0pq9d4989b4f"
cloud.init({
  env: env
})
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    const { id, user_id } = event;
    // 这里假设你要将某个字段的值加 1，你可以根据实际需求修改
    const res = await db.collection('demands').doc(id).update({
      data: {
        status: true,
        target_user_id: user_id
      }
    });
    return res.stats.updated > 0;
  } catch (err) {
    console.error('修改数据库失败', err);
    return false;
  }
};