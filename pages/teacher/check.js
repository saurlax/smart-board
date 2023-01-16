"use strict";
Page({
  data: {
    periods: ["早检", "午检", "晚检"]
  },
  settingsChange() {
    wx.setStorageSync("checksettings", getApp().checksettings);
  },
  classPickerChange(e) {
    var n = Number(e.detail.value);
    this.setData({
      class_index: n
    })
    var app = getApp();
    app.checksettings.classid = this.getId(app.user.$class[n]);
    this.settingsChange();
    app.util.logger.info("Class has been change to " + app.user.$class[n]);
    this.tryLoad();
  },
  datePickerChange(e) {
    var date = new Date(e.detail.value);
    var d = {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate()
    };
    this.setData(d);
    var app = getApp();
    app.checksettings.year = d.year;
    app.checksettings.month = d.month;
    app.checksettings.day = d.day;
    this.settingsChange();
    app.util.logger.info("Date has been change to " + d.year + "." + d.month + "." + d.day);
    this.tryLoad();
  },
  periodPickerChange(e) {
    this.setData({
      period_index: e.detail.value
    })
    var app = getApp();
    var np = Number(e.detail.value) + 1;
    app.checksettings.period = np;
    this.settingsChange();
    app.util.logger.info("Period has been changed to " + np);
    this.tryLoad();
  },
  toCheck() {
    wx.redirectTo({
      url: 'check'
    })
  },
  toNotice() {
    wx.redirectTo({
      url: 'notice'
    })
  },
  toMy() {
    wx.redirectTo({
      url: 'my'
    })
  },
  async onPullDownRefresh() {
    await this.tryLoad(true);
    wx.stopPullDownRefresh();
  },
  refresh(data) {
    var o = {};
    var et, lt;
    var es, ls;
    const lowest = 36.0,
      highest = 37.3;
    var latetime = Date.parse("0-" + getApp().checksettings.lasttime);
    var latenumber = 0,
      lownumber = 0,
      highnumber = 0;
    for (let i = 0; i < data.length; i++) {
      var datatime = new Date("0-" + data[i].time);
      data[i].time = datatime.getHours() + ":" + (Array(2).join(0) + datatime.getMinutes()).slice(-2) + ":" + (Array(2).join(0) + datatime.getSeconds()).slice(-2);
      let ct = data[i].time;
      ct = Date.parse("0-" + ct);
      if (ct < et || !et) {
        et = ct;
        es = data[i].time
      }
      if (ct > lt || !lt) {
        lt = ct;
        ls = data[i].time;
      }
      if (ct > latetime) {
        latenumber++;
        data[i].lateclass = "late";
      }
      if (data[i].temp > highest) {
        highnumber++;
        data[i].tempclass = "high";
      }
      if (data[i].temp < lowest) {
        lownumber++;
        data[i].tempclass = "low";
      }
    }
    o.shouldcome = "无数据";
    o.realcome = data.length ? data.length + "人" : "无数据";
    o.leave = "无数据";
    o.notcome = "无数据";
    if (es && ls) {
      var esdate = new Date("0-" + es);
      o.earliest = esdate.getHours() + ":" + (Array(2).join(0) + esdate.getMinutes()).slice(-2);
      var lsdate = new Date("0-" + ls);
      o.latest = lsdate.getHours() + ":" + (Array(2).join(0) + lsdate.getMinutes()).slice(-2);;
    } else {
      o.earliest = "无数据";
      o.latest = "无数据";
    }
    o.late = latenumber ? latenumber + "人" : "无数据";
    o.toolow = lownumber ? lownumber + "人" : "无数据";
    o.toohigh = highnumber ? highnumber + "人" : "无数据";
    this.setData(Object.assign({
      stu: data
    }, o));
  },
  onLoad() {
    var cs = [];
    var app = getApp();
    var userclass = app.user.$class;
    if ( !app.user || !app.user.valid || !userclass || !userclass.length) {
      app.util.logger.error("No class available: " + JSON.stringify(app.user));
      wx.showModal({
        confirmColor: 'confirmColor',
        confirmText: 'confirmText',
        content: '很抱歉，目前我们暂未准备好适合您的功能。点击"确认"后将返回登录界面。',
        showCancel: false,
        title: '暂未开放',
        success() {
          app.logout();
          wx.redirectTo({
            url: '/pages/login/login',
          })
        }
      })
      return;
    }
    var cn = -1;
    for (var i = 0; i < userclass.length; i++) {
      cs[cs.length] = this.getName(userclass[i]);
      if (cn == -1 && this.getId(userclass[i]) == app.checksettings.classid)
        cn = i;
    }
    if (app.checksettings.classid == undefined || cn == -1) {
      app.checksettings.classid = this.getId(userclass[0]);
      cn = 0;
    }
    this.setData({
      classlist: cs,
      year: app.checksettings.year,
      month: app.checksettings.month,
      day: app.checksettings.day,
      period_index: app.checksettings.period - 1,
      class_index: cn
    });
    this.tryLoad(false);
    // wx.showModal({
    //   showCancel: false,
    //   title: "内部开发版本",
    //   content: "您正使用内部开发版本的小程序。此版本中为保护用户隐私，已隐藏部分数据。"
    // });
  },
  getId($class) {
    var i = $class.indexOf("|");
    if (i >= 0)
      return $class.substring(0, i);
  },
  getName($class) {
    var i = $class.indexOf("|");
    if (i >= 0 && i < $class.length)
      return $class.substring(i + 1);
  },
  async tryLoad(forceQuery) {
    wx.showNavigationBarLoading();
    var app = getApp();
    var classid = app.checksettings.classid;
    var year = app.checksettings.year;
    var month = app.checksettings.month;
    var day = app.checksettings.day;
    var period = app.checksettings.period;
    var key = "$c" + classid + "$y" + year + "$m" + month + "$d" + day + "$p" + period;
    if (!forceQuery) {
      app.util.logger.info("Try read storage for #" + classid + " " + year + "." + month + "." + day + " [" + period + "] (key:" + key + ")");
      var data = wx.getStorageSync(key);
    }
    if (!data || !data.length) {
      app.util.logger.info(forceQuery ? "Force requesting (key:" + key + ")" : "No storage available, requesting server (key:" + key + ")");
      var apires = await app.cloud.callapi_post("get", { classid, year, month, day, period });
      if (apires && apires.data) {
        if (apires.data.message) {
          app.util.logger.error("API:get responded unexpectedly (" + JSON.stringify(apires) + ") (key:" + key + ")");
          data = [];
        } else {
          app.util.logger.info("Get data from server successfully (key:" + key + ")");
          data = apires.data;
          wx.setStorageSync(key, data);
          app.util.logger.info("Storage data successfully (key:" + key + ")");
        }
      } else {
        app.util.logger.error("API:get responded unexpectedly (" + JSON.stringify(apires) + ") (key:" + key + ")");
        data = [];
      }
    } else app.util.logger.info("Read data from storage successfully (key:" + key + ")");
    this.refresh(data);
    wx.hideNavigationBarLoading();
  },
  onShow() {
    wx.hideHomeButton && wx.hideHomeButton()
  }
})