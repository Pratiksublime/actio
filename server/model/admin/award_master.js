const db = require('../../db');
const helper = require('../../helper/helper');
const UploadFileLink =process.env.HOST+process.env.PORT+'/';
		const insert = async (req, res) => {
		    try {

				// var awardPath = 'images/award/';
				// var award_logo = req.body.award_logo;
				 var award_logo_new = ""; 

				if (req.body.award_logo) {
                               let isImage = /^data:image/.test(req.body.award_logo);
                                    if (isImage) {
                                    let profilePath = 'images/award/';
                                    let uploaded = helper.uploadBase64(req.body.award_logo, profilePath);
                                    console.log('uploaded');
				                    console.log(uploaded);
                                     award_logo_new = uploaded.path; 
                                }
                                            
                             }

		        

				let statusStr = "INSERT into " + process.env.SCHEMA + ".subscriber_play_awards_master (award_name,award_logo, status) values ('"+req.body.award_name+"','"+award_logo_new+"', 1) ";

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
			        let listStr = "SELECT id,award_name ,Concat('"+UploadFileLink+"', CASE WHEN award_logo  != '' THEN  Concat(award_logo) end) as award_logo FROM subscriber_play_awards_master WHERE status = 1 ORDER BY id desc";

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

                var award_logo_new = ""; 

				if (req.body.award_logo) {
                        let isImage = /^data:image/.test(req.body.award_logo);
                        if (isImage) {
                        let profilePath = 'images/award/';
                        let uploaded = helper.uploadBase64(req.body.award_logo, profilePath);
                        console.log('uploaded');
				        console.log(uploaded);
                        award_logo_new = uploaded.path;  
                    }
                                            
                 }


	        	let statusStr = "UPDATE subscriber_play_awards_master SET award_name ='" + req.body.award_name + "',award_logo='" + award_logo_new + "',updated_at=now() WHERE id=" + req.body.id + "";

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
			
			let listStr = "SELECT * FROM subscriber_play_awards_master where status = 1 and id = "+req.body.id+" ";
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
			let deleteQry = "UPDATE subscriber_play_awards_master SET status = 2 WHERE id = "+ req.body.id +"";

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