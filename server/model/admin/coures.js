const db = require('../../db');

		const insert = async (req, res) => {
		    try {


                if(req.body.coures_name == 0){

                	var coures_other = req.body.coures_other; 
                }
                else {
                	var coures_other = null;
                }
				let statusStr = "INSERT into coures(coures_name,coures_other,created_at,status) values ('"+req.body.coures_name+"','"+coures_other+"',now(), 1) ";

				console.log('statusStr.....................');
				console.log(statusStr);
		        await db.query(statusStr);
				return true;
		    	} catch (err) {
		    		console.log(err);
		        return false;
		    }
		}

		const list = async (req, res) => {
			    let result = {};
			    try {
			        let listStr = "SELECT * FROM coures where status = 1 ORDER BY id";
			        let dataResult = await db.query(listStr);
			        result = dataResult.rows;
			    } catch (err) {
			        result = {};
			    }
			    return result;
		}


		const update = async (req, res) => {
	    	try {


	    		if(req.body.coures_name == 0){

	    			var coures_other = req.body.coures_other; 
	    		}
	    		else{
	    			var coures_other = null;
	    		}
	        	let statusStr = "UPDATE coures SET coures_name ='" + req.body.coures_name + "',coures_other ='"+coures_other+"',updated_at=now() WHERE id=" + req.body.id + "";

	        	

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
			
			let listStr = "SELECT * FROM coures where status = 1 and id = "+req.body.id+" ORDER BY id";
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
			let deleteQry = "UPDATE coures SET status = 2,updated_at = now() WHERE id = "+ req.body.id +"";

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