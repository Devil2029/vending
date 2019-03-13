//app.js
App({
  onLaunch: function () {
    //登录
    wx.login({
      success: res => {
        console.info("-----------:" + res.code);
        wx.request({
          //获取openid接口
          url: this.globalData.payurl,
          method: 'GET',
          data: {
            method: "weChat",
            auth_name: this.globalData.pay_authname,
            auth_id: this.globalData.pay_authid,
            xml: JSON.stringify({
              "ZMSG": {
                "ZHEAD": {
                  "bcode": "05",
                  "istart": "1",
                  "iend": "1",
                  "iflag": "1",
                  "tcode": "2800"
                },
                "ZBODY": {
                  "auth_name": this.globalData.pay_authname,
                  "auth_id": this.globalData.pay_authid,
                  "wx_type":"01",
                  "code": res.code
                }
              }
            })
          },
          success: function (res) {
            console.log(res);
            if(null==res||null==res.data||null==res.data.openid){
              wx.setStorageSync("openId", "13410310002");
            }else{
              wx.setStorageSync("openId", res.data.openid);
            }
           
          },
          fail: function (res){
            console.log(res);
            wx.showToast({
              title: '服务器开小差了',
              icon: 'none'
            })
          }
        })
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              console.log("获取用户信息成功----" + res.userInfo);
              this.globalData.userInfo = res.userInfo
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            },
            fail: function(e){
              console.log(e.data);
            }
          })
        }else{
          wx.redirectTo({
            url: '/pages/auth/auth',
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null,
    //payurl: "http://pay.zhilai.com:8086/ZhilaiPayPlat/wrist.action", 
    payurl: "https://zf.zhilai.com:8442/ZhilaiPayPlat/wrist.action",  
    pay_authid: "zhilai_wrist",
    pay_authname: "zhilai_wrist",
    pay_mch_id:"1371982002",
    server_url:"https://autoshop.zhilai.com/autoshop_server/",
    //server_url: "https://autoshop.zhilai.com:8442/autoshop_server/",
    //saleurl: "http://47.97.23.139:8082/autoshop_server/api.htm",//http://47.97.23.139:8082/autoshop_server/cxf
    saleurl: "https://autoshop.zhilai.com/autoshop_server/api.htm",
    //saleurl: "https://autoshop.zhilai.com:8442/autoshop_server/api.htm",
    //http://47.97.23.139:8082/autoshop_server/cxf
    siteid: "8888-0000166",//8888-0147
    sitename:"8888-0000166",
  //  notify_url: "https://autoshop.zhilai.com/autoshop_server/api.htm",
    notify_url:"https://autoshop.zhilai.com/autoshop_server/zhilaiPay.htm",
    //notify_url: "https://autoshop.zhilai.com:8442/autoshop_server/api.htm",
    //notify_url: "http://autoshop.zhilai.com:8082/autoshop_server/api.htm",
    authid:"zhilai_web_2018",
    authname:"zhilai_web",
    CorpId:"8888",
    inventory_url:"https://autoshop.zhilai.com/autoshop_server/inventory.htm"
    //inventory_url: "https://autoshop.zhilai.com:8442/autoshop_server/inventory.htm"
  }
})