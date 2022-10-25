const express = require('express')
const app = express()
const env = require('./engines/eng_dotenv')();
const requestIp = require('request-ip');

if (!env) {
    console.log("envfile not found");
}

const {mongooseDoConnect} = require('./engines/eng_mongodb')
const cors = require('cors');
const {removeNoReportImageServer,removeNoReportImageDatabase} = require('./controllers/FileController')
const {sendReport} = require('./controllers/ReportController')
const {findMember,getMemberLocation} = require('./controllers/MapController')
const jwtAuthMiddleware = require('./middleware/jwtAuthMiddleware')
const {memberRouter,reportRouter,volunteerRouter,adminRouter} = require('./routers')
const {getAuthorizationLog} = require('./controllers/LogControllers')
const cron = require('node-cron');
const users = require('./controllers/userController');
const geo = require('./controllers/geoController');
const user = require('./controllers/userController');
const {getDisasterCount} = require('./controllers/getDataController')
var morgan = require('morgan')
const http = require('http');
const server = http.createServer(app).listen(8080,'0.0.0.0',() => {
  console.log('Start server at port 8080.')
});
app.use(requestIp.mw())
app.use(morgan('combined'))

cron.schedule('0 0 0 * * *', async () => {
  await Promise.all([removeNoReportImageServer(),removeNoReportImageDatabase()]);
  console.log('remove chunk at 12:00');
});

app.use(cors());
app.use(express.json())
app.use(express.urlencoded({
  extended: false
}));


app.use('/images', express.static('report_images'));
app.use('/member',memberRouter)
app.use('/volunteer',volunteerRouter)
app.use('/report',reportRouter)
app.use('/admin',adminRouter)

app.get('/', async (req,res)=> {
  res.status(200).send('Hello World').end();
})

app.post('/yahoo', async (req,res)=> {
  try {
    let token = await geo.getDistance(req.body.lat,req.body.lon);
    res.status(200).send(token).end();
  } catch(err) {
    res.status(400).send('Hello Hell').end();
  }
})


mongooseDoConnect().then(r => { console.log(`Mongo DB Connected!`); return r; }).catch(e => { throw e; });