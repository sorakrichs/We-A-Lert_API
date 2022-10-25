const removeVolunteerController = async (id,data) => {
    
    const ControllerName = 'addVolunteerController';
    const {userModel,volunteerModel,ObjectId} = require('../../mongodbController')
    try {
        if (typeof data != 'object') { throw new Error(`${ControllerName}: <data> must be Object`);}
        else {


            return await Promise.all([
            userModel.updateOne(
                { _id :  ObjectId(data._id) },
                { $set: { 
                        role: 'member'
                    }   
                }
            ),
            volunteerModel.deleteOne({userId: ObjectId(data._id)})
            ])

            
        }
    } catch(err) {
        throw err
    }
}

module.exports = removeVolunteerController;