const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
const _ = db.command

exports.main = async (event, context) => {
  try {
    return await db.collection('subscription').where({
      _openid: event.openid
    })
    .update({
      data: {
        bookclasstitle:event.bookclasstitle,
        bookclasstitleindex:event.bookclasstitleindex,
      },
    })
  } catch (e) {
    console.error('出错',e)
  }
}