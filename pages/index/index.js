// index.js
// 获取应用实例
const app = getApp()
Page({
  data: {
    titleHeight: app.globalData.titleHeight,
    capsuleObj: app.globalData.capsuleObj,
    navHeight:"",
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    canIUseGetUserProfile: false,
    canIUseOpenData: wx.canIUse('open-data.type.userAvatarUrl') && wx.canIUse('open-data.type.userNickName'), // 如需尝试获取用户信息可改为false
    tabs: [],
    activeTab: 0,
    list: [],
    count: 1,
    loading: false,
    finished: false,
    toView: 'green',
    navScrollLeft: 0,
    currentNav: 0,
  },
  // 事件处理函数
  bindViewTap() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad() {
    console.log(this.data.capsuleObj)
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      })
    }
    // 获取导航列表
    wx.request({
      url: "https://1ef2a05f-0d49-4c7a-88e5-d09968b0bed8.bspapp.com/http/api/get_cate_list",
      method: "POST",
      success: (res) => {
        console.log(res)
        if (res.data.code == 0) {
          let tabs = res.data.data.map(i => {
            i.title = i.name
            return i
          })
          this.setData({
            tabs
          })
          this.getList()
          getApp().globalData.cate = tabs
        }
      },
      fail: (err) => {
        console.log(err)
      }
    })
    // 获取导航高度
    let query = wx.createSelectorQuery();

    query.select('.nav').boundingClientRect(rect => {
      // let height = rect.height;
      this.setData({
        navHeight:rect.height
      })
    }).exec();
  },
  // 获取列表
  getList() {
    this.setData({
      loading: false,
    })
    let {
      list
    } = this.data
    let skip = this.data.list.length
    let cate_id = this.data.tabs[this.data.activeTab]._id
    wx.request({
      url: "https://1ef2a05f-0d49-4c7a-88e5-d09968b0bed8.bspapp.com/http/api/get_article_list",
      method: "POST",
      data: {
        cate_id,
        skip,
        limit: 10
      },
      success: (res) => {
        console.log(res)
        if (res.data.code == 0) {
          list.push(...res.data.data.map(i => {
            let year = new Date(i.time).getFullYear()
            let mount = new Date(i.time).getMonth() + 1
            let date = new Date(i.time).getDate()
            i.time = year + "-" + mount + "-" + date
            return i
          }))
          if (list.length >= res.data.count) {
            this.setData({
              finished: true
            })
          }
          this.setData({
            list,
            loading: true,
            count: res.data.count
          })
        }
      },
      fail: (err) => {
        console.log(err)
      }
    })
  },
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
  // 去发布
  toRelease() {
    let {
      tabs
    } = this.data
    tabs = JSON.stringify(tabs)
    wx.redirectTo({
      url: '/pages/release/release?tabs=' + tabs,
    })
  },
  getUserProfile(e) {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log(res)
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    })
  },
  getUserInfo(e) {
    // 不推荐使用getUserInfo获取用户信息，预计自2021年4月13日起，getUserInfo将不再弹出弹窗，并直接返回匿名的用户个人信息
    console.log(e)
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  onTabClick(e) {
    const index = e.detail.index
    this.setData({
      activeTab: index
    })
  },
  onChange(e) {
    const index = e.currentTarget.dataset.index
    this.setData({
      activeTab: index,
      finished: false,
      loading: false,
      list: []
    })
    this.getList()
    console.log(1)
  },
  handleClick(e) {
    wx.navigateTo({
      url: './webview',
    })
  },
  // 导航
  switchNav: function (e) {
    this.onChange(e)
    // console.log(e);
    //获取当前点击的index
    var cur = e.currentTarget.dataset.current;
    // console.log(cur)
    //tab选项居中  屏幕的宽度除以5
    var singleWidth = wx.getSystemInfoSync().windowWidth / 5;
    this.setData({
      //输出左边显示的位置
      navScrollLeft: (cur - 2) * singleWidth
    });
    // console.log(this.data.navScrollLeft);
    //当我们点击的下标等于我们当前的下标时说明没有切换item进行点击，所以不做操作
    if (this.data.currentNav == cur) {
      return false;
    } else {
      //当我们点击的下标不等于我们当前的下标时，将我们点击获取到的新的下标赋值给currentNav
      this.setData({
        currentNav: cur
      })
    }
  },
  upper(e) {
    console.log(e)
  },

  lower(e) {
    console.log(e)
  },

  scroll(e) {
    console.log(e)
  },

  scrollToTop() {
    this.setAction({
      scrollTop: 0
    })
  },

  tap() {
    for (let i = 0; i < order.length; ++i) {
      if (order[i] === this.data.toView) {
        this.setData({
          toView: order[i + 1],
          scrollTop: (i + 1) * 200
        })
        break
      }
    }
  },
  tapMove() {
    this.setData({
      scrollTop: this.data.scrollTop + 10
    })
  }
})
