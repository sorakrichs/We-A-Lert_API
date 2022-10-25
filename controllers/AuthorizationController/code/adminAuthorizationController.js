
const memberAuthorizationController = async (data) => {

    const ControllerName = 'memberAuthorizationController';
    const {userModel} = require('../../mongodbController')
    const SECRET = require("../../../configs/cfg_key").JWT_SECRET;
    const jwt = require("jwt-simple");
    const {encryptPassword} = require("../../miscController")
    const user = require('../../userController')

    try {
        if (typeof data != 'object') { throw new Error(`${ControllerName}: <data> must be Object`);}
        else {
            
            let en_password = encryptPassword(data.password.toString());

            const find_member = await userModel.findOne({
                $or : [{username : data.usernameorphone}, {phone : data.usernameorphone}],
                password : en_password
            }).then((r) => r).catch((err) => { throw err;});
            
            
            if(find_member)
            {

                if(find_member.role != "admin") 
                    throw new Error ("login_error_02")

                if(find_member.status == 'ban')
                    throw new Error ("login_error_04")


                const payload = {
                    _id: find_member._id,
                    username: find_member.username,
                    phone: find_member.phone,
                    role: 'admin',
                    iat: new Date().getTime(),
                    exp: Math.round(Date.now() / 1000 + 5 * 60 * 60)
                };

                return {id:find_member._id, token:jwt.encode(payload, SECRET)};

            } else {
                throw new Error ("login_error_02")

            }

                
            
        }
    } catch (err) {
        throw err;
    }


}

module.exports = memberAuthorizationController;