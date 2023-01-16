Page({
  data: {
    greet: "",
    name: "",
    myclass: []
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
  toHelp() {
    wx.navigateTo({
      url: '/pages/login/help'
    })
  },
  checkClass() {
    wx.showModal({
      title: "我的班级",
      content: (String)(getApp().user.$class),
      showCancel: false
    })
  },
  cleanCache() {
    wx.showModal({
      title: "清除缓存",
      content: "您真的要清除缓存吗？",
      success: function (rse) {
        if (rse.confirm) {
          wx.showModal({
            title: "清除缓存",
            content: "清除缓存失败！",
            showCancel: false
          })
        }
      }
    });
  },
  logoutClick() {
    wx.showModal({
      title: "退出登录",
      content: "您真的要退出登录吗？",
      success: function (rse) {
        if (rse.confirm) {
          getApp().logout();
          wx.redirectTo({
            url: '/pages/login/login',
          })
        }
      }
    });
  },
  onShow() {
    console.log(JSON.stringify(getApp().user))
    wx.hideHomeButton && wx.hideHomeButton();
    var h = new Date().getHours();
    var greetText = (h >= 5 && h < 11) ? "早上好，" : (
      (h >= 11 && h < 13) ? "中午好，" : (
        (h >= 13 && h < 18) ? "下午好，" : (
          (h >= 18 && h < 24 || h >= 0 && h < 5) ? "晚上好，" : ""
        )));
    var classes = [];
    getApp().user.$class.forEach(element => {
      classes.push(element.split('|')[1]);
    });
    this.setData({
      greet: greetText,
      name: getApp().user.nickname,
      myclass: classes
    });
  }
})