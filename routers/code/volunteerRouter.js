const express = require('express') 
const router = express.Router();
const {organizationRegister,volunteerRegister} = require('../../controllers/RegisterController')
const {volunteerAuthorization,organizeAuthorization} = require('../../controllers/AuthorizationController')
const {uploadProfileImage,uploadManyProfileImage,getImageFormId} = require('../../controllers/FileController')
const {editVolunteerData,updateOrganizeAddress,editOrganizeData,updateOrganizePhone} = require('../../controllers/updateDataController')
const {getVolunteerData,getVolunteerList,getOrganizationList,getOrganizationData} = require('../../controllers/getDataController')
const jwtAuthMiddleware = require('../../middleware/jwtAuthMiddleware')
const {checkUserExist,loginLimiter} = require('../../controllers/miscController')
const {AuthorizationLog} = require('../../controllers/LogControllers')
const multer  = require('multer')

router.get('/', jwtAuthMiddleware, async (req,res) => {

  try {
    
    let data = await getVolunteerList();
    res.status(200).json(data).end();

  } catch (err) {

    res.status(400).json({message : err.message}).end();

  }
 



});

router.get('/data/:id', jwtAuthMiddleware, async (req,res) => {

  try {
    
    let data = await getVolunteerData(req.params.id);
    res.status(200).json(data).end();

  } catch (err) {

    res.status(400).json({message : err.message}).end();

  }
 



});

router.post('/register',multer().any('picture'), async (req,res) => {

    try {

      const members = JSON.parse(req.body.members);
      const exist = false;
      await Promise.all(
        members.map(async (member) => {

          let exist = await checkUserExist(member);
          if(exist)
            throw new Error(`regis_error_01`); 

        })
      )


      const organization = JSON.parse(req.body.organization);
      const organization_id = await organizationRegister(organization);

      const id = await uploadManyProfileImage(req,req.files)
      await Promise.all(
        members.map(async (member) => {

          const index = id.map((o) => o[0]).indexOf(member.uuid)
          member.image = (index >= 0) ? id[index][1] : null;

          member.organization_id = organization_id;
          await volunteerRegister(member); 

        })
      )

      res.status(200).json({message : "success"}).end();

    } catch (err) {
      res.status(400).json({message : err.message}).end()
    } 
});

router.get('/organization', jwtAuthMiddleware, async (req,res) => {

  try {

    let data = await getOrganizationList();
    res.status(200).json(data).end();

  } catch (err) {
    res.status(400).json({message : err.message}).end()
  } 
});

router.get('/organization/:id', jwtAuthMiddleware, async (req,res) => {

  try {

   
    let data = await getOrganizationData(req.params.id);
    res.status(200).json(data).end();

  } catch (err) {
    res.status(400).json({message : err.message}).end()
  } 
});

router.post('/login',loginLimiter, async (req,res) => {

  await volunteerAuthorization(req.body)
  .then(async (result) => {
    
    const ip = req.clientIp;
    await AuthorizationLog(result.id,'volunteer','login',ip);
    res.status(200).send(result.token).end();
  
  })
  .catch((err) => {res.status(400).json({message : err.message}).end()})

});

router.post('/addStaff/:id',jwtAuthMiddleware,multer().any('picture'), async (req,res) => {

    try {
      
      const member = JSON.parse(req.body.member);
      let file_id = await uploadProfileImage(req,req.files[0]);
      member.image = file_id;
      member.organization_id = req.params.id;
      await volunteerRegister(member); 
      res.status(200).json({message:"success"}).end();
  
    } catch (err) {
  
      res.status(400).json({message : err.message}).end();
  
    }
   
  
  
  
});

router.post('/getOrganize', async (req,res) => {

  try {

      const data = await organizeAuthorization(req.body);
      const volunteers = [];
      await Promise.all( data[0].volunteers.map( async (volunteer) => {
        let volunteerData = volunteer;
        volunteerData.image = await getImageFormId(volunteer.image_id);
        delete volunteerData.image_id;
        volunteers.push(volunteerData)
    
      }))

      delete data[0].volunteers;
      res.status(200).json({
        organization : data[0],
        volunteers : volunteers
      }).end();


    } catch (err) {

      res.status(400).json({message : err.message}).end();

    }
  }
)

router.post('/edit/:id', async (req,res) => {
  
  await editVolunteerData(req.params.id,req.body)
  .then((data) => {res.status(200).send(data).end();})
  .catch((err) => {res.status(400).json({message : err.message}).end()})
  
});

router.post('/editOrganize/:id', jwtAuthMiddleware, async (req,res) => {
  
  try {

    await editOrganizeData(req.params.id,req.body)
    res.status(200).json({message:"success"}).end();

  } catch (err) {
  
    res.status(400).json({message : err.message}).end();
  
  }
  

});

router.post('/updateAddress/:id', jwtAuthMiddleware, async (req,res) => {
  
  try {
    
    if(req.user.role === 'admin' || req.user.role === 'volunteer') {

      await updateOrganizeAddress(req.params.id,req.body)
      res.status(200).json({message:"success"}).end();  

    } else {
      res.status(403).json({message : `permission_error_1`}).end();
    }

  } catch (err) {
  
    res.status(400).json({message : err.message}).end();
  
  }
  

});

router.post('/updatePhone/:id', jwtAuthMiddleware, async (req,res) => {
  
  try {
    
    await updateOrganizePhone(req.params.id,req.body)
    res.status(200).json({message:"success"}).end();

  } catch (err) {
  
    res.status(400).json({message : err.message}).end();
  
  }
  

});

module.exports = router;