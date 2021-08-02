// pages/revise/index.js
Page({

    /**
     * 页面的初始数据
     */
    back(){
        wx.switchTab({
          url: '/pages/my/index',
        })
      },
      data: {
        oldpw: "",
        newpw: "",
        entpw: ""
      },
      // 同步旧密码
      oldpw(e) {
        this.setData({
          oldpw: e.detail.value
        })
      },
      // 同步新密码
      newpw(e) {
        this.setData({
          newpw: e.detail.value
        })
      },
      // 同步确认密码
      entpw(e) {
        this.setData({
          entpw: e.detail.value
        })
      },
      // 点击修改
      revise() {
        wx.showLoading({
          title: "正在修改",
        })
        let {
          oldpw,
          newpw
        } = this.data
        let uid=getApp().globalData.userInfo.uid
        wx.request({
          url: "https://1ef2a05f-0d49-4c7a-88e5-d09968b0bed8.bspapp.com/http/user/updatePwd",
          method: "POST",
          data: {
            oldPassword: newpw,
            newPassword: oldpw,
            uid
          },
          success: (res) => {
            if (res.data.code == 0) {
              // 清空数据
                wx.clearStorage()
                getApp().globalData.userInfo = null
                wx.showToast({
                  title: '修改成功',
                  icon: 'success',
                  duration: 1000
                })
                setTimeout(e => {
                  wx.navigateBack({
                    delta: 1, // 返回上一级页面。
                    success: function () {
                      console.log("返回")
                    }
                  })
                }, 1000)
    
            }
          },
          fail: (err) => {
            console.log(err)
          }
        })
      },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})