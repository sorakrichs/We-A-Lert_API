const organizeAuthorizationController = async (data) => {

    const ControllerName = 'memberAuthorizationController';
    const {userModel,volunteerModel,organizationModel,ObjectId} = require('../../mongodbController');
    const SECRET = require("../../../configs/cfg_key").JWT_SECRET;
    const jwt = require("jwt-simple");
    const {encryptPassword} = require("../../miscController")
    
    if (typeof data != 'object') { throw new Error(`${ControllerName}: <data> must be Object`);}
    else if (typeof data.id != 'string') { throw new Error(`${ControllerName}: <data.usernameorphone> must be String`);}
    else if (typeof data.password != 'string') { throw new Error(`${ControllerName}: <data.password> must be String`);}
    else {
        
        let en_password = encryptPassword(data.password.toString());

        const find_user = await userModel.findOne({
            _id : ObjectId(data.id),
            $or : [{username : data.usernameorphone}, {phone : data.usernameorphone}],
            password : en_password
        }).then((r) => r).catch((err) => { throw err;});
        
        
        if(find_user)
        {

            const find_volunteer =  await volunteerModel.findOne({
                userId : ObjectId(data.id)
            })
            
            if(find_volunteer.teamrole == 'leader') {

                return await organizationModel.aggregate([
                    {
                      '$match': {
                        '_id': find_volunteer.organization_id
                      }
                    }, {
                      '$lookup': {
                        'from': 'volunteer', 
                        'localField': '_id', 
                        'foreignField': 'organization_id', 
                        'as': 'volunteers'
                      }
                    }, {
                      '$unwind': {
                        'path': '$volunteers'
                      }
                    }, {
                      '$lookup': {
                        'from': 'user', 
                        'localField': 'volunteers.userId', 
                        'foreignField': '_id', 
                        'as': 'volunteers.data'
                      }
                    }, {
                      '$unwind': {
                        'path': '$volunteers.data'
                      }
                    }, {
                      '$project': {
                        '_id': 1, 
                        'name': 1, 
                        'branchname': 1, 
                        'phone': 1, 
                        'email': 1, 
                        'description': 1, 
                        'address': 1, 
                        'volunteers': {
                          '_id': '$volunteers.data._id', 
                          'username': '$volunteers.data.username', 
                          'name': '$volunteers.data.name', 
                          'surname': '$volunteers.data.surname', 
                          'role': '$volunteers.data.role', 
                          'teamrole': '$volunteers.teamrole', 
                          'email': '$volunteers.data.email', 
                          'personalid': '$volunteers.data.personalid', 
                          'phone': '$volunteers.data.phone',
                          'image_id':'$volunteers.data.image_id'
                        }
                      }
                    }, {
                      '$group': {
                        '_id': '$_id', 
                        'name': {
                          '$first': '$name'
                        }, 
                        'branchname': {
                          '$first': '$branchname'
                        }, 
                        'phone': {
                          '$first': '$phone'
                        }, 
                        'email': {
                          '$first': '$email'
                        }, 
                        'description': {
                          '$first': '$description'
                        }, 
                        'address': {
                          '$first': '$address'
                        }, 
                        'volunteers': {
                          '$push': '$volunteers'
                        }
                      }
                    }
                  ]).catch(err=>{throw err})

            } else {

                throw new Error ("login_error_03")
    
            }

        } else {

          throw new Error ("login_error_02")

        }

            
        
    }


}

module.exports = organizeAuthorizationController;