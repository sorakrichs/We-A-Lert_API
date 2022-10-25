
const express = require('express') 
const router = express.Router() 
const {memberRegister,addressRegister} = require('../../controllers/RegisterController')
const {memberAuthorization} = require('../../controllers/AuthorizationController')
const {getMemberLocation} = require('../../controllers/MapController')
const {uploadProfileImage} = require('../../controllers/FileController')
const {getImageFormId} = require('../../controllers/FileController')
const {getUserData,getUserList,getMemberList} = require('../../controllers/getDataController')
const {editUserData,changeUserPassword,changeUserImage,updateAddress,updateUserStatus} = require('../../controllers/updateDataController')
const {updateVolunteer,findReport} = require('../../controllers/ReportController');
const {checkUserExist,checkPhone,checkOldPassword,loginLimiter} = require('../../controllers/miscController')
const {AuthorizationLog} = require('../../controllers/LogControllers')
const multer  = require('multer')
const jwtAuthMiddleware = require('../../middleware/jwtAuthMiddleware')
const user = require('../../controllers/userController')
const queue = require('../../controllers/queueController')

router.get('/all', jwtAuthMiddleware, async (req,res) => {

  try {
    
    if( req.user.role != 'admin')
      return res.status(403).json({message : `Permission denied`}).end();

    let data = await getUserList();
    return res.status(200).json(data).end();

  } catch (err) {

    return res.status(400).json({message : err.message}).end();

  }
 



});

router.get('/list', jwtAuthMiddleware, async (req,res) => {

  try {
    
    let data = await getMemberList();
    res.status(200).json(data);

  } catch (err) {

    res.status(400).json({message : err.message}).end();

  }
 



});

router.post('/register',multer().any('user'), async (req,res) => {

    try {

      let data = JSON.parse(req.body.user);
      let exist = await checkUserExist(data)
      if(exist) { 
        
        res.status(400).json({message : `regis_error_01`}).end(); 

      } else {

        if(req.files[0]) {
          let file_id = await uploadProfileImage(req,req.files[0]);
          data.image_id = file_id;
        }


        if(data.address){ 
          data.address.userId = await memberRegister(data);
          await addressRegister(data.address);
    
        } else {
    
          await memberRegister(data); 
    
        }
        
        res.status(200).json({message:"success"}).end();
      } 
  
    } catch (err) {
  
      res.status(400).json({message : err.message}).end();
  
    }
   
  
  
  
});
  
router.get('/address/:id', async (req,res) => {
  
  
    await getMemberLocation(req.params.id)
      .then((result) => {res.status(200).json(result).end()})
      .catch((err) => {res.status(400).json({message : err.message}).end()}); 
  
  
  
});

router.post('/address/:id', async (req,res) => {
  
  try {
    
    await updateAddress(req.params.id,req.body)
    res.status(200).json({message:"success"}).end();

  } catch (err) {
  
    res.status(400).json({message : err.message}).end();
  
  }
  

});

router.get('/phone/:phone', async (req,res) => {
  
  try {
    
    let token = await checkPhone(req.params.phone)
    res.status(200).send(token).end();

  } catch (err) {
  
    res.status(400).json({message : err.message}).end();
  
  }
  

});
  
router.post('/login',loginLimiter, async (req,res) => {
  
    await memberAuthorization(req.body)
    .then(async (result) => {
    
      const ip = req.clientIp;
      await AuthorizationLog(result.id,'member','login',ip);
      res.status(200).send(result.token).end();
    
    })
    .catch((err) => {res.status(400).json({message : err.message}).end()})
  
    
});

router.post('/logout/:id', async (req,res) => {
  
  try {

    await user.removeToken(req.params.id)
    .then(async () => {
        var ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress 
        await AuthorizationLog(req.params.id,req.body.role,'logout',ip);
        res.status(200).json({message : 'success'}).end();
      
      })
  } catch (err) {
    res.status(400).json({message : err.message}).end()
  }

  
});

router.get('/profile/:id', jwtAuthMiddleware, async (req,res) => {
  
  if(req.user._id.toString() != req.params.id)
    return res.status(403).json({message : `permission_error_1`}).end();

  await getUserData(req.params.id)
  .then((data) => {res.status(200).send(data).end();})
  .catch((err) => {res.status(400).json({message : err.message}).end()})
  
});

router.post('/edit/:id', jwtAuthMiddleware, async (req,res) => {
  if(req.user.role == 'admin' || req.user._id.toString() === req.params.id) {
    await editUserData(req.params.id,req.body)
    .then((data) => {res.status(200).send(data).end();})
    .catch((err) => {res.status(400).json({message : err.message}).end()})

  } else {
    return res.status(403).json({message : `Permission denied`}).end();

  }
});

router.post('/changepass/:id',jwtAuthMiddleware, async (req,res) => {

  try {
    
    if(await checkOldPassword(req.params.id,req.body.oldpassword)) {
      await changeUserPassword(req.params.id,req.body.password)
      .then((data) => {res.status(200).send(data).end();})
    }
  } catch(err) {
    res.status(400).json({message : err.message}).end()
  }
  
});

router.post('/forgotpass/:id',jwtAuthMiddleware, async (req,res) => {

  await changeUserPassword(req.params.id,req.body.password)
  .then((data) => {res.status(200).send(data).end();})
  .catch((err) => {res.status(400).json({message : err.message}).end()})
 
  
});



router.post('/updateImage/:id',multer().any('profile'), async (req,res) => {
  
  try {

    let file_id = await uploadProfileImage(req,req.files[0]);
    await changeUserImage(req.params.id,file_id);
    res.status(200).json({message:"success"}).end();

  } catch (err) {
  
    res.status(400).json({message : err.message}).end();
  
  }
  

});

router.get('/image/:id', async (req,res) => {
  
  try {

    let image = await getImageFormId(req.params.id);
    res.status(200).send(image).end();

  } catch (err) {
  
    res.status(400).json({message : err.message}).end();
  
  }
  

});

router.post('/notify/:id',async (req,res) => {
  
  try {

    let token = await user.getToken(req.params.id)
    const data = req.body;
    if(data.type == 'recive_report'){
      let report_data = await findReport(data.report_id)
      if(!report_data)
        return res.status(204).json({message : 'report_error_01'}).end();
      if(report_data.volunteerId)
        return res.status(208).json({message : 'report_error_02'}).end();
      await updateVolunteer(data.report_id,data.volunteer_id)
    }
    if(token){
      let payload = {title: data.title,body:data.body,tokens: [token.token],
        data: data
      }
      user.sendNotification(payload)
    }

    

    return res.status(200).json(token).end();

  } catch (err) {
    
    res.status(400).json({message : err.message}).end();
  
  }

  
});

router.get('/location/:id',async (req,res) => {
  
  try {
    let location = await user.getLocation(req.params.id)
    res.status(200).json(location).end();
  } catch (err) {
  
    res.status(400).json({message : err.message}).end();
  
  }

  
});

router.post('/location/:id',async (req,res) => {
  
  try {
    
    await user.setLocation({userid:req.params.id,location:req.body.location});
    res.status(200).json({message: 'success'}).end();


  } catch (err) {
  
    res.status(400).json({message : err.message}).end();
  
  }

  
});

router.post('/setFCMToken',async (req,res) => {
  
  try {

    if(req.body.userid != req.body.token)
      await user.removeToken(req.body.token)
    user.setToken(req.body);
    res.status(200).end();

  } catch (err) {
  
    res.status(400).json({message : err.message}).end();
  
  }

  
});


router.post('/status/:id', jwtAuthMiddleware, async (req,res) => {

  try {
    
    if(req.user.role == 'volunteer' || req.user.role == 'admin') {
      await updateUserStatus(req.params.id,req.body.status)
      let token = await user.getToken(req.params.id)
      if(token){

        let payload = {
          title: (req.body.status == 'ban') ? 'user_status_ban' : 'user_status_unban',
          body: (req.body.status == 'ban') ? 'user_status_ban_desc' : 'user_status_unban_desc',
          tokens: [token.token]
        }

        user.sendNotification(payload)
      }
      res.status(200).end();
    }
    else {  

      res.status(403).json({message : `permission_error_1`}).end();

    }


  } catch (err) {

    res.status(400).json({message : err.message}).end();

  }


});




module.exports = router;