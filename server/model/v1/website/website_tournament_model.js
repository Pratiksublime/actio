const { Query } = require('pg');
const db = require('../../../db');
const helper = require('../../../helper/helper');
var model = require('../../../model/website/model.js');
const moment = require('moment');
const now = moment();
const BannerWebsiteLink =process.env.HOST+process.env.PORT+'/';

const UploadFileLink =process.env.HOST+process.env.PORT+'/';

const UpcomingList = async (req, res) => {
    var result = {};
    try {
        var where_str = " ";
        if(req.query.page_record && typeof req.query.page_record !=="undefined" && typeof req.query.page_record !=="" && req.query.page_record>0){
            where_str = " limit "+req.query.page_record;
        }
        //var query = "SELECT t.tournament_name, t.tournament_start_date, t.tournament_start_time, t.tournament_end_date, t.tournament_end_time, t.tournament_venue, v.venue_name, t.tournament_city, ct.city_name, t.tournament_country, c.name, t.sports, s.sports_name  FROM tournament AS t  LEFT JOIN venue AS v ON v.id = t.tournament_venue LEFT JOIN city AS ct ON ct.id = t.tournament_city LEFT JOIN country AS c ON c.id = t.tournament_country LEFT JOIN sports AS s ON s.id = t.sports "+where_str;
    	const current = new Date();
    	const date = `${current.getFullYear()}-${current.getMonth()+1}-${current.getDate()}`;

        //var query = "SELECT t.id,s.sports_name,t.registration_fee, t.is_champ, t.tournament_name, t.tournament_start_date, t.tournament_start_time, t.tournament_end_date, t.tournament_end_time,t.tournament_description, t.tournament_venue, v.venue_name, t.tournament_city, ct.city_name, t.tournament_country, c.name FROM tournament AS t LEFT join sports as s on s.id = t.sports::integer LEFT JOIN venue AS v ON v.id = t.tournament_venue LEFT JOIN city AS ct ON ct.id = t.tournament_city LEFT JOIN country AS c ON c.id = t.tournament_country where t.status = 1 and DATE(t.tournament_end_date) > '"+date+"' "+where_str;

        
		var query = "SELECT t.id,t.olympics_sports,o.olympic_sports,s.sports_name,t.venue_other,t.registration_fee,cts.city_name as olympic_city_name,osp.state_name as olympic_state_name,o.olympic_name,o.olympic_description,o.olympic_venue,va.venue_name as olympic_venue_name,o.olympic_country,oct.name as olympic_country_name,o.olympic_city,o.olympic_state,o.olympic_start_date,o.olympic_end_date,t.is_champ, t.tournament_name, t.tournament_start_date, t.tournament_start_time, t.tournament_end_date, t.tournament_end_time,t.tournament_description, t.tournament_venue, v.venue_name, t.tournament_city, ct.city_name, t.tournament_country, c.name FROM tournament AS t LEFT JOIN olympic as o on o.id = t.olympics_sports LEFT JOIN country AS oct ON oct.id = o.olympic_country LEFT JOIN state AS osp ON osp.id = o.olympic_state LEFT JOIN venue AS va ON va.id = o.olympic_venue LEFT JOIN city AS cts ON cts.id = o.olympic_city LEFT join sports as s on s.id = t.sports::integer LEFT JOIN venue AS v ON v.id = t.tournament_venue LEFT JOIN city AS ct ON ct.id = t.tournament_city LEFT JOIN country AS c ON c.id = t.tournament_country where t.status = 1 and DATE(t.tournament_end_date) > '"+date+"' "+where_str;

        var resultData = await db.query(query);

        resultData = resultData.rows;

        // .............olympic_sports..............//

        	for (var j = 0; j < resultData.length; j++) {

            		var sportsdata = "SELECT sports_name from sports where id in ("+resultData[j].olympic_sports+")"; 
            		console.log("sport_name.......................");
            		console.log(sportsdata);

            		var sportinfo = await db.query(sportsdata);

            		resultData[j]['olympic_sports_name'] = sportinfo.rows;
            	}


        	if(resultData && typeof resultData !=="undefined" && resultData.length>0){
            for (var i = 0; i < resultData.length; i++) {

                var query = "SELECT type, Concat('"+UploadFileLink+"', CASE WHEN attachment  != '' THEN  Concat(attachment) end) as attachment FROM tournament_attachment where status = 1 and tournament_id = "+resultData[i].id;

                var resultSubData = await db.query(query);

                resultSubData = resultSubData.rows;


                var olympicquery = "SELECT type, Concat('"+UploadFileLink+"', CASE WHEN attachment  != '' THEN  Concat(attachment) end) as attachment FROM olympic_attachment where status = 1 and olympic_id = "+resultData[i].olympics_sports;

                var olympicresultSubData = await db.query(olympicquery);

                olympicresultSubData = olympicresultSubData.rows;

                //resultData[i]['attachment'] = resultSubData;

                var olympicbannerData = [];
                var olympicbackgroundData = [];
                var olympiclogoData = [];
                var olympicotherData = [];

                if(olympicresultSubData && typeof olympicresultSubData !=="undefined" && olympicresultSubData.length>0){
                    for (var k = 0; k < olympicresultSubData.length; k++) {
                        if(olympicresultSubData[k].type==="logo"){
                            olympiclogoData.push(olympicresultSubData[k].attachment);
                        }else{
                            if(olympicresultSubData[k].type==="banner"){
                                olympicbannerData.push(olympicresultSubData[k].attachment);
                            }else{
                                if(olympicresultSubData[k].type==="background"){
                                    olympicbackgroundData.push(olympicresultSubData[k].attachment);
                                }else{
                                    olympicotherData.push(olympicresultSubData[k].attachment);
                                }   
                            }    
                        }
                    }
                }
                
                resultData[i]['olympicbanner'] = olympicbannerData;
                resultData[i]['olympicbackground'] = olympicbackgroundData;
                resultData[i]['olympiclogo'] = olympiclogoData;
                resultData[i]['olympicother'] = olympicotherData;


                var bannerData = [];
                var backgroundData = [];
                var logoData = [];
                var otherData = [];

                if(resultSubData && typeof resultSubData !=="undefined" && resultSubData.length>0){
                    for (var k = 0; k < resultSubData.length; k++) {
                        if(resultSubData[k].type==="logo"){
                            logoData.push(resultSubData[k].attachment);
                        }else{
                            if(resultSubData[k].type==="banner"){
                                bannerData.push(resultSubData[k].attachment);
                            }else{
                                if(resultSubData[k].type==="background"){
                                    backgroundData.push(resultSubData[k].attachment);
                                }else{
                                    otherData.push(resultSubData[k].attachment);
                                }   
                            }    
                        }
                    }
                }
                
                resultData[i]['banner'] = bannerData;
                resultData[i]['background'] = backgroundData;
                resultData[i]['logo'] = logoData;
                resultData[i]['other'] = otherData;

            }
        }

        return resultData;

    } catch (err) {
        console.log("err: ");
        console.log(err);
        result = {};
        return result;
    }
}


const pastList = async (req, res) => {
    	var result = {};


    	try {
        	var where_str = " ";
        	if(req.query.page_record && typeof req.query.page_record !=="undefined" && typeof req.query.page_record !=="" && req.query.page_record>0){
            where_str = " limit "+req.query.page_record;
        }

    	const current = new Date();
    	const date = `${current.getFullYear()}-${current.getMonth()+1}-${current.getDate()}`;

    //var query = "SELECT t.id,t.registration_fee, t.is_champ,t.tournament_description, t.tournament_name, t.tournament_start_date, t.tournament_start_time, t.tournament_end_date,t.tournament_end_time, t.tournament_venue, v.venue_name, t.tournament_city, ct.city_name, t.tournament_country, c.name FROM tournament AS t  LEFT JOIN venue AS v ON v.id = t.tournament_venue LEFT JOIN city AS ct ON ct.id = t.tournament_city LEFT JOIN country AS c ON c.id = t.tournament_country where t.status = 1 and DATE(t.tournament_end_date) < '"+date+"' "+where_str;
   
   		var query ="SELECT t.id,t.olympics_sports,o.olympic_sports,s.sports_name,t.registration_fee,o.olympic_name,cts.city_name as olympic_city_name,o.olympic_description,o.olympic_venue,va.venue_name as olympic_venue_name,o.olympic_country,osp.state_name as olympic_state_name,oct.name as olympic_country_name,o.olympic_city,o.olympic_state,o.olympic_start_date,o.olympic_end_date,t.is_champ, t.tournament_name, t.tournament_start_date, t.tournament_start_time, t.tournament_end_date, t.tournament_end_time,t.tournament_description, t.tournament_venue, v.venue_name, t.tournament_city, ct.city_name, t.tournament_country, c.name FROM tournament AS t LEFT JOIN olympic as o on o.id = t.olympics_sports LEFT JOIN country AS oct ON oct.id = o.olympic_country LEFT JOIN state AS osp ON osp.id = o.olympic_state LEFT JOIN venue AS va ON va.id = o.olympic_venue LEFT JOIN city AS cts ON cts.id = o.olympic_city LEFT join sports as s on s.id = t.sports::integer LEFT JOIN venue AS v ON v.id = t.tournament_venue LEFT JOIN city AS ct ON ct.id = t.tournament_city LEFT JOIN country AS c ON c.id = t.tournament_country where t.status = 1 and DATE(t.tournament_end_date) < '"+date+"' "+where_str; 
      
    	var resultData = await db.query(query);

        resultData = resultData.rows;


        		for (var j = 0; j < resultData.length; j++) {

            		var sportsdata = "SELECT sports_name from sports where id in ("+resultData[j].olympic_sports+")"; 
            		console.log("sport_name.......................");
            		console.log(sportsdata);

            		var sportinfo = await db.query(sportsdata);

            		resultData[j]['olympic_sports_name'] = sportinfo.rows;
            	}
        

        	if(resultData && typeof resultData !=="undefined" && resultData.length>0){
            for (var i = 0; i < resultData.length; i++) {

                var query = "SELECT type, Concat('"+UploadFileLink+"', CASE WHEN attachment  != '' THEN  Concat(attachment) end) as attachment FROM tournament_attachment where status = 1 and tournament_id = "+resultData[i].id;

                var resultSubData = await db.query(query);

                resultSubData = resultSubData.rows;

                //resultData[i]['attachment'] = resultSubData;
                var olympicquery = "SELECT type, Concat('"+UploadFileLink+"', CASE WHEN attachment  != '' THEN  Concat(attachment) end) as attachment FROM olympic_attachment where status = 1 and olympic_id = "+resultData[i].olympics_sports;

                var olympicresultSubData = await db.query(olympicquery);

                olympicresultSubData = olympicresultSubData.rows;

                //resultData[i]['attachment'] = resultSubData;

                var olympicbannerData = [];
                var olympicbackgroundData = [];
                var olympiclogoData = [];
                var olympicotherData = [];

                if(olympicresultSubData && typeof olympicresultSubData !=="undefined" && olympicresultSubData.length>0){
                    for (var k = 0; k < olympicresultSubData.length; k++) {
                        if(olympicresultSubData[k].type==="logo"){
                            olympiclogoData.push(olympicresultSubData[k].attachment);
                        }else{
                            if(olympicresultSubData[k].type==="banner"){
                                olympicbannerData.push(olympicresultSubData[k].attachment);
                            }else{
                                if(olympicresultSubData[k].type==="background"){
                                    olympicbackgroundData.push(olympicresultSubData[k].attachment);
                                }else{
                                    olympicotherData.push(olympicresultSubData[k].attachment);
                                }   
                            }    
                        }
                    }
                }
                
                resultData[i]['olympicbanner'] = olympicbannerData;
                resultData[i]['olympicbackground'] = olympicbackgroundData;
                resultData[i]['olympiclogo'] = olympiclogoData;
                resultData[i]['olympicother'] = olympicotherData;

                var bannerData = [];
                var backgroundData = [];
                var logoData = [];
                var otherData = [];

                if(resultSubData && typeof resultSubData !=="undefined" && resultSubData.length>0){
                    for (var k = 0; k < resultSubData.length; k++) {
                        if(resultSubData[k].type==="logo"){
                            logoData.push(resultSubData[k].attachment);
                        }else{
                            if(resultSubData[k].type==="banner"){
                                bannerData.push(resultSubData[k].attachment);
                            }else{
                                if(resultSubData[k].type==="background"){
                                    backgroundData.push(resultSubData[k].attachment);
                                }else{
                                    otherData.push(resultSubData[k].attachment);
                                }   
                            }    
                        }
                    }
                }
                
                resultData[i]['banner'] = bannerData;
                resultData[i]['background'] = backgroundData;
                resultData[i]['logo'] = logoData;
                resultData[i]['other'] = otherData;

            }
        }

        return resultData;

    } 
// }
catch (err) {
        console.log("err: ");
        console.log(err);
        result = {};
        return result;
    }
}

const withoutPastList = async (req, res) => {
    //var result = {};
    try {
        var where_str = " ";
        if(req.query.page_record && typeof req.query.page_record !=="undefined" && typeof req.query.page_record !=="" && req.query.page_record>0){
            where_str = " limit "+req.query.page_record;
        }


//new2 filter code 

   // let finalQuery = {};
       
        const current = new Date();
        const date = `${current.getFullYear()}-${current.getMonth()+1}-${current.getDate()}`;
        //const isFilterQuery = filterKeys.some(item => (item in req.body && req.body[item]));
        console.log("req.body.sports_name");
        console.log(req.query.sports_name);
        let sports_name = '';
       
        if (req.query.sports_id) {
            sports_name = ` AND t.sports:: integer in (${req.query.sports_id})`;
        }
        let city_name = '';
        if (req.query.city_id) {
            city_name = ` AND t.tournament_city in (${req.query.city_id})`; 
        }
       
        let pastList_data = '';
        if (req.query.past_list) {
           
            pastList_data = ` AND DATE(t.tournament_end_date) < '${date}'`;
           
        }

        let live_data = '';
        if (req.query.live) {
            
            live_data = ` AND t.is_live = ${req.query.live}`;   
           
        }  
        //let live_data = '';
        if (req.query.live ="") {
           
            live_data = "";  
            
           
        }  
        // let live_data = '';
        // if (req.query.all) {
           
        //     live_data = ` AND live = ${req.query.live}`;
           
        // }
         console.log('req.query.past_list');
         console.log(req.query.past_list);


    if(req.query.past_list){

        var querynew = "SELECT t.id,t.olympics_sports,s.sports_name,o.olympic_sports,t.registration_fee,o.olympic_name,o.olympic_description,o.olympic_venue,va.venue_name as olympic_venue_name,o.olympic_country,oct.name as olympic_country_name,o.olympic_city,o.olympic_state,o.olympic_start_date,o.olympic_end_date,o.olympic_sports, t.is_champ, t.tournament_description,t.tournament_name,t.is_live, t.tournament_start_date, t.tournament_start_time, t.tournament_end_date, t.tournament_end_time, t.tournament_venue, v.venue_name, t.tournament_city,cts.city_name as olympic_city_name, ct.city_name,osp.state_name as olympic_state_name, t.tournament_country, c.name FROM tournament AS t  LEFT JOIN olympic as o on o.id = t.olympics_sports LEFT JOIN country AS oct ON oct.id = o.olympic_country LEFT JOIN state AS osp ON osp.id = o.olympic_state LEFT JOIN venue AS va ON va.id = o.olympic_venue LEFT JOIN city AS cts ON cts.id = o.olympic_city LEFT join sports as s on s.id = t.sports::integer LEFT JOIN venue AS v ON v.id = t.tournament_venue LEFT JOIN city AS ct ON ct.id = t.tournament_city LEFT JOIN country AS c ON c.id = t.tournament_country where t.status=1"+where_str+sports_name+city_name+pastList_data+live_data


        
 
        console.log(".1111111111111111111111111111111111111111111111111111111111111111111.....");  
    console.log(querynew); 
    }
    else{
	
        var querynew = "SELECT t.id,t.olympics_sports,o.olympic_sports,s.sports_name,t.registration_fee,o.olympic_name,o.olympic_description,o.olympic_venue,va.venue_name as olympic_venue_name,o.olympic_country,oct.name as olympic_country_name,o.olympic_city,o.olympic_state,o.olympic_start_date,o.olympic_end_date,o.olympic_sports, t.is_champ, t.tournament_description,t.tournament_name,t.is_live, t.tournament_start_date, t.tournament_start_time, t.tournament_end_date, t.tournament_end_time, t.tournament_venue, v.venue_name, t.tournament_city,cts.city_name as olympic_city_name, ct.city_name,osp.state_name as olympic_state_name, t.tournament_country, c.name FROM tournament AS t  LEFT JOIN olympic as o on o.id = t.olympics_sports LEFT JOIN country AS oct ON oct.id = o.olympic_country LEFT JOIN state AS osp ON osp.id = o.olympic_state LEFT JOIN venue AS va ON va.id = o.olympic_venue LEFT JOIN city AS cts ON cts.id = o.olympic_city LEFT join sports as s on s.id = t.sports::integer LEFT JOIN venue AS v ON v.id = t.tournament_venue LEFT JOIN city AS ct ON ct.id = t.tournament_city LEFT JOIN country AS c ON c.id = t.tournament_country where t.status=1 AND DATE(t.tournament_end_date) > '"+date+"'  "+where_str+sports_name+city_name+pastList_data+live_data
    

    console.log("ryyyyyyyyyyyyyyyyyyyyyyyyyy...222222222222222222222222222222222222222222222222222222222222222...");   
    console.log(querynew);
}
    
	   


    var resultDatafilter = await db.query(querynew);

    resultDatafilter = resultDatafilter.rows; 
    

    		for (var j = 0; j < resultDatafilter.length; j++) {

            		var sportsdata = "SELECT sports_name from sports where id in ("+resultDatafilter[j].olympic_sports+")"; 
            		console.log("sport_name.......................");
            		console.log(sportsdata);

            		var sportinfo = await db.query(sportsdata);

            		resultDatafilter[j]['olympic_sports_name'] = sportinfo.rows;
            	}
        //console.log("resultDatafilter req.body.//////////////////");
        //console.log(resultDatafilter);

        if(resultDatafilter && typeof resultDatafilter !=="undefined" && resultDatafilter.length>0){
            
            for (var i = 0; i < resultDatafilter.length; i++) {

            	var olympicquery = "SELECT type, Concat('"+UploadFileLink+"', CASE WHEN attachment  != '' THEN  Concat(attachment) end) as attachment FROM olympic_attachment where status = 1 and olympic_id = "+resultDatafilter[i].olympics_sports;
                // console.log("eeeeeeeee-----------------");
                // console.log(olympicquery)
            	var olympicresultSubData = await db.query(olympicquery);

            	olympicresultSubData = olympicresultSubData.rows;

            	console.log(olympicresultSubData);

            	 var olympiclogoData = [];
				var olympicbannerData = [];
               
                var olympicbackgroundData = [];
                var olympicotherData = [];
            	//resultDatafilter[i]['olympic_attachment'] = olympicresultSubData;

            	if(olympicresultSubData && typeof olympicresultSubData !=="undefined" && olympicresultSubData.length>0){
                    for (var k = 0; k < olympicresultSubData.length; k++) {
                        if(olympicresultSubData[k].type==="logo"){
                        	 console.log('olympicresultSubData logo ======== logo   ');
                        	console.log(olympicresultSubData[k].attachment);
                            olympiclogoData.push(olympicresultSubData[k].attachment);

                        }else{
                            if(olympicresultSubData[k].type==="banner"){
                                olympicbannerData.push(olympicresultSubData[k].attachment);
                            }else{
                                if(olympicresultSubData[k].type==="background"){
                                    olympicbackgroundData.push(olympicresultSubData[k].attachment);
                                }else{
                                    olympicotherData.push(olympicresultSubData[k].attachment);
                                }   
                            }    
                        }
                    }
                }


                var querynew = "SELECT type, Concat('"+UploadFileLink+"', CASE WHEN attachment  != '' THEN  Concat(attachment) end) as attachment FROM tournament_attachment where status = 1 and tournament_id = "+resultDatafilter[i].id;

                var resultSubData = await db.query(querynew);

                resultSubData = resultSubData.rows;

                resultDatafilter[i]['attachment'] = resultSubData;

                var bannerData = [];
                var backgroundData = [];
                var logoData = [];
                var otherData = [];

                

                if(resultSubData && typeof resultSubData !=="undefined" && resultSubData.length>0){
                    for (var k = 0; k < resultSubData.length; k++) {
                        if(resultSubData[k].type==="logo"){
                            logoData.push(resultSubData[k].attachment);
                        }else{
                            if(resultSubData[k].type==="banner"){
                                bannerData.push(resultSubData[k].attachment);
                            }else{
                                if(resultSubData[k].type==="background"){
                                    backgroundData.push(resultSubData[k].attachment);
                                }else{
                                    otherData.push(resultSubData[k].attachment);
                                }   
                            }    
                        }
                    }
                }
                
                resultDatafilter[i]['banner'] = bannerData;
                resultDatafilter[i]['background'] = backgroundData;
                resultDatafilter[i]['logo'] = logoData;
                resultDatafilter[i]['other'] = otherData;

                resultDatafilter[i]['olympic_banner'] = olympicbannerData;
                resultDatafilter[i]['olympic_background'] = olympicbackgroundData;
                resultDatafilter[i]['olympic_logo'] = olympiclogoData;
                resultDatafilter[i]['olympic_other'] = otherData;

            }
        }

        

//end


    //var query = "SELECT t.tournament_name, t.tournament_start_date, t.tournament_start_time, t.tournament_end_date, t.tournament_end_time, t.tournament_venue, v.venue_name, t.tournament_city, ct.city_name, t.tournament_country, c.name, t.sports, s.sports_name  FROM tournament AS t  LEFT JOIN venue AS v ON v.id = t.tournament_venue LEFT JOIN city AS ct ON ct.id = t.tournament_city LEFT JOIN country AS c ON c.id = t.tournament_country LEFT JOIN sports AS s ON s.id = t.sports "+where_str;
 //if(req.query.all){
        var query = "SELECT t.id,t.registration_fee, t.is_champ, t.tournament_description,t.tournament_name, t.tournament_start_date, t.tournament_start_time, t.tournament_end_date, t.tournament_end_time, t.tournament_venue, v.venue_name, t.tournament_city, ct.city_name, t.tournament_country, c.name FROM tournament AS t  LEFT JOIN venue AS v ON v.id = t.tournament_venue LEFT JOIN city AS ct ON ct.id = t.tournament_city LEFT JOIN country AS c ON c.id = t.tournament_country where t.status = 1"+where_str;

        var resultData = await db.query(query);

        resultData = resultData.rows;
        //console.log("resultData99999999999999999999999999999999");
        //console.log(resultData);

        if(resultData && typeof resultData !=="undefined" && resultData.length>0){
            for (var i = 0; i < resultData.length; i++) {

                var query = "SELECT type, Concat('"+UploadFileLink+"', CASE WHEN attachment  != '' THEN  Concat(attachment) end) as attachment FROM tournament_attachment where status = 1 and tournament_id = "+resultData[i].id;

                var resultSubData = await db.query(query);

                resultSubData = resultSubData.rows;

                resultData[i]['attachment'] = resultSubData;

        // console.log("________________________________");
        // console.log(resultSubData);



                var bannerData = [];
                var backgroundData = [];
                var logoData = [];
                var otherData = [];

                if(resultSubData && typeof resultSubData !=="undefined" && resultSubData.length>0){
                    for (var k = 0; k < resultSubData.length; k++) {
                        if(resultSubData[k].type==="logo"){
                            logoData.push(resultSubData[k].attachment);
                        }else{
                            if(resultSubData[k].type==="banner"){
                                bannerData.push(resultSubData[k].attachment);
                            }else{
                                if(resultSubData[k].type==="background"){
                                    backgroundData.push(resultSubData[k].attachment);
                                }else{
                                    otherData.push(resultSubData[k].attachment);
                                }   
                            }    
                        }
                    }
                }
                
                resultData[i]['banner'] = bannerData;
                resultData[i]['background'] = backgroundData;
                resultData[i]['logo'] = logoData;
                resultData[i]['other'] = otherData;

            }
        }
    //}

   if(resultDatafilter && typeof resultDatafilter !=="undefined" && resultDatafilter.length>0){
        return resultDatafilter;
    }
    // else{

    //     return resultData;
    // }

    } catch (err) {
        console.log("err: ");
        console.log(err);
        result = {};
        return result;
    }
}


const countList = async (req, res) => {
    //var result = {};
    try {
        var where_str = " ";
        if(req.query.page_record && typeof req.query.page_record !=="undefined" && typeof req.query.page_record !=="" && req.query.page_record>0){
            where_str = " limit "+req.query.page_record;
        }


//new2 filter code 

   // let finalQuery = {};
       
        const current = new Date();
        const date = `${current.getFullYear()}-${current.getMonth()+1}-${current.getDate()}`;
        //const isFilterQuery = filterKeys.some(item => (item in req.body && req.body[item]));
        console.log("req.body.sports_name");
        console.log(req.query.sports_name);
        let sports_name = '';
       
        if (req.query.sports_name) {
            sports_name = ` AND t.sports:: integer in (${req.query.sports_name})`;
        }
        let city_name = '';
        if (req.query.city_name) {
            city_name = ` AND t.tournament_city in (${req.query.city_name})`;
        }
        let UpcomingList_data = '';
        if (req.query. upcoming_list ) {
          
            UpcomingList_data = ` AND DATE(t.tournament_end_date) > '${date}'`;
            
        }
        let pastList_data = '';
        if (req.query.past_list) {
           
            pastList_data = ` AND DATE(t.tournament_end_date) < '${date}'`;
           
        }

        let live_data = '';
        if (req.query.live) {
            
            live_data = ` AND t.is_live = ${req.query.live}`;   
           
        }  
        
        if (req.query.live ="") {
           
            live_data = "";  
            
           
        }  
        


   
 var querynew = "SELECT count(t.*) FROM tournament AS t where t.status=1"+where_str+sports_name+city_name+UpcomingList_data+pastList_data+live_data
    console.log("resultDatafilter                ======================");
    console.log(querynew);

        var resultDatafilter = await db.query(querynew);

        resultDatafilter = resultDatafilter.rows; 
    console.log("resultDatafilter======================");
    console.log(resultDatafilter);
        //console.log("resultDatafilter req.body.//////////////////");
        //console.log(resultDatafilter);

        // if(resultDatafilter && typeof resultDatafilter !=="undefined" && resultDatafilter.length>0){
        //     for (var i = 0; i < resultDatafilter.length; i++) {

        //         var querynew = "SELECT type, Concat('"+UploadFileLink+"', CASE WHEN attachment  != '' THEN  Concat(attachment) end) as attachment FROM tournament_attachment where status = 1 and tournament_id = "+resultDatafilter[i].id;

        //         var resultSubData = await db.query(querynew);

        //         resultSubData = resultSubData.rows;

        //         resultDatafilter[i]['attachment'] = resultSubData;

        //         var bannerData = [];
        //         var backgroundData = [];
        //         var logoData = [];
        //         var otherData = [];

        //         if(resultSubData && typeof resultSubData !=="undefined" && resultSubData.length>0){
        //             for (var k = 0; k < resultSubData.length; k++) {
        //                 if(resultSubData[k].type==="logo"){
        //                     logoData.push(resultSubData[k].attachment);
        //                 }else{
        //                     if(resultSubData[k].type==="banner"){
        //                         bannerData.push(resultSubData[k].attachment);
        //                     }else{
        //                         if(resultSubData[k].type==="background"){
        //                             backgroundData.push(resultSubData[k].attachment);
        //                         }else{
        //                             otherData.push(resultSubData[k].attachment);
        //                         }   
        //                     }    
        //                 }
        //             }
        //         }
                
        //         resultDatafilter[i]['banner'] = bannerData;
        //         resultDatafilter[i]['background'] = backgroundData;
        //         resultDatafilter[i]['logo'] = logoData;
        //         resultDatafilter[i]['other'] = otherData;

        //     }
        // }

    if(resultDatafilter && typeof resultDatafilter !=="undefined" && resultDatafilter.length>0){
        return resultDatafilter;
    }
   

    } catch (err) {
        console.log("err: ");
        console.log(err);
        result = {};
        return result;
    }
}


const detailsList = async (req, res) => {
    var result = {};
    try {
        console.log("123456");
        var where_str = " where t.status = 1 and t.id ="+req.query.tournament_id ;

        //var query = "SELECT t.tournament_name, t.tournament_start_date, t.tournament_start_time, t.tournament_end_date, t.tournament_end_time, t.tournament_venue, v.venue_name, t.tournament_city, ct.city_name, t.tournament_country, c.name, t.sports, s.sports_name  FROM tournament AS t  LEFT JOIN venue AS v ON v.id = t.tournament_venue LEFT JOIN city AS ct ON ct.id = t.tournament_city LEFT JOIN country AS c ON c.id = t.tournament_country LEFT JOIN sports AS s ON s.id = t.sports "+where_str;
        // const current = new Date();
        // const date = `${current.getFullYear()}-${current.getMonth()+1}-${current.getDate()}`;
        // //const isFilterQuery = filterKeys.some(item => (item in req.body && req.body[item]));
        // console.log("req.body.tournament_name");
        // //console.log(req.query.tournament_name); 
        // let sports_name = '';
       
        // if (req.query.sports_name) {
        //     sports_name = ` AND s.sports_name = '${req.query.sports_name}'`;
        // }
        // let venue_name = '';
        // if (req.query.venue_name) {
        //     venue_name = ` AND v.venue_name = '${req.query.venue_name}'`;
        // }
        // let UpcomingList_data = '';
        // if (req.query.past_list) {
        //    // DATE(t.tournament_end_date) < date
        //     UpcomingList_data = ` AND DATE(t.tournament_end_date) > ${date}`;
        //     //UpcomingList = ` AND venue_id = ${req.query.UpcomingList}`;
        // } 
        // let pastList_data = '';
        // if (req.query.upcoming_list) {
           
        //     pastList_data = ` AND DATE(t.tournament_end_date) < ${date}`;
           
        // }

        // let live_data = '';
        // if (req.query.live) {
           
        //     live_data = ` AND live = ${req.query.live}`;
           
        // }
       

        //  var querynew = "SELECT t.id, t.is_champ,t.tournament_description, t.tournament_name, t.tournament_start_date, t.tournament_start_time, t.tournament_end_date, t.tournament_end_time, t.tournament_venue,s.sports_name,s.id, v.venue_name, t.tournament_city, ct.city_name, t.tournament_country, c.name FROM tournament AS t  LEFT JOIN venue AS v ON v.id = t.tournament_venue LEFT JOIN sports AS s ON s.id = t.sports:: integer LEFT JOIN city AS ct ON ct.id = t.tournament_city LEFT JOIN country AS c ON c.id = t.tournament_country"+where_str+sports_name+venue_name+UpcomingList_data+pastList_data+live_data; 

        // var resultDatafilter = await db.query(querynew);

        // console.log("querynew: ");
        // console.log(querynew);

        // resultDatafilter = resultDatafilter.rows;

        // if(resultDatafilter && typeof resultDatafilter !=="undefined" && resultDatafilter.length>0){
        //     for (var i = 0; i < resultDatafilter.length; i++) {
        //         //attachment
        //         var query = "SELECT type, Concat('"+UploadFileLink+"', CASE WHEN attachment  != '' THEN  Concat(attachment) end) as attachment FROM tournament_attachment where status = 1 and tournament_id = "+resultDatafilter[i].id;


        //         var resultSubData = await db.query(query);

        //         resultSubData = resultSubData.rows;

        //         //resultDatafilter[i]['attachment'] = resultSubData;

        //         var bannerData = [];
        //         var backgroundData = [];
        //         var logoData = [];
        //         var otherData = [];

        //         if(resultSubData && typeof resultSubData !=="undefined" && resultSubData.length>0){
        //             for (var k = 0; k < resultSubData.length; k++) {
        //                 if(resultSubData[k].type==="logo"){
        //                     logoData.push(resultSubData[k].attachment);
        //                 }else{
        //                     if(resultSubData[k].type==="banner"){
        //                         bannerData.push(resultSubData[k].attachment);
        //                     }else{
        //                         if(resultSubData[k].type==="background"){
        //                             backgroundData.push(resultSubData[k].attachment);
        //                         }else{
        //                             otherData.push(resultSubData[k].attachment);
        //                         }   
        //                     }    
        //                 }
        //             }
        //         }
                
        //         resultDatafilter[i]['banner'] = bannerData;
        //         resultDatafilter[i]['background'] = backgroundData;
        //         resultDatafilter[i]['logo'] = logoData;
        //         resultDatafilter[i]['other'] = otherData;

        //         //affliations
        //         var query = "SELECT * FROM tournament_affliations where tournament_id = "+resultDatafilter[i].id;

        //         var resultSubData = await db.query(query);

        //         resultSubData = resultSubData.rows;

        //         resultDatafilter[i]['affliations'] = resultSubData;

        //         //touawards
        //         var query = "SELECT * FROM tournament_awards where tournament_id = "+resultDatafilter[i].id;

        //         var resultSubData = await db.query(query);

        //         resultSubData = resultSubData.rows;

        //         resultDatafilter[i]['awards'] = resultSubData;

        //         //directors
        //         var query = "SELECT * FROM tournament_directors where tournament_id = "+resultDatafilter[i].id;

        //         var resultSubData = await db.query(query);

        //         resultSubData = resultSubData.rows;

        //         resultDatafilter[i]['directors'] = resultSubData;

        //         //fee
        //         var query = "SELECT * FROM tournament_fee where tournament_id = "+resultDatafilter[i].id;

        //         var resultSubData = await db.query(query);

        //         resultSubData = resultSubData.rows;

        //         resultDatafilter[i]['fee'] = resultSubData;

        //         //reviews
        //         var query = "SELECT * FROM tournament_reviews where tournament_id = "+resultDatafilter[i].id;

        //         var resultSubData = await db.query(query);

        //         resultSubData = resultSubData.rows;

        //         resultDatafilter[i]['reviews'] = resultSubData;

        //         //sponsers
        //         var query = "SELECT * FROM tournament_sponsers where tournament_id = "+resultDatafilter[i].id;

        //         var resultSubData = await db.query(query);

        //         resultSubData = resultSubData.rows;

        //         resultDatafilter[i]['sponsers'] = resultSubData;

        //         //type
        //         var query = "SELECT * FROM tournament_type";

        //         var resultSubData = await db.query(query);

        //         resultSubData = resultSubData.rows;

        //         resultDatafilter[i]['type'] = resultSubData;
        //     }
        // }




                var bannerData = [];
                var backgroundData = [];
                var logoData = [];
                var otherData = [];

                var olympicbannerData = [];
                var olympicbackgroundData = [];
                var olympiclogoData = [];
                var olympicotherData = [];

    //var query = "SELECT t.id,t.registration_fee, t.is_champ,t.tournament_description, t.tournament_name, t.tournament_start_date, t.tournament_start_time, t.tournament_end_date, t.tournament_end_time, t.tournament_venue, v.venue_name, t.tournament_city, ct.city_name, t.tournament_country, c.name FROM tournament AS t  LEFT JOIN venue AS v ON v.id = t.tournament_venue LEFT JOIN city AS ct ON ct.id = t.tournament_city LEFT JOIN country AS c ON c.id = t.tournament_country"+where_str;
    
        var query = "SELECT t.id,o.id as olympics_id,t.type as tournament_type,t.no_team,t.min_player,t.max_player,t.olympics_sports,o.olympic_sports,s.sports_name,t.tournament_registration_end_date,t.tournament_registration_open_date,t.venue_other,t.registration_fee,cts.city_name as olympic_city_name,osp.state_name as olympic_state_name,o.olympic_name,o.olympic_description,o.olympic_venue,va.venue_name as olympic_venue_name,o.olympic_country,oct.name as olympic_country_name,o.olympic_city,o.olympic_state,o.olympic_start_date,o.olympic_end_date,t.is_champ, t.tournament_name, t.tournament_start_date, t.tournament_start_time, t.tournament_end_date, t.tournament_end_time,t.tournament_description, t.tournament_venue, v.venue_name, t.tournament_city, ct.city_name, t.tournament_country, c.name FROM tournament AS t LEFT JOIN olympic as o on o.id = t.olympics_sports LEFT JOIN country AS oct ON oct.id = o.olympic_country LEFT JOIN state AS osp ON osp.id = o.olympic_state LEFT JOIN venue AS va ON va.id = o.olympic_venue LEFT JOIN city AS cts ON cts.id = o.olympic_city LEFT join sports as s on s.id = t.sports::integer LEFT JOIN venue AS v ON v.id = t.tournament_venue LEFT JOIN city AS ct ON ct.id = t.tournament_city LEFT JOIN country AS c ON c.id = t.tournament_country"+where_str;

        var resultData = await db.query(query);

        console.log("query: ");
        console.log(query);

        resultData = resultData.rows;

        let match_status ="SELECT min(match_status) as status from match_schedule WHERE tournament_id = "+req.query.tournament_id+" "

        var match_statussr = await db.query(match_status);

        console.log("query:111111111111111111111111111111111 ");  
       array = match_statussr.rows ;

       //resultData[resultData.length - 1] = { ...resultData[resultData.length - 2], min: 1 }; 

       //let convertedString = "min: " + array[0].min;
        
        resultData[0]['match_status'] = array;
        //resultData.push(convertedString);  


console.log("query:2222222222222222 ");  
       console.log(resultData)

        //resultData['match_statussr'] = match_statussr.rows;


        	for (var j = 0; j < resultData.length; j++) {

                    var sportsdata = "SELECT sports_name from sports where id in ("+resultData[j].olympics_id+")"; 
                    console.log("sport_name.......................");
                    console.log(sportsdata);

                    var sportinfo = await db.query(sportsdata);

                    resultData[j]['olympic_sports_name'] = sportinfo.rows;
                }

        	if(resultData && typeof resultData !=="undefined" && resultData.length>0){
            for (var i = 0; i < resultData.length; i++) {
                //attachment
                var query = "SELECT type, Concat('"+UploadFileLink+"', CASE WHEN attachment  != '' THEN  Concat(attachment) end) as attachment FROM tournament_attachment where status = 1 and tournament_id = "+resultData[i].id;


                var resultSubData = await db.query(query); 

                resultSubData = resultSubData.rows;

                if(resultSubData && typeof resultSubData !=="undefined" && resultSubData.length>0){ 
                    for (var k = 0; k < resultSubData.length; k++) {
                        if(resultSubData[k].type==="logo"){
                            logoData.push(resultSubData[k].attachment);
                        }else{
                            if(resultSubData[k].type==="banner"){
                                bannerData.push(resultSubData[k].attachment);
                            }else{
                                if(resultSubData[k].type==="background"){
                                    backgroundData.push(resultSubData[k].attachment);
                                }else{
                                    otherData.push(resultSubData[k].attachment);
                                }   
                            }    
                        }
                    }
                }

                var olympicquery = "SELECT type, Concat('"+UploadFileLink+"', CASE WHEN attachment  != '' THEN  Concat(attachment) end) as attachment FROM olympic_attachment where status = 1 and olympic_id = "+resultData[i].olympics_id; 
                var olympicinfo = await db.query(olympicquery);
                olympicresultdata = olympicinfo.rows;

                if(olympicresultdata && typeof olympicresultdata !=="undefined" && olympicresultdata.length>0){ 
                    for (var k = 0; k < olympicresultdata.length; k++) {
                        if(olympicresultdata[k].type==="logo"){
                            olympiclogoData.push(olympicresultdata[k].attachment);
                        }else{
                            if(olympicresultdata[k].type==="banner"){
                                olympicbannerData.push(olympicresultdata[k].attachment);
                            }else{
                                if(olympicresultdata[k].type==="background"){
                                    olympicbackgroundData.push(olympicresultdata[k].attachment);
                                }else{
                                    olympicotherData.push(olympicresultdata[k].attachment);
                                }   
                            }    
                        }
                    }
                }
                //resultData[i]['attachment'] = resultSubData;

                

                

                
                
                resultData[i]['banner'] = bannerData;
                resultData[i]['background'] = backgroundData;
                resultData[i]['logo'] = logoData;
                resultData[i]['other'] = otherData;

                resultData[i]['olympic_banner'] = olympicbannerData;
                resultData[i]['olympic_background'] = olympicbackgroundData;
                resultData[i]['olympic_logo'] = olympiclogoData;
                resultData[i]['olympic_other'] = olympicotherData;



                //affliations
                var query = "SELECT *, Concat('"+UploadFileLink+"', CASE WHEN logo  != '' THEN  Concat(logo) end) as logo FROM tournament_affliations where tournament_id = "+resultData[i].id;
                //var query = "SELECT * FROM tournament_affliations where tournament_id = "+resultData[i].id;

                var resultSubData = await db.query(query);

                resultSubData = resultSubData.rows;

                resultData[i]['affliations'] = resultSubData;


                //++++++++++++++++ Olympic Affliations  ++++++++++++++++++++++++++++//
                var query = "SELECT *, Concat('"+UploadFileLink+"', CASE WHEN logo  != '' THEN  Concat(logo) end) as logo FROM olympic_affliations where olympic_id = "+resultData[i].olympics_id;
                //var query = "SELECT * FROM tournament_affliations where tournament_id = "+resultData[i].id;

                var resultSubData = await db.query(query);

                resultSubData = resultSubData.rows;

                resultData[i]['olympic_affliations'] = resultSubData;

                //touawards

                //var query = "SELECT *, Concat('"+UploadFileLink+"', CASE WHEN logo  != '' THEN  Concat(logo) end) as logo FROM tournament_awards where tournament_id = "+resultData[i].id;

                //var query = "SELECT ta.id,string_agg(spam.award_name,',') as award_name,Concat('"+UploadFileLink+"', CASE WHEN award_logo  != '' THEN  Concat(award_logo) end) as award_logo FROM tournament_awards as ta LEFT join subscriber_play_awards_master as spam on spam.id =  any(string_to_array(ta.awards_type,',')::int[]) where tournament_id = "+resultData[i].id+" group by ta.id,spam.award_logo";
                     
                     
                var query ="SELECT awards_type from tournament_awards WHERE tournament_id = "+resultData[i].id+"";
                var resultSubDatag = await db.query(query);
                
                resultSubDataf = resultSubDatag.rows;

                //var querydata = " SELECT id,award_name, Concat('"+UploadFileLink+"', CASE WHEN award_logo  != '' THEN  Concat(award_logo) end) as award_logo FROM subscriber_play_awards_master WHERE id in ("+resultSubDataf[0].awards_type+")";
               
                // var querydata ="SELECT id,award_name, Concat('"+UploadFileLink+"', CASE WHEN award_logo  != '' THEN  Concat(award_logo) end) as award_logo subscriber_play_awards_master "

                var querydata = "SELECT t.*,sw.award_name,Concat('"+UploadFileLink+"', CASE WHEN award_logo  != '' THEN  Concat(award_logo) end) as award_logo FROM tournament_awards as t LEFT JOIN subscriber_play_awards_master as sw on sw.id = t.awards_type  where tournament_id = "+resultData[i].id;
                

                var resultSubData = await db.query(querydata);  

                resultSubData = resultSubData.rows;
                resultData[i]['awards'] = resultSubData;


                //+++++++++++++++++++++++++++++++ olympic award +++++++++++++++++++++++++++
                var querydata = "SELECT t.*,sw.award_name,Concat('"+UploadFileLink+"', CASE WHEN award_logo  != '' THEN  Concat(award_logo) end) as award_logo FROM olympic_awards as t LEFT JOIN subscriber_play_awards_master as sw on sw.id:: varchar = t.awards_type  where olympic_id = "+resultData[i].olympics_id;
                var resultSubData = await db.query(querydata);  

                resultSubData = resultSubData.rows;
                resultData[i]['olympics_awards'] = resultSubData;



                //directors
                var query = "SELECT * FROM tournament_directors where tournament_id = "+resultData[i].id;

                var resultSubData = await db.query(query);

                resultSubData = resultSubData.rows;

                resultData[i]['directors'] = resultSubData;

                //++++++++++++++++++++++++++++++++++++olympic director +++++++++++++++++++

                var query ="SELECT * from olympic_organizers where olympic_id ="+resultData[i].olympics_id;
                var resultSubData = await db.query(query);
                var resultSubData = resultSubData.rows;
                resultData[i]['olympic_directors'] = resultSubData;
                
                // olympic_fee
                var query ="SELECT * from olympic_fee where olympic_id ="+resultData[i].olympics_id;
                var resultSubData = await db.query(query);
                var resultSubData = resultSubData.rows;
                resultData[i]['olympic_fee'] = resultSubData;

                //fee
                var query = "SELECT * FROM tournament_fee where tournament_id = "+resultData[i].id;

                var resultSubData = await db.query(query);

                resultSubData = resultSubData.rows;

                resultData[i]['fee'] = resultSubData;

                //reviews
                var query = "SELECT * FROM tournament_reviews where tournament_id = "+resultData[i].id;

                var resultSubData = await db.query(query);

                resultSubData = resultSubData.rows;

                resultData[i]['reviews'] = resultSubData;

                //sponsers
                //var query = "SELECT * FROM tournament_sponsers where tournament_id = "+resultData[i].id;
                var query = "SELECT *, Concat('"+UploadFileLink+"', CASE WHEN logo  != '' THEN  Concat(logo) end) as logo FROM tournament_sponsers where tournament_id = "+resultData[i].id;


                var resultSubData = await db.query(query);

                resultSubData = resultSubData.rows;

                resultData[i]['sponsers'] = resultSubData;

               //++++++++++++++++++++++++++++++++++++++ olympic sponsers
                var query = "SELECT *, Concat('"+UploadFileLink+"', CASE WHEN logo  != '' THEN  Concat(logo) end) as logo FROM olympic_sponsers where olympic_id = "+resultData[i].olympics_id;
                
                console.log(query);
                console.log("000000000000000000000000000000000000000000000000000000000");

                var resultSubData = await db.query(query);

                resultSubData = resultSubData.rows;

                resultData[i]['olympic_sponsers'] = resultSubData;

                //type
                var query = "SELECT * FROM tournament_type";

                var resultSubData = await db.query(query);

                resultSubData = resultSubData.rows;

                resultData[i]['type'] = resultSubData;
            }
        }

        
        return resultData;
      

    } catch (err) {
        console.log("err: ");
        console.log(err);
        result = {};
        return result;
    }
}

const info = async (req, res) => {
    console.log("banner website info")
    var result = {};
    try {
        console.log("req.query.id: ");
        console.log(req.query.id);

        var listStr = "SELECT *, Concat('"+BannerWebsiteLink+"', CASE WHEN image_path  != '' THEN  Concat(image_path) end) as image_path FROM banner_website WHERE status = 1 and id = "+req.query.id;

        var dataResult = await db.query(listStr);
        result = dataResult.rows;
    } catch (err) {
        console.log("err:");
        console.log(err);

        result = {};
    }
    return result;
}

const insert = async (req, res) => {
    try {
        var bannerPath = 'images/banner_website/';

        var image_path = req.body.image_path;

        var image_path_new = "";

        if (image_path && typeof image_path !=="undefined" && image_path.length) {
            var image_path = helper.uploadBase64(image_path[0], bannerPath);
            image_path_new = image_path.path;
        }

        var statusStr = "INSERT into " + process.env.SCHEMA + ".banner_website (title, description, image_path, status, created_by, created_at ) values ('"+req.body.title+"', '"+req.body.description+"', '"+image_path_new+"', 1, 1, now()) ";

        console.log("statusStr ");
        console.log(statusStr);

        await db.query(statusStr);

        return true;
    } catch (err) {
        console.log("err: ");
        console.log(err);

        return false;
    }
}

const update = async (req, res) => {
    try {

        var bannerPath = 'images/banner_website/';

        var image_path = req.body.image_path;

        var image_path_new = "";

        if (image_path && typeof image_path !=="undefined" && image_path.length) {
            var image_path = helper.uploadBase64(image_path[0], bannerPath);
            image_path_new = image_path.path;
        }

        var updateStr = "";

        if(image_path_new && typeof image_path_new !=="undefined" && image_path_new!==""){
            updateStr = ", image_path='"+image_path_new+"' "
        }

        var statusStr = "UPDATE " + process.env.SCHEMA + ".banner_website SET title='" + req.body.title + "', description='" + req.body.description + "', updated_at=now() "+updateStr+" WHERE id=" + req.body.id + "";

        console.log("update statusStr:");
        console.log(statusStr);

        await db.query(statusStr);
        return true;
    } catch (err) {
        
        console.log("update err:");
        console.log(err);

        return false;
    }
}

//eventlist
// const eventlist = async (req, res) => {
//             let result = {};
//             try {
//                 console.log("req.query.id: ");
//                 console.log(req.query.id);
            
//             let listStr = "SELECT * FROM event where status = 1 and tournament_id = "+req.query.id+" ORDER BY id";
//             console.log('listStr-----------------------------');
//             console.log(listStr);
//             let dataResult = await db.query(listStr);
//             result = dataResult.rows;
//             } catch (err) {
//             console.log("err:");
//             console.log(err);

//             result = {};
//             }
//             return result;
//         }

const eventlist = async (req, res) => {
    var result = {};
    try {
         
        console.log("gender..........");
    	console.log(req.query.gender);

        let gender = '';
        if (req.query.gender) {

            gender = ` AND g.gender = '${req.query.gender}'`;
        }
        let event_status = '';
        if (req.query.event_status) {

            event_status = ` AND match_status = '${req.query.event_status}'`;
        }

        let age = '';
        if (req.query.age) {
           
            age = ` AND a.min_age >= '${req.query.age}' && a.max_age <= '${req.query.age}' `;
        }

        var where_str = " where t.status = 1 and t.tournament_id ="+req.query.id;

        var queryfilter = "SELECT t.*, s.sports_name,g. gender,a.min_age,a.max_age, v.venue_name FROM event AS t  LEFT JOIN venue AS v ON v.id = t.venue_id LEFT join age_group as a ON a.id = t.id  LEFT join gender as g ON g.id = t.player_type_id LEFT join sports as s ON s.id = t.sports_id "+where_str+gender+age+event_status;

        var resultDatafilter = await db.query(queryfilter);  
 
        console.log("queryfilter: ");
        console.log(queryfilter);
		resultDatafilter = resultDatafilter.rows;

		if(resultDatafilter && typeof resultDatafilter !=="undefined" && resultDatafilter.length>0){ 
            for (var i = 0; i < resultDatafilter.length; i++) {  

                var query ="SELECT MIN(match_status) AS match_status, TRIM(ms.status) AS status FROM match_schedule AS mh LEFT JOIN match_status AS ms ON match_status = ms.id WHERE event_id = "+resultDatafilter[i].id+" GROUP BY TRIM(ms.status) ORDER BY match_status LIMIT 1"

               // var query = "SELECT min(match_status) as match_status ,ms.status FROM match_schedule as mh left join match_status as ms on match_status = ms.id where event_id = "+resultDatafilter[i].id+"  group by ms.status "; 

                var resultSubData = await db.query(query);

                resultSubData = resultSubData.rows;

                //resultDatafilter[i]['one'] = resultSubData.rows[0];

                resultDatafilter[i]['event_status'] = resultSubData;


                //attachment
                var query = "SELECT type, Concat('"+UploadFileLink+"', CASE WHEN attachment  != '' THEN  Concat(attachment) end) as attachment FROM event_attachment where status = 1 and event_id = "+resultDatafilter[i].id;


                var resultSubData = await db.query(query);

                resultSubData = resultSubData.rows;

                //resultDatafilter[i]['attachment'] = resultSubData;

                var bannerData = [];
                var backgroundData = [];
                var logoData = [];
                var otherData = [];

                if(resultSubData && typeof resultSubData !=="undefined" && resultSubData.length>0){ 
                    for (var k = 0; k < resultSubData.length; k++) {
                        if(resultSubData[k].type==="logo"){
                            logoData.push(resultSubData[k].attachment);
                        }else{
                            if(resultSubData[k].type==="banner"){
                                bannerData.push(resultSubData[k].attachment);
                            }else{
                                if(resultSubData[k].type==="background"){
                                    backgroundData.push(resultSubData[k].attachment);
                                }else{
                                    otherData.push(resultSubData[k].attachment);
                                }   
                            }    
                        }
                    }
                }
                
                resultDatafilter[i]['banner'] = bannerData;
                resultDatafilter[i]['background'] = backgroundData;
                resultDatafilter[i]['logo'] = logoData;
                resultDatafilter[i]['other'] = otherData;

               

                //touawards
                var query = "SELECT * FROM event_awards where event_id = "+resultDatafilter[i].id;

                var resultSubData = await db.query(query);

                resultSubData = resultSubData.rows;

                resultDatafilter[i]['awards'] = resultSubData;

              
                //reviews
                var query = "SELECT * FROM event_reviews where event_id = "+resultDatafilter[i].id;

                var resultSubData = await db.query(query);

                resultSubData = resultSubData.rows;

                resultDatafilter[i]['reviews'] = resultSubData;

                //sponsers
                var query = "SELECT * FROM event_registration where event_id = "+resultDatafilter[i].id;

                var resultSubData = await db.query(query);

                resultSubData = resultSubData.rows;

                resultDatafilter[i]['sponsers'] = resultSubData;

                //type
                var query = "SELECT * FROM event_type";

                var resultSubData = await db.query(query);

                resultSubData = resultSubData.rows;

                resultDatafilter[i]['type'] = resultSubData;
            }
        }





        var query = "SELECT t.*, a.min_age,a.max_age, v.venue_name FROM event AS t  LEFT JOIN venue AS v ON v.id = t.venue_id LEFT join age_group as a ON a.id = t.id LEFT join gender as g ON g.id = t.player_type_id"+where_str;

        var resultData = await db.query(query);

        console.log("query: ");
        console.log(query);

        resultData = resultData.rows;

        if(resultData && typeof resultData !=="undefined" && resultData.length>0){
            for (var i = 0; i < resultData.length; i++) {
                //attachment
                var query = "SELECT type, Concat('"+UploadFileLink+"', CASE WHEN attachment  != '' THEN  Concat(attachment) end) as attachment FROM event_attachment where status = 1 and event_id = "+resultData[i].id;


                var resultSubData = await db.query(query);

                resultSubData = resultSubData.rows;

                //resultData[i]['attachment'] = resultSubData;

                var bannerData = [];
                var backgroundData = [];
                var logoData = [];
                var otherData = [];

                if(resultSubData && typeof resultSubData !=="undefined" && resultSubData.length>0){
                    for (var k = 0; k < resultSubData.length; k++) {
                        if(resultSubData[k].type==="logo"){
                            logoData.push(resultSubData[k].attachment);
                        }else{
                            if(resultSubData[k].type==="banner"){
                                bannerData.push(resultSubData[k].attachment);
                            }else{
                                if(resultSubData[k].type==="background"){
                                    backgroundData.push(resultSubData[k].attachment);
                                }else{
                                    otherData.push(resultSubData[k].attachment);
                                }   
                            }    
                        }
                    }
                }
                
                resultData[i]['banner'] = bannerData;
                resultData[i]['background'] = backgroundData;
                resultData[i]['logo'] = logoData;
                resultData[i]['other'] = otherData;

               

                //touawards
                var query = "SELECT * FROM event_awards where event_id = "+resultData[i].id;

                var resultSubData = await db.query(query);

                resultSubData = resultSubData.rows;

                resultData[i]['awards'] = resultSubData;

              
                //reviews
                var query = "SELECT * FROM event_reviews where event_id = "+resultData[i].id;

                var resultSubData = await db.query(query);

                resultSubData = resultSubData.rows;

                resultData[i]['reviews'] = resultSubData;

                //sponsers
                var query = "SELECT * FROM event_registration where event_id = "+resultData[i].id;

                var resultSubData = await db.query(query);

                resultSubData = resultSubData.rows;

                resultData[i]['sponsers'] = resultSubData;

                //type
                var query = "SELECT * FROM event_type";

                var resultSubData = await db.query(query);

                resultSubData = resultSubData.rows;

                resultData[i]['type'] = resultSubData;
            }
        }


		if(resultDatafilter){

			return resultDatafilter;
		}
		else{

			return resultData;
		}
        

    } catch (err) {
        console.log("err: ");
        console.log(err);
        result = {};
        return result;
    }
}


const tournamentlist_bychamp = async (req, res) => {
    var result = {};
    try {

        console.log
        var where_str = " where olympics_sports ="+req.query.id;

        var query = `SELECT t.*, s.sports_name,sb.sub_sports_name,c.name as country ,ct.city_name,st.state_name FROM tournament as t LEFT JOIN sports as s on s.id = t.sports:: integer LEFT JOIN sub_sports as sb on sub_sports_id = t.sub_sports:: integer left join country as c on c.id = t.tournament_country LEFT JOIN state as st on st.id = t.tournament_state LEFT JOIN city as ct on ct.id = t.tournament_city where t.status = 1 and olympics_sports = '${req.query.id}' ORDER by id`;

        console.log(query);
        

        var resultData = await db.query(query);

       

        resultData = resultData.rows;
        console.log('resultData===============');
        console.log(resultData);

        if(resultData && typeof resultData !=="undefined" && resultData.length>0){
            for (var i = 0; i < resultData.length; i++) {
                //attachment
                var query = "SELECT type, Concat('"+UploadFileLink+"', CASE WHEN attachment  != '' THEN  Concat(attachment) end) as attachment FROM tournament_attachment where status = 1 and tournament_id = "+resultData[i].id;


                var resultSubData = await db.query(query);

                resultSubData = resultSubData.rows;

              console.log('resultData===============1111111111111');
               console.log(resultSubData);

                //resultData[i]['attachment'] = resultSubData;

                var bannerData = [];
                var backgroundData = [];
                var logoData = [];
               // var otherData = [];

                if(resultSubData && typeof resultSubData !=="undefined" && resultSubData.length>0){
                    for (var k = 0; k < resultSubData.length; k++) {
                        if(resultSubData[k].type==="logo"){
                            logoData.push(resultSubData[k].attachment);
                        }else{
                            if(resultSubData[k].type==="banner"){
                                bannerData.push(resultSubData[k].attachment);
                            }else{
                                if(resultSubData[k].type==="background"){
                                    backgroundData.push(resultSubData[k].attachment);
                                }else{
                                   // otherData.push(resultSubData[k].attachment);
                                }   
                            }    
                        }
                    }
                }
                
                resultData[i]['banner'] = bannerData;
                resultData[i]['background'] = backgroundData;
                resultData[i]['logo'] = logoData;
                //resultData[i]['other'] = otherData;
                
               

                //touawards
                var query = "SELECT * FROM tournament_awards where tournament_id = "+resultData[i].id;

                var resultSubData = await db.query(query);

                resultSubData = resultSubData.rows;
console.log('resultData===============22222222');
               console.log(resultSubData);
                resultData[i]['awards'] = resultSubData;

              
                //reviews
                var query = "SELECT * FROM tournament_reviews where tournament_id = "+resultData[i].id;

                var resultSubData = await db.query(query);

                resultSubData = resultSubData.rows;

                resultData[i]['reviews'] = resultSubData;
        console.log('resultData===============333333333');
               console.log(resultData);
                //sponsers
                var query = "SELECT * ,Concat('"+UploadFileLink+"', CASE WHEN logo  != '' THEN  Concat(logo) end) as logo FROM tournament_sponsers where tournament_id = "+resultData[i].id;

                var resultSubData = await db.query(query);

                resultSubData = resultSubData.rows;
        console.log('resultData===============44444444444444');
               console.log(resultSubData);
                //sponsers
                resultData[i]['sponsers'] = resultSubData;

                //type
                // var query = "SELECT * FROM tournament_type";

                // var resultSubData = await db.query(query);

                // resultSubData = resultSubData.rows;

                // resultData[i]['type'] = resultSubData;
            }
        }
        return resultData;

        

    } catch (err) {
        console.log("err: ");
        console.log(err);
        result = {};
        return result;
    }
}



const championList = async (req, res) => {

     console.log('demo...............//////////');
    var result = {};
       
        

    try {
        var where_str = " ";
        if(req.query.page_record && typeof req.query.page_record !=="undefined" && typeof req.query.page_record !=="" && req.query.page_record>0){
            where_str = "where t.status = 1 limit "+req.query.page_record;
        }
       
       var query = "SELECT t.id, t.olympic_name, t.olympic_start_date, t.olympic_start_time, t.olympic_end_time, t.olympic_venue, v.venue_name, t.olympic_city, ct.city_name, t.olympic_country, c.name FROM olympic AS t  LEFT JOIN venue AS v ON v.id = t.olympic_venue LEFT JOIN city AS ct ON ct.id = t.olympic_city LEFT JOIN country AS c ON c.id = t.olympic_country"+where_str;

        var resultData = await db.query(query);

        resultData = resultData.rows;

        console.log('resultData...............//////////');
        console.log(resultData);

        if(resultData && typeof resultData !=="undefined" && resultData.length>0){
            for (var i = 0; i < resultData.length; i++) {

                var query = "SELECT type, Concat('"+UploadFileLink+"', CASE WHEN attachment  != '' THEN  Concat(attachment) end) as attachment FROM olympic_attachment where status = 1 and olympic_id = "+resultData[i].id;

                var resultSubData = await db.query(query);

                resultSubData = resultSubData.rows;

                //resultData[i]['attachment'] = resultSubData;

                var bannerData = [];
                var backgroundData = [];
                var logoData = [];
               // var otherData = [];

                if(resultSubData && typeof resultSubData !=="undefined" && resultSubData.length>0){
                    for (var k = 0; k < resultSubData.length; k++) {
                        if(resultSubData[k].type==="logo"){
                            logoData.push(resultSubData[k].attachment);
                        }else{
                            if(resultSubData[k].type==="banner"){
                                bannerData.push(resultSubData[k].attachment);
                            }else{
                                if(resultSubData[k].type==="background"){
                                    backgroundData.push(resultSubData[k].attachment);
                                }else{
                                    otherData.push(resultSubData[k].attachment);
                                }   
                            }    
                        }
                    }
                }
               
                resultData[i]['banner'] = bannerData;
                resultData[i]['background'] = backgroundData;
                resultData[i]['logo'] = logoData;
               // resultData[i]['other'] = otherData;

            }
        }

        return resultData;

    } catch (err) {
        console.log("err: ");
        console.log(err);
        result = {};
        return result;
    }
}


/*const delete = async (req, res) => {
    try {
        var statusStr = "UPDATE " + process.env.SCHEMA + ".banner_website SET status= 2 " + req.body.sports_name + ",updated_at=now(),updated_by=" + req.myID + " WHERE id=" + req.body.id + "";
        await db.query(statusStr);
        return true;
    } catch (err) {
        return false;
    }
}*/

// const filterList = async (req, res) => {
//     var result = {};
//     try {
//         let finalQuery = {};
//         const filterKeys = [
//             'sports_name',
//             'location',
//             'UpcomingList',
//             'pastList',
//             'all',
//             'live'
            
//         ]
//         const current = new Date();
//         const date = `${current.getFullYear()}-${current.getMonth()+1}-${current.getDate()}`;
//         const isFilterQuery = filterKeys.some(item => (item in req.body && req.body[item]));

//         let sports_name = '';
//         if (req.body.sports_name) {
//             sports_name = ` AND sports_id = ${req.body.sports_name}`;
//         }
//         let location = '';
//         if (req.body.location) {
//             location = ` AND tournament_venue = ${req.body.location}`;
//         }
//         let UpcomingList = '';
//         if (req.body.UpcomingList) {
//            // DATE(t.tournament_end_date) < date
//             UpcomingList = ` AND DATE(t.tournament_end_date) > ${date}`;
//             //UpcomingList = ` AND venue_id = ${req.body.UpcomingList}`;
//         }
//         let pastList = '';
//         if (req.body.pastList) {
           
//             pastList = ` AND DATE(t.tournament_end_date) < ${date}`;
           
//         }

//         let live = '';
//         if (req.body.live) {
           
//             live = ` AND live = ${req.body.live}`;
           
//         }


//         var where_str = " ";
//         if(req.query.page_record && typeof req.query.page_record !=="undefined" && typeof req.query.page_record !=="" && req.query.page_record>0){
//             where_str = " limit "+req.query.page_record;
//         }
//         //var query = "SELECT t.tournament_name, t.tournament_start_date, t.tournament_start_time, t.tournament_end_date, t.tournament_end_time, t.tournament_venue, v.venue_name, t.tournament_city, ct.city_name, t.tournament_country, c.name, t.sports, s.sports_name  FROM tournament AS t  LEFT JOIN venue AS v ON v.id = t.tournament_venue LEFT JOIN city AS ct ON ct.id = t.tournament_city LEFT JOIN country AS c ON c.id = t.tournament_country LEFT JOIN sports AS s ON s.id = t.sports "+where_str;

//         var query = "SELECT t.id, t.is_champ, t.tournament_name, t.tournament_start_date, t.tournament_start_time, t.tournament_end_date, t.tournament_end_time, t.tournament_venue, v.venue_name, t.tournament_city, ct.city_name, t.tournament_country, c.name FROM tournament AS t  LEFT JOIN venue AS v ON v.id = t.tournament_venue LEFT JOIN city AS ct ON ct.id = t.tournament_city LEFT JOIN country AS c ON c.id = t.tournament_country"+where_str,sports_name,location,UpcomingList,pastList,live;

//         var resultData = await db.query(query);

//         resultData = resultData.rows;

//         if(resultData && typeof resultData !=="undefined" && resultData.length>0){
//             for (var i = 0; i < resultData.length; i++) {

//                 var query = "SELECT type, Concat('"+UploadFileLink+"', CASE WHEN attachment  != '' THEN  Concat(attachment) end) as attachment FROM tournament_attachment where status = 1 and tournament_id = "+resultData[i].id;

//                 var resultSubData = await db.query(query);

//                 resultSubData = resultSubData.rows;

//                 resultData[i]['attachment'] = resultSubData;

//                 var bannerData = [];
//                 var backgroundData = [];
//                 var logoData = [];
//                 var otherData = [];

//                 if(resultSubData && typeof resultSubData !=="undefined" && resultSubData.length>0){
//                     for (var k = 0; k < resultSubData.length; k++) {
//                         if(resultSubData[k].type==="logo"){
//                             logoData.push(resultSubData[k].attachment);
//                         }else{
//                             if(resultSubData[k].type==="banner"){
//                                 bannerData.push(resultSubData[k].attachment);
//                             }else{
//                                 if(resultSubData[k].type==="background"){
//                                     backgroundData.push(resultSubData[k].attachment);
//                                 }else{
//                                     otherData.push(resultSubData[k].attachment);
//                                 }   
//                             }    
//                         }
//                     }
//                 }
                
//                 resultData[i]['banner'] = bannerData;
//                 resultData[i]['background'] = backgroundData;
//                 resultData[i]['logo'] = logoData;
//                 resultData[i]['other'] = otherData;

//             }
//         }

//         return resultData;

//     } catch (err) {
//         console.log("err: ");
//         console.log(err);
//         result = {};
//         return result;
//     }
// }

const sportList = async (req, res) => {
   console.log("demo");

                let result = {};
                try {
                    let listStr = "SELECT DISTINCT sports_name,id FROM sports where status = 1 ORDER BY sports_name";
                    let dataResult = await db.query(listStr);
                    result = dataResult.rows;
                    
                   return result;
                    console.log("result,,,,,,,,,,,,,,,,,,,");
                    console.log(result);
                } catch (err) {
                     console.log("err");
                     console.log(err);
                    result = {};
                }
                return 
        

}

const locationtList = async (req, res) => {


                let result = {};
                try {
                    let listStr = "SELECT DISTINCT id,venue_name FROM venue where status = 1 ORDER BY venue_name";
                    let dataResult = await db.query(listStr);
                    result = dataResult.rows;

                     return result;
                } catch (err) {
                    result = {};
                }
                return 
        

}

const UpcomingListNew = async (req,res) =>{

let result ={};
try{
    var where_str = " ";
        if(req.query.page_record && typeof req.query.page_record !=="undefined" && typeof req.query.page_record !=="" && req.query.page_record>0){
            where_str = " limit "+req.query.page_record;
        }

        const current = new Date();
        const date = `${current.getFullYear()}-${current.getMonth()+1}-${current.getDate()}`;

        console.log('date.................');
        console.log(date);



        var tournamentlis = "SELECT t.id as tournament_id,s.sports_name,t.venue_other,t.registration_fee,t.is_champ, t.tournament_name, t.tournament_start_date, t.tournament_start_time, t.tournament_end_date, t.tournament_end_time,t.tournament_description, t.tournament_venue, v.venue_name, t.tournament_city, ct.city_name, t.tournament_country, c.name FROM tournament AS t LEFT join sports as s on s.id = t.sports::integer LEFT JOIN venue AS v ON v.id = t.tournament_venue LEFT JOIN city AS ct ON ct.id = t.tournament_city LEFT JOIN country AS c ON c.id = t.tournament_country  where t.status = 1 and olympics_sports is null and DATE(t.tournament_end_date) > '"+date+"' "+where_str;
        console.log(tournamentlis);
        var tournament = await db.query(tournamentlis);
        

        var resultData = tournament.rows;

       
        
            for (var i = 0; i < resultData.length; i++) {
               

                resultData[i].tournament_list_kye = resultData[i].tournament_id;
               
            }
       // }
        

        if(resultData && typeof resultData !=="undefined" && resultData.length>0){
            for (var i = 0; i < resultData.length; i++) {

                var query = "SELECT type, Concat('"+UploadFileLink+"', CASE WHEN attachment  != '' THEN  Concat(attachment) end) as attachment FROM tournament_attachment where status = 1 and tournament_id = "+resultData[i].tournament_id;

                console.log("1111111111111111");
                var resultSubData = await db.query(query);

                resultSubData= resultSubData.rows;

                var bannerData = [];
                var backgroundData = [];
                var logoData = [];
                var otherData = [];

                if(resultSubData && typeof resultSubData !=="undefined" && resultSubData.length>0){
                    for (var k = 0; k < resultSubData.length; k++) {
                        if(resultSubData[k].type==="logo"){
                            logoData.push(resultSubData[k].attachment);
                        }else{
                            if(resultSubData[k].type==="banner"){
                                bannerData.push(resultSubData[k].attachment);
                            }else{
                                if(resultSubData[k].type==="background"){
                                    backgroundData.push(resultSubData[k].attachment);
                                }else{
                                    otherData.push(resultSubData[k].attachment);
                                }   
                            }    
                        }
                    }
                }
                
                resultData[i]['banner'] = bannerData;
                resultData[i]['background'] = backgroundData; 
                resultData[i]['logo'] = logoData; 
                // resultData[i]['other'] = otherData;

            }
        }
        
                var champlist = "SELECT o.*,o.id as champ_id,ov.venue_name,c.name,oc.city_name,os.state_name from olympic as o  left join state as os on os.id = o.olympic_state left join city as oc on oc.id = o.olympic_city LEFT JOIN country as c on c.id = o.olympic_country LEFT JOIN venue as ov on ov.id = o.olympic_venue  where o.status = 1 and DATE(o.olympic_end_date) > '"+date+"'";
                console.log(champlist);
                console.log("222222222222222222222222");
                var champ = await db.query(champlist);
                var champinfo = champ.rows;

     //            for (var k = 0; k < champinfo.length; k++) {
					// 	 champinfo[k].type = "meeting";
					// 	result.push(champinfo[k]); 
					// }

            for (var i = 0; i < champinfo.length; i++) {
               

                champinfo[i].tournament_list_kye = champinfo[i].champ_id;
                champinfo[i].is_champ = true;
               
            }


                for (var j = 0; j < champinfo.length; j++) {

            		var sportsdata = "SELECT sports_name from sports where id in ("+champinfo[j].olympic_sports+")"; 

                     console.log(sportsdata);
                    console.log("33333333333333333333");
            		console.log("sport_name.......................");
            		console.log(sportsdata);

            		var sportinfo = await db.query(sportsdata);

            		champinfo[j]['olympic_sports_name'] = sportinfo.rows;
            	}
            	if(champinfo && typeof champinfo !=="undefined" && champinfo.length>0){
            
            for (var i = 0; i < champinfo.length; i++) {

                var query = "SELECT type, Concat('"+UploadFileLink+"', CASE WHEN attachment  != '' THEN  Concat(attachment) end) as attachment FROM olympic_attachment where status = 1 and olympic_id = "+champinfo[i].champ_id;

                var resultSubData = await db.query(query);

                resultSubData = resultSubData.rows;
                console.log(resultSubData);
                console.log("uuuuuuuuuuuu");

                var bannerData = [];
                var backgroundData = [];
                var logoData = [];
                var otherData = [];

                if(resultSubData && typeof resultSubData !=="undefined" && resultSubData.length>0){
                    for (var k = 0; k < resultSubData.length; k++) {
                        if(resultSubData[k].type==="logo"){
                            logoData.push(resultSubData[k].attachment);
                        }else{
                            if(resultSubData[k].type==="banner"){
                                bannerData.push(resultSubData[k].attachment);
                            }else{
                                if(resultSubData[k].type==="background"){ 
                                    backgroundData.push(resultSubData[k].attachment);
                                }else{
                                    otherData.push(resultSubData[k].attachment);
                                }   
                            }    
                        }
                    }
                }
                
                champinfo[i]['banner'] = bannerData;
                champinfo[i]['background'] = backgroundData;
                champinfo[i]['logo'] = logoData; 
                // resultData[i]['other'] = otherData;

            }
        }
            	
            
			//champinfo.push(type:"champinfo");
			//champinfo['type'] = "is_champ"; 
			//champinfo.push({'type':'is_champ'});
			//champinfo.push({['type']: 'is_champ'});

            result['tournamentlist'] = resultData;


            result['Olympiclist'] = champinfo;



            return  result;
        


    


}
catch(err){
    console.log(err);
    result ={};
}

}

const PastListNew = async (req,res) =>{

let result ={};
try{
    var where_str = " ";
        if(req.query.page_record && typeof req.query.page_record !=="undefined" && typeof req.query.page_record !=="" && req.query.page_record>0){
            where_str = " limit "+req.query.page_record;
        }

        const current = new Date();
    	const date = `${current.getFullYear()}-${current.getMonth()+1}-${current.getDate()}`;

        console.log('date.................');
        console.log(date);



        var tournamentlis = "SELECT t.id as tournament_id,s.sports_name,t.venue_other,t.registration_fee,t.is_champ, t.tournament_name, t.tournament_start_date, t.tournament_start_time, t.tournament_end_date, t.tournament_end_time,t.tournament_description, t.tournament_venue, v.venue_name, t.tournament_city, ct.city_name, t.tournament_country, c.name FROM tournament AS t LEFT join sports as s on s.id = t.sports::integer LEFT JOIN venue AS v ON v.id = t.tournament_venue LEFT JOIN city AS ct ON ct.id = t.tournament_city LEFT JOIN country AS c ON c.id = t.tournament_country  where t.status = 1 and olympics_sports is null and DATE(t.tournament_end_date) < '"+date+"' "+where_str;
        console.log(tournamentlis);
        var tournament = await db.query(tournamentlis);
        

        var resultData = tournament.rows;
        
        for (var i = 0; i < resultData.length; i++) {
               

                resultData[i].tournament_list_kye = resultData[i].tournament_id;
               
            }

        if(resultData && typeof resultData !=="undefined" && resultData.length>0){
            for (var i = 0; i < resultData.length; i++) {

                var query = "SELECT type, Concat('"+UploadFileLink+"', CASE WHEN attachment  != '' THEN  Concat(attachment) end) as attachment FROM tournament_attachment where status = 1 and tournament_id = "+resultData[i].tournament_id;
            console.log("0000000000000000000");
        console.log(query);
                var resultSubData = await db.query(query);

                resultSubData= resultSubData.rows;

                var bannerData = [];
                var backgroundData = [];
                var logoData = [];
                var otherData = [];

                if(resultSubData && typeof resultSubData !=="undefined" && resultSubData.length>0){
                    for (var k = 0; k < resultSubData.length; k++) {
                        if(resultSubData[k].type==="logo"){
                            logoData.push(resultSubData[k].attachment);
                        }else{
                            if(resultSubData[k].type==="banner"){
                                bannerData.push(resultSubData[k].attachment);
                            }else{
                                if(resultSubData[k].type==="background"){
                                    backgroundData.push(resultSubData[k].attachment);
                                }else{
                                    otherData.push(resultSubData[k].attachment);
                                }   
                            }    
                        }
                    }
                }
                console.log("11111111111111111111111");
                resultData[i]['banner'] = bannerData;
                resultData[i]['background'] = backgroundData;
                resultData[i]['logo'] = logoData;
                // resultData[i]['other'] = otherData;

            }
        }
        
                var champlist = "SELECT o.*,c.name,oc.city_name,os.state_name from olympic as o  left join state as os on os.id = o.olympic_state left join city as oc on oc.id = o.olympic_city LEFT JOIN country as c on c.id = o.olympic_country where o.status = 1 and DATE(o.olympic_end_date) < '"+date+"'";
                console.log(champlist)
                console.log("2222222222222222222222222222");
                var champ = await db.query(champlist);
                var champinfo = champ.rows;

            for (var i = 0; i < champinfo.length; i++) {
               

                champinfo[i].tournament_list_kye = champinfo[i].champ_id;
                champinfo[i].is_champ = true;
               
            }
                for (var j = 0; j < champinfo.length; j++) {

            		var sportsdata = "SELECT sports_name from sports where id in ("+champinfo[j].olympic_sports+")"; 
            		console.log("sport_name.......................");
            		console.log(sportsdata);

            		var sportinfo = await db.query(sportsdata);

            		champinfo[j]['olympic_sports_name'] = sportinfo.rows;
            	}

            if(champinfo && typeof champinfo !=="undefined" && champinfo.length>0){
            
            for (var i = 0; i < champinfo.length; i++) {

                var query = "SELECT type, Concat('"+UploadFileLink+"', CASE WHEN attachment  != '' THEN  Concat(attachment) end) as attachment FROM olympic_attachment where status = 1 and olympic_id = "+champinfo[i].id;
                console.log(query)
                console.log("333333333333333333333333");
                var resultSubData = await db.query(query);

                resultSubData = resultSubData.rows;
                console.log(resultSubData);
                console.log("uuuuuuuuuuuu");

                var bannerData = [];
                var backgroundData = [];
                var logoData = [];
                var otherData = [];

                if(resultSubData && typeof resultSubData !=="undefined" && resultSubData.length>0){
                    for (var k = 0; k < resultSubData.length; k++) {
                        if(resultSubData[k].type==="logo"){
                            logoData.push(resultSubData[k].attachment);
                        }else{
                            if(resultSubData[k].type==="banner"){
                                bannerData.push(resultSubData[k].attachment);
                            }else{
                                if(resultSubData[k].type==="background"){ 
                                    backgroundData.push(resultSubData[k].attachment);
                                }else{
                                    otherData.push(resultSubData[k].attachment);
                                }   
                            }    
                        }
                    }
                }


                console.log("4444444444444444444444444");
                
                champinfo[i]['banner'] = bannerData;
                champinfo[i]['background'] = backgroundData;
                champinfo[i]['logo'] = logoData;
                // resultData[i]['other'] = otherData;

            }
        }
            	
            
			//champinfo.push(type:"champinfo"); 
			//result.champinfo.type = "is_champ"; 

			console.log("fffffffffffffff");
			//champinfo.push({'type':'is_champ'});
			//champinfo.push({['type']: 'is_champ'});

            result['tournamentlist'] = resultData;


            result['Olympiclist'] = champinfo;



            return  result;
        }
	catch(err){
    console.log(err);
    result ={};
	}

}
const detailsListNew = async (req, res) => {
    var result = {};
    try {
        console.log("123456");
        if(req.query.tournament_id && typeof req.query.tournament_id !== 'undefined' && req.query.tournament_id !== ''){
        var where_str = " where t.status = 1 and t.id ="+req.query.tournament_id;
		
		var bannerData = [];
        var backgroundData = [];
        var logoData = [];
        var otherData = [];

        

    //var query = "SELECT t.id,t.registration_fee, t.is_champ,t.tournament_description, t.tournament_name, t.tournament_start_date, t.tournament_start_time, t.tournament_end_date, t.tournament_end_time, t.tournament_venue, v.venue_name, t.tournament_city, ct.city_name, t.tournament_country, c.name FROM tournament AS t  LEFT JOIN venue AS v ON v.id = t.tournament_venue LEFT JOIN city AS ct ON ct.id = t.tournament_city LEFT JOIN country AS c ON c.id = t.tournament_country"+where_str;
    
        var query = "SELECT t.id,s.sports_name,t.venue_other,t.registration_fee,t.is_champ, t.tournament_name, t.tournament_start_date, t.tournament_start_time, t.tournament_end_date, t.tournament_end_time,t.tournament_description, t.tournament_venue, v.venue_name, t.tournament_city, ct.city_name, t.tournament_country, c.name FROM tournament AS t LEFT join sports as s on s.id = t.sports::integer LEFT JOIN venue AS v ON v.id = t.tournament_venue LEFT JOIN city AS ct ON ct.id = t.tournament_city LEFT JOIN country AS c ON c.id = t.tournament_country"+where_str;

        var resultData = await db.query(query);

        
         //var tournamentlist_kye =
        resultData = resultData.rows;

        

        //console.log("query:--------- ");
        //console.log(resultData);


        	// for (var j = 0; j < resultData.length; j++) {

         //            var sportsdata = "SELECT sports_name from sports where id in ("+resultData[j].olympics_id+")"; 
         //            console.log("sport_name.......................");
         //            console.log(sportsdata);

         //            var sportinfo = await db.query(sportsdata);

         //            resultData[j]['olympic_sports_name'] = sportinfo.rows;
         //        }

        	if(resultData && typeof resultData !=="undefined" && resultData.length>0){ 
                console.log("111111111111111111111111111111111111111111");
                console.log(resultData);
            for (var i = 0; i < resultData.length; i++) {
                //attachment
                var query = "SELECT type, Concat('"+UploadFileLink+"', CASE WHEN attachment  != '' THEN  Concat(attachment) end) as attachment FROM tournament_attachment where status = 1 and tournament_id = "+resultData[i].id;


                var resultSubData = await db.query(query); 

                resultSubData = resultSubData.rows;

                if(resultSubData && typeof resultSubData !=="undefined" && resultSubData.length>0){ 
                    for (var k = 0; k < resultSubData.length; k++) {
                        if(resultSubData[k].type==="logo"){
                            logoData.push(resultSubData[k].attachment);
                        }else{
                            if(resultSubData[k].type==="banner"){
                                bannerData.push(resultSubData[k].attachment);
                            }else{
                                if(resultSubData[k].type==="background"){
                                    backgroundData.push(resultSubData[k].attachment);
                                }else{
                                    otherData.push(resultSubData[k].attachment);
                                }   
                            }    
                        }
                    }
                }

                resultData[i]['banner'] = bannerData;
                resultData[i]['background'] = backgroundData;
                resultData[i]['logo'] = logoData;
                resultData[i]['other'] = otherData;

                


                //affliations
                var query = "SELECT *, Concat('"+UploadFileLink+"', CASE WHEN logo  != '' THEN  Concat(logo) end) as logo FROM tournament_affliations where tournament_id = "+resultData[i].id;
                //var query = "SELECT * FROM tournament_affliations where tournament_id = "+resultData[i].id;

                var resultSubData = await db.query(query);

                resultSubData = resultSubData.rows;

                resultData[i]['affliations'] = resultSubData;


                //++++++++++++++++ Olympic Affliations  ++++++++++++++++++++++++++++//
                // var query = "SELECT *, Concat('"+UploadFileLink+"', CASE WHEN logo  != '' THEN  Concat(logo) end) as logo FROM olympic_affliations where olympic_id = "+resultData[i].olympics_id;
                // //var query = "SELECT * FROM tournament_affliations where tournament_id = "+resultData[i].id;

                // var resultSubData = await db.query(query);

                // resultSubData = resultSubData.rows;

                // resultData[i]['olympic_affliations'] = resultSubData;

                //touawards

                //var query = "SELECT *, Concat('"+UploadFileLink+"', CASE WHEN logo  != '' THEN  Concat(logo) end) as logo FROM tournament_awards where tournament_id = "+resultData[i].id;

                //var query = "SELECT ta.id,string_agg(spam.award_name,',') as award_name,Concat('"+UploadFileLink+"', CASE WHEN award_logo  != '' THEN  Concat(award_logo) end) as award_logo FROM tournament_awards as ta LEFT join subscriber_play_awards_master as spam on spam.id =  any(string_to_array(ta.awards_type,',')::int[]) where tournament_id = "+resultData[i].id+" group by ta.id,spam.award_logo";
                     
                     
                var query ="SELECT awards_type from tournament_awards WHERE tournament_id = "+resultData[i].id+"";
                var resultSubDatag = await db.query(query);
                
                resultSubDataf = resultSubDatag.rows;

                //var querydata = " SELECT id,award_name, Concat('"+UploadFileLink+"', CASE WHEN award_logo  != '' THEN  Concat(award_logo) end) as award_logo FROM subscriber_play_awards_master WHERE id in ("+resultSubDataf[0].awards_type+")";
               
                // var querydata ="SELECT id,award_name, Concat('"+UploadFileLink+"', CASE WHEN award_logo  != '' THEN  Concat(award_logo) end) as award_logo subscriber_play_awards_master "

                var querydata = "SELECT t.*,sw.award_name,Concat('"+UploadFileLink+"', CASE WHEN award_logo  != '' THEN  Concat(award_logo) end) as award_logo FROM tournament_awards as t LEFT JOIN subscriber_play_awards_master as sw on sw.id = t.awards_type  where tournament_id = "+resultData[i].id;
                

                var resultSubData = await db.query(querydata);  

                resultSubData = resultSubData.rows;
                resultData[i]['awards'] = resultSubData;


               



                //directors
                var query = "SELECT * FROM tournament_directors where tournament_id = "+resultData[i].id;

                var resultSubData = await db.query(query);

                resultSubData = resultSubData.rows;

                resultData[i]['directors'] = resultSubData;

               
                //fee
                var query = "SELECT * FROM tournament_fee where tournament_id = "+resultData[i].id;

                var resultSubData = await db.query(query);

                resultSubData = resultSubData.rows;

                resultData[i]['fee'] = resultSubData;

                //reviews
                var query = "SELECT * FROM tournament_reviews where tournament_id = "+resultData[i].id;

                var resultSubData = await db.query(query);

                resultSubData = resultSubData.rows;

                resultData[i]['reviews'] = resultSubData;

                //sponsers
                //var query = "SELECT * FROM tournament_sponsers where tournament_id = "+resultData[i].id;
                var query = "SELECT *, Concat('"+UploadFileLink+"', CASE WHEN logo  != '' THEN  Concat(logo) end) as logo FROM tournament_sponsers where tournament_id = "+resultData[i].id;


                var resultSubData = await db.query(query);

                resultSubData = resultSubData.rows;

                resultData[i]['sponsers'] = resultSubData;

              

                //type
                var query = "SELECT * FROM tournament_type";

                var resultSubData = await db.query(query);

                resultSubData = resultSubData.rows;

                resultData[i]['type'] = resultSubData;
            }
        }
    	
        return resultData;

    	}
    	



    	else{
    		console.log("eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee");

    		var whereSTR = " where o.status = 1 and o.id = "+req.query.champ_id;

    		var querynew = "SELECT o.*,c.name,oc.city_name,os.state_name from olympic as o  left join state as os on os.id = o.olympic_state left join city as oc on oc.id = o.olympic_city LEFT JOIN country as c on c.id = o.olympic_country "+whereSTR+"";

        	var resultData = await db.query(querynew);

        	resultData = resultData.rows;

            for (var i = 0; i < resultData.length; i++) {
               

                resultData[i].is_champ = true;
               
            }
			console.log('rrrrrrrrrrrrrrr');
        	console.log(resultData);
          	if(resultData && typeof resultData !=="undefined" && resultData.length>0){
            for (var i = 0; i < resultData.length; i++) {

        	
 
                    var sportsdata = "SELECT sports_name from sports where id in ("+resultData[i].olympic_sports+")";   
                    console.log("sport_name.......................");
                    console.log(sportsdata);

                    var sportinfo = await db.query(sportsdata);

                    resultData[i]['olympic_sports_name'] = sportinfo.rows;
        
            var olympicquery = "SELECT type, Concat('"+UploadFileLink+"', CASE WHEN attachment  != '' THEN  Concat(attachment) end) as attachment FROM olympic_attachment where status = 1 and olympic_id = "+resultData[i].id; 
            var olympicinfo = await db.query(olympicquery);
            olympicresultdata = olympicinfo.rows;

            var olympicbannerData = [];
        	var olympicbackgroundData = [];
        	var olympiclogoData = [];
        	var olympicotherData = [];

                if(olympicresultdata && typeof olympicresultdata !=="undefined" && olympicresultdata.length>0){ 
                    for (var k = 0; k < olympicresultdata.length; k++) {
                        if(olympicresultdata[k].type==="logo"){
                            olympiclogoData.push(olympicresultdata[k].attachment);
                        }else{
                            if(olympicresultdata[k].type==="banner"){
                                olympicbannerData.push(olympicresultdata[k].attachment);
                            }else{
                                if(olympicresultdata[k].type==="background"){
                                    olympicbackgroundData.push(olympicresultdata[k].attachment);
                                }else{
                                    olympicotherData.push(olympicresultdata[k].attachment);
                                }   
                            }    
                        }
                    }
                }
                resultData[i]['attachment'] = resultSubData;

                resultData[i]['olympic_banner'] = olympicbannerData;
                resultData[i]['olympic_background'] = olympicbackgroundData;
                resultData[i]['olympic_logo'] = olympiclogoData;
                resultData[i]['olympic_other'] = olympicotherData;

                 //++++++++++++++++++++++++++++++++++++++ olympic sponsers
                var query = "SELECT *, Concat('"+UploadFileLink+"', CASE WHEN logo  != '' THEN  Concat(logo) end) as logo FROM olympic_sponsers where olympic_id = "+resultData[i].id;
                
                console.log(query);
                console.log("000000000000000000000000000000000000000000000000000000000");

                var resultSubData = await db.query(query);

                resultSubData = resultSubData.rows;

                resultData[i]['olympic_sponsers'] = resultSubData;

                 //++++++++++++++++++++++++++++++++++++olympic director +++++++++++++++++++

                var query ="SELECT * from olympic_organizers where olympic_id ="+resultData[i].id;
                var resultSubData = await db.query(query);
                var resultSubData = resultSubData.rows;
                resultData[i]['olympic_directors'] = resultSubData;


                var query ="SELECT * from olympic_fee where olympic_id ="+resultData[i].id;
                var resultSubData = await db.query(query);
                var resultSubData = resultSubData.rows;
                resultData[i]['olympic_fee'] = resultSubData;


                 // //+++++++++++++++++++++++++++++++ olympic award +++++++++++++++++++++++++++
                var querydata = "SELECT t.*,sw.award_name,Concat('"+UploadFileLink+"', CASE WHEN award_logo  != '' THEN  Concat(award_logo) end) as award_logo FROM olympic_awards as t LEFT JOIN subscriber_play_awards_master as sw on sw.id:: varchar = t.awards_type  where olympic_id = "+resultData[i].id;
                var resultSubData = await db.query(querydata);  

                resultSubData = resultSubData.rows;
                resultData[i]['olympics_awards'] = resultSubData;

                 //++++++++++++++++ Olympic Affliations  ++++++++++++++++++++++++++++//
                var query = "SELECT *, Concat('"+UploadFileLink+"', CASE WHEN logo  != '' THEN  Concat(logo) end) as logo FROM olympic_affliations where olympic_id = "+resultData[i].id; 
                //var query = "SELECT * FROM tournament_affliations where tournament_id = "+resultData[i].id;

                var resultSubData = await db.query(query);

                resultSubData = resultSubData.rows;

                resultData[i]['olympic_affliations'] = resultSubData;





    	}
    }

    	 return resultData;
      

    }



    } catch (err) {
        console.log("err: ");
        console.log(err);
        result = {};
        return result;
    }
}

 

const eventdetailsList = async (req, res) => {


                let result = {};
                try {
                    let listStr = "SELECT * FROM event where status = 1 and id ="+req.query.id+"";
 console.log('listStr.........')
                    console.log(listStr)
                    let dataResult = await db.query(listStr);
                    result = dataResult.rows;

                     return result;
                } catch (err) {
                    result = {};
                }
                
        

}



module.exports = { UpcomingList, pastList, withoutPastList, countList,detailsList, info, insert, update ,eventlist,championList ,tournamentlist_bychamp,sportList,locationtList,UpcomingListNew,PastListNew,detailsListNew,eventdetailsList}  