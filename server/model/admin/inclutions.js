const db = require('../../db');
const helper = require('../../helper/helper');
const UploadFileLink =process.env.HOST+process.env.PORT+'/';
		const insert = async (req, res) => {
		    try {
                

             	if (req.body.inclutions) {
		            let sport = req.body.inclutions; 
		            let result = sport.toLowerCase();
		            
		            
		            let query = (`SELECT LOWER(inclutions) FROM tours_inclutions WHERE status = 1 and inclutions ILIKE '%${result}%'`); 
		            
		            var querydata =  await db.query(query);
		            
		            
		            if (querydata.rowCount) {
		                return {
		                    validationError: true,
		                    error: 'inclusions already exists ..!' 
		                } 
		            }
		        }

             	var inclutions_logo_data = ""; 
               
                console.log(req.body.inclutions_logo);
      			if (req.body.inclutions_logo) {
        		var img = req.body.inclutions_logo;
        		let isImage = /^data:image/.test(img);
                if (isImage) {
                let profilePath = 'images/awards/';
                let uploaded = helper.uploadBase64(img, profilePath);
                inclutions_logo_data = uploaded.path;  
                }
                                            
            }
				
				let statusStr = "INSERT into tours_inclutions (inclutions,image,created_at,status) values ('"+req.body.inclutions+"','"+inclutions_logo_data+"',now(), 1) ";
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
			        let listStr = "SELECT * FROM tours_inclutions WHERE status = 1 ORDER BY id desc";

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

	    			
					


	    		if(req.body.inclutions_logo){

	    			var img = req.body.inclutions_logo;
	        		let isImage = /^data:image/.test(img);
                                  if (isImage) {
                                  let profilePath = 'images/awards/';
                                  let uploaded = helper.uploadBase64(img, profilePath);
                                  console.log('uploaded');
                                  console.log(uploaded);
                                  inclutions_logo_data = uploaded.path; 
                                }
			             let statusStr = "UPDATE tours_inclutions SET updated_at=now() ,image = '"+inclutions_logo_data+"' WHERE id ='"+req.body.id+"'";

			            console.log("update statusStr:");
			            console.log(statusStr);

			            var statusStrdata = await db.query(statusStr);
			            if(statusStrdata){
			                let msg = "update"; 
			                return msg;

			            }
			        }
			        else{
			        	inclutions_logo_data = '';
			        }

					if (req.body.inclutions) {
		            let sport = req.body.inclutions; 
		            let result = sport.toLowerCase();
		            
		            let query = (`SELECT LOWER(inclutions) FROM tours_inclutions WHERE status = 1 and inclutions ILIKE '%${result}%'`);
		            //let query = (`SELECT LOWER(inclutions) FROM tours_inclutions WHERE status= 1 and inclutions = '${result}'`); 
		            
		            var querydata =  await db.query(query);
		            
		            
		            if (querydata.rowCount) {
		                return {
		                    validationError: true,
		                    error: 'inclusions already exists ..!'
		                }
		            }
		        }

	    			var inclutions_logo_data = ""; 
               		if (req.body.inclutions_logo) {
	        		var img = req.body.inclutions_logo;
	        		let isImage = /^data:image/.test(img);
                                  if (isImage) {
                                  let profilePath = 'images/awards/';
                                  let uploaded = helper.uploadBase64(img, profilePath);
                                  console.log('uploaded');
                                  console.log(uploaded);
                                  inclutions_logo_data = uploaded.path; 
                                }
                                            
                        }

               	let statusStr = "UPDATE tours_inclutions SET inclutions ='" + req.body.inclutions + "' WHERE id=" + req.body.id + ""; 

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
			
			let listStr = "SELECT * FROM tours_inclutions where status = 1 and id = "+req.body.id+" ";
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

				//SELECT * FROM tours where inclusion ILIKE '%190%' or inclusion ILIKE '190%' or inclusion ILIKE '%190'

			let nodelete = `SELECT * FROM tours where inclusion ILIKE '%${req.body.id}%' or inclusion ILIKE '%${req.body.id}' or  inclusion ILIKE '${req.body.id}%'`;
			
			
			let nodeletecount = await db.query(nodelete);

				if(nodeletecount.rowCount){
					 return {
		                    validationError: true,
		                    error: 'inclusions already used ..!' 
		                } 

				}

			
			let deleteQry = "UPDATE tours_inclutions SET status = 2 WHERE id = "+ req.body.id +"";

			
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