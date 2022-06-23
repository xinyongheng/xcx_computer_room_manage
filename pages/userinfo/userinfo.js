const service = require("../../utils/service");
const { isEmpty } = require("../../utils/util");
const view_utils = require("../../utils/view_utils");

// pages/userinfo/userinfo.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        account: '',
        typeString: '',
        company: '',
        nickname: '',
    },
    unlogin: function () {
        wx.request({
            url: service.parentUrl + '/unlogin',
            data: {},
            header: service.addToken({ 'content-type': 'application/json' }),
            method: 'GET',
            dataType: 'json',
            responseType: 'text',
            success: (result) => {
                if (!service.checkIntercept(result.data)) {
                    view_utils.showModal('退出成功');
                    setTimeout(() => {
                        wx.navigateBack({
                            delta: 1
                        });
                    }, 1000)
                }
            },
            fail: () => { },
            complete: () => { }
        });

    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let userInfo = service.loadUserInfo();
        if (!isEmpty(userInfo)) {
            this.setData({
                account: userInfo.account,
                company: userInfo.unit,
                nickname: userInfo.nickname,
                typeString: userInfo.type == 2 ? '游客' : (userInfo.type == 0 ? '值班人员' : '审批')
            })
        }
    },


})