


const updateStatusController = async (id,status) => {

    const ControllerName = 'updateStatusController';
    const {reportModel,ObjectId} = require('../../mongodbController')
    if (typeof id != 'string') { throw new Error(`${ControllerName}: <id> must be String`);}
    else if (typeof status != 'string') { throw new Error(`${ControllerName}: <status> must be String`);}
    else {

        return await reportModel.updateOne(
            { _id :  ObjectId(id) },
            { $set: { 
                    status: status
                }   
            }
        ).catch(err => {throw err})

    }
}

module.exports = updateStatusController;