// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const fileList = ['cloud://zyy-b2c6cd.7a79-zyy-b2c6cd/music1.mp3', 'cloud://zyy-b2c6cd.7a79-zyy-b2c6cd/music2.mp3', 'cloud://zyy-b2c6cd.7a79-zyy-b2c6cd/music3.mp3','cloud://zyy-b2c6cd.7a79-zyy-b2c6cd/music4.m4a']
  const result = await cloud.getTempFileURL({
    fileList,
  })
  return result.fileList
}