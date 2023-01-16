Page({
  onLoad() {
    if (wx.getUpdateManager) {
      var m = wx.getUpdateManager();
      m.onUpdateReady(() => m.applyUpdate());
    }
    var value = wx.getStorageSync('user');
    var app = getApp();
    if (false && value && value.valid) {
      app.user = value;
      app.util.logger.info('Read userdata from storage');
      wx.redirectTo({
        url: '/pages/teacher/check',
      });
      wx.showToast({
        title: '已自动登录',
        icon: "success",
        duration: 1500
      });
    } else
      app.util.logger.info('No userdata in storage');
  },
  inputUsername(e) {
    this.data.username = e.detail.value
  }, //更新data用户名
  inputPassword(e) {
    this.data.password = e.detail.value
  }, //更新data密码
   calllogin() {
    var app = getApp(); //获取app对象
    app.logout(); //退出已有登录
    wx.login({
      async success(res) {
        var p = getApp();
        var r = await p.cloud.callapi_post("wxlogin", res.code);
        if (r && r.data) {
          console.log(r);
          wx.showModal({
            title: "login code(success)",
            content: JSON.stringify(r)
          });
        } else {
          wx.showModal({
            title: "login code(failed)",
            content: res.code
          });
        }
      }
    });
    wx.showModal({
      title: "complete",
      content: "no code now"
    });
    return;
    if (!this.data.username) { //用户名为空(不检查全部为空格)
      app.util.logger.info('Login failed (Empty username)');
      wx.showModal({
        title: "用户名为空",
        content: "请输入用户名。",
        showCancel: false
      })
    } else if (!this.data.password) { //密码为空(不检查空格)
      app.util.logger.info('Login failed (Empty password)');
      wx.showModal({
        title: "密码为空",
        content: "请输入密码。",
        showCancel: false
      })
    } else if (this.data.username.length < 3) { //用户名合法长度3~20
      app.util.logger.info('Login failed (Too short username)');
      wx.showModal({
        title: "用户名过短",
        content: "请输入正确的用户名。",
        showCancel: false
      })
    } else if (this.data.username.length > 20) {
      app.util.logger.info('Login failed (Too long username)');
      wx.showModal({
        title: "用户名过长",
        content: "请输入正确的用户名。",
        showCancel: false
      })
    } else if (this.data.password.length < 6) { //密码合法长度6~32
      app.util.logger.info('Login failed (Too short password)');
      wx.showModal({
        title: "密码过短",
        content: "请输入正确的密码。",
        showCancel: false
      })
    } else if (this.data.password.length > 32) {
      app.util.logger.info('Login failed (Too long password)');
      wx.showModal({
        title: "密码过长",
        content: "请输入正确的密码。",
        showCancel: false
      })
    } else { //前端输入检查完毕，调用登录
      wx.showLoading({
        title: "正在登录"
      })
      app.login(this.data.username, this.data.password) //重新尝试登录
        .then(() => {
          wx.hideLoading();
          if (app.user.valid) {
            app.util.logger.info('Login successful ( ' + JSON.stringify(app.user) + ' )');
            wx.setStorageSync("user", app.user);
            app.util.logger.info('Storage userdata successfully');
            wx.redirectTo({
              url: '/pages/teacher/check',
            })
          } else {
            app.util.logger.info('Login failed (Invalid)');
            wx.showModal({
              title: "登录失败",
              content: "用户名或密码不正确。",
              showCancel: false
            })
          }
        })
        .catch((r) => {
          wx.hideLoading();
          app.util.logger.error(r);
          wx.showModal({
            title: "登录失败",
            content: "云服务暂时不可用。",
            showCancel: false
          })
        })
    }

  },
  toHelp() {
    wx.navigateTo({
      url: '/pages/login/help',
    })
  },
  onShow() {
    wx.hideHomeButton && wx.hideHomeButton()
  }
})