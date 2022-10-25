const volunteerRegisterController = async (data) => {

    const ControllerName = 'memberRegisterController';
    const {userModel,volunteerModel} = require('../../mongodbController')
    const {encryptPassword}  = require('../../miscController')

    if (typeof data != 'object') { throw new Error(`${ControllerName}: <data> must be Object`);}
    else {

        let user_exist = await userModel.findOne({ $or : [{username : data.username},{phone : data.phone}, {personalid: data.personalid}]}).then((r) => r).catch((err) => { throw err;});

        if(user_exist)
            throw new Error(`regis_error_01`);

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
            image_id: data.image
            
        });
        
        let result = await new_member.save().then(r => r).catch((err) => { throw err ;});
        
        const new_volunteer = new volunteerModel({
            userId: result._id,
            teamrole: data.teamrole,
            organization_id: data.organization_id
        })

        return await new_volunteer.save().then(r => r).catch((err) => { throw err ;});

        
    }


}

module.exports = volunteerRegisterController;