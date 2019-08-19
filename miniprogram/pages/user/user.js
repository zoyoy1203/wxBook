//index.js
const db = wx.cloud.database({});
const subscription = db.collection('subscription');

const app = getApp()

Page({
  data: {
    avatarUrl: '../../images/user-unlogin.png',
    userInfo: {},
    logged: false,
    takeSession: false,
    requestResult: '',
    bookclass:'',
    columns: [],
    classTitle: [],
    display:true,
    display1: false,
    isbn: '',
    book: {}
  },

  onLoad: function () {
    //顶部导航栏分类信息获取
    var that=this;
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
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              this.setData({
                avatarUrl: res.userInfo.avatarUrl,
                userInfo: res.userInfo
              })
              console.log(this.data.userInfo)
            }
          })

          this.getbookclass()
        }
      }
    })

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
   this.getbookclass()
  },
  onConfirm(event) {
    var that = this
    console.log(event.detail)
    const { picker, value, index } = event.detail
    var id = this.data.classTitle[index].id
    this.setData({
      bookclass_c: [value, id],
      display: true,
      pn: 0,
      bookList: []
    })
    //获取用户订阅信息
    db.collection('subscription').where({
      _openid: app.globalData.openid,
    })
      .get({
        success(res) {
          if (res.data.length == 0) {
            // 将用户订阅信息传到数据库上
            wx.cloud.callFunction({
              name: 'subscription',
              data: {
                bookclasstitle: that.data.bookclass_c[0],
                bookclasstitleindex: that.data.bookclass_c[1],
                openid: app.globalData.openid
              },
              complete: res => {
                console.log('callFunction test result: ', res)
              }
            })
          } else {
            //更新旧的订阅数据
            wx.cloud.callFunction({
              name: 'updatesubs',
              data: {
                openid: app.globalData.openid,
                bookclasstitle: that.data.bookclass_c[0],
                bookclasstitleindex: that.data.bookclass_c[1]
              },
              complete: res => {
                console.log('callFunction test result: ', res)
              }
            })
          }
        }
      })
   

  },

  onCancel() {
    this.setData({
      display: false
    })
  },
  onShow:function(){
    this.getbookclass()
  },

  //获取用户订阅信息
  getbookclass:function(){
    // 调用云函数getsubs得到用户订阅数据
    wx.cloud.callFunction({
      name: 'getsubs',
      data: {
        openid: app.globalData.openid
      },
      success: res => {
        console.log(res.result.data)
        if (res.result.data.length <= 0) {
          this.setData({
            bookclass: '未订阅'
          })
        } else {
          this.setData({
            bookclass: res.result.data[0].bookclasstitle
          })
        }

      }
    })
  },

  onGetUserInfo: function (e) {
    if (!this.logged && e.detail.userInfo) {
      this.setData({
        logged: true,
        avatarUrl: e.detail.userInfo.avatarUrl,
        userInfo: e.detail.userInfo
      })
    }
  },
  onGetOpenid: function () {
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
  },
  music:function(){
    let musicaddress=[]
    wx.cloud.callFunction({
      name: 'getbookmusic',
      data: {},
      success: res => {
        console.log(res)
        musicaddress=res.result
        console.log(musicaddress)

        const backgroundAudioManager = wx.getBackgroundAudioManager()

        backgroundAudioManager.title = 'music'
        backgroundAudioManager.epname = 'music'
        backgroundAudioManager.coverImgUrl = 'https://7a79-zyy-b2c6cd-1258927883.tcb.qcloud.la/img1.GIF?sign=c3c0ab0ba87440c7ff66047ed3050b85&t=1555147107'
        // 设置了 src 之后会自动播放

        let index = Math.floor(Math.random() * 3)
        console.log(musicaddress[index].tempFileURL)
        backgroundAudioManager.src = musicaddress[index].tempFileURL
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)

      }
    })

  },


  
})
