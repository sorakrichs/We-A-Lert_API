const addressRegisterController = async (data) => {

    const ControllerName = 'addressRegisterController';
    const {userAddressModel} = require('../../mongodbController')
    const {encryptPassword}  = require('../../miscController')

    if (!Array.isArray(data)) { throw new Error(`${ControllerName}: <data> must be Array`);}
    else {
        
        try {

            await Promise.all(
                data.map(async (address) => {
                    address.userId = data.userId;
                    let new_address = new userAddressModel(address);
                    await new_address.save().catch((e)=> {throw e});

                })
            );
            

            return;

        } catch (err) {
            throw err;
        }
        
    }


}

module.exports = addressRegisterController;