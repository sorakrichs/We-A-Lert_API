const typeReportController = async (report_id,type,subType,reportdata = {}) => {

    const ControllerName = 'typeReportController';
    const {
        carAccidentModel,
        fireModel,
        floodModel,
        earthquakeModel,
        epidemicModel,
        ObjectId
    } = require('../../mongodbController')


    if (typeof report_id != 'string') { throw new Error(`${ControllerName}: <report_id> must be String`);}
    else if (typeof reportdata != 'string') { throw new Error(`${ControllerName}: <reportdata> must be JSON String`);}
    else {

        const data = JSON.parse(reportdata);
        switch(type) {
            case('car'):
                const new_reportA = new carAccidentModel({

                    reportId: ObjectId(report_id),
                    type: subType,
                    litigant: data.litigant
        
        
                });
                return await new_reportA.save().then(r => r).catch(err => { throw err });
            break;
            case('fire'):
                const new_reportB = new fireModel({

                    reportId: ObjectId(report_id),
                    type: subType,
                    range: data.range
        
        
                });
                return await new_reportB.save().then(r => r).catch(err => { throw err });
            break;
            case('flood'):
                const new_reportC = new floodModel({

                    reportId: ObjectId(report_id),
                    depth: data.depth
        
        
                });
                return await new_reportC.save().then(r => r).catch(err => { throw err });
            break;
            case('earthquake'):
                const new_reportD = new earthquakeModel({

                    reportId: ObjectId(report_id),
                    magnitude: data.magnitude,
                    tsunami: data.tsunami
        
                });
                return await new_reportD.save().then(r => r).catch(err => { throw err });
            break;
            case('epidemic'):
                const new_reportE = new epidemicModel({

                    reportId: ObjectId(report_id),
                    patient: data.patient
        
                });
                return await new_reportE.save().then(r => r).catch(err => { throw err });
            break;
            default :
                throw new Error (`No Type`);

        }

        

    }


}

module.exports = typeReportController;