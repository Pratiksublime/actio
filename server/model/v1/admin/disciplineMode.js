const db = require('../../../db');

		const insert = async (req, res) => {
		    try {

				let statusStr = "INSERT into discipline (discipline_name, created_at, status) values ('"+req.body.discipline_name+"', now(), 1) ";

				console.log('statusStr.............');
				console.log(statusStr);
		        await db.query(statusStr);
				return true;
		    	} catch (err) {
		        return false;
		    }
		}

		const list = async (req, res) => {
			    let result = {};
			    try {
			        let listStr = "SELECT * FROM discipline where status = 1 ORDER BY discipline_name";
			        let dataResult = await db.query(listStr);
			        result = dataResult.rows;
			    } catch (err) {
			        result = {};
			    }
			    return result;
		}


		const update = async (req, res) => {
	    	try {
	        	let statusStr = "UPDATE discipline SET discipline_name='" + req.body.discipline_name + "',updated_at=now() WHERE id=" + req.body.id + "";

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
			
			let listStr = "SELECT * FROM discipline where status = 1 and id = "+req.body.id+" ORDER BY discipline_name";
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
			let deleteQry = "UPDATE discipline SET status = 2, updated_by = 1, updated_at = now() WHERE id = "+ req.body.id +"";

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