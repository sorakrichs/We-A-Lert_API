const getMemberListController = async () => {
    const ControllerName = 'memberAuthorizationController';
    const {userModel,ObjectId} = require('../../mongodbController')
    const {getImageFormId} = require('../../FileController')
    try {

        const data = await userModel.aggregate([
            {
              '$match': {
                'role': 'member',
                'status': {
                  '$ne': 'ban'
                }
              }
            },{
              '$project': {
                '_id': 1, 
                'username': 1, 
                'name': 1, 
                'surname': 1, 
                'role': 1, 
                'email': 1, 
                'personalid': 1, 
                'phone': 1, 
                'image_id': 1,
                'status':1
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

module.exports = getMemberListController;