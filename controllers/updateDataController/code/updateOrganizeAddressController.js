const updateOrganizeAddressController = async (id,address) => {
    
    const ControllerName = 'updateOrganizeAddressController';
    const {organizationModel,ObjectId} = require('../../mongodbController')

    if (typeof id != 'string') { throw new Error(`${ControllerName}: <id> must be String`);}
    else if (typeof address != 'object') { throw new Error(`${ControllerName}: <address> must be Object`);}
    else {

        return await organizationModel.updateOne(
            { _id :  ObjectId(id) },
            { $set: { 
                    address: address,
                }   
            }
        ).catch(err => {throw err})

    }
}

module.exports = updateOrganizeAddressController;