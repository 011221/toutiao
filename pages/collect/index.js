// pages/collect/index.js
Page({
  data: {
    favorites_list: [],
    loading: false,
    finished: false,
  },
  back(){
    wx.switchTab({
      url: '/pages/my/index'
      })
  },
  onLoad: function () {
    this.setData({
      // icon: base64.icon20,
      slideButtons: [{
        text: '普通',
        src: '/images/ca.png', // icon的路径
      }]
    });
    this.getList()
  },
  getList() {
    this.setData({
      loading:false
    })
    let {
      favorites_list
    } = this.data
    let user_id = getApp().globalData.userInfo.uid
    let skip = favorites_list.length || 0
    wx.request({
      url: 'https://1ef2a05f-0d49-4c7a-88e5-d09968b0bed8.bspapp.com/http/api/get_fav_list',
      method: "POST",
      data: {
        user_id,
        skip,
        limit: 10,
      },
      success: (res) => {
        if (res.data.code == 0) {
          this.setData({
            loading:true
          })
          res.data.data.map(i => {
            i.time = new Date(i.time).toLocaleDateString()
            return i
          })
          favorites_list.push(...res.data.data)
          if(favorites_list.length>=res.data.count){
            this.setData({
              finished:true
            })
          }
          this.setData({
            favorites_list
          })
        }
      },
      fail: (err) => {
        console.log(err)
      }
    })
  },
  slideButtonTap(e) {
    wx.showLoading({
      title: "稍后",
    })
    let index = e.currentTarget.dataset.index
    let {
      favorites_list
    } = this.data
    wx.request({
      url: 'https://1ef2a05f-0d49-4c7a-88e5-d09968b0bed8.bspapp.com/http/api/remove_fav',
      method: "POST",
      data: {
        article_id: favorites_list[index]._id,
        user_id: getApp().globalData.userInfo.uid
      },
      success: (res) => {
        if (res.data.code == 0) {
          favorites_list.splice(index,1)
          this.setData({
            favorites_list
          })
          wx.showToast({
            title: '取消成功',
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
  // 触底函数
  onReachBottom() {
    this.getList()
  },
});