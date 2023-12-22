const { body } = require('express-validator');
const { userAuth } = require('../../../middleware/auth');
const { app } = require('firebase-admin');
const websitetournamentController = require('../../../controller/v1/website/website_tournamentController');

module.exports = (app) => {
    // banner
    app.post('/v1/website/tournament/insert', websitetournamentController.insert);
    app.get('/v1/website/tournament/info', websitetournamentController.info);
    app.post('/v1/website/tournament/update', websitetournamentController.update);
    app.get('/v1/website/tournament/UpcomingList',  websitetournamentController.UpcomingList);
    app.get('/v1/website/tournament/pastList',  websitetournamentController.pastList);
    app.get('/v1/website/tournament/withoutPastList',  websitetournamentController.withoutPastList);
    app.get('/v1/website/tournament/detailsList',  websitetournamentController.detailsList);
    app.get('/v1/website/tournament/eventlist',  websitetournamentController.Eventlist);
    app.get('/v1/website/tournament/championList',  websitetournamentController.championList);
    app.get('/v1/website/tournament/tournamentlist_bychamp',  websitetournamentController.Tournamentlist_bychamp);
    app.get('/v1/website/tournament/sportlist',  websitetournamentController.sportList);
    app.get('/v1/website/tournament/locationlist',  websitetournamentController.locationList);
    app.get('/v1/website/tournament/countlist',  websitetournamentController.countList);

    app.get('/v1/website/tournament/UpcomingListNew',  websitetournamentController.UpcomingListNew);
    app.get('/v1/website/tournament/PastListNew',  websitetournamentController.PastListNew); 
    app.get('/v1/website/tournament/detailsListNew',  websitetournamentController.detailsListNew);

    app.get('/v1/website/tournament/eventdetailsList',  websitetournamentController.eventdetailsList);
    

    

}

console.log("tournament");