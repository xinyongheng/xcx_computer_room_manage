const viewUtil = require("./view_utils.js");
const service = require("./service.js");
function chooseImgUpload(filedName, type, callback) {
    wx.chooseImage({
        count: 1,
        sizeType: ['original', 'compressed'],
        sourceType: ['album', 'camera'],
        success: (result) => {
            viewUtil.showLoading('上传中...');
            var imgPath = result.tempFilePaths[0];
            wx.uploadFile({
                url: service.parentUrl + '/api/upload_file',
                filePath: imgPath,
                name: filedName,
                formData: {},
                success: (res) => {
                    viewUtil.dismissLoading();
                    var data = JSON.parse(res.data);
                    if (data.code == 200) {
                        let sPath = data.data[0];
                        sPath.type = type;
                        callback({
                            imgPath: imgPath,
                            sImgPath: sPath
                        }, null);
                    } else {
                        let err = data.message;
                        callback(null, '上传图片失败-' + err);
                    }
                },
                fail: () => {
                    viewUtil.dismissLoading();
                    callback(null, '上传图片失败');
                },
                complete: () => { }
            });

        },
        fail: () => {
            callback(null, '未选择图片');
        },
        complete: () => { }
    });
}

function chooseImgUpload1(filedName, type, arr, sArr, callback) {
    chooseImgUpload(filedName, type, (res, err) => {
        if (err) {
            viewUtil.showToast(err);
            return callback(null, err);
        }
        if (typeof arr === 'object' && typeof sArr === 'object') {
            arr.push(res.imgPath);
            sArr.push(res.sImgPath);
            callback(arr, sArr);
        } else {
            callback(res, null)
        }
    })
}

function preImg(index, pics) {
    if (typeof pics === 'string') {
        pics = [pics];
        index = 0;
    }
    wx.previewImage({
        current: pics[index],
        urls: pics,
        success: (result) => {

        },
        fail: () => { },
        complete: () => { }
    });

}

function deleteImg(index, pics, deleteCallback, sArr = null, tag = null) {
    viewUtil.showModal('温馨提示', '您确定要删除这张图片么？', result => {
        if (result) {
            if (typeof pics === 'string') {
                return deleteCallback(null, null, tag);
            } else {
                // console.log('deleteImg', 'index=' + index);
                pics.splice(index, 1);
                if (sArr != null) {
                    sArr.splice(index, 1);
                }
                deleteCallback(pics, sArr, tag);
            }
        }
    });
}

module.exports = {
    chooseImgUpload: chooseImgUpload,
    chooseImgUpload1: chooseImgUpload1,
    preImg: preImg,
    deleteImg: deleteImg,
}