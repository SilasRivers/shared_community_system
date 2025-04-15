const cloud = require('wx-server-sdk')
const env = "cloud1-2gtx0pq9d4989b4f"
cloud.init({
  env: env
})
const db = cloud.database()
exports.main = async (event, context) => {
  const { page = 1, pageSize = 10, publishType } = event;
  const skipCount = (page - 1) * pageSize;

  try {
    let query = await db.collection('demands')
      .where({ status: false, type: publishType })
      .orderBy('create_time', 'desc')
      .skip(skipCount)
      .limit(pageSize);
    // 如果有 publishType 参数，添加筛选条件
    // if (publishType) {
    //   query = query.where({
    //     type: publishType
    //   });
    // }
    const goodsList = await query.get();
    // 获取总数据量
    const totalRes = await db.collection('demands').count();
    const total = totalRes.total;
    return {
      list: goodsList.data,
      total
    };
  } catch (error) {
    console.error('云函数查询失败:', error);
    throw new Error('服务器错误');
  }
};