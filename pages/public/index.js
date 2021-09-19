Page({
  /**
   * 页面的初始数据
   */
  data: {
    cateList:[],
    array: [],
    index: 0,
    title: "",
    content: "",
    cate_name:"",
    cate_id:"",
    author:"",
    author_id:"",
    imageSrc:[],
    files: []
  },
  // 选择分类
  listenerPickerSelected: function (e) {
    //改变index值，通过setData()方法重绘界面
    this.setData({
      index: e.detail.value
    });
  },
  // 获取标题
  onInput(e) {
    let title = e.detail.value;
    this.setData({
      title
    })
  },
  // 获取内容
  onText(e) {
    let content = e.detail.value;
    this.setData({
      content
    })
  },
  // 选择图片
  upImg() {
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths
        console.log(res)
      }
    })
   
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取分类
    let {cateList,array,index}=this.data
    cateList=getApp().globalData.cate
    cateList.forEach(i=>{
      array.push(i.name)
    })
    this.setData({
      cateList,
      array,
      cate_name:array[index],
      cate_id:cateList[index]._id,
    })
    this.setData({
      selectFile: this.selectFile.bind(this),
      uplaodFile: this.uplaodFile.bind(this)
    })
  },
previewImage: function(e){
    wx.previewImage({
        current: e.currentTarget.id, // 当前显示图片的http链接
        urls: this.data.files // 需要预览的图片http链接列表
    })
},
selectFile(files) {
    console.log('files', files)
    // 返回false可以阻止某次文件上传
},
uplaodFile(files) {
    console.log('upload files', files)
    var tempFilePaths = files.tempFilePaths
      for (var i = 0; i < tempFilePaths.length; i++) {
        wx.uploadFile({
          url: "http://81.70.99.163:8000/common/upload",
          filePath: tempFilePaths[i],
          name: "file",
          header: {
            "content-type": "multipart/form-data"
          },
          success:(res)=>{
            if (res.statusCode == 200) {
              console.log(res)
              let {imageSrc,files}=this.data
              imageSrc.push("http://81.70.99.163:8000"+res.data)
              let obj={url:"http://81.70.99.163:8000"+res.data}
              files.push(obj)
              this.setData({
                imageSrc,
                files
              })
              console.log(this.data.imageSrc)
              console.log(this.data.files)
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
},
uploadError(e) {
    console.log('upload error', e.detail)
},
uploadSuccess(e) {
    console.log('upload success', e.detail)
},
// 发布
release(){
  let {title,content,cate_name,cate_id,imageSrc}=this.data
  let userInfo=getApp().globalData.userInfo.userInfo
  if(title.length<6){
    wx.showToast({
      title: "标题至少6个字符",
      icon:"error",
      duration: 2000
    })
    return
  }
  if(content.length<22){
    wx.showToast({
      title: "内容太少了~",
      icon:"error",
      duration: 2000
    })
    return
  }
  wx.request({
    url: "https://1ef2a05f-0d49-4c7a-88e5-d09968b0bed8.bspapp.com/http/api/add_article",
    method:"POST",
    data:{
      title,
      content,
      cate_name,
      cate_id,
      author:userInfo.nickname||userInfo.username,
      author_id:userInfo._id,
      imageSrc
    },
    success:(res)=>{
      if(res.data.code==0){
        wx.showToast({
          title: "发布成功",
          duration: 2000
        })
        this.setData({
          title:"",
          content:"",
          imageSrc:[],
          files:[]
        })
      }
    },
    fail:(err)=>{
      console.log(err)
    }
  })
},
})