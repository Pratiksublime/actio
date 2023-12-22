const db = require('../../../db');
const helper = require('../../../helper/helper');
const UploadFileLink =process.env.HOST+process.env.PORT+'/';
		const insert = async (req, res) => {
		    try {

				
				let statusStr = "INSERT into " + process.env.SCHEMA + ".academic_years (years, status) values ("+req.body.years+", 1) ";
				console.log('data dataResultdatadatadata'); 
				console.log(statusStr);
		        var data = await db.query(statusStr); 
		        //console.log('data dataResultdatadatadata'); 
				//console.log(data);
				return true;
		    	} catch (err) {
		    		console.log('err');
		    		console.log(err);
		        return false;
		    }
		}

		const list = async (req, res) => {
			    let result = {};
			    try {
			        let listStr = "SELECT * FROM academic_years WHERE status =1 ORDER BY id desc";

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


		const update = async (req, res) => {
	    	try {

               	let statusStr = "UPDATE academic_years SET years ='" + req.body.years + "',updated_at=now() WHERE id=" + req.body.id + "";

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
			
			let listStr = "SELECT * FROM academic_years where status = 1 and id = "+req.body.id+" ";
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
			let deleteQry = "UPDATE academic_years SET status = 2 WHERE id = "+ req.body.id +"";

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