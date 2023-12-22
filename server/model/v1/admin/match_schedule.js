const db = require('../../../db');
const helper = require('../../../helper/helper');
const moment = require('moment');

const insert = async (req, res) => {
	try {

		console.log('req.body.field_of_play........')
		console.log(req.body.field_of_play)
		let checktime = "select time from match_schedule WHERE status = 1 and date = '"+req.body.date+"' and time = '"+req.body.time+"'"; 

		let timedata = await db.query(checktime);

		console.log(timedata.rowCount);

		console.log("timedata...........");

		if(timedata.rowCount > 0){
			var msg = '-99';
 
			console.log(msg);
			return  msg;
		}

		if (req.body.other_field_of_play == '' || req.body.other_field_of_play == 'undefined') {

			req.body.other_field_of_play = null; 
		}
		
		if (req.body.field_of_play == 'undefined') {

			req.body.field_of_play = null;
		}

		if (req.body.champ_id == '' || req.body.champ_id == 'undefined') {

			req.body.champ_id = null;
		}

		if (req.body.lanes == '' || req.body.lanes == 'undefined') { 

			req.body.lanes = null;
		}

		if (req.body.sports_point == '' || req.body.sports_point == 'undefined') {

			req.body.sports_point = null;
		}
		if (req.body.no_column == '' || req.body.no_column == 'undefined') {

			req.body.no_column = null;
		}

		if (req.body.url == '' || req.body.url == 'undefined') {

			req.body.url = null;
		}

		if (req.body.structure == '' || req.body.structure == 'undefined') {

			req.body.structure = null;
		}

		if (req.body.pool == '' || req.body.pool == 'undefined') {

			req.body.pool = null;
		}


		




		let statusStr = "INSERT into match_schedule(champ_id,tournament_id,event_id,sport,match_structure,match_no,date,time,match_level,field_of_play,other_field_of_play,lanes,pool,no_column,sports_point,match_status,structure,url,created_at,status) values (" + req.body.champ_id + "," + req.body.tournament_id + "," + req.body.event_id + "," + req.body.sport + ",'" + req.body.match_structure + "','" + req.body.match_no + "','" + req.body.date + "','" + req.body.time + "'," + req.body.match_level + "," + req.body.field_of_play + ",'" + req.body.other_field_of_play + "'," + req.body.lanes + "," + req.body.pool + ",'" + req.body.no_column + "','" + req.body.sports_point + "',"+req.body.match_status+",'"+req.body.structure+"','"+req.body.url+"',now(), 1)RETURNING id ";
		console.log('statusStr.....................');
		console.log(statusStr);

		let data = await db.query(statusStr);

		const id = data.rows[0].id;

		return id;
	} catch (err) {
		console.log(err);
		return false;
	}
}

const update = async (req, res) => {
	try {

		// let checktime = "select time from match_schedule WHERE status = 1 and time = '"+req.body.time+"'"; 

		// let timedata = await db.query(checktime);

		// console.log(timedata.rowCount);

		// console.log("timedata...........");

		// if(timedata.rowCount > 1){
		// 	var msg = '-99';
 
		// 	console.log(msg);
		// 	return  msg;
		// }

		console.log('req.body.match_level');
		console.log(req.body.match_level);

		if (req.body.other_field_of_play == '' || req.body.other_field_of_play == 'undefined') {

			req.body.other_field_of_play = null;
		}
		if (req.body.field_of_play == '' || req.body.field_of_play == 'undefined') {

			req.body.field_of_play = null;
		}

		if (req.body.champ_id == '' || req.body.champ_id == 'undefined') {

			req.body.champ_id = null;
		}

		if (req.body.lanes == '' || req.body.lanes == 'undefined') { 

			req.body.lanes = null;
		}

		if (req.body.sports_point == '' || req.body.sports_point == 'undefined' || typeof req.body.sports_point == undefined) { 

			req.body.sports_point = null;
		}
		if (req.body.no_column == '' || req.body.no_column == 'undefined') {
 
			req.body.no_column = null;
		}

		if (req.body.sport == '' || req.body.sport == 'undefined') {

			req.body.sport = null;
		}


		if (typeof req.body.match_level === undefined || req.body.match_level === 'undefined') {

			req.body.match_level = null;
		}

		if (req.body.structure == '' || req.body.structure == 'undefined') {

			req.body.structure = null;
		}

		
		// if(timedata.rowCount <= 1){

		let statusStr = "update  match_schedule set champ_id = " + req.body.champ_id + ",tournament_id =" + req.body.tournament_id + ",event_id = " + req.body.event_id + ",sport = " + req.body.sport + ",match_no = '" + req.body.match_no + "',date = '" + req.body.date + "',time = '" + req.body.time + "',match_level = " + req.body.match_level + ",field_of_play = " + req.body.field_of_play + ", other_field_of_play = '" + req.body.other_field_of_play + "',lanes = " + req.body.lanes + ",match_status = "+req.body.match_status+",structure ='"+req.body.structure+"' ,url = '"+req.body.url+"',updated_at = now() WHERE id = " + req.body.id + " ";
		console.log('statusStr.....................');  
		console.log(statusStr);

		let data = await db.query(statusStr);

		//const id = data.rows[0].id;

		return true;
	// }

	

		
	} catch (err) {
		console.log(err);
		return false;
	}
}

const insertofficials = async (req, res) => {
	try {

		let deletedata  = "delete from match_schedule_officials WHERE match_schedule_id = "+req.body.match_schedule_id+"";
		await db.query(deletedata);

		console.log

		if (req.body.subscriber_display_id[0].length > 1) {
			for (var i = 0; i < req.body.subscriber_display_id.length; i++) {

				let statusStr = "INSERT into match_schedule_officials(subscriber_display_id,match_schedule_id,full_name,email_id,mobile_number,designation,status,created_at) values (" + req.body.subscriber_display_id[i] + "," + req.body.match_schedule_id + ",'" + req.body.full_name[i] + "','" + req.body.email_id[i] + "'," + req.body.mobile_number[i] + ",'" + req.body.designation[i] + "',1,now())RETURNING id ";

				console.log('statusStr.....................');
				console.log(statusStr);
				await db.query(statusStr);
			}
		}

		else {
			let statusStr = "INSERT into match_schedule_officials(subscriber_display_id,match_schedule_id,full_name,email_id,mobile_number,designation,status,created_at) values (" + req.body.subscriber_display_id + "," + req.body.match_schedule_id + ",'" + req.body.full_name + "','" + req.body.email_id + "'," + req.body.mobile_number + ",'" + req.body.designation + "',1,now())RETURNING id ";

			console.log('statusStr.....................');
			console.log(statusStr);
			await db.query(statusStr);
		}



		return true;
	} catch (err) {
		console.log(err);
		return false;
	}
}


const updateofficials = async (req, res) => {
	try {
         let deletedata  = "delete from match_schedule_officials WHERE match_schedule_id = "+req.body.match_schedule_id+"";
		await db.query(deletedata);

		let strupdate = "update match_schedule_officials set subscriber_id = " + req.body.subscriber_id + ",match_schedule_id= " + req.body.match_schedule_id + ",name = '" + req.body.name + "',email = '" + req.body.email + "' ,mobile_no = " + req.body.mobile_no + ",designation = '" + req.body.designation + "',updated_at = now() WHERE id = " + req.body.id + " ";

		console.log(strupdate);

		let updateres = await db.query(strupdate);

		return true;
	}
	catch (err) {
		console.log(err);
		return false

	}

}

const insertcontrollers = async (req, res) => {
	try {
		const result = [];


         let deletedata  = "delete from match_schedule_controllers WHERE match_schedule_id = "+req.body.match_schedule_id+"";
         console.log('sjjjjjjxdyusgysdgsyugus');
         console.log(deletedata);
		await db.query(deletedata);

		


				let matchno = "select ms.event_id,ms.match_no,e.event_name from match_schedule as ms left join event as e on e.id = ms.event_id WHERE ms.id = "+req.body.match_schedule_id+"";
console.log(matchno);
console.log('ddddddddddddddddddddddda');
				matchno = await db.query(matchno);

				var match_no = matchno.rows;
				var matchnodata = match_no[0].match_no;
				var event = match_no[0].event_name;


		console.log('req.body.subscriber_id.length.....................');
		console.log(match_no[0].match_no);

		console.log('req.body.subscriber_id......................');
		console.log(req.body.subscriber_display_id.length);
		if (req.body.subscriber_display_id[0].length > 1) {



			for (var i = 0; i < req.body.subscriber_display_id.length; i++) {

				var accesscode = Math.floor(100000 + Math.random() * 900000);
				
				

				var statusStr = "INSERT into match_schedule_controllers(subscriber_display_id,match_schedule_id,full_name,email_id,mobile_number,description,accesscode,seen_status,status,created_at) values (" + req.body.subscriber_display_id[i] + "," + req.body.match_schedule_id + ",'" + req.body.full_name[i] + "','" + req.body.email_id[i] + "'," + req.body.mobile_number[i] + ",'" + req.body.description[i] + "'," + accesscode + ",1,1,now())RETURNING id,email_id,accesscode";

				console.log('statusStr.....................');
				console.log(statusStr);

				var data = await db.query(statusStr);

				let id = data.rows[0].id;

				let email = data.rows[0].email_id;

				let accesscodedata = data.rows[0].accesscode;
				



				result.push({
					"id": id,
					"email": email,
					"accesscode": accesscode,
					"match_no":matchnodata,
					"event":event

				});
				console.log("--------------------------")
				console.log(result);


			}


			return result
		}

		else {

			let accesscode = Math.floor(100000 + Math.random() * 900000);
			let statusStr = "INSERT into match_schedule_controllers(subscriber_display_id,match_schedule_id,full_name,email_id,mobile_number,description,accesscode,seen_status,status,created_at) values (" + req.body.subscriber_display_id + "," + req.body.match_schedule_id + ",'" + req.body.full_name + "','" + req.body.email_id + "'," + req.body.mobile_number + ",'" + req.body.description + "'," + accesscode + ",1,1,now())RETURNING id,email_id ,accesscode";

			console.log('statusStr2222222222222.....................');
			console.log(statusStr);
			let data = await db.query(statusStr);



			let id = data.rows[0].id;

			let email = data.rows[0].email_id;

			let accesscodedata = data.rows[0].accesscode;



			result.push({
				"id": id,
				"email": email,
				"accesscode": accesscode,
				"match_no":matchnodata,
				"event":event

			});
			console.log("--------------------------")
			console.log(result);


			console.log('data.....................');

			console.log(result.rows)
			return result
		}


		return true;
	} catch (err) {
		console.log(err);
		return false;
	}
}

const updateController = async (req, res) => {
	try {

		let deletedata  = "delete from match_schedule_controllers WHERE match_schedule_id = "+req.body.match_schedule_id+"";
		await db.query(deletedata);


		const bodyData = { ...req.body };
		const {
			id,
			subscriber_id,
			match_schedule_id,
			full_name,
			email_id,
			mobile_no,
			description,
		} = bodyData;
		console.log('Update DATA :: ', bodyData);

		let result = [];
		if (subscriber_id[0].length > 1) {

			const subscriber_id_length = subscriber_id.length;
			for (var i = 0; i < subscriber_id_length; i++) {

				var accesscode = Math.floor(100000 + Math.random() * 900000);
				var queryStr = `UPDATE match_schedule_controllers SET subscriber_id = '${subscriber_id[i]}', match_schedule_id='${match_schedule_id[i]}', full_name='${full_name[i]}', email_id='${email_id[i]}', mobile_number='${mobile_number[i]}', description='${description[i]}', accesscode='${accesscode}', updated_at=now() WHERE id = '${id[i]}' RETURNING id, email_id, accesscode`;
				
				console.log('queryStr ------>> \n', queryStr);

				var data = await db.query(queryStr);

				let id = data.rows[0].id;
				let email = data.rows[0].email_id;

				result.push({
					"id": id,
					"email": email,
					"accesscode": accesscode
				});
				console.log("--------------------------\n", result)
			}
			return result

		} else {
			let accesscode = Math.floor(100000 + Math.random() * 900000);
			let queryStr = `UPDATE match_schedule_controllers SET subscriber_id = '${subscriber_id}',match_schedule_id = '${match_schedule_id}',full_name = '${full_name}', email_id = '${email_id}', mobile_number = '${mobile_number}', description = '${description}', accesscode = '${accesscode}',updated_at = now() WHERE id = '${id}' RETURNING id, email_id, accesscode`;
			
			console.log('queryStr  ----->>>>\n', queryStr);

			let data = await db.query(queryStr);

			let id = data.rows[0].id;
			let email = data.rows[0].email_id;

			result.push({
				"id": id,
				"email": email,
				"accesscode": accesscode
			});

			console.log('data............\n', result.rows);
			return result
		}
	} catch (err) {
		console.log(err)
		return false
	}
}

const insertteam = async (req, res) => {
	try {


		let teamdata = "select id from match_schedule_team where status = 1 and "+req.body.team_1+" = "+req.body.team_2+"";

		console.log('teamdata.............')
		console.log(teamdata)

		let teaminfo = await db.query(teamdata);

		teaminfo = (teaminfo.rowCount);

		console.log('teaminfo.................');

		console.log(teaminfo);

		if(teaminfo >0){

			var msg = "-99";  

			return msg;
		}

		let matchdata = "select id from match_schedule_team where status = 1 and team_1 = "+ req.body.team_1 +" and team_2 = "+req.body.team_2+"";

		console.log('teamdata.............')
		console.log(matchdata)

		let tmatchdatainfo = await db.query(matchdata);

		tmatchdatainfo = (tmatchdatainfo.rowCount);

		if(tmatchdatainfo >0){

			var msg = "-100";  

			return msg;
		}








		let strquery = "INSERT into match_schedule_team(team_1,team_2,type,match_schedule_id,status,created_at) values('" + req.body.team_1 + "','" + req.body.team_2 + "','" + req.body.type + "'," + req.body.match_schedule_id + ",1,now())";

		console.log(strquery);

		await db.query(strquery);

		return true
	}
	catch (err) {
		console.log(err);
		return false
	}
}


const updatematchteam = async (req, res) => {
	try {


		
       

       let teamdata = "select id from match_schedule_team where status = 1 and "+req.body.team_1+" = "+req.body.team_2+"";

		console.log('teamdata.............')
		console.log(teamdata)

		let teaminfo = await db.query(teamdata);

		teaminfo = (teaminfo.rowCount);

		if(teaminfo >0){

			var msg = "-99";  

			return msg;
		}

		let matchdata = "select id from match_schedule_team where status = 1 and team_1 = "+ req.body.team_1 +" and team_2 = "+req.body.team_2+"";

		console.log('teamdata.............')
		console.log(matchdata)

		let tmatchdatainfo = await db.query(matchdata);

		tmatchdatainfo = (tmatchdatainfo.rowCount);

		if(tmatchdatainfo >0){

			var msg = "-100";  

			return msg;
		}


console.log('req.body.id..........');
console.log(req.body.id);

	if(req.body.id!== 'undefined' && req.body.id!== 'null'){

		let team_1 = "";
        if (req.body.team_1) {
            team_1 = `team_1 = ${req.body.team_1},`
        }
        let team_2 = "";
        if (req.body.team_2) {
            team_2 = `team_1 = ${req.body.team_2},`
        }
      let type =" ";
        if (req.body.type) {
            type = `team_1 = ${req.body.type},`
        }
       
       let match_schedule_id =""
        if (req.body.match_schedule_id) {
            match_schedule_id = `team_1 = ${req.body.match_schedule_id},`
        }
        

		let strquery = `update match_schedule_team set SET ${team_1}, ${team_2} ,${team_2}, ${match_schedule_id} ,updated_at = now() WHERE id= ${req.body.id} `; 

		console.log(strquery);

		await db.query(strquery);
	}
	else{

		let strquery = "INSERT into match_schedule_team(team_1,team_2,type,match_schedule_id,status,created_at) values('" + req.body.team_1 + "','" + req.body.team_2 + "','" + req.body.type + "'," + req.body.match_schedule_id + ",1,now())";

		console.log(strquery);

		await db.query(strquery);
	}

		return true
	}
	catch (err) {
		console.log(err);
		return false
	}
}



const insertparticipant = async (req, res) => {
	try {

		for (var i = 0; i < req.body.participant.length; i++) {
			let strquery = "INSERT into match_schedule_participant(participant,match_schedule_id,status,created_at) values('" + req.body.participant[i] + "'," + req.body.match_schedule_id + ",1,now())";

			await db.query(strquery);
		}



		return true
	}
	catch (err) {
		console.log(err);
		return false
	}
}

// update participant

const updateParticipant = async(req, res)=>{
	try{
		const bodyData = {...req.body};
		const {
			id,
			participant,
			match_schedule_id,
		} = bodyData;

		let queryStr = `UPDATE match_schedule_participant SET participant='${participant}', match_schedule_id='${match_schedule_id}', updated_at=now() WHERE id=${id}`
		console.log('QUERYSTR ::', queryStr);

		await db.query(queryStr);
		return true
	}catch(err){
		console.log(err)
		return false
	}
}

const champlist = async (req, res) => {
	let result = [];
	try {
		const current = new Date();
		const date = `${current.getFullYear()}-${current.getMonth() + 1}-${current.getDate()}`;



		let listStr = "SELECT id,olympic_name FROM olympic WHERE status = 1 and DATE(olympic_end_date) >= '" + date + "' ORDER BY id desc";

		console.log(listStr)

		let dataResult = await db.query(listStr);
		result = dataResult.rows;


	} catch (err) {
		console.log(err);
		result = [];
	}
	return result;
}

const tournamentlist = async (req, res) => {
	let result = [];
	try {
		const current = new Date();
		const date = `${current.getFullYear()}-${current.getMonth() + 1}-${current.getDate()}`;

		if (req.body.champ_id) {


			let listStr = "SELECT id,tournament_name FROM tournament WHERE olympics_sports =" + req.body.champ_id + " and status = 1 and DATE(tournament_end_date) >= '" + date + "' ORDER BY id desc";
			console.log(listStr)
			let dataResult = await db.query(listStr);
			result = dataResult.rows;

		} else {


			let listStrone = "SELECT id, tournament_name FROM tournament WHERE olympics_sports is null and DATE(tournament_end_date) >= '" + date + "'";
			console.log(listStrone)
			let dataResultone = await db.query(listStrone);

			result = dataResultone.rows


		}



	} catch (err) {
		console.log(err);
		result = [];
	}
	return result;
}

const eventlist = async (req, res) => {
	let result = {};
	try {

		const current = new Date();
		const date = `${current.getFullYear()}-${current.getMonth() + 1}-${current.getDate()}`;

		let listStr = "SELECT e.*,s.sports_name FROM event as e left join sports as s on s.id = e.sports_id WHERE DATE(event_end_date) >= '" + date + "' and tournament_id =" + req.body.tournament_id + " and e.status = 1 ORDER BY id desc";

		console.log("listStr.....");
		console.log(listStr);
		let dataResult = await db.query(listStr);
		result = dataResult.rows;
	} catch (err) {
		console.log(err);
		result = {};
	}
	return result;
}

const playarealist = async (req, res) => {
	let result = {};
	try {
		let listStr = "SELECT va.*,vs.surface as surface_type_name ,v.venue_name FROM venue_asset as va left join venue_surface as vs on vs.id = va.surface_type left join venue as v on v.id = va.venue_id WHERE sports_id:: jsonb ? '" + req.body.sport_id + "' and va.status = 1 ORDER BY id desc";

		// Select * from venue_asset where sports_id::jsonb ? '2'

		console.log("listStr.....");
		console.log(listStr);
		let dataResult = await db.query(listStr);
		result = dataResult.rows;
	} catch (err) {
		console.log(err);
		result = {};
	}
	return result;
}


const playerslist = async (req, res) => {
	let result = {};

	let resultt = {};
	try {




		let listStr = "SELECT id,player_name as team_name FROM registration_single_player WHERE event_id:: varchar in ('" + req.body.event_id + "') and status = 1 ORDER BY id desc";

		console.log("listStr.....");
		console.log(listStr);


		let dataResult = await db.query(listStr);
		result = dataResult.rows;



		  matchstr = req.body.statusStr = "lege" ; 
          matchstrw = req.body.qualification_status = 3   ; 

   if (req.body.structure === "Knockout" || req.body.match_structure_id === 3) {
  let qualificationdata = `SELECT team_name, id FROM registration WHERE event_id::int = ${req.body.event_id} AND status = 1 AND qualification_status = '1' ORDER BY id DESC`;

  console.log('qualificationdata..........');
  console.log(qualificationdata);

  dataResultone = await db.query(qualificationdata);
} else {
  let listStrone = `SELECT team_name, id FROM registration WHERE event_id::int = ${req.body.event_id} AND status = 1 ORDER BY id DESC`;

  console.log("listStr.....");
  console.log(listStrone);

  dataResultone = await db.query(listStrone); 
}

resultt = dataResultone.rows;



	} catch (err) {
		console.log(err);
		result = {};
	}

	if (result.length > 0) { 
		return result;
	}
	else {
		return resultt;

	}
}

const matchstructurelist = async (req, res) => {
	let result = {};
	try {
		let listStr = "SELECT * FROM match_structure_master ORDER BY id desc";

		console.log("listStr.....");
		console.log(listStr);
		let dataResult = await db.query(listStr);
		result = dataResult.rows;
	} catch (err) {
		console.log(err);
		result = {};
	}
	return result;
}

const surfacetypelist = async (req, res) => {
	let result = {};
	try {
		let listStr = "SELECT * FROM venue_asset WHERE venue_id = "+req.query.id+" and status = 1 ORDER BY id desc";

		console.log("listStr.....");
		console.log(listStr);
		let dataResult = await db.query(listStr);
		result = dataResult.rows;
	} catch (err) {
		console.log(err);
		result = {};
	}
	return result;
}


const list = async (req, res) => {
	let result = {}
	try {
		const current = new Date();
    	const cdate = `${current.getFullYear()}-${current.getMonth()+1}-${current.getDate()}`;

		let event_id = ''
		if (req.query.event_id && typeof req.query.event_id !== undefined) {
			event_id = "and ms.event_id = " + req.query.event_id + "";
		}
		let tournament_id = ''
		if (req.query.tournament_id && typeof req.query.tournament_id !== undefined) {
			tournament_id = "and ms.tournament_id = " + req.query.tournament_id + "";
		}
		let date = '';
		if (req.query.to_date && req.query.from_date && typeof req.query.to_date !== undefined && typeof req.query.from_date !== undefined) {
			date = "and ms.date >='" + req.query.from_date + "' and ms.date < '" + req.query.to_date + "'";
		}
		let sport = ''
		if (req.query.sport && typeof req.query.sport !== undefined) {
			sport = "and ms.sport = " + req.query.sport + "";
		}

		let to_date = ''
		if (req.query.to_date && typeof req.query.to_date !== undefined) {
			to_date = "and ms.date < '"+cdate+"' ";
		}

		let from_date = ''
		if (req.query.from_date && typeof req.query.from_date !== undefined) {
			from_date = "and ms.date > '"+cdate+"' ";
		}

		
		//let master = "SELECT ms.*,s.sports_name,e.event_name,TO_CHAR(date,'DD-MM-YYYY') as newdate FROM match_schedule as ms left join sports as s on s.id = ms.sport left join event as e on e.id  = ms.event_id WHERE ms.status = 1"+event_id+tournament_id+date+sport; 

		let master = "SELECT ms.*,s.sports_name,e.event_name,e.venue_id,TO_CHAR(date,'DD-MM-YYYY') as newdate FROM match_schedule as ms left join sports as s on s.id = ms.sport left join event as e on e.id  = ms.event_id WHERE ms.status = 1" + event_id + tournament_id + date + sport +to_date+ "ORDER BY id desc";


		console.log(master);
		master = await db.query(master);

		result = master.rows;

		console.log(result);

		if (result && result !== undefined && result !== "") {

			for (var i = 0; i < result.length; i++) {



				let mschedulecontrollers = "SELECT * FROM match_schedule_controllers WHERE status = 1 and match_schedule_id = " + result[i].id + "";

				mschedulecontrollers = await db.query(mschedulecontrollers)
				mschedulecontrollers = mschedulecontrollers.rows;
				result[i]['schedule_controllers'] = mschedulecontrollers



				let scheduleofficials = "SELECT * FROM match_schedule_officials WHERE status = 1 and match_schedule_id = " + result[i].id + "";

				scheduleofficials = await db.query(scheduleofficials);

				scheduleofficials = scheduleofficials.rows;

				result[i]['schedule_officials'] = scheduleofficials




				//let scheduleteam = "SELECT * FROM match_schedule_team WHERE status = 1 and match_schedule_id = "+result[i].id+"";

				let scheduleteam = "select mst.* ,rg.team_name as teamtwo,r.team_name as teamone ,sr.player_name as single_playerone,srg.player_name as single_playertwo from match_schedule_team as mst left join registration as r on r.id = mst.team_1 left join registration as rg on rg.id = mst.team_2 left join registration_single_player as sr on sr.id = mst.team_1 left join registration_single_player as srg on srg.id = mst.team_2 WHERE mst.status = 1 and match_schedule_id = " + result[i].id + "";


				console.log('scheduleteam..........');
				console.log(scheduleteam);

				scheduleteam = await db.query(scheduleteam);

				scheduleteam = scheduleteam.rows;

				result[i]['schedule_team'] = scheduleteam



				let scheduleparticipant = "SELECT msp.*,sr.player_name FROM match_schedule_participant as msp left join registration_single_player as sr on sr.id= msp.participant WHERE msp.status = 1 and match_schedule_id = " + result[i].id + "";


				console.log('scheduleparticipant..........'); 
				console.log(scheduleparticipant);

				scheduleparticipant = await db.query(scheduleparticipant);

				scheduleparticipant = scheduleparticipant.rows;

				result[i]['schedule_participant'] = scheduleparticipant


				let sportpoit = "select label from sports_point WHERE id in (" + result[i].sports_point + ")";

				console.log('sportpoit..........');
				console.log(sportpoit);
				let sportpointdata = await db.query(sportpoit);

				sportpointdata = sportpointdata.rows;

				result[i]['sport_point'] = sportpointdata;






			}

		}

		return result;




	}
	catch (err) {

		console.log(err);
		return false;

	}
}


const edit = async (req, res) => {
	let result = {}
	try {


		//let master = "SELECT ms.*,s.sports_name,e.event_name,TO_CHAR(date,'DD-MM-YYYY') as newdate FROM match_schedule as ms left join sports as s on s.id = ms.sport left join event as e on e.id  = ms.event_id WHERE ms.status = 1"+event_id+tournament_id+date+sport;  

		let master = "SELECT ms.*,s.sports_name,e.event_name,e.venue_id,TO_CHAR(date,'DD-MM-YYYY') as newdate FROM match_schedule as ms left join sports as s on s.id = ms.sport left join event as e on e.id  = ms.event_id WHERE ms.status = 1 and ms.id =" + req.body.id + "";


		console.log(master);
		master = await db.query(master);

		result = master.rows;

		console.log(result);

		if (result && result !== undefined && result !== "") {

			for (var i = 0; i < result.length; i++) {



				let mschedulecontrollers = "SELECT * FROM match_schedule_controllers WHERE status = 1 and match_schedule_id = " + result[i].id + "";

				mschedulecontrollers = await db.query(mschedulecontrollers)
				mschedulecontrollers = mschedulecontrollers.rows;
				result[i]['schedule_controllers'] = mschedulecontrollers



				let scheduleofficials = "SELECT * FROM match_schedule_officials WHERE status = 1 and match_schedule_id = " + result[i].id + "";

				scheduleofficials = await db.query(scheduleofficials);

				scheduleofficials = scheduleofficials.rows;

				result[i]['schedule_officials'] = scheduleofficials




				//let scheduleteam = "SELECT * FROM match_schedule_team WHERE status = 1 and match_schedule_id = "+result[i].id+"";

				let scheduleteam = "select mst.* ,rg.team_name as teamtwo,r.team_name as teamone ,sr.player_name as single_playerone,srg.player_name as single_playertwo from match_schedule_team as mst left join registration as r on r.id = mst.team_1 left join registration as rg on rg.id = mst.team_2 left join registration_single_player as sr on sr.id = mst.team_1 left join registration_single_player as srg on srg.id = mst.team_2 WHERE mst.status = 1 and match_schedule_id = " + result[i].id + "";


				console.log('scheduleteam..........');
				console.log(scheduleteam);

				scheduleteam = await db.query(scheduleteam);

				scheduleteam = scheduleteam.rows;

				result[i]['schedule_team'] = scheduleteam



				let scheduleparticipant = "SELECT * FROM match_schedule_participant WHERE status = 1 and match_schedule_id = " + result[i].id + "";


				console.log('scheduleparticipant..........');
				console.log(scheduleparticipant);

				scheduleparticipant = await db.query(scheduleparticipant);

				scheduleparticipant = scheduleparticipant.rows;

				result[i]['schedule_participant'] = scheduleparticipant


				let sportpoit = "select label from sports_point WHERE id in (" + result[i].sports_point + ")";

				console.log('sportpoit..........');
				console.log(sportpoit);
				let sportpointdata = await db.query(sportpoit);

				sportpointdata = sportpointdata.rows;

				result[i]['sport_point'] = sportpointdata;






			}

		}

		return result;




	}
	catch (err) {

		console.log(err);
		return false;

	}
}


const insertpool = async (req, res) => {
	try {




    	if (typeof req.body.structure === 'undefined') {
    		req.body.structure = null;
		}

	console.log('req.body.structure...........');
	console.log(req.body.structure);
		
		let eventdata = "delete from match_schedule_pool WHERE event_id = " + req.body.event_id + "";

		console.log(eventdata);

		let eventidinfo = await db.query(eventdata);

		let scordata = "delete from match_team_score WHERE event_id = " + req.body.event_id + "";

		console.log(scordata);

		console.log(scordata);

		let scordatainfo = await db.query(scordata);

		

		let deletedata = "SELECT id FROM match_schedule WHERE event_id = " + req.body.event_id;
console.log("deletedata.........");
console.log(deletedata);
let deletedatanfo = await db.query(deletedata);
console.log('deletedatanfo.rows00000000000000000000000000000000000000000');

console.log(deletedatanfo.rows);

console.log('deletedatanfo.rows[0].id,.....................');
  //console.log(deletedatanfo.rows[0].id); 

if (deletedatanfo.rows.length > 0) {
  console.log('deletedatanfo.rows[0].id,.....................');
  console.log(deletedatanfo.rows[0].id); 


         let match_controllers = "delete from match_schedule_controllers WHERE match_schedule_id = "+deletedatanfo.rows[0].id+"";

         await db.query(match_controllers);

         let match_officials = "delete from match_schedule_officials WHERE match_schedule_id = "+deletedatanfo.rows[0].id+"";

         await db.query(match_officials);


         let match_participant = "delete from match_schedule_participant WHERE match_schedule_id = "+deletedatanfo.rows[0].id+"";

         await db.query(match_participant);

         let match_team = "delete from match_schedule_team WHERE match_schedule_id = "+deletedatanfo.rows[0].id+"";

         await db.query(match_team); 

} 
let match = "delete from match_schedule WHERE event_id = " + req.body.event_id + "";  

		console.log(match);

		let matchinfo = await db.query(match);



		for (var j of req.body.pool) {


		var teamdata = "SELECT *FROM match_schedule_pool WHERE EXISTS (SELECT 1 FROM unnest(ARRAY["+j.team+"]) AS value  WHERE ',' || team || ',' LIKE '%,' || value || ',%') and event_id ="+req.body.event_id+"";

		console.log("teamdata,,,,,,,,............................"); 
		console.log(teamdata);

		let teamdatainfo = await db.query(teamdata); 
		console.log('teamdatainfo.rowCount000000000000')
		console.log(teamdatainfo.rowCount)


		if(teamdatainfo.rowCount >0){

			console.log('errrrrrrrrrrrrrrrrrrrrr')
			var msg = "-99"
			return msg; 

		}
		

	}


		
		for (var i of req.body.pool) {


			if (i.team == '' && i.team == undefined) {

				i.team = 0;

			}

			if (i.participant == '' || i.participant == undefined) {

				i.participant = 0;
			} 

			var strquery = "INSERT into match_schedule_pool(group_name,event_id,match_structure_id,structure,no_of_pool,no_of_team,team,participant,status,no_column,sports_point,created_at) values('" + i.group + "'," + req.body.event_id + "," + req.body.match_structure_id + ",'"+req.body.structure+"'," + req.body.no_of_pool + "," + req.body.no_of_team + ",'" + i.team + "','" + i.participant + "',1," + req.body.no_column + ",'" +req.body.sports_point + "',now())RETURNING id"; 

			console.log(strquery)

			strquery = await db.query(strquery);

			var id = strquery.rows[0].id;

			// value = i.team;
			// items = value.split(",");
			//const count = items.length;
			//console.log(count);

    

// for (var j = 0; j < count; j++) {
//  console.log('ji.team....................');
// 	console.log(i.team)
	

// 			var scorestrquery = "INSERT into match_team_score(pool_id,event_id,team_id,sport_point,score,status,created_at) values('" + id + "'," + req.body.event_id + ",'" + i.team + "','" + j.sport_point + "',0,1,now())"; 

			

// 			console.log('scorestrquery.................') ; 

// 			console.log(scorestrquery);


// 			await db.query(scorestrquery); 
// }

 team = '';

var teamArray = i.team.split(",");
var sportpointArray = req.body.sports_point.split(","); 

for (var j = 0; j < teamArray.length; j++) { 
  var team = teamArray[j];
  //var sport_point = sportpointArray[j]


  for (var i = 0; i < sportpointArray.length; i++) {
  	
  var sport_point = sportpointArray[i]

  var scorestrquery = "INSERT into match_team_score(pool_id,event_id,team_id,sport_point,score,status,created_at) values('" + id + "'," + req.body.event_id + ",'" + team + "','" + sport_point + "',0,1,now())"; 

  console.log('scorestrquery.................'); 
  console.log(scorestrquery);

  await db.query(scorestrquery); 
}
}




}
		
		// }

		return true 
	}
	catch (err) {
		console.log(err);
		return false
	}
}


const dailymatchlist = async (req, res) => {
	let result = {};
	try {

		const current = new Date();
		const date = `${current.getFullYear()}-${current.getMonth() + 1}-${current.getDate()}`;

		let listStr = "SELECT * FROM match_schedule WHERE status = 1 and date = '" + date + "' ORDER BY id desc";

		console.log("listStr.....");
		console.log(listStr);
		let dataResult = await db.query(listStr);

		result = dataResult.rows;
		return true;
	} catch (err) {
		console.log(err);
		result = {};
		return false;
	}
	return result;
}


const deletedata = async (req, res) => {
	try {

		let result = {};
		let id = req.body.id;



		let deletemaster = "update match_schedule set status = 2 WHERE id = " + id + "";
		await db.query(deletemaster);

		let deletecontrollers = "update match_schedule_controllers set status = 2 WHERE match_schedule_id = " + id + "";
		await db.query(deletecontrollers);

		let deleteofficials = "update match_schedule_officials set status = 2 WHERE match_schedule_id = " + id + "";
		await db.query(deleteofficials);

		let deleteparticipant = "update match_schedule_participant set status = 2 WHERE match_schedule_id = " + id + "";
		await db.query(deleteparticipant);

		let deleteteam = "update match_schedule_team set status = 2 WHERE match_schedule_id = " + id + "";
		await db.query(deleteteam);




		return true;

	}
	catch (err) {

		console.log(err);

		return false;
	}
}


const poollist = async (req, res) => {
	let result = {};
	try {

		let listStr = "SELECT * FROM match_schedule_pool WHERE status = 1 and event_id = " + req.body.event_id + " ORDER BY id asc";

		console.log("listStr.....");
		console.log(listStr);
		let dataResult = await db.query(listStr);

		result = dataResult.rows;

		for (var i = 0; i < result.length; i++) {

			let teamda = "SELECT team_name,id from registration WHERE id in (" + result[i].team + ")";
			let dataResult = await db.query(teamda);

			dataResult = dataResult.rows
			result[i].team_name = dataResult



			let participantdata = "SELECT player_name as team_name ,id from registration_single_player WHERE id in (" + result[i].participant + ")";

			console.log('teamda')
			console.log(participantdata)

			let pdataResult = await db.query(participantdata);

			pdataResult = pdataResult.rows

			result[i].participant_name = pdataResult



		}


		console.log(result);
		//return result;
	} catch (err) {
		console.log(err);
		result = {};
		return false;
	}
	return result;
}

const teampoollist = async (req, res) => {
	let result = {};
	try {

		if (req.body.type == 'team') {

			let listStr = "SELECT team FROM match_schedule_pool WHERE status = 1 and id = " + req.body.id + " ORDER BY id desc";
			console.log(listStr)
			let dataResult = await db.query(listStr);

			result = dataResult.rows;

			for (var i = 0; i < result.length; i++) {

				console.log('result[0].team')
				console.log(result[i].team)

				let teamda = "SELECT team_name,id from registration WHERE id in (" + result[i].team + ")";

				console.log('teamda')
				console.log(teamda)

				let dataResult = await db.query(teamda);

				dataResult = dataResult.rows

				result[i].team_name = dataResult

			}
		}
		if (req.body.type == "participant") {

			let listStr = "SELECT participant FROM match_schedule_pool WHERE status = 1 and id = " + req.body.id + " ORDER BY id desc";
			let dataResult = await db.query(listStr);

			result = dataResult.rows;

			for (var i = 0; i < result.length; i++) {

				console.log('result[0].team')
				console.log(result[i].participant)

				let teamda = "SELECT player_name as team_name ,id from registration_single_player WHERE id in (" + result[i].participant + ")";

				console.log('teamda')
				console.log(teamda)

				let dataResult = await db.query(teamda);

				dataResult = dataResult.rows

				result[i].team_name = dataResult

			}
		}

		console.log("listStr.....");



		console.log(result);
		//return result;
	} catch (err) {
		console.log(err);

		//result = {};
		return false;
	}
	return result;
}

// .....................................................    sports point       ................................................................ //

const insertsportpoints = async (req, res) => {
	try {

		let strquery = "INSERT into sports_point(short_form,label,status,created_at) values('" + req.body.short_form + "','" + req.body.label + "',1,now())";
       console.log("strquery")
		console.log(strquery)

		await db.query(strquery);
		
		return true
	}

	catch (err) {
		console.log(err);
		return false
	}

}


const sportpointlist = async (req, res) => {

	let result = {};
	try {

		//let sportlist = "SELECT sp.*,s.sports_name from sports_point as sp left join sports as s on s.id  =  sp.sport_id WHERE sp.status = 1";
		let sportlist = "SELECT * from sports_point WHERE status = 1 and id !=99999999"; 

		let strlist = await db.query(sportlist);
		result = strlist.rows;

		return result;

	}
	catch (err) {
		console.log(err);
		return false;
	}
}

const sportpointedit = async (req, res) => {

	let result = {};
	try {

		let sportlist = "SELECT sp.*,s.sports_name from sports_point as sp left join sports as s on s.id = sp.sport_id WHERE sp.status = 1 and sp.sport_id = " + req.body.sport_id + "";

		console.log(sportlist)

		let strlist = await db.query(sportlist);
		result = strlist.rows;

		console.log(result)
		return result;
		//return true

	}
	catch (err) {
		console.log(err);
		return false;
	}
}

const updatesportpoints = async (req, res) => {
	try {

		let strquery = "update sports_point set short_form = '" + req.body.short_form + "',label = '" + req.body.label + "',updated_at = now() WHERE id = " + req.body.id + "";

		console.log(strquery);

		await db.query(strquery);
		return true
	}

	catch (err) {
		console.log(err);
		return false
	}

}

const deletesportpoints = async (req, res) => {
	try {

		let strquery = "update sports_point set status = 2 WHERE id = " + req.body.id + "";

		await db.query(strquery);
		return true
	}

	catch (err) {
		console.log(err);
		return false
	}

}


const teamlist = async (req, res) => {

	let result = {};
	let player_list=[];

	try {

		let temlist = "SELECT r.*,e.event_name,e.event_start_date,e.event_end_date,e.event_type_id,s.sports_name,t.tournament_name from registration as r left join event as e on e.id  =  r.event_id:: int  left join sports as s on s.id = e.sports_id left join tournament as t on t.id  = r.tournament_id:: int WHERE r.status = 1 and r.id = " + req.body.id + "";

		console.log("temlist")	
		console.log(temlist)
		let teamlist = await db.query(temlist); 
		result = teamlist.rows;


		for (var i = 0; i < result.length; i++) {


			let playerlist = "SELECT * from registration_player WHERE team_id =" + result[i].id +" ORDER by id desc";

			let list = await db.query(playerlist);

			list = list.rows;

			result[i]['player_list'] = list



		}

		return result;

	}
	catch (err) {
		console.log(err);
		return false;
	}
}


const updateteam = async (req, res) => {
	try {

		let result = {};

		let register_name = "";
		if (req.body.register_name) {
			register_name = `register_name = '${req.body.register_name}',`
		}

		let register_email = "";
		if (req.body.register_email) {
			register_email = `register_email = '${req.body.register_email}',`
		}

		let register_mobile = "";
		if (req.body.register_mobile) {
			register_mobile = `register_mobile = '${req.body.register_mobile}',`
		}

		let team_name = "";
		if (req.body.team_name) {
			team_name = `team_name = '${req.body.team_name}'`
		}

		// result.register_name = req.body.register_name
		// result.register_email = req.body.register_email 
		// result.register_mobile = req.body.register_mobile 
		// result.team_name = req.body.team_name

		// console.log(result);


		let strquery = `update registration set ${register_name} ${register_email} ${register_mobile} ${team_name}  WHERE id = ${req.body.id}`; 
		console.log(strquery)

		await db.query(strquery);
		return true
	}

	catch (err) {
		console.log(err);
		return false
	}
}


const teamplayer = async (req, res) => {
const result =[];
	try {
		let now = moment();



		var profile_img = null;

		console.log('req.body.team_id');

		console.log(req.body.team_id);

		if (!req.files== null) {
			var element = req.files.profile_img;
			var image_name = now.format("YYYYMMDDHHmmss") + element.name;
			element.mv('./public/images/' + image_name);
			profile_img = image_name;
		}


		var aadhar = null;

		if (!req.files== null) {
			var element = req.files.aadhar;
			var image_name = now.format("YYYYMMDDHHmmss") + element.name;  
			element.mv('./public/images/' + image_name);
			aadhar = image_name;
		}

		

		if (req.body.first_name == undefined || req.body.first_name == "") { 

			req.body.first_name = null;
		}

		if (req.body.gender == undefined || req.body.gender == "") {

			req.body.gender = null;
		}

		if (req.body.dob == undefined || req.body.dob == "") {

			req.body.dob = null;
		}

		if (req.body.age == undefined || req.body.age == "") {

			req.body.age = null;
		}
		if (req.body.player_position == undefined || req.body.player_position == "") {

			req.body.player_position = null;
		}
		if (req.body.player_email == undefined || req.body.player_email == "") {

			req.body.player_email = null;
		}

		if (req.body.team_id == undefined || req.body.team_id == "") {

			req.body.team_id = null;
		}
			
       let tournament_name, coachname,subscriber_id ,event_id;
							
     	let maildata = "select r.tournament_id,r.subscriber_id,r.event_id,r.register_name,t.tournament_name from registration as r left join tournament as t on t.id = r.tournament_id WHERE r.id = "+req.body.team_id+"";

     	maildata = await db.query(maildata); 
       	maildata=  maildata.rows;

       	if (maildata && maildata.length > 0) {
        console.log('maildata: ', maildata);

         tournament_name = maildata[0].tournament_name;
         coachname = maildata[0].register_name;
         subscriber_id = maildata[0].subscriber_id;
         event_id = maildata[0].event_id;
        
        console.log('tournament_name: ', tournament_name);
        console.log('coachname: ', coachname);

        // Continue with your logic using tournament_name and coachname
    } else {
        tournament_name = null;
        coachname = null;
    }


		console.log('req.body.first_name ------------------        -----------------------------------..............');
		console.log(req.body.player_name.length);

		if(req.body.player_name[0].length == 1) {


			console.log('req.body.team_id..............');  
			console.log(req.body.team_id);


			let checkuniq = "SELECT DISTINCT player_email from registration_player WHERE player_email = '"+req.body.player_email+"' and team_id = "+req.body.team_id+" ";

			console.log('checkuniqcheckuniqcheckuniqcheckuniqcheckuniqreq.body.team_id..............');  
			console.log(checkuniq);
			let chekinfo  = await db.query(checkuniq);

			chekinfo = chekinfo.rows;

			if(chekinfo.length > 0){
				let msg   = chekinfo;

				console.log(msg);
				return  msg;
			}


			let inserteampalyer = "insert into registration_player(team_id,player_name,player_last_name,player_mobile,parent_mobile,parent_email,gender,dob,age,aadhar,player_position,profile_img,player_email,jersey_no) values("+req.body.team_id+",'" + req.body.player_name+ "','"+req.body.player_last_name+"',"+req.body.player_mobile+","+req.body.parent_mobile+",'"+req.body.parent_email+"'," + req.body.gender+ ",'" + req.body.dob+ "'," + req.body.age+ ",'" + aadhar + "','"+ req.body.player_position+"','" + profile_img + "','"+req.body.player_email+"',"+req.body.jersey_no+")RETURNING player_email ";
				
				console.log("inserteampalyerk44444444444444444444444444444");  
				console.log(inserteampalyer);
				var data = await db.query(inserteampalyer);

				let email = data.rows[0].player_email;
				
				result.push({
					
					"email": email,
					"tournament_name":tournament_name,
					"coachname":coachname,
					"subscriber_id":subscriber_id,
					"event_id" :event_id

					});
				console.log("--------------------------")  
				console.log(result);

				return result;
		}
		

		if(req.body.player_name.length > 1) {

			for (var i = 0; i < req.body.player_name.length; i++) { 

				

			//if (!existingEmails.includes(req.body.player_email)){

					//console.log("req.files")

				//console.log(req.files)

				//console.log('req.files.profile_img[i]') 

				//console.log(req.files.profile_img[i])
				if (!req.files == null) {
					var element = req.files.profile_img[i];
					var image_name = now.format("YYYYMMDDHHmmss") + element.name;
					element.mv('./public/images/' + image_name);
					var profile_img = image_name;
				}
				else{
					var profile_img = null;
				}

				

				if (!req.files == null) {
					var element = req.files.aadhar[i];
					var image_name = now.format("YYYYMMDDHHmmss") + element.name;
					element.mv('./public/images/' + image_name);
					var aadhar = image_name;
				}
				else{
					var aadhar = null;
				}

			let checkuniqmul = "SELECT DISTINCT player_email from registration_player WHERE player_email = '"+req.body.player_email[i]+"' and team_id = "+req.body.team_id+" ";

			console.log('checkuniqcheckuniqcheckuniqcheckuniqcheckuniqreq.body.team_id4444444444444444444..............');  
			console.log(checkuniqmul);
			let chekinfomul  = await db.query(checkuniqmul);

			chekinfomul = chekinfomul.rows;

console.log('555555555555555555555555.body.team_id4444444444444444444..............');  
			console.log(chekinfomul.length);


			if(chekinfomul.length > 0){
				let msg   = chekinfomul
				return  msg;
			}



				let inserteampalyer = "insert into registration_player(team_id,player_name,player_last_name,player_mobile,parent_mobile,parent_email,gender,dob,age,aadhar,player_position,profile_img,jersey_no,player_email) values(" + req.body.team_id + ",'" + req.body.player_name[i] + "','"+req.body.player_last_name[i]+"',"+req.body.player_mobile[i]+","+req.body.parent_mobile[i]+",'"+req.body.parent_email[i]+"'," + req.body.gender[i] + ",'" + req.body.dob[i] + "'," + req.body.age[i] + ",'" + aadhar + "','"+ req.body.player_position[i] +"','" + profile_img + "',"+req.body.jersey_no[i]+",'" + req.body.player_email[i] + "')RETURNING player_email"; 


				
				console.log("inserteampalyer............"); 
				console.log(inserteampalyer);
				var data = await db.query(inserteampalyer);

				let email = data.rows[0].player_email; 

				
				result.push({
					
					"email": email,
					"tournament_name":tournament_name,
					"coachname":coachname,
					"subscriber_id":subscriber_id,
					"event_id" :event_id
					

				});
				console.log("--------------------------") 
				console.log(result); 
			
	}
			return result;
		
		
	}


		
	}
	catch (err) {

		console.log(err);

		return false;

	}

}


const matchstatuslist = async (req, res) => {

	let result = {};
	try {

		console.log('hffffffffffff');

		let list = "SELECT id,trim(status) as status from match_status ORDER by id asc";

		console.log(list);

		let strlist = await db.query(list);
		result = strlist.rows;

		return result;

	}
	catch (err) {
		console.log(err);
		return false;
	}
}




         //---------------------------------------------------------- position ----------------------------------------------------

const insertposition = async (req, res) => {  
	try {

		let strquery = "INSERT into match_position(match_position,label,status,created_at) values('" + req.body.position + "','" + req.body.label + "',1,now())";

		await db.query(strquery);
		return true
	}

	catch (err) {
		console.log(err);
		return false
	}

}


const updateposition = async (req, res) => {  
	try {
    
		let strquery = "update match_position set match_position = '"+req.body.match_position+"',label = '"+req.body.label+"',updated_at = now() WHERE id = "+req.body.id+" ";

		await db.query(strquery);
		return true
	}

	catch (err) {
		console.log(err);
		return false
	}

}

const deleteposition = async (req, res) => {  
	try {
    
		let strquery = "update match_position set status = 2 WHERE id ="+req.body.id+"";

		await db.query(strquery);
		return true
	}

	catch (err) {
		console.log(err);
		return false
	}

}


const positionlist = async (req, res) => {

	let result = {};
	try {

		

		let list = "SELECT * from match_position WHERE status = 1";

		console.log(list);

		let strlist = await db.query(list);
		result = strlist.rows;

		return result;

	}
	catch (err) {
		console.log(err);
		return false;
	}
}


         //---------------------------------------------------------- Action ----------------------------------------------------

const insertAction = async (req, res) => {  
	try {

		let now = moment();

		let duplicateaction = "select action from match_action WHERE action = '"+req.body.action+"' and  status = 1";


		let rowdata = await db.query(duplicateaction);

		if(rowdata.rowCount > 0){
			let msg  = "-101";

			return msg;
		}

		if (req.files !== null && req.files.img !== undefined) {
			
			var element = req.files.img;
			var image_name = now.format("YYYYMMDDHHmmss") + element.name; 
			

			element.mv('./public/images/' + image_name); 
			var img = '/public/images/'+image_name;
		}else{
			var img = null;
		}

		let strquery = "INSERT into match_action(action,img,status,created_at) values('" + req.body.action + "','"+img+"',1,now())";
		console.log("strquery..........");
		console.log(strquery);

		await db.query(strquery);
		return true
	}

	catch (err) {
		console.log(err);
		return false
	}

}


const updateAction = async (req, res) => {  
	try {

		
let now = moment();
		
		var img = '';

		//req.files && req.files.length

		   console.log('req.files.img1111111111111111');
			//console.log( req.files.length)
		if (req.files) {
		
			console.log('req.files.img1111111111111111');
			console.log( req.files.img)
			var element = req.files.img;
			var image_name = now.format("YYYYMMDDHHmmss") + element.name;
			 element.mv('./public/images/' + image_name);
			 img = `img = '/public/images/${image_name}', `;
		}
 		
 		let action = "";
        if (req.body.action) {
            action = `action = '${req.body.action}',`
        }

        
		

    
		let strquery = "update match_action set "+action+""+img+"updated_at = now() WHERE id = "+req.body.id+" "; 
		console.log(strquery);

		await db.query(strquery);
		return true
	}

	catch (err) {
		console.log(err);
		return false
	}

}

const deleteAction = async (req, res) => {  
	try {
    
		let strquery = "update match_action set status = 2 WHERE id ="+req.body.id+"";

		await db.query(strquery);
		return true
	}

	catch (err) {
		console.log(err);
		return false
	}

}


const Actionlist = async (req, res) => {

	let result = {};
	try {

		

		let list = "SELECT * from match_action WHERE status = 1";

		console.log(list);

		let strlist = await db.query(list);
		result = strlist.rows;

		return result;

	}
	catch (err) {
		console.log(err);
		return false;
	}
}



const matchdateval = async(req,res)=>{
	try{

	    let checktime = "select time from match_schedule WHERE status = 1 and date = '"+req.body.date+"' and time = '"+req.body.time+"'"; 
console.log('checktime')
	    console.log(checktime)

		let timedata = await db.query(checktime);  

		console.log(timedata.rowCount);

		console.log("timedata...........");

		if(timedata.rowCount > 0){
			var msg = '-99';
 
			console.log(msg);
			return  msg;
		}
	}
	catch(err){
          return false;
	}		
}










module.exports = { edit,update,insert, tournamentlist, eventlist, playarealist, playerslist, insertofficials, surfacetypelist, insertcontrollers, insertteam, insertparticipant, list, champlist, matchstructurelist, insertpool, dailymatchlist, deletedata, poollist, teampoollist, updateofficials, insertsportpoints, sportpointlist, sportpointedit, updatesportpoints, deletesportpoints, teamlist, updateteam, teamplayer, updateParticipant ,matchstatuslist, updateController,updatematchteam,insertposition,updateposition,deleteposition,positionlist,matchdateval,insertAction,updateAction,deleteAction,Actionlist}  