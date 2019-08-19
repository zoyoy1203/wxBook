var rp = require('request-promise')

// 云函数入口函数
exports.main = (event, context) => {
  var res = rp('http://api.jisuapi.com/isbn/query?appkey=b83cf447cc27f634&isbn=' + event.isbn).then(html => {
    return html;
  }).catch(err => {
    console.log(err);
  })
  return res

}
