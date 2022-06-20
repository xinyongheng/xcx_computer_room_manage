// const parentUrl = 'http://192.168.43.157:81'
// const parentUrl = 'http://192.168.5.117:81'
// const parentUrl = 'http://192.168.1.18:81'
const parentUrl = 'https://124.222.125.236:8249'
const { isEmpty } = require("./util");
const viewUtils = require("./view_utils")
const Token_Name = require("./storage").Token_Name;
const USER_TYPE = require("./storage").USER_TYPE;
function checkIntercept(data) {
    if (data.code === 401) {
        // token 错误
        wx.clearStorageSync();
        viewUtils.showModal("温馨提示", "认证失败，请重新登录", (reult) => {
            // 去登录
            wx.redirectTo({
                url: '../login/login?relogin=1',
                success: (result) => {

                },
                fail: () => { },
                complete: () => { }
            });
        });
        return true;
    }
    if (data.code != 200) {
        viewUtils.showToast(data.message == undefined ? "未知错误！" : data.message)
        return true;
    }
    return false;
}

function clearUserInfo() {
    wx.clearStorageSync();
}

function addToken(data) {
    let key = Token_Name
    let tokenStr = wx.getStorageSync(key);
    return { ...data, Authorization: "Bearer " + tokenStr }
}
function loadToken() {
    return wx.getStorageSync(Token_Name);
}
/**
 * 0值班着 1申请管理者
 * @returns 用戶类型
 */
function loadUserType() {
    let userInfo = loadUserInfo();
    if (isEmpty(userInfo)) {
        return 2;
    }
    return userInfo.type;
}

function loadUserInfo() {
    return wx.getStorageSync(USER_TYPE);
}

function isLogin() {
    let token = wx.getStorageSync(Token_Name);
    return token != null && token != undefined && token.length > 5;
}

function saveUserInfo(data) {
    let token = data.token;
    let user = data.data;
    getApp().globalData.userInfo = user;
    wx.setStorageSync(Token_Name, token);
    wx.setStorageSync(USER_TYPE, user);
}
function loadOpenId(callback) {
    wx.login({
        success: res => {
            // 发送 res.code 到后台换取 openId, sessionKey, unionid
            if (res.code) {
                console.log(res.code);
                wx.request({
                    url: parentUrl + '/api/loadUnionid',
                    data: {
                        code: res.code
                    },
                    header: { 'content-type': 'application/json' },
                    method: 'GET',
                    dataType: 'json',
                    responseType: 'text',
                    success: (result) => {
                        if (result.data.code == 200) {
                            return callback(null, result.data.openid)
                        } else {
                            return callback(result.data.message, null);
                        }
                    },
                    fail: () => {
                        callback("登录失败-请检查网络后稍后重试-1", null)
                    },
                    complete: () => { }
                });

            } else {
                callback("登录失败-无法获取code", null);
            }
        },
        fail: () => {
            callback("登录失败-请检查网络后稍后重试-0", null);
        },
    })
}
module.exports = {
    parentUrl: parentUrl,
    addToken: addToken,
    checkIntercept: checkIntercept,
    loadToken: loadToken,
    loadUserType: loadUserType,
    loadUserInfo: loadUserInfo,
    saveUserInfo: saveUserInfo,
    isLogin: isLogin,
    clearUserInfo: clearUserInfo,
    loadOpenId: loadOpenId,
}