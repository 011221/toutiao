// pages/watch_history/watch_history.js
Page({
  data: {
    lis: [],
    finished: false
  },

  onLoad: function () {
    this.setData({
      // icon: base64.icon20,
      slideButtons: [{
        text: '普通',
        src: '/images/ca.png', // icon的路径
      }]
    });
    wx.getStorage({
      key: "lis",
      success: (res) => {
        res.data.map(i=>{
          i.time=new Date(i.time).toLocaleDateString()
        })
        this.setData({
          lis: res.data
        })
      },
      fail: (err) => {
        this.setData({
          finished: true
        })
      }
    })
  },
  // 点击删除
  slideButtonTap(e) {
    let index = e.currentTarget.dataset.index
    let {
      lis
    } = this.data
    lis.splice(index, 1)
    wx.setStorage({
      key: "lis",
      data: lis
    })
    this.setData({
      lis
    })
  },
  // 去详情
  toDetail(e) {
    let item = e.currentTarget.dataset.item
    // 添加到历史
    wx.getStorage({
      key: 'lis',
      success(res) {
        console.log("存在历史记录")
        let index = null
        res.data.forEach((i, j) => {
          if (i._id == item._id) {
            index = j
          }
        })
        if (index != null) {
          res.data.splice(index, 1)
        }
        res.data.unshift(item)
        console.log(res.data)
        wx.setStorage({
          key: "lis",
          data: res.data
        })
      },
      fail: (err) => {
        console.log("不存在历史记录")
        let lis = [item]
        wx.setStorage({
          key: "lis",
          data: lis
        })
      }
    })
    let uid = ""
    if (getApp().globalData.userInfo) {
      uid = getApp().globalData.userInfo.uid
    }
    wx.navigateTo({
      url: '/pages/detail/detail?article_id=' + item._id + "&user_id=" + uid
    })
  }
});