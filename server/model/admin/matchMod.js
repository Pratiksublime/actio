const db = require('../../db');
//const helper = require('../../helper/helper');

	const insert = async (req, res) => {
		try {
			console.log("demo1");
			await db.query(`BEGIN;`);
	        if (Array.isArray(req.body.match)) {

	           var id = req.body.subscriber_id;
	            //await db.query(`DELETE FROM match WHERE subscriber_id=${id}`);
			var inserting = '';

	            
	        for (let item of req.body.match) {
	                
	                
	                if(!item.sport_id || typeof item.sport_id === "undefined" || item.sport_id === undefined && item.sport_id ===""){
                        item.sport_id = null;
                    }
                     if(!item.sub_sport_id || typeof item.sub_sport_id === "undefined" || item.sub_sport_id === undefined && item.sub_sport_id ===""){
                        item.sub_sport_id = null;
                    }
                     if(!item.tournament || typeof item.tournament === "undefined" || item.tournament === undefined && item.tournament ===""){
                        item.tournament = null;
                    }
                     if(!item.event || typeof item.event === "undefined" || item.event === undefined && item.event ===""){
                        item.event = null;
                    }
                     if(!item.home_team || typeof item.home_team === "undefined" || item.home_team === undefined && item.home_team ===""){
                        item.home_team = null;
                    }
                     if(!item.against || typeof item.against === "undefined" || item.against === undefined && item.against ===""){
                        item.against = null;
                    }
                    
                    if(item.event == 0){
                    	event_other = item.event_other
                    }
                    else{
                    	event_other = null;
                    }


                    if(item.tournament == 0){
                      tournament_other = item.tournament_other;
                    }
                    else{
                    	tournament_other = null;
                    }



                 if (item.id && item.id !== "" && typeof item.id !== undefined) {


	        		inserting = "UPDATE match SET sport_id=" + item.sport_id + ",sub_sport_id=" + item.sub_sport_id +",tournament='" + item.tournament + "',cal_date = '"+item.cal_date+"',tournament_other= '"+tournament_other+"',event='" + item.event + "',event_other='" + event_other + "',home_team='" + item.home_team + "',against='" + item.against + "', updated_at=now() WHERE id=" + item.id + "";

	        	}
                 else{ 
                    inserting += `INSERT into match (sport_id,sub_sport_id,tournament,tournament_other,cal_date,event,event_other,home_team,against,subscriber_id,created_at, status) values (${item.sport_id},${item.sub_sport_id}, '${item.tournament}','${tournament_other}','${item.cal_date}','${item.event}','${event_other}','${item.home_team}','${item.against}',${id},now(), 1) ;`;
                 }
				}
	                
	                 
	        }
	        console.log("inserting0000000000000000");
	        console.log(inserting);
	             
	           if(inserting){
	            var insertResult = await db.query(inserting);
	            await db.query(`COMMIT;`);
	            return true;
			}

	     }
	     
	    catch (err) {
			console.log(err);
			return false;
	    }
	}


		const list = async (req, res) => {
			    let result = {};
			    try {
			    	
			    	//let listStr = "SELECT * FROM match where status = 1 ORDER BY id";
			    	 let listStr = "SELECT a.*, b.sports_name as sport_name,t.tournament_name,e.event_name, c.sub_sports_name as sub_sport FROM match as a left join tournament as t on t.id  = a.tournament:: int left join event as e on e.id  = a.event:: int LEFT join sports as b on a.sport_id = b.id LEFT join sub_sports c on a.sub_sport_id = c.sub_sports_id where a.status = 1 and subscriber_id ="+req.body.subscriber_id+" ";

			         
			        let dataResult = await db.query(listStr);
			        result = dataResult.rows;
			    } 

			    catch (err) {
			    	
			        result = {};
			    }
			    return result;
		}


		const update = async (req, res) => {
	    	try {


	        	if (req.body.id && req.body.id !== "" && typeof req.body.id !== undefined) {


	        	let statusStr = "UPDATE match SET sport_id=" + req.body.sport_id + ",sub_sport_id=" + req.body.sub_sport_id +",tournament='" + req.body.tournament + "',event='" + req.body.event + "',home_team='" + req.body.home_team + "',against='" + req.body.against + "', updated_at=now() WHERE id=" + req.body.id + "";

	        }else{

	        		statusStr += `INSERT into match (sport_id,sub_sport_id,tournament,tournament_other,cal_date,event,event_other,home_team,against,subscriber_id,created_at, status) values (${item.sport_id},${item.sub_sport_id},${item.matchdate}, '${item.tournament}','${tournament_other}',,'${item.event}','${event_other}','${item.home_team}','${item.against}',${id},now(), 1) ;`;

	        }



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
			
			let listStr = "SELECT * FROM match where status = 1 and id = "+req.body.id+" ORDER BY id";
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
			let deleteQry = "UPDATE match SET status = 2, updated_by = 1, updated_at = now() WHERE id = "+ req.body.id +"";

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