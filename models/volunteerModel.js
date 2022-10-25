const { mongoose, mongooseConn } = require('../engines/eng_mongodb');
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId;
const CollectionName = 'volunteer';

const volunteerSchema = new Schema({
  userId: { type : ObjectId, ref : 'user'},
  teamrole: { type: String, enum: ['leader','deputy','staff'] },
  organization_id: {type: ObjectId , required : true}
},
{ collection: CollectionName })

const volunteerModel = mongooseConn.model(CollectionName, volunteerSchema)
module.exports = volunteerModel