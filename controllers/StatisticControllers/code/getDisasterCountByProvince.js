const getDisasterCountByProvince = async () => {

    const ControllerName = 'memberAuthorizationController';
    const {reportModel} = require('../../mongodbController')
    const {getImageFormId} = require('../../FileController')
    try {

            

            const data = await reportModel.aggregate(
                [
                    {
                      '$group': {
                        '_id': '$province', 
                        'counts': {
                          '$sum': 1
                        }
                      }
                    }, {
                      '$sort': {
                        'counts': -1
                      }
                    }, {
                      '$limit': 5
                    }, {
                      '$group': {
                        '_id': null, 
                        'counts': {
                          '$push': {
                            'province': '$_id', 
                            'count': '$counts'
                          }
                        }
                      }
                    }
                ])
             

            return data[0].counts;
            
        
    } catch (err) {
        throw err;
    }


}

module.exports = getDisasterCountByProvince;