// pages/login/login.js
const service = require("../../utils/service");
const viewUtils = require("../../utils/view_utils.js");
Page({
    /**
     * 页面的初始数据
     */
    data: {
        loading: false,
        placeData: "账号",
        userName: "微信昵称",
        account: "",
        password: "",
        comefromType: 0,
        type: 0,
    },
    toAuditPage: function () {
        wx.navigateTo({
            url: "../audit/audit",
            success: (result) => {

            },
            fail: () => { },
            complete: () => { }
        });
    },
    filldData: function () {
        wx.navigateTo({
            url: '../fillApplyInfo/fillApplyInfo',
        })
    },
    visitor_login: function () {
        viewUtils.showModal('提示', '游客仅有申请登记的权限！', result => {
            if (result) {
                viewUtils.showLoading('等待...');
                service.loadOpenId((error, openid) => {
                    if (error) {
                        return viewUtils.showToast(error);
                    }
                    wx.request({
                        url: service.parentUrl + '/api/login',
                        data: {
                            openid: openid,
                        },
                        header: { 'content-type': 'application/json' },
                        method: 'POST',
                        dataType: 'json',
                        responseType: 'text',
                        success: (result) => {
                            if (result.data.code == 200) {
                                service.saveUserInfo(result.data);
                                viewUtils.showToast('登录成功');
                                setTimeout(() => {
                                    wx.navigateBack({
                                        delta: 1
                                    });
                                }, 1000);
                            } else {
                                viewUtils.showToast(result.data.message);
                            }
                        },
                        fail: () => { viewUtils.showToast('登录失败-请检查网络后稍后重试-2') },
                        complete: () => { }
                    });
                });
            }
        });
    },
    toLogin: function (data) {
        viewUtils.showLoading('登录中...');
        this.setData({ loading: true, });
        wx.request({
            url: require('../../utils/service').parentUrl + '/api/login',
            data: data.detail.value,
            header: { 'content-type': 'application/json' },
            method: 'POST',
            dataType: 'json',
            responseType: 'text',
            success: (res) => {
                viewUtils.dismissLoading();
                this.setData({ loading: false, });
                console.log(res.data);
                if (res.data.code != 200) {
                    return viewUtils.showToast(res.data.message);
                }
                let serviceType = res.data.data.type;
                if (this.data.comefromType != serviceType) {
                    // 重新登录
                    wx.showToast({
                        title: '账号与所选功能权限不匹配',
                        icon: 'none',
                        image: '',
                        duration: 1500,
                        mask: false,
                        success: (result) => {

                        },
                        fail: () => { },
                        complete: () => { }
                    });
                    return;
                } else {
                    service.saveUserInfo(res.data)
                }
                wx.navigateBack({
                    delta: 1
                });
            },
            fail: () => {
                this.setData({ loading: false, });
                viewUtils.showToast("登录失败");
            },
            complete: () => { }
        });
    },
    register: function () {
        wx.navigateTo({
            url: '../register/register',
        });
    },
    /**
     * eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50I…Q4NH0.pdTGRGoEy9crEJFTYtFKcmiFoXIicMZCPvqYUMVpWBQ
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        //750 1334
        //375 667
        const sv = require("../../utils/service").addToken({});
        console.log('token', sv);
        let type = options.type;
        let placeData = type == 1 ? "账号（管理员）" : (type == 2 ? "请输入账号" : "账号（值班）")
        this.setData({
            comefromType: type,
        });
        if (options.relogin == 1) {
            let userType = service.loadUserType();
            console.log('userType', userType);
            type = userType;
            if (userType != 2) {
                placeData = userType == 0 ? "账号（值班）" : "账号（管理员）"
            } else {
                placeData = '请输入账号';
            }
        }
        // console.log('index',placeData.indexOf('管理员'));
        if (placeData.indexOf('值班') > -1) {
            this.setData({
                account: "13856770225",
                password: "123456",
            })
        } else if (placeData.indexOf('管理员') > -1) {
            this.setData({
                account: "17600666716",
            })
        }
        this.setData({
            placeData: placeData,
            type: type,
            comefrom: options.comefrom,
        });
    },
    back: function () {
        wx.navigateBack({
            delta: 1
        });
    },
})