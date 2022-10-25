
const crypto = require('crypto');

const encryptPassword = (inputString) => {


        try {
                if(typeof inputString == 'string')
                {
                        const SECRET = require("../../../configs/cfg_key").PASS_SECRET;
                        let hash256 = crypto.createHash('sha256WithRSAEncryption', SECRET).update(inputString).digest('hex');
                        const finalhash = crypto.createHash('md5WithRSAEncryption', SECRET).update(hash256).digest('hex');
                        return finalhash;

                } else {

                        throw new Error(`encryptPassword: <password> must be String`);

                }

        } catch(err) {
                throw err;
        }

}

module.exports = encryptPassword;