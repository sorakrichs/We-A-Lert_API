


const getUserReportController = async (id) => {

    const ControllerName = 'getUserReport';
    const {ObjectId,userModel,reportModel} = require('../../mongodbController')
    const {getImageFormId} = require('../../FileController')

    try {

        const reportData = await reportModel.findById(id)

        const data = await userModel.aggregate([
            {
              '$match': {
                '_id': {
                  '$in': (reportData.volunteerId) ? [
                    ObjectId(reportData.userId),ObjectId(reportData.volunteerId)
                  ] : [ObjectId(reportData.userId)]
                }
              }
            }, {
              '$lookup': {
                'from': 'volunteer', 
                'localField': '_id', 
                'foreignField': 'userId', 
                'as': 'volunteerData'
              }
            }, {
              '$unwind': {
                'path': '$volunteerData', 
                'preserveNullAndEmptyArrays': true
              }
            }, {
              '$lookup': {
                'from': 'organization', 
                'localField': 'volunteerData.organization_id', 
                'foreignField': '_id', 
                'as': 'organizationData'
              }
            }, {
              '$unwind': {
                'path': '$organizationData', 
                'preserveNullAndEmptyArrays': true
              }
            }, {
              '$project': {
                '_id': '$_id', 
                'username': '$username', 
                'role': '$role', 
                'teamrole': '$volunteerData.teamrole', 
                'organization_name': '$organizationData.name', 
                'organization_branchname': '$organizationData.branchname', 
                'image_id': '$image_id'
              }
            }, {
              '$sort': {
                'role': 1
              }
            }
        ])


        return await Promise.all(
            data.map( async (userData) => {

                if(userData.image_id)
                    userData.image = await getImageFormId(userData.image_id);

                return userData;

            })
        )
        
       
        
    
    } catch (err) {
        throw err
    }
}

module.exports = getUserReportController ;