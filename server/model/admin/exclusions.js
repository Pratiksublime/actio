const db = require('../../db');
const helper = require('../../helper/helper');
const UploadFileLink =process.env.HOST+process.env.PORT+'/';
		const insert = async (req, res) => {
		    try {



				if (req.body.exclusions) {
		            let sport = req.body.exclusions; 
		            let result = sport.toLowerCase();
		            
		            
		            let query = (`SELECT LOWER(exclusions) FROM tours_exclustions WHERE status = 1 and exclusions ILIKE '%${result}%'`); 
		            
		            var querydata =  await db.query(query);
		            
		            
		            if (querydata.rowCount) {
		                return {
		                    validationError: true,
		                    error: 'exclusions already exists ..!'
		                }
		            }
		        }

		    	var exclusionslogo_data = ""; 
               
               
      			if (req.body.exclusions_logo) {
        		var img = req.body.exclusions_logo;
        		console.log("oooooooooooooooooooooo");
        		console.log(img);

                let isImage = /^data:image/.test(img);
                if (isImage) {
                            let profilePath = 'images/awards/';
                            let uploaded = helper.uploadBase64(img, profilePath);
                            exclusionslogo_data = uploaded.path; 
                            }
                                            
                }

				let statusStr = "INSERT into tours_exclustions (exclusions,image,created_at,status) values ('"+req.body.exclusions+"','"+exclusionslogo_data+"',now(), 1) ";
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
			        let listStr = "SELECT * FROM tours_exclustions WHERE status =1 ORDER BY id desc";

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

				if(req.body.exclusions_logo){

	    			var img = req.body.exclusions_logo;
	        		let isImage = /^data:image/.test(img);
                                  if (isImage) {
                                  let profilePath = 'images/awards/';
                                  let uploaded = helper.uploadBase64(img, profilePath);
                                  console.log('uploaded');
                                  console.log(uploaded);
                                  inclutions_logo_data = uploaded.path; 
                                }
			             let statusStr = "UPDATE tours_exclustions SET updated_at=now() ,image = '"+inclutions_logo_data+"' WHERE id ='"+req.body.id+"'";

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



	    		if (req.body.exclusions) {
		            let sport = req.body.exclusions; 
		            let result = sport.toLowerCase();
		            
		            //let query =`SELECT LOWER(exclusions) FROM tours_exclustions WHERE status = 1 GROUP BY exclusions HAVING COUNT(*) > 1`
		            let query = (`SELECT LOWER(exclusions) FROM tours_exclustions WHERE status = 1 and exclusions ILIKE '%${result}%'`); 
 					
		            console.log('00000000000000000000000----------------------');
		            console.log(query);


		            var querydata =  await db.query(query);

		            
		            
		            
		            if (querydata.rowCount > 0 ) {
		            	console.log("66666666666666666666"); 
		                return {
		                    validationError: true,
		                    error: 'exclusions already exists ..!'
		                }
		            }

		           else{
		        	console.log("777777777777777777");

               		let statusStr = "UPDATE tours_exclustions SET exclusions ='" + req.body.exclusions + "',updated_at=now() WHERE id=" + req.body.id + "";  
					await db.query(statusStr);
	        		return true;
	        	}
		        }
		       
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
			
			let listStr = "SELECT * FROM tours_exclustions where status = 1 and id = "+req.body.id+" ";
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

		  	let nodelete = `SELECT * FROM tours where exclusion ILIKE '%${req.body.id}%' or exclusion ILIKE '%${req.body.id}' or  exclusion ILIKE '${req.body.id}%'`;
			
			
			let nodeletecount = await db.query(nodelete);

				if(nodeletecount.rowCount){
					 return {
		                    validationError: true,
		                    error: 'exclusion already used ..!' 
		                } 

				}

			let deleteQry = "UPDATE tours_exclustions SET status = 2 WHERE id = "+ req.body.id +"";

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