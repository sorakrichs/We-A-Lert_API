const MongoDB_URI = process.env.MONGODB_URI || require('../configs/cfg_mongodb');
const mongoose = require('mongoose');


/**
 * ไว้สำหรับเชื่อมต่อ MongoDB ที่หน้าแรก
 * @returns {Promise<mongoose>}
 */
const mongooseDoConnect = () => {
    return new Promise(
        (reslove, reject) => {
            try {
                mongoose.connect(MongoDB_URI)
                .then(r => { reslove(r);})
                .catch(e => { reject(e); });
            } catch (error) {
                reject(error);
            }
        }
    )
};


module.exports = { mongoose, mongooseConn: mongoose, mongooseDoConnect };