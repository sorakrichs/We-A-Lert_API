const { mongoose, mongooseConn } = require('../engines/eng_mongodb');
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId;
const CollectionName = 'organization';

const organizationSchema = new Schema({
    name: { type: String, required : true},
    branchname: {type: String, default: null},
    phone: {type: [String], required: true},
    email: {type: String, default: null},
    description: {type: String, default: null},
    address: {
        type: {
            location : {
                type: { type: String, enum: ['Point'], required: true },
                coordinates: { type: [Number], required : true},
            },
            aoi: {type : String, default : null},
            description: { type: String, default : null},
            subdistrict: { type: String, required: true},
            district: { type: String, required: true},
            province: { type: String, required: true},
            postcode: { type: String, required: true},
        },
        required: true
    }
},
{ collection: CollectionName })

const volunteerModel = mongooseConn.model(CollectionName, organizationSchema)
module.exports = volunteerModel