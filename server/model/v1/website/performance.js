const db = require('../../../db');
const helper = require('../../../helper/helper');
const UploadFileLink = process.env.HOST + process.env.PORT + '/';

const performancelist_byid = async (req, res) => {
	var result = {};

	try {

		
		let sport_id = 0;

		if (req.query.sport_id) {
			sport_id = req.query.sport_id;
		}

		let subscriber_id = 0;

		if (req.query.subscriber_id) {
			subscriber_id = req.query.subscriber_id;
		}

		let year_str = 0;

		if (req.query.year_str) {
			year_str = req.query.year_str;
		}



	    //var query = "SELECT ip.*,t.tournament_name,t.is_champ,v.venue_name,c.city_name,s.sports_name FROM individual_performance as ip LEFT JOIN tournament as t ON t.id = ip.turnament_name:: integer LEFT JOIN sports as s ON s.id = ip.sport_id LEFT JOIN venue as v ON v.id = ip.venue_id LEFT JOIN city as c ON c.id = ip.city_id where ip.status = 1 AND ip.sport_id = "+req.query.sport_id+" and ip.subscriber_id = "+req.query.sport_id+" and ip.tournament_date like ('%"+year_str+"%')";

	    var finalDataResult = [];

	    var query = "SELECT ip.*,t.tournament_name,t.is_champ,v.venue_name,c.city_name,s.sports_name,sb.sub_sports_name FROM individual_performance as ip LEFT JOIN tournament as t ON t.id = ip.turnament_name:: integer LEFT JOIN sports as s ON s.id = ip.sport_id LEFT JOIN venue as v ON v.id = ip.venue_id LEFT join sub_sports as sb on sb.sub_sports_id = ip.subsport_id LEFT JOIN city as c ON c.id = ip.city_id where ip.status = 1 AND ip.sport_id in ("+req.query.sport_id+")and ip.tournament_date::text like ('%"+year_str+"%') and ip.subscriber_id = "+req.query.subscriber_id+"";

        console.log("query:------------------------------------ "); 
        console.log(query);
 
		let dataResult = await db.query(query);
		var finalDataResult = dataResult.rows;

		

		console.log("finalDataResult: ++++++++"); 
		console.log(finalDataResult);

		if(finalDataResult && typeof finalDataResult !==undefined && finalDataResult.length>0){   
			for (var i = 0; i < finalDataResult.length; i++) {
				var event_str = "SELECT ie.*,e.event_name,ie.event_other,st.stroke_name ,ds.discipline_name,d.distance_name,CASE WHEN (ie.event_logo IS NULL or ie.event_logo = '' or ie.event_logo ='null') THEN '' ELSE Concat('"+UploadFileLink+"',ie.event_logo) END  as event_logo FROM individual_event as ie left join stroke as st on st.id = ie.stroke:: int left join discipline as ds on ds.id = ie.discipline:: int left join distance as d on d.id = ie.distance:: int LEFT JOIN event as e on e.id = ie.event_name::integer where ie.status = 1 AND ie.master_id = "+finalDataResult[i].id+"";
                //var event_str =" SELECT ie.*,e.event_name,Concat('"+UploadFileLink+"', CASE WHEN ea.attachment  != '' and ea.type ='banner' THEN  Concat(attachment) end) as event_attachment FROM individual_event as ie LEFT JOIN event as e on e.id = ie.event_name::integer LEFT JOIN event_attachment as ea on ea.id = ie.event_name::integer where ie.status = 1 AND ie.master_id = "+finalDataResult[i].id+""
                    console.log("event_str----------------"); 
                console.log(event_str);
				let eventResult = await db.query(event_str);
				var finaleventResult = eventResult.rows; 




				console.log("event_str: "); 
				console.log(event_str);

				console.log("finaleventResult: ++++++++++");
				console.log(finaleventResult);

				if(finaleventResult && typeof finaleventResult !== undefined && finaleventResult.length>0){


                    for (var k = 0; k < finaleventResult.length; k++) {
                        let query = "SELECT *, CASE WHEN event_images IS NULL THEN '' ELSE Concat('"+UploadFileLink+"',event_images) END  as event_images FROM individual_event_images WHERE individual_event_id = "+finaleventResult[k].id+"";

                        let eventimg = await db.query(query);
                        var eventimgResult = eventimg.rows;

                        finaleventResult[k].eventimg = eventimgResult;
                    }


					for (var j = 0; j < finaleventResult.length; j++) {
						var match_level_str = "SELECT iml.*,l.level_name,ml.level_name as match_level_name,ld.discipline_name,lp.parameter_name,position_name,CASE WHEN team_two_logo IS NULL THEN '' ELSE Concat('"+UploadFileLink+"',team_two_logo) END  as team_two_logo,CASE WHEN team_one_logo IS NULL THEN '' ELSE Concat('"+UploadFileLink+"',team_one_logo) END  as team_one_logo ,CASE WHEN (participant_one_logo IS NULL or participant_one_logo =' ' or participant_one_logo ='null') THEN '' ELSE Concat('"+UploadFileLink+"',participant_one_logo) END  as participant_one_logo,CASE WHEN (participant_two_logo IS NULL or participant_two_logo = ' ' or participant_two_logo ='null') THEN '' ELSE Concat('"+UploadFileLink+"',participant_two_logo) END  as participant_two_logo FROM individual_match_level as iml LEFT JOIN discipline as ld on ld.id = iml.level_discipline:: int left join position as p on p.id = iml.level_position:: int left join parameter as lp on lp.id = iml.level_parameter:: int left join level as ml on iml.match_level:: int = ml.id left join level as l on iml.level:: int = l.id where iml.status = 1 AND iml.event_id = "+finaleventResult[j].id+" ORDER BY iml.match_no DESC"; 

                        console.log("match_level_str:========================== "); 
                        console.log(match_level_str);
 
						let matchLevelResult = await db.query(match_level_str);
						var finalmatchLevelResult = matchLevelResult.rows;

                    for (var l = 0; l < finalmatchLevelResult.length; l++) {
                        let query = "SELECT *, CASE WHEN match_images IS NULL THEN '' ELSE Concat('"+UploadFileLink+"',match_images) END  as match_images,CASE WHEN level_images IS NULL THEN '' ELSE Concat('"+UploadFileLink+"',level_images) END  as level_images FROM matchlevel_images WHERE match_level_id = "+finalmatchLevelResult[l].id+"";

                        let matchlavelimg = await db.query(query);
                        var matchlavelimgResult = matchlavelimg.rows;

                        finalmatchLevelResult[l].matchlavelimg = matchlavelimgResult; 
                    }



						console.log("match_level_str: ");
						console.log(match_level_str);

						console.log("finalmatchLevelResult: ++++++++++");
						console.log(finalmatchLevelResult);


						if(finalmatchLevelResult && typeof finalmatchLevelResult !== undefined && finalmatchLevelResult.length>0){
							for (var k = 0; k < finalmatchLevelResult.length; k++) {
								var statistic_str = "SELECT isd.*,e.event_name FROM individual_statistic as isd left join event as e on e.id = isd.event_id where isd.status = 1 AND isd.ml_id = "+finalmatchLevelResult[k].id+"";
 
			 						console.log("statistic_str: ");
									console.log(statistic_str);

									let statisticResult = await db.query(statistic_str);
									var finalstatisticResult = statisticResult.rows;

									console.log("finalstatisticResult: ++++++++++");
									console.log(finalstatisticResult);

									finalmatchLevelResult[k].statistic_data = finalstatisticResult;
							}
						}

						finaleventResult[j].match_level_data = finalmatchLevelResult;

					}
				}
				finalDataResult[i].event_data = finaleventResult;
			}
		}

		return finalDataResult;
	} catch (err) {
		console.log("err:");
		console.log(err);

		result = {};
	}

}



const individual_performance_master = async (req, res) => { 
    let result = {};
    try {
        var where_str = " ";

        if(req.query.sub_sport && typeof req.query.sub_sport !== undefined && req.query.sub_sport !==""){
            where_str = " and is_subsport_id="+req.query.sub_sport;
        }

        let listbyStr = "SELECT ps.*,s.sports_name FROM performance_sport_master as ps LEFT join sports as s on ps.sport_id = s.id where ps.status = 1 and ps.sport_id = "+req.query.id+"";
        console.log('listbyStr');
        console.log(listbyStr);
        let dataResult = await db.query(listbyStr);
        result = dataResult.rows;
    } catch (err) {
        result = {};
    }
    return result;
}

const Awardlist = async (req, res) => {
    try {
        
        let result = {};
        //let query = await db.query(`SELECT a.award_name,award_date,a.description,e.event_name,t.tournament_name FROM subscriber_play_awards as a LEFT JOIN event as e on e.id = a.events::integer LEFT JOIN tournament as t on t.id = a.tournament::integer where sport_id = ${req.query.sport_id}`);


        let query = await db.query("SELECT ewm.award_name,award_date,ewm.award_logo,a.description,e.event_name,t.tournament_name,CASE WHEN award_logo IS NULL THEN '' ELSE Concat('"+UploadFileLink+"',award_logo) END  as award_logo FROM subscriber_play_awards as a LEFT JOIN event as e on e.id = a.events::integer LEFT JOIN subscriber_play_awards_master as ewm on ewm.id = a.award_type_id LEFT JOIN tournament as t on t.id = a.tournament::integer where sport_id = '"+req.query.sport_id+"'");

		if (query.rowCount) {
			console.log('query');
console.log(query);
            result.data = query.rows;
        }

        
        return result
    }
     catch (err) {
        return {
            serverError: true,
            error: err.message
        }
    }
}

const clublist = async (req, res) => {
    try {
        
        let result = {};
        let query = await db.query("SELECT c.* ,CASE WHEN logo IS NULL THEN '' ELSE Concat('"+UploadFileLink+"',logo) END  as logo FROM subscriber_play_teams as c where sport_id = '"+req.query.sport_id+"'");

		if (query.rowCount) {
            result.data = query.rows;
        }

        return result
    }
     catch (err) {
        return {
            serverError: true,
            error: err.message
        }
    }
}

const individualgallerylist = async (req, res) => {
    try {
        
        let result = {};
        let query = await db.query(`SELECT logo FROM subscriber_highlighted_gallery where sport_id = ${req.query.sport_id}`);

		if (query.rowCount) {
            result.data = query.rows;
        }

        return result
    }
     catch (err) {
        return {
            serverError: true,
            error: err.message
        }
    }
}

const individualvideoslist = async (req, res) => {
    try {
        
        let result = {};
        let query = await db.query(`SELECT url FROM subscriber_highlighted_videos where sport_id = ${req.query.sport_id}`);

		if (query.rowCount) {
            result.data = query.rows;
        }

        return result
    }
     catch (err) {
        return {
            serverError: true,
            error: err.message
        }
    }
}


const eventlist = async (req, res) => {
    let result = {};
    try {
        let listStr = "SELECT * FROM individual_event WHERE status = 1  and master_id = '"+req.body.id+"'";
        let dataResult = await db.query(listStr);
        result = dataResult.rows;
    } catch (err) {
        console.log("err: ");
        console.log(err);
        result = {};
    }
    return result;
}

const individual_performancelist = async (req, res) => {
    let result = {};
    try {
        let listStr = "SELECT * FROM individual_performance WHERE status = 1  and sport_id = '"+req.body.id+"'";
        let dataResult = await db.query(listStr);
        result = dataResult.rows;
    } catch (err) {
        console.log("err: ");
        console.log(err);
        result = {};
    }
    return result;
}

const indimatchlevelMastlist = async (req, res) => {
    let result = {};
    try {
        
        
    	var masterid = req.body.master_id ;
    	
		if(masterid && typeof masterid === "undefined" && masterid < 0){

         masterid = null;
    	}
         
         var eventid = req.body.event_id;
    	if(eventid && typeof eventid === "undefined" && eventid < 0){
    		req.body.event_id = null;
    	}
        let listStr = "SELECT * FROM individual_match_level WHERE status = 1  and master_id = "+masterid+" and event_id = "+req.body.event_id+"" ;

        console.log('listStr');
        console.log(listStr);

        let dataResult = await db.query(listStr);
        result = dataResult.rows;
    } catch (err) {
        console.log("err: ");
        console.log(err);
        result = {};
    }
    return result;
}


const indistacMastlist = async (req, res) => {
    let result = {};
    try {
        
        
    	var ml_id = req.body.ml_id ;
    	
		if(typeof ml_id === "undefined" ){

         ml_id = null;
    	}
         
         var eventid = req.body.event_id;
    	if(typeof eventid === "undefined" ){
    		req.body.event_id = null;
    	}
        let listStr = "SELECT * FROM individual_statistic WHERE status = 1  and ml_id = "+ml_id+" and event_id = "+req.body.event_id+"" ;

        console.log('listStr');
        console.log(listStr);

        let dataResult = await db.query(listStr);
        result = dataResult.rows;
    } catch (err) {
        console.log("err: ");
        console.log(err);
        result = {};
    }
    return result;
}

// const yearlist = async (req, res) => {
    
//     try {
//         var result = {};
        
        
//         let listStrd = "SELECT tournament_date FROM individual_performance WHERE status = 1  and sport_id = "+req.query.sport_id+" and subscriber_id = "+req.query.subscriber_id+"" ;

        
// console.log('dataResult');
//         console.log(listStrd);
//         let dataResult = await db.query(listStrd);

//         console.log('dataResult');
//         console.log(dataResult);
//         result = dataResult.rows;

//         console.log('listStr');
//         console.log(result);
//          return result;
//     } catch (err) {
//         console.log("err: ");
//         console.log(err);
//         result = {};
//     }
   
// }

const yearlist = async (req, res) => {
    try {
        
        let result = {};
        let query = await db.query(`SELECT tournament_date FROM individual_performance WHERE status = 1  and sport_id = ${req.query.sport_id} and subscriber_id = ${req.query.subscriber_id}`);

        if (query.rowCount) {
            result.data = query.rows;  
        }

        return result
    }
     catch (err) {
        return {
            serverError: true,
            error: err.message
        }
    }
}






module.exports = { performancelist_byid,individual_performance_master ,Awardlist,clublist,individualgallerylist,individualvideoslist,yearlist}