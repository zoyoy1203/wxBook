Page({

  /**
   * 页面的初始数据
   */
  data: {
    bookList: [],
    pn: 0,
    index:242
  },
  onPullDownRefresh: function () {
    this.bookRequest()
  },
  onReachBottom: function () {
    this.bookRequest()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      index:options.index
    })
    this.bookRequest()
  },
  bookRequest: function () {
    var that = this
    wx.request({
      url: 'http://apis.juhe.cn/goodbook/query?key=065cc07809f44ffeaec439e3d8694cc7&catalog_id=' + this.data.index + '&pn=' + this.data.pn + '&rn=10',
      header: {
        'content-type': 'application/json' // 默认值
      },
      method: 'get',
      success(res) {
        let pn1 = that.data.pn + 10
        that.setData({
          pn: pn1
        })
        console.log('pn=', that.data.pn)
        console.log(res.data.result.data)
        that.processBooklistData(res.data.result.data)
      },
      fail: function (error) {
        console.log(error)
      }
    })
  },
  //图书数据处理
  processBooklistData(booklist) {
    var books = [];
    for (var idx in booklist) {
      var book = booklist[idx];
      var tags = book.tags.split(" ");
      var catalog = book.catalog.split(" ");
      var address = book.online.split(" ");
      // tags=tags.slice(0,2);
      //书籍内容简介截取45字符
      var sub2 = book.sub2;

      if (sub2.length >= 45) {
        sub2 = sub2.substring(0, 45) + "...";
      }

      var temp = {
        title: book.title,
        catalog: catalog,
        tags: tags,
        sub1: book.sub1,
        sub2: sub2,
        sub3: book.sub2,
        img: book.img,
        num: book.reading,
        address: address,
        time: book.bytime
        // tags:tags

      }

      books.push(temp)
    }
    let new_data = books
    let old_data = this.data.bookList
    this.setData({
      bookList: old_data.concat(new_data)
    })
  }

})