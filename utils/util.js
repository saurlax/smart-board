const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return `${[year, month, day].map(formatNumber).join('/')} ${[hour, minute, second].map(formatNumber).join(':')}`
}
const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : `0${n}`
}
var logger = {
  logPool: [],
  getTime: function () {
    var date = new Date();
    date.toLocaleTimeString('chinese', {
      hour12: false
    });
    return date.getHours() + ':' + (Array(2).join(0) + date.getMinutes()).slice(-2) + ':' + (Array(2).join(0) + date.getSeconds()).slice(-2);
  },
  info: function (msg) {
    var log = '[' + this.getTime() + ' INFO] ' + msg;
    this.logPool.push(log);
    console.log(log);
  },
  warn: function (msg) {
    var log = '[' + this.getTime() + ' WARN] ' + msg;
    this.logPool.push(log);
    console.warn(log);
  },
  error: function (msg) {
    var log = '[' + this.getTime() + ' ERROR] ' + msg;
    this.logPool.push(log);
    console.error(log);
  }
};
module.exports = {
  formatTime,
  logger
}