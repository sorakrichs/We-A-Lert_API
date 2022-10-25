const getDisasterCountController = async () => {

    const ControllerName = 'memberAuthorizationController';
    const {reportModel} = require('../../mongodbController')
    const {getImageFormId} = require('../../FileController')
    try {

            

            const data = await reportModel.aggregate(
                [
                    {
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
                                  '$type', 'eathquake'
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
                ])
             
            

            return {car: data[0].car, fire: data[0].fire,flood: data[0].flood, earthquake: data[0].earthquake,epidemic: data[0].epidemic};
            
        
    } catch (err) {
        throw err;
    }


}

module.exports = getDisasterCountController;