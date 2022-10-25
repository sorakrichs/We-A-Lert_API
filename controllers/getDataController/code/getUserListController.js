
const getUserListController = async () => {
    const ControllerName = 'memberAuthorizationController';
    const {userModel,ObjectId,userAddressModel} = require('../../mongodbController')
    const {getImageFormId} = require('../../FileController')
    const user = require('../../userController')
    try {

        const user_data = await userModel.aggregate([
            {
                '$match': {
                    'role': {
                      '$ne': 'admin'
                    }
                }
            },
            {
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


        user_data.map( async (data) => {
            
            let login_token = user.tokenList.has(data._id.toString());
            data.login_status = (login_token) ? true : false;
            return data

        })

        return user_data;

    
    
    } catch (err) {
        throw err
    }
}

module.exports = getUserListController;
