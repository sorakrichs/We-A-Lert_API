
const getVolunteerDataController = async (id='') => {
    const ControllerName = 'getVolunteerDataController';
    const {ObjectId,volunteerModel} = require('../../mongodbController')
    const {getImageFormId} = require('../../FileController')
    const user = require('../../userController')
    try {

        if (typeof id != 'string') { throw new Error(`${ControllerName}: <id> must be String`);} 
        else {
        const volunteer_data = await volunteerModel.aggregate([
            {
                '$match': {
                    'userId': ObjectId(id)
                }
            }, {
                '$lookup': {
                    'from': 'organization', 
                    'localField': 'organization_id', 
                    'foreignField': '_id', 
                    'as': 'organization'
                }
            }, {
                '$unwind': {
                    'path': '$organization', 
                    'preserveNullAndEmptyArrays': true
                }
            }, {
                '$project': {
                    '_id': '$organization_id', 
                    'teamrole': '$teamrole', 
                    'organization_name': '$organization.name', 
                    'organization_branchname': '$organization.branchname'
                }
            }
         ])

            return volunteer_data[0];
        }

    
    
    } catch (err) {
        throw err
    }
}

module.exports = getVolunteerDataController;
