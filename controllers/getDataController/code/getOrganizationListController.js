const getOrganizationListController = async () => {
    const ControllerName = 'memberAuthorizationController';
    const {ObjectId,organizationModel} = require('../../mongodbController')
    const {getImageFormId} = require('../../FileController')
    try {

        return await organizationModel.find();

    
    
    } catch (err) {
        throw err
    }
}

module.exports = getOrganizationListController;
