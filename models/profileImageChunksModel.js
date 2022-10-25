const { mongoose, mongooseConn } = require('../engines/eng_mongodb');
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId;
const CollectionName = 'profile_images.chunks';

const profileImageChunksSchema = new Schema({

    files_id: {type: ObjectId, ref : 'profile_images.files'},
    n: {type: Number,required:true},
    data: {type:Buffer,required:true}


},
{ collection: CollectionName})

profileImageChunksSchema.index({files_id: 1, n: 1},{unique: true});

const reportModel = mongooseConn.model(CollectionName, profileImageChunksSchema)
module.exports = reportModel