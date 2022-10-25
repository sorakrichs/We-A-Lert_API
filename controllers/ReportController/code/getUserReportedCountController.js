


const getUserReportedCountController = async (id) => {

    const ControllerName = 'getUserReportedCountController';
    const {ObjectId,reportModel} = require('../../mongodbController')

    try {

        return await reportModel.aggregate([
            {
              '$group': {
                '_id': null, 
                'report_count': {
                  '$sum': {
                    '$cond': [
                      {
                        '$eq': [
                          '$userId', ObjectId(id)
                        ]
                      }, 1, 0
                    ]
                  }
                }, 
                'validate_count': {
                  '$sum': {
                    '$cond': [
                      {
                        '$eq': [
                          '$volunteerId', ObjectId(id)
                        ]
                      }, 1, 0
                    ]
                  }
                }
              }
            }
        ]).then(r => r[0])


        
       
        
    
    } catch (err) {
        throw err
    }
}

module.exports = getUserReportedCountController ;