const service = require("../../utils/service");

// pages/fillDailyInspections/fillDailyInspections.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        height: 750,
        records: [],
        triggered: false,
        message: '暂无数据'
    },
    arrowClick: function (e) {
        let index = e.currentTarget.dataset.index;
        let item = this.data.records[index];
        let value = !(item.isShow == true)
        item.isShow = value;
        let arr = 'records';
        this.setData({
            [arr + "[" + index + "].isShow"]: value
        });
    },
    auditRecord: function (e) {
        let dataset = e.currentTarget.dataset;
        let id = dataset.id;
        wx.navigateTo({
            url: '../fillApplyInfo/fillApplyInfo?id=' + id
        });

    },
    refresh: function () {
        console.log('refresh');
        setTimeout(() => {
            wx.request({
                url: service.parentUrl + '/load_apply_recode',
                data: {
                    enterStatus: 1
                },
                header: service.addToken({ 'content-type': 'application/json' }),
                method: 'POST',
                dataType: 'json',
                responseType: 'text',
                success: (result) => {
                    console.log('success', result);
                    if (result.data.code != 200) {
                        //console.log('message', result.data);
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
        }, 1000);
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let height_rpx = wx.getSystemInfoSync().windowHeight * 750 / wx.getSystemInfoSync().windowWidth;
        console.log("height_rpx", height_rpx);
        this.setData({
            height: height_rpx - 200,
            triggered: true,
        })
        wx.showLoading({
            title: '加载中...',
            mask: true,
        });
    },

})