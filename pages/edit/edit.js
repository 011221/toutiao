// pages/edit/edit.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    uid: "",
    imageSrc: "",
    yulan: "",
    name: "",
    array: ["男", "女"],
    index: 0,
    date: '2001/01/01',
  },
  // 选择头像
  setimg() {
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths[0]
        this.setData({
          yulan: tempFilePaths
        })
        wx.uploadFile({
          url: "http://81.70.99.163:8000/common/upload",
          filePath: tempFilePaths,
          name: "file",
          header: {
            "content-type": "multipart/form-data"
          },
          success: (res) => {
            if (res.statusCode == 200) {
              this.setData({
                imageSrc: "http://81.70.99.163:8000" + res.data
              })
              // imageSrc
              wx.showToast({
                title: "上传成功",
                icon: "none",
                duration: 1500
              })
            }
          },
          fail: function (err) {
            wx.showToast({
              title: "上传失败",
              icon: "none",
              duration: 2000
            })
          },
          complete: function (result) {
            console.log(result.errMsg)
          }
        })
      }
    })
  },
  //同步昵称
  nametb(e) {
    this.setData({
      name: e.detail.value
    })
  },
  // 选择性别
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },
  //选择日期
  bindDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date: e.detail.value.replace(/-/g, "/")
    })
  },
  //设置
  set() {
    let {
      imageSrc,
      name,
      array,
      index,
      date,
      uid
    } = this.data
    console.log(imageSrc, name, array, index, date)
    wx.request({
      url: "https://43ba8adf-8ef8-404c-886d-4bd6624c6879.bspapp.com/http/user/editUserInfo",
      method: "POST",
      data: {
        avatar: imageSrc,
        nickname: name,
        sex: array[index],
        birthday: date,
        uid
      },
      success: (res) => {
        console.log(res)
        wx.navigateBack({
          delta: 1
        })
      },
      fail: (err) => {
        console.log(err)
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: (options) => {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let userInfo = getApp().globalData.userInfo.userInfo
    let index=userInfo.sex=="男" ? 0 : 1
    this.setData({
      uid: userInfo._id,
      imageSrc: userInfo.avatar || "",
      name: userInfo.nickname || userInfo.username,
      date: userInfo.birthday || "",
      index
    })
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