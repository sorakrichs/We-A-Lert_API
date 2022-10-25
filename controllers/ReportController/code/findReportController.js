const findReportController = async (id) => {

    
    const ControllerName = 'findReportController';
    const {reportModel, ObjectId} = require('../../mongodbController')


    if (typeof id != 'string') { throw new Error(`${ControllerName}: <id> must be String`);}
    else {


        return await reportModel.findById(ObjectId(id)).then(r =>r)
        .catch((err) => {throw err});



    }

}

module.exports = findReportController;