"use strict";
var util = require("utils/util.js");
var cloud = require("utils/cloud.js");
var wxCharts = require("utils/wx-charts.js");
App({
  api: { //app对象的api，用于后端对接 未声明默认为***异步调用(Promise)*** 使用then来处理返回值
    async login(u, p) {
      const apires = await cloud.callapi_post("login", {
        username: u,
        password: p
      });
      if (apires.data.valid === true) {
        var nickname = apires.data.nickname,
          $class = apires.data["class"];
        if (nickname && $class) {
          var app = getApp();
          app.user = {
            valid: true,
            nickname,
            $class
          };
          return true
        }
      }
      return false
    }
  },
  util,
  cloud,
  user: { //app对象的user，用于管理全局用户登录态 (登录时直接赋值，无需初始化)
    //nickname: undefined, //用户昵称，如 张老师
    //classids: undefined, //班级识别码 读取数据库
    // type: undefined, //用户类型 teacher, guest等
    //valid: false, //登录态是否有效
    // predefinedUsers: [] //预定义用户列表
  },
  wxCharts,
  checksettings: { //考勤选择器设置
    //classid: "888888",
    year: 2021,
    month: 1,
    day: 1,
    period: 1,
    lasttime: "7:00:00" //考勤迟到时间
  },
  noticeData: {
    notice: [],
    focusId: "",
    classid: ""
  },
  logout() {
    this.api.logout && this.api.logout();
    var _v = this.user.valid;
    this.user.valid = false;
    wx.setStorageSync('user', {});
    wx.setStorageSync('checksettings', {});
    util.logger.info("Clear userdata successfully");
    return _v;
  }, //退出登录，返回之前是否登录(即是否退出成功)
  async login(un, pw) { //登录
    if (this.api.login) //如果有api则调用api
      return await this.api.login(un, pw);
    this.user.predefinedUsers.forEach(element => {
      if (un == element.username && pw == element.password) {
        this.user.id = element.id;
        this.user.nickname = element.nickname;
        this.user.type = element.type;
        this.user.valid = true;
        return true
      }
    })
    return false
  },
  // addUser: function (username, password, id, realname, nickname, type) {//添加预定义用户
  //   this.user.predefinedUsers[this.user.predefinedUsers.length] = {
  //     username,
  //     password,
  //     realname,
  //     id,
  //     nickname,
  //     type
  //   }
  // }, 
  onLaunch() { //小程序启动事件
    var c = wx.getStorageSync('checksettings');
    if (c && c.classid) {
      this.checksettings = c;
      util.logger.info('Read checksettings from storage');
    } else
      util.logger.info('No checksettings in storage')
    //wx.cloud.init({ env: "smart-board-7g0t16fe338ebfb6" });//初始化云开发SDK
    //添加预定义用户
    // this.addUser("guest", "demo202101");
    // this.addUser("guest", "123456");
  }
});