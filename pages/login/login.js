Page({
  data:{
    loginId:"",
    password:""
  },
  login: function(){
    var that = this;
    if (that.data.loginId == ""){
      wx.showToast({
        title: '请输入账户',
        icon: 'none'
      })
      return;
    }
    if(that.data.password == ""){
      wx.showToast({
        title: '请输入密码',
        icon: 'none'
      })
      return;
    }
    wx.showLoading({
      title: '',
    })
    wx.request({
      url: app.globalData.saleurl,
      method: 'GET',
      data: {
        method: 'report',
        auth_name: app.globalData.authname,
        auth_id: app.globalData.authid,
        report_xml: {
          "ZMSG": {
            "ZHEAD": {
              "BCode": "04",
              "TCode": "1025",
              "IStart": "1",
              "IEnd": "1",
              "IFlag": "1",
            },
            "ZBODY": {
              "AuthId": app.globalData.authid,
              "AuthName": app.globalData.authname,
              "LoginId": that.data.loginId,
              "PassWord": that.data.password
            }
          }
        }
      },
      success: function(res){
        console.log(res);
        if(res.data.ZMSG.ZHEAD.RetCode == '0000'){
          wx.setStorageSync("userInfo", res.data.ZMSG.ZBODY);
          wx.redirectTo({
            url: '/pages/replenishment/replenishment',
          })
        }else{
          wx.showToast({
            title: '登录失败',
            icon: 'none'
          })
        }
      },
      fail: function(res){
        console.log(res);
      },
      complete: function(){
        wx.hideLoading();
      }
    })
  },
  loginIdInput: function(e){
    this.setData({
      loginId: e.detail.value
    })
  },
  passwordInput: function(e){
    this.setData({
      password: e.detail.value
    })
  }
})