// pages/fillApplyInfo/fillApplyInfo.js
const imgUtils = require("../../utils/img_util.js");
const service = require("../../utils/service");
const view_utils = require("../../utils/view_utils");
Page({

    /**
     * 页面的初始数据
     */
    data: {
        addIconSrc: 'https://tse1-mm.cn.bing.net/th/id/R-C.431880ba6e3f72cbc5342a76490993fc?rik=KPFR0AQ%2b9heY7g&riu=http%3a%2f%2fbpic.588ku.com%2felement_list_pic%2f19%2f04%2f24%2f850ddb30377bf66e92f68a60f92c827a.jpg&ehk=Gw5raGTppstnvZuNAFaDJXMpEu2m72MleMcs65F4Xlk%3d&risl=&pid=ImgRaw&r=0&sres=1&sresct=1',
        files: [],
        sFiles: [],
        actionContent: '',
        recordId: 0,
    },
    textChange: function (e) {
        this.data.actionContent = e.detail.value;
        // console.log(this.data.actionContent);
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
    upload: function () {
        console.log(this.data.actionContent);
        console.log(this.data.sFiles);
        wx.request({
            url: service.parentUrl + '/daily_inspections_for_outside_unfile',
            data: {
                applyId: this.data.recordId,//申请id
                // inspectionsPersonId: 12,//巡查（值班）人员id
                actionContent: this.data.actionContent,
                files: this.data.sFiles,
            },
            header: service.addToken({ 'content-type': 'application/json' }),
            method: 'POST',
            dataType: 'json',
            responseType: 'text',
            success: (result) => {
                if (service.checkIntercept(result.data)) {
                    // 上传信息失败
                } else {
                    view_utils.showToast('上传成功');
                    setTimeout(() => {
                        wx.navigateBack({
                            delta: 1
                        });
                    }, 1000);
                }

            },
            fail: () => {
                view_utils.showToast('上传失败，请检查网络后稍后重试');
            },
            complete: () => { }
        });
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let id = options.id;
        this.data.recordId = parseInt(id);
    },

})
