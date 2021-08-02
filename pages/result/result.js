// pages/result/result.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchstr: "",
    searchList: [],
    loading:false,
    finished:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      searchstr: options.wd
    })
    this.getList()
  },
  //获取
  getList() {
    let {
      searchstr,
      searchList
    } = this.data
    let skip = searchList.length || 0
    this.setData({
      loading:false
    })
    wx.request({
      url: 'https://1ef2a05f-0d49-4c7a-88e5-d09968b0bed8.bspapp.com/http/api/search',
      method: "POST",
      data: {
        key_word: searchstr,
        skip,
        limit: 10
      },
      success: (res) => {
        console.log(res.data)
        if (res.data.code == 0) {
          searchList.push(...res.data.data)
          this.setData({
            searchList,
            loading:true
          })
          if(searchList.length>=res.data.count.affectedDocs){
            this.setData({
              finished:true
            })
          }
        }
        console.log(this.data.searchList)
      },
      fail: (err) => {
        console.log(err)
      }
    })
  },
  // 去详情
  toDetail(e) {
    let item=e.currentTarget.dataset.item
    // 添加到历史
    wx.getStorage({
      key: 'lis',
      success (res) {
        console.log("存在历史记录")
        let index=null
        res.data.forEach((i,j)=>{
          if(i._id==item._id){
            index=j
          }
        })
        if(index!=null){
          res.data.splice(index,1)
        }
        res.data.unshift(item)
        console.log(res.data)
        wx.setStorage({
          key:"lis",
          data:res.data
        })
      },
      fail:(err)=>{
        console.log("不存在历史记录")
        let lis=[item]
        wx.setStorage({
          key:"lis",
          data:lis
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
  // 触底函数
  onReachBottom() {
    let {
      loading,
      finished
    } = this.data
    if (!loading || finished) {
      return
    }
    this.getList()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  //获得焦点
  getfocus() {
    console.log(1)
    this.setData({
      searchflag: true,
    })
  },
  //搜索框右侧按钮事件
  // addhandle() {
  //   this.triggerEvent("addhandle");
  // },
  //搜索输入
  searchList(e) {
    this.triggerEvent("searchList", e);
    this.setData({
      searchstr:e.detail.value
    })
  },
  //查询
  endsearchList(e) {
    this.triggerEvent("endsearchList");
  },
  //点击搜索
  toSearch(){
    this.setData({
      loading:false,
      finished:false,
      searchList:[]
    })
    this.getList()
  },
  //失去焦点
  // blursearch() {
  //   console.log('失去焦点')

  // },
  // 取消
  // cancelsearch() {
  //   this.setData({
  //     searchflag: false,
  //   })
  //   this.triggerEvent("cancelsearch");
  // },
  //清空搜索框
  activity_clear(e) {
    this.setData({
      searchstr: ""
    })
    this.triggerEvent("activity_clear");
  }
})