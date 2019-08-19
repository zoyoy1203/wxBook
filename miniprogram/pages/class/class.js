// pages/class/class.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    classTitle:[],
    classTitletag:{ id: "242", catalog: "中国文学" },
    bookList:[],
    columns: [],
    pn:0,
    index:242
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this
    //顶部导航栏分类信息获取
    var that = this;
    wx.request({
      url: 'http://apis.juhe.cn/goodbook/catalog?key=065cc07809f44ffeaec439e3d8694cc7',
      header: {
        'content-type': 'application/json' // 默认值
      },
      method: 'get',
      success(res) {
        console.log(res)
        var bookclass = []
        var classTitle = []
        classTitle = res.data.result
        console.log(classTitle)
        for (var idx in classTitle) {
          bookclass[idx] = classTitle[idx].catalog
        }
        // console.log(bookclass)
        that.setData({
          classTitle: classTitle,
          columns: bookclass
        })
      },
      fail: function (error) {
        console.log(error)
      }
    })
  
  },
  onChange:function(event){
    console.log("11111")
   
    console.log(event.detail)
    const { picker, value, index } = event.detail
    var id = this.data.classTitle[index].id
    var that = this
    this.setData({
      index:id
    })
    console.log(this.data.index)
  },
  onConfirm:function(event){
    wx.navigateTo({
      url: '../classbooks/classbooks?index='+this.data.index
    })
  }
})