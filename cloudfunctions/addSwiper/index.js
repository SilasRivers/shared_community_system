const cloud = require('wx-server-sdk')
const env = "cloud1-2gtx0pq9d4989b4f"
cloud.init({
  env: env
})
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const { id } = event;
  try {
    const res = await db.collection('demands').where({ _id: id }).get()
    if (res.data.length > 0) {
      // 将查询到的数据插入到目标表
      console.log(res.data[0])
      const targetRes = await db.collection('swiper')
        .add({
          data: { ...res.data[0] }
        });
    } else {
      return {
        success: false,
        message: ' 未找到对应 _id 的商品数据 '
      };
    }
  } catch (e) {
    console.error('添加轮播图失败：', e)
    return {
      code: 500,
      message: '添加轮播图失败：'
    }
  }
}