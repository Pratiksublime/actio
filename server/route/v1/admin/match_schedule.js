const { body } = require('express-validator');
const { userAuth } = require('../../../middleware/auth');
const { app } = require('firebase-admin');
const matchController = require('../../../controller/v1/admin/match_scheduleCont.js');

module.exports = (app) => {


	// const venueValidation = [

 //     body('champ_id', 'Required champ_id').isLength({ min: 1 })
        
 //        ]
    // match
    app.post('/v1/admin/match/insert',matchController.insert);

    app.post('/v1/admin/match/update', matchController.update);

    app.post('/v1/admin/match/tournamentlist', matchController.tournamentlist);
    app.post('/v1/admin/match/eventlist', matchController.eventlist);

    app.post('/v1/admin/match/playarealist', matchController.playarealist);

    app.post('/v1/admin/match/insertofficials', matchController.insertofficials);

    app.get('/v1/admin/match/surfacetypelist', matchController.surfacetypelist);
	
	app.post('/v1/admin/match/playerslist', matchController.playerslist);

	app.post('/v1/admin/match/insertcontrollers', matchController.insertcontrollers);

	app.post('/v1/admin/match/insertteam', matchController.insertteam);

	app.post('/v1/admin/match/insertparticipant', matchController.insertparticipant);

	app.post('/v1/admin/match/updateParticipant', matchController.updateParticipant);

	app.get('/v1/admin/match/list', matchController.list);

	app.get('/v1/admin/match/champlist', matchController.champlist);

	app.get('/v1/admin/match/matchstructurelist', matchController.matchstructurelist);

	app.post('/v1/admin/match/insertpool', matchController.insertpool);

	app.get('/v1/admin/match/dailymatchlist', matchController.dailymatchlist);

	app.post('/v1/admin/match/delete', matchController.deletedata);

	app.post('/v1/admin/match/poollist', matchController.poollist);

	app.post('/v1/admin/match/teampoollist', matchController.teampoollist); 

	app.post('/v1/admin/match/updateofficials', matchController.updateofficials);

	app.post('/v1/admin/match/teamlist', matchController.teamlist);

	app.post('/v1/admin/match/updateteam', matchController.updateteam);

	app.get('/v1/admin/match/matchstatuslist', matchController.matchstatuslist); 

	app.post('/v1/admin/match/updateController', matchController.updateController);

app.post('/v1/admin/match/updatematchteam', matchController.updatematchteam);


//.....................................................sport point...................................................................................

	app.post('/v1/admin/match/insertsportpoints', matchController.insertsportpoints);

	app.get('/v1/admin/match/sportpointlist', matchController.sportpointlist);

	app.post('/v1/admin/match/sportpointedit', matchController.sportpointedit); 
	
	app.post('/v1/admin/match/updatesportpoints', matchController.updatesportpoints); 

	app.post('/v1/admin/match/deletesportpoints', matchController.deletesportpoints);

	app.post('/v1/admin/match/edit', matchController.edit); 

	app.post('/v1/admin/match/teamplayer', matchController.teamplayer); 

	app.post('/v1/admin/match/matchdateval', matchController.matchdateval); 



//--------------------------------------------------------position------------------------------------------------------------------------------------

	app.post('/v1/admin/match/insertposition', matchController.insertposition);

	app.post('/v1/admin/match/updateposition', matchController.updateposition);

	app.post('/v1/admin/match/deleteposition', matchController.deleteposition); 

	app.get('/v1/admin/match/positionlist', matchController.positionlist); 


	//--------------------------------------------------------Action------------------------------------------------------------------------------------

	app.post('/v1/admin/match/insertaction', matchController.insertaction);

	app.post('/v1/admin/match/updateaction', matchController.updateaction);

	app.post('/v1/admin/match/deleteaction', matchController.deleteaction);

	app.get('/v1/admin/match/actionlist', matchController.actionlist); 

	

	


	


	

	
    

    

    
    
}