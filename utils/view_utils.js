function showToast(title) {
    wx.hideLoading();
    wx.showToast({
        title: title,
        icon: 'none',
        duration: 1500,
        mask: false,
        success: (result) => {

        },
        fail: () => { },
        complete: () => { }
    });
}

function showModal(title, msg, callback) {
    wx.showModal({
        title: title,
        content: msg,
        showCancel: true,
        cancelText: '取消',
        cancelColor: '#000000',
        confirmText: '确定',
        confirmColor: '#3CC51F',
        success: (result) => {
            if (result.confirm) {
                callback(true);
            } else {
                callback(false);
            }
        },
        fail: () => { },
        complete: () => { }
    });
}

function showLoading(title = '等待...') {
    wx.showLoading({
        title: title,
        mask: true,
        success: (result) => {

        },
        fail: () => { },
        complete: () => { }
    });
}

function dismissLoading() {
    wx.hideLoading();
}

module.exports = {
    dismissLoading: dismissLoading,
    showLoading: showLoading,
    showModal: showModal,
    showToast: showToast,
}