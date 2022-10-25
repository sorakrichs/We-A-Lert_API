


const updateVolunteerController = async (id,volunteer_id) => {

    const ControllerName = 'updateVolunteerController';
    const {reportModel,ObjectId} = require('../../mongodbController')
    if (typeof id != 'string') { throw new Error(`${ControllerName}: <id> must be String`);}
    else if (typeof volunteer_id != 'string') { throw new Error(`${ControllerName}: <volunteer_id> must be String`);}
    else {

        return await reportModel.updateOne(
            { _id :  ObjectId(id) },
            { $set: { 
                    volunteerId: ObjectId(volunteer_id)
                }   
            }
        ).catch(err => {throw err})

    }
}

module.exports = updateVolunteerController;