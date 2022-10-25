const getUserListController = async () => {
    const ControllerName = 'memberAuthorizationController';
    const {reportModel,ObjectId} = require('../../mongodbController')
    const {getImageFormId} = require('../../FileController')
    const user = require('../../userController')
    try {

        
        return await reportModel.find();
    
    
    } catch (err) {
        throw err
    }
}

module.exports = getUserListController;
