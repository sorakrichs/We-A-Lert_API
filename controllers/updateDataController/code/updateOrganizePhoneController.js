const updateOrganizeAddressController = async (id,phone) => {
    
    const ControllerName = 'updateOrganizeAddressController';
    const {organizationModel,ObjectId} = require('../../mongodbController')


    if (!Array.isArray(phone)) { throw new Error(`${ControllerName}: <phone> must be Array`);}
    else {

        return await organizationModel.updateOne(
            { _id :  ObjectId(id) },
            { $set: { 
                    phone: phone,
                }   
            }
        ).catch(err => {throw err})

    }
}

module.exports = updateOrganizeAddressController;