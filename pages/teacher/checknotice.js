Page({
  data: {
    title: "",
    classid: "",
    classname: "",
    endtime: "",
    content: ""
  },
  api: {
    //通过title移除通知，同title的也全部删除
    async removeNotice(classid, title) {
      var apires = await getApp().cloud.callapi_post("removenotice", {
        classid,
        title
      });
      if (apires && apires.data && apires.data.message && apires.data.message == "Success") {
        getApp().util.logger.info("Remove notice on server successfully (classid:" + classid + ")");
        return true;
      }
      getApp().util.logger.error("API:removenotice responded unexpectedly (" + JSON.stringify(apires) + ")");
      return false;
    }
  },
  onLoad() {
    var noticeData = getApp().noticeData;
    var noticeTitle, noticeEndtime, noticeContent, noticeClassId, noticeClassName;
    noticeData.notice.forEach(element => {
      if (element.title == noticeData.focusId) {
        noticeTitle = element.title;
        noticeContent = element.content;
        noticeEndtime = element.endtime;
      }
    });
    noticeClassId = getApp().noticeData.classid.split('|')[0];
    noticeClassName = getApp().noticeData.classid.split('|')[1];
    this.setData({
      title: noticeTitle,
      content: noticeContent,
      classid: noticeClassId,
      classname: noticeClassName,
      endtime: noticeEndtime
    })
  },
  removeBtn() {
    var classid = this.data.classid.split('|')[0];
    var title = this.data.title;
    var api = this.api;
      wx.showModal({
        title: "删除通知",
        content: "您真的要删除此条通知吗？",
        success: async function (rse) {
          if (rse.confirm) {
            console.log(this);
            var removed = await api.removeNotice(classid, title);
            if (removed) {
              wx.navigateBack({
                delta: 1,
              });
              wx.showModal({
                title: "成功",
                content: "通知已删除。",
                showCancel: false
              });
            } else {
              wx.navigateBack({
                delta: 1,
              });
              wx.showModal({
                title: "失败",
                content: "删除通知时发生错误，请稍后再试。",
                showCancel: false
              });
            }
          }
        }
      });

  }
})