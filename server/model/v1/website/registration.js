const axios = require('axios')
//const axios = require("axios");
const db = require('../../../db');
const helper = require('../../../helper/helper');
const moment = require('moment');
// axios.js


//import axios from 'axios';
//module.exports = axios;


const insert = async (req, res) => {
	const result = [];
	try {


		if (typeof(req.body.turnament_id) !== "undefined" && req.body.turnament_id !== '') {
			turnament_id = null;
		}
		if (typeof(req.body.total_amount) !== "undefined" && req.body.total_amount !== '') {
			total_amount = null;
		}
		if (typeof(req.body.isd_code) !== "undefined" && req.body.isd_code !== '') {
			isd_code = null;
		}
		if (typeof(req.body.registerd_by) !== "undefined" && req.body.registerd_by !== '') {
			registerd_by = null;
		}
		if (typeof(req.body.register_mobile) !== "undefined" && req.body.register_mobile !== '') {
			register_mobile = null;
		}

		

		const moment = require('moment');

		const addsStr = `INSERT INTO registration (register_last_name,tournament_id,champ_id,event_id,team_name,register_name,register_mobile,register_email,total_amount,isd_code,subscriber_id,status,registerd_by,created_at) VALUES('${req.body.register_last_name}',${req.body.tournament_id},${req.body.champ_id},'${req.body.event_id}','${req.body.team_name}','${req.body.register_name}',${req.body.register_mobile},'${req.body.register_email}',${req.body.total_amount},'${req.body.isd_code}',${req.body.subscriber_id},1,'${req.body.registerd_by}',now())RETURNING id`;
		console.log('addsStrooooooooooooooooooooooooooooo');
		console.log(addsStr);   

		const adddata = await db.query(addsStr);

		if (adddata.rowCount) {
		console.log('demo...........555555555555555555555');
		
			var register_id = adddata.rows[0].id;
			console.log(register_id);


			
							
     	let maildata = "select r.tournament_id,r.register_name,r.event_id,r.subscriber_id,t.tournament_name from registration as r left join tournament as t on t.id = r.tournament_id WHERE r.id = "+register_id+"";

     	console.log('maildata0000000:')
     	console.log(maildata)
        

     	maildata = await db.query(maildata)
       	maildata=  maildata.rows;
       	console.log('maildataooooooooooooooooooooooooooo'); 
       	console.log(maildata.length);

       	var tournament_name;
       	var coachname;
       	var subscriber_id;
       	var event_id;

       	if (maildata && maildata.length > 0) {
        

          tournament_name = maildata[0].tournament_name;
          coachname = maildata[0].register_name;
          subscriber_id = maildata[0].subscriber_id;
          event_id = maildata[0].event_id.trim();
          register_id = adddata.rows[0].id;
        console.log('tournament_name: ', tournament_name);
        console.log('coachname: ', coachname);

        // Continue with your logic using tournament_name and coachname
    } else {
         tournament_name = null;
         coachname = null;
         subscriber_id = null;
         event_id = null;
         register_id = null;
    }



			if (req.body.player_name && typeof req.body.player_name != 'undefined' && req.body.player_name.length > 0) {

				if (Array.isArray(req.body.player_name)) {
					var playerdata = req.body.player_name;


					for (var i = 0; i < playerdata.length; i++) {  
						

						// var certificate = req.files.certificate;
						// console.log('certificate file+++++++');
						// //console.log(certificate);
						// console.log(typeof certificate);

						// var certificate_new = "";



						// if (certificate && typeof certificate !== "undefined" && certificate.length > 0) {
						// 	var element = certificate[i];
						// 	console.log('element +++++++++');
						// 	console.log(element);
						// 	//var image_name= now.format("YYYYMMDDHHmmss")+element.name;
						// 	var image_name = moment().format('MMDDYYYYHHmmss') + element.name;

						// 	element.mv('./images/website/' + image_name);
						// 	certificate_new = image_name;



						// }
						console.log('playerdata:')
   					  console.log(req.body.player_name[i])  

						
						var query = `INSERT INTO registration_player(team_id,player_name,player_last_name,player_email,player_mobile,gender,dob,age,player_isdcode,created_at,status)VALUES(${register_id},'${req.body.player_name[i]}','${req.body.player_last_name[i]}','${req.body.player_email[i]}',${req.body.player_mobile[i]},${req.body.gender[i]},'${req.body.dob[i]}',${req.body.age[i]},'${req.body.player_isdcode[i]}',now(),1)RETURNING player_email`;
						console.log('query...................................'); 
						console.log(query);
						let data = await db.query(query); 

						  let email = data.rows[0].player_email;  
				
							result.push({
								
								"email": email,
								"tournament_name":tournament_name,
								"coachname":coachname,
								"subscriber_id":subscriber_id,
								"event_id":event_id,
								"team_id":register_id

								});
							console.log("--------------------------")  
							console.log(result);
							

					}
					return result;
				} else {
					var query = `INSERT INTO registration_player(team_id,player_name,player_last_name,player_email,player_mobile,gender,dob,age,player_isdcode,created_at,status)VALUES(${
                            register_id},'${req.body.player_name}','${req.body.player_last_name}','${req.body.player_email}',${req.body.player_mobile},${req.body.gender},'${req.body.dob}',${req.body.age},'${req.body.player_isdcode}',now(),1)RETURNING player_email`;
                            console.log('query+++++++++++++++++++++++++++++++++++'); 
						console.log(query);
							let data = await db.query(query); 
							let email = data.rows[0].player_email;
				
							result.push({
								
								"email": email,
								"tournament_name":tournament_name,
								"coachname":coachname,
								"subscriber_id":subscriber_id,
								"event_id":event_id,
								"team_id":register_id

								});
							//console.log("--------------------------")  
							//console.log(result);
							return result;
				}
			}

			// if (req.body.event_id && typeof req.body.event_id != 'undefined' && req.body.event_id.length > 0) {

			// 	if (Array.isArray(req.body.event_id)) {
			// 		var eventdata = req.body.event_id;

			// 		for (var i = 0; i < eventdata.length; i++) {
			// 			var query = `INSERT INTO registration_event(register_id,event_id,created_at,status)VALUES(${
   //                          register_id},${req.body.event_id[i]},now(),1)`;
   //                          console.log('query===================================');
			// 			console.log(query);
			// 			await db.query(query);

			// 		}
			// 	} else {
			// 		var query = `INSERT INTO registration_event(register_id,event_id,created_at,status)VALUES(${
   //                          register_id},${req.body.event_id[i]},now(),1)`;
   //                          console.log('query)))))))))))))))))))))))))))))))))');
			// 			console.log(query);
			// 		await db.query(query);
			// 	}
			// }
      return true;
		}


	} catch (err) {
		console.log('err////');
		console.log(err);
		result.id = false;
	}
	//return result;
	return result.message = true;
}

const update = async (req, res) => {
  const result = [];
 try {
  let maildata = `
    SELECT r.tournament_id, r.register_name, r.event_id, r.subscriber_id, t.tournament_name
    FROM registration AS r
    LEFT JOIN tournament AS t ON t.id = r.tournament_id
    WHERE r.id = ${req.body.team_id}`;

  console.log("maildata:");
  console.log(maildata);

  maildata = await db.query(maildata);
  maildata = maildata.rows;
  console.log("maildataooooooooooooooooooooooooooo");
  console.log(maildata.length);

  var tournament_name;
  var coachname;
  var subscriber_id;
  var event_id;

  if (maildata && maildata.length > 0) {
    tournament_name = maildata[0].tournament_name;
    coachname = maildata[0].register_name;
    subscriber_id = maildata[0].subscriber_id;
    event_id = maildata[0].event_id.trim();
    register_id = req.body.team_id;
    console.log("tournament_name: ", tournament_name);
    console.log("coachname: ", coachname);

    // Continue with your logic using tournament_name and coachname
  } else {
    tournament_name = null;
    coachname = null;
    subscriber_id = null;
    event_id = null;
    register_id = null;
  }

  if (req.body.player_name && typeof req.body.player_name !== "undefined" && req.body.player_name.length > 0) {
    if (Array.isArray(req.body.player_name)) {
      var playerdata = req.body.player_name;

      for (var i = 0; i < playerdata.length; i++) {
        console.log("playerdata:");
        console.log(req.body.player_name[i]);

        var checkDuplicateQuery = `
          SELECT id FROM registration_player WHERE player_email = '${req.body.player_email[i]}' and team_id = ${req.body.team_id}`;

          console.log("checkDuplicateQuery33333333333333333...................................");
          console.log(checkDuplicateQuery);

        let duplicateData = await db.query(checkDuplicateQuery);

      console.log(duplicateData.rows.length);

        if (duplicateData.rows.length > 0) {
          // Update existing record
          var query = `
            UPDATE registration_player
            SET
              player_name = '${req.body.player_name[i]}',
              player_last_name = '${req.body.player_last_name[i]}',
              player_email = '${req.body.player_email[i]}',
              player_mobile = ${req.body.player_mobile[i]},
              gender = ${req.body.gender[i]},
              dob = '${req.body.dob[i]}',
              age = ${req.body.age[i]},
              player_isdcode = '${req.body.player_isdcode[i]}',
              created_at = now(),
              status = 1
            WHERE team_id = ${req.body.team_id}
            AND player_email = '${req.body.player_email[i]}'
            `;

          console.log("query...................................");
          console.log(query);

          let data = await db.query(query);
          let email = 'demo@gmail.com';

          result.push({
            email: email,
            tournament_name: tournament_name,
            coachname: coachname,
            subscriber_id: subscriber_id,
            event_id: event_id,
            team_id: req.body.team_id
          });
          console.log("--------------------------");
          console.log(result);
        } else {
          // Insert new record
          var insertQuery = `
            INSERT INTO registration_player (team_id, player_name, player_last_name, player_email, player_mobile, gender, dob, age, player_isdcode, created_at, status)
            VALUES (${register_id}, '${req.body.player_name[i]}', '${req.body.player_last_name[i]}', '${req.body.player_email[i]}', ${req.body.player_mobile[i]}, ${req.body.gender[i]}, '${req.body.dob[i]}', ${req.body.age[i]}, '${req.body.player_isdcode[i]}', now(), 1)
            RETURNING player_email`;

          console.log("insertQuery..................................."); 
          console.log(insertQuery);

          let data = await db.query(insertQuery);
          let email =  data.rows[0].player_email;

          result.push({
            email: email,
            tournament_name: tournament_name,
            coachname: coachname,
            subscriber_id: subscriber_id,
            event_id: event_id,
            team_id: req.body.team_id
          });
          console.log("--------------------------");
          console.log(result);
        }
      }
      return result;
    } else {
      // Single record
      var checkDuplicateQuery = `
        SELECT id FROM registration_player WHERE player_email = '${req.body.player_email}' and team_id = ${req.body.team_id}`;


        console.log("checkDuplicateQuery33333333333333333...................................");
          console.log(checkDuplicateQuery);

      let duplicateData = await db.query(checkDuplicateQuery);

      if (duplicateData.rows.length > 0) {
        // Update existing record
        var query = `
          UPDATE registration_player
          SET
            player_name = '${req.body.player_name}',
            player_last_name = '${req.body.player_last_name}',
            player_email = '${req.body.player_email}',
            player_mobile = ${req.body.player_mobile},
            gender = ${req.body.gender},
            dob = '${req.body.dob}',
            age = ${req.body.age},
            player_isdcode = '${req.body.player_isdcode}',
            created_at = now(),
            status = 1
          WHERE team_id = ${req.body.team_id}
          AND player_email = '${req.body.player_email}'
          `;

        console.log("query+++++++++++++++++++++++++++++++++++");
        console.log(query);

        let data = await db.query(query);  
        let email = "demo@gmail.com";

        result.push({
          email: email,
          tournament_name: tournament_name,
          coachname: coachname,
          subscriber_id: subscriber_id,
          event_id: event_id,
          team_id: req.body.team_id
        });
        return true;
      } else {
        // Insert new record
        var insertQuery = `
          INSERT INTO registration_player (team_id, player_name, player_last_name, player_email, player_mobile, gender, dob, age, player_isdcode, created_at, status)
          VALUES (${req.body.team_id}, '${req.body.player_name}', '${req.body.player_last_name}', '${req.body.player_email}', ${req.body.player_mobile}, ${req.body.gender}, '${req.body.dob}', ${req.body.age}, '${req.body.player_isdcode}', now(), 1)
          RETURNING player_email`;

        console.log("insertQuery+++++++++++++++++++++++++++++++++++");
        console.log(insertQuery);

        let data = await db.query(insertQuery);
        let email = data.rows[0].player_email;

        result.push({
          email: email,
          tournament_name: tournament_name,
          coachname: coachname,
          subscriber_id: subscriber_id,
          event_id: event_id,
          team_id: req.body.team_id
        });
        return result;
      }
    }
  }
} catch (err) {
  console.log("err////");
  console.log(err);
  result.id = false;
}
//return result;
return result.message = true;
}






const eventfilter = async (req, res) => { 
    let result = {};
    try {

    	console.log('dcfds');

        var where_str = " ";
        if(req.query.page_record && typeof req.query.page_record !=="undefined" && typeof req.query.page_record !=="" && req.query.page_record>0){   
            where_str = " limit "+req.query.page_record;
        }

         

        let tournament_id =''
        if(req.query.tournament_id){
            tournament_id = ` AND tournament_id = ${req.query.tournament_id}`;  
        }

        let age ='' 
        if(req.query.age){
            age = ` AND max_age_group_id >= ${req.query.age}`;   
        }

        let gender =''
        if(req.query.gender){
            gender = ` AND player_type_id = ${req.query.gender}`;     
        }
        

        
    	
        let listStr ="SELECT event_name,tournament_id,max_age_group_id,amount,bird_discount,registration_fee,currency FROM event WHERE status = 1"+tournament_id+age+gender;
        

            console.log("listStr: +++++");
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

const singleplayer= async (req, res) => {
	const result = {};
	try {


		if (typeof req.body.turnament_id === "undefined" && req.body.turnament_id === undefined) {
			req.body.turnament_id = null;
		}
		if (typeof req.body.total_amount === "undefined" && req.body.total_amount === undefined) {
			req.body.total_amount = null;
		}
		if (typeof req.body.isd_code === "undefined" && req.body.isd_code === undefined) {
			req.body.isd_code = null;
		}
		if (typeof req.body.registerd_by === "undefined" && req.body.registerd_by === undefined) {
			req.body.registerd_by = null;
		}
		if (typeof req.body.parent_no === "undefined" && req.body.parent_no === undefined) {
			req.body.parent_no = null;
		}

		if (typeof req.body.event_id === "undefined" && req.body.event_id === undefined) {
			req.body.event_id = null;
		}

		if (typeof req.body.champ_id === "undefined" && req.body.champ_id === undefined) {
			req.body.champ_id = null;
		}

		if (typeof req.body.total_amount === "undefined" && req.body.total_amount === undefined) {
			req.body.total_amount = null;
		}

		if (typeof req.body.parent_no === "undefined" && req.body.parent_no === undefined && req.body.parent_no === '') {
			req.body.parent_no = null;
		}

						
		                

						

		const addsStr = `INSERT INTO registration_single_player ( event_id,tournament_id,champ_id,registered_by,age,player_name,dob,total_amount,parent_name,parent_no,subscriber_id,status,created_at) VALUES('${req.body.event_id}',${req.body.tournament_id},${req.body.champ_id},${req.body.registered_by},${req.body.age},'${req.body.player_name}','${req.body.dob}',${req.body.total_amount},'${req.body.parent_name}',${req.body.parent_no},${req.body.subscriber_id},1,now())RETURNING id`;
		console.log('addsStrooooooooooooooooooooooooooooo'); 
		console.log(addsStr);   

		const adddata = await db.query(addsStr);

		

	} catch (err) {
		console.log('err////');
		console.log(err);
		result.id = false;
	}
	//return result;
	return result.message = true;
}


const rolelist = async(req,res)=>{
	try{
		var result ={};
    
    let rolelist = "SELECT *FROM user_role WHERE id NOT IN (3,1)";
	let data = await db.query(rolelist);
	 result = data.rows;

	 return result;
	console.log(result); 
	
	}
	catch(err){
console.log(err)
	}
}


const Yearlist = async (req, res) => {
    var result = {};
    try {
        
        
        
        let listStrd = "SELECT * FROM individual_performance WHERE status = 1  and sport_id = "+req.query.sport_id+" and subscriber_id = "+req.query.subscriber_id+"" ;

        
console.log('dataResult');
        console.log(listStrd);
        let dataResult = await db.query(listStrd);

        console.log('dataResult');
        console.log(dataResult);
        result = dataResult.rows;

        console.log('listStr');
        console.log(result);
        return result;
         
    } catch (err) {
        console.log("err: ");
        console.log(err);
        result = {};
    }
   
}


const qualificationstatus = async (req, res) => {

	try {


		var result = {}

		

			let querystr = "update registration SET qualification_status = '" + req.body.qualification_status + "' ,updated_at = now() WHERE event_id = '" + req.body.event_id + "' and id = "+req.body.id+"";
			console.log('querystr update.......')
			console.log(querystr)


			await db.query(querystr); 
		

		return true;
	} catch (err) {
		console.log(err);
		return false
	}
}

const Listdata = async(req, res) => {
	try{
		var result = {};
		
		var listQry = "select s.*,sp.profile_image,sp.adhar_card,sp.adhar_status,sw.parent_name,sw.last_name,sw.parent_number from subscriber as s  left join subscriber_web as sw on s.id = sw.subscriber_id left join subscriber_profile as sp on s.id  = sp.subscriber_id WHERE s.id ="+req.query.id+" and s.status = 1";
		
		console.log(listQry)
		result = await db.query(listQry); 
		
		return result.rows;
	}
	catch(err){
		console.log("err:");
        console.log(err);

        return false;
	}
}


const updatesubscriber = async(req,res)=>{

try {
  let parent_number = '';
  let parent_name = '';
  let number = '';
  let adhar_str = '';
  let adhar_status = '';
  let profile_image = '';
  let otpNumber = Math.floor(100000 + Math.random() * 900000);

  if (req.body.parent_number) {
    parent_number = `parent_number = '${req.body.parent_number}'`;
  }

  if (req.body.parent_name) {
    parent_name = `parent_name = '${req.body.parent_name}'`;
  }

  if (req.files && req.files.adhar_card && req.body.adhar_status) {
    const element = req.files.adhar_card;
    const tourPath = 'images/profile/';
    const image_name = tourPath + moment().format('MMDDYYYYHHmmss') + element.name; 
    element.mv(image_name);
    adhar_str = `adhar_card = '${image_name}'`;

    adhar_status = `,adhar_status = '${req.body.adhar_status}'`;

    const querydata = `UPDATE subscriber_profile SET ${adhar_str} ${adhar_status} WHERE subscriber_id = ${req.body.id}`;

console.log("querydata000000000000000000000000000"); 
    console.log(querydata);

    await db.query(querydata);
  }

  if (req.files && req.files.profile_image) {
    const elementt = req.files.profile_image;
    const tourPatht = 'images/profile/';
    const image_namet = tourPatht + moment().format('MMDDYYYYHHmmss') + elementt.name;  
    elementt.mv(image_namet);
    profile_image = `profile_image = '${image_namet}'`;

    const querydata = `UPDATE subscriber_profile SET ${profile_image} WHERE subscriber_id = ${req.body.id}`;  

    console.log(querydata);

    await db.query(querydata);
  }

  let query = "UPDATE subscriber_web SET "; 
  let updateColumns = [];

  if (parent_name) {
    updateColumns.push(parent_name);
  }

  if (parent_number) {
    updateColumns.push(parent_number); 
  }

  if (updateColumns.length > 0) {
    query += updateColumns.join(', ');
    query += ` WHERE subscriber_id = ${req.body.id}`; 

    console.log(query);
    await db.query(query);
  }

  if (req.body.number) {
    number = `mobile_number = ${req.body.number}`;

    const querydata = `UPDATE subscriber SET ${number} WHERE id = ${req.body.id}`;
    console.log(querydata);
    await db.query(querydata);


    let checkexistmobile = "SELECT mobile_number,email_id from otp where mobile_number =" + req.body.number + "";

            let existdata = await db.query(checkexistmobile);
            console.log('existdata.rows.length---');
            console.log(existdata.rows.length);

        if (existdata.rows.length <= 0) {

                 const addsStr = `INSERT INTO otp ( mobile_number,subscriber_sid,isd_code,otp,email_id,created_at) VALUES('${req.body.number}',${req.body.id},'+91',null,null,now())RETURNING id`;
                console.log('addsStrooooooooooooooooooooooooooooo');  
                console.log(addsStr); 

            await db.query(addsStr);

      
     }
     else{
          const querydata = `UPDATE otp SET otp = ${otpNumber} WHERE mobile_number = ${req.body.number}`;
        console.log(querydata);
        await db.query(querydata);

     }


     
  }

  return true;
} catch (error) {
  console.log(error);
  // Handle the error
}

}


const demo = async (req, res) => {
 try {
  let result = {};
 const moment = require('moment');

  // Get the current date
  const currentDate = moment();

  // Subtract 72 hours from the current date
  //const expirationDate = moment().subtract(72, 'hours');

  // Convert the dates to the desired format
  const formattedCurrentDate = currentDate.format('YYYY-MM-DD');

 // let query = "SELECT DISTINCT r.tournament_id, r.champ_id, r.event_id,e.event_end_date FROM registration as r left join event as e on e.id:: varchar  = r.event_id WHERE r.status = 1 and e.event_end_date > '"+formattedCurrentDate+"' AND r.subscriber_id = " + req.body.id;


let query = "SELECT DISTINCT ON (r.tournament_id, r.champ_id, r.event_id) r.tournament_id, r.champ_id, r.event_id, e.event_end_date FROM registration as r LEFT JOIN event as e ON  e.id::varchar = r.event_id WHERE r.status = 1 AND e.event_end_date > '"+formattedCurrentDate+"' AND r.subscriber_id = " + req.body.id;
  console.log("data-------------------------------------------------------------------------");
  console.log(query);
  let data = await db.query(query);

  

  // result.champ = [];

  // for (var i = 0; i < data.rows.length; i++) {
  //   let champdata = "SELECT * FROM olympic WHERE id = " + data.rows[i].champ_id;
  //   let champinfo = await db.query(champdata);

  //   if (champinfo.rows.length > 0) {
  //     let tourdata = "SELECT * FROM tournament WHERE id = " + champinfo.rows[0].olympics_sports; 
  //     let tourinfo = await db.query(tourdata);

  //     if (tourinfo.rows.length > 0) {
  //       let eventdata = "SELECT * FROM event WHERE tournament_id = " + tourinfo.rows[0].id;
  //       let eventinfo = await db.query(eventdata);

  //       console.log(eventdata);
  //       console.log('eventdata------------------========================================');

  //       if (eventinfo.rows.length > 0) {
  //         let teamdata = "SELECT * FROM registration WHERE event_id::int = " + eventinfo.rows[0].id;
  //         let teaminfo = await db.query(teamdata);

  //         let tournament = {
  //           tournament: [
  //             tourinfo.rows[0] || {},
  //             {
  //               event: [
  //                 {
  //                   event: eventinfo.rows[0] || {},
  //                   team: []
  //                 }
  //               ]
  //             }
  //           ]
  //         };

  //         for (let j = 0; j < teaminfo.rows.length; j++) {
  //           let playerdata = "SELECT * FROM registration_player WHERE team_id = " + teaminfo.rows[j].id;
  //           let playerinfo = await db.query(playerdata);

  //           teaminfo.rows[j]['player'] = playerinfo.rows || [];
  //         }

  //         tournament.tournament[1].event[0].team = teaminfo.rows || [];
  //         result.champ.push(tournament);
  //       }
  //     }
  //   } else {
  //     // If champinfo is not available, provide tournament data directly
  //     let tourdata = "SELECT * FROM tournament WHERE id = " + data.rows[i].tournament_id;
  //     console.log("tourinfo...........................");
  //     console.log(tourdata);

  //     let tourinfo = await db.query(tourdata);

  //     if (tourinfo.rows.length > 0) {
  //       let eventdata = "SELECT * FROM event WHERE id = " + data.rows[i].event_id;

  //       console.log("eventdata");
  //       console.log(eventdata);
  //       let eventinfo = await db.query(eventdata);

  //       if (eventinfo.rows.length > 0) {
  //         let teamdata =
  //           "SELECT r.*, CAST(COUNT(rp.team_id) AS int) AS player_count, e.min_member_per_team, e.max_member_per_team, TRIM(r.event_id) AS event_id FROM registration AS r LEFT JOIN event AS e ON e.id = r.event_id::int LEFT JOIN registration_player AS rp ON rp.team_id = r.id WHERE r.subscriber_id = " + req.body.id + "  and CAST(TRIM(r.event_id) AS INTEGER) = " +
  //           data.rows[i].event_id +
  //           " GROUP BY r.id, e.min_member_per_team, e.max_member_per_team";

  //         console.log("teamdata");
  //         console.log(teamdata);
  //         let teaminfo = await db.query(teamdata);

  //         // if (eventinfo.rows.length > 0) {
  //         //   let datainfo = "SELECT * FROM registration_player WHERE team_id = " + eventinfo.rows[0].id;
  //         //   let playerinfo = await db.query(datainfo);

  //         //   //eventinfo.rows[0]['player'] = playerinfo.rows || [];
  //         // }

  //         let tournament = {
  //           tournament: [
  //             {
  //               ...tourinfo.rows[0],
  //               event: [
  //                 {
  //                   ...eventinfo.rows[0],
  //                   team: []
  //                 }
  //               ]
  //             }
  //           ]
  //         };

  //         for (let j = 0; j < teaminfo.rows.length; j++) {
  //           let playerdata = "SELECT * FROM registration_player WHERE team_id = " + teaminfo.rows[j].id; 
  //           let playerinfo = await db.query(playerdata);

  //           teaminfo.rows[j]['player'] = playerinfo.rows || [];
  //         }

  //         tournament.tournament[0].event[0].team = teaminfo.rows || [];
  //         result.champ.push(tournament);
  //       }
  //     }
  //   }
  // }

  // console.log("result");
  // console.log(result);
  // return result;










// result.champ = [];

// // Create a dictionary to store tournaments by their ID
// const tournamentDict = {};

// for (var i = 0; i < data.rows.length; i++) {
//   let champdata = "SELECT * FROM olympic WHERE id = " + data.rows[i].champ_id;

// console.log("champdata.................");
//   console.log(champdata)
//   let champinfo = await db.query(champdata);

//   if (champinfo.rows.length > 0) {
//     let tourdata = "SELECT * FROM tournament WHERE id = " + data.rows[i].tournament_id;
//     let tourinfo = await db.query(tourdata);

//     if (tourinfo.rows.length > 0) {
//       let eventdata = "SELECT * FROM event WHERE tournament_id = " + data.rows[i].event_id;
//       let eventinfo = await db.query(eventdata);

//       console.log(eventdata);
//       console.log('eventdata------------------========================================');

//       if (eventinfo.rows.length > 0) {
//         let teamdata = "SELECT * FROM registration WHERE event_id::int = " + eventinfo.rows[0].id;
//         let teaminfo = await db.query(teamdata);

//         if (!(tourinfo.rows[0].id in tournamentDict)) {
//           // Create a new tournament entry if it doesn't exist in the dictionary
//           tournamentDict[tourinfo.rows[0].id] = {
//             tournament: [
//               tourinfo.rows[0] || {},
//               {
//                 event: [],
//               },
//             ],
//           };
//         }

//         let tournament = tournamentDict[tourinfo.rows[0].id];
//         let event = {
//           event: eventinfo.rows[0] || {},
//           team: teaminfo.rows.map(team => ({
//             ...team,
//             player: [], // Initialize an empty array for players
//           })) || [],
//         };

//         // Populate the player array for each team with player data
//         for (let j = 0; j < teaminfo.rows.length; j++) {
//           let playerdata =
//             "SELECT * FROM registration_player WHERE team_id = " + teaminfo.rows[j].id;
//           let playerinfo = await db.query(playerdata);
          
//           event.team[j].player = playerinfo.rows || [];
//         }

//         tournament.tournament[1].event.push(event);
//       }
//     }
//   } else {
//     // If champinfo is not available, provide tournament data directly
//     let tourdata = "SELECT * FROM tournament WHERE id = " + data.rows[i].tournament_id;
//    // console.log("tourinfo...........................");
//    // console.log(tourdata);

//     let tourinfo = await db.query(tourdata);

//     if (tourinfo.rows.length > 0) {
//       let eventdata = "SELECT * FROM event WHERE id = " + data.rows[i].event_id;

//       //console.log("eventdata");
//       //console.log(eventdata);
//       let eventinfo = await db.query(eventdata);

//       if (eventinfo.rows.length > 0) {
//         let teamdata =
//           "SELECT r.*, CAST(COUNT(rp.team_id) AS int) AS player_count, e.min_member_per_team, e.max_member_per_team, TRIM(r.event_id) AS event_id FROM registration AS r LEFT JOIN event AS e ON e.id = r.event_id::int LEFT JOIN registration_player AS rp ON rp.team_id = r.id WHERE r.subscriber_id = " + req.body.id + "  and CAST(TRIM(r.event_id) AS INTEGER) = " +
//           data.rows[i].event_id +
//           " GROUP BY r.id, e.min_member_per_team, e.max_member_per_team";

//         //console.log("teamdata");
//         //console.log(teamdata);
//         let teaminfo = await db.query(teamdata);
//         console.log("teaminfo33333333333333333333333333333333333333333");
//         console.log(teaminfo);

//         if (!(tourinfo.rows[0].id in tournamentDict)) {
//           // Create a new tournament entry if it doesn't exist in the dictionary
//           tournamentDict[tourinfo.rows[0].id] = {
//             tournament: [
//               {
//                 ...tourinfo.rows[0],
//                 event: [],
//               },
//             ],
//           };
//         }

//         let tournament = tournamentDict[tourinfo.rows[0].id];
//         let event = {
//           ...eventinfo.rows[0],
//           team: teaminfo.rows.map(team => ({
//             ...team,
//             player: [], // Initialize an empty array for players
//           })) || [],
//         };

//         // Populate the player array for each team with player data
//         for (let j = 0; j < teaminfo.rows.length; j++) {
//           let playerdata =
//             "SELECT * FROM registration_player WHERE team_id = " + teaminfo.rows[j].id;
//           let playerinfo = await db.query(playerdata);
          
//           event.team[j].player = playerinfo.rows || [];
//         }

//         tournament.tournament[0].event.push(event);
//       }
//     }
//   }
// }

// // Convert the tournament dictionary into an array and add it to the result
// result.champ = Object.values(tournamentDict);

// console.log("result");
// console.log(result);
// return result;




  //////////////////////////////////////////////////////////////////

//   result.champ = [];

// // Create dictionaries to store tournaments and camps by their ID
// const tournamentDict = {};
// const campDict = {};

// for (var i = 0; i < data.rows.length; i++) {
//   let champdata = "SELECT * FROM olympic WHERE id = " + data.rows[i].champ_id;

//   console.log("champdata.................");
//   console.log(champdata);
//   let champinfo = await db.query(champdata);

//   if (champinfo.rows.length > 0) {
//     // Handle tournament data
//     let tourdata = "SELECT * FROM tournament WHERE id = " + data.rows[i].tournament_id;
//     let tourinfo = await db.query(tourdata);

//     if (tourinfo.rows.length > 0) {
//       // Handle event data
//       let eventdata = "SELECT * FROM event WHERE tournament_id = " + data.rows[i].event_id;
//       let eventinfo = await db.query(eventdata);

//       console.log(eventdata);
//       console.log('eventdata------------------========================================');

//       if (eventinfo.rows.length > 0) {
//         // Handle team data
//         let teamdata = "SELECT * FROM registration WHERE event_id::int = " + eventinfo.rows[0].id;
//         let teaminfo = await db.query(teamdata);

//         if (!(tourinfo.rows[0].id in tournamentDict)) {
//           // Create a new tournament entry if it doesn't exist in the dictionary
//           tournamentDict[tourinfo.rows[0].id] = {
//             tournament: [
//               tourinfo.rows[0] || {},
//               {
//                 event: [],
//               },
//             ],
//           };
//         }

//         let tournament = tournamentDict[tourinfo.rows[0].id];
//         let event = {
//           ...eventinfo.rows[0] || {},
//           team: teaminfo.rows.map(team => ({
//             ...team,
//             player: [], // Initialize an empty array for players
//           })) || [],
//         };

//         // Populate the player array for each team with player data
//         for (let j = 0; j < teaminfo.rows.length; j++) {
//           let playerdata =
//             "SELECT * FROM registration_player WHERE team_id = " + teaminfo.rows[j].id;
//           let playerinfo = await db.query(playerdata);

//           event.team[j].player = playerinfo.rows || [];
//         }

//         tournament.tournament[1].event.push(event);
//       }
//     }
//   } else {
//     // If champinfo is not available, provide tournament data directly
//     let tourdata = "SELECT * FROM tournament WHERE id = " + data.rows[i].tournament_id;
//     let tourinfo = await db.query(tourdata);

//     if (tourinfo.rows.length > 0) {
//       let eventdata = "SELECT * FROM event WHERE id = " + data.rows[i].event_id;
//       let eventinfo = await db.query(eventdata);

//       if (eventinfo.rows.length > 0) {
//         // Handle team data
//         let teamdata =
//           "SELECT r.*, CAST(COUNT(rp.team_id) AS int) AS player_count, e.min_member_per_team, e.max_member_per_team, TRIM(r.event_id) AS event_id FROM registration AS r LEFT JOIN event AS e ON e.id = r.event_id::int LEFT JOIN registration_player AS rp ON rp.team_id = r.id WHERE r.subscriber_id = " + req.body.id + "  and CAST(TRIM(r.event_id) AS INTEGER) = " +
//           data.rows[i].event_id +
//           " GROUP BY r.id, e.min_member_per_team, e.max_member_per_team";

//         let teaminfo = await db.query(teamdata);
//         console.log("teaminfo33333333333333333333333333333333333333333");
//         console.log(teaminfo);

//         if (!(tourinfo.rows[0].id in tournamentDict)) {
//           // Create a new tournament entry if it doesn't exist in the dictionary
//           tournamentDict[tourinfo.rows[0].id] = {
//             tournament: [
//               {
//                 ...tourinfo.rows[0],
//                 event: [],
//               },
//             ],
//           };
//         }

//         let tournament = tournamentDict[tourinfo.rows[0].id];
//         let event = {
//           ...eventinfo.rows[0],
//           team: teaminfo.rows.map(team => ({
//             ...team,
//             player: [], // Initialize an empty array for players
//           })) || [],
//         };

//         // Populate the player array for each team with player data
//         for (let j = 0; j < teaminfo.rows.length; j++) {
//           let playerdata =
//             "SELECT * FROM registration_player WHERE team_id = " + teaminfo.rows[j].id;
//           let playerinfo = await db.query(playerdata);

//           event.team[j].player = playerinfo.rows || [];
//         }

//         tournament.tournament[0].event.push(event);
//       }
//     }
//   }

//   // Handle camp data (similar to tournament data)
//   let campdata = "SELECT * FROM olympic WHERE id = " + data.rows[i].champ_id;
//   let campinfo = await db.query(campdata);

//   if (campinfo.rows.length > 0) {
//     // Handle camp-specific logic here
//     // You can create a similar structure as tournamentDict to store camp data
//   }
// }

// // Convert the tournament and camp dictionaries into arrays and add them to the result
// result.champ = Object.values(tournamentDict);
// // Add camp data to the result as needed

// console.log("result");
// console.log(result);
// return result;


  // Create dictionaries to store tournaments and camps by their ID
const tournamentDict = {};
const campDict = {};

for (var i = 0; i < data.rows.length; i++) {
  let champdata = "SELECT * FROM olympic WHERE id = " + data.rows[i].champ_id;

  console.log("champdata.................");
  console.log(champdata);
  let champinfo = await db.query(champdata);

  if (champinfo.rows.length > 0) {
    // Handle tournament data
    let tourdata = "SELECT * FROM tournament WHERE id = " + data.rows[i].tournament_id;
    let tourinfo = await db.query(tourdata);

    if (tourinfo.rows.length > 0) {
      // Handle event data
      let eventdata = "SELECT * FROM event WHERE tournament_id = " + data.rows[i].event_id;
      let eventinfo = await db.query(eventdata);

      console.log(eventdata);
      console.log('eventdata------------------========================================');

      if (eventinfo.rows.length > 0) {
        // Handle team data
        let teamdata = "SELECT * FROM registration WHERE event_id::int = " + eventinfo.rows[0].id;
        let teaminfo = await db.query(teamdata);

        if (!(champinfo.rows[0].id in tournamentDict)) {
          // Create a new tournament entry if it doesn't exist in the dictionary
          tournamentDict[champinfo.rows[0].id] = {
            champ: [
              champinfo.rows[0] || {},
              {
                tournament: [],
              },
            ],
          };
        }

        let champ = tournamentDict[champinfo.rows[0].id];

        // Populate the player array for each team with player data
        

         let event = {
          ...eventinfo.rows[0] || {},
          team: teaminfo.rows.map(team => ({
            ...team, 
            player: [], // Initialize an empty array for players
          })) || [],
        };
        for (let j = 0; j < teaminfo.rows.length; j++) {
          let playerdata =
            "SELECT * FROM registration_player WHERE team_id = " + teaminfo.rows[j].id;
          let playerinfo = await db.query(playerdata);

          event.team[j].player = playerinfo.rows || [];
        }

        let tournament = {
          ...tourinfo.rows[0] || {},
          event: eventinfo.rows.map(team => ({ 
            ...event,
            team: [], // Initialize an empty array for players
          })) || [],
        };

        champ.champ[1].tournament.push(tournament);

        //tournament.tournament[1].event.push(event);
      }
    }
  } else {
    // If champinfo is not available, provide tournament data directly
    let tourdata = "SELECT * FROM tournament WHERE id = " + data.rows[i].tournament_id;
    let tourinfo = await db.query(tourdata);

    if (tourinfo.rows.length > 0) {
      let eventdata = "SELECT * FROM event WHERE id = " + data.rows[i].event_id;
      let eventinfo = await db.query(eventdata); 

      if (eventinfo.rows.length > 0) {
        // Handle team data
        let teamdata =
          "SELECT r.*, CAST(COUNT(rp.team_id) AS int) AS player_count, e.min_member_per_team, e.max_member_per_team, TRIM(r.event_id) AS event_id FROM registration AS r LEFT JOIN event AS e ON e.id = r.event_id::int LEFT JOIN registration_player AS rp ON rp.team_id = r.id WHERE r.subscriber_id = " + req.body.id + "  and CAST(TRIM(r.event_id) AS INTEGER) = " +
          data.rows[i].event_id +
          " GROUP BY r.id, e.min_member_per_team, e.max_member_per_team";

        let teaminfo = await db.query(teamdata);
        console.log("teaminfo33333333333333333333333333333333333333333");
        console.log(teaminfo);

        if (!(tourinfo.rows[0].id in tournamentDict)) {
          // Create a new tournament entry if it doesn't exist in the dictionary
          tournamentDict[tourinfo.rows[0].id] = {
            tournament: [
              {
                ...tourinfo.rows[0],
                event: [],
              },
            ],
          };
        }

        let tournament = tournamentDict[tourinfo.rows[0].id];
        let event = {
          ...eventinfo.rows[0],
          team: teaminfo.rows.map(team => ({
            ...team,
            player: [], // Initialize an empty array for players
          })) || [],
        };

        // Populate the player array for each team with player data
        for (let j = 0; j < teaminfo.rows.length; j++) {
          let playerdata =
            "SELECT * FROM registration_player WHERE team_id = " + teaminfo.rows[j].id;
          let playerinfo = await db.query(playerdata);

          event.team[j].player = playerinfo.rows || [];
        }

        tournament.tournament[0].event.push(event);
      }
    }
  }

 
}

// Convert the tournament and camp dictionaries into arrays and add them to the result
result = Object.values(tournamentDict);
//result.camp = Object.values(campDict)
// Add camp data to the result as needed (e.g., result.camp = Object.values(campDict))

console.log("result");
console.log(result);
return result;








} catch (err) {
  return {
    serverError: true,
    error: err.message
  };
}


}

const registrationbysublid = async(req,res)=>{

  try {
  
 const moment = require('moment');

  
  const currentDate = moment();

 
  const formattedCurrentDate = currentDate.format('YYYY-MM-DD');

 // let query = "SELECT DISTINCT r.tournament_id, r.champ_id, r.event_id,e.event_end_date FROM registration as r left join event as e on e.id:: varchar  = r.event_id WHERE r.status = 1 and e.event_end_date > '"+formattedCurrentDate+"' AND r.subscriber_id = " + req.body.id;


let query = "SELECT DISTINCT ON (r.tournament_id, r.champ_id, r.event_id) r.tournament_id, r.champ_id, r.event_id, e.event_end_date FROM registration as r LEFT JOIN event as e ON  e.id::varchar = r.event_id WHERE r.status = 1 AND e.event_end_date > '"+formattedCurrentDate+"' AND r.subscriber_id = " + req.body.id;
  console.log("data-------------------------------------------------------------------------");
  console.log(query);
  let data = await db.query(query);


 const tournamentDict = {};

async function fetchPlayersForTeam(team) {
  const playerdata = `SELECT * FROM registration_player WHERE team_id = ${team.id}`;
  const playerinfo = await db.query(playerdata);
  return playerinfo.rows || [];
}

async function fetchTeamsForEvent(event) {

  const teamdata =
          "SELECT r.*, CAST(COUNT(rp.team_id) AS int) AS player_count, e.min_member_per_team, e.max_member_per_team, TRIM(r.event_id) AS event_id FROM registration AS r LEFT JOIN event AS e ON e.id = r.event_id::int LEFT JOIN registration_player AS rp ON rp.team_id = r.id WHERE r.subscriber_id = " + req.body.id + "  and CAST(TRIM(r.event_id) AS INTEGER) = " +
          event.id + " GROUP BY r.id, e.min_member_per_team, e.max_member_per_team";
 // const teamdata = `SELECT * FROM registration WHERE event_id::int = ${event.id}`;
  const teaminfo = await db.query(teamdata);

  for (let team of teaminfo.rows) {
    team.player = await fetchPlayersForTeam(team);
  }
  return teaminfo.rows || [];
} 

for (let i = 0; i < data.rows.length; i++) {
  const champdata = `SELECT * FROM olympic WHERE id = ${data.rows[i].champ_id}`;
  const champinfo = await db.query(champdata);

  const tourdata = `SELECT * FROM tournament WHERE id = ${data.rows[i].tournament_id}`;
  const tourinfo = await db.query(tourdata);

  if (tourinfo.rows.length > 0) {
    const eventdata = `SELECT * FROM event WHERE id = ${data.rows[i].event_id}`;
    const eventinfo = await db.query(eventdata);

    if (eventinfo.rows.length > 0) {
      const teams = await fetchTeamsForEvent(eventinfo.rows[0]);
      const event = {
        ...eventinfo.rows[0],
        team: teams
      };

      const tournament = {
        ...tourinfo.rows[0],
        event: [event]
      };

      if (champinfo.rows.length > 0) {
        if (!tournamentDict[champinfo.rows[0].id]) {
          tournamentDict[champinfo.rows[0].id] = {
            champ: [{
              ...champinfo.rows[0],
              tournament: []
            }]
          };
        }
        tournamentDict[champinfo.rows[0].id].champ[0].tournament.push(tournament);

      } else {
        // If there's no champ info, but we still want to handle the tournament data
        if (!tournamentDict[tourinfo.rows[0].id]) {
          tournamentDict[tourinfo.rows[0].id] = {
            champ:[{
              tournament:[
                {...tournament}
                ]
            }]
            
            
          };
        }
      }
    }
  }
}

const result = Object.values(tournamentDict);
console.log("result", result);
return result;


}
catch (err) {
  return {
    serverError: true,
    error: err.message
  };
}
}


const pastregistrationbysublid = async (req, res) => {
 try {
  let result = {};
 const moment = require('moment'); 

  // Get the current date
  const currentDate = moment();

  
  const formattedCurrentDate = currentDate.format('YYYY-MM-DD');

  let query = "SELECT DISTINCT r.tournament_id, r.champ_id, r.event_id,e.event_end_date FROM registration as r left join event as e on e.id:: varchar  = r.event_id WHERE r.status = 1 and e.event_end_date < '"+formattedCurrentDate+"' AND r.subscriber_id = " + req.body.id;

  console.log("data-------------------------------------------------------------------------");
  console.log(query);
  let data = await db.query(query);

  

  result.champ = [];

  for (var i = 0; i < data.rows.length; i++) {
    let champdata = "SELECT * FROM olympic WHERE id = " + data.rows[i].champ_id;
    let champinfo = await db.query(champdata);

    if (champinfo.rows.length > 0) {
      let tourdata = "SELECT * FROM tournament WHERE id = " + champinfo.rows[0].olympics_sports; 
      let tourinfo = await db.query(tourdata);

      if (tourinfo.rows.length > 0) {
        let eventdata = "SELECT * FROM event WHERE tournament_id = " + tourinfo.rows[0].id;
        let eventinfo = await db.query(eventdata);

        if (eventinfo.rows.length > 0) {
          let teamdata = "SELECT * FROM registration WHERE event_id::int = " + eventinfo.rows[0].id;
          let teaminfo = await db.query(teamdata);

          let tournament = {
            tournament: [
              tourinfo.rows[0] || {},
              {
                event: [
                  {
                    event: eventinfo.rows[0] || {},
                    team: []
                  }
                ]
              }
            ]
          };

          for (let j = 0; j < teaminfo.rows.length; j++) {
            let playerdata = "SELECT * FROM registration_player WHERE team_id = " + teaminfo.rows[j].id;
            let playerinfo = await db.query(playerdata);

            teaminfo.rows[j]['player'] = playerinfo.rows || [];
          }

          tournament.tournament[1].event[0].team = teaminfo.rows || [];
          result.champ.push(tournament);
        }
      }
    } else {
      // If champinfo is not available, provide tournament data directly
      let tourdata = "SELECT * FROM tournament WHERE id = " + data.rows[i].tournament_id;
      console.log("tourinfo...........................");
      console.log(tourdata);

      let tourinfo = await db.query(tourdata);

      if (tourinfo.rows.length > 0) {
        let eventdata = "SELECT * FROM event WHERE id = " + data.rows[i].event_id;

        console.log("eventdata");
        console.log(eventdata);
        let eventinfo = await db.query(eventdata);

        if (eventinfo.rows.length > 0) {
          let teamdata =
            "SELECT r.*, CAST(COUNT(rp.team_id) AS int) AS player_count, e.min_member_per_team, e.max_member_per_team, TRIM(r.event_id) AS event_id FROM registration AS r LEFT JOIN event AS e ON e.id = r.event_id::int LEFT JOIN registration_player AS rp ON rp.team_id = r.id WHERE r.subscriber_id = " + req.body.id + "  and CAST(TRIM(r.event_id) AS INTEGER) = " +
            data.rows[i].event_id +
            " GROUP BY r.id, e.min_member_per_team, e.max_member_per_team";

          console.log("teamdata");
          console.log(teamdata);
          let teaminfo = await db.query(teamdata);

          // if (eventinfo.rows.length > 0) {
          //   let datainfo = "SELECT * FROM registration_player WHERE team_id = " + eventinfo.rows[0].id;
          //   let playerinfo = await db.query(datainfo);

          //   //eventinfo.rows[0]['player'] = playerinfo.rows || [];
          // }

          let tournament = {
            tournament: [
              {
                ...tourinfo.rows[0],
                event: [
                  {
                    ...eventinfo.rows[0],
                    team: []
                  }
                ]
              }
            ]
          };

          for (let j = 0; j < teaminfo.rows.length; j++) {
            let playerdata = "SELECT * FROM registration_player WHERE team_id = " + teaminfo.rows[j].id; 
            let playerinfo = await db.query(playerdata);

            teaminfo.rows[j]['player'] = playerinfo.rows || [];
          }

          tournament.tournament[0].event[0].team = teaminfo.rows || [];
          result.champ.push(tournament);
        }
      }
    }
  }

  console.log("result");
  console.log(result);
  return result;
} catch (err) {
  return {
    serverError: true,
    error: err.message
  };
}


}


const subscriberinfo = async (req,res) =>{


    try {
  let result = {};
  let teamdata = "SELECT r.*,CAST(COUNT(rp.team_id) AS int) AS player_count,e.min_member_per_team, e.max_member_per_team, TRIM(r.event_id) AS event_id FROM registration AS r LEFT JOIN event AS e ON e.id = CAST(r.event_id AS int)LEFT JOIN registration_player AS rp ON rp.team_id = r.id WHERE r.status = 1 AND r.id = " + req.body.team_id + "GROUP BY  r.id,e.min_member_per_team,e.max_member_per_team ";
  console.log(teamdata);
  const teaminfo = await db.query(teamdata);
  result.team = teaminfo.rows;

  for (var i = 0; i < teaminfo.rows.length; i++) {
    let playerdata = "SELECT * FROM registration_player WHERE status = 1 and team_id = " + teaminfo.rows[i].id;  
    const playerinfo = await db.query(playerdata);
    result.team[i].player = playerinfo.rows;
  }

  return result;
} catch (err) {
  console.log(err);
  return false;
}

}

const subscribermatchlist = async(req,res)=>{
	// try {
  // let result = {};
  // let matchdata =
  //   "SELECT DISTINCT ON (ms.tournament_id) ms.tournament_id, ms.event_id ,msc.* from match_schedule_controllers as msc left join match_schedule as ms on ms.id = msc.match_schedule_id WHERE subscriber_display_id = " + req.body.id;
  // console.log("matchdata");
  // console.log(matchdata);
  // let matchinfo = await db.query(matchdata);

  // let tournamentd = [];

  // for (var i = 0; i < matchinfo.rows.length; i++) {
  //   let tourdata = "SELECT * FROM tournament WHERE id = " + matchinfo.rows[i].tournament_id;
  //   console.log("tourinfo...........................");
  //   console.log(tourdata);

  //   let tourinfo = await db.query(tourdata);

  //   let match_statuss = "SELECT min(match_status) as status from match_schedule WHERE tournament_id = " + matchinfo.rows[i].tournament_id + " ";

  //       var match_statussrr = await db.query(match_statuss);

  //       console.log("query:111111111111111111111111111111111 ");
  //       array = match_statussrr.rows;
  //       tourinfo.rows[0]['match_status'] = array[0].status;



  //   if (tourinfo.rows.length > 0) {
  //     let eventdata = "SELECT * FROM event WHERE id = " + matchinfo.rows[i].event_id;

  //     console.log("eventdata");
  //     console.log(eventdata);
  //     let eventinfo = await db.query(eventdata);

  //     if (eventinfo.rows.length > 0) {
  //       let teamdata =
  //         "SELECT ms.*,mst.team_1,mst.team_2,r.team_name as team_one,rr.team_name as team_two from match_schedule as ms left join match_schedule_team as mst on mst.match_schedule_id = ms.id left join registration as r on r.id = mst.team_1 left join registration as rr on rr.id = mst.team_2 WHERE ms.event_id =  " +
  //         matchinfo.rows[i].event_id;

  //       console.log("teamdata");
  //       console.log(teamdata);
  //       let teaminfo = await db.query(teamdata);

  //       let match_status = "SELECT min(match_status) as status from match_schedule WHERE event_id = " + matchinfo.rows[i].event_id + " ";

  //       var match_statussr = await db.query(match_status);

  //       console.log("query:111111111111111111111111111111111 ");
  //       array = match_statussr.rows;
  //       eventinfo.rows[0]['match_status'] = array[0].status;

  //       let tournament = {
  //         ...tourinfo.rows[0],
  //         event: [
  //           {
  //             ...eventinfo.rows[0],
  //             team: teaminfo.rows || []
  //           }
  //         ]
  //       };

  //       tournamentd.push(tournament);
  //     }
  //   }
  // }

  // result.tournament = tournamentd;
  // return result;
//   try {
//   let result = {};
//   let matchdata =
//     "SELECT ms.tournament_id, ms.event_id, msc.* FROM match_schedule_controllers AS msc LEFT JOIN match_schedule AS ms ON ms.id = msc.match_schedule_id WHERE subscriber_display_id = " + req.body.id;
//   console.log("matchdata");
//   console.log(matchdata);
//   let matchinfo = await db.query(matchdata);

//   let tournaments = {}; // Use an object to store tournaments by ID

//   for (var i = 0; i < matchinfo.rows.length; i++) {
//     const tournamentId = matchinfo.rows[i].tournament_id;
//     let tourdata = "SELECT * FROM tournament WHERE id = " + matchinfo.rows[i].tournament_id;
//     console.log("tourinfo...........................");
//     console.log(tourdata);

//     let tourinfo = await db.query(tourdata);
//     const eventId = matchinfo.rows[i].event_id;

//     let eventdata = "SELECT * FROM event WHERE id = " + eventId;
//       console.log("eventdata");
//       console.log(eventdata);
//       let eventinfo = await db.query(eventdata);

//     // Check if the tournament already exists in the object, if not, create it
//     if (!tournaments[tournamentId]) {
//       tournaments[tournamentId] = {
//         ...tourinfo.rows[0],
//         events: {},
//       };
//     }

//     // Check if the event has already been processed in this tournament
//     if (!tournaments[tournamentId].events[eventId]) {
//       tournaments[tournamentId].events[eventId] = {
//                 ...eventinfo.rows[0],
//         teams: [],
//       };

      

//       if (eventinfo.rows.length > 0) {
//         let teamdata =
//           "SELECT ms.*, mst.team_1, mst.team_2, r.team_name as team_one, rr.team_name as team_two from match_schedule as ms left join match_schedule_team as mst on mst.match_schedule_id = ms.id left join registration as r on r.id = mst.team_1 left join registration as rr on rr.id = mst.team_2 WHERE ms.event_id =  " +
//           eventId;

//         console.log("teamdata");
//         console.log(teamdata);
//         let teaminfo = await db.query(teamdata);

//         let match_status = "SELECT min(match_status) as status from match_schedule WHERE event_id = " + eventId + " ";

//         var match_statussr = await db.query(match_status);

//         console.log("query:111111111111111111111111111111111 ");
//         array = match_statussr.rows;
//         eventinfo.rows[0]['match_status'] = array[0].status;

//         tournaments[tournamentId].events[eventId].teams = teaminfo.rows || [];
//       }
//     }
//   }

//   // Convert the object of tournaments into an array
//   result.tournaments = Object.values(tournaments);
//   return result;
// } 


//////////////////////////////////////////////////////////////////

try {
  let result = {};
  let matchdata =
    "SELECT ms.tournament_id, ms.event_id, msc.* FROM match_schedule_controllers AS msc LEFT JOIN match_schedule AS ms ON ms.id = msc.match_schedule_id WHERE subscriber_display_id = " + req.body.id;
  console.log("matchdata");
  console.log(matchdata);
  let matchinfo = await db.query(matchdata);

  let tournaments = {}; // Use an object to store tournaments by ID

  for (var i = 0; i < matchinfo.rows.length; i++) {
    const tournamentId = matchinfo.rows[i].tournament_id;
    let tourdata = "SELECT * FROM tournament WHERE id = " + matchinfo.rows[i].tournament_id;
    console.log("tourinfo...........................");
    console.log(tourdata);

    let tourinfo = await db.query(tourdata);
       
    let match_statuss = "SELECT min(match_status) as status from match_schedule WHERE tournament_id = " + matchinfo.rows[i].tournament_id + " ";

        var match_statussrr = await db.query(match_statuss);

        console.log("query:111111111111111111111111111111111 ");
        array = match_statussrr.rows;
        tourinfo.rows[0]['match_status'] = array[0].status; 


    const eventId = matchinfo.rows[i].event_id;

    // Check if the tournament already exists in the object, if not, create it
    if (!tournaments[tournamentId]) {
      tournaments[tournamentId] = {
        ...tourinfo.rows[0],
        events: [],
      };
    }

    // Check if the event with the same event_id has already been added to the events array for this tournament
    const existingEvent = tournaments[tournamentId].events.find((event) => event.id === eventId);

    if (!existingEvent) {
      let eventdata = "SELECT * FROM event WHERE id = " + eventId;
      console.log("eventdata");
      console.log(eventdata);
      let eventinfo = await db.query(eventdata);

      if (eventinfo.rows.length > 0) {
        let teamdata =
          "SELECT ms.*, mst.team_1, mst.team_2, r.team_name as team_one, rr.team_name as team_two from match_schedule as ms left join match_schedule_team as mst on mst.match_schedule_id = ms.id left join registration as r on r.id = mst.team_1 left join registration as rr on rr.id = mst.team_2 WHERE ms.event_id =  " +
          eventId;

        console.log("teamdata");
        console.log(teamdata);
        let teaminfo = await db.query(teamdata);

        let match_status = "SELECT min(match_status) as status from match_schedule WHERE event_id = " + eventId + " ";

        var match_statussr = await db.query(match_status);

        console.log("query:111111111111111111111111111111111 ");
        array = match_statussr.rows;
        eventinfo.rows[0]['match_status'] = array[0].status;

        // Push eventinfo with teams into the events array for the tournament
        tournaments[tournamentId].events.push({
          ...eventinfo.rows[0],
          teams: teaminfo.rows || [],
        });
      }
    }
  }

  // Convert the object of tournaments into an array
  result.tournaments = Object.values(tournaments);
  return result;
} 



 catch (err) {
  console.log(err);
  return false;
}
}




const registrationstatus = async (req,res) =>{
try{

let registration_status = "update registration_player SET registration_status = "+req.body.registration_status+" WHERE team_id = "+req.body.team_id+" and player_email = '"+req.body.email_id+"'";

console.log(registration_status);

await db.query(registration_status);

return true;
}catch(err){

	console.log(err); 

return false ;
	

}
}




async function callApi(url, params) {

  console.log('shj5555555555555');
  console.log(params)
  const response = await axios.post(url, params, {
     headers: {
    'Content-Type': 'application/json'
  },
  timeout: 15000  // 5 seconds
  });

console.log('resp33333333333333333333333333onse');
  console.log(response)
  return response.data;
}

const mongoinser = async(req,res)=>{

console.log('kkkkkkkkkkkkkkkkk111111111111111111111111111111');
  
  

try {
  const queryParams = {};

  for (const prop in req.body) {
    if (typeof req.body[prop] !== "undefined" && req.body[prop] !== '') {
      queryParams[prop] = req.body[prop];
      req.body[prop] = null;
    }
  }

  console.log('queryParams..................................................');

  console.log(queryParams);

  const apiUrl = 'http://192.168.29.130:3016/v1/admin/adminaccount/add';

  // Call the API using the defined function
  const apiData = await callApi(apiUrl, queryParams);

  // Process the API data
  processApiData(apiData);

  console.log('API call and processing complete.');
} catch (error) {
  console.error('An error occurred:', error);
}


}




 




module.exports = {mongoinser,
	insert,eventfilter,singleplayer,rolelist,Yearlist,qualificationstatus,Listdata,updatesubscriber,demo,registrationbysublid,subscriberinfo,subscribermatchlist,registrationstatus,update,pastregistrationbysublid
}