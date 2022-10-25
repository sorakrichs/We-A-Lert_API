const { mongoose, mongooseConn } = require('../engines/eng_mongodb');
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId;
const CollectionName = 'report_images.chunks';

const reportImageChunksSchema = new Schema({

    files_id: {type: ObjectId, ref : 'report_images.files'},
    n: {type: Number,required:true},
    data: {type:Buffer,required:true}


},
{ collection: CollectionName})

reportImageChunksSchema.index({files_id: 1, n: 1},{unique: true});

const reportModel = mongooseConn.model(CollectionName, reportImageChunksSchema)
module.exports = reportModel