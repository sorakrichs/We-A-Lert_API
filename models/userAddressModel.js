const { mongoose, mongooseConn } = require('../engines/eng_mongodb');
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId;
const CollectionName = 'userAddress';



const userAddressSchema = new Schema({
    userId: { type : ObjectId, ref : 'user'},
    name: { type: String, required: null},
    location : {
        type: { type: String, enum: ['Point'], required: true },
        coordinates: { type: [Number], required : true},
    },
    aoi: {type : String, default : null},
    description: { type: String, default : null},
    subdistrict: { type: String, required: true},
    district: { type: String, required: true},
    province: { type: String, required: true},
    postcode: { type: String, required: true}
},
{ collection: CollectionName })

userAddressSchema.index({  userId : 1 });
userAddressSchema.index({  location : "2dsphere" });

const userAddressModel = mongooseConn.model(CollectionName, userAddressSchema)
module.exports = userAddressModel
