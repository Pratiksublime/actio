const db = require('../../db');
const moment = require('moment');
const now = moment();
const weekday = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
const monthArry = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];



 
const getCalender = async(req, res) => {

		console.log("getCalender: ");

		try{

			//var profille_id = req.query.subscriber_id;

			       var profille_id = ""
				
			        if(req.query.subscriber_id && typeof req.query.subscriber_id !== undefined && req.query.subscriber_id  !== ""){
			           
			           profille_id = "subscriber_id = "+req.query.subscriber_id;
			        }

			        var wherStrid = ""
			        if(req.query.sport_id && typeof req.query.sport_id !== undefined && req.query.sport_id  !== ""){
			           
			           
			           wherStrid = "and sport_id ="+req.query.sport_id+" ";
			        }
			//console.log('profille_id//////////////////////');
			//console.log(profille_id);

			var satrt_date = req.query.satrt_date;
			//console.log(profille_id);
			//();
			var end_date = req.query.end_date;

			// var date = new Date();
			// var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
			// var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);

			
			// if( req.query.satrt_date typeof req.query.satrt_date == undefined && req.query.satrt_date == ""){


			// console.log('firstDay..................');
			// console.log(req.query.satrt_date);

			// 	 satrt_date = firstDay;
			// }

			// if(req.qery.end_date typeof req.query.end_date == undefined && req.query.end_date == ""){

			// 	 end_date = lastDay;
			// }

			// var days_count = new Date(current_year, current_month, 0).getDate();

			// var date_time_value_temp = current_year+"-"+current_month+"-01";
			
			// var date_date_time_value_temp = new Date(date_time_value_temp);

			// var month_t = monthArry[date_date_time_value_temp.getMonth()];

			 var result = {};
			// console.log("days_count: --------------------------");
			// console.log(days_count);
			 var finalData = [];

			// for (var i = 1; i <= days_count; i++) {
				
			// 	if(i<10){

			// 		i = "0"+i;
			// 	}
			// 	var date_time_value = current_year+"-"+current_month+"-"+i;
	
			// 	console.log("date_time_value:========== ");
			// 	console.log(date_time_value);			

				//var date_t = new Date(date_time_value);
				//var day_t = weekday[date_t.getDay()];

				//var date_time_text = i+" "+month_t+" "+day_t;				

				//const trainingStr = `SELECT * FROM training WHERE subscriber_id = ${profille_id} and cal_date = '${date_time_value}'`;
				//console.log('trainingStr,,,,,,,,,,,,,,');
				//console.log(trainingStr);



				
				const trainingStr = `SELECT t.workout_name,pn.planet_name as upcoming_training,p.planet_name as completed_training,t.completed_training_id,t.cal_date,t.upcoming_training_id,t.another_parm,t.start_time,t.end_time,t.activity_id,t.activity_other,t.record_one,t.record_two,t.record_three,t. completed_training_guid_other,t.another_parm_other,s.sports_name,sb.sub_sports_name,a.activitie_name,p.planet_name FROM training t left join sports s on t.sport_id = s.id left join sub_sports sb on t.sub_sport_id = sb.sub_sports_id left join activities a on t.activity_id = a.id left join planet_training p on t.completed_training_id = p.id left join planet_training pn on t.upcoming_training_id = pn.id WHERE ${profille_id} ${wherStrid} and t.cal_date BETWEEN SYMMETRIC '${satrt_date}' and '${end_date}'`;

				 

                const trainingType = await db.query(trainingStr);
				result.trainingType = trainingType.rows;

				if(result.trainingType && typeof result.trainingType !== undefined && result.trainingType.length>0){
					for (var i = 0; i < result.trainingType.length; i++) {
						result.trainingType[i].type = "training";
						finalData.push(result.trainingType[i]);
					}
				}
				//var trainingTypeData = trainingType.rows;

				const meetingStr = `SELECT id,activity,location,from_time,to_time,cal_date,description,subscriber_id FROM meeting WHERE ${profille_id} and cal_date BETWEEN SYMMETRIC '${satrt_date}' and '${end_date}'`;
				//const meetingStr = `SELECT * FROM meeting WHERE subscriber_id=${profille_id}`;
				console.log('meetingStr...................');
				console.log(meetingStr)
                const meetingType = await db.query(meetingStr);
                result.meetingType = meetingType.rows;
				//var meetingTypeData = meetingType.rows;

				if(result.meetingType && typeof result.meetingType !== undefined && result.meetingType.length>0){
					for (var j = 0; j < result.meetingType.length; j++) {
						result.meetingType[j].type = "meeting";
						finalData.push(result.meetingType[j]); 
					}
				}


				//const matchStr = `SELECT * FROM match WHERE subscriber_id=${profille_id} and cal_date = '${date_time_value}'`;
				const matchStr = `SELECT m.practice_match,m.id,m.sport_id,m.sub_sport_id,m.tournament,e.event_name,t.tournament_name,m.event,m.home_team,m.against,m.cal_date,m.tournament_other,m.event_other,m.start_time,m.end_time,s.sports_name,sb.sub_sports_name FROM match m left join event as e on e.id:: varchar = m.event left join tournament as t on t.id :: varchar = m. tournament left join sports s on m.sport_id = s.id left join sub_sports sb on m.sub_sport_id = sb.sub_sports_id WHERE ${profille_id} ${wherStrid}and  m.cal_date BETWEEN SYMMETRIC '${satrt_date}' and '${end_date}'`;
                const matchType = await db.query(matchStr);
                result.matchType = matchType.rows;
				//var matchTypeData = matchType.rows;

				if(result.matchType && typeof result.matchType !== undefined && result.matchType.length>0){
					for (var k = 0; k < result.matchType.length; k++) {
						result.matchType[k].type = "match";
						finalData.push(result.matchType[k]);
					}
				}

				console.log('result............');
                console.log(result);


				//var tempArry = {date: date_time_value, training_data: trainingTypeData, meeting_data: meetingTypeData, match_data:matchTypeData };
				//var tempArry = {training_data: trainingTypeData, meeting_data: meetingTypeData, match_data:matchTypeData };
                
				//finalData.push(tempArry);
				//}


				//return result;
				return finalData;
				}

				catch (err) {

			    	console.log(err);
			    	console.log("err.......");
			    	
			      //  result.trainingType = [];
			      //  result.meetingType = [];


			}
		
	    }




	module.exports = { getCalender }