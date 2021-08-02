// pages/search/search.js
// 本组件为搜索组件
// 需要传入addflag   值为true / false （搜索框右侧部分）
// 若显示搜索框右侧部分   需传入右侧图标url以及addhandle函数

Page({
  /**
   * 组件的初始数据
   */
  data: {
    searchstr: ""
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
    wx.navigateTo({
      url: '/pages/result/result?wd='+this.data.searchstr,
    })
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
  },
})