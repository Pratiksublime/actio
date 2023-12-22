const db = require('../../../db');

		const insert = async (req, res) => {
		    try {

				let statusStr = "INSERT into " + process.env.SCHEMA + ".position (position_name, created_at, status) values ('"+req.body.position_name+"', now(), 1) ";

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
			        let listStr = "SELECT * FROM position where status = 1 ORDER BY position_name";
			        let dataResult = await db.query(listStr);
			        result = dataResult.rows;
			    } catch (err) {
			        result = {};
			    }
			    return result;
		}


		const update = async (req, res) => {
	    	try {
	        	let statusStr = "UPDATE position SET position_name='" + req.body.position_name + "',updated_at=now() WHERE id=" + req.body.id + "";

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
			
			let listStr = "SELECT * FROM position where status = 1 and id = "+req.body.id+" ORDER BY position_name";
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
			let deleteQry = "UPDATE position SET status = 2, updated_by = 1, updated_at = now() WHERE id = "+ req.body.id +"";

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


	const insertlevel = async (req, res) => {
		    try {

				let statusStr = "INSERT into level (level_name, created_at, status) values ('"+req.body.level_name+"', now(), 1) ";

				console.log('statusStr.............');
				console.log(statusStr);
		        await db.query(statusStr);
				return true;
		    	} catch (err) {
		        return false;
		    }
		}

		const listlevel = async (req, res) => {
			    let result = {};
			    try {
			        let listStr = "SELECT * FROM level where status = 1 ORDER BY id";
			        //console.log(listStr);

			        let dataResult = await db.query(listStr);
			        result = dataResult.rows;
			    } catch (err) {
			    	//console.log(err);
			        result = {};
			    }
			    return result;
		}

		const updatelevel = async (req, res) => {
	    	try {
	        	let statusStr = "UPDATE level SET level_name='" + req.body.level_name + "',updated_at=now() WHERE id=" + req.body.id + "";

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

		const infolevel = async (req, res) => {
	    	let result = {};
	    	try {
	        	console.log("req.query.id: ");
	        	console.log(req.query.id);
			
			let listStr = "SELECT * FROM level where status = 1 and id = "+req.body.id+" ORDER BY level_name";
	        let dataResult = await db.query(listStr);
	        result = dataResult.rows;
	    	} catch (err) {
	        console.log("err:");
	        console.log(err);

	        result = {};
	    	}
	    	return result;
		}


		const Deletelevel = async(req, res) => {
			try{

			console.log('req.body.id')
			console.log(req.body.id)
			let deleteQry = "UPDATE level SET status = 2, updated_by = 1, updated_at = now() WHERE id = "+ req.body.id +"";

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
	


module.exports = { insert,list,update,info,Delete,insertlevel,listlevel,updatelevel,infolevel,Deletelevel }