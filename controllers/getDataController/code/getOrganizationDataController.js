

const getOrganizationDataController= async (id) => {
    const ControllerName = 'getOrganizationDataController';
    const {ObjectId,volunteerModel} = require('../../mongodbController')
    const {getImageFormId} = require('../../FileController')
    const {getUserReportedCount} = require('../../ReportController')
    
    try {
      
        const data = await volunteerModel.aggregate([
            {
              '$match': {
                'organization_id': ObjectId(id)
              }
            }, {
              '$lookup': {
                'from': 'user', 
                'localField': 'userId', 
                'foreignField': '_id', 
                'as': 'user'
              }
            }, {
              '$unwind': {
                'path': '$user'
              }
            }, {
              '$project': {
                '_id': '$userId', 
                'username': '$user.username', 
                'name': '$user.name', 
                'surname': '$user.surname', 
                'role': '$user.role', 
                'email': '$user.email', 
                'personalid': '$user.personalid', 
                'phone': '$user.phone', 
                'image_id': '$user.image_id', 
                'teamrole': '$teamrole'
              }
            }
        ])


        return await Promise.all(
            data.map( async (userData) => {

                if(userData.image_id)
                    userData.image = await getImageFormId(userData.image_id);

                    userData.count = await getUserReportedCount(userData._id);

                return userData;

            })
        )

    
    
    } catch (err) {
        throw err
    }
}

module.exports = getOrganizationDataController;
