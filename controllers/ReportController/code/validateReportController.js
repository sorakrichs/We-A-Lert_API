
const validateReportController = async (data,files = null) => {

    const ControllerName = 'validateReportController';
    const {reportModel,ObjectId} = require('../../mongodbController')
    const typeReport = require('./typeReportController')

    if (typeof data != 'object') { throw new Error(`${ControllerName}: <data> must be Object`);}
    else {

        let imageIds = (files) ? await Promise.all(files.map(( id ) => ObjectId(id))) : null;
        let {id} = JSON.parse(data.user);

        await reportModel.updateOne(
            { _id :  ObjectId(data.report_id) },
            { $set: { 
                type: data.type,
                status: 'inprocess',
                description: data.description,
                volunteerId: id,
            }
        
        }).catch((err) => {throw err})
        
        await typeReport(data.report_id,data.type,data.subtype,data.reportdata).catch((err) => {throw err})

        return await reportModel.updateOne(
            { _id :  ObjectId(data.report_id) },
            { $push: { attachment: { $each: imageIds } } }
        ).catch((err) => {throw err})
        
        

    }


}

module.exports = validateReportController;