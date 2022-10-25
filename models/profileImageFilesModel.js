const { mongoose, mongooseConn } = require('../engines/eng_mongodb');
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId;
const CollectionName = 'profile_images.files';

const profileImageFilesSchema = new Schema({

    length: {type: String,required:true},
    chunkSize: {type: Number,required:true},
    uploadDate: {type: Date, required: true},
    filename: {type: String, required: true},
    contentType: {type: String, required: true},

},
{ collection: CollectionName})

profileImageFilesSchema.index({filename: 1, uploadDate: 1});

const reportModel = mongooseConn.model(CollectionName, profileImageFilesSchema)
module.exports = reportModel