// app.js
App({
  onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs',logs)

    //获取登录数据
    wx.getStorage({
      key:"dlInfo",
      success:(res)=>{
        console.log(res)
        let time=new Date().getTime()
        if(time<res.data.tokenExpired){
          //登录有效期内获取用户信息
          wx.request({
            url: 'https://1ef2a05f-0d49-4c7a-88e5-d09968b0bed8.bspapp.com/http/user/getuserInfo',
            method:"POST",
            data:{
              token:res.data.token
            },
            success:(res2)=>{
              if(res2.data.code==0){
                getApp().globalData.userInfo=res2.data
              }
            },
            fail:(err)=>{
              console.log(err)
            }
          })
        }
      }
    })
    
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取自定义顶部高度相关参数
    let capsuleObj = wx.getMenuButtonBoundingClientRect();
    // console.log("==胶囊信息==");
    // console.log(capsuleObj);
    wx.getSystemInfo({
        success: (res) => {
            // console.log("==获取系统信息==");
            // console.log(res)
            var statusBarHeight = res.statusBarHeight; //顶部状态栏高度

            this.globalData.capsuleObj = capsuleObj;
            this.globalData.titleHeight = statusBarHeight + capsuleObj.height + (capsuleObj.top - statusBarHeight) * 2;
        },
        failure() {
        }
    })
  },
  globalData: {
    userInfo: null,
    cate:""
  }
})
