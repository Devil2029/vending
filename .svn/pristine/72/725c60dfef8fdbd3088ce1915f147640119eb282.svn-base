var app = getApp();
Page({
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  bindgetuserinfo: function(res){
    app.globalData.userInfo = res.detail.userInfo
    wx.switchTab({
      url: '/pages/index/index'
    })
  }
})