const editReportDataContoller = async (id,data) => {

    
    const ControllerName = 'editReportDataContoller';
    const {reportModel,carAccidentModel,fireModel,floodModel,earthquakeModel,epidemicModel,ObjectId} = require('../../mongodbController')


    if (typeof id != 'string') { throw new Error(`${ControllerName}: <id> must be String`);}
    else {


        let report = await reportModel.findById(ObjectId(id));
        if(report.type != data.type)
        {
            const remove = async (type) => {
                switch(type){

                    case('car'):
                        await carAccidentModel.deleteOne({reportId: ObjectId(id)})
                    break;
                    case('fire'):
                        await fireModel.deleteOne({reportId: ObjectId(id)})
                    break;
                    case('flood'):
                        await floodModel.deleteOne({reportId: ObjectId(id)})
                    break;
                    case('earthquake'):
                        await earthquakeModel.deleteOne({reportId: ObjectId(id)})
                    break;
                    case('epidemic'):
                        await epidemicModel.deleteOne({reportId: ObjectId(id)})
                    break;

                }
            }
            const add = async (type) => {
                switch(type){

                    case('car'):
                        await carAccidentModel.create({ 
                            reportId: ObjectId(id),
                            litigant: data.detail.litigant,
                            type: data.detail.type
                        })
                    break;
                    case('fire'):
                        await fireModel.create({ 
                            reportId: ObjectId(id),
                            range: data.detail.range,
                            type: data.detail.type
                        })
                    break;
                    case('flood'):
                        await floodModel.create({ 
                            reportId: ObjectId(id),
                            depth: data.detail.depth
                        })
                    break;
                    case('earthquake'):
                        await earthquakeModel.create({ 
                            reportId: ObjectId(id),
                            magnitude: data.detail.magnitude,
                            tsunami: data.detail.tsunami
                        })
                    break;
                    case('epidemic'):
                        await epidemicModel.create({ 
                            reportId: ObjectId(id),
                            patient: data.detail.patient
                        })
                    break;

                }
            }

            return await Promise.all([
                reportModel.updateOne(
                    { _id :  ObjectId(id) },
                    { $set: { 
                            type: data.type,
                            status: data.status
                        }   
                    }
                ),
                remove(data.type),
                add(data.type)
            ])
        } else {

            const update = async (type) => {
                switch(type){

                    case('car'):
                        await carAccidentModel.updateOne(
                            { reportId :  ObjectId(id) },
                            { $set: { 
                                    litigant: data.detail.litigant,
                                    type: data.detail.type
                                }   
                            }
                        )
                    break;
                    case('fire'):
                        await fireModel.updateOne(
                            { reportId :  ObjectId(id) },
                            { $set: { 
                                    range: data.detail.range,
                                    type: data.detail.type
                                }   
                            }
                        )
                    break;
                    case('flood'):
                        await floodModel.updateOne(
                            { reportId :  ObjectId(id) },
                            { $set: { 
                                    depth: data.detail.depth
                                }   
                            }
                        )
                    break;
                    case('earthquake'):
                        await earthquakeModel.updateOne(
                            { reportId :  ObjectId(id) },
                            { $set: { 
                                    magnitude: data.detail.magnitude,
                                    tsunami: data.detail.tsunami
                                }   
                            }
                        )
                    break;
                    case('epidemic'):
                        await epidemicModel.updateOne(
                            { reportId :  ObjectId(id) },
                            { $set: { 
                                    patient: data.detail.patient
                                }   
                            }
                        )
                    break;

                }
            }

            return await Promise.all([
                reportModel.updateOne(
                    { _id :  ObjectId(id) },
                    { $set: { 
                            status: data.status
                        }   
                    }
                ),
                update(data.type)
            ])

        }



    }

}

module.exports = editReportDataContoller;