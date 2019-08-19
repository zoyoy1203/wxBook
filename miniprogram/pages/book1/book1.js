// pages/book1/book1.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    book:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var pages = getCurrentPages();
    var page = pages[pages.length - 1];//当前页
    var prevPage = pages[pages.length - 2];//上一页面
    var book = prevPage.data.book;
    this.setData({
      book:book
    })
   
  },
  returnIndex: function () {
    wx.switchTab({
      url: '../index/index'
    })
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
  }
})