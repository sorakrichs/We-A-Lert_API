
const editUserDataController = async (id,data) => {
    
    const ControllerName = 'editUserDataController';
    const {userModel,ObjectId} = require('../../mongodbController')
    
    let user_exist = await userModel.findOne({ 
        $and : 
        [ {$or : [{phone : data.phone}, {personalid: data.personalid}]},
        {_id: { $ne :  ObjectId(id)  } }]
    })
    .then((r) => r).catch((err) => { throw err;});

    if(user_exist)
        throw new Error(`regis_error_01`);

    if (typeof data != 'object') { throw new Error(`${ControllerName}: <data> must be Object`);}
    else {

        return await userModel.updateOne(
            { _id :  ObjectId(id) },
            { $set: { 
                    username: data.username,
                    name: data.name,
                    surname: data.surname,
                    email: data.email,
                    personalid: data.personalid,
                    phone: data.phone
                }   
            }
        ).catch(err => {throw err})

    }
}

module.exports = editUserDataController;