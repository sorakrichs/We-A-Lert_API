



const memberRegisterController = async (data) => {

    const ControllerName = 'memberRegisterController';
    const {userModel} = require('../../mongodbController')
    const {encryptPassword}  = require('../../miscController')

    if (typeof data != 'object') { throw new Error(`${ControllerName}: <data> must be Object`);}
    else {

        let en_password = encryptPassword(data.password);

        const new_member = new userModel({

            username : data.username,
            password : en_password,
            name: data.name,
            surname: data.surname,
            email: data.email,
            role: data.role,
            personalid: data.personalid,
            phone: data.phone,
            image_id: data.image_id

            
        });
        
        let result = await new_member.save().then(r => r).catch((err) => { console.log(err.message); throw err ;});
        
        return result._id;
        
    }


}

module.exports = memberRegisterController;