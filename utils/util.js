const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return `${[year, month, day].map(formatNumber).join('-')} ${[hour, minute, second].map(formatNumber).join(':')}`
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : `0${n}`
}

function isEmpty(data) {
  if (data == null || data == undefined) {
    return true;
  }
  if (typeof data === 'string' && data.length == 0) {
    return true;
  }
  return false;
}

module.exports = {
  formatTime,
  isEmpty,
}
