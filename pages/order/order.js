var app = getApp();
var page = 1;
var hasMoreData = true;
Page({
  data:{
    array:['近一个月','今天'],
    index: 0,
    orders:[]
  },
  onLoad: function () {
    page = 1;
    hasMoreData = true;
    this.loadData();
  },
  lower: function(e){ // 加载更多
    if (hasMoreData){
      this.loadData();
    } else{
      wx.showToast({
        title: '没有更多数据了哦',
        icon: 'none'
      })
    }
  },
  loadData: function () {
    var that = this;
    wx.request({
      url: app.globalData.saleurl,
      method: "GET",
      data: {
        method: 'report',
        auth_name: app.globalData.authname,
        auth_id: app.globalData.authid,
        report_xml: {
          "ZMSG": {
            "ZHEAD": {
              "BCode": "04",
              "TCode": "1007",
              "IStart": page,
              "IEnd": "1",
              "IFlag": "1",
            },
            "ZBODY": {
              "AuthId": app.globalData.authid,
              "AuthName": app.globalData.authname,
              "SiteId": app.globalData.siteid,
              "LoginId": wx.getStorageSync("openId"),
              "LoginName": app.globalData.userInfo.nickName,
              "ChanelType": "02"
            }
          }
        }
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res);
        if (res.data == "") {
          wx.showToast({
            title: '服务器开小差了哦',
            icon: 'none'
          })
        } else {
          if(res.data.ZMSG.ZHEAD.RetCode == "0000"){
            var temp;
            if(page == 1){
              temp = res.data.ZMSG.ZBODY.OrderInfo;
            }else{
              temp = that.data.orders.concat(res.data.ZMSG.ZBODY.OrderInfo);
            }
            that.setData({
              orders: temp
            });
            if (res.data.ZMSG.ZBODY.OrderInfo.length == 5) {
              page++;
              hasMoreData = true;
            }else{
              hasMoreData = false;
            }
          } else if (res.data.ZMSG.ZHEAD.RetCode == "1999"){
            wx.showToast({
              title: '没有更多数据了哦',
              icon: 'none'
            })
          } else{
            wx.showToast({
              title: '有点小意外发生',
              icon: 'none'
            })
          }
        }
      },
      fail: function (res) {
        console.log(res.errMsg)
      },
      complete: function (res) {
      }
    })
  },
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },
  goCodePage: function (e) {
    wx.navigateTo({
      url: "/pages/code/code?code=" + e.currentTarget.dataset.code
    })
  },
  goPay: function (e) {
    var temp = e.currentTarget.dataset.order;
    var order = {
      OrderId: temp.OrderId,
      PayPrice: temp.PayPrice,
      ProductName: temp.ProductInfo[0].ProductName,
      ImageUrl: temp.ProductInfo[0].ImageUrl,
      MeteringNum: temp.ProductInfo[0].MeteringNum,
      MeteringName: temp.ProductInfo[0].MeteringName
    }
    wx.navigateTo({
      url: '/pages/confirm/confirm?order=' + JSON.stringify(order)
    })
  },
  cancleOrder: function(e){
    var that = this;
    var orderId = e.currentTarget.dataset.orderid;
    wx.showLoading({
      title: '',
    })
    wx.request({
      url: app.globalData.saleurl,
      method: "GET",
      data: {
        method: 'report',
        auth_name: app.globalData.authname,
        auth_id: app.globalData.authid,
        report_xml: {
          "ZMSG": {
            "ZHEAD": {
              "BCode": "04",
              "TCode": "1004",
              "IStart": "1",
              "IEnd": "1",
              "IFlag": "1",
            },
            "ZBODY": {
              "AuthId": app.globalData.authid,
              "AuthName": app.globalData.authname,
              "OrderId": orderId,
            }
          }
        }
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res);
        wx.hideLoading();
        if(res.data.ZMSG.ZHEAD.RetCode == '0000'){
          wx.showToast({
            title: '订单已取消',
            icon: 'none'
          })
          page = 1;
          hasMoreData = true;
          that.loadData();
        }else{
          wx.showToast({
            title: '服务器开小差了哦',
            icon: 'none'
          })
        }
      },
      fail: function (res) {
        console.log(res.errMsg)
        wx.hideLoading();
        wx.showToast({
          title: '服务器开小差了哦',
          icon: 'none'
        })
      },
      complete: function (res) {
       
      }
    })
  }
})