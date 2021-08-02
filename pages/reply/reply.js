// pages/reply/reply.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    building: null,
    replayList: [],
    user_id: "",
    article_id: "",
    comment_type: 1,
    reply_comment_id: "",
    pl: "",
    loading: false,
    finished: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let {
      article_id,
      user_id,
      item
    } = options
    let {
      replayList
    } = this.data
    item = JSON.parse(item)
    this.setData({
      building: item,
      article_id,
      user_id,
      reply_comment_id: item._id,
      loading: false,
      finished: false
    })
    let skip = replayList.length || 0
    console.log(item, article_id, user_id, item._id, skip, )
    this.getReplay(article_id, user_id, item._id, skip)
  },
  //获取回复
  getReplay(article_id, user_id, reply_comment_id, skip) {
    let {
      replayList
    } = this.data
    wx.request({
      url: "https://1ef2a05f-0d49-4c7a-88e5-d09968b0bed8.bspapp.com/http/api/get_reply_list",
      method: "POST",
      data: {
        article_id,
        user_id,
        reply_comment_id,
        skip,
        limit: 10
      },
      success: (res) => {
        if (res.data.code == 0) {
          console.log(res)
          res.data.data.map(i => {
            i.create_time = new Date(i.create_time).toLocaleDateString()
            return i
          })
          replayList.push(...res.data.data)
          this.setData({
            replayList,
            loading: true
          })
          if (replayList.length >= res.data.count) {
            this.setData({
              finished: true
            })
          }
        }
      },
      fail: (err) => {
        console.log(err)
      }
    })
  },
  // 同步评论内容
  pltb(e) {
    this.setData({
      pl: e.detail.value
    })
  },
  // 发表评论
  fabiao() {
    let {
      article_id,
      user_id,
      comment_type,
      reply_comment_id,
      pl
    } = this.data
    console.log(article_id, user_id, comment_type, reply_comment_id, pl)
    if (!pl) {
      wx.showToast({
        title: '请输入',
        icon: 'error',
        duration: 1000
      })
      return
    }
    //user_id article_id comment_type reply_comment_id content
    wx.request({
      url: "https://1ef2a05f-0d49-4c7a-88e5-d09968b0bed8.bspapp.com/http/api/add_comment",
      method: "POST",
      data: {
        user_id,
        article_id,
        comment_type,
        reply_comment_id,
        content: pl
      },
      success: (res) => {
        if (res.data.code == 0) {
          wx.showToast({
            title: '回复成功',
            icon: 'success',
            duration: 1000
          })
          console.log(res)
          this.setData({
            pl: ""
          })
        }
      },
      fail: (err) => {
        console.log(err)
      }
    })
  },
  // 评论点赞
  pldz(e) {
    let {
      user_id,
      replayList
    } = this.data
    let {
      item,
      index
    } = e.currentTarget.dataset
    console.log(item, index)
    let url = item.is_like ? "/api/comment_unlike" : "/api/comment_like"
    wx.request({
      url: "https://1ef2a05f-0d49-4c7a-88e5-d09968b0bed8.bspapp.com/http" + url,
      method: "POST",
      data: {
        user_id,
        comment_id: item._id
      },
      success: (res) => {
        if (res.data.code == 0) {
          if (index>-1) {
            replayList[index].is_like ? replayList[index].like_count-- : replayList[index].like_count++
            replayList[index].is_like = !replayList[index].is_like
            this.setData({
              replayList
            })
          }else{
            item.is_like ? item.like_count-- : item.like_count++
            item.is_like=!item.is_like
            this.setData({
              building:item
            })
          }

          wx.showToast({
            title: res.data.msg,
            icon: 'success',
            duration: 1000
          })
        }
      },
      fail: (err) => {
        console.log(err)
      }
    })
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
    this.setData({
      loading: false
    })
    let {
      article_id,
      user_id,
      reply_comment_id,
      replayList
    } = this.data
    let skip = replayList.length || 0
    console.log(article_id, user_id, reply_comment_id)

    this.getReplay(article_id, user_id, reply_comment_id, skip)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})