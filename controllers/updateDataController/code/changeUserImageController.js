

const changeUserImageController = async (id,newimage_id) => {
    
    const ControllerName = 'changeUserImageController ';
    const {userModel,ObjectId,profileImageFilesModel, profileImageChunksModel} = require('../../mongodbController')
    
    if (typeof newimage_id != 'object') { throw new Error(`${ControllerName}: <newimage_id> must be ObjectId`);}
    else {

        const find_user = await userModel.findOne({
            _id: ObjectId(id)
        }).then((r) => r).catch((err) => { throw err;});

        if(!find_user)
            throw new Error(`You are not user`);

        await Promise.all([

            profileImageFilesModel.deleteOne({ _id : find_user.image_id}),
            profileImageChunksModel.deleteMany({ files_id : find_user.image_id})


        ]).then(r=>r).catch((err) =>  { throw err; })

        return await userModel.updateOne(
            { _id : ObjectId(id) },
            { $set: { 
                    image_id: newimage_id
                }   
            }
        ).catch(err => {throw err})

    }
}

module.exports = changeUserImageController;