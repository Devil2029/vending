var codeUtil = require('../../utils/util.js');
Page({
  onLoad:function(e){
    codeUtil.barcode('barcode', e.code, 680, 200);
  }
})