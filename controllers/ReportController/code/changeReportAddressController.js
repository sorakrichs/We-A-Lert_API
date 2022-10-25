const changeReportAddressController = async (id,address) => {
    
    const ControllerName = 'updateOrganizeAddressController';
    const {reportModel,ObjectId} = require('../../mongodbController')

    if (typeof id != 'string') { throw new Error(`${ControllerName}: <id> must be String`);}
    else if (typeof address != 'object') { throw new Error(`${ControllerName}: <address> must be Object`);}
    else {

        return await reportModel.updateOne(
            { _id :  ObjectId(id) },
            { $set: { 
                location: address.location,
                aoi: address.aoi,
                subdistrict: address.subdistrict,
                district: address.district,
                province: address.province,
                postcode: address.postcode,
            }   
            }
        ).catch(err => {throw err})

    }
}

module.exports = changeReportAddressController;