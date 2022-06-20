const service = require("./utils/service")

// app.js
App({
  onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
   /*  wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionid
        if (res.code) {
          console.log(res.code);
          wx.request({
            url: service.parentUrl + '/api/loadUnionid',
            data: {
              code: res.code
            },
            header: { 'content-type': 'application/json' },
            method: 'GET',
            dataType: 'json',
            responseType: 'text',
            success: (result) => {
              console.log(result);
            },
            fail: () => { },
            complete: () => { }
          });

        }
      }
    }) */
  },
  globalData: {
    userInfo: null,
  }
})
// 08391j2004tNTN1zQ9300vtmKt391j2y