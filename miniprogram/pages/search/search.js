// pages/search/search.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isbn: '',
    book: {}
  },

  //ibsn查询
  //搜索栏输入查询
  searchInput: function (e) {
    this.setData({
      isbn: e.detail
    })
    console.log(e.detail)
    this.bookRequest(e.detail)

  },
  //isbn扫码查询
  searchIsbn: function (e) {
    var that = this
    wx.scanCode({
      scanType: ['barCode'],
      success(res) {
        // console.log(res)
        that.setData({
          isbn: res.result
        })
        that.bookRequest(res.result)
      }
    })

  },
  bookRequest: function (isbn) {
    console.log(isbn)
    var that = this
    wx.request({
      url: 'http://api.jisuapi.com/isbn/query?appkey=b83cf447cc27f634&isbn=' + isbn,
      header: {
        'content-type': 'application/json' // 默认值
      },
      method: 'get',
      success(res) {
        console.log(res)
        that.processBookData(res.data.result)
      },
      fail: function (error) {
        console.log(error)
      }
    })
  },
  processBookData(bookdata) {
    var temp = {
      isbn: bookdata.isbn,
      title: bookdata.title,
      subtitle: bookdata.subtitle,
      pic: bookdata.pic,
      author: bookdata.author,
      summary: bookdata.summary,
      publisher: bookdata.publisher,
      pubplace: bookdata.pubplace,
      pubdate: bookdata.pubdate,
      price: bookdata.price,
      binding: bookdata.binding,
      keyword: bookdata.keyword,
      edition: bookdata.edition,
      language: bookdata.language,
      format: bookdata.format

    }
    this.setData({
      book: temp
    })
  }
})