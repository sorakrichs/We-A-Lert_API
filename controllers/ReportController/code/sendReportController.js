
const sendReportController = async (data,files = null) => {

    const ControllerName = 'sendReportController';
    const {reportModel,ObjectId} = require('../../mongodbController')


    if (typeof data != 'object') { throw new Error(`${ControllerName}: <data> must be Object`);}
    else {

        let imageIds = (files) ? await Promise.all(files.map(( id ) => ObjectId(id))) : null;
        let {id} = JSON.parse(data.user);
        let address = JSON.parse(data.address);
        const new_report = new reportModel({

            userId: id,
            description: data.description,
            location: {
                type: 'Point',
                coordinates: [address.location.lon,address.location.lat],
            },
            aoi: address.aoi,
            subdistrict: address.subdistrict,
            district: address.district,
            province: address.province,
            postcode: address.postcode,
            attachment : imageIds

        });
        
        return await new_report.save().then(r => r).catch(err => { console.error(err); return;  });

    }


}

module.exports = sendReportController;