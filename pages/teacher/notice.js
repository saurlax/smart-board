Page({
  data: {
    $class: [],
    classname: ""
  },
  //公告信息api，用法详见方法注释
  api: {
    app: getApp(),
    //获取指定classid的所有公告，classid可为Number或String，返回值为数组，格式: [{title:"标题",content:"",endtime:""}]
    //如出错log并返回[]，获取值必须加await，如var xxx = await getNotice(xxxxx)或使用异步方法
    async getNotice(classid) {
      var apires = await this.app.cloud.callapi_post("getnotice", {
        classid
      });
      if (apires && apires.data) {
        this.app.util.logger.info("Get notice from server successfully (classid:" + classid + ")");
        return apires.data;
      }
      this.app.util.logger.error("API:getnotice responded unexpectedly (" + JSON.stringify(apires) + ")");
      return [];
    }
  },
  async classPickerChange(e) {
    var n = Number(e.detail.value);
    var $class = this.data.$class;
    var name = $class[n].split('|')[1];
    this.setData({
      classname: name
    });
    getApp().noticeData.classid = $class[n];
    var noticelist = await this.api.getNotice($class[n].split('|')[0]);
    getApp().noticeData.notice = noticelist;
    this.setData({
      notice: noticelist
    });
  },
  checkNotice(e) {
    var data = e.currentTarget.dataset;
    getApp().noticeData.focusId = data.id;
    getApp().util.logger.info("Change notice id to " + data.id);
    wx.navigateTo({
      url: 'checknotice',
    })
  },
  toCheck() {
    wx.redirectTo({
      url: 'check',
    })
  },
  toNotice() {
    wx.redirectTo({
      url: 'notice',
    })
  },
  toMy() {
    wx.redirectTo({
      url: 'my',
    })
  },
  toNewnotice() {
    wx.navigateTo({
      url: 'newnotice',
    })
  },
  async onShow() {
    wx.hideHomeButton && wx.hideHomeButton();
    var noticelist = await this.api.getNotice(getApp().user.$class[0].split('|')[0]);
    getApp().noticeData.classid = getApp().user.$class[0];
    getApp().noticeData.notice = noticelist;
    this.setData({
      notice: noticelist,
      $class: getApp().user.$class,
      classname: getApp().user.$class[0].split('|')[1]
    })
  }
})