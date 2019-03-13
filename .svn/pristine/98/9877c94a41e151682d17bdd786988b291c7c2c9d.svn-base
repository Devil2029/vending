var util = require('../../utils/util.js');
var app = getApp();
Page({
  data:{
    showView1:true,
    showView2:false,
    resultInfo:"zzw",
    devNo:"2143124124",
    showModal: false,
    goods:[]
  },
  onLoad: function (){
    console.log(app.params);
    if (wx.getStorageSync("siteId")){
      wx.setStorageSync('authId', app.globalData.authid);
      wx.setStorageSync('authName', app.globalData.authname);
      wx.setStorageSync('siteId', wx.getStorageSync("siteId"));
      this.setData({
        devNo: wx.getStorageSync("siteId")
      });
      //this.initGoods();
      this.checkSiteState();
    }else{
      this.setData({
        showView1: false,
        showView2: true
      });                
    }
  },

  checkSiteState:function(){
    var that = this;
    that.setData({
      resultInfo: "in1"
    });
    
    wx.request({
      url: app.globalData.saleurl,
      method: "GET",
      data: {
        method: 'report',
        auth_name: wx.getStorageSync("authName"),
        auth_id: wx.getStorageSync("authId"),
        report_xml: {
          "ZMSG": {
            "ZHEAD": {
              "BCode": "04",
              "TCode": "1001",
              "IStart": "1",
              "IEnd": "1",
              "IFlag": "1",
            },
            "ZBODY": {
              "AuthId": wx.getStorageSync("authId"),
              "AuthName": wx.getStorageSync("authName"),
              "SiteId": wx.getStorageSync("siteId")
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
            title: '服务器开小差了 哦',
            icon: 'none'
          })
        } else {
          if (res.data.ZMSG.ZHEAD.RetCode == "0000") {
            console.log(res.data.ZMSG.ZBODY.SiteInfo);
            var Station = res.data.ZMSG.ZBODY.SiteInfo;
            wx.setStorageSync('siteName', Station[0].SiteName);  
            if (null == Station || null == Station[0] || null == Station[0].SiteState){
              wx.showToast({
                title: '服务器开小差了xxx哦',
                icon: 'none'
              })
            } 
            var state=res.data.ZMSG.ZBODY.SiteInfo[0].SiteState
            if ("0" == state || "00" == state){
              that.initGoods();
            } else if ("1" == state || "01" == state) {
              that.setData({
                showView1: false,
                showView2: true,
                showModal: true
              }); 
             // that.initGoods();
            }else{
              that.setData({
                showView1: false,
                showView2: true,
                showModal: true
              }); 
            }
           
          } else {
            that.setData({
              resultInfo: "err" + res.data
            });
          }
          wx.createSelectorQuery().select('.title').boundingClientRect(function (rect) {
            that.setData({
              scrollHeight: (res.screenHeight - rect.height)
            })
          }).exec()
        }
      },
      fail: function (res) {
        that.setData({
          resultInfo: "fail" + res
        });
        console.log(res)
      }
    });
    that.setData({
      resultInfo: "离线"
    });
  }, onCancel: function () {
    this.hideModal();
  },
  /**
   * 对话框确认按钮点击事件
   */
  onConfirm: function () {
    this.hideModal();
  }, preventTouchMove: function () {
  },
  hideModal: function () {
    this.setData({
      showModal: false
    });
  },
  initGoods:function(){   
    var that = this; 
    that.setData({
      resultInfo: "in1"
    });   
    wx.request({
      url: app.globalData.saleurl,
      method: "GET",
      data: {
        method: 'report',
        auth_name: wx.getStorageSync("authName"),
        auth_id: wx.getStorageSync("authId"),
        report_xml: {
          "ZMSG": {
            "ZHEAD": {
              "BCode": "04",
              "TCode": "1002",
              "IStart": "1",
              "IEnd": "1",
              "IFlag": "1",
            },
            "ZBODY": {
              "AuthId": wx.getStorageSync("authId"),
              "AuthName": wx.getStorageSync("authName"),
              "SiteId": wx.getStorageSync("siteId")
            }
          }
        }
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        
        if (res.data == "") {
          wx.showToast({
            title: '服务器开小差了 哦',
            icon: 'none'
          })
        } else {
          if (res.data.ZMSG.ZHEAD.RetCode == "0000") {
            console.log("-----------"+res.data.ZMSG.ZBODY.ProductInfo);
            var mylist = res.data.ZMSG.ZBODY.ProductInfo;
            var str_pretty1 = JSON.stringify(mylist);
            console.log("-----------1:" + str_pretty1);
            // if (null != mylist && mylist.length>0){
            //   for (var i = 0; i < mylist.length; i++) {
            //     if (null == mylist[i] || null == mylist[i].ImageInfo[0] || null == mylist[i].ImageInfo[0].ImageUrl){
            //       continue;
            //     }
            //     var _img = mylist[i].ImageInfo[0].ImageUrl;
            //     console.log("-----------2:" + _img);
            //     if (null != _img && _img.includes("http://47.97.23.139:8081/autoshop_admin/")){
            //       //_img = _img.replace("http://47.97.23.139:8081/autoshop_admin/", app.globalData.server_url);
            //       mylist[i].ImageInfo[0].ImageUrl = _img;
            //     }                
            //   }
            // }
            that.setData({
              goods: mylist,
              resultInfo: "在线"
            });
          }else{
            that.setData({
              resultInfo: "err"+res.data
            });
          }
          wx.createSelectorQuery().select('.title').boundingClientRect(function (rect) {
            that.setData({
              scrollHeight: (res.screenHeight - rect.height)
            })
          }).exec()
        }
      },
      fail: function (res) {
        that.setData({
          resultInfo: "fail"+res
        });
        console.log(res)
      }
    });
    that.setData({
     // resultInfo: resultInfo+"in2"
       resultInfo:  "in2"
    });
  },
  order:function(e){
    var product = e.currentTarget.dataset.product;
    var data = {
      method: 'report',
      auth_name: app.globalData.authname,
      auth_id: app.globalData.authid,
      report_xml: {
        "ZMSG": {
          "ZHEAD": {
            "BCode": "04",
            "TCode": "1003",
            "IStart": "1",
            "IEnd": "1",
            "IFlag": "1",
          },
          "ZBODY": {
            "AuthId": app.globalData.authid,
            "AuthName": app.globalData.authname,
            "SiteId": wx.getStorageSync("siteId"),
            "LoginId": wx.getStorageSync("openId"),
            "LoginName": app.globalData.userInfo.nickName,
            "ApplyTime": util.formatTime(new Date()),
            "SaleChannel": "1",
            "PayType": "07",
            "PayPrice": product.NomarlPrice,
            "ProductInfo": [
              {
                "ProductId": product.ProductId,
                "Num": "1",
                "Price": product.NomarlPrice
              }
            ]
          }
        }
      }
    }
    console.log("请求下单", data);
    wx.request({
      url: app.globalData.saleurl,
      method: "GET",
      data: data,
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res);
        if (res.data.ZMSG.ZHEAD.RetCode == "0000") {
          var temp = res.data.ZMSG.ZBODY;
          var order = {
            OrderId: temp.OrderId,
            PayPrice: product.NomarlPrice,
            ProductName: product.ProductName,
            ImageUrl: product.ImageInfo[0].ImageUrl,
            MeteringNum: product.MeteringNum,
            MeteringName: product.MeteringName
          }
          wx.navigateTo({
            url: '/pages/confirm/confirm?order=' + JSON.stringify(order)
          })
        } else if (res.data.ZMSG.ZHEAD.RetCode == "1610" || res.data.ZMSG.ZHEAD.RetCode == "1620") {
          wx.showToast({
            title: '商品已售罄！！',
            icon: 'none',
            duration: 3000
          })
          return;
        } else if (res.data.ZMSG.ZHEAD.RetCode == "1127") {
          wx.showToast({
            title: '二维码不合法！',
            icon: 'none',
            duration: 3000
          })
          return;
        } else if (res.data.ZMSG.ZHEAD.RetCode == "1033") {
          wx.showToast({
            title: '设备离线 请稍后重试！',
            icon: 'none',
            duration: 3000
          })
          return;
        }else{
          wx.showToast({
            title: '系统异常！',
            icon: 'none',
            duration: 3000
          })
          return;
        }
      },
      fail: function (res) {
        console.log(res)
      }
    })
  },
  scanCode: function(){
    var that = this;
    wx.scanCode({
      onlyFromCamera:true,
      success: (res)=>{
        console.log(res);
        var ary = res.path.substr(res.path.indexOf('&') + 1).split(',');
        console.log(ary);
        var ary2 = ary[0].substr(ary[0].indexOf('=') + 1).split(',');
        if (ary2.length == 1){
          that.setData({
            showView1: true,
            showView2: false
          });
          wx.setStorageSync('siteId', ary2[0]);      
          wx.setStorageSync('authId', app.globalData.authid);
          wx.setStorageSync('authName', app.globalData.authname);    
          app.globalData.siteid = wx.getStorageSync("siteId");
          that.setData({
            devNo: app.globalData.siteid
          });
          //that.initGoods(); 
          that.checkSiteState();
        }
        else{
          wx.redirectTo({
            url: '/pages/index/index',
          })
        }
      }
    })
  }
})