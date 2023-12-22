const db = require('../../db');
const moment = require('moment');
const now = moment();
const weekday = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
const monthArry = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];




const getCalender = async(req, res) => {

		console.log("getCalender: ");
		try{

			var profille_id = req.body.subscriber_id;
			//var current_year = req.query.current_year;
			console.log(profille_id);
			//();
			//var current_month = req.query.current_month;

			//var days_count = new Date(current_year, current_month, 0).getDate();

			//var date_time_value_temp = current_year+"-"+current_month+"-01";
			
			//var date_date_time_value_temp = new Date(date_time_value_temp);

			//var month_t = monthArry[date_date_time_value_temp.getMonth()];

			var result = {};
			//console.log("days_count: ");
			//console.log(days_count);
			var finalData = [];

			//for (var i = 1; i <= days_count; i++) {
				/*if(i<10){
					i = "0"+i;
				}*/
				//var date_time_value = current_year+"-"+current_month+"-"+i;
	
				//console.log("date_time_value: ");
				//console.log(date_time_value);			

				//var date_t = new Date(date_time_value);
				//var day_t = weekday[date_t.getDay()];

				//var date_time_text = i+" "+month_t+" "+day_t;				

				//const trainingStr = `SELECT * FROM training WHERE subscriber_id=${req.myID} and cal_date = '${date_time_value}'`;
				
				const trainingStr = `SELECT t.*, s.sports_name,sb.sub_sports_name,a.activitie_name FROM training t left join sports s on t.sport_id = s.id left join sub_sports sb on t.sub_sport_id = sb.sub_sports_id left join activities a on t.activity_id = a.id WHERE subscriber_id=${profille_id}`;
                const trainingType = await db.query(trainingStr);
				result.trainingType = trainingType.rows;
				var trainingTypeData = trainingType.rows;

				//const meetingStr = `SELECT * FROM meeting WHERE subscriber_id=${req.myID} and cal_date = '${date_time_value}'`;
				const meetingStr = `SELECT * FROM meeting WHERE subscriber_id=${profille_id}`;
                const meetingType = await db.query(meetingStr);
                result.meetingType = meetingType.rows;
				var meetingTypeData = meetingType.rows;


				//const matchStr = `SELECT * FROM match WHERE subscriber_id=${req.myID} and cal_date = '${date_time_value}'`;
				const matchStr = `SELECT m.*,s.sports_name,sb.sub_sports_name FROM match m left join sports s on m.sport_id = s.id left join sub_sports sb on m.sub_sport_id = sb.sub_sports_id WHERE subscriber_id=${profille_id}`;
                const matchType = await db.query(matchStr);
                result.matchType = matchType.rows;
				var matchTypeData = matchType.rows;


				console.log('result............'); 
                console.log(result);


				//var tempArry = {date: date_time_value, training_data: trainingTypeData, meeting_data: meetingTypeData, match_data:matchTypeData };
				var tempArry = {training_data: trainingTypeData, meeting_data: meetingTypeData, match_data:matchTypeData };
                
				finalData.push(tempArry);
				//}
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