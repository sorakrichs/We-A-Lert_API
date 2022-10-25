const changeVolunteerReportController = async (id,data) => {
    
    const ControllerName = 'changeVolunteerReportController';
    const {reportModel,ObjectId} = require('../../mongodbController')
    try {
        if (typeof id != 'string') { throw new Error(`${ControllerName}: <id> must be string`);}
        else {

            let result = await reportModel.updateOne(
                { _id :  ObjectId(id) },
                { $set: { 
                        volunteerId: ObjectId(data.id)
                    }   
                }
            )

            return result;

            
        }
    } catch(err) {
        throw err
    }
}

module.exports = changeVolunteerReportController;