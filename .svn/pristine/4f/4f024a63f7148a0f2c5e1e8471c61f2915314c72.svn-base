var app = getApp();
var util = require('../../utils/util.js');
var timer = null;
var count = 1;
Page({
  data: {
    order: {}
  },
  onLoad: function(e) {
    var order = JSON.parse(e.order);
    this.setData({
      order: order,
      PayPrice: '￥ ' + order.PayPrice,
      ProductName: order.ProductName,
      ImageUrl: order.ImageUrl,
      MeteringNum: order.MeteringNum,
      MeteringName: order.MeteringName
    })
  },
  confirmPay: function() {
    wx.showLoading({
      title: '',
    })
    var that = this;
    wx.request({
      url: app.globalData.payurl,
      method: "POST",
      data: {
        method: "weChat",
        auth_name: app.globalData.pay_authname,
        auth_id: app.globalData.pay_authid,
        xml: JSON.stringify({
          "ZMSG": {
            "ZHEAD": {
              "bcode": "05",
              "istart": "1",
              "iend": "1",
              "iflag": "1",
              "tcode": "2801"
            },
            "ZBODY": {
              "auth_name": app.globalData.pay_authname,
              "auth_id": app.globalData.pay_authid,
              "mch_id": app.globalData.pay_mch_id, //"1371982002",
              "out_trade_no": that.data.order.OrderId,
              "total_fee": (that.data.order.PayPrice) * 100,
              "notify_url": app.globalData.notify_url,
              "site_id": wx.getStorageSync("siteId"),
              "site_name": wx.getStorageSync("siteName"),
              "openid": wx.getStorageSync("openId")
            }
          }
        })
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function(res) {
        console.log(res);
        if (res.data.ZMSG.ZHEAD.RetCode == '0000') {
          var data = res.data.ZMSG.ZBODY;
          wx.requestPayment({
            timeStamp: data.timeStamp,
            nonceStr: data.nonceStr,
            package: data.package,
            signType: 'MD5',
            paySign: data.paySign,
            success: function(res) {
              var prepayId = data.package.substr(data.package.indexOf("=") + 1);
              that.confirmOrder(prepayId);
            },
            fail: function(res) {
              wx.showToast({
                title: '支付失败',
                icon: 'none'
              })
            }
          })

        } else {
          wx.showToast({
            title: '服务器开小差了哦',
            icon: 'none'
          })
        }
      },
      fail: function(res) {
        console.log(res.errMsg)

      },
      complete: function() {
        wx.hideLoading();
      }
    })
  },
  confirmOrder: function(prepayId) {
    var that = this;
    wx.showLoading({
      title: '正在出货！',
    })
    timer = setInterval(function() {
      console.log(count);
      if (count > 0) {
        that.num(prepayId);
        if (count > 6) {
          count = 0;
          clearInterval(timer);
          wx.redirectTo({
            url: '/pages/fail/fail'
          })
        }
      }
    }, 2000)
  },
  num: function(e) {
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
              "IStart": "1",
              "IEnd": "1",
              "IFlag": "1",
            },
            "ZBODY": {
              "AuthId": app.globalData.authid, //"zhilai_web_2018",
              "AuthName": app.globalData.authname, //"zhilai_web", //
              "OrderId": that.data.order.OrderId, //"8888-0003902",
              "LoginId": wx.getStorageSync("openId"), //"oHqu05L9IIrAT6MpqI-g5OKlwTPs",//
              "LoginName": app.globalData.userInfo.nickName, //"Devil", 
              "CurState": "",
              "BeginTime": "",
              "PayState": "",
              "EndTime": "",
              "ChanelType": "",
              "NumPerPage": "30"
            }
          }
        }
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function(res) {
        if (res.data == "") {
          wx.showToast({
            title: '服务器开小差了哦',
            icon: 'none'
          })
        } else {
          if (res.data.ZMSG.ZHEAD.RetCode == "0000") {
            console.log(res);
            var temp = res.data.ZMSG.ZBODY.OrderInfo;
            if (temp[0].CurState == '02') {
              if (count == 5) {
                clearInterval(timer);
                wx.hideLoading();
                wx.redirectTo({
                  url: '/pages/fail/fail'
                })
                //  that.goTk(e);
              }else{
                ++count;
              }
            } else if (temp[0].CurState == '06') {
              clearInterval(timer);
              wx.hideLoading();
              wx.redirectTo({
                url: '/pages/fail/fail'
              })
            } else if (temp[0].PayState == '01' && temp[0].CurState == '05') {
              clearInterval(timer);
              wx.hideLoading();
              wx.redirectTo({
                url: '/pages/success/success'
              })
            } else {
              clearInterval(timer);
              wx.hideLoading();
              wx.redirectTo({
                url: '/pages/fail/fail'
              })
            }
          } else {
            wx.redirectTo({
              url: '/pages/fail/fail'
            })
          }
        }
      },
      fail: function(res) {
        console.log(res.errMsg)
      },
      complete: function(res) {

      }
    })
  }, //退款
  goTk: function(e) {
    wx.showLoading({
      title: '机器故障，后台处理退款中！',
    })
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
              "TCode": "1006",
              "IStart": "1",
              "IEnd": "1",
              "IFlag": "1",
            },
            "ZBODY": {
              "AuthId": app.globalData.authid,
              "AuthName": app.globalData.authname,
              "OrderId": that.data.order.OrderId,
              "OutTradeNo": e,
              "PayPrice": that.data.order.PayPrice,
              "PayState": "04"
            }
          }
        }
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function(res) {
        console.log(res);
        if (res.data == "") {
          wx.showToast({
            title: '服务器开小差了哦',
            icon: 'none'
          })
        } else {
          if (res.data.ZMSG.ZHEAD.RetCode == "0000") {
            wx.redirectTo({
              url: '/pages/refundsuccess/refundsuccess'
            })
          } else {
            wx.redirectTo({
              url: '/pages/refundfail/refundfail'
            })
          }
        }
      },
      fail: function(res) {
        console.log(res.errMsg)
      },
      complete: function(res) {
        wx.hideLoading();
      }
    })
  }
})