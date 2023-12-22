const db = require('../../db');

		


	const insert = async (req, res) => {
		try {
			var id=  req.body.subscriber_id;
		console.log('subscriber_id=============');
			
			console.log(id);

			await db.query(`BEGIN;`);
	        if (Array.isArray(req.body.meeting)) {

	            
	            console.log(req.body.meeting);

	            await db.query(`DELETE FROM meeting WHERE subscriber_id=${id}`);

	            
	            var inserting = '';

	            
	            for (let item of req.body.meeting) {
	                console.log("demo3");
	                
	                 if(!item.from_time || typeof item.from_time === "undefined" || item.from_time === undefined && item.from_time ===""){
                        item.from_time = null;
                    }
                     if(!item.to_time || typeof item.to_time === "undefined" || item.to_time === undefined && item.to_time ===""){
                        item.to_time = null;
                    }
                     if(!item.activity || typeof item.activity === "undefined" || item.activity === undefined && item.activity ===""){
                        item.activity = null;
                    }
                     if(!item.location || typeof item.location === "undefined" || item.location === undefined && item.location ===""){
                        item.location = null;
                    }
                     console.log('cal_date===========');
                     console.log(item.cal_date);
                     
                     inserting += `INSERT into meeting (from_time,to_time,cal_date,activity,location,subscriber_id,created_at, status) values ('${item.from_time}','${item.to_time}','${item.cal_date}','${item.activity}','${item.location}',${id},now(), 1) ;`;
					 }
	                
	                 
	            }

	            console.log("if inserting0000000000000000000000"); 
	            console.log(inserting);

	           if(inserting){
	            console.log("if inserting")
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
			    	
			    	let listStr = "SELECT * FROM meeting where status = 1  and subscriber_id ="+req.body.subscriber_id+" ORDER BY id"; 
			    	 

			         
			        let dataResult = await db.query(listStr);
			        result = dataResult.rows;
			    } catch (err) {
			        result = {};
			    }
			    return result;
		}


		const update = async (req, res) => {
	    	try {


	        	let statusStr = "UPDATE meeting SET from_time=" + req.body.from_time + ",to_time=" + req.body.to_time +",activity='" + req.body.activity + "',location='" + req.body.location + "', updated_at=now() WHERE id=" + req.body.id + "";

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
			
			let listStr = "SELECT * FROM meeting where status = 1 and id = "+req.body.id+" ORDER BY id";
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
			let deleteQry = "UPDATE meeting SET status = 2, updated_by = 1, updated_at = now() WHERE id = "+ req.body.id +"";

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