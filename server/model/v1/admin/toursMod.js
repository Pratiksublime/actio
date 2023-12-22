const db = require('../../../db');
const helper = require('../../../helper/helper');
//const UploadFileLink = process.env.HOST + process.env.PORT + '/images/tours/';
const UploadFileLink = process.env.HOST + process.env.PORT +'/' ;

// crypto module
const crypto = require("crypto");

const algorithm = "des-ede3"; 
const initVector = crypto.randomBytes(16);
const Securitykey = "abcdefghijklmnopqrstuvwx";
// the cipher function
const cipher = crypto.createCipheriv(algorithm, Securitykey, "");


// the decipher function
const decipher = crypto.createDecipheriv(algorithm, Securitykey, "");

decipher.setAutoPadding(false);

const insert = async(req, res) => {
	try {

		

		// var awardPath = 'images/award/';
		// var award_logo = req.body.award_logo;
		// var tour_logo_str = "";
		// if(req.body.tour_logo) {
		// 	let isImage = /^data:image/.test(req.body.tour_logo);
		// 	if(isImage) {
		// 		let tourPath = 'images/tours/';
		// 		let uploaded = helper.uploadBase64(req.body.tour_logo, tourPath);
		// 		console.log('uploaded');
		// 		console.log(uploaded);
		// 		tour_logo_str = uploaded.path;
		// 	}
		// }

		// var tour_tile_img_str = "";
		// if(req.body.tour_tile_img) {
		// 	let isImage = /^data:image/.test(req.body.tour_tile_img);
		// 	if(isImage) {
		// 		let tourPath = 'images/tours/';
		// 		let uploaded = helper.uploadBase64(req.body.tour_tile_img, tourPath);
		// 		tour_tile_img_str = uploaded.path;
		// 	}
		// }

		// var banner_str = "";
		// if(req.body.banner) {
		// 	let isImage = /^data:image/.test(req.body.banner);
		// 	if(isImage) {
		// 		let tourPath = 'images/tours/';
		// 		let uploaded = helper.uploadBase64(req.body.banner, tourPath);
		// 		banner_str = uploaded.path;
		// 	}
		// }

		


		var downloads_str = "";
		if(req.body.downloads) {
			let isImage = /^data:image/.test(req.body.downloads);
			if(isImage) {
				let tourPath = 'images/tours/';
				let uploaded = helper.uploadBase64(req.body.downloads, tourPath);
				downloads_str = uploaded.path; 
			}
		}

		

		if( typeof req.body.start_date == undefined || req.body.start_date ==""  || req.body.start_date == null){
			req.body.start_date = null;
		}

		if( typeof req.body.city_id =="undefined" && req.body.city_id ==""){
			req.body.city_id = null;
		}

		if (typeof req.body.end_date =="undefined" || req.body.end_date =="" || req.body.end_date == null){
			req.body.end_date = null;
		}

		if( typeof req.body.no_of_day =="undefined"  || req.body.no_of_day =="" || req.body.no_of_day == null){
			req.body.no_of_day = null;
		}

		if( typeof req.body.no_of_nights =="undefined" || req.body.no_of_nights =="" || req.body.no_of_nights == null){
			req.body.no_of_nights = null;
		}

		if( typeof req.body.tours_details =="undefined" || req.body.tours_details =="" || req.body.tours_details == null){
			//encryptedData = null;
			req.body.tours_details = null;
		}

		if( typeof req.body.tour_inclutions =="undefined" || req.body.tour_inclutions == "" || req.body.tour_inclutions == null){
			req.body.tour_inclutions = null;
		}
		if(typeof req.body.tour_exclustions =="undefined" || req.body.tour_exclustions =="" || req.body.tour_exclustions == null){
			req.body.tour_exclustions = null;
		}
		if( typeof req.body.documents =="undefined" || req.body.documents ==""){
			req.body.documents = null;
		}
		if(typeof req.body.featured_data ==="undefined" || req.body.featured_data == "" || req.body.featured_data == null ){
			req.body.featured_data = null;
		}
		if( typeof req.body.package_title =="undefined" || req.body.package_title =="" || req.body.package_title == null){
			req.body.package_title = null;
		}
		if( typeof req.body.packagesub_title =="undefined" || req.body.packagesub_title =="" || req.body.packagesub_title == null){
			req.body.packagesub_title = null;
		}
		if( typeof req.body.tour_description =="undefined" || req.body.tour_description =="" || req.body.tour_description == null){
			req.body.tour_description = null;
		}
		if( typeof req.body.subsport_id =="undefined" || req.body.subsport_id ==""  || req.body.subsport_id == null){
			req.body.subsport_id = null;
		}



		if( typeof req.body.sport_id ==="undefined" || req.body.sport_id === ""){  
			req.body.sport_id = null;
		}
		if( typeof req.body.state_id ==="undefined" || req.body.state_id === ""){  
			req.body.state_id = null;
		}

		if( typeof req.body.video_link ==="undefined" || req.body.video_link === "" || req.body.video_link === null){ 
			req.body.video_link = null;
		}



		// let encryptedData = cipher.update(req.body.tours_details, "utf-8", "base64");

		// encryptedData += cipher.final("base64");

		// console.log("Encrypted message: " + encryptedData);

		
		
		
          
		let statusStr = "INSERT into tours (tour_name,tour_type,country_id,state_id,city_id,sport_id,subsport_id,start_date,end_date,no_of_day,no_of_nights,video_link,tours_details,featured_data,package_title, packagesub_title,inclusion,exclusion,tour_description,created_at,status) values ('"+req.body.tour_name+"',"+req.body.tour_type+"," +req.body.country_id+","+req.body.state_id+","+req.body.city_id+",'"+req.body.sport_id+"',"+req.body.subsport_id+",'"+req.body.start_date+"','"+req.body.end_date+"',"+req.body.no_of_day+","+req.body.no_of_nights+",'"+req.body.video_link+"','"+req.body.tours_details+"','"+req.body.featured_data+"','"+req.body.package_title+"', '"+req.body.packagesub_title+"','"+req.body.inclusion+"','"+req.body.exclusion+"','"+req.body.tour_description+"',now(), 1)RETURNING id ";
		

		
		var data = await db.query(statusStr);

		if(data.rowCount > 0) {

		const tour_id = data.rows[0].id;
			
			// if (req.body.banner.length>0) {
			// 	var tourPath = 'images/tours/';
   //              console.log("banner: ");
   //              var created_by = 1;
   //              let insertBanner = [];
   //              for (let item of req.body.banner) {
                    
   //                  /*const path = helper.uploadBase64(item, olympicPath + 'banner/');
   //                  insertBanner.push(`('banner','${path.path}',now(),${req.myID},1,${olympic_id})`)*/
   //                  console.log("item:-------------------------------- ");
   //                  console.log(item);

   //                  if(Array.isArray(item) && item.length){
                
   //                  	var path = helper.uploadBase64(item, tourPath);
   //                  	insertBanner.push(`('banner','${path.path}',now(),1,${tour_id})`)
   //              	}
   //              	else{
   //              		insertBanner.push(`('banner',null,now(),1,${tour_id})`)
   //              	}

   //              }
   //              const jointBanners = insertBanner.join();
   //              const insert = `INSERT INTO ${process.env.SCHEMA}.tour_attachment (
   //                  type, attachment, created_at,status, tour_id) VALUES ${jointBanners};`;
   //              await db.query(insert);

   //              console.log("jointBanners: ");
   //                      console.log(insert);

   //          }
    
  
			
            if (req.body.banner[0] !== null) {
                let tourPath = 'images/tours/';
                logo = helper.uploadBase64(req.body.banner[0], tourPath );
                var logoNew = logo.path;
                console.log("logo insert:");
                let logoQuery = `INSERT INTO ${process.env.SCHEMA}.tour_attachment (
                        type, attachment, created_at, status, tour_id) VALUES ('banner','${logoNew}',now(),1,${tour_id})`
			await db.query(logoQuery);

                
            }
            else{
            	var logoNew = 'images/tours/bg-layar.53d34359ca2f2062.png';
            }
            



			// if (req.body.banner.length>0) {
   //              let tourPath = 'images/tours/';
   //              logo = helper.uploadBase64(req.body.banner[0], tourPath + 'banner/');
   //              logoNew = logo.path;
   //              console.log("logo insert:");
   //              let logoQuery = `INSERT INTO ${process.env.SCHEMA}.tour_attachment (
   //                      type, attachment, created_at, status, tour_id) VALUES ('banner','${logoNew}',now(),1,${tour_id})`

   //                      console.log("logo logoQuery: ");
   //                      console.log(logoQuery);

   //              await db.query(logoQuery);

   //              console.log("logo: insert ++++++++++++++++++++++++++++++++"); 
   //          }
              
            if (req.body.tour_tile_img[0] !== null) {
                let tourPath = 'images/tours/';
                logo = helper.uploadBase64(req.body.tour_tile_img[0], tourPath);
                

                var logoNewtile = logo.path;
                console.log("logo insert:");
                let logoQuery = `INSERT INTO ${process.env.SCHEMA}.tour_attachment (
                        type, attachment, created_at, status, tour_id) VALUES ('tile','${logoNewtile}',now(),1,${tour_id})`

                        console.log("logo logoQuery: ");
                        console.log(logoQuery);

                await db.query(logoQuery);

                
            }
            else{
            	var logoNewtile = '';
            }
              
              
            if (req.body.tour_logo[0] !== null) {
                let tourPath = 'images/tours/';
                logo = helper.uploadBase64(req.body.tour_logo[0], tourPath );
                var logoNewlogo = logo.path;
                console.log("logo insert:");
                let logoQuery = `INSERT INTO ${process.env.SCHEMA}.tour_attachment (
                        type, attachment, created_at, status, tour_id) VALUES ('logo','${logoNewlogo}',now(),1,${tour_id})`

                        console.log("logo logoQuery: ");
                        console.log(logoQuery);

                await db.query(logoQuery);

                
            }
            else{
            	var logoNewlogo = '';
            }

			//console.log('tour_id------------------------');
			//console.log(req.body.iternary);

			if(req.body.iternary ) {
				let iternarystr = req.body.iternary;
				
				if(Array.isArray(iternarystr)) {
					for(var i = 0; i < iternarystr.length; i++) {
						console.log('demo');
						let iternarydata = "INSERT into tours_iternary (tour_id,day_number,day_title,day_description,created_at,status) values(" + tour_id + "," + iternarystr[i].day_number + ",'" + iternarystr[i].day_title + "','" + iternarystr[i].day_description + "',now(),1)";
						
						await db.query(iternarydata);
					}
				} else {
					let iternarydata = "INSERT into tours_iternary (tour_id,day_number,day_title,day_description,created_at,status) values(" + tour_id + "," + iternarystr.day_number + ",'" + iternarystr.day_title + "','" + iternarystr.day_description + "',now(),1)";
					
					await db.query(iternarydata);
				}
			}

			if(req.body.inclutions){

				var inclutionsstr = req.body.inclutions;

				if(Array.isArray(inclutionsstr)){
					for (var i = 0; i < inclutionsstr.length; i++) {

						
						let inclutionsdata = "INSERT into tours_inclutions (tour_id,inclutions,created_at,status) values(" +tour_id+ ",'" +inclutionsstr[i].inclutions + "',now(),1)";

							await db.query(inclutionsdata);
					}
					
				}

				
			}

			if(req.body.exclustions){

				let exclustionsstr = req.body.exclustions;
				if(Array.isArray(exclustionsstr)){
					for (var i = 0; i < exclustionsstr.length; i++) {
						let exclustionsdata = "INSERT into tours_exclustions(tour_id,exclustions,created_at,status) values("+tour_id+",'"+exclustionsstr[i].exclustions+"',now(),1)";
						await db.query(exclustionsdata);
					}
					
				}
				
			}

			if(req.body.documents){

				let documentsstr = req.body.documents;
				if(Array.isArray(documentsstr)){
					for (var i = 0; i < documentsstr.length; i++) {
						let documentsdata = "INSERT into tours_documents (tour_id,documents,created_at,status) values("+tour_id+",'"+documentsstr[i].documents+"',now(),1)";
						await db.query(documentsdata);
					}
					
				}
				
			}

			

			if(req.body.gallery){
				var gallerydata = req.body.gallery;

				
				if(Array.isArray(gallerydata)) {

						
					for(var k = 0; k < gallerydata.length; k++) {

						
						var gallerydata_str = null;
						var cover_img_str = null;
							if(gallerydata[k].image) { 
								
								let isImage = /^data:image/.test(gallerydata[k].image);
								if(isImage) {
									let tourPath = 'images/tours/';
									let uploaded = helper.uploadBase64(gallerydata[k].image, tourPath);
									  
									console.log(uploaded)
									var gallerydata_str = uploaded.path;  
								}
							}

							if(gallerydata[k].cover_img) { 
								
								let isImage = /^data:image/.test(gallerydata[k].cover_img);
								if(isImage) {
									let tourPath = 'images/tours/';
									let uploaded = helper.uploadBase64(gallerydata[k].cover_img, tourPath);
									  
									console.log(uploaded)
									var cover_img_str = uploaded.path;  
								}
							}

						    let insertstr = "INSERT into tours_gallery(tour_id,media_type,title,sport_id,date,image,cover_img,video_url ,created_at,status) values (" + tour_id + ",'" + gallerydata[k].media_type + "','"+gallerydata[k].title+"','"+gallerydata[k].sport_id+"','"+gallerydata[k].date+"','" + gallerydata_str + "','"+cover_img_str+"','" + gallerydata[k].video_url + "',now(),1)";
						     
						    
						await db.query(insertstr); 
					}
				} 


				else {


						var gallerydata_str = null;
						var cover_img_str =null;
							if(gallerydata.image) {
								let isImage = /^data:image/.test(gallerydata.image);
								if(isImage) {
									let tourPath = 'images/tours/';
									let uploaded = helper.uploadBase64(gallerydata.image, tourPath);
									gallerydata_str = uploaded.path; 
								}
							}

							if(gallerydata.cover_img) { 
								
								let isImage = /^data:image/.test(gallerydata.cover_img);
								if(isImage) {
									let tourPath = 'images/tours/';
									let uploaded = helper.uploadBase64(gallerydata.cover_img, tourPath);
									  
									console.log(uploaded)
									var cover_img_str = uploaded.path;  
								}
							}
					let insertstr = "INSERT into tours_gallery(tour_id,media_type,title,sport_id,date,image,cover_img,video_url,created_at,status) values (" + tour_id + ",'" + gallerydata.media_type + "','"+gallerydata.title+"','"+gallerydata.sport_id+"','"+gallerydata.date+"','" + gallerydata_str + "','"+cover_img_str+"','" + gallerydata.video_url + "',now(),1";

					
					await db.query(insertstr);
				}
			}
		return tour_id;

	}else{
		return false;
	}
		
	} catch(err) {
		console.log('err');
		console.log(err);
		return false;
	}
}

const tours_downloads = async (req,res) => {
try{
		
	if(req.body.title!== undefined){
     const moment = require('moment');
    if(Array.isArray(req.body.title)){
     	let downloadsStr = req.body.title;
     	for (var i = 0; i < downloadsStr.length; i++) {

     		var stingstr = req.files.image;


     		
			if (stingstr && typeof stingstr !== "undefined" && stingstr.length > 0 || stingstr!== null) {
			var element = stingstr[i];
			console.log("element......................");
			console.log(element);

			var image_name =  moment().format('MMDDYYYYHHmmss') + element.name;
			element.mv('./images/tours/' + image_name);
			var brochure_str = image_name;

			console.log("brochure_str......................");
			console.log(brochure_str);



		}
		else{

			var brochure_str = null;
		}

        let insertstr = "INSERT into tours_downloads (tour_id,title,image,created_at,status) values ("+req.body.tour_id+",'"+req.body.title[i]+"','" + brochure_str + "',now(),1)";

        console.log('kkkkkkkkkkkkkkkkkkk');
        console.log(insertstr);
			await db.query(insertstr);
     	}
     }

    else { 
    	console.log('gjnnnnnnnnnnnnnnnnn');
    	console.log(req.body.title);
     	
         if ( req.files == null ||  req.files.length == 0) { 
			console.log('demo');
			var brochure_str = null;

		}

		else {

			var element = req.files.image;

			if(element!== undefined){
			var image_name =  moment().format('MMDDYYYYHHmmss') + element.name;       
			element.mv('./images/tours/' + image_name);  
			var brochure_str = image_name;
			}
			
			else{
			var brochure_str = null;
			}

			//var brochure_str = null;
		}

		if (typeof req.body.title== undefined || req.body.title =="" ) {   
			req.body.title = null;
		}
		


        let insertstr = "INSERT into tours_downloads (tour_id,title,image,created_at,status) values ("+req.body.tour_id+",'"+req.body.title+"','" + brochure_str + "',now(),1)";
		console.log(insertstr);
		console.log('insertstr............................')
		await db.query(insertstr);
     	
     }
 }

 if(req.files!== null){


     // if(req.files.brochure && typeof req.files.brochure !== undefined && req.files.brochure !== ""){
     if (Array.isArray(req.files!== null )) { 
            var stingstr = req.files.brochure;
           
            let insertSponsor = '';
            for(var j = 0; j < req.files.brochure.length; j++) {
                
						var brochure_str = "";
							if ( typeof stingstr !== undefined || stingstr.length > 0) {
							var element = stingstr[j]; 
							
							//var image_name= now.format("YYYYMMDDHHmmss")+element.name;
							var image_name = moment().format('MMDDYYYYHHmmss') + element.name;

							element.mv('./images/tours/' + image_name);
							brochure_str = image_name;

						}
						else{
							brochure_str = null;
						}

                
                let insertstr = "INSERT into tours_Presentation (tour_id,brochure,created_at,status) values (" + req.body.tour_id + ",'" + brochure_str + "',now(),1)";

					
					await db.query(insertstr);
            }

         }
     // }

   else{
            
        var brochure_strs = "";
		if( req.files!== null) {
	    const moment = require('moment');
		var element = req.files.brochure;
		var image_name = moment().format('MMDDYYYYHHmmss') + element.name;  
		element.mv('./images/tours/' + image_name);
		brochure_strs = image_name;

		}
		else{
			 var brochure_strs = null;
		}

                
        let insertstr = "INSERT into tours_Presentation (tour_id,brochure,created_at,status) values (" + req.body.tour_id + ",'" + brochure_strs + "',now(),1)";
       
			await db.query(insertstr);

         }
	}

     return true;


}
catch(err){

console.log(err);
return false;
}
}


const tours_presentation_update = async (req,res) => {
	try{
		  console.log("0000000000000000000000");
		 const moment = require('moment'); 
	
		 let insertstrde = "delete from tours_downloads where id in ("+req.body.delete_download_id+") ";
		 
		 console.log('insertstrde............');
		 console.log(insertstrde);
	
	
		 await db.query(insertstrde);

		//  if (req.body.tour_id && req.body.tour_id!== null && req.body.tour_id!== 'undefined'){ 
		// 	if(Array.isArray(req.body.title)){
		// 		var downloadsStr = req.body.title;
		// 		for (var i = 0; i < downloadsStr.length; i++) {
		// 			console.log(req.files);
		// 			if (req.files!== null)  {
		// 				var element = req.files.image[i];
		// 				var image_name = moment().format('MMDDYYYYHHmmss') + element.name;   
		// 				element.mv('./images/tours/' + image_name); 
		// 				var brochure_str = image_name;
			
		// 			}
		// 			else{
		// 				var brochure_str = null;  
		// 			}
		// 	    let insertstr = "INSERT into tours_downloads (tour_id,title,image,created_at,status) values ("+req.body.tour_id+",'"+req.body.title[i]+"','" + brochure_str + "',now(),1)";

		// 		console.log("insertstr more data...............000000000000000000000000000000000000000");   
		// 	 	console.log(insertstr);

		// 		await db.query(insertstr);
		// 	}
		//  }
		// }
		
				 
	if(Array.isArray(req.body.title)){

			 let downloadsStr = req.body.title;
			 console.log("1111111111");
			 
			 console.log(req.body);
			 for(var i = 0; i < downloadsStr.length; i++) {
			
			console.log('image_url00000000000000000000000000000000000000000000000000000000000000,,,,111');
			
			console.log('image_urliiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii,,,,111');
			
			if(req.files!== null){
			if (req.files.image)  {
				
				var element = req.files.image[i]; 

				if(element== undefined){
					
					element = req.files.image  
				}
				
				var image_name =  moment().format('MMDDYYYYHHmmss') + element.name;   
				element.mv('./images/tours/' + image_name);  
				var brochure_str = image_name;
	
			}
		}
			else{
				var brochure_str = null;  
			}

			
			if (req.body.download_id[i] && typeof req.body.download_id[i] !== 'undefined' && req.body.download_id[i]!== null && req.body.download_id[i]!== '' && req.body.download_id[i]!=='undefined'){  
	
	         	let insertstr = "UPDATE tours_downloads SET title = '" + req.body.title[i] + "',image = '"+ req.body.image_url[i] +"',updated_at = now() WHERE id = "+req.body.download_id[i]+" ";
	
				console.log("update more data........7777.");   
	         	console.log(insertstr);
	
	         	await db.query(insertstr); 
	         }else{
				
	
	        	let insertstr = "INSERT into tours_downloads (tour_id,title,image,created_at,status) values ("+req.body.tour_id+",'"+req.body.title[i]+"','" + brochure_str + "',now(),1)";
	
	        	console.log("insertstr more data...............3333333333333333333333333333333333");  
	         	console.log(insertstr);
	
				await db.query(insertstr);
			}
		 }
	}
	
	else{
			console.log('else data+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++....');



			
	// 		//  console.log(req.body.download_id);
	// 		// 	 //var stingstr = req.files.image;
	// 		// 	 console.log('img');
	// 		//    console.log(req.body.image_url); 
	// 		// 	var brochure_str_url = req.body.image_url; 
	// 		// 	console.log('error here printing files object ');
	// 		// 	console.log(req.files); 
	// 		// 	if (req.files!== null) {
	// 		// 	// var element = req.files.image;
	// 		// 			if (req.files.image!== null || req.files.image!== '' || req.files.image!== undefined) {
	// 		// 				console.log('in trouble');
	// 		// 				var element = req.files.image;
	// 		// 				//let tourPath = 'images/tours/';					
	// 		// 				console.log('after error here printing req.files.brochure');
	// 		// 				console.log(req.files.brochure);
	// 		// 				console.log('after error here printing element.name');
	// 		// 				console.log(element.name);
	// 		// 				var image_name =  moment().format('MMDDYYYYHHmmss') + element.name;
	// 		// 				element.mv('./images/tours/' + image_name);
	// 		// 				var brochure_str = image_name;
	// 		// 			}
	// 		// 	}
	// 		// 	else{
		
	// 		// 		var brochure_str = null
	// 		// 	}
	// 		// console.log("here are list of values before ");
	// 		// console.log(req.body);
	// 		// console.log("2NDLY here are list of values before ");
	// 		// console.log(req.body.download_id);

			
			console.log(req.files)
			console.log('req.files.......11')

			console.log('req.files.image.....11.')
			
			if(req.files!== null){
			if (req.files.image)  {
				var element = req.files.image;
				var image_name =  moment().format('MMDDYYYYHHmmss') + element.name;   
				element.mv('./images/tours/' + image_name); 
				var brochure_str = image_name;
	
			}
			else{
				var brochure_str = null;  
			}

		}
			if (req.body.download_id && typeof req.body.download_id !== undefined){
				console.log("----------------------UPDATE-----------------------------");
				
				 let insertstr = "UPDATE tours_downloads SET title = '" + req.body.title + "',image = '"+req.body.image_url+"',updated_at = now() WHERE id = "+req.body.download_id+" ";
	
				console.log("insertstr22288888888888888");  
				 console.log(insertstr);
	
				 await db.query(insertstr); 
			 }
			
			else{
				console.log("----------------------INSERT-----------------------------");
				if(req.body.title && req.body.title!== null && req.body.title!=='' && req.body.title!==undefined )
				{
					let insertstr = "INSERT into tours_downloads (tour_id,title,image,created_at,status) values ("+req.body.tour_id+",'"+req.body.title+"','" + brochure_str + "',now(),1)"; 
					console.log("insertstr deeeeeeeeeeeeeeeeeeeeeeee");
					console.log(insertstr)
					await db.query(insertstr);
				}
			 }
			 
		 }
	
		
			if(req.body.delete_presentation_id){	 
			console.log(' ............................');
			let insertstrde = "delete from tours_Presentation where id in ("+req.body.delete_presentation_id+") ";
				 
			console.log('tours_Presentation delete............');
			console.log(insertstrde);
		   await db.query(insertstrde);
			
			}
	
if(req.files!== null){
	if (req.files.brochure ) {
		
		

				var stingstr = req.files.brochure;
				console.log('we are in brochure now '  + stingstr); 
				
				if (stingstr && typeof stingstr!== "undefined" ) {
								var element = stingstr;
								
								
								var image_name = moment().format('MMDDYYYYHHmmss') + element.name;
								console.log("oooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo"+image_name);		
								element.mv('./images/tours/' + image_name);
								var brochure_str = image_name;
	
							}else{
								var brochure_str = '';
							}
	
					if(req.body.presentation_id && typeof req.body.presentation_id !== undefined && req.body.presentation_id !== ""){
					var insertstr = "UPDATE tours_Presentation SET brochure = '" + brochure_str + "',updated_at = now() WHERE id = "+req.body.presentation_id+" ";
					
				}
	
				else{
	
					var insertstr = "INSERT into tours_Presentation (tour_id,brochure,created_at,status) values (" + req.body.tour_id + ",'" + brochure_str + "',now(),1)";
					console.log("insertstr----------------------");
					
					}
					console.log("update---------------- ------");
					console.log(insertstr)
					await db.query(insertstr);
						
				
	
			 
		 }
		}
		
	
	return true;
	
	}
	catch(err){
		console.log(err);
	return false;
	}
	}
	


const tours_downloadsinfo = async(req,res) =>{
	var result = {};
	try{
        let downloadinfo ="SELECT id,title,description, CASE WHEN image IS NULL THEN '' ELSE Concat('"+UploadFileLink+"',image) END as image FROM tours_downloads WHERE id = "+req.body.id+"";
        console.log(downloadinfo);
        let data = await db.query(downloadinfo);
        result = data.rows;

        return result; 
	}
	catch(err){

		return result = {};

	}
}


// const tours_downloadsinfo = async(req,res) =>{
// 	var result = {};
// 	try{
//         let downloadinfo ="SELECT id,title,description, CASE WHEN image IS NULL THEN '' ELSE Concat('"+UploadFileLink+"',image) END as image FROM tours_downloads WHERE id = "+req.body.id+"";
//         console.log(downloadinfo);
//         let data = await db.query(downloadinfo);
//         result = data.rows;

//         return result; 
// 	}
// 	catch(err){

// 		return result = {};

// 	}
// }



const tours_presentation = async (req, res) => {
   try {
        console.log("req.body.sport");
        console.log(req.files.brochure);

        const moment = require('moment');
        if (Array.isArray(req.files.brochure)) {
            var stingstr = req.files.brochure;
           
            let insertSponsor = '';
            for(var j = 0; j < req.files.brochure.length; j++) {
                console.log("for item+"); 
                console.log(req.files.brochure)


                        var brochure_str = "";
							if (stingstr && typeof stingstr !== "undefined" && stingstr.length > 0) {
							var element = stingstr[j];
							
							//var image_name= now.format("YYYYMMDDHHmmss")+element.name;
							var image_name = moment().format('MMDDYYYYHHmmss') + element.name;

							element.mv('./images/tours/' + image_name);
							brochure_str = image_name;

						}

                
                let insertstr = "INSERT into tours_Presentation (tour_id,brochure,created_at,status) values (" + req.body.tour_id + ",'" + brochure_str + "',now(),1)";

					console.log("insertstr----------------------");
					console.log(insertstr);
					await db.query(insertstr);
            }

         }
    else{

        var brochure_str = "";
		if (stingstr && typeof stingstr !== "undefined" && stingstr.length > 0) {
		var element = stingstr[j];
		var image_name = moment().format('MMDDYYYYHHmmss') + element.name;

		element.mv('./images/tours/' + image_name);
		brochure_str = image_name;

		}

                
        let insertstr = "INSERT into tours_Presentation (tour_id,brochure,created_at,status) values (" + req.body.tour_id + ",'" + brochure_str + "',now(),1)";
			await db.query(insertstr);

         }
        return true;
       
    }
    catch (err) {
        console.log("err: ");
        console.log(err);
        await db.query(`ROLLBACK;`);
        return {
            serverError: true,
            error: err.message
        }
    }
}

const tours_presentation_update_old = async (req, res) => {
   try {
        
        var stingstr = req.files.brochure;

        const moment = require('moment');
        
    	var brochure_str = "";

		if (stingstr && typeof stingstr !== "undefined" ) {
		var element = stingstr;
		var image_name = moment().format('MMDDYYYYHHmmss') + element.name;
		console.log(image_name);
		element.mv('./images/tours/' + image_name);
		brochure_str = image_name;

		}

                
        let insertstr = "UPDATE tours_Presentation SET brochure = '" + brochure_str + "',updated_at = now() WHERE id = "+req.body.id+" ";
		await db.query(insertstr);

     }
    catch (err) {
        console.log("err: ");
        console.log(err);
        await db.query(`ROLLBACK;`);
        return {
            serverError: true,
            error: err.message
        }
    }
     return true;
}

const tours_presentation_info = async (req, res) => {
   let result = {};

   try {
        
    let selectstr = "SELECT id ,CASE WHEN brochure IS NULL THEN '' ELSE Concat('"+UploadFileLink+"images/tours/',brochure) END as brochure from tours_presentation WHERE id = "+req.body.id+" ";
	let datainfo  = await db.query(selectstr);
	
	console.log(datainfo);
	result = datainfo.rows;

     }

    catch (err) {
        console.log("err: ");
        console.log(err);
        
        
    }
    
 return result;
}




const list = async (req, res) => {
    let result = {};
    try {
    	console.log('tttttttttttttt')
        let listStr = "SELECT t.id,t.inclusion,t.exclusion,t.sport_id,t.tour_name,t.start_date,t.no_of_nights,t.no_of_day,c.city_name,s.state_name,ct.name as country_name FROM tours as t LEFT join city as c on c.id = t.city_id LEFT join state as s on s.id = t.state_id LEFT join country as ct on ct.id = t.country_id where status = 1 ORDER BY t.id DESC";
        
        let dataResult = await db.query(listStr);
		
		 result = dataResult.rows;
		 
		// let infoStr = [];
		// let Iternaryinfo ="SELECT id,day_number,day_title,day_description FROM tours_iternary where status = 1 and tour_id = "+req.body.id+"";
		//  infoStr = await db.query(Iternaryinfo) ;

	 // 	finalinfo['iternary_data'] = (infoStr.rows);

        if(result && result !==undefined && result !==""){

        	for (var i = 0; i < result.length; i++) {
        		
        	var sportdata = "SELECT sports_name,id from sports where id in ("+result[i].sport_id+")"; 

        	 
			var sportsinfo = await db.query(sportdata);
           	var sportcont = sportsinfo.rows;
 
           result[i]['sports'] = sportcont;
        }


        for (var j = 0; j < result.length; j++) {

        	if(result[j].inclusion == ""){
        		result[j].inclusion = 0
        	}
        		
        	var inclutionsdata = "SELECT inclutions,id,image from tours_inclutions where id in ("+result[j].inclusion+")";

        	
		 
			var inclutionsinfo = await db.query(inclutionsdata);
           	var inclutionscont = inclutionsinfo.rows;
       
           result[j]['inclutions'] = inclutionscont;
        }

        for (var k = 0; k < result.length; k++) {

        	if(result[k].exclusion == ""){
        		result[k].exclusion = 0
        	}
        		
        	var inclutionsdata = "SELECT exclusions,id,image from tours_exclustions where id in ("+result[k].exclusion+")";
        	
			var inclutionsinfo = await db.query(inclutionsdata);
           	var inclutionscont = inclutionsinfo.rows;
       
           result[k]['exclusions'] = inclutionscont;
        }
    }
    

        	
    
        
        console.log('listStr.rowCount');
        console.log(dataResult.rowCount);

       
        
        
    } catch (err) {
        console.log("err");
        console.log(err);
        result = {};
    }
    return result;
}


const info = async (req,body) =>{
         const result = {};
	try{


		
		

	let infodata = "SELECT *,inclusion,exclusion,tour_name,tour_type,country_id,state_id,city_id,sport_id,start_date,end_date,no_of_day,no_of_nights,video_link,tours_details FROM tours where status = 1 and id= "+req.body.id+"";



    console.log('infodata');
	console.log(infodata); 
	var infodatastr ={};
      infodatastr = await db.query(infodata);
    
 //     for (var i = 0; i < infodatastr.rows.length; i++) {

    	
	// 	let tour_de = infodatastr.rows[i].tours_details
	// 	var decryptedData = decipher.update(tour_de, "base64", "utf-8"); 

        

	// 	decryptedData += decipher.final("utf8");
	// 	console.log("decryptedData....");
	// 	console.log(decryptedData);

	// 	infodatastr.rows[i].tours_details=decryptedData;
	// 	console.log('infodatastr.rows[i].tours_details......');
	// 	console.log(infodatastr.rows[i].tours_details);

	// }

	//     console.log('infodatastr.rows[0].tours_details......');
	// 	console.log(infodatastr.rows[0].tours_details);

	 var data = infodatastr.rows;
	 		
	 if(infodatastr.rowCount ){
	 	let finalinfo  =  infodatastr.rows[0];
	 	let infoStr = [];
		let Iternaryinfo ="SELECT id,day_number,day_title,day_description FROM tours_iternary where status = 1 and tour_id = "+req.body.id+"";
		 infoStr = await db.query(Iternaryinfo) ;

	 	finalinfo['iternary_data'] = (infoStr.rows);  


       	let infopresentation = [];
		let info ="SELECT id,brochure as brochure_img,CASE WHEN (brochure IS NULL OR brochure = '') THEN '' ELSE Concat('"+UploadFileLink+"images/tours/',brochure) END as brochure FROM tours_presentation where status = 1 and tour_id = "+req.body.id+" AND brochure IS NOT NULL AND (LENGTH(brochure)>0) ";
		infopresentation = await db.query(info) ;

		finalinfo['presentation_data'] = (infopresentation.rows); 
 

		let infodowmload = [];
		let infodow = "SELECT id,title,image AS realimage,CASE WHEN (image IS NULL OR image='') THEN '' ELSE Concat('"+UploadFileLink+"',image) END as image FROM tours_downloads where status = 1 and tour_id = "+req.body.id+" AND tours_downloads.image IS NOT NULL AND (LENGTH(tours_downloads.image)>0)";

		infodowmload = await db.query(infodow);

		finalinfo['download_data'] = (infodowmload.rows)


		let infogall = [];
		let info_gal ="SELECT *,id,media_type,video_url,CASE WHEN cover_img IS NULL THEN '' ELSE Concat('"+UploadFileLink+"',cover_img) END as cover_img,CASE WHEN image IS NULL THEN '' ELSE Concat('"+UploadFileLink+"',image) END as image FROM tours_gallery where status = 1 and tour_id = "+req.body.id+"";

		
		infogall = await db.query(info_gal) ;  
		var infogalldata = infogall.rows
		console.log("info_gal...........");
		console.log(infogalldata.length);

		
//   var gallery_data = [];
// 		for(var i = 0; i < infogalldata.length; i++) {
// 			console.log("111111111111111");
// 			var sportdata = "SELECT sports_name from sports where id in ("+infogalldata[i].sport_id+")";
// 			 console.log("111111111111111");
// 			console.log(sportdata);

// 			let data = await db.query(sportdata);

// 			let datainfo  = data.rows;
// console.log("datainfo");
// console.log(datainfo);
// 			gallery_data[i]['sports_name'] = datainfo;
		 
// 	}


	if(infogalldata && infogalldata !==undefined && infogalldata !==""){

        	for (var i = 0; i < infogalldata.length; i++) {
        		
        	var sportdata = "SELECT sports_name,id from sports where id in ("+infogalldata[i].sport_id+")"; 

        	 
			var sportsinfo = await db.query(sportdata);
           	var sportcont = sportsinfo.rows;
 			console.log("sportcont");
 			console.log(sportcont);
           infogalldata[i]['sports'] = sportcont;
        }
    }

		finalinfo['gallery_data'] = (infogall.rows); 


		// let infoinclutions = [];
		// let info_inc ="SELECT id,inclutions FROM tours_inclutions where status = 1 and tour_id = "+req.body.id+"";
		// infoinclutions = await db.query(info_inc) ;

		// finalinfo['inclutions_data'] = (infoinclutions.rows);


		// let infoexclustions = [];
		// let info_exc ="SELECT id,exclustions FROM tours_exclustions where status = 1 and tour_id = "+req.body.id+"";
		// infoexclustions = await db.query(info_exc) ;

		// finalinfo['exclustions_data'] = (infoexclustions.rows); 

		let infodocument = [];
		let info_doc = "SELECT id,documents FROM tours_documents WHERE status =1 and tour_id ="+req.body.id+"";
		infodocument = await db.query(info_doc);

		finalinfo['documents_data'] = (infodocument.rows); 

	     var tour_inclusion = [];
		
				for (var i = 0; i < data.length; i++) {
                    //data[i]
                    var query = "SELECT inclutions FROM tours_inclutions where id in ("+data[i].inclusion+")";

                    console.log(query);
                    const listdata  = await db.query(query);
                    finalinfo['tour_inclusion'] = listdata.rows;
                }

                var tour_exclusion = [];
		
				for (var i = 0; i < data.length; i++) {
                    //data[i]
                    var query = "SELECT exclusions FROM tours_exclustions where id in ("+data[i].exclusion+")";

                    console.log(query);
                    const listdata  = await db.query(query);
                    finalinfo['tour_exclusion'] = listdata.rows;
                }

		


		        let tournamentImages = await db.query(`SELECT id,type,attachment FROM ${process.env.SCHEMA}.tour_attachment WHERE tour_id = ${req.body.id} order by id DESC`)
                if (tournamentImages.rowCount) {
                    const logo = tournamentImages.rows.filter(item => item.type == 'logo').map(item => ({ id: item.id, attachment: item.attachment }));
                    const banner = tournamentImages.rows.filter(item => item.type == 'banner').map(item => ({ id: item.id, attachment: item.attachment }));
                     const tile = tournamentImages.rows.filter(item => item.type == 'tile').map(item => ({ id: item.id, attachment: item.attachment }));
                    finalinfo['tour_logo'] = logo
                    finalinfo['tour_banner'] = banner
                    finalinfo['tour_tile'] = tile
                }
                else {
                    finalinfo['tour_logo'] = [];
                    finalinfo['tour_banner'] = []
                    finalinfo['tour_tile'] = []
                }  


	 	result.finalinfo = finalinfo;
	 }

	 
}
catch(err){
console.log(err);
}
return result;
} 


const update = async(req, res) => {
	try {
		// var awardPath = 'images/award/';
		// var award_logo = req.body.award_logo;
		// var tour_logo_str = "";
		// if(req.body.tour_logo.length>0) {
		// 	let isImage = /^data:image/.test(req.body.tour_logo[0]);
		// 	if(isImage) {
		// 		let tourPath = 'images/tours/';
		// 		let uploaded = helper.uploadBase64(req.body.tour_logo[0], tourPath);
		// 		console.log('uploaded');
		// 		console.log(uploaded);
		// 		tour_logo_str = uploaded.path;
		// 	}
		// }

		// var tour_tile_img_str = "";
		// if(req.body.tour_tile_img.length>0) {
		// 	let isImage = /^data:image/.test(req.body.tour_tile_img[0]);
		// 	if(isImage) {
		// 		let tourPath = 'images/tours/';
		// 		let uploaded = helper.uploadBase64(req.body.tour_tile_img[0], tourPath);
		// 		tour_tile_img_str = uploaded.path;
		// 	}
		// }

		// var banner_str = "";
		// if(req.body.banner.length>0) {
		// 	let isImage = /^data:image/.test(req.body.banner[0]);
		// 	if(isImage) {
		// 		let tourPath = 'images/tours/';
		// 		let uploaded = helper.uploadBase64(req.body.banner[0], tourPath);
		// 		banner_str = uploaded.path;
		// 	}
		// }

		// var downloads_str = "";
		// if(req.body.downloads.length>0) {
		// 	let isImage = /^data:image/.test(req.body.downloads[0]);
		// 	if(isImage) {
		// 		let tourPath = 'images/tours/';
		// 		let uploaded = helper.uploadBase64(req.body.downloads[0], tourPath);
		// 		downloads_str = uploaded.path; 
		// 	}
		// }

		// let encryptedData = cipher.update(req.body.tours_details, "utf-8", "base64");

		// encryptedData += cipher.final("base64");

		// console.log("Encrypted message: " + encryptedData);

      if(req.body.id && req.body.id !== undefined && req.body.id !==""){

      	if(req.body.banner_id && req.body.banner_id!=='undefined' && req.body.banner_id!== null){

      		var bannerstr = "delete from tour_attachment where type = '"+req.body.banner_id+"' and tour_id = "+req.body.id+" ";
      		console.log('bannerstr')
      		console.log(bannerstr);

      		var data = await db.query(bannerstr);
             
            var logoNew = 'images/tours/bg-layar.53d34359ca2f2062.png';
            if(data){
      		let logoQuery = `INSERT INTO tour_attachment (
                        type, attachment, created_at, status, tour_id) VALUES ('banner','${logoNew}',now(),1,${req.body.id})`

                        console.log("logo logoQuery: ");
                        console.log(logoQuery);

                await db.query(logoQuery);
            }
      	}

      	if(req.body.tile_id && req.body.tile_id!=='undefined' && req.body.tile_id!== null){

      		var tilestr = "delete from tour_attachment where type = '"+req.body.tile_id+"' and tour_id = "+req.body.id+" ";
			console.log('tilestr')
      		console.log(tilestr);
      		var data = await db.query(tilestr);
      	}

      	if(req.body.logo_id && req.body.logo_id!=='undefined' && req.body.logo_id!== null){

      		var logostr = "delete from tour_attachment where type = '"+req.body.logo_id+"' and tour_id = "+req.body.id+" "; 
		console.log('logostr')
      		console.log(logostr);
      		var data = await db.query(logostr);
      	}

		var statusStr = "update tours set tour_name ='" + req.body.tour_name + "',tour_type = " + req.body.tour_type + ",country_id = " + req.body.country_id + ",city_id = " + req.body.city_id + ",sport_id = '"+req.body.sport_id+"',start_date = '" + req.body.start_date + "',end_date = '" + req.body.end_date + "',no_of_day = " + req.body.no_of_day + ",no_of_nights = " + req.body.no_of_nights + ",video_link = '" + req.body.video_link + "',inclusion = '"+req.body.inclusion+"',exclusion = '"+req.body.exclusion+"',package_title ='"+req.body.package_title+"',packagesub_title = '"+req.body.packagesub_title+"',tour_description = '"+req.body.tour_description+"',featured_data = '"+req.body.featured_data+"',tours_details = '" + req.body.tours_details + "',updated_at = now() where id = "+req.body.id+" RETURNING id  ";
      }

      else{

		var statusStr = "INSERT into tours (tour_name,tour_type,country_id,city_id,sport_id,start_date,end_date,no_of_day,no_of_nights,tour_logo,video_link,tours_details,package_title, packagesub_title,tour_description,featured_data,inclusion,exclusion,created_at,status) values ('" + req.body.tour_name + "'," + req.body.tour_type + "," + req.body.country_id + "," + req.body.city_id + ",'"+req.body.sport_id+"','" + req.body.start_date + "','" + req.body.end_date + "'," + req.body.no_of_day + "," + req.body.no_of_nights + ",'" + req.body.video_link + "','" + req.body.tours_details + "','"+req.body.package_title+"', '"+req.body.packagesub_title+"','"+req.body.tour_description+"','"+req.body.featured_data+"','"+req.body.inclusion+"','"+req.body.exclusion+"',now(), 1)RETURNING id ";
	}


		
		console.log('data dataResultdatadatadata');  
		console.log(statusStr);
		var data = await db.query(statusStr);



		if(data.rowCount > 0) {

			const tour_id = data.rows[0].id;

			if (req.body.tour_tile_img.length>0 && req.body.tour_tile_img[0]!==null) {
					console.log('req.body.tour_tile_img..........');
					console.log(req.body.tour_tile_img);
                let tourPath = 'images/tours/';
                logo = helper.uploadBase64(req.body.tour_tile_img[0], tourPath);
                

                logoNew = logo.path;
                console.log("logo insert:");
                let logoQuery = `INSERT INTO ${process.env.SCHEMA}.tour_attachment (
                        type, attachment, created_at, status, tour_id) VALUES ('tile','${logoNew}',now(),1,${tour_id})`

                        console.log("logo logoQuery: ");
                        console.log(logoQuery);

                await db.query(logoQuery);

                console.log("logo: insert ++++++++++++++++++++++++++++++++");
            }

            if (req.body.banner.length>0 && req.body.banner[0] !==null) {
                let tourPath = 'images/tours/';
                logo = helper.uploadBase64(req.body.banner[0], tourPath );
                logoNew = logo.path;
                console.log("logo insert:");
                let logoQuery = `INSERT INTO ${process.env.SCHEMA}.tour_attachment (
                        type, attachment, created_at, status, tour_id) VALUES ('banner','${logoNew}',now(),1,${tour_id})`

                        console.log("logo logoQuery: ");
                        console.log(logoQuery);

                await db.query(logoQuery);

                console.log("logo: insert ++++++++++++++++++++++++++++++++");
            }

            if (req.body.tour_logo.length>0 && req.body.tour_logo[0] !==null) {
                let tourPath = 'images/tours/';
                logo = helper.uploadBase64(req.body.tour_logo[0], tourPath );
                logoNew = logo.path;
                console.log("logo insert:");
                let logoQuery = `INSERT INTO ${process.env.SCHEMA}.tour_attachment (
                        type, attachment, created_at, status, tour_id) VALUES ('logo','${logoNew}',now(),1,${tour_id})`

                        console.log("logo logoQuery: ");
                        console.log(logoQuery);

                await db.query(logoQuery);

                console.log("logo: insert ++++++++++++++++++++++++++++++++");
            }

			
			if(req.body.delete_days_id){	 
			 console.log(' ............................');
			 let insertstrde = "delete from tours_iternary where id in ("+req.body.delete_days_id+") ";
				 
			 console.log('tours_iternary delete............');
			 console.log(insertstrde);
		     await db.query(insertstrde);
			
			}

			if(req.body.iternary ) {


				let iternarystr = req.body.iternary;

			for (var i = 0; i < iternarystr.length; i++) {
				console.log('iternarystr.id....');
				console.log(iternarystr[i].id);
            if(iternarystr[i].id && iternarystr[i].id !== undefined && iternarystr[i].id !== ""){
					let iternarydata = "UPDATE tours_iternary set day_number = " + iternarystr[i].day_number + ",day_title = '" + iternarystr[i].day_title + "',day_description = '" + iternarystr[i].day_description + "',updated_at = now() where id = "+iternarystr[i].id+" ";

					console.log('data iternarydata...........................');  
		            console.log(iternarydata);
						
						await db.query(iternarydata);
				}

				else {
					let iternarydata = "INSERT into tours_iternary (tour_id,day_number,day_title,day_description,created_at,status) values(" + tour_id + "," + iternarystr[i].day_number + ",'" + iternarystr[i].day_title + "','" + iternarystr[i].day_description + "',now(),1)";
					
					await db.query(iternarydata);
				}
			}
				// if(Array.isArray(iternarystr)) {
				// 	for(var i = 0; i < iternarystr.length; i++) {
				// 		console.log('demo');
				// 		let iternarydata = "INSERT into tours_iternary (tour_id,day_number,day_title,day_description,created_at,status) values(" + tour_id + "," + iternarystr[i].day_number + ",'" + iternarystr[i].day_title + "','" + iternarystr[i].day_description + "',now(),1)";
						
				// 		await db.query(iternarydata);
				// 	}
				// } 
				
			}




		
		

		if(req.body.gallery ) {
			var gallerydata = req.body.gallery;

console.log('base64data.................................');
console.log(gallerydata);


           for (var i = 0; i < gallerydata.length; i++) {
           	
           

			if(gallerydata[i].id && gallerydata[i].id !== undefined && gallerydata[i].id !== ""){
				// var gallerydata_str = null;
				// 		if(gallerydata[i].image) {
				// 			let isImage = /^data:image/.test(gallerydata[i].image);
				// 			if(isImage) {
				// 				let tourPath = 'images/tours/';
				// 				let uploaded = helper.uploadBase64(gallerydata[i].image, tourPath);
				// 				gallerydata_str = uploaded.path; 
				// 			}
				// 		}
				let insertstr = "UPDATE tours_gallery SET  media_type = '" + gallerydata[i].media_type + "',sport_id = '"+gallerydata[i].sport_id+"',title = '" + gallerydata[i].title + "',date = '"+ gallerydata[i].date+"',video_url = '" + gallerydata[i].video_url + "',updated_at = now() where id = "+gallerydata[i].id+" ";

				console.log('tours_gallery');
				console.log(insertstr);
				await db.query(insertstr);
			}
			// if(Array.isArray(gallerydata)) {

					
			// 	for(var k = 0; k < gallerydata.length; k++) {
			// 		var gallerydata_str = "";
			// 			if(gallerydata[k].image) {
			// 				let isImage = /^data:image/.test(gallerydata[k].image);
			// 				if(isImage) {
			// 					let tourPath = 'images/tours/';
			// 					let uploaded = helper.uploadBase64(gallerydata[k].image, tourPath);
			// 					gallerydata_str = uploaded.path; 
			// 				}
			// 			}
			// 		let insertstr = "INSERT into tours_gallery(tour_id,media_type,image,video_url ,created_at,status) values (" + tour_id + ",'" + gallerydata[k].media_type + "','" + gallerydata_str + "','" + gallerydata[k].video_url + "',now(),1)";
			// 		await db.query(insertstr); 
			// 	}
			// } 


			else {
                     
					console.log("gallerydata11111111111111111111111111111111111");
                     console.log(gallerydata);

					var gallerydata_str = '';
					var cover_img_str = '';

					console.log('gallerydata.image+++++++++++++++++++++++++++++++++++++++++++++++++');
           			console.log(gallerydata[i].image);
						if(gallerydata[i].image) {
							let isImage = /^data:image/.test(gallerydata[i].image);
							if(isImage) {
								let tourPath = 'images/tours/';
								let uploaded = helper.uploadBase64(gallerydata[i].image, tourPath);
								gallerydata_str = uploaded.path; 
							}
						}

						if(gallerydata[i].cover_img) {
							let isImage = /^data:image/.test(gallerydata[i].cover_img);
							if(isImage) {
								let tourPath = 'images/tours/';
								let uploaded = helper.uploadBase64(gallerydata[i].cover_img, tourPath);
								cover_img_str = uploaded.path; 
							}
						}
				let insertstr = "INSERT into tours_gallery(tour_id,media_type,sport_id,date,title,image,cover_img,video_url,created_at,status) values (" + tour_id + ",'" + gallerydata[i].media_type + "','"+ gallerydata[i].sport_id+"','"+ gallerydata[i].date+"','"+ gallerydata[i].title+"','" + gallerydata_str + "','"+cover_img_str+"','" + gallerydata[i].video_url + "',now(),1)";

				console.log('tours_gallery----------------------------');
				console.log(insertstr);
				await db.query(insertstr);
			}
		}
	}

		


			

		// if(req.body.removeinclutions && typeof req.body.removeinclutions !== undefined && req.body.removeinclutions !== ""){
    
  //   		let deleteinclution = "UPDATE tours_inclutions SET inclutions = '"+req.body.inclutions+"' ,updated_at = now() WHERE id = "+req.body.removeinclutions+" ";
		// }

		// if(req.body.removeexclustions && typeof req.body.removeexclustions !== undefined  && req.body.removeexclustions !== ""){

		// }

			



	}
		//console.log('data dataResultdatadatadata'); 
		//console.log(data);
		return true; 
	} catch(err) {
		console.log('err');
		console.log(err);
		return false;
	}
}


const deletedata = async (req, res) => {

try {
       
    var id =  req.body.id;

    let statusStr = "UPDATE tours SET status = 2 ,updated_at = now() WHERE id = " + id + "";
        await db.query(statusStr);

    let deleteex = "update tours_exclustions SET status = 2, updated_at = now() WHERE tour_id = "+id+"";
        await db.query(deleteex);
    
    let deletein = "update tours_inclutions SET status = 2,updated_at = now() WHERE tour_id = "+id+"";
        await db.query(deletein);
	
	let deletedoc = "update tours_documents SET status = 2,updated_at = now() WHERE tour_id = "+id+"";
        await db.query(deletedoc);

    let deleteit = "update tours_iternary SET status = 2 ,updated_at = now() WHERE tour_id = "+id+"";
        await db.query(deleteit); 

    let deletepre = "update tours_presentation SET status = 2,updated_at = now() WHERE tour_id = "+id+""; 
         await db.query(deletepre);

    let deletegal = "update tours_gallery SET status = 2,updated_at = now() WHERE tour_id = "+id+"";
     	await db.query(deletegal);  
        
    
    return true;

    } catch(err) {
        console.log(err) 
        return false;  
    }
}



const citylist = async (req,res)=>{
try{
	const result = {};
	const cityStr = "SELECT id,country_id,city_name AS city FROM city  where country_id = "+req.body.country_id+" ORDER by city_name ASC";
    const city = await db.query(cityStr);
    result.city = city.rows; 
    return result ;
}
catch(err){

 result.city = [];
}
}

const statelist = async (req,res)=>{
try{
	const result = {};
	const stateStr = "SELECT id,country_id,state_name AS state FROM state where country_id = "+req.body.country_id+"";
        const state = await db.query(stateStr);
        result.state = state.rows;
        return result ;
}
catch(err){

 result.state =[];
}
}


const countrylist = async (req,res)=>{
try{
	const result = {};
	const countryStr = "SELECT id,name AS country FROM country ";
        const country = await db.query(countryStr);
        result.country = country.rows;
        return result ;
}
catch(err){

 result.country = [];
}
}


const master = async (req,res) =>{

	const result = {};
    try {
       
		const sportStr = "SELECT id,sports_name AS sports FROM sports where status = 1 ORDER BY sports_name asc";
        const sports = await db.query(sportStr);
        result.sports = sports.rows;

        // const cityStr = "SELECT id,state_id,city_name AS city FROM " + process.env.SCHEMA + ".city ";
        // const city = await db.query(cityStr);
        // result.city = city.rows; 

        // const stateStr = "SELECT id,country_id,state_name AS state FROM " + process.env.SCHEMA + ".state ";
        // const state = await db.query(stateStr);
        // result.state = state.rows;


        // const countryStr = "SELECT id,name AS country FROM " + process.env.SCHEMA + ".country ";
        // const country = await db.query(countryStr);
        // result.country = country.rows;

// if(req.query.country_id && req.query.country_id !== undefined && req.query.country_id !== ""){
//         const stateStrByid = "SELECT id,name as state from state WHERE country_id = "+req.query.country_id+" ";
//         const stateByid = await db.query(stateStrByid);
// 		result.stateByid = stateByid.rows;
// 	}

    } catch (err) {
        
        
        
        result.sports = [];
        result.state   = [];
        result.country =[];
        //result.stateByid = [];
        
        result.city = [];
    }

    return result;
}


// tour type master 
const tourtypeMst = async (req,res) => {

	try{

		if (req.body.tour_type) {
		            let sport = req.body.tour_type; 
		            let result = sport.toLowerCase();
		            
		            
		            let query = (`SELECT LOWER(tour_type) FROM tours_type WHERE status = 1 and tour_type ILIKE '%${result}%'`); 
		            
		            var querydata =  await db.query(query);
		            
		            
		            if (querydata.rowCount) {
		                return {
		                    validationError: true,
		                    error: 'exclusions already exists ..!'
		                }
		            }
		     }

		var tourtypeadd = "INSERT into tours_type (tour_type,created_at,status)values('"+req.body.tour_type+"',now(),1)";
        console.log(tourtypeadd);
        await db.query(tourtypeadd);
        return true;
	}
	catch(err){
		console.log(err);
		return false;
	}

}

const tourtypeselect = async (req,res) => {
	var result ={};
	try{

        var tourtypeadd = "SELECT id,tour_type FROM tours_type WHERE status = 1"; 
        console.log(tourtypeadd);
       let data = await db.query(tourtypeadd);
      result = data.rows;
        
	}
	catch(err){
		console.log(err);
		return false;
	}
 return result ;
}

const tourtypeinfo = async(req,res) =>{
	var result = {};
	try{
        var tourtype = "SELECT id, tour_type from tours_type WHERE id = "+req.body.id+"";
        let data = await db.query(tourtype);
        result = data.rows;
	}
	catch(err){
console.log(err);
return false;
	}
	return result;
}

const tourtypeupdate = async(req,res) =>{
	try{


           if (req.body.tour_type) {
		            let sport = req.body.tour_type; 
		            let result = sport.toLowerCase();
		            
		            
		            let query = (`SELECT LOWER(tour_type) FROM tours_type WHERE status = 1 and tour_type ILIKE '%${result}%'`); 
		            
		            var querydata =  await db.query(query);
		            
		            
		            if (querydata.rowCount) {
		                return {
		                    validationError: true,
		                    error: 'tours_type already exists ..!'
		                }
		            }
		     }

           var tourupdate = "update tours_type SET tour_type = '"+req.body.tour_type+"' WHERE id = "+req.body.id+"";
           console.log(tourupdate);
           await db.query(tourupdate);
           return true;
	}
	catch(err){
		console.log(err);
     return false;
	}
}

const tourtypedelete = async(req,res) =>{
	try{
           

        var notdelte = "SELECT * from tours where status=1 and tour_type = "+req.body.id+"";
         
        var query = await db.query(notdelte);
          if (query.rowCount) {
          	return{
          	validationError: true,
		    error: 'tour_type used ..!' 
			}
          }

          

           var tourdelete = "update tours_type SET status = 2 ,updated_at = now() WHERE id = "+req.body.id+"";
           console.log(tourdelete);
           await db.query(tourdelete);
           return true;
	}
	catch(err){
		console.log(err);
     return false;
	}
}

const deletetoursdata =  async(req,res) =>{
	try{
         
        if(req.body.type_inclutions && req.body.type_inclutions !== undefined && req.body.type_inclutions !==""){

         	let deleteinc = "update tours_inclutions set status = 2 ,updated_at = now() WHERE id = "+req.body.type_inclutions+" ";
         	console.log('deleteinc');
         	console.log(deleteinc);
			await db.query(deleteinc);

			

         }

        if(req.body.type_exclustions  && req.body.type_exclustions !== undefined && req.body.type_exclustions !==""){

         	let deleteex = "update tours_exclustions set status = 2, updated_at = now() WHERE id = "+req.body.type_exclustions+" ";
         	console.log('deleteinc');
         	console.log(deleteex);
         	await db.query(deleteex);
         }


        if(req.body.type_iternary && req.body.type_iternary !== undefined && req.body.type_iternary !== ""){
            let deleteit = "update tours_iternary set status = 2, updated_at = now() WHERE id = "+req.body.type_iternary+" "; 
            console.log('deleteit');
         	console.log(deleteit);
            await db.query(deleteit);
         } 

        if(req.body.type_downloads && req.body.type_downloads !== undefined && req.body.type_downloads !== ""){
            let deleteitstr = "update tours_downloads set status = 2, updated_at = now() WHERE id = "+req.body.type_downloads+"";
            console.log('deleteitstr');
         	console.log(deleteitstr);
            await db.query(deleteitstr);
         } 

        if(req.body.type_documents && req.body.type_documents !== undefined && req.body.type_documents !== ""){
            let deleteitSt = "update tours_presentation set status = 2, updated_at = now() WHERE id = "+req.body.type_documents+"";
            console.log('deleteitSt');
         	console.log(deleteitSt);
            await db.query(deleteitSt);

         }


        
        if(req.body.type_gallery && req.body.type_gallery !== undefined && req.body.type_gallery !== ""){
            let deleteitSt = "update tours_gallery set status = 2, updated_at = now() WHERE id ="+req.body.type_gallery+"";  
            console.log('deleteitSt');
         	console.log(deleteitSt); 
            await db.query(deleteitSt);
         }

         return true;

          
	}
	catch(err){
		console.log('err------');
		console.log(err);
		return false;
	}
}


module.exports = {
	insert,list,info,update,deletedata,master,tours_presentation,tours_presentation_update,tours_presentation_info,tourtypeMst,tourtypeselect,tours_downloads,tourtypeinfo,tourtypeupdate,tourtypedelete,tours_downloadsinfo,deletetoursdata,citylist,countrylist,statelist
};