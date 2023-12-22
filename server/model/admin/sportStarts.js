const db = require('../../db');

		const insert = async (req, res) => {
		    try {

				let statusStr = "INSERT into sport_starts (sport_id, starts, created_at, status) values ("+req.body.sport_id+",'"+req.body.starts+"', now(), 1) ";

				console.log('statusStr.............');
				console.log(statusStr);
		        await db.query(statusStr);
				return true;
		    	} catch (err) {
		    		console.log("err");
		    		console.log(err);
		        return false;
		    }
		}

		const list = async (req, res) => {
			    let result = {};
			    try {
			        let listStr = "SELECT * FROM sport_starts where status = 1";
			        let dataResult = await db.query(listStr);
			        result = dataResult.rows;
			    } catch (err) {
			        result = {};
			    }
			    return result;
		}


		const update = async (req, res) => {
	    	try {
	        	let statusStr = "UPDATE sport_starts SET sport_id = "+req.body.sport_id+", starts='" + req.body.starts + "',updated_at=now() WHERE sport_starts_id=" + req.body.sport_starts_id + "";

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
	        	console.log("req.query.sport_starts_id: ");
	        	console.log(req.query.sport_starts_id);
			
			let listStr = "SELECT * FROM sport_starts where status = 1 and sport_starts_id = "+req.body.sport_starts_id+" ";
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

			console.log('req.body.sport_starts_id')
			console.log(req.body.sport_starts_id)
			let deleteQry = "UPDATE sport_starts SET status = 2, updated_by = 1, updated_at = now() WHERE sport_starts_id = "+ req.body.sport_starts_id +"";

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

		const listByID = async (req, res) => {
			let result = {};
			try {
				let listStr = "SELECT * FROM sport_starts where status = 1 and sport_id = "+req.query.sport_id+" ";
				let dataResult = await db.query(listStr);
				result = dataResult.rows;

				console.log("listByID listStrquery: +++");
				console.log(listStr)

				console.log("listByID result: +++");
				console.log(result)

			} catch (err) {
				console.log("listByID err: ------------");
				console.log(err);


				result = {};
			}
			return result;
		}




module.exports = { insert,list,update,info,Delete, listByID }