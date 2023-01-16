"use strict";
const cloudbase_url = "https://smart-board-7g0t16fe338ebfb6-1304758898.ap-guangzhou.app.tcloudbase.com/";
function requestapi(obj) {//将微信提供的request方法封装成Promise异步
  return new Promise((r, j) => wx.request(Object.assign(obj, {
    success(res) { r(res) },
    fail(res) { j(res) }
  })))
}
async function callapi_base(url, data, obj) {
  return await requestapi(Object.assign({ url: cloudbase_url + url, data, enableCache: false }, obj))
}
async function callapi_get(url, data) {//POST调用api，注意url不带开头"/"
  return await callapi_base(url, data, { method: "GET" })
}
async function callapi_post(url, data) {//POST调用api，注意url不带开头"/"
  return await callapi_base(url, data, { method: "POST" })
}
module.exports = {
  cloudbase_url, requestapi, callapi_base, callapi_get, callapi_post
}