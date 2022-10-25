const { mongoose, mongooseConn } = require('../engines/eng_mongodb');
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId;
const CollectionName = 'car_accident';

const carSchema = new Schema({

    reportId: { type : ObjectId, ref : 'report'},
    type: { type : String, required:true},
    litigant: [{
        license: {type : String, required:true},
        make: { type : String, required:true},
        model: { type : String, required: true},
        category: [{type : String, required: true}]
    }]

},
{ collection: CollectionName, timestamps: true})

carSchema.index({reportId: 1});
const carAccidentModel = mongooseConn.model(CollectionName, carSchema)
module.exports = carAccidentModel