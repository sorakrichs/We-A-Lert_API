const getReportCountByTypeUser = async (id) => {

    const ControllerName = 'getUserReportedCountController';
    const {ObjectId,reportModel} = require('../../mongodbController')

    try {

      console.log(id)
        let data = await reportModel.aggregate([
            {
              '$match': {
                'userId': ObjectId(id), 
                'status': {
                  '$ne': 'non-validated'
                }
              }
            }, {
              '$group': {
                '_id': null, 
                'car': {
                  '$sum': {
                    '$cond': [
                      {
                        '$eq': [
                          '$type', 'car'
                        ]
                      }, 1, 0
                    ]
                  }
                }, 
                'fire': {
                  '$sum': {
                    '$cond': [
                      {
                        '$eq': [
                          '$type', 'fire'
                        ]
                      }, 1, 0
                    ]
                  }
                }, 
                'flood': {
                  '$sum': {
                    '$cond': [
                      {
                        '$eq': [
                          '$type', 'flood'
                        ]
                      }, 1, 0
                    ]
                  }
                }, 
                'earthquake': {
                  '$sum': {
                    '$cond': [
                      {
                        '$eq': [
                          '$type', 'earthquake'
                        ]
                      }, 1, 0
                    ]
                  }
                }, 
                'epidemic': {
                  '$sum': {
                    '$cond': [
                      {
                        '$eq': [
                          '$type', 'epidemic'
                        ]
                      }, 1, 0
                    ]
                  }
                }
              }
            }
          ]).then(r => r[0])
        return data
       
        
    
    } catch (err) {
        throw err
    }
}

module.exports = getReportCountByTypeUser ;