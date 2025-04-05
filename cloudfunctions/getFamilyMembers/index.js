// 云函数入口文件
const cloud = require('wx-server-sdk')
const env = "cloud1-2gtx0pq9d4989b4f"
cloud.init({
  env: env
})
const db = cloud.database()
exports.main = async (event, context) => {
  const family_id = event.family_id;
  try {
      const res = await db.collection('user').where({
          family_id: family_id
      }).get();
      return {
          success: true,
          data: res.data
      };
  } catch (e) {
      return {
          success: false,
          error: e
      };
  }
};