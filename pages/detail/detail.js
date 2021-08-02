// pages/detail/detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detail:null,
    plList:[],
    user_id:"",
    article_id:"",
    comment_type:0,
    reply_comment_id:"",
    pl:"",
    loading:false,
    finished:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let {article_id,user_id}=options
    this.setData({
      article_id,
      user_id
    })
    //获取详情
    wx.request({
      url: "https://1ef2a05f-0d49-4c7a-88e5-d09968b0bed8.bspapp.com/http/api/get_article_detail",
      method:"POST",
      data:{
        article_id,
        user_id
      },
      success:(res)=>{
        console.log(res)
        if(res.data.code==0){
          res.data.data.time=new Date(res.data.data.time).toLocaleDateString()
          this.setData({
            detail:res.data.data
          })
          if(res.data.data.comment>0){
            this.getPl(article_id,user_id)
          }
        }
      },
      fail:(err)=>{
        console.log(err)
      }
    })
  },
  //获取评论
  getPl(article_id,user_id){
    this.setData({
      loading:false,
      finished:false
    })
    let {plList}=this.data
    let skip=plList.length || 0
    wx.request({
      url: "https://1ef2a05f-0d49-4c7a-88e5-d09968b0bed8.bspapp.com/http/api/get_comment_list",
      method:"POST",
      data:{
        article_id,
        user_id,
        skip,
        limit:10
      },
      success:(res)=>{
        this.setData({
          loading:true
        })
        if(res.data.code==0){
          res.data.data.map(i=>{
            i.create_time=new Date(i.create_time).toLocaleDateString()
            return i
          })
          plList.push(...res.data.data)
          this.setData({
            plList,
            loading:true
          })
          if(plList.length>=res.data.count){
            this.setData({
              finished:true
            })
          }
        }
      },
      fail:(err)=>{
        console.log(err)
      }
    })
  },
  // 同步评论内容
  pltb(e){
    this.setData({
      pl:e.detail.value
    })
  },
  // 发表评论
  fabiao(){
    console.log(this.data.pl)
    let {article_id,user_id,comment_type,reply_comment_id,pl}=this.data
    if(!pl){
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
        method:"POST",
        data:{
          user_id,
          article_id,
          comment_type,
          reply_comment_id,
          content:pl
        },
        success:(res)=>{
          if(res.data.code==0){
            wx.showToast({
              title: '评论成功',
              icon: 'success',
              duration: 1000
            })
            this.setData({
              pl:""
            })
          }
        },
        fail:(err)=>{
          console.log(err)
        }
      })
  },
  //文章点赞
  dianzan(){
    let {article_id,user_id,detail}=this.data
    let url=detail.is_like ? "/api/unlike" : "/api/like"
    wx.request({
      url: "https://1ef2a05f-0d49-4c7a-88e5-d09968b0bed8.bspapp.com/http"+url,
      method:"POST",
      data:{
        user_id,
        article_id
      },
      success:(res)=>{
        if(res.data.code==0){
          detail.is_like=!detail.is_like
          this.setData({
            detail
          })
          wx.showToast({
            title: res.data.msg,
            icon: 'success',
            duration: 1000
          })
        }
      },
      fail:(err)=>{
        console.log(err)
      }
    })
  },
  //收藏
  shoucang(){
    let {article_id,user_id,detail}=this.data
    let url=detail.is_fav ? "/api/remove_fav" : "/api/add_fav"
    wx.request({
      url: "https://1ef2a05f-0d49-4c7a-88e5-d09968b0bed8.bspapp.com/http"+url,
      method:"POST",
      data:{
        user_id,
        article_id
      },
      success:(res)=>{
        if(res.data.code==0){
          detail.is_fav=!detail.is_fav
          this.setData({
            detail
          })
          wx.showToast({
            title: res.data.msg,
            icon: 'success',
            duration: 1000
          })
        }
      },
      fail:(err)=>{
        console.log(err)
      }
    })
  },
  // 评论点赞
  pldz(e){
    let {user_id,plList}=this.data
    let {item,index}=e.currentTarget.dataset
    let url=item.is_like ? "/api/comment_unlike" : "/api/comment_like"
    wx.request({
      url: "https://1ef2a05f-0d49-4c7a-88e5-d09968b0bed8.bspapp.com/http"+url,
      method:"POST",
      data:{
        user_id,
        comment_id:item._id
      },
      success:(res)=>{
        if(res.data.code==0){
          plList[index].is_like ? plList[index].like_count-- : plList[index].like_count++
          plList[index].is_like=!plList[index].is_like
          this.setData({
            plList
          })
          wx.showToast({
            title: res.data.msg,
            icon: 'success',
            duration: 1000
          })
        }
      },
      fail:(err)=>{
        console.log(err)
      }
    })
  },
  //去回复
  toReply(e){
    let {article_id,user_id}=this.data
    let {item}=e.currentTarget.dataset
    wx.navigateTo({
      url: '/pages/reply/reply?article_id='+article_id+"&user_id="+user_id+"&item="+JSON.stringify(item),
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
      loading:false
    })
    this.getPl(this.data.detail._id,getApp().globalData.userInfo.uid)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})