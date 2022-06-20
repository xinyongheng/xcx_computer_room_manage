// pages/applyEnter/applyEnter.js
const service = require("../../utils/service");
var util = require("../../utils/util.js");
const view_utils = require("../../utils/view_utils.js");
Page({

    /**
     * 页面的初始数据
     */
    data: {
        showDialog: false,
        loadTag: false,
        btnDisabled: false,
        reason: '',
        peoples: [],
    },
    appendPeople() {
        this.setData({
            showDialog: true,
        });
    },
    reasonInput: function (e) {
        // console.log(e.detail.value);
        this.setData({
            reason: e.detail.value
        });

    },
    applyEnter() {
        this.setData({ loadTag: true });
        wx.request({
            url: require("../../utils/service").parentUrl + '/outside_enter_apply',
            data: {
                peopleInfos: this.data.peoples,
                reason: this.data.reason,
                date: util.formatTime(new Date()),
            },
            header: service.addToken({ 'Content-Type': 'application/json' }),
            method: 'POST',
            dataType: 'json',
            responseType: 'text',
            success: (result) => {
                if (result.data.code != 200) {
                    view_utils.showToast('上传失败-' + result.data.message);
                    return;
                } else {
                    view_utils.showToast('提交成功');
                    setTimeout(() => {
                        wx.navigateBack({
                            delta: 1
                        });
                    }, 1500)
                }
                // console.log(result);
            },
            fail: () => {
            },
            complete: () => {
                this.setData({ loadTag: false });
            }
        });
    },
    /**
    * 控制 pop 的打开关闭
    * 该方法作用有2:
    * 1：点击弹窗以外的位置可消失弹窗
    * 2：用到弹出或者关闭弹窗的业务逻辑时都可调用
    */
    toggleDialog() {
        this.setData({
            showDialog: !this.data.showDialog
        });
    },
    fillPeopleInfoFrom(data) {
        // console.log(data.detail.value);
        const people = data.detail.value;
        if (people.name.length < 1) {
            view_utils.showToast('请输入人员姓名');
            return;
        }
        if (people.idcard.length < 1) {
            view_utils.showToast('请输入人员身份证');
            return;
        }
        if (people.idcard.length != 18) {
            view_utils.showToast('请输入正确的身份证号');
            return;
        }
        if (people.unit.length < 1) {
            view_utils.showToast('请输入人员单位名称');
            return;
        }
        // 类型 1外部人员，2值班人员
        people.type = 1;
        this.data.peoples.push(people);
        let newPeoples = this.data.peoples;
        this.setData({
            peoples: newPeoples,
        })
        console.log(this.data.peoples);
    },
    cancleDialog(data) {
        console.log('cancleDialog', data.detail.value);
    },
    deleteItem(e) {
        let index = e.target.dataset.index;
        // console.log('index', index);
        view_utils.showModal('提示', "确定删除第" + (index + 1) + "个人员么？", result => {
            if (result) {
                let ps = this.data.peoples;
                console.log('ps', ps);
                ps.splice(index, 1);
                console.log('ps', ps);
                this.setData({
                    peoples: ps
                })
            }
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

    },
})