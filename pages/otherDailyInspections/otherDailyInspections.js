// pages/otherDailyInspections/otherDailyInspections.js
const imgUtils = require("../../utils/img_util.js");
const service = require("../../utils/service.js");
const { formatTime } = require("../../utils/util.js");
const view_utils = require("../../utils/view_utils.js");
Page({

    /**
     * 页面的初始数据
     */
    data: {
        company: '***',
        addIconSrc: 'https://tse1-mm.cn.bing.net/th/id/R-C.431880ba6e3f72cbc5342a76490993fc?rik=KPFR0AQ%2b9heY7g&riu=http%3a%2f%2fbpic.588ku.com%2felement_list_pic%2f19%2f04%2f24%2f850ddb30377bf66e92f68a60f92c827a.jpg&ehk=Gw5raGTppstnvZuNAFaDJXMpEu2m72MleMcs65F4Xlk%3d&risl=&pid=ImgRaw&r=0&sres=1&sresct=1',
        files: [],
        sFiles: [],
        remark: ''
    },
    textChange: function (e) {
        this.data.remark = e.detail.value;
    },
    deleteImg: function (e) {
        let index = e.target.dataset.index;
        imgUtils.deleteImg(index, this.data.files, (pics, sArr, tag) => {
            this.setData({
                files: pics,
                sFiles: sArr
            })
        }, this.data.sFiles, 1)
    },
    imageClick: function (e) {
        let index = e.target.dataset.index;
        imgUtils.preImg(index, this.data.files);
    },
    addImage: function () {
        imgUtils.chooseImgUpload1('remarkImg', 6, this.data.files, this.data.sFiles, (res, err) => {
            if (res != null && err != null) {
                console.log(res);
                console.log(err);
                this.setData({
                    files: res,
                    sFiles: err
                });
            }
            console.log("files ", this.data.files);
        });
    },
    submit: function () {
        view_utils.showLoading('等待...');
        const josn = {
            files: sFiles,
            date: formatTime(new Date()),
            remark: this.data.remark
        };
        wx.request({
            url: service + '/daily_inspections_for_outside_unfile',
            data: { josn },
            header: service.addToken({ 'content-type': 'application/json' }),
            method: 'POST',
            dataType: 'json',
            responseType: 'text',
            success: (result) => {
                if (service.checkIntercept(result.data)) {
                    return;
                }
                view_utils.showToast('提交成功');
                setTimeout(() => {
                    wx.navigateBack({
                        delta: 1
                    });
                }, 1000);
            },
            fail: () => {
            },
            complete: () => { }
        });

    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            company: getApp().globalData.userInfo != null ? getApp().globalData.userInfo.company : '未知'
        });
    },
})