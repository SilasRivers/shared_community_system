const cloud = require('wx-server-sdk')
const env = "cloud1-2gtx0pq9d4989b4f"
cloud.init({
  env: env
})
const db = cloud.database()
exports.main = async (event, context) => {
  const {publishType } = event;
  try {
    const goodsList = await db.collection('demands')
      .where({ 'status': false,'type': publishType })
      .get()
    return {
      data: goodsList.data
    };
  } catch (error) {
    console.error('云函数查询失败:', error);
    throw new Error('服务器错误');
  }
};