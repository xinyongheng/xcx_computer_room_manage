// pages/route/route.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        canIUseGetUserProfile: false,
        height: "",
        banners: [
            'https://img95.699pic.com/photo/40140/9951.gif_wh860.gif',
            'https://hbimg.huabanimg.com/d18b2c3f362747d3e5dad97a24067caeed72ae8b294dee-lLF8Jv_fw658',
            'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fnimg.ws.126.net%2F%3Furl%3Dhttp%253A%252F%252Fdingyue.ws.126.net%252F2020%252F1102%252Fd53db5f1p00qj5owe00goc000rc00dsc.png%26thumbnail%3D650x2147483647%26quality%3D80%26type%3Djpg&refer=http%3A%2F%2Fnimg.ws.126.net&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1653009319&t=5239822b315d54ea07691cf2b14fb915',
            'https://pic.baike.soso.com/p/20090105/20090105120000-105374.jpg',
        ],
        indicatorDots: true,
        vertical: false,
        autoplay: false,
        interval: 2000,
        duration: 1000,
        currentIdicater: 0,
        headHeight: '600rpx',
    },
    onSwiperChange(e) {
        //e.detail = {current, source}
        this.setData({
            currentIdicater: e.detail.current
        })
    },
    duty() {
        toLogin(0);
    },
    apply() {
        if (!service.isLogin()) {
            const comefrom = 2;
            let url = '../login/login?type=' + comefrom;
            service.clearUserInfo();
            wx.navigateTo({
                url: url,
            });
            return;
        }
        checkToken((result) => {
            if (result == null) {
                viewUtil.showToast('请检查网路后，稍后重试');
                return;
            }
            wx.navigateTo({
                url: '../applyEnter/applyEnter',
            });
        })
    },
    audit() {
        toLogin(1);
    },
    uploadResource: function () {
        checkToken(result => {
            if (result == null) {
                viewUtil.showToast('请检查网路后，稍后重试');
                return;
            }
            if (!result) {
                let url = '../login/login?type=' + 0;
                wx.navigateTo({
                    url: url,
                });
                return;
            }
            let type = service.loadUserType()
            //0值班局内;1审核员;2游客;3值班局外
            if (type == 2 || type == 3) {
                return viewUtil.showToast('权限不足');
            }
            wx.navigateTo({
                url: '../uploadResource/uploadResource',
                success: (result) => {

                },
                fail: () => { },
                complete: () => { }
            });
        });

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.getSystemInfo({
            success: (res) => {
                // 获取可使用窗口宽度
                let clientHeight = res.windowHeight;
                // 获取可使用窗口高度
                let clientWidth = res.windowWidth;
                // 算出比例
                let ratio = 750.0 / clientWidth;
                // 算出高度(单位rpx)
                let height = clientHeight * ratio;
                // 设置高度
                this.setData({
                    height: height + "rpx"
                });
            },
            fail: () => { },
            complete: () => { }
        });
    },
    loadLocation: function () {
        wx.getLocation({
            type: 'gcj02',
            altitude: true,
            isHighAccuracy: true,
            success: (res) => {
                console.log(res);
                wx.openLocation({
                    latitude: res.latitude,
                    longitude: res.longitude,
                    success: (data) => {
                        console.log(data);
                    },
                    fail: () => { },
                    complete: () => { }
                });
            },
            fail: () => { },
            complete: () => { }
        });
    },
    selfInfo: function () {
        let isLogin = service.isLogin();
        if (isLogin) {
            wx.navigateTo({
                url: '../userinfo/userinfo'
            });
        } else {
            wx.navigateTo({
                url: '../login/login?relogin=1'
            });
        }
    }
})

// 值班0; 审批1
function toLogin(type) {
    if (!service.isLogin()) {
        let url = '../login/login?type=' + type;
        service.clearUserInfo();
        wx.navigateTo({
            url: url,
        });
        return;
    }
    let userType = service.loadUserType();
    // 0值班;1审核员;2游客
    let msg;
    let comefrom;
    if (type == 0 && (userType != 0 && userType != 3)) {
        msg = '值班权限';
        comefrom = '值班巡查';
    } else if (type == 1 && userType != 1) {
        msg = '审批权限';
        comefrom = '审计';
    } else if (type == 2 && userType != 2) {
        msg = '登记权限';
        comefrom = '游客';
    }
    if (!isEmpty(msg)) {
        viewUtil.showModal('提示', '当前账号无' + msg + ', 需换账号，确定切换么？', result => {
            if (result) {
                // 反转
                // const comefrom = type == 0 ? '审批' : '值班巡查';
                let url = '../login/login?type=' + type + '&comefrom=' + comefrom;
                service.clearUserInfo();
                wx.navigateTo({
                    url: url,
                });
            }
        });
        return;
    }
    checkToken((result) => {
        if (result == null) {
            viewUtil.showToast('请检查网路后，稍后重试');
            return;
        }
        let url = '';
        if (result) {
            if (userType == 0) {
                wx.showActionSheet({
                    itemList: ['值班巡查', '补充外来工作信息'],
                    itemColor: '#000000',
                    success: (result) => {
                        if (result.tapIndex === 0) {
                            wx.navigateTo({
                                url: '../dailyInspections/dailyInspections',
                            });
                        } else {
                            wx.navigateTo({
                                url: '../fillDailyInspections/fillDailyInspections',
                            });
                        }
                        return;
                    },
                    fail: () => { },
                    complete: () => { }
                });
                return;
            }
            url = userType == 1 ? '../audit/audit' : (userType == 0 ? '../dailyInspections/dailyInspections' : '../otherDailyInspections/otherDailyInspections');
        } else {
            url = '../login/login?type=' + userType;
        }
        wx.navigateTo({
            url: url,
        });
    })
}

const viewUtil = require("../../utils/view_utils");
const service = require("../../utils/service");
const { isEmpty } = require("../../utils/util");
const parentUrl = service.parentUrl;
function checkToken(callback) {
    let tokenStr = service.loadToken();
    if (tokenStr == null || tokenStr == undefined || tokenStr.length < 5) {
        return callback(false);
    }
    viewUtil.showLoading();
    wx.request({
        url: parentUrl + '/check_token',
        data: {},
        header: service.addToken({ 'content-type': 'application/json' }),
        method: 'GET',
        dataType: 'json',
        responseType: 'text',
        success: (result) => {
            viewUtil.dismissLoading();
            let res = result.data.code == 200;
            if (res) {
                return callback(true)
            } else {
                viewUtil.showToast('token已过期，请重新登录');
                setTimeout(() => {
                    callback(false)
                }, 1000)
            }
        },
        fail: () => {
            viewUtil.dismissLoading();
            callback(null)
        },
        complete: () => { }
    });

}
