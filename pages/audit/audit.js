// pages/audit/audit.js
const service = require("../../utils/service");
const view_utils = require("../../utils/view_utils");

Page({

    /**
     * 页面的初始数据
     */
    data: {
        line_color: 'rgb(228, 228, 228)',
        height: 750,
        selectTag: 0,
        triggered: false,
        auditTriggered: false,
        records: [],
        hadRecords: [],
        message: '',
        hadMessage: '',
    },
    unAudit: function () {
        if (this.data.selectTag != 0) {
            this.setData({
                selectTag: 0,
            });
            if (this.data.message.length == 0 && this.data.records.length == 0) {
                this.setData({
                    triggered: true,
                });
            }
        }
    },
    audit: function () {
        if (this.data.selectTag != 1) {
            this.setData({
                selectTag: 1,
            });
            if (this.data.hadMessage.length == 0 && this.data.hadRecords.length == 0) {
                this.setData({
                    auditTriggered: true,
                });
            }
        }
    },
    arrowClick: function (e) {
        let index = e.currentTarget.dataset.index;
        let item = this.data.selectTag == 0 ? this.data.records[index] : this.data.hadRecords[index];
        let value = !(item.isShow == true)
        item.isShow = value;
        let arr = this.data.selectTag == 0 ? 'records' : 'hadRecords'
        this.setData({
            [arr + "[" + index + "].isShow"]: value
        });
    },
    auditRecord: function (e) {
        let status = e.currentTarget.dataset.status;
        let index = e.currentTarget.dataset.index;
        view_utils.showModal('提示', '确定要' + (status == 1 ? '审批通过' : '不通过') + '(第' + (index + 1) + '个)么？', result => {
            if (result) {
                view_utils.showLoading("等待...");
                wx.request({
                    url: service.parentUrl + '/approve_apply',
                    data: {
                        applyId: e.currentTarget.dataset.id,
                        // 0申请进入，1同意申请进入，2不同意申请，3值班人跟随拍照补充完信息
                        enterStatus: status,
                    },
                    header: service.addToken({ 'content-type': 'application/json' }),
                    method: 'POST',
                    dataType: 'json',
                    responseType: 'text',
                    success: (result) => {
                        console.log(result);
                        if (result.data.code != 200) {
                            return view_utils.showToast('提交失败-' + result.data.message);
                        }
                        this.setData({
                            triggered: true
                        });
                        view_utils.showToast('提交成功');
                    },
                    fail: () => { },
                    complete: () => {
                        view_utils.dismissLoading();
                    }
                });
            }
        });
    },
    refresh: function () {
        setTimeout(() => {
            wx.request({
                url: require("../../utils/service").parentUrl + '/load_apply_recode',
                data: {
                    enterStatus: 0
                },
                header: service.addToken({ 'content-type': 'application/json' }),
                method: 'POST',
                dataType: 'json',
                responseType: 'text',
                success: (result) => {
                    console.log('success', result);
                    if (result.data.code != 200) {
                        console.log('message', result.data);
                        this.setData({
                            message: result.data.message,
                            records: [],
                        })
                    } else {
                        this.setData({
                            records: result.data.data
                        });
                    }
                },
                fail: () => { },
                complete: () => {
                    wx.hideLoading();
                    this.setData({
                        triggered: false
                    })
                }
            });
        }, 2000);
    },
    auditRefresh: function () {
        setTimeout(() => {
            wx.request({
                url: require("../../utils/service").parentUrl + '/load_apply_recode',
                data: {
                    enterStatus: "1,2,3"
                },
                header: service.addToken({ 'content-type': 'application/json' }),
                method: 'POST',
                dataType: 'json',
                responseType: 'text',
                success: (result) => {
                    console.log('success', result);
                    if (result.data.code != 200) {
                        console.log('message', result.data);
                        this.setData({
                            message: result.data.message,
                            hadRecords: [],
                        })
                    } else {
                        this.setData({
                            hadRecords: result.data.data
                        });
                    }
                },
                fail: () => { },
                complete: () => {
                    wx.hideLoading();
                    this.setData({
                        auditTriggered: false
                    })
                }
            });
        }, 2000);
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // console.log(wx.getSystemInfoSync());
        let height_rpx = wx.getSystemInfoSync().windowHeight * 750 / wx.getSystemInfoSync().windowWidth;
        console.log("height_rpx", height_rpx);
        this.setData({
            height: height_rpx - 200,
        })
        wx.showLoading({
            title: '加载中...',
            mask: true,
        });
        this.refresh();
    },
})