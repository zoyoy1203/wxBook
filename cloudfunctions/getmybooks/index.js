// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  let catalogs = db.collection('mybooks').where({
    _openid: event.openid,
    title:event.title
  }).get()
  if (catalogs == '') {
    return
  }
  return catalogs
}