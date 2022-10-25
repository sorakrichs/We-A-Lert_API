const checkPhone = async (phone) => {

    const ControllerName = 'checkPhone';
    const {userModel} = require('../../mongodbController')
    const jwt = require("jwt-simple");
    const {encryptPassword} = require("../../miscController")
    const SECRET = require("../../../configs/cfg_key").JWT_SECRET;
    if (typeof phone != 'string') { throw new Error(`${ControllerName}: <phone> must be String`);}
    else {

        let phone_exist = await userModel.findOne({phone: phone}).then((r) => r).catch((err) => { throw err;});

        if(!phone_exist) return null;

        let iat = new Date().getTime();
        let exp = Math.round(Date.now() / 1000 + 30 * 60);
        const payload = {
            _id: phone_exist._id,
            type:'forgot',
            phone: phone,
            access: encryptPassword(iat + phone + exp),
            iat: iat, 
            exp: exp
        };

        return jwt.encode(payload, SECRET);

    }


}

module.exports = checkPhone;