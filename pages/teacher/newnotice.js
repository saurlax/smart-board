Page({
  data: {
    classlist: [],
    class_index: 0,
    day: [],
    day_index: 0,
    time: "00:00",
    title: "",
    content: "",
    date: []
  },
  api: {
    //迁移性极"高"的添加通知，data为对象，填{classid:"",title:"",content:"",endtime:""}等，可以自由加属性，所有属性在get时全部返回(除classid)，注意classid必填，有title才可删除
    //警告：不会检查同名，也不检查任何属性，所有属性直接丢入数据库
    async addNotice(data) {
      var apires = await getApp().cloud.callapi_post("addnotice", data);
      if (apires && apires.data && apires.data.message && apires.data.message == "Success") {
        getApp().util.logger.info("Add notice to server successfully (classid:" + data.classid + ")");
        return true;
      }
      getApp().util.logger.error("API:addnotice responded unexpectedly (" + JSON.stringify(apires) + ")");
      return false;
    }
  },
  getFullDate(year, month) { //获取指定年份的月份的总天数
    return new Date(year, month, 0).getDate();
  },
  getNextDate(date) { //获取下一天
    var d = new Date(date);
    var y = d.getFullYear();
    var m = d.getMonth() + 1;
    var d = d.getDate();
    var day = d + 1;
    var month = m;
    var year = y;
    if (d == this.getFullDate(y, m)) {
      var day = 1;
      if (m == 12) {
        var month = 1;
        var year = y + 1;
      }
    }
    var out = year + "," + month + "," + day;
    return new Date(out);
  },
  async addNoticeBtn() {
    var date = this.data.date[this.data.day_index];
    var cid = this.data.classlist[this.data.class_index].split('|')[0];
    var data = {
      classid: this.data.classlist[this.data.class_index].split('|')[0],
      title: this.data.title,
      content: this.data.content,
      endtime: date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + "-" + this.data.time
    };
    var added = await this.api.addNotice(data);
    if (added) {
      wx.navigateBack({
        delta: 1,
      });
      wx.showModal({
        title: "成功",
        content: "通知发布成功。",
        showCancel: false
      });
    } else {
      wx.showModal({
        title: "失败",
        content: "通知发布失败，请稍后再试。",
        showCancel: false
      });
    }
  },
  onLoad() {
    var d = [];
    var date = new Date();
    var dateArray = [];
    for (var i = 0; i < 5; i++) {
      d.push((date.getMonth() + 1) + "月" + date.getDate() + "日");
      dateArray.push(date);
      date = this.getNextDate(date);
    }
    this.setData({
      date: dateArray,
      day: d,
      classlist: getApp().user.$class
    });
  },
  titleInput(e) {
    this.setData({
      title: e.detail.value
    })
  },
  contentInput(e) {
    this.setData({
      content: e.detail.value
    })
  },
  classPickerChange(e) {
    var n = Number(e.detail.value);
    this.setData({
      class_index: n
    })
  },
  datePickerChange(e) {
    var n = Number(e.detail.value);
    this.setData({
      day_index: n
    })
  },
  timePickerChange(e) {
    this.setData({
      time: e.detail.value
    })
  }
})