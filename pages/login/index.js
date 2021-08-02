// pages/login/index.js
Page({

     /**
   * 页面的初始数据
   */
  data: {
    tel: "",
    pw: ""
  },
  // 同步手机号
  teltb(e) {
    this.setData({
      tel: e.detail.value
    })
  },
  // 同步密码
  pwtb(e) {
    this.setData({
      pw: e.detail.value
    })
  },
  // 点击登录
  login() {
    wx.showLoading({
      title: "正在登录",
    })
    let {
      tel,
      pw
    } = this.data
    wx.request({
      url: "https://1ef2a05f-0d49-4c7a-88e5-d09968b0bed8.bspapp.com/http/user/login",
      method: "POST",
      data: {
        username: tel,
        password: pw
      },
      success: (res) => {
        console.log(res)
        if (res.data.code == 0) {
          let {
            token,
            tokenExpired,
            uid
          } = res.data
          wx.setStorage({
            key: "dlInfo",
            data: {
              token,
              tokenExpired,
              uid
            }
          })
          this.getUser(token)
        }
      },
      fail: (err) => {
        console.log(err)
      }
    })
  },
  // 获取用户信息
  getUser(token) {
    wx.request({
      url: 'https://1ef2a05f-0d49-4c7a-88e5-d09968b0bed8.bspapp.com/http/user/getuserInfo',
      method: "POST",
      data: {
        token
      },
      success: (res2) => {
        if (res2.data.code == 0) {
          getApp().globalData.userInfo = res2.data
          wx.showToast({
            title: '登录成功',
            icon: 'success',
            duration: 1000
          })
          setTimeout(e => {
            wx.navigateBack({
              delta: 2
            })
          }, 1000)
        }
      },
      fail: (err) => {
        console.log(err)
      }
    })
  },
    back(){
        wx.switchTab({
          url: '/pages/my/index',
     
          })
      },
      resetting(){
        wx.navigateTo({
          url: '/pages/resetting/index',
          })
      },
})