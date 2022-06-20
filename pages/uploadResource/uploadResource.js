// pages/uploadResource/uploadResource.js
const view_util = require("../../utils/view_utils.js");
const { parentUrl } = require("../../utils/service.js");
const service = require("../../utils/service.js");

Page({

    /**
     * 页面的初始数据
     */
    data: {
        tempFilePaths: [],
        files: [],
        title: '',
        username: "",
        unit: "",
        department: "",
        remark: "",
        loading: false,
    },
    titleInput: function (e) {
        this.data.title = e.detail.value;
    },
    remarkInput: function (e) {
        this.data.remark = e.detail.value;
    },
    nameInput: function (e) {
        this.data.username = e.detail.value;
    },
    unitInput: function (e) {
        this.data.unit = e.detail.value;
    },
    departmentInput: function (e) {
        this.data.department = e.detail.value;
    },
    addImg: function () {
        wx.chooseImage({
            count: 1,
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
            success: (result) => {
                // showUploadToast();
                view_util.showLoading('上传中...')
                var imgPath = result.tempFilePaths[0];
                console.log(imgPath);
                var pics = this.data.tempFilePaths;
                wx.uploadFile({
                    url: parentUrl + '/api/upload_file',
                    filePath: imgPath,
                    name: 'remark' + (pics.length + 1),
                    formData: {},
                    success: (s_result) => {
                        view_util.dismissLoading();
                        var data = JSON.parse(s_result.data);
                        if (data.code == 200) {
                            var files1 = this.data.files;
                            files1.push(data.data[0])
                            pics.push(imgPath);
                            this.setData({
                                tempFilePaths: pics,
                                files: files1
                            });
                        } else {
                            wx.showToast({
                                title: '上传失败-' + data.message,
                                icon: 'none',
                                image: '',
                                duration: 2000,
                                mask: false,
                                success: (result) => {

                                },
                                fail: () => { },
                                complete: () => { }
                            });
                        }
                    },
                    fail: () => {
                        view_util.dismissLoading();
                        wx.showToast({
                            title: '上传失败',
                            icon: 'none',
                            image: '',
                            duration: 1500,
                            mask: false,
                            success: (result) => {

                            },
                            fail: () => { },
                            complete: () => { }
                        });

                    },
                    complete: () => {
                    }
                });

            },
            fail: () => { },
            complete: () => { }
        });
    },
    imgClick(e) {
        //获取当前图片的下标
        var index = e.currentTarget.dataset.index;
        //所有图片
        var pics = this.data.tempFilePaths;
        wx.previewImage({
            //当前显示图片
            current: pics[index],
            //所有图片
            urls: pics
        })

    },
    // 删除图片
    deleteImg: function (e) {
        wx.showModal({
            title: '温馨提示',
            content: '您确定要删除这张图片么？',
            showCancel: true,
            cancelText: '取消',
            cancelColor: '#000000',
            confirmText: '确定',
            confirmColor: '#3CC51F',
            success: (result) => {
                if (result.confirm) {
                    var pics = this.data.tempFilePaths;
                    var index = e.currentTarget.dataset.index;
                    var files1 = this.data.files;
                    pics.splice(index, 1);
                    files1.splice(index, 1);
                    this.setData({
                        tempFilePaths: pics,
                        files: files1
                    });
                }
            },
            fail: () => { },
            complete: () => { }
        });

    },
    actionContent(e) {
        console.log(e.detail.value)
        this.setData({
            content: e.detail.value
        })
    },
    upload: function () {
        console.log(this.data.content);
        console.log(this.data.tempFilePaths);
        this.setData({
            loading: true,
        })
        wx.request({
            url: parentUrl + '/upload_resource',
            data: {
                files: this.data.files,
                title: this.data.title,
                department: this.data.department,
                username: this.data.username,
                unit: this.data.unit,
                date: require("../../utils/util").formatTime(new Date()),
                remark: this.data.remark,
            },
            header: service.addToken({ 'content-type': 'application/json' }),
            method: 'POST',
            dataType: 'json',
            responseType: 'text',
            success: (result) => {
                console.log(result);
                wx.showToast({
                    title: result.data.message,
                    icon: 'none',
                    image: '',
                    duration: 1500,
                    mask: true,
                    success: (result1) => {
                        if (result.data.code == 200) {
                            //关闭本页
                            wx.navigateBack({
                                delta: 1
                            })
                        }
                    },
                    fail: () => { },
                    complete: () => { }
                });
            },
            fail: () => { },
            complete: () => {
                this.setData({
                    loading: false,
                })
            }
        });
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})