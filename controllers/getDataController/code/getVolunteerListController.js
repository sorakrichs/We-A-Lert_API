const getUserListController = async () => {
    const ControllerName = 'memberAuthorizationController';
    const {userModel,ObjectId} = require('../../mongodbController')
    const {getImageFormId} = require('../../FileController')
    try {

        const data = await userModel.aggregate([
            {
              '$match': {
                'role': 'volunteer'
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

module.exports = getUserListController;