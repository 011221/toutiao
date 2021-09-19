// pages/phone/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
      
    },
    back(){
        wx.switchTab({
          url: '/pages/my/index',
        })
      },
      callme: function() {
        var that = this
        wx.makePhoneCall({
          phoneNumber: '17516109735',
        })
      },
    copyText(e) {
      wx.setClipboardData({
        data: "2843955779@qq.com",
        success: function (res) {
          wx.getClipboardData({
            //这个api是把拿到的数据放到电脑系统中的
            success: function (res) {
            wx.showToast({
        title: '复制成功',
      })
              console.log(res.data) // data
            }
          })
        }
      })
    },
})