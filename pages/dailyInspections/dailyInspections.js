// pages/dailyInspections/dailyInspections.js
const viewUtil = require("../../utils/view_utils");
const imgUtil = require("../../utils/img_util");
const service = require("../../utils/service");
const { formatTime } = require("../../utils/util");
Page({
    loading: false,
    content: "请输入室内温度",
    width1: 84,
    width2: 84,
    /**
     * 页面的初始数据
     */
    data: {
        //1外部人员，2值班人员
        peoples: [{ name: '', idcard: '', unit: '', type: 2 }],
        dailyInspections: {
            date: '',
            remark: '',
            indoorsTemperature: '',
            indoorsHumidity: "",
            outsideTemperature: "",
            outsideHumidity: "",
        },
        cHeight: 1100,
        btSelect: 1,
        // 值班人员自拍5
        dutyPersonImg: [],
        // 值班人员自拍 上传服务器返回结果
        dutyPersonImg_S: [],
        // 中心机房巡查记录表1
        dbRoomInspectionsTableImg: '',
        dbRoomInspectionsTableImg_S: {},
        // 数据中心机房日常情况登记表2
        dbRoomDailyCheckInTableImg: '',
        dbRoomDailyCheckInTableImg_S: {},
        // 室内温度湿度，空调面板数字3
        indoorsTemperatureHumidityImg: '',
        indoorsTemperatureHumidityImg_S: {},
        // 室外温度湿度，空调面板数字4
        outsideTemperatureHumidityImg: '',
        outsideTemperatureHumidityImg_S: {},
        // 备注补充图片6
        remarkImg: [],
        remarkImg_S: [],
    },
    addPeople: function () {
        const ps = this.data.peoples
        ps.push({ name: '', idcard: '', unit: '', type: 2 });
        this.setData({
            peoples: ps,
        })
    },
    deleteItem: function (e) {
        let dataset = e.target.dataset
        let index = dataset.index;
        viewUtil.showModal('', '确定删除第' + (index + 1) + '个么？', result => {
            if (result) {
                //let type = dataset.type;
                const ps = this.data.peoples
                ps.splice(index, 1);
                this.setData({
                    peoples: ps,
                })
            }
        });
    },
    addFile: function (e) {
        let dataset = e.target.dataset
        let type = dataset.type;
        console.log('addFile', type);
        let picsArr = loadPicsArr(type, this.data);
        console.log(picsArr);
        imgUtil.chooseImgUpload1(loadFiledName(type), type, picsArr[0], picsArr[1], (res, sres) => {
            if (res != null) {
                let jsonData;
                if (sres != null) {
                    jsonData = loadJsonData(type, res, sres);
                } else {
                    let imagePath = res.imgPath;
                    let sImagePath = res.sImgPath;
                    jsonData = loadJsonData(type, imagePath, sImagePath);
                }
                console.log(jsonData);
                this.setData(jsonData);
                console.log(this.data.dutyPersonImg);
            }
        });
    },
    fillPeoples: function () {
        if (this.data.btSelect != 1) {
            this.setData({
                btSelect: 1
            })
        }
    },
    fillInfo: function () {
        if (this.data.btSelect != 3) {
            this.setData({
                btSelect: 3
            })
            if (this.data.content == undefined || this.data.content.length == 0) {
                this.setData({
                    content: '请输入室内温度'
                })
                loadViewRect(view_width => {
                    console.log('view_width', view_width);
                    this.setData({
                        width1: view_width,
                        width2: view_width,
                    })
                });
            }
        }
    },
    fillFile: function () {
        if (this.data.btSelect != 2) {
            this.setData({
                btSelect: 2
            })
        }
    },
    imageClick: function (e) {
        // console.log(e);
        let dataset = e.target.dataset
        let type = dataset.type;
        let index = dataset.index == undefined ? 0 : dataset.index;
        let pics = loadPics(type, this.data);
        imgUtil.preImg(index, pics);
    },
    infoInput: function (e) {
        let type = e.target.dataset.type
        let value = e.detail.value;
        let contentValue = value;
        if (contentValue.length == 0) {
            contentValue = '请输入室内湿度';
        }
        this.setData({
            content: contentValue,
        })
        switch (type) {
            case 1:
                this.data.dailyInspections.indoorsTemperature = value;
                loadViewRect(view_width => {
                    console.log("1infoInput" + type, view_width);
                    this.setData({
                        width1: view_width,
                    })
                });
                break;
            case 2:
                this.data.dailyInspections.indoorsHumidity = value;
                break;
            case 3:
                this.data.dailyInspections.outsideTemperature = value;
                loadViewRect(view_width => {
                    console.log("3infoInput" + type, view_width);
                    this.setData({
                        width2: view_width,
                    })
                });
                break;
            case 4:
                this.data.dailyInspections.outsideHumidity = value;
                break;
            default:
                this.data.dailyInspections.remark = value;
        }
    },
    deleteImg: function (e) {
        let dataset = e.target.dataset;
        console.log(e);
        let index = dataset.index == undefined ? 0 : dataset.index;
        let picsArr = loadPicsArr(dataset.type, this.data);
        // console.log('index=' + index);
        imgUtil.deleteImg(index, picsArr[0], (pics, sArr, type) => {
            let jsonData;
            // console.log('pics', pics);
            if (pics == null) {
                console.log('pics true');
                jsonData = loadJsonData(type, "", "");
            } else {
                jsonData = loadJsonData(type, pics, sArr);
            }
            this.setData(jsonData);
        }, picsArr[1], dataset.type);
    },
    nameInput: function (e) {
        let index = e.target.dataset.index;
        let ps = this.data.peoples;
        ps[index].name = e.detail.value;
    },
    idcardInput: function (e) {
        let index = e.target.dataset.index;
        let ps = this.data.peoples;
        ps[index].idcard = e.detail.value;
    },
    unitInput: function (e) {
        let index = e.target.dataset.index;
        let ps = this.data.peoples;
        ps[index].unit = e.detail.value;
    },
    submit: function () {
        if (!checkPeoples(this.data.peoples)) {
            return;
        }
        this.data.dailyInspections.date = formatTime(new Date());
        if (!checkInspections(this.data.dailyInspections)) {
            return;
        }
        if (this.data.dutyPersonImg_S.length < 1) {
            viewUtil.showToast('请添加值班人员照片');
            return;
        }
        if (this.data.dbRoomInspectionsTableImg_S.length < 1) {
            viewUtil.showToast('请添加中心机房巡查记录表照片');
            return;
        }
        if (this.data.dbRoomDailyCheckInTableImg_S.length < 1) {
            viewUtil.showToast('请添加数据中心机房日常情况登记表照片');
            return;
        }
        if (this.data.indoorsTemperatureHumidityImg_S.length < 1) {
            viewUtil.showToast('请添加室内温度湿度，空调面板数字照片');
            return;
        }
        if (this.data.outsideTemperatureHumidityImg_S.length < 1) {
            viewUtil.showToast('请添加室外温度湿度，空调面板数字照片');
            return;
        }
        this.setData({
            loading: true,
        });
        wx.request({
            url: service.parentUrl + '/daily_inspections_unfile',
            data: {
                peopleInfos: this.data.peoples,
                dailyInspections: this.data.dailyInspections,
                files: [
                    ...this.data.dutyPersonImg_S,
                    this.data.dbRoomInspectionsTableImg_S,
                    this.data.dbRoomDailyCheckInTableImg_S,
                    this.data.indoorsTemperatureHumidityImg_S,
                    this.data.outsideTemperatureHumidityImg_S,
                    ...this.data.remarkImg_S,
                ]
            },
            header: service.addToken({ 'content-type': 'application/json' }),
            method: 'POST',
            dataType: 'json',
            responseType: 'text',
            success: (result) => {
                this.setData({
                    loading: false,
                });
                if (result.data.code != 200) {
                    viewUtil.showToast(result.data.message);
                } else {
                    viewUtil.showToast('上传成功');
                    wx.navigateBack({});
                }
            },
            fail: () => {
                this.setData({
                    loading: false,
                });
                viewUtil.showToast('请检查网络，稍后重试');
            },
            complete: () => { }
        });

    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var systemInfo = wx.getSystemInfoSync();
        let height = systemInfo.windowHeight * 750 / systemInfo.windowWidth;
        console.log('height', height);
        this.setData({
            cHeight: height * 0.75,
        })
    },
})

function checkPeoples(peoples) {
    if (peoples.length === 0) {
        viewUtil.showToast('请添加人员信息');
        return false;
    }
    for (let index = 0; index < peoples.length; index++) {
        const element = peoples[index];
        // console.log(index, element);
        if (isEmpty(element.name) ||
            isEmpty(element.idcard) ||
            isEmpty(element.unit)) {
            viewUtil.showToast('请补充第' + (index + 1) + '个人员信息');
            return false;
        }
    }
    return true;
}

function checkInspections(data) {
    if (isEmpty(data.date)) {
        viewUtil.showToast('请选择日期');
        return false;
    }
    if (isEmpty(data.indoorsTemperature)) {
        viewUtil.showToast('请填写室内温度');
        return false;
    }
    if (isEmpty(data.indoorsHumidity)) {
        viewUtil.showToast('请填写室内湿度');
        return false;
    }
    if (isEmpty(data.outsideTemperature)) {
        viewUtil.showToast('请填写室外温度');
        return false;
    }
    if (isEmpty(data.outsideHumidity)) {
        viewUtil.showToast('请填写室外湿度');
        return false;
    }
    return true;
}

function isEmpty(data) {
    if (data == null || data == undefined || data.length === 0) {
        return true;
    }
    return false;
}
function loadPics(type, data) {
    let pics;
    if (type == 6) {
        pics = data.remarkImg
    } else if (type == 5) {
        pics = data.dutyPersonImg;
    } else if (type == 1) {
        pics = data.dbRoomInspectionsTableImg;
    } else if (type == 2) {
        pics = data.dbRoomDailyCheckInTableImg;
    } else if (type == 3) {
        pics = data.indoorsTemperatureHumidityImg;
    } else {
        pics = data.outsideTemperatureHumidityImg;
    }
    return pics;
}
function loadPicsArr(type, data) {
    let pics = [];
    if (type == 6) {
        pics.push(data.remarkImg);
        pics.push(data.remarkImg_S);
    } else if (type == 5) {
        pics.push(data.dutyPersonImg);
        pics.push(data.dutyPersonImg_S);
    } else if (type == 1) {
        pics.push(data.dbRoomInspectionsTableImg);
        pics.push(data.dbRoomInspectionsTableImg_S);
    } else if (type == 2) {
        pics.push(data.dbRoomDailyCheckInTableImg);
        pics.push(data.dbRoomDailyCheckInTableImg_S);
    } else if (type == 3) {
        pics.push(data.indoorsTemperatureHumidityImg);
        pics.push(data.indoorsTemperatureHumidityImg_S);
    } else {
        pics.push(data.outsideTemperatureHumidityImg);
        pics.push(data.outsideTemperatureHumidityImg_S);
    }
    return pics;
}
function loadFiledName(type) {
    let filed;
    if (type == 6) {
        filed = 'remarkImg'
    } else if (type == 5) {
        filed = 'dutyPersonImg';
    } else if (type == 1) {
        filed = 'dbRoomInspectionsTableImg';
    } else if (type == 2) {
        filed = 'dbRoomDailyCheckInTableImg';
    } else if (type == 3) {
        filed = 'indoorsTemperatureHumidityImg';
    } else {
        filed = 'outsideTemperatureHumidityImg';
    }
    return filed;
}

function loadJsonData(type, pics, sArr) {
    let json = {};
    if (type == 6) {
        json['remarkImg'] = pics;
        json['remarkImg_S'] = sArr;
    } else if (type == 5) {
        json['dutyPersonImg'] = pics;
    } else if (type == 1) {
        json['dbRoomInspectionsTableImg'] = pics;
        json['dbRoomInspectionsTableImg_S'] = sArr;
    } else if (type == 2) {
        json['dbRoomDailyCheckInTableImg'] = pics;
        json['dbRoomDailyCheckInTableImg_S'] = sArr;
    } else if (type == 3) {
        json['indoorsTemperatureHumidityImg'] = pics;
        json['indoorsTemperatureHumidityImg_S'] = sArr;
    } else {
        json['outsideTemperatureHumidityImg'] = pics;
        json['outsideTemperatureHumidityImg_S'] = sArr;
    }
    return json;
}

function loadViewRect(callback) {
    let selQuery = wx.createSelectorQuery();
    selQuery.select('.inputLenght').boundingClientRect(rect => {
        let width = rect.width;
        callback(width + 1);
    }).exec();
}