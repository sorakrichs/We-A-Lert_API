const getSubReportController= async (id,type) => {
    const ControllerName = 'memberAuthorizationController';
    const {ObjectId,carAccidentModel,fireModel,floodModel,earthquakeModel,epidemicModel} = require('../../mongodbController')
    const {getImageFormId} = require('../../FileController')
    const user = require('../../userController')
    try {

        switch (type) {
            case 'fire':
                return await fireModel.findOne({reportId: ObjectId(id)}).then(r =>r)
            break;
            case 'car':
                return await carAccidentModel.findOne({reportId: ObjectId(id)}).then(r =>r)
            break;
            case 'flood':
                return await floodModel.findOne({reportId: ObjectId(id)}).then(r =>r)
            break;
            case 'earthquake':
                return await earthquakeModel.findOne({reportId: ObjectId(id)}).then(r =>r)
            break;
            case 'epidemic':
                return await epidemicModel.findOne({reportId: ObjectId(id)}).then(r =>r)
            break;
            default : 
                return null;
        }
        
       
        
    
    } catch (err) {
        throw err
    }
}

module.exports = getSubReportController;
