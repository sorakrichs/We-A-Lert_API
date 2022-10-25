const Queue = require('bull');
const {sendReport,validateReport} = require('./ReportController')
const {uploadImage,getImageFormId,getReportImages} = require('./FileController');
const {findReport,findMember} = require('./MapController')
const fs = require('fs');
const path = require('path')
const geo = require('./geoController')
const user = require('./userController')
const imageType = require('image-type');
require('events').EventEmitter.prototype._maxListeners = 70;
require('events').defaultMaxListeners = 70

const ReportQueue = new Queue('Report');
const ValidateQueue = new Queue('Validate');
const getReportQueue = new Queue('getReport');
const protocal = 'http'

// const ReportQueue = new Queue('Report',{ redis: { port: 6379, host: '10.93.96.115' } });
// const ValidateQueue = new Queue('Validate',{ redis: { port: 6379, host: '10.93.96.115' } });
// const getReportQueue = new Queue('getReport',{ redis: { port: 6379, host: '10.93.96.115' } });
// const protocal = 'https'


ReportQueue.process(async (job) => {

    let {data,images,host} = job.data;
    const {id,username,phone} = JSON.parse(data.user);
    let image_ids = images.map(({id}) => id)
    let result = await sendReport(data,image_ids);
    let imagepath = []
    if(images.length > 0) {

        await fs.promises.mkdir(`report_images/${result._id}/report`, { recursive: true })

        await Promise.all(
            images.map(async (image) => {

                await fs.promises.writeFile(`report_images/${result._id}/report/${image.id}${path.parse(image.file.originalname).ext}`,Buffer.from(image.file.buffer.data))
                imagepath.push(`${protocal}://${host}/images/${result._id}/report/${image.id}${path.parse(image.file.originalname).ext}`)
            })
        )
    }

    const tokens = await geo.searchUserinRange(10000,result.location.coordinates[1],result.location.coordinates[0],'volunteer',id)
    let payload = {title: 'แจ้งอุบัติภัย',body:result.description,tokens: tokens,
        data: {
            id: result._id.toString(),
            title: 'แจ้งอุบัติภัย',
            body: data.description,
            type:'report',
            location: JSON.stringify({
                lat: result.location.coordinates[1],
                lon: result.location.coordinates[0]
            }),
            userid: id,
            username: username,
            phone: phone,
            imageUrl: JSON.stringify(imagepath)
        }}
    user.sendNotification(payload);
    return Promise.resolve({result});


})

ValidateQueue.process(async (job) => {

    let {data,images,host} = job.data;
    let image_ids = images.map(({id}) => id)
    let result = await validateReport(data,image_ids);
    const member = JSON.parse(data.report_user);
    const {id} = JSON.parse(data.user);
    const {lat,lon} = JSON.parse(data.location);
    const reportdata = JSON.parse(data.reportdata);

    if(images.length > 0) {

        await fs.promises.mkdir(`report_images/${data.report_id}/report`, { recursive: true })

        await Promise.all(
            images.map(async (image) => {   

                await fs.promises.writeFile(`report_images/${data.report_id}/report/${image.id}${path.parse(image.file.originalname).ext}`,Buffer.from(image.file.buffer.data))
                
            })
        )
    }


    function getRange(type){
        switch(type){
            case('fire'):
                return Number(reportdata.range);
            break;
            case('flood'):
                return 500;
            break;
            case('epidemic'):
                return 100;
            break;
            case('earthquake'):
                return 10000;
            break;
            default: 
                return 0;
        }
    }

    let range = getRange(data.type);

    if(range > 0) {

        let tokens = await geo.searchUserinRange(range,lat,lon,'all',id)
        let userToken = await user.getToken(member.id)
        if(userToken) {
            let reporter_payload = {title: 'ภัยพิบัติได้รับการยืนยัน',body:data.description,tokens: [userToken.token],
                data: {
                    id: data.report_id,
                    title: 'ภัยพิบัติได้รับการยืนยัน',
                    body:data.description,
                    type: 'isvalidated'
                },
                priority: (data.type == 'fire') ? 'high' : 'normal'
            }
            user.sendNotification(reporter_payload);
            tokens = tokens.filter(token => token !== userToken.token);
        }
            
        let payload = {title: 'แจ้งอุบัติภัย',body:data.description,tokens: tokens,
            data: {
                id: data.report_id,
                title: 'แจ้งอุบัติภัย',
                body:data.description,
                type: data.type
            },
            priority: (data.type == 'fire') ? 'high' : 'normal'
        }

        user.sendNotification(payload);

        let housemember_id = await findMember({lat: lat,lon: lon},range)
        let house_tokens = await Promise.all(
            housemember_id.map(async (userid) => {

                let token = await user.getToken(userid)
                if(token && id != userid)
                    return token.token

            })
        )

        let house_payload = {
            title: 'แจ้งอุบัติภัยใกล้บ้าน',body:data.description,tokens: house_tokens.filter(Boolean),
            data: {
                id: data.report_id,
                title: 'แจ้งอุบัติภัยใกล้บ้าน',
                body: data.description,
                type: data.type,
            },
            priority: (data.type == 'fire') ? 'high' : 'normal'
        }

        user.sendNotification(house_payload);
    }

    return Promise.resolve(result);

})

getReportQueue.process(async (job) => {

    try {

        let {location,range,host,protocol} = job.data;
        let data = await findReport();
        
        let reportData = await Promise.all(
            data.map(async (report,index) => {

            if(fs.existsSync(`report_images/${report._id}/report`)) {

                let files = await fs.promises.readdir(`report_images/${report._id}/report`, { withFileTypes: true }, async (err) => {

                    if (err)
                        console.warn(err);

                });


                report.images = await Promise.all(files.filter(files => files.isFile()).map((file) => {
                    return `${protocal}://${host}/images/${report._id}/report/${file.name}`
                }))

            } else {

                let images = await getReportImages(report._id.toString(),'buffer')
                report.images = await Promise.all(
                    images.map(async (image,index) => {
                        
                        await fs.promises.mkdir(`report_images/${report._id}/report`, { recursive: true })
                        await fs.promises.writeFile(`report_images/${report._id}/report/${image.id}.${imageType(image.file).ext}`,image.file,
                            (err) => {
                                if(err) throw err;
                            }
                        )
                        return `${protocal}://${host}/images/${report._id}/report/${image.id}.${imageType(image.file).ext}`;
                    })
                )
                
            }

            if(!fs.existsSync(`report_images/${report._id}/user`))
                await fs.promises.mkdir(`report_images/${report._id}/user`, { recursive: true })

            let images = await fs.promises.readdir(`report_images/${report._id}/user`, { withFileTypes: true });
            const memberImage = images.find(({name}) => name.split('.')[0] == report.user.image_id);
            const volunteermemberImage = images.find(({name}) => name.split('.')[0] == report.volunteer.image_id);

            if( 
                ((memberImage ? (report.user.image_id !== null):(report.user.image_id === null)) &&
                ( !(memberImage  || report.user.image_id) || (memberImage && memberImage.name.split('.')[0] == report.user.image_id))) &&
                ((volunteermemberImage?  (report.volunteer.image_id !== null):(report.volunteer.image_id === null)) && 
                ( !(volunteermemberImage || report.volunteer.image_id) || (volunteermemberImage && volunteermemberImage.name.split('.')[0] == report.volunteer.image_id)))
            ) {

                report.memberImage = (memberImage) ? `${protocal}://${host}/images/${report._id}/user/${memberImage.name}` : undefined;
                report.volunteerImage = (volunteermemberImage) ? `${protocal}://${host}/images/${report._id}/user/${volunteermemberImage.name}` : undefined;

            }
            else
            {
                [report.memberImage,report.volunteerImage] = await Promise.all([getImageFormId(report.user.image_id,'buffer'),getImageFormId(report.volunteer.image_id,'buffer')]);
                let a = async () => {
                    if(report.user.image_id)
                    {
                        await fs.promises.writeFile(`report_images/${report._id}/user/${report.user.image_id}.${imageType(report.memberImage).ext}`,report.memberImage)
                        report.memberImage = `data:${imageType(report.memberImage).mime};base64,` + report.memberImage.toString('base64');
                    } 
                }
                let b = async () => {
                    if(report.volunteer.image_id)
                    {
                        await fs.promises.writeFile(`report_images/${report._id}/user/${report.volunteer.image_id}.${imageType(report.volunteerImage).ext}`,report.volunteerImage)
                        report.volunteerImage = `data:${imageType(report.volunteerImage).mime};base64,` + report.volunteerImage.toString('base64');
                    }
                }
                await Promise.all([a(),b()])

            }

            return report;

        }))

        return reportData;
        


    } catch (err) {
        throw err
    }

})

const queue = {}

queue.addReport = async (req,res) => {


    try {
             
        let images = await uploadImage(req,req.files);
        let job = await ReportQueue.add({data:req.body, images: images, host: req.get('host')},{
            removeOnComplete: true
        })
        let {result} = await job.finished();
        return result._id;

    } catch (err) {
        throw err;
    }

}

queue.validate = async (req,res) => {

    try {
        
        let images = await uploadImage(req,req.files);
        let job = await ValidateQueue.add({data:req.body, images: images, host: req.get('host'), protocol: req.protocol},{
            removeOnComplete: true
        })
        return job.finished();
    

    } catch (err) {
        throw err;
    }

}


queue.getReport = async (req,res) => {

    try {
        let job = await getReportQueue.add({host: req.get('host')},{
                removeOnComplete: true
        })

        return await job.finished();

        

    } catch (err) {
        throw err;
    }

}

module.exports = queue;