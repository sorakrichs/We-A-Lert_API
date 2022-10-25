

module.exports = {

    sendReport: require('./code/sendReportController'),
    getReport: require('./code/getReportController'),
    findReport: require('./code/findReportController'),
    validateReport: require('./code/validateReportController'),
    updateStatus: require('./code/updateStatusController'),
    updateVolunteer: require('./code/updateVolunteerController'),
    getReportList: require('./code/getReportListController'),
    getSubReport: require('./code/getSubReportController'),
    getUserReport: require('./code/getUserReportController'),
    getUserReportedCount: require('./code/getUserReportedCountController'),
    changeVolunteerReport: require('./code/changeVolunteerReportController'),
    changeReportAddress: require('./code/changeReportAddressController'),
    editReportData: require('./code/editReportDataContoller'),
};