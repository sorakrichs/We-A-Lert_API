const util = require('util');
const multer  = require('multer');
const crypto = require('crypto');
const path = require('path');
const {GridFsStorage} = require('multer-gridfs-storage');
const mongouri = require('../configs/cfg_mongodb');

const uploadImageMiddleware = async (bucketname) => {
    const storage = new GridFsStorage({
        url: mongouri,
        file: (req,file) => ({ bucketName: bucketname,filename: file.originalname })
    });
    return storage;
}


module.exports = uploadImageMiddleware;