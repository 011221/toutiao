// pages/my/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
      userInfo: null,
    },
    navTo(e){
      let uid=this.data.userInfo
      console.log(uid)
     
     let url=e.currentTarget.dataset.url
     if(!uid){
      wx.showToast({
        title: '您未登录，请先登录',
        icon:"none",
        duration:2000
      })
      setTimeout(() => {
          wx.navigateTo({
        url: '/pages/login/index',
      })
      }, 500);
       
     }else{
       wx.navigateTo({
         url
       })
     }
    },
    //选择登录
    selectLogin() {
      wx.navigateTo({
        url: "/pages/login/index"
      })
    },
    //退出登录
    tcDL() {
      wx.showModal({
        title: '确认退出吗？',
        success:(res)=>{
          if (res.confirm) {
            wx.showLoading({
              title: "正在退出",
            })
            // 清空数据
            setTimeout(e => {
              wx.clearStorage()
              getApp().globalData.userInfo = null
              this.setData({
                userInfo: null
              })
              wx.showToast({
                title: '退出成功',
                icon: 'success',
                duration: 1000
              })
            }, 1000)
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    },
    //去编辑
    edit(){
      wx.navigateTo({
        url: '/pages/edit/edit',
      })
    },
    revise(){
        wx.navigateTo({
          url: '/pages/revise/index'
          })
      },
      phone(){
        wx.navigateTo({
          url: '/pages/phone/index'
          })
      },
      about(){
        wx.navigateTo({
          url: '/pages/about/index'
          })
      },
      zan(){
        wx.navigateTo({
          url: '/pages/zan/index',
        })
      },
      
    onShow: function () {
      this.setData({
        userInfo: getApp().globalData.userInfo
      })
    },

})