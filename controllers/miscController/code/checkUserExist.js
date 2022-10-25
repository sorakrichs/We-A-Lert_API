const checkUserExist = async (data) => {

    const ControllerName = 'memberRegisterController';
    const {userModel} = require('../../mongodbController')

    if (typeof data != 'object') { throw new Error(`${ControllerName}: <data> must be Object`);}
    else {

        let user_exist = await userModel.findOne({ $or : [{username : data.username},{phone : data.phone}, {personalid: data.personalid}]}).then((r) => r).catch((err) => { throw err;});
        return (user_exist) ? true : false;

    }


}

module.exports = checkUserExist;