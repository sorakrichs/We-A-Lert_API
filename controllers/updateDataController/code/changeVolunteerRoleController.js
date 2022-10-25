const changeVolunteerRoleController = async (id,data) => {
    
    const ControllerName = 'changeVolunteerRoleController';
    const {volunteerModel,ObjectId} = require('../../mongodbController')
    try {
        if (typeof id != 'string') { throw new Error(`${ControllerName}: <id> must be string`);}
        else {


            let result = await volunteerModel.updateOne(
                { userId :  ObjectId(id) },
                { $set: { 
                        teamrole: data.role
                    }   
                }
            )

            return result;

            
        }
    } catch(err) {
        throw err
    }
}

module.exports = changeVolunteerRoleController;