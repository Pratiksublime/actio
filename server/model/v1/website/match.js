const db = require('../../../db');
const helper = require('../../../helper/helper');
const UploadFileLink = process.env.HOST + process.env.PORT + '/public/images/';
const UploadFileLinkev = process.env.HOST + process.env.PORT + '/';
const moment = require('moment');


const accesscodedata = async (req, res) => {

	try {

		let querystr = "select * from match_schedule_controllers where match_schedule_id = " + req.body.id + " and " + req.body.accesscode + " ";

		await db.query(querystr);
		return true;

	} catch (err) {
		return false;
	}
}

const matchlisbyid = async (req, res) => {
try {
  let match_status = '';
  if (req.body.match_status) {
    match_status = "and match_status = " + req.body.match_status + "";
  }
  let sub_id = '';
  if (req.body.sub_id) {
    sub_id = "and msc.subscriber_display_id = " + req.body.sub_id + "";
  }

  let querystr = "select ms.*, s.sports_name, msc.subscriber_display_id from match_schedule as ms left join sports as s on s.id = ms.sport left join match_schedule_controllers as msc on msc.match_schedule_id = ms.id where event_id = " + req.body.id + " and ms.status = 1 " + sub_id + match_status + " ORDER by match_status asc";

  console.log("querystr..............222222222222222222");
  console.log(querystr);

  const queryResult = await db.query(querystr);
  const result = queryResult.rows;
  const matchIds = result.map(match => match.id);
  console.log("matchIds.............");
  console.log(matchIds);

  for (let i = 0; i < matchIds.length; i++) {
    const matchId = matchIds[i];

    const querydata = "SELECT ms.id, ms.team_1, team_2, rr.team_name AS team2_name, r.team_name AS team1_name FROM match_schedule_team AS ms LEFT JOIN registration AS r ON r.id = ms.team_1 LEFT JOIN registration AS rr ON rr.id = ms.team_2 WHERE ms.match_schedule_id = " + matchId;
    console.log("resultSubData.........44444");
    console.log(querydata);
    const resultSubData = await db.query(querydata);

    for (let j = 0; j < resultSubData.rows.length; j++) {
      const teamOneData = "SELECT * FROM team_score WHERE team_id = " + resultSubData.rows[j].team_1;
      const teamTwoData = "SELECT * FROM team_score WHERE team_id = " + resultSubData.rows[j].team_2;

      const teamOneInfo = await db.query(teamOneData);
      const teamTwoInfo = await db.query(teamTwoData);

      resultSubData.rows[j]['team_one'] = teamOneInfo.rows;
      resultSubData.rows[j]['team_two'] = teamTwoInfo.rows;
    }

    const querydataa = "SELECT ms.id, ms.participant, r.player_name FROM match_schedule_participant AS ms LEFT JOIN registration_single_player AS r ON r.id = ms.participant WHERE ms.match_schedule_id = " + matchId;
    console.log("querydata.........");
    console.log(querydataa);

    const resultSubDataa = await db.query(querydataa);
    result[i]['participant'] = resultSubDataa.rows;
    result[i]['team'] = resultSubData.rows;
  }

  console.log(result);
  return result;
} catch (err) {
  console.log(err);
  return false;
}


}





const poollist = async (req, res) => {

	try {
		var result = {};
		var pooldata = [];
		var sportpoint = [];
		var team_name = []

		let querystr = "select * from match_schedule_pool where event_id = " + req.query.id + " and status = 1 ORDER BY id Asc";

		console.log(querystr)

		var pooldata = await db.query(querystr);
		pooldata = pooldata.rows;


		for (var j = 0; j < pooldata.length; j++) {





			if (pooldata[j].team !== undefined) {

				var sportsdata = "select id,team_name,qualification_status from registration where id in (" + pooldata[j].team + ")";

				var sportinfo = await db.query(sportsdata);

				var sportinfo = sportinfo.rows;





				//                 
				console.log("sportinfo.......................");
				console.log(sportinfo);

				pooldata[j].team_name = sportinfo


				for (var i = 0; i < pooldata[j].team_name.length; i++) {



					var scoredata = "select * from match_team_score where team_id in (" + pooldata[j].team_name[i].id + ") ORDER by id Asc";


					console.log("8888888888888888888888888888888888888888888.......................");
					console.log(scoredata);

					var scoredatainfo = await db.query(scoredata);

					var scoredatainfo = scoredatainfo.rows;
					console.log("scoredatainfo.......................");
					console.log(scoredatainfo);
					pooldata[j].team_name[i].score = scoredatainfo

				}

				pooldata[j].team_name






				//var scoredatainfo = 



			}




			//     let strdata = "SELECT * FROM match_team_score WHERE team_id = ANY (SELECT unnest(string_to_array(trim('"+pooldata[j].team+"'), ','))::integer FROM match_schedule_pool) AND sport_point = ANY (SELECT unnest(string_to_array(trim('"+pooldata[j].sports_point+"'), ','))::integer FROM match_schedule_pool)";
			//    console.log("score daata -------------------------------------")
			//     console.log(strdata)

			// //let strdata = "select * from match_team_score WHERE team_id = "+pooldata[j].team;+" and sports_point = "+pooldata[j].sports_point+"";

			// var scoredata = await db.query(strdata); 



			//       var scoredata = scoredata.rows;
			//        console.log("sportpointdata.......................");
			//       console.log(scoredata);
			//       pooldata[j].score = scoredata



		}

		for (var i = 0; i < pooldata.length; i++) {


			if (pooldata[i].event_id !== undefined) {

				let querystrdata = "SELECT * FROM sports_point WHERE CAST(id AS TEXT) = ANY(SELECT unnest(string_to_array(sports_point, ',')) FROM match_schedule_pool WHERE event_id = " + pooldata[i].event_id + " and status = 1 )";

				var sportpointdata = await db.query(querystrdata);



				var sportpointdata = sportpointdata.rows;
				console.log("sportpointdata.......................");
				console.log(sportpointdata);

				//var sportpoint = sportpointdata.rows[i].id;

				pooldata[i].sportpointdatainfo = sportpointdata

			}
		}





		//let querystrdata = "SELECT * FROM sports_point WHERE CAST(id AS TEXT) = ANY(SELECT unnest(string_to_array(sports_point, ',')) FROM match_schedule WHERE event_id = "+req.query.id+" and status = 1 )";

		//var sportpointdata = await db.query(querystrdata); 	

		//console.log("querystr");
		//console.log(pooldata);


		//result['sportpoint'] = sportpointdata.rows;
		result['pooldata'] = pooldata;




		console.log("result.............")
		console.log(result)

		return result;




	} catch (err) {
		console.log(err);
		return false;
	}
}

const eventinfo = async (req, res) => {

	try {
		var result = {};
		var img = [];

		let querystr = "select e.*,s.sports_name,ct.city_name,c.name as country_name,t.tournament_name,t.tournament_city,t.tournament_country from event as e left join tournament as t on e.tournament_id = t.id left join sports as s on s.id = e.sports_id  left join country as c on c.id = t.tournament_country left join city as ct on ct.id = t.tournament_city where e.id = " + req.query.id + " and e.status = 1 ";

		console.log(querystr) 

		let infodata = await db.query(querystr);

		result = infodata.rows;

		for (var i = 0; i < result.length; i++) {

			var olympicquery = "SELECT type, Concat('" + UploadFileLinkev + "', CASE WHEN attachment  != '' and type = 'banner' THEN  Concat(attachment) end) as attachment FROM event_attachment where status = 1 and event_id = " + result[i].id;
			console.log("eeeeeeeee-----------------");
			console.log(olympicquery)
			var olympicresultSubData = await db.query(olympicquery);  
			olympicresultSubData = olympicresultSubData.rows;
			result[i]['img'] = olympicresultSubData
		}
		return result;

	} catch (err) {
		console.log(err)
		return false;
	}
}

const insertteamscore = async (req, res) => {
	try {





		for (var i of req.body.updatePoints) {


			if (i.sport_point == '' && i.sport_point == undefined) {

				i.sport_point = 0;

			}

			if (i.team_id == '' || i.team_id == undefined) {

				i.team_id = 0;
			}


			console.log('req.body.22222222222222')

			console.log(i.team_id)

			let pool_id = "";
			if (req.body.pool_id) {
				pool_id = `pool_id = ${req.body.pool_id},`
			}

			let event_id = "";
			if (req.body.event_id) {
				event_id = `event_id = ${req.body.event_id},`
			}

			let team_id = "";
			if (i.team_id) {
				team_id = `team_id = ${i.team_id},`
			}

			let sport_point = "";
			if (i.sport_point) {
				sport_point = `sport_point = ${i.sport_point},`
			}

			let score = "";
			if (i.score) {
				score = `score = '${i.score}',`
			}


			//      let poolid = "select pool_id from match_team_score WHERE  id ="+i.id+"";

			//      console.log(poolid)
			// poolidinfo = await db.query(poolid);
			// poolidinfo = poolidinfo.rows;

			// console.log("poolidinfo.......");

			// console.log(poolidinfo);

			// console.log('poolidinfo.length**************************************************************');

			// console.log(poolidinfo.length);

			// if (poolidinfo.length > 0) {

			console.log('req.body.updatePoints111111')

			console.log(req.body.updatePoints)

			var strquery = `update match_team_score SET ${score} updated_at = now() WHERE  id =${i.id}`;



			console.log(strquery)

			await db.query(strquery);
			// }
			// else{
			// 	var strquery = "INSERT into match_team_score(pool_id,event_id,team_id,sport_point,score,status,created_at) values('" + req.body.pool_id + "'," + req.body.event_id + ",'" + i.team_id + "','" + i.sport_point + "','"+i.score+"',1,now())"; 

			// 	console.log(strquery) 

			// 	await db.query(strquery); 
			// }

		}


		return true

	} catch (err) {
		console.log(err);
		return false
	}
}



const kpilist = async (req, res) => {

	try {

		var result = {};

		let querystr = "select ksm.*,kc.category_name from kpi_sport_mapping as ksm left join kpi_category as kc on kc .id = ksm.kpi_category_id  WHERE sports_id = " + req.query.id + "";

		console.log(querystr);

		result = await db.query(querystr);

		result = result.rows
		return result;

	} catch (err) {
		console.log(err);
		return false;
	}
}


const matchilistdetails = async (req, res) => {

	try {
  let querystr = "SELECT ms.*, mst.team_1, mst.team_2, te.team_name AS team1_name, tt.team_name AS team2_name, e.event_name, t.tournament_name, l.level_name, s.sports_name FROM match_schedule AS ms LEFT JOIN tournament AS t ON t.id = ms.tournament_id LEFT JOIN event AS e ON e.id = ms.event_id LEFT JOIN level AS l ON l.id = ms.match_level LEFT JOIN match_schedule_team AS mst ON mst.match_schedule_id = ms.id LEFT JOIN registration AS te ON te.id = mst.team_1 LEFT JOIN registration AS tt ON tt.id = mst.team_2 LEFT JOIN sports AS s ON s.id = ms.sport WHERE ms.id = " + req.query.id + " AND ms.status = 1";

  console.log(querystr);

  let result = await db.query(querystr);
  result = result.rows;

  console.log(result[0].team_1);

  for (var j = 0; j < result.length; j++) {
    let teamonedata = "SELECT * FROM team_score WHERE team_id = " + result[j].team_1;
    let teamtwodata = "SELECT * FROM team_score WHERE team_id = " + result[j].team_2;

    let teamoneinfo = await db.query(teamonedata);
    let teamtwoinfo = await db.query(teamtwodata);

    result[j]['team_one'] = teamoneinfo.rows;
    result[j]['team_two'] = teamtwoinfo.rows;

    // Add team names to the result
    //result[j]['team_one_name'] = result[j].team1_name;
    //result[j]['team_two_name'] = result[j].team2_name;
  }

  return result;
} catch (err) {
  console.log(err);
  return false;
}

}


const insermatchhighlights = async (req, res) => {

	try {


		var result = {}

		let matchid = "select match_id from match_highlights WHERE match_id = " + req.body.match_id + "";

		result = await db.query(matchid);

		result = result.rows;

		console.log(result)
		if (result.length > 0) {

			let querystr = "update match_highlights SET url = '" + req.body.url + "' ,updated_at = now() WHERE match_id = " + req.body.match_id + " ";
			console.log('querystr update.......')
			console.log(querystr)


			await db.query(querystr);
		} else {

			var querystr = "INSERT into match_highlights(match_id,url,status,created_at) values(" + req.body.match_id + ",'" + req.body.url + "',1,now()) ";
			console.log('querystr INSERT')
			console.log(querystr)
			await db.query(querystr);


		}

		return true;
	} catch (err) {
		console.log(err);
		return false
	}
}



const insermatchimages = async (req, res) => {

	try {
		let now = moment();

		var result = {}
const imgCount = Array.isArray(req.body.img) ? req.body.img.length : 1;

  // Use imgCount to determine how many images were uploaded
  if(Array.isArray(req.files.img)){

console.log(req.files.img[0].length)


		for (var i = 0; i < req.files.img.length; i++) {

			var element = req.files.img[i];
			var image_name = now.format("YYYYMMDDHHmmss") + element.name;

			console.log('image_name.........')

			console.log(image_name)
			element.mv('./public/images/' + image_name);
			var images = image_name;


			console.log("images......."); 
			console.log(images);




			var querystr = "INSERT into match_images(match_id,images,status,created_at) values(" + req.body.match_id + ",'" + images + "',1,now()) ";
			console.log('querystr INSERT')
			console.log(querystr)
			await db.query(querystr);
		}
	}else
	{
		    var element = req.files.img;
			var image_name = now.format("YYYYMMDDHHmmss") + element.name;

			console.log('image_name.........')

			console.log(image_name)
			element.mv('./public/images/' + image_name);
			var images = image_name;


			console.log("images.......");
			console.log(images);




			var querystr = "INSERT into match_images(match_id,images,status,created_at) values(" + req.body.match_id + ",'" + images + "',1,now()) ";
			console.log('querystr INSERT   1 ')
			console.log(querystr)
			await db.query(querystr);

	}

		return true;
	} catch (err) {
		console.log(err);
		return false
	}
}
const imglist = async (req, res) => {

	try {

		var result = {};

		let querystr = "select *,images as images_name ,CASE WHEN (images IS NULL or images = '' or images ='null') THEN '' ELSE Concat('" + UploadFileLink + "',images) END  as images from  match_images WHERE match_id = " + req.query.id + " and status = 1"; 

		console.log(querystr);

		result = await db.query(querystr);

		result = result.rows
		return result;

	} catch (err) {
		console.log(err);
		return false;
	}
}





const leaderboardlist = async (req, res) => {

	try {
		var result = {};
		var pooldata = [];
		var sportpoint = [];
		var team_name = []

		let querystr = "select * from match_schedule_pool where event_id = " + req.query.id + " and status = 1 ORDER BY id Asc";

		console.log(querystr)

		var pooldata = await db.query(querystr);
		pooldata = pooldata.rows;

		console.log("pooldata..........");
		console.log(pooldata);



		for (var j = 0; j < pooldata.length; j++) {





			if (pooldata[j].team !== undefined) {


				//sportsdata = "SELECT r.team_name, r.id, mts.score FROM registration r INNER JOIN match_team_score mts ON r.id = mts.team_id INNER JOIN (SELECT team_id, MAX(score) AS max_score FROM match_team_score WHERE pool_id = " + pooldata[j].id + " AND team_id IN (" + pooldata[j].team + ") AND sport_point = 99999999 GROUP BY team_id ORDER BY max_score DESC) AS max_scores ON mts.team_id = max_scores.team_id AND mts.score = max_scores.max_score WHERE r.id IN (" + pooldata[j].team + ") ORDER BY mts.score DESC"

				sportsdata = "SELECT DISTINCT r.team_name,r.id, mts.score FROM registration r INNER JOIN match_team_score mts ON r.id = mts.team_id INNER JOIN ( SELECT team_id, MAX(score) AS max_score FROM match_team_score WHERE pool_id = " + pooldata[j].id + " AND team_id IN (" + pooldata[j].team + ") AND sport_point = 99999999 GROUP BY team_id ORDER BY max_score DESC) AS max_scores ON mts.team_id = max_scores.team_id AND mts.score = max_scores.max_score WHERE r.id IN (" + pooldata[j].team + ") ORDER BY mts.score DESC";
				console.log("3333333333333333333333333") 
				console.log(sportsdata)

				//var sportsdata = "select id,team_name from registration where id in ("+pooldata[j].team+")";  

				var sportinfo = await db.query(sportsdata);

				var sportinfo = sportinfo.rows;

				pooldata[j].team_name = sportinfo


				for (var i = 0; i < pooldata[j].team_name.length; i++) {



					var scoredata = "select * from match_team_score where team_id in (" + pooldata[j].team_name[i].id + ") ORDER by id Asc";


					console.log("8888888888888888888888888888888888888888888.......................");
					console.log(scoredata);

					var scoredatainfo = await db.query(scoredata);

					var scoredatainfo = scoredatainfo.rows;
					console.log("scoredatainfo.......................");
					console.log(scoredatainfo);
					pooldata[j].team_name[i].score = scoredatainfo

				}

				pooldata[j].team_name


			}







		}

		for (var i = 0; i < pooldata.length; i++) {


			if (pooldata[i].event_id !== undefined) {

				let querystrdata = "SELECT * FROM sports_point WHERE CAST(id AS TEXT) = ANY(SELECT unnest(string_to_array(sports_point, ',')) FROM match_schedule_pool WHERE event_id = " + pooldata[i].event_id + " and status = 1 )";

				var sportpointdata = await db.query(querystrdata);



				var sportpointdata = sportpointdata.rows;
				console.log("sportpointdata.......................");
				console.log(sportpointdata);

				//var sportpoint = sportpointdata.rows[i].id;

				pooldata[i].sportpointdatainfo = sportpointdata

			}
		}






		result['pooldata'] = pooldata;




		console.log("result.............")
		console.log(result)

		return result;




	} catch (err) {
		console.log(err);
		return false;
	}
}



const updatematchstatistics = async (req, res) => {
	try {




for (var i = 0; i < req.body.statistics.length; i++) {
    console.log(req.body.statistics[i].id);
    let updatedata = "update match_schedule_statistics set statistics = '"+req.body.statistics[i].stats+"' where match_id = '"+req.body.match_id+"' and id = "+req.body.statistics[i].id+";";
    console.log(updatedata);
    await db.query(updatedata);
}



		


		return true

	} catch (err) {
		console.log(err);
		return false
	}
}

const inserststzero = async (req, res) => {
	try {

		var teamArray = req.body.team.split(",");
		var sportpointArray = req.body.kpi.split(",");

		for (var j = 0; j < teamArray.length; j++) {
			var team = teamArray[j];
			//var sport_point = sportpointArray[j]


			for (var i = 0; i < sportpointArray.length; i++) {

				var sport_point = sportpointArray[i]

				var scorestrquery = "INSERT into match_schedule_statistics(match_id,team,kpi_id,statistics,status,created_at) values('" + req.body.match_id + "','" + team + "','" + sport_point + "',0,1,now())";

				console.log('scorestrquery.................');
				console.log(scorestrquery);

				await db.query(scorestrquery);
			}
		}
		return true
	} catch (err) {
		return false

	}
}


const statisticslist = async (req, res) => {

	try {
		var result = {};
		var finalresult =[];

		let kpi_id= "SELECT DISTINCT ON (ms.kpi_id) ms.kpi_id, ms.id, k.category_name FROM match_schedule_statistics AS ms LEFT JOIN kpi_category AS k ON k.id = ms.kpi_id WHERE match_id = "+req.query.id+" ORDER BY ms.kpi_id, ms.id ASC";

		console.log(kpi_id);

	//let kpi_id= `SELECT distinct ms.kpi_id ,k.category_name FROM match_schedule_statistics as ms left join kpi_category as k on k.id= ms.kpi_id WHERE match_id = ${req.query.id} ORDER BY ms.id`;

		 kpi_id = await db.query(kpi_id); 
		kpi_id = kpi_id.rows;

		console.log(kpi_id);

		for (var i = 0; i < kpi_id.length; i++) {
			let alldata = "SELECT * FROM match_schedule_statistics WHERE kpi_id = "+kpi_id[i].kpi_id+" and match_id = "+req.query.id+" ORDER by id ASC";  

			 alldata = await db.query(alldata);
		     alldata = alldata.rows;
 console.log("alldata");
		     console.log(alldata);
		     kpi_id[i].statistics = alldata 

		}


		


		
		return kpi_id;
	} catch (err) {
		console.log(err); 
		return false;
	}
}

const deletematchimg = async (req, res) => {
	try {

	 
    let updatedata = "update match_images set status = 2 where id = '"+req.body.id+"' ";
    console.log(updatedata);
    await db.query(updatedata);

	return true

	} catch (err) {
		console.log(err);
		return false
	}
}

const matchhighlightslist = async (req, res) => {

	try {

		var result = {};

		let querystr = "select * from match_highlights WHERE match_id = " + req.query.id + " and status = 1"; 

		console.log(querystr);

		result = await db.query(querystr);

		result = result.rows
		return result;

	} catch (err) {
		console.log(err);
		return false;
	}
}



module.exports = {
	accesscodedata,
	matchlisbyid,
	poollist,
	eventinfo,
	insertteamscore,
	kpilist,
	matchilistdetails,
	insermatchhighlights,
	insermatchimages,
	leaderboardlist,
	imglist,
	updatematchstatistics,
	inserststzero,
	statisticslist,
	deletematchimg,matchhighlightslist

}