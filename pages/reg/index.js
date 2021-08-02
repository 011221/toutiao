// pages/reg/index.js
Page({
    /**
     * 页面的初始数据
     */
   
  /**
   * 页面的初始数据
   */
  data: {
    tel: "",
    pw: "",
    yzm: "",
    str:"获取验证码",
    isclick:true
  },
  // 同步手机号
  teltb(e) {
    this.setData({
      tel: e.detail.value
    })
  },
  // 同步密码
  pwtb(e) {
    this.setData({
      pw: e.detail.value
    })
  },
  //验证码
  yanzhengma(e) {
    this.setData({
      yzm: e.detail.value
    })
  },
  // 获取验证码
  getVerify() {
    let {tel,isclick} = this.data
    if(!isclick){return}
    if (!tel) {
      wx.showToast({
        title: '请输入手机号',
        icon: "error",
        duration: 1000
      })
      return;
    } else if (!/^1[3-9]\d{9}/.test(tel)) {
      wx.showToast({
        title: '手机号有误',
        icon: 'error',
        duration: 1000
      })
      return;
    }
    wx.showLoading({
      title: "正在加载",
    })
    wx.request({
      url: 'https://1ef2a05f-0d49-4c7a-88e5-d09968b0bed8.bspapp.com/http/user/sendSms',
      methods:"POST",
      data:{
        mobile:tel,
        type: "register"
      },
      success:(res)=>{
        console.log(res)
        if(res.data.code==0){
          wx.showToast({
            title: "发送成功",
            icon: "success",
            duration: 1000
          })
          let time=60
          let timers = setInterval(() => {
            time--;
            this.setData({
              str:time + "s后重试",
              isclick:false
            })
            if (time < 0) {
                clearInterval(timers);
                this.setData({
                  str:"再次发送",
                  isclick:true
                })
            }
          }, 1000);
        }else{
          wx.showToast({
            title: res.data.msg,
            icon: "success",
            duration: 1000
          })
        }
      },
      fail:(err)=>{
        console.log(err)
      }
    })
  },
  // 注册
  reg() {
    let {
      tel,
      pw,
      yzm
    } = this.data
    if (!tel) {
      wx.showToast({
        title: '请输入手机号',
        icon: "error",
        duration: 1000
      })
      return;
    } else if (!/^1[3-9]\d{9}/.test(tel)) {
      wx.showToast({
        title: '手机号有误',
        icon: 'error',
        duration: 1000
      })
      return;
    }
    if(pw.length<6||pw.length>16){
      wx.showToast({
        title: '注意密码格式',
        icon: 'error',
        duration: 1000
      })
      return;
    }
    if(!yzm){
      wx.showToast({
        title: '请输入验证码',
        icon: 'error',
        duration: 1000
      })
      return;
    }else if(yzm.length!=6){
      wx.showToast({
        title: '验证码错误',
        icon: 'error',
        duration: 1000
      })
      return;
    }
    wx.showLoading({
      title: "正在加载",
    })
    wx.request({
      url: 'https://1ef2a05f-0d49-4c7a-88e5-d09968b0bed8.bspapp.com/http/user/reg',
      methods:"POST",
      data:{
        username:tel,
        password: pw,
        vercode: yzm
      },
      success:(res)=>{
        console.log(res)
        if(res.data.code==0){
          wx.showToast({
            title: "注册成功",
            icon: "success",
            duration: 1000
          })
          setTimeout(()=>{
            wx.navigateBack({
              delta: 1
            })
          },1000)
        }else{
          wx.showToast({
            title: "验证码有误",
            icon: "error",
            duration: 1000
          })
        }
      },
      fail:(err)=>{
        console.log(err)
      }
    })
  },
     back(){
      wx.navigateTo({
        url: '/pages/login/index'
        })
    },
  
    
  })
  