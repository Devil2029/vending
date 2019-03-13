var app = getApp();
Page({
  onLoad: function(options){
    if (options){
      /*var q = decodeURIComponent(options.q);
      var params = q.substr(q.indexOf('?') + 1).split(',');
      console.log("扫码参数："+params);*/
      wx.setStorageSync("siteId", options.siteId);
      wx.switchTab({
        url: '/pages/index/index',
      })
      /*
      if(params[0] == '1'){ // 普通用户 标识(1),authId,authName,siteId
        app.params = params;
        wx.switchTab({
          url: '/pages/index/index',
        })
      }else{ // 维护小程序的二维码首个参数暂定传2吧
        wx.redirectTo({
          url: '/pages/login/login',
        })
      }*/
    }else{
      wx.switchTab({
        url: '/pages/index/index',
      })
    }
    
  }
})