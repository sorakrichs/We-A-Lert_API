const express = require('express') 
const router = express.Router() 
const jwtAuthMiddleware = require('../../middleware/jwtAuthMiddleware')
const queue = require('../../controllers/queueController')
const user = require('../../controllers/userController')
const {
    uploadImage,
    getImageFormId,
    getReportImages,
    imageModified
} = require('../../controllers/FileController')
const {findReportInRange} = require('../../controllers/MapController')
const {
    getReport,
    updateStatus,
    updateVolunteer,
    getReportList,
    getSubReport,
    getUserReport,
    changeVolunteerReport,
    changeReportAddress,
    findReport,
    editReportData
} = require('../../controllers/ReportController')
const {AuthorizationLog} = require('../../controllers/LogControllers')
const {
    getDisasterCountByProvince,
    getDisasterCountByType,
    getReportCountByDate,
    getReportCountByTypeUser,
    getValidateCountByTypeUser,
    getReportCountByMonth,
    getReportCountByDateProvince,
    getReportCountByMonthProvince
} = require('../../controllers/StatisticControllers')
const multer  = require('multer')
const fs = require('fs');
const path = require('path')

router.get('/list',jwtAuthMiddleware, async (req,res) => {
    
    try {
    
        let data = await getReportList();
        res.status(200).json(data).end();
    
    } catch (err) {
    
        res.status(400).json({message : err.message}).end();
    
    }


});

router.get('/data/:id',jwtAuthMiddleware, async (req,res) => {
    
    try {

        let data = await getReport(req.params.id,req.get('host'));
        res.status(200).json(data).end();
    
    } catch (err) {
    
        res.status(400).json({message : err.message}).end();
    
    }


});

router.post('/detail/:id', jwtAuthMiddleware, async (req,res) => {
    
    try {

        let reportdata = await findReport(req.params.id)
        let data = await Promise.all([getReportImages(req.params.id),getSubReport(req.params.id,reportdata.type),getUserReport(req.params.id)]);
        res.status(200).json({report: reportdata, detail: data}).end();
    
    } catch (err) {
    
        res.status(400).json({message : err.message}).end();
    
    }


});

router.post('/edit/:id', jwtAuthMiddleware, async (req,res) => {
    
    try {

        await editReportData(req.params.id,req.body)
        res.status(200).end();
    
    } catch (err) {
    
        res.status(400).json({message : err.message}).end();
    
    }


});

router.get('/user/:id', jwtAuthMiddleware, async (req,res) => {
    
    try {
        
        let data = await getUserReport(req.params.id);
        res.status(200).json(data);
    
    } catch (err) {
    
        res.status(400).json({message : err.message}).end();
    
    }


});

router.post('/address/:id', jwtAuthMiddleware, async (req,res) => {
    
    try {
        
        if(req.user.role === 'admin') {

            await changeReportAddress(req.params.id,req.body)
            res.status(200).json({message:"success"}).end();  
      
          } else {
            res.status(403).json({message : `permission_error_1`}).end();
          }
    
    } catch (err) {
    
        res.status(400).json({message : err.message}).end();
    
    }


});


router.post('/send', jwtAuthMiddleware, multer().any('picture'), async (req,res) => {

    await queue.addReport(req,res)
    .then((result) => {

        res.status(200).json(result).end()
    
    })
    .catch((err) => {res.status(400).json({message : err.message}).end()}) 


});

router.post('/validate', jwtAuthMiddleware,multer().any('picture'), async (req,res) => {


    await queue.validate(req,res)
    .then((result) => {

        res.status(200).json({message : "OK"}).end();

    }).catch((err) => {console.error(err); res.status(400).json({message : err.message}).end()})

});

router.get('/images/:id',jwtAuthMiddleware, async (req,res) => {

    try {

        let images = await getReportImages(req.params.id);
        res.status(200).send(images).end();
    
      } catch (err) {
      
        res.status(400).json({message : err.message}).end();
      
      }
  

});

router.post('/images/:id',jwtAuthMiddleware,multer().any('picture'), async (req,res) => {

    try {
        let images = await uploadImage(req,req.files);
        await imageModified(req.params.id,images,(typeof req.body.oldfiles === 'string') ? [req.body.oldfiles] : req.body.oldfiles)
        res.status(200).end();
    
      } catch (err) {
      
        res.status(400).json({message : err.message}).end();
      
      }
  

});




router.post('/upload',multer().any('picture'), async (req,res) => { 

    let {files,body} = req;
    
    let text = `report_images/id/${files[0].originalname}`;

    //let list = await uploadImage(req,files);

    res.writeHead(200, {'Content-Type': 'image/jpeg'})
    res.end(req.files[0].buffer)

    
    }
);

router.post('/volunteer/:id',jwtAuthMiddleware, async (req,res) => { 

    if( req.user.role != 'admin')
      return res.status(403).json({message : `Permission denied`}).end();

    await changeVolunteerReport(req.params.id,req.body)
    .then((result) => {

        res.status(200).end()
    
    })
    .catch((err) => {console.log(err); res.status(400).json({message : err.message}).end()});  

});


router.get('/get', async (req,res) => { 



        await queue.getReport(req,res)
        .then((result) => {

            res.status(200).send(result).end()
        
        })
        .catch((err) => {console.log(err); res.status(400).json({message : err.message}).end()});  


    
    }
);



router.patch('/status/:id', jwtAuthMiddleware, async (req,res) => {


    await updateStatus(req.params.id,req.body.status)
    .then((result) => {

        res.status(200).json({message : "OK"}).end();

    }).catch((err) => {console.error(err); res.status(400).json({message : err.message}).end()});
    

});

router.get('/statistic', async (req,res) => {

    try {

        let result = await Promise.all([getDisasterCountByType(),getDisasterCountByProvince(),getReportCountByDate(),getReportCountByMonth()])
        res.status(200).json(result).end()


    } catch (err) {
        res.status(400).json({message : err.message}).end()
    }
    

});

router.get('/statistic/:id', async (req,res) => {

    try {
        
        let result = await Promise.all([getReportCountByTypeUser(req.params.id),getValidateCountByTypeUser(req.params.id),getReportCountByDateProvince(req.params.id),
            getReportCountByMonthProvince(req.params.id)])
        res.status(200).json(result).end()


    } catch (err) {
        res.status(400).json({message : err.message}).end()
    }
    

});

module.exports = router;