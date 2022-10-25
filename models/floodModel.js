const { mongoose, mongooseConn } = require('../engines/eng_mongodb');
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId;
const CollectionName = 'flood';

const floodSchema = new Schema({

    reportId: { type : ObjectId, ref : 'report'},
    depth: {type: Number, required: true}

},
{ collection: CollectionName, timestamps: true})

floodSchema.index({ reportId: 1});
const floodModel = mongooseConn.model(CollectionName, floodSchema)
module.exports = floodModel