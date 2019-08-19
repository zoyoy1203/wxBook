
const db = wx.cloud.database({});
const subscription = db.collection('subscription');
const app = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    columns: [],
    classTitle: [],
    bookclass_c: [],
    display: true,
    display1: true,
    subs: [],
    bookList: [],
    bookList1:[],
    pn: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.bookRequest1()
    var that = this


    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)

        app.globalData.openid = res.result.openid
        console.log(app.globalData.openid)

      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)

      }
    })

    // 调用云函数getsubs得到用户订阅数据
    wx.cloud.callFunction({
      name: 'getsubs',
      data: {
        openid: app.globalData.openid
      },
      success: res => {
        console.log(res.result.data)
        if (res.result.data.length <= 0) {
          console.log(this.data.display1)
          this.setData({
            display: false
          })
        } else {
          this.setData({
            display: true,
            display1: false,
            "bookclass_c[0]": res.result.data[0].bookclasstitle,
            "bookclass_c[1]": res.result.data[0].bookclasstitleindex
          })
          console.log(this.data.bookclass_c)
          this.bookRequest()
        }

      }
    })
  },
  onPullDownRefresh: function () {
    this.bookRequest1();
  },
  onReachBottom: function () {
    this.bookRequest1();
  },
  bookRequest1: function () {
    let catalog_id = Math.floor(Math.random() * 16 + 242);//获取200到250的随机整数
    let pn = 5
    let rn = 10
    var that = this;
    wx.request({
      url: 'http://apis.juhe.cn/goodbook/query?key=065cc07809f44ffeaec439e3d8694cc7&catalog_id=' + catalog_id + '&pn=' + pn + '&rn=' + rn,
      header: {
        'content-type': 'application/json' // 默认值
      },
      method: 'get',
      success(res) {
        console.log(res.data.result.data)
        that.processBooklistData1(res.data.result.data)
      },
      fail: function (error) {
        console.log(error)
      }
    })
  },
  processBooklistData1(booklist1) {
    let books = []
    for (var idx in booklist1) {
      var book = booklist1[idx];
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
    let old_data = this.data.bookList1
    this.setData({
      bookList1: old_data.concat(new_data)
    })
  },

  bookRequest: function () {

    console.log(this.data.bookclass_c)
    var that = this
    wx.request({
      url: 'http://apis.juhe.cn/goodbook/query?key=065cc07809f44ffeaec439e3d8694cc7&catalog_id=' + this.data.bookclass_c[1] + '&pn=' + this.data.pn + '&rn=10',
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
    let books = []
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
  },
  titleclick:function(event){
    console.log("1111")
    wx.navigateTo({
      url: '../recommend/recommend'
    })
  },
  titleclick1: function (event) {
    console.log("1111")
    wx.navigateTo({
      url: '../booklist/booklist'
    })
  },
  bookclick:function(event){
    console.log(event)
    var index=event.currentTarget.dataset.index
    wx.navigateTo({
      url: '../book/book?index='+index
    })
  },
  // errorFunction: function (event) {
  //   console.log(event)
  //   var index = event.currentTarget.dataset.index
   
  //   this.setData({
  //     [img]: '../../images/loading.gif'
  //   })
  // }
})