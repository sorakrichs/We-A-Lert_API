
const updateUserStatusController = async (id,status) => {
    
    const ControllerName = 'updateUserStatusController';
    const {userModel,ObjectId} = require('../../mongodbController')


    if (typeof id != 'string') { throw new Error(`${ControllerName}: <id> must be Object`);}
    else if (typeof status != 'string') { throw new Error(`${ControllerName}: <status> must be Object`);}
    else {

        return await userModel.updateOne(
            { _id :  ObjectId(id) },
            { $set: { 
                    status: status
                }   
            }
        ).catch(err => {throw err})

    }
}

module.exports = updateUserStatusController;