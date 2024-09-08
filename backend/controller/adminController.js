// const Store =  require('../models/Store');

const Upload = require("../helpers/upload");

const uploadFile = async(req, res)=>{

    try {
        const upload = await Upload.uploadFile(req.file.path);

        // var store = new Store({
        //     file_url:upload.secure_url
        // });
        // var record = await store.save();
        res.send({ success:true, msg:'File Uploaded Successfully!', data:upload });

    } catch (error) {
        res.send({ success:false, msg:error.message });
    }

}

module.exports = {
    uploadFile
}