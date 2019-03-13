var app = getApp();
var util = require('../../utils/util.js');
Page({
  data: {
    showSearchView: false,
    inventories: [], // 货道
  },
  onLoad: function () {
    this.loadGoodRoad();
    this.loadGoods();
  },
  loadGoodRoad: function () { // 加载货道信息
    var that = this;
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
              "TCode": "1008",
              "IStart": "1",
              "IEnd": "1",
              "IFlag": "1",
            },
            "ZBODY": {
              "AuthId": app.globalData.authid,
              "AuthName": app.globalData.authname,
              "SiteId": app.globalData.SiteId,
              "ChanelType": "02"
            }
          }
        }
      },
      success: function (res) {
        if (res.data.ZMSG != undefined && res.data.ZMSG.ZHEAD.RetCode == '0000') {
          that.convertData(res.data.ZMSG.ZBODY.InventoryInfo);
        }else{
          wx.showToast({
            title: '服务器开小差了哦~',
            icon: 'none'
          })
        }
      },
      fail: function (res) {
        console.log(res);
      },
      complete: function (res) {
        wx.hideLoading();
      }
    })
  },
  convertData: function (e) { // 转换数据
    var ary1 = e.substr(0, e.length - 1).split(',');
    var inventories = [];
    var i = 0, len = ary1.length;
    for (; i < len; i++) {
      var tempAry = ary1[i].split('|');
      inventories.push({
        BoxId: tempAry[0], // 箱号集
        ProductId: tempAry[1], // 产品编码
        ProductName: tempAry[2], // 产品名称
        ImageUrl: tempAry[3], // 图片地址
        InventoryNum: tempAry[4], // 可售卖数量
        InventoryMax: tempAry[5], // 最大可存放数量
        WarnNum: tempAry[6], // 最低库存数
        InventoryTransit: tempAry[7], // 锁定数量
        OverdueNum: tempAry[8], // 过期数量
        MeteringNum: tempAry[9], // 计量数量(350)
        MeteringName: tempAry[10], // 计量单位(ML)
        ReplenNum: 0 // 补货数量
      });
    }
    console.log('inventories',inventories);
    this.setData({
      inventories: inventories
    });
  },
  loadGoods: function () { // 加载可配置商品列表
    var that = this;
    wx.showLoading({
      title: '',
    })
    wx.request({
      url:app.globalData.saleurl,
      method: 'GET',
      data: {
        method: 'report',
        auth_name: app.globalData.authname,
        auth_id: app.globalData.authid,
        report_xml: {
          "ZMSG": {
            "ZHEAD": {
              "BCode": "04",
              "TCode": "1041",
              "IStart": "1",
              "IEnd": "1",
              "IFlag": "1",
            },
            "ZBODY": {
              "AuthId": app.globalData.authid,
              "AuthName": app.globalData.authname,
              "CorpId": app.globalData.CorpId,
            }
          }
        }
      },
      success: function (res) {
        console.log('products',res.data.ZMSG.ZBODY.ProductInfo);
        that.setData({
          goods: res.data.ZMSG.ZBODY.ProductInfo
        })
      },
      fail: function (res) {
        console.log(res);
      },
      complete: function (res) {
        wx.hideLoading();
      }
    })
  },
  bindchange: function(e){
    this.data.inventories[e.currentTarget.dataset.index].ReplenNum = e.detail.value - this.data.inventories[e.currentTarget.dataset.index].InventoryNum;
  },
  chose: function (e) {
    var product = e.currentTarget.dataset.product;
    var curinventoryIndex = this.data.inventoryIndex;
    var nventory = this.data.inventories[parseInt(curinventoryIndex)];
    nventory.ProductId = product.ProductId;
    nventory.ProductName = product.ProductName;
    nventory.MeteringNum = product.MeteringNum;
    nventory.MeteringName = product.MeteringName;
    nventory.ImageUrl = product.ImageInfo[0].ImageUrl;
    this.data.inventories[parseInt(curinventoryIndex)] = nventory;
    this.setData({
      inventories: this.data.inventories
    });
  },
  showSearchView: function (e) {
    // 第1步：创建动画实例 
    var animation = wx.createAnimation({
      duration: 200,  //动画时长
      timingFunction: "linear", //线性
      delay: 0  //0则不延迟
    });
    // 第2步：这个动画实例赋给当前的动画实例
    this.animation = animation;
    // 第3步：执行第一组动画：Y轴偏移240px后(盒子高度是240px)，停
    animation.translateY(100).step();
    this.setData({
      inventoryIndex: e.currentTarget.dataset.index == undefined ? this.data.inventoryIndex : e.currentTarget.dataset.index, // 标识目前配置的是那个货道
      animationData: animation.export(),
      showSearchView: this.data.showSearchView ? false : true
    });
  },
  saveConfig: function(){
    var that = this;
    console.log(this.data.inventories);
    var inventories = this.data.inventories;
    var i = 0, len = inventories.length;
    var ReplenInfo = []
    for (; i < len; i++) {
      if (inventories[i].ReplenNum > 0){
        ReplenInfo.push({
          boxId: inventories[i].BoxId,
          productId: inventories[i].ProductId,
          productName: inventories[i].ProductName,
          surplusNum: inventories[i].InventoryNum,
          replenNum: inventories[i].ReplenNum,
          overTime: util.formatTime(new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000)), // 默认一个月后过期
        });
      }
    }
    console.log('补货信息', ReplenInfo);
    wx.showLoading({
      title: '',
    })
    var userInfo = wx.getStorageSync("userInfo");
    wx.request({
      url: app.globalData.inventory_url,
      method: 'GET',
      data: {
        method: 'report',
        auth_id: app.globalData.authid,
        auth_name: app.globalData.authname,
        report_xml: {
          "ZMSG": {
            "ZHEAD": {
              "BCode": "04",
              "TCode": "1051",
              "IStart": "1",
              "IEnd": "1",
              "IFlag": "1",
            },
            "ZBODY": {
              "AuthId": app.globalData.authid,
              "AuthName": app.globalData.authname,
              "SiteId": app.globalData.siteid,
              "ReplenDate": util.formatDate(new Date()), // 补货日期
              "ReplenerId": userInfo.LoginId, // 补货人编号
              "ReplenerName": userInfo.UserName,
              "CurState": "2", // 状态 1:等待补货 2:补货完成
              "OperTime": util.formatTime(new Date()), // 补货时间
              "ReplenInfo": ReplenInfo
            }
          }
        }
      },
      success: function (res) {
        console.log('补货信息上报返回结果：',res);
        if(res.data.ZMSG.ZHEAD.RetCode == "0000"){
          wx.showToast({
            title: '补货信息上报成功',
            icon: 'none'
          })
          that.loadGoodRoad(); 
        }
      },
      fail: function (res) {
        console.log(res);
      },
      complete: function (res) {
        wx.hideLoading();
      }
    })
  },
  scanCode: function(e){
    wx.scanCode({
      onlyFromCamera: true,
      success:function(res){
        console.log(res.result);
      }
    })
  }
})