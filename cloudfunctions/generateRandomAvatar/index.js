const cloud = require('wx-server-sdk')
const env = "cloud1-2gtx0pq9d4989b4f"
cloud.init({
  env: env
})
const axios = require('axios');
const fs = require('fs');
const path = require('path');
// 获取随机头像 URL
async function getRandomAvatarUrl() {
  try {
    const response = await axios.get('https://picsum.photos/200');
    const avatarUrl = response.request.res.responseUrl;
    return avatarUrl;
  } catch (error) {
    console.error('获取随机头像 URL 失败:', error);
    return null;
  }
}

// 下载图片到本地临时文件
async function downloadImage(url) {
  try {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    const buffer = Buffer.from(response.data, 'binary');
    const fileName = `avatar_${Date.now()}.jpg`;
    const filePath = `/tmp/${fileName}`;
    fs.writeFileSync(filePath, buffer);
    return filePath;
  } catch (error) {
    console.error('下载图片失败:', error);
    return null;
  }
}

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    // 获取随机头像 URL
    const avatarUrl = await getRandomAvatarUrl();
    if (!avatarUrl) {
      return {
        success: false,
        error: '获取随机头像 URL 失败'
      };
    }else{
      return {
        success: true,
        avatarUrl: avatarUrl
      }
    }
  //   // 下载图片到本地临时文件
  //   const localFilePath = await downloadImage(avatarUrl);
  //   if (!localFilePath) {
  //     return {
  //       success: false,
  //       error: '下载图片失败'
  //     };
  //   }
  //   // 上传图片到云存储
  //   const uploadResult = await cloud.uploadFile({
  //     cloudPath: `avatars/${path.basename(localFilePath)}`,
  //     filePath: localFilePath
  //   });
  //   // 删除临时文件
  //   fs.unlinkSync(localFilePath);

  //   // 返回云存储的文件 URL
  //   return {
  //     success: true,
  //     avatarUrl: uploadResult.fileID
  //   };

  } catch (error) {
    console.error('获取随机头像并上传到云存储失败:', error);
    return {
      success: false,
      error: '获取随机头像并上传到云存储失败'
    };
  }
}    