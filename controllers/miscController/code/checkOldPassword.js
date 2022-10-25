const checkOldPassword = async (id,oldpassword) => {
    
    const ControllerName = 'checkOldPassword';
    const {userModel,ObjectId} = require('../../mongodbController')
    const {encryptPassword} = require("../../miscController")

    if (typeof oldpassword != 'string') { throw new Error(`${ControllerName}: <oldpassword> must be String`);}
    else {

        let en_old_password = encryptPassword(oldpassword.toString());
        const find_user = await userModel.findOne({
            _id: ObjectId(id),
            password : en_old_password
        }).then((r) => r).catch((err) => { throw err;});

        if(!find_user)
            throw new Error(`changepass_error_01`);

        return true;
    }
}

module.exports = checkOldPassword;