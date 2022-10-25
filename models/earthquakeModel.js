const { mongoose, mongooseConn } = require('../engines/eng_mongodb');
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId;
const CollectionName = 'earthquake';

const earthquakeSchema = new Schema({

    reportId: { type : ObjectId, ref : 'report'},
    tsunami: {type: Boolean, required: true},
    magnitude: {type: Number, required: true}

},
{ collection: CollectionName, timestamps: true})

earthquakeSchema.index({reportId: 1});
const earthquakeModel = mongooseConn.model(CollectionName, earthquakeSchema)
module.exports = earthquakeModel