const db = require('../../db');
const helper = require('../../helper/helper');

	const insert = async (req, res) => {
		try {
			 console.log("demo1");
			await db.query(`BEGIN;`);
			var id = req.body.subscriber_id;
	        if (Array.isArray(req.body.training)) {

	            console.log("req.myID ");
	            console.log(req.body.training);

	            await db.query(`DELETE FROM training WHERE subscriber_id=${id}`);

	            
	            var inserting = '';

	            console.log("demo2");
	            for (let item of req.body.training) {
	                console.log("demo3");
	                
	                 if(!item.sport_id || typeof item.sport_id === "undefined" || item.sport_id === undefined && item.sport_id ===""){
                        item.sport_id = null;
                    }
                     if(!item.sub_sport_id || typeof item.sub_sport_id === "undefined" || item.sub_sport_id === undefined && item.sub_sport_id ===""){
                        item.sub_sport_id = null;
                    }
                     if(typeof item.activity_id === "undefined" || item.activity_id === undefined && item.activity_id ===""){
                        item.activity_id = null;
                    }
                     if(typeof item.planned_training_id === "undefined" || item.planned_training_id === undefined && item.planned_training_id ===""){
                        item.planned_training_id = null;
                    }
                     if(!item.record_one || typeof item.record_one === "undefined" || item.record_one === undefined && item.record_one ===""){
                        item.record_one = null;
                    }
                     if(typeof item.completed_training_id === "undefined"  ){
                        item.completed_training_id = null;
                    }
                     if(!item.record_two || typeof item.record_two === "undefined" || item.record_two === undefined && item.record_two ===""){
                        item.record_two = null;
                    }
                     if(!item.another_parm || typeof item.another_parm === "undefined" || item.another_parm === undefined && item.another_parm ===""){ 
                        item.another_parm = null;
                    }
                     if(!item.record_three || typeof item.record_three === "undefined" || item.record_three === undefined && item.record_three ===""){
                        item.record_three = null;
                    }
                     if(!item.record_one_other || typeof item.record_one_other === "undefined" || item.record_one_other === undefined && item.record_one_other ===""){
                        item.record_one_other = null;
                    }
                     if(!item.record_two_other || typeof item.record_two_other === "undefined" || item.record_two_other === undefined && item.record_two_other ===""){
                        item.record_two_other = null;
                    }
                    if(!item.cal_date || typeof item.cal_date === "undefined" || item.cal_date === undefined && item.cal_date ===""){
                        item.cal_date = null;
                    }
                    if(!item.record_three_other || typeof item.record_three_other === "undefined" || item.record_three_other === undefined && item.record_three_other ===""){
                        item.record_three_other = null;
                    }
                    

                    if(!item.completed_training_parm || typeof item.completed_training_parm === "undefined" || item.completed_training_parm === undefined && item.completed_training_parm ===""){
                        item.completed_training_parm = null;
                    }
                    if(!item.completed_training_guid || typeof item.completed_training_guid === "undefined" || item.completed_training_guid === undefined && item.completed_training_guid ===""){
                        item.completed_training_guid = null;
                    }
                    if(!item.completed_training_guid_other || typeof item.completed_training_guid_other === "undefined" || item.completed_training_guid_other === undefined && item.completed_training_guid_other ===""){
                        item.completed_training_guid_other = null;
                    }
                    if(!item.another_parm_other || typeof item.another_parm_other === "undefined" || item.another_parm_other === undefined && item.another_parm_other ===""){
                        item.another_parm_other = null;
                    }
                     if(!item.activity_other || typeof item.activity_other === "undefined" || item.activity_other === undefined && item.activity_other ===""){
                        item.activity_other = null;
                    }
                     if(!item.planned_training_parm || typeof item.planned_training_parm === "undefined" || item.planned_training_parm === undefined && item.planned_training_parm ===""){
                        item.planned_training_parm = null;
                    }
                    console.log('item.planned_training_id------------------------------+++++++++++++++++'); 
                    console.log(item.planned_training_id);
	                inserting += `INSERT into training(sport_id,sub_sport_id,activity_id,upcoming_training_id,record_one,completed_training_id,record_two,another_parm,record_three,record_one_other,record_two_other,record_three_other,completed_training_parm,completed_training_guid,completed_training_guid_other,another_parm_other,activity_other,planned_training_parm,subscriber_id,cal_date,created_at,status) values(${item.sport_id},${item.sub_sport_id}, ${item.activity_id},${item.planned_training_id},'${item.record_one}',${item.completed_training_id},'${item.record_two}','${item.another_parm}','${item.record_three}','${item.record_one_other}','${item.record_two_other}','${item.record_three_other}','${item.completed_training_parm}','${item.completed_training_guid}','${item.completed_training_guid_other}','${item.another_parm_other}','${item.activity_other}','${item.planned_training_parm}',${id},'${item.cal_date}',now(), 1);`;


	                    // inserting += `INSERT INTO training(team_name,coach_name,logo,joining_year, till_year,sport_id,subscriber_id, created_at, status )VALUES ('${item.team_name}',${item.coach_name},'${(item.logo) ? "" + item.logo.replace(/'/g, '\'\'') + "" : null}',${item.joining_year},${item.till_year},${item.sport_id}, ${req.myID}, now(), 1);`;    
	             
	                }
	                
	                console.log("demo5");    
	            }
	            console.log("demo6");
	           console.log("inserting: ++++++");
	           console.log(inserting);

	           if(inserting){
	            console.log("if inserting")
	            var insertResult = await db.query(inserting);
	            
	            await db.query(`COMMIT;`);
	            
	            return true;

	        }

	      }
	     
	    catch (err) {

	        console.log("update err:");
	        console.log(err);

	        return false;
	    }
	}


		// const insert = async (req, res) => {
		//     try {

		// 		let statusStr = "INSERT into " + process.env.SCHEMA + ".training (sport_id,sub_sport_id,activity_id,planned_training_id,record_one,completed_training_id,record_two,another_parm,record_three,record_one_other,record_two_other,record_three_other,completed_training_parm,completed_training_guid,completed_training_guid_other,another_parm_other,activity_other,planned_training_parm,cal_date,created_at, status) values ("+req.body.sport_id+","+req.body.sub_sport_id+", "+req.body.activity_id+","+req.body.planned_training_id+",'"+req.body.record_one+"',"+req.body.completed_training_id+",'"+req.body.record_two+"','"+req.body.another_parm+"','"+req.body.record_three+"','"+req.body.record_one_other+"','"+req.body.record_two_other+"','"+req.body.record_three_other+"','"+req.body.completed_training_parm+"','"+req.body.completed_training_guid+"','"+req.body.completed_training_guid_other+"','"+req.body.another_parm_other+"','"+req.body.activity_other+"','"+req.body.planned_training_parm+"','"+req.body.cal_date+"',now(), 1) ";
		//         await db.query(statusStr);
		// 		return true;
		//     	} catch (err) {
					
		//         return false;
		//     }
		// }

		const list = async (req, res) => {
			    let result = {};
			    try {
			    	
			    	//let listStr = "SELECT * FROM training where status = 1 ORDER BY id";
			    	 let listStr = "SELECT a.*,a.upcoming_training_id as planned_training_id, b.sports_name as sport_name, c.sub_sports_name as sub_sport,d.activitie_name as activitie FROM training as a LEFT join sports as b on a.sport_id = b.id LEFT join sub_sports c on a.sub_sport_id = c.sub_sports_id left join activities d on a.activity_id = d.id where a.status = 1 and subscriber_id ="+req.body.subscriber_id+"";

			         
			        let dataResult = await db.query(listStr);
			        result = dataResult.rows;
			    } catch (err) {
			        result = {};
			    }
			    return result;
		}


		const update = async (req, res) => {
	    	try {

                   

	        	let statusStr = "UPDATE training SET sport_id=" + req.body.sport_id + ",sub_sport_id=" + req.body.sub_sport_id + ",activity_id=" + req.body.activity_id + ",planned_training_id=" + req.body.planned_training_id + ",record_one='" + req.body.record_one + "',completed_training_id=" + req.body.completed_training_id + ",record_two='" + req.body.record_two + "',another_parm='" + req.body.another_parm + "',record_three='" + req.body.record_three + "',record_one_other='" + req.body.record_one_other + "',record_two_other='" + req.body.record_two_other + "',record_three_other='" + req.body.record_three_other + "',completed_training_parm='" + req.body.completed_training_parm + "',completed_training_guid='" + req.body.completed_training_guid + "',completed_training_guid_other='" + req.body.completed_training_guid_other + "',another_parm_other='" + req.body.another_parm_other + "',activity_other='" + req.body.activity_other + "',planned_training_parm='" + req.body.planned_training_parm + "',cal_date='" + req.body.cal_date + "', updated_at=now() WHERE id=" + req.body.id + "";

	        	console.log("update statusStr:");
	        	console.log(statusStr);

	        	await db.query(statusStr);
	        	return true;
	    	} 	catch (err) {
	        
	        	console.log("update err:");
	        	console.log(err);

	        	return false;
	    	}
		}

		const info = async (req, res) => {
	    	let result = {};
	    	try {
	        	console.log("req.query.id: ");
	        	console.log(req.query.id);
			
			let listStr = "SELECT * FROM training where status = 1 and id = "+req.body.id+" ORDER BY id";
			console.log('listStr-----------------------------');
			console.log(listStr);
	        let dataResult = await db.query(listStr);
	        result = dataResult.rows;
	    	} catch (err) {
	        console.log("err:");
	        console.log(err);

	        result = {};
	    	}
	    	return result;
		}


		const Delete = async(req, res) => {
			try{

			console.log('req.body.id')
			console.log(req.body.id)
			let deleteQry = "UPDATE training SET status = 2, updated_by = 1, updated_at = now() WHERE id = "+ req.body.id +"";

			console.log(deleteQry)
			await db.query(deleteQry);
			return true;
			}
			catch(err){
			console.log("err:");
	    	console.log(err);
			return false;
		}
	}


module.exports = { insert,list,update,info,Delete }