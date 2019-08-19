// pages/book/book.js

const db = wx.cloud.database({});
const subscription = db.collection('subscription');
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    activeNames: ['2'],
    book: {},
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    var index = options.index;
    var pages=getCurrentPages();
    var page=pages[pages.length-1];//当前页
    var prevPage=pages[pages.length-2];//上一页面
    var book=prevPage.data.bookList[index];
    console.log(book);
    this.processBookData(book);
  },
  returnIndex:function(){
    wx.switchTab({
      url: '../index/index'
    })
  },
  processBookData:function(book) {
    var temp = {
      title: book.title,
      catalog: book.catalog,
      tags: book.tags,
      sub1: book.sub1,
      sub3: book.sub3,
      img: book.img,
      num: book.num,
      address: book.address,
      time: book.time
      // tags:tags

    }
    this.setData({
      book:temp
    })
 
  },
  onChange(event) {
    this.setData({
      activeNames: event.detail
    });
  },
  //分享按钮
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
    }
    return {
      title: '转发',
      path: '/pages/book/book',
      success: function (res) {
        console.log('成功', res)
      }
    }
  },
  onClickCollection:function(res){
    wx.cloud.callFunction({
      name: 'getmybooks',
      data: {
        openid: app.globalData.openid,
        title:this.data.book.title
      },
      success: res => {
        console.log(res)
        if (res.result.data.length <= 0) {
          db.collection('mybooks').add({
            data: this.data.book,
            success(res) {
              console.log(res)
            },
            fail: console.error
          })
        }else{
          console.log('已收藏！')
        }
      },
      fail:res=>{
        console.log(res)
      }
      
    })

  }
})