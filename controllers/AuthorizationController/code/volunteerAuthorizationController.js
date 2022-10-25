
const volunteerAuthorizationController = async (data) => {

    const ControllerName = 'memberAuthorizationController';
    const {userModel,volunteerModel} = require('../../mongodbController');
    const SECRET = require("../../../configs/cfg_key").JWT_SECRET;
    const jwt = require("jwt-simple");
    const {encryptPassword} = require("../../miscController")
    const user = require('../../userController')

    if (typeof data != 'object') { throw new Error(`${ControllerName}: <data> must be Object`);}
    else if (typeof data.usernameorphone != 'string') { throw new Error(`${ControllerName}: <data.usernameorphone> must be String`);}
    else if (typeof data.password != 'string') { throw new Error(`${ControllerName}: <data.password> must be String`);}
    else {
        
        let en_password = encryptPassword(data.password.toString());

        const find_user = await userModel.findOne({
            $or : [{username : data.usernameorphone}, {phone : data.usernameorphone}],
            password : en_password
        }).then((r) => r).catch((err) => { throw err;});
        
        
        if(find_user)
        {

            if(user.tokenList.get(find_user._id))
            throw new Error ("login_error_01")

            const find_volunteer =  await volunteerModel.findOne({
                userId : find_user._id
            })

            if(find_volunteer.status == 'ban')
                throw new Error ("login_error_04")
            
            const payload = {
                _id: find_user._id,
                username: find_user.username,
                phone: find_user.phone,
                role: 'volunteer',
                teamrole: find_volunteer.teamrole,
                iat: new Date().getTime()
            };

            return {id:find_user._id, token:jwt.encode(payload, SECRET)};

        } else {

            throw new Error ("login_error_02")

        }

            
        
    }


}

module.exports = volunteerAuthorizationController;