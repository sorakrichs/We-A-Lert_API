const getUserDataController = async (id='') => {

    const ControllerName = 'getUserDataController';
    const {userModel,ObjectId,userAddressModel} = require('../../mongodbController')
    const {getImageFormId} = require('../../FileController')
    try {
        if (typeof id != 'string') { throw new Error(`${ControllerName}: <id> must be String`);}
        else {
            
            
            const data = await Promise.all([
                    userModel.findOne({
                    _id: ObjectId(id)
                    }),
                    userAddressModel.find({
                    userId: ObjectId(id)
                })
            ])

            if(data[0].image_id) {
                data[2] = await getImageFormId(data[0].image_id);
                data[0].image_id = undefined;
            }

            data[0].password = undefined;
            data[0].image_id = undefined;


            return {member: data[0], address: data[1], image: data[2]};
            
        }
    } catch (err) {
        throw err;
    }


}

module.exports = getUserDataController;