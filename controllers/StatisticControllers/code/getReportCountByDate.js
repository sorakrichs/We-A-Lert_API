const getReportCountByDate = async () => {

    const ControllerName = 'getReportCountByDate';
    const {reportModel} = require('../../mongodbController')
    try {

            

            const data = await reportModel.aggregate(
              [
                {
                  '$group': {
                    '_id': {
                      '$dateToString': {
                        'format': '%Y-%m-%d', 
                        'date': '$createdAt'
                      }
                    }, 
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
                }, {
                  '$limit': 30
                }, {
                  '$sort': {
                    '_id': 1
                  }
                }
              ])
            return data;
            
        
    } catch (err) {
        throw err;
    }


}

module.exports = getReportCountByDate;