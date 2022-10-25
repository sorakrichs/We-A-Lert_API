const { mongoose, mongooseConn } = require('../engines/eng_mongodb');
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId;
const CollectionName = 'user';



const userSchema = new Schema({
  username: { type: String , required: true },
  password: { type: String , required: true },
  name: { type: String , required: true },
  surname: { type: String , required: true },
  role: { type: String , enum: ['member','volunteer','admin'], required: true },
  email: { type: String, default : null},
  personalid : { type: String , required: true },
  phone: { type: String , required: true },
  image_id: { type: Object, default:null, ref:'profile_images.files'},
  status: { type: String, enum: ['banned','approved'], default: 'approved' }
},
{ collection: CollectionName })


const userModel = mongooseConn.model(CollectionName, userSchema)
module.exports = userModel

