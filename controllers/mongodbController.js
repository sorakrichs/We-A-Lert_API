
//Mongoose
const mongoose = require('../engines/eng_mongodb').mongoose;
const GridFSBucket = mongoose.mongo.GridFSBucket;


//Model
const userModel = require('../models/userModel');
const userAddressModel = require('../models/userAddressModel');
const volunteerModel = require('../models/volunteerModel');
const reportModel = require('../models/reportModel');
const organizationModel = require('../models/organizationModel');
const carAccidentModel = require('../models/carAccidentModel');
const fireModel = require('../models/fireModel');
const floodModel = require('../models/floodModel');
const earthquakeModel = require('../models/earthquakeModel');
const epidemicModel = require('../models/epidemicModel');
const profileImageFilesModel = require("../models/profileImageFilesModel");
const profileImageChunksModel = require("../models/profileImageChunksModel");
const reportImageFilesModel = require("../models/reportImageFilesModel");
const reportImageChunksModel = require("../models/reportImageChunksModel");

module.exports = {

    mongoose,
    GridFSBucket,
    ObjectId: mongoose.Types.ObjectId,
    userModel,
    userAddressModel,
    volunteerModel,
    reportModel,
    organizationModel,
    carAccidentModel,
    fireModel,
    floodModel,
    earthquakeModel,
    epidemicModel,
    profileImageFilesModel,
    profileImageChunksModel,
    reportImageFilesModel,
    reportImageChunksModel

}