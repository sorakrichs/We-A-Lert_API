const express = require('express') 
const router = express.Router() 
const {memberRegister,addressRegister} = require('../../controllers/RegisterController')
const {adminAuthorization} = require('../../controllers/AuthorizationController')
const {checkUserExist,loginLimiter} = require('../../controllers/miscController')
const {AuthorizationLog,getAuthorizationLog} = require('../../controllers/LogControllers')
const {addVolunteer,removeVolunteer,changeVolunteerRole} = require('../../controllers/updateDataController')
const user = require('../../controllers/userController')
const jwtAuthMiddleware = require('../../middleware/jwtAuthMiddleware')

router.post('/register', async (req,res) => {

    try {
      
        let exist = await checkUserExist(req.body)
        if(exist) { 
        
          res.status(400).json({message : `username, personalid or phone is already use`}).end(); 

        } else {

        await memberRegister(req.body);
        res.status(200).json({message:"success"}).end();

      }
  
    } catch (err) {
  
      res.status(400).json({message : err.message}).end();
  
    }
   
  
  
  
});

router.post('/login',loginLimiter, async (req,res) => {
  

  await adminAuthorization(req.body)
  .then(async (result) => {
    console.log(result)
    const ip = req.clientIp;
    await AuthorizationLog(result.id,'admin','login',ip);
    res.status(200).send(result.token);
  
  })
  .catch((err) => {res.status(400).json({message : err.message})})

  
});


router.get('/log',jwtAuthMiddleware, async (req,res) => {
  
  try {
    if( req.user.role != 'admin')
      return res.status(403).json({message : `Permission denied`}).end();
    let data = await getAuthorizationLog()
    res.status(200).send(data);
  } catch(err) {

    res.status(400).json({message : err.message})

  }

  
});

router.post('/role/:id',jwtAuthMiddleware, async (req,res) => {
  
  try {
    if( req.user.role != 'admin')
      return res.status(403).json({message : `Permission denied`}).end();
    await changeVolunteerRole(req.params.id,req.body)
    res.status(200).send(data).end();
  } catch(err) {

    res.status(400).json({message : err.message}).end()

  }

  
});

router.post('/organization/add/:id',jwtAuthMiddleware, async (req,res) => {
  
  try {
    if( req.user.role != 'admin')
      return res.status(403).json({message : `Permission denied`}).end();
    await addVolunteer(req.params.id,req.body).then(() => {res.status(200).json({message : 'success'})})
  } catch(err) {

    res.status(400).json({message : err.message}).end()

  }

  
});

router.post('/organization/remove/:id',jwtAuthMiddleware, async (req,res) => {
  
  try {
    if( req.user.role != 'admin')
      return res.status(403).json({message : `Permission denied`}).end();
    await removeVolunteer(req.params.id,req.body).then(() => {res.status(200).json({message : 'success'}).end();})
  } catch(err) {

    res.status(400).json({message : err.message}).end()

  }

  
});


module.exports = router;