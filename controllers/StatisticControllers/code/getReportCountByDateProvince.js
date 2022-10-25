const getReportCountByDateProvince = async (id) => {

    const ControllerName = 'getReportCountByDate';
    const {userAddressModel,ObjectId} = require('../../mongodbController')
    try {

            

            const data = await userAddressModel.aggregate(
              [
                {
                  '$match': {
                    'userId': ObjectId(id)
                  }
                }, {
                  '$lookup': {
                    'from': 'report', 
                    'localField': 'province', 
                    'foreignField': 'province', 
                    'as': 'Report'
                  }
                }, {
                  '$unwind': {
                    'path': '$Report', 
                    'preserveNullAndEmptyArrays': true
                  }
                },{
                  '$group': {
                    '_id': {
                      '$dateToString': {
                        'format': '%Y-%m-%d', 
                        'date': '$Report.createdAt'
                      }
                    }, 
                    'province': {
                      '$first': '$province'
                    }, 
                    'car': {
                      '$sum': {
                        '$cond': [
                          {
                            '$eq': [
                              '$Report.type', 'car'
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
                              '$Report.type', 'fire'
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
                              '$Report.type', 'flood'
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
                              '$Report.type', 'earthquake'
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
                              '$Report.type', 'epidemic'
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

            console.log(data);
            return data;
            
        
    } catch (err) {
        throw err;
    }


}

module.exports = getReportCountByDateProvince;