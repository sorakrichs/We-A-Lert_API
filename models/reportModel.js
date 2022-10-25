const { mongoose, mongooseConn } = require('../engines/eng_mongodb');
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId;
const CollectionName = 'report';

const reportSchema = new Schema({

    userId: { type : ObjectId, ref : 'user'},
    description: {type : String, default : null},
    location: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: { type: [Number], required: true }
    },
    aoi: {type : String, default : null},
    subdistrict: { type: String, required: true},
    district: { type: String, required: true},
    province: { type: String, required: true},
    postcode: { type: String, required: true},
    type: {type: String, enum: ['car','fire','epidemic','flood','earthquake','non-type'], default:'non-type'},
    status: {type: String, enum: ['inprocess','finish','cancel','non-validated'], default:'non-validated'},
    attachment : [{type : ObjectId, default : null, ref : 'report_images.files'}],
    volunteerId: { type : ObjectId, default : null , ref : 'volunteer'},

},
{ collection: CollectionName, timestamps: true})

reportSchema.index({createdAt: 1},{expireAfterSeconds: 86400, partialFilterExpression : {status: 'non-validated'}})
reportSchema.index({ status: 1});
reportSchema.index({ location : "2dsphere" });

const reportModel = mongooseConn.model(CollectionName, reportSchema)
module.exports = reportModel