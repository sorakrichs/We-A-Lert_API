const {getImageFormId} = require('../../FileController')
const fs = require('fs');

const findReportController = async (id,host) => {

    
    const ControllerName = 'getReportController';
    const {reportModel,carAccidentModel,fireModel,floodModel,earthquakeModel,epidemicModel,ObjectId} = require('../../mongodbController')
    const fs = require('fs');

    if (typeof id != 'string') { throw new Error(`${ControllerName}: <id> must be String`);}
    else {

        try {

            let report = await reportModel.aggregate([
                {
                  '$match': {
                    '_id': ObjectId(id)
                  }
                }, {
                  '$lookup': {
                    'from': 'user', 
                    'localField': 'userId', 
                    'foreignField': '_id', 
                    'as': 'user'
                  }
                }, {
                  '$unwind': {
                    'path': '$user'
                  }
                }, {
                  '$lookup': {
                    'from': 'user', 
                    'localField': 'volunteerId', 
                    'foreignField': '_id', 
                    'as': 'volunteer'
                  }
                }, {
                  '$unwind': {
                    'path': '$volunteer'
                  }
                }, {
                  '$lookup': {
                    'from': 'profile_images.files', 
                    'localField': 'volunteer.image_id', 
                    'foreignField': '_id', 
                    'as': 'volunteerImage'
                  }
                }, {
                  '$project': {
                    '_id': 1, 
                    'description': 1, 
                    'location': 1, 
                    'aoi': 1, 
                    'subdistrict': 1, 
                    'district': 1, 
                    'province': 1, 
                    'postcode': 1, 
                    'type': 1, 
                    'status': 1, 
                    'attachment': 1, 
                    'user': {
                      '_id': 1, 
                      'username': 1, 
                      'name': 1, 
                      'surname': 1, 
                      'phone': 1, 
                      'image_id': 1
                    }, 
                    'volunteer': {
                      '_id': 1, 
                      'username': 1, 
                      'name': 1, 
                      'surname': 1, 
                      'phone': 1, 
                      'image_id': 1
                    }
                  }
                }
            ]).then(data => data[0]);

            if(!report)
                throw new Error ('report_error_01');

            switch(report.type){

                case('car'):
                    report.reportData = await carAccidentModel.aggregate(
                        [
                            {
                            '$match': {
                                'reportId': report._id
                            }
                            }, {
                            '$project': {
                                'type': 1, 
                                'litigant': 1
                            }
                            }
                        ]
                    ).then(items => items[0]).catch(err => {throw err});
                break;
                case('fire'):
                    report.reportData = await fireModel.aggregate(
                        [
                            {
                            '$match': {
                                'reportId': report._id
                            }
                            }, {
                            '$project': {
                                'type': 1, 
                                'range': 1
                            }
                            }
                        ]
                    ).then(items => items[0]).catch(err => {throw err});
                break;
                case('flood'):
                    report.reportData = await floodModel.aggregate(
                        [
                            {
                            '$match': {
                                'reportId': report._id
                            }
                            }, {
                            '$project': {
                                'depth': 1
                            }
                            }
                        ]
                    ).then(items => items[0]).catch(err => {throw err});
                break;
                case('earthquake'):
                    report.reportData = await earthquakeModel.aggregate(
                        [
                            {
                            '$match': {
                                'reportId': report._id
                            }
                            }, {
                            '$project': {
                                'range': 1,
                                'magnitude': 1
                            }
                            }
                        ]
                    ).then(items => items[0]).catch(err => {throw err});
                break;
                case('epidemic'):
                    report.reportData = await epidemicModel.aggregate(
                        [
                            {
                            '$match': {
                                'reportId': report._id
                            }
                            }, {
                            '$project': {
                                'patient': 1
                            }
                            }
                        ]
                    ).then(items => items[0]).catch(err => {throw err});
                break;

            }


            report.memberImage = (report.user.image_id) ? await getImageFormId(report.user.image_id) : undefined;
            report.volunteerImage = (report.volunteer.image_id) ?  await getImageFormId(report.volunteer.image_id) : undefined;

            if(fs.existsSync(`report_images/${report._id}/report/`)) {
                let files = await fs.promises.readdir(`report_images/${report._id}/report/`);

                report.images = await Promise.all(files.map((file) => {
                    return `https://${host}/images/${report._id}/report/${file}`
                }))
            }

            return report;
        } catch (err) {
            throw err;
        }


    }

}

module.exports = findReportController;