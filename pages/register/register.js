const service = require("../../utils/service");
const { isEmpty } = require("../../utils/util");
const view_utils = require("../../utils/view_utils");

// pages/register/register.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        phone_src: 'https://pic.52112.com/180719/EPS-180719_122/WQBFvbHUZJ_small.jpg',
        typeItems: [{
            text: '值班巡查',
            type: 4,
            checked: false
        }, {
            text: '仅登记',
            type: 2,
            checked: false
        }],
        type: -1,
        companyName: '',
        companyTypes: [
            {
                text: '数据局',
                type: 0,
                checked: false
            },
            {
                text: '非数据局',
                type: 3,
                checked: false
            }
        ]
    },
    checkboxChange: function (e) {
        const checked = e.detail.value;
        const changed = {};
        for (let i = 0; i < this.data.typeItems.length; i++) {
            const element = this.data.typeItems[i];
            if (checked.indexOf(element.text) !== -1) {
                changed['typeItems[' + i + '].checked'] = true;
                changed['type'] = element.type;
            } else {
                changed['typeItems[' + i + '].checked'] = false;
            }
        }
        this.setData(changed);
        console.log('type=', this.data.type);
        console.log('companyName=', this.data.companyName);

    },
    checkboxChange1: function (e) {
        const checked = e.detail.value;
        const changed = {};
        for (let i = 0; i < this.data.companyTypes.length; i++) {
            const element = this.data.companyTypes[i];
            if (checked.indexOf(element.text) !== -1) {
                changed['companyTypes[' + i + '].checked'] = true;
                changed['type'] = element.type;
                if (element.type === 0) {
                    changed['companyName'] = element.text;
                } else {
                    changed['companyName'] = '';
                }
            } else {
                changed['companyTypes[' + i + '].checked'] = false;
            }
        }
        this.setData(changed);
        console.log('companyName=', this.data.companyName);
    },
    toRegister: function (data) {
        let json = data.detail.value
        console.log(json);
        if (isEmpty(json.nickname)) {
            return view_utils.showToast('请输入姓名');
        }
        if (isEmpty(json.account)) {
            return view_utils.showToast('请输入手机号');
        }
        if (isEmpty(json.password)) {
            return view_utils.showToast('请输入密码');
        }
        if (this.data.type == -1) {
            return view_utils.showToast('请选择类型');
        }
        if (this.data.type == 4) {
            return view_utils.showToast('请选择单位');
        }
        if ((this.data.type == 0 || this.data.type == 3) && isEmpty(json.unit)) {
            return view_utils.showToast('请输入单位名称');
        }
        if ((this.data.type == 0 || this.data.type == 3) && isEmpty(json.code)) {
            return view_utils.showToast('请输入邀请码');
        }
        json.type = this.data.type;
        console.log(json);
        view_utils.showLoading('等待...');
        service.loadOpenId((err, openid) => {
            if (err) {
                return view_utils.showToast(err);
            }
            json.openid = openid;
            wx.request({
                url: service.parentUrl + '/api/register',
                data: json,
                header: { 'content-type': 'application/json' },
                method: 'POST',
                dataType: 'json',
                responseType: 'text',
                success: (result) => {
                    if (result.data.code != 200) {
                        view_utils.dismissLoading();
                        return view_utils.showToast('注册失败-' + result.data.message);
                    }
                    view_utils.showToast('注册成功');
                    service.saveUserInfo(result.data);
                    setTimeout(() => {
                        view_utils.dismissLoading();
                        wx.navigateBack({
                            delta: 1
                        });
                    }, 1500);
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

    },

})