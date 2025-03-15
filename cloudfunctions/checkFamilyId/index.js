// cloudfunctions/checkFamilyNumber/index.js
const cloud = require('wx-server-sdk')
const env = "cloud1-2gtx0pq9d4989b4f"
cloud.init({
  env: env
})
const db = cloud.database()

exports.main = async (event, context) => {
    const { family_id } = event
    try {
        const res = await db.collection('family').where({
            family_id: family_id
        }).get()
        return {
            code: 200,
            isExists: res.data.length > 0
        }
    } catch (e) {
        console.error('检查家庭号出错：', e)
        return {
            code: 500,
            isExists: false
        }
    }
}