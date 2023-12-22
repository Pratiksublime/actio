
const { body } = require('express-validator');
const { userAuth } = require('../../../middleware/auth');
const { app } = require('firebase-admin');
const performancesport_masterCont = require('../../../controller/v1/admin/performancesport_masterCont');

module.exports = (app) => {

	//master api
	app.post('/v1/admin/performancesport/add',performancesport_masterCont.addperformancesport);
	app.get('/v1/admin/performancesport/list',performancesport_masterCont.performancelist);

	app.post('/v1/admin/performancesport/listbyid',performancesport_masterCont.performancelist_byid);
	app.post('/v1/admin/performancesport/delete',performancesport_masterCont.deleteperformancesport);
	app.post('/v1/admin/performancesport/update',performancesport_masterCont.performanceupdate);
	app.post('/v1/admin/performancesport/masterupdate',performancesport_masterCont.performanceupdatedata);  

	
	
	app.post('/v1/admin/performancesport/addinfo',performancesport_masterCont.addindividualperformance);
	app.post('/v1/admin/performancesport/individuallistbyid',performancesport_masterCont.individual_performancebyid);
	app.post('/v1/admin/performancesport/performancedelete',performancesport_masterCont.performanceDelete);
	//app.post('/v1/admin/performancesport/performanceUpdate',performancesport_masterCont.performanceUpdate);
	app.post('/v1/admin/performancesport/indiperformanceMast',performancesport_masterCont.individual_performanceMast); 
	app.post('/v1/admin/performancesport/indieventMast',performancesport_masterCont.individual_eventMast); 
	app.post('/v1/admin/performancesport/indimatchlevelMast',performancesport_masterCont.individual_matchlevelMast);
	app.post('/v1/admin/performancesport/indistacMast',performancesport_masterCont.individual_stacMast);
	app.post('/v1/admin/performancesport/eventlist',performancesport_masterCont.eventlist);
	app.post('/v1/admin/performancesport/indiperformancelist',performancesport_masterCont.individual_performancelist); 
	app.post('/v1/admin/performancesport/indimatchlevelMastlist',performancesport_masterCont.indimatchlevelMastlist); 
	app.post('/v1/admin/performancesport/indistacMastlist',performancesport_masterCont.indistacMastlist); 
	app.post('/v1/admin/performancesport/indimatchlevelInfo',performancesport_masterCont.indimatchlevelInfo);
	app.post('/v1/admin/performancesport/editperformanceinfo',performancesport_masterCont.indieventInfo); 
	app.post('/v1/admin/performancesport/indistatisticInfo',performancesport_masterCont.indistatisticInfo);
	app.post('/v1/admin/performancesport/indiperformanceInfo',performancesport_masterCont.indiperformanceInfo);
	app.post('/v1/admin/performancesport/updatePerformance',performancesport_masterCont.updatePerformance); 
	app.post('/v1/admin/performancesport/updateEvent',performancesport_masterCont.updateEvent); 
	app.post('/v1/admin/performancesport/updateMatchlavel',performancesport_masterCont.updateMatchlavel);
	app.post('/v1/admin/performancesport/updatestatastic',performancesport_masterCont.updatestatastic); 
	app.post('/v1/admin/performancesport/deleteperformance',performancesport_masterCont.deleteperformance);  

	app.post('/v1/admin/performancesport/deletevent',performancesport_masterCont.deletevent); 
	app.post('/v1/admin/performancesport/deletmatchlevel',performancesport_masterCont.deletmatchlevel); 
	app.post('/v1/admin/performancesport/deletstatistic',performancesport_masterCont.deletstatistic); 

	app.post('/v1/admin/performancesport/listbysubscriberid',performancesport_masterCont.listbysubscriberid);

	app.post('/v1/admin/performancesport/checksportdublicate',performancesport_masterCont.checksportdublicate);

	app.post('/v1/admin/performancesport/performanceedit',performancesport_masterCont.performanceedit);
	
	


}