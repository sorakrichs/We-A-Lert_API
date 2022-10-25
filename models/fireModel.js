const { mongoose, mongooseConn } = require('../engines/eng_mongodb');
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId;
const CollectionName = 'fire';

const fireSchema = new Schema({

    reportId: { type : ObjectId, ref : 'report'},
    type: { type : String, required: true},
    range: {type: Number, required: true}

},
{ collection: CollectionName, timestamps: true})

fireSchema.index({ reportId: 1});
const fireModel = mongooseConn.model(CollectionName, fireSchema)
module.exports = fireModel