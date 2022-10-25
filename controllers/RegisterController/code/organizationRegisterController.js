



const organizationRegisterController = async (data) => {

    const ControllerName = 'organizationRegisterController';
    const {userModel,organizationModel} = require('../../mongodbController')

    if (typeof data != 'object') { throw new Error(`${ControllerName}: <data> must be Object`);}
    if (typeof data.name != 'string') { throw new Error(`${ControllerName}: <data.name> must be String`);}
    else {
        
        let name_exist = await organizationModel.findOne({name : data.name}).then((r) => r).catch((err) => { throw err;});
        if(name_exist)
            throw new Error('regis_error_02')

            const new_organization = new organizationModel({

                name: data.name,
                branchname: data.branchname,
                phone: data.phone,
                description: data.description,
                address: {
                    location : {
                        type: 'Point',
                        coordinates: [data.address.location.lon,data.address.location.lat],
                    },
                    aoi: data.address.aoi,
                    subdistrict: data.address.subdistrict,
                    district: data.address.district,
                    province: data.address.province,
                    postcode: data.address.postcode
                }
                
            });
        
        let result = await new_organization.save().then(r => r).catch((err) => { throw err ;});

        return result._id;
        
    }


}

module.exports = organizationRegisterController;