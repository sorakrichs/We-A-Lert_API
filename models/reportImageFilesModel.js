const { mongoose, mongooseConn } = require('../engines/eng_mongodb');
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId;
const CollectionName = 'report_images.files';

const reportImageFilesSchema = new Schema({

    length: {type: String,required:true},
    chunkSize: {type: Number,required:true},
    uploadDate: {type: Date, required: true},
    filename: {type: String, required: true},
    contentType: {type: String, required: true},

},
{ collection: CollectionName})

reportImageFilesSchema.index({filename: 1, uploadDate: 1});

const reportImageFilesModel = mongooseConn.model(CollectionName, reportImageFilesSchema)
module.exports = reportImageFilesModel