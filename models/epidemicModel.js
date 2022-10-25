const { mongoose, mongooseConn } = require('../engines/eng_mongodb');
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId;
const CollectionName = 'epidemic';

const epidemicSchema = new Schema({

    reportId: { type : ObjectId, ref : 'report'},
    patient: [{
        name: {type : String, required: true},
        surname: { type : String, required:true},
        symptom: { type : String, required: true}

    }]

},
{ collection: CollectionName, timestamps: true})

epidemicSchema.index({ reportId: 1});
const epidemicModel = mongooseConn.model(CollectionName, epidemicSchema)
module.exports = epidemicModel