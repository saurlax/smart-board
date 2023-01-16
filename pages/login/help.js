var util = require('../../utils/util');
Page({
  data: {
    log: ''
  },
  onShow: function (options) {
    wx.hideHomeButton && wx.hideHomeButton();
    var logPool = '';
    util.logger.logPool.forEach(element => {
      logPool += element + '\n';
    });
    this.setData({
      log: logPool
    });
  }
})