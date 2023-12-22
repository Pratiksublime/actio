const db = require('../../db');
const helper = require('../../helper/helper');
const UploadFileLink = process.env.HOST + process.env.PORT + '/';


const athletlist = async (req, res) => {
	var result = {};
	try {

		
		let sports_name = '';

		if (req.query.sports_id) {
			sports_name = ` AND e.sport_name in (${req.query.sports_id})`; 
		}

		let premium = '';
		if (req.query.premium) {
			premium = ` AND s.premium = '${req.query.premium}'`;
		}
		if (req.query.premium ="") {
			premium = "";
		}
		let gender = '';
		if (req.query.gender) {
			gender = ` AND s.gender = ${req.query.gender}`;
		}
		
		if (req.query.gender ='') {
			gender = '';
		}

		let city_name = '';

		if (req.query.city_id) {
			city_name = ` AND sp.city in (${req.query.city_id})`;
		}

		// let state_name = '';

		// if (req.query.state_name) {
		// 	state_name = ` AND sp.state in (${req.query.state_name})`; 
		// } 

  
		 
		//var query = "SELECT DISTINCT ON (s.subscriber_id) s.subscriber_id,s.id,pv.basic_view_public as view_public,s.premium,sp.city as city_id ,s.full_name,e.sport_name as sport_id,CASE WHEN cover_image IS NULL THEN '' ELSE Concat('"+UploadFileLink+"',cover_image) END  as profile_baneer,CASE WHEN (profile_image IS NULL or profile_image !='' or profile_image != '' or RTRIM(profile_image) != '' ) THEN '' ELSE Concat('"+UploadFileLink+"',profile_image) END  as profile_image FROM subscriber as s LEFT JOIN subscriber_profile as sp ON s.subscriber_id = sp.subscriber_id LEFT JOIN subscriber_sports as e ON s.subscriber_id = e.subscriber_id LEFT JOIN profile_view_public as pv ON s.subscriber_id = pv.subscriber_id  where s.sub_status = 'Active' " + sports_name + premium + gender + city_name ;
       
       	  //  var query = "SELECT DISTINCT ON (s.id) s.id,pv.basic_view_public as view_public,s.premium,sp.city as city_id ,s.full_name,e.sport_name as sport_id,CASE WHEN (cover_image IS NULL or cover_image = '') THEN '' ELSE Concat('"+UploadFileLink+"',TRIM(cover_image)) END  as profile_baneer,CASE WHEN profile_image IS NULL  THEN '' ELSE Concat('"+UploadFileLink+"',TRIM(profile_image)) END  as profile_image FROM subscriber as s LEFT JOIN subscriber_profile as sp ON s.id = sp.subscriber_id LEFT JOIN subscriber_sports as e ON s.subscriber_id = e.subscriber_id LEFT JOIN profile_view_public as pv ON s.subscriber_id = pv.subscriber_id  where s.sub_status = 'Active' " + sports_name + premium + gender + city_name ;

       	    var query = "SELECT DISTINCT ON (s.id) s.id,pv.basic_view_public as view_public,s.premium,sp.city as city_id ,s.full_name,CASE WHEN (cover_image IS NULL or cover_image = '') THEN '' ELSE Concat('"+UploadFileLink+"',TRIM(cover_image)) END  as profile_baneer,CASE WHEN (profile_image IS NULL or profile_image = ' ' or profile_image = 'null')  THEN '' ELSE Concat('"+UploadFileLink+"',TRIM(profile_image)) END  as profile_image FROM subscriber as s LEFT JOIN subscriber_profile as sp ON s.id = sp.subscriber_id LEFT JOIN subscriber_sports as e ON s.id = e.subscriber_id LEFT JOIN profile_view_public as pv ON s.id = pv.subscriber_id  where s.sub_status = 'Active' and s.status = 1 " + sports_name + premium + gender + city_name ;

		//var query = "SELECT DISTINCT ON (s.subscriber_id) s.subscriber_id,s.id,pv.basic_view_public as view_public,s.premium,sp.city as city_id ,s.full_name,e.sport_name as sport_id,CASE WHEN cover_image IS NULL THEN '' ELSE Concat('"+UploadFileLink+"',cover_image) END  as profile_baneer,CASE WHEN (profile_image IS NULL or profile_image !='' or profile_image != '' or RTRIM(profile_image) != '' ) THEN '' ELSE Concat('"+UploadFileLink+"',profile_image) END  as profile_image FROM subscriber as s LEFT JOIN subscriber_profile as sp ON s.subscriber_id = sp.subscriber_id LEFT JOIN subscriber_sports as e ON s.subscriber_id = e.subscriber_id LEFT JOIN profile_view_public as pv ON s.subscriber_id = pv.subscriber_id  where s.sub_status = 'Active' " + sports_name + premium + gender + city_name ;
		//SELECT DISTINCT ON (s.id) s.id,sport_id,pv.basic_view_public as view_public,s.premium,sp.city as city_id ,s.full_name,e.sport_name as sport_id,CASE WHEN (cover_image IS NULL or cover_image = '') THEN '' ELSE Concat('"+UploadFileLink+"',TRIM(cover_image)) END  as profile_baneer,CASE WHEN profile_image IS NULL  THEN '' ELSE Concat('"+UploadFileLink+"',TRIM(profile_image)) END  as profile_image FROM subscriber as s LEFT JOIN subscriber_profile as sp ON s.id = sp.subscriber_id LEFT JOIN subscriber_sports as e ON s.subscriber_id = e.subscriber_id LEFT JOIN profile_view_public as pv ON s.subscriber_id = pv.subscriber_id  where s.sub_status = 'Active' " + sports_name + premium + gender + city_name ;     

 
		console.log("query...................+++++++++++++++++"); 
		console.log(query);

		let dataResult = await db.query(query);
		var result = dataResult.rows;

		//console.log("query result...................+++++++++++++++++"); 
		//console.log(result);

		  if(result && typeof result !=="undefined" && result.length>0){  
		     for (var i = 0; i < result.length; i++) {
		         //var sportdata = "SELECT sport_name, Concat('"+UploadFileLink+"', CASE WHEN sport_icon  != '' THEN  Concat(sport_icon) end) as sport_icon FROM subscriber_sports where subscriber_id = "+result[i].subscriber_id;

		         var sportdata = "SELECT sb.sport_name as sport_id, s.sports_name ,s.sport_icon,CASE WHEN s.sport_icon IS NULL THEN '' ELSE Concat('"+UploadFileLink+"',s.sport_icon) END as sport_icon  FROM subscriber_sports as sb LEFT JOIN sports as s ON s.id = sb.sport_name where subscriber_id = "+result[i].id;

		       //resultData[i].id

		       //console.log("sportdata.....");
		       //console.log(sportdata);
		     let sportdatalist = await db.query(sportdata);
		     let resultlist = sportdatalist.rows;
		     result[i]['sport'] = resultlist;
		     }

		 }

		return result;

		//console.log('listStr-----------------------------');
		//console.log(result);

	} catch (err) {
		console.log("err:");
		console.log(err);

		result = {};
	}

}


const athletelist_by_id = async (req, res) => {
	let result = {}; 
	try {
		var where_str = " ";  
		if (req.query.id && typeof req.query.id !== "undefined" && typeof req.query.id !== "" && req.query.id > 0) {
			where_str = " where s.id = " + req.query.id;
		}

		
		var query = "SELECT s.language,s.id,s.age,st.state_name ,s.full_name,sp.height,c.city_name , g.gender,CASE WHEN (profile_image IS NULL or profile_image = '' or profile_image = 'null') THEN '' ELSE Concat('"+UploadFileLink+"',profile_image) END as profile_image,CASE WHEN (cover_image IS NULL or cover_image = '' or cover_image = 'null') THEN '' ELSE Concat('"+UploadFileLink+"',cover_image) END as profile_baneer FROM subscriber as s LEFT JOIN subscriber_profile as sp ON s.id = sp.subscriber_id LEFT JOIN gender as g ON g.id = s.gender LEFT JOIN city as c ON c.id = sp.city LEFT JOIN state as st ON st.id = sp.state " + where_str;
          console.log(query);
          console.log('hhhhhhhhhhhhhh');
		let dataResult = await db.query(query);
		result = dataResult.rows;

		var lngdata = result[0].language; 
		


		//var lngquery = "SELECT language_name FROM institute_language where id in ("+lngdata+")"; 
		
		//let lang = await db.query(lngquery);

		//result[0]['lang_data'] = lang.rows;

      //var query = "SELECT s.id,s.age,st.state_name ,s.full_name,r.height,c.city_name ,string_agg(le.language_name,',') as language, g.gender,CASE WHEN profile_image IS NULL THEN '' ELSE Concat('"+UploadFileLink+"',profile_image)END as profile_image,CASE WHEN cover_image IS NULL THEN '' ELSE Concat('"+UploadFileLink+"',cover_image)END as profile_baneer FROM subscriber as s LEFT JOIN subscriber_profile as r ON s.id = r.subscriber_id LEFT JOIN gender as g ON g.id = s.gender join institute_language le on le.id = any(string_to_array(s.language,',')::int[]) LEFT JOIN city as c ON c.id = r.city LEFT JOIN state as st ON st.id = r.state "+where_str+" group by s.id,s.age,st.state_name ,s.full_name,r.height,c.city_name,g.gender,profile_image,cover_image"; 

		//var query = "SELECT s.id,s.age,st.state_name ,s.full_name,spt.height,c.city_name ,string_agg(le.language_name,',') as language, g.gender,CASE WHEN profile_image IS NULL THEN '' ELSE Concat('"+UploadFileLink+"',profile_image) END as profile_image,CASE WHEN cover_image IS NULL THEN '' ELSE Concat('"+UploadFileLink+"',cover_image) END as profile_baneer FROM subscriber as s LEFT JOIN subscriber_profile as spt ON s.id = spt.subscriber_id LEFT JOIN gender as g ON g.id = s.gender join institute_language le on le.id = any(string_to_array(s.language,',')::int[]) LEFT JOIN city as c ON c.id = spt.city LEFT JOIN state as st ON st.id = spt.state '" + where_str+"' group by s.id,s.age,st.state_name ,s.full_name,spt.height, c.city_name,g.gender";

		
		//let dataResult = await db.query(query);
		//result = dataResult.rows;



		if (result && typeof result !== "undefined" && result.length > 0) {
			for (var i = 0; i < result.length; i++) {
				var sportdata = "SELECT DISTINCT ON (s.sports_name) s.sports_name,sb.sport_name as sport_id, CASE WHEN s.sport_logo IS NULL THEN '' ELSE Concat('"+UploadFileLink+"',s.sport_logo) END as sport_icon FROM subscriber_sports as sb LEFT JOIN sports as s ON s.id = sb.sport_name where subscriber_id = " + result[i].id;
				//resultData[i].id 
				let sportdatalist = await db.query(sportdata);
				let resultlist = sportdatalist.rows; 
				result[i]['sport'] = resultlist;
			}

		}


		return result;

	} catch (err) {
		console.log("err:");
		console.log(err);

		result = {};
	}

}

const athleteQualification = async (req, res) => { 
	let result = {};
	try {


		var query = "SELECT s.academic_to_year,c.city_name,t.state_name,s.institute_text as institute_name ,a.name as country,ic.class as academic_level_old, CONCAT(ic.class,',',s.specialization) as academic_level FROM subscriber_education as s LEFT JOIN institute_class as ic on ic.id = s.stream_id LEFT JOIN city as c ON s.city_id = c.id LEFT JOIN state as t ON s.state_id = t.id LEFT JOIN country as a ON s.country_id = a.id where subscriber_id=" + req.query.id; 

		console.log('listStr-----------------------------'); 
		console.log(query);

		let dataResult = await db.query(query);
		result = dataResult.rows;


		return result;

	} catch (err) {
		console.log("err:");
		console.log(err);

		result = {};
	}

}

const athleteQualificationLimit = async (req, res) => { 
	let result = {};
	try {


		var query = "SELECT s.academic_to_year,c.city_name,t.state_name,s.institute_text as institute_name ,a.name as country,ic.class as academic_level_old, CONCAT(ic.class,',',s.specialization) as academic_level FROM subscriber_education as s LEFT JOIN institute_class as ic on ic.id = s.stream_id LEFT JOIN city as c ON s.city_id = c.id LEFT JOIN state as t ON s.state_id = t.id LEFT JOIN country as a ON s.country_id = a.id where  subscriber_id="+req.query.id+" ORDER BY s.academic_from_year ASC LIMIT 3  "; 

		console.log('listStr-----------------------------');  
		console.log(query);

		let dataResult = await db.query(query);
		result = dataResult.rows;


		return result;

	} catch (err) {
		console.log("err:");
		console.log(err);

		result = {};
	}

}

const athletemy_teamslist = async (req, res) => {
	let result = {};
	try {
         
        

		var query = "SELECT my_team_profile_img FROM subscriber_my_teams  where subscriber_id=" + req.query.id;

		console.log(query);

		let dataResult = await db.query(query);
		result = dataResult.rows;

		return result;

	} catch (err) {
		console.log("err:");
		console.log(err);

		result = {};
	}

}

const athletemy_teamslisLimit = async (req, res) => {
	let result = {};
	try {

 		var wherStr = ""
        if(req.query.sport_id && typeof req.query.sport_id !== undefined && req.query.sport_id  !== ""){
           
           wherStr = "and smt.sport = "+req.query.sport_id;
        }

        var wherStrid = ""
        if(req.query.id && typeof req.query.id !== undefined && req.query.id  !== ""){
           
           
           wherStrid = "and smt.subscriber_id ="+req.query.id+" ";
        }
	var query = "SELECT ps.service_name as profession,smt.profession_text, smt.experience,smt.player_name,smt.player_subscriber_id as player_subscriber_id,CASE WHEN (my_team_profile_img IS NULL or my_team_profile_img = '' or my_team_profile_img = 'null') THEN '' ELSE Concat('"+UploadFileLink+"',my_team_profile_img) END as profile_image  FROM subscriber_my_teams AS smt  LEFT JOIN profile_services AS ps ON ps.id = smt.profession where smt.status = 1 "+wherStrid+" ORDER BY smt.id LIMIT 3 ";
        
        
        
        console.log('query;;;;;;;;;;;;;;;');  
		console.log(query);
		let dataResult = await db.query(query);
		result = dataResult.rows;

		return result;

	} catch (err) {
		console.log("err:");
		console.log(err);

		result = {};
	}

}

const athletemy_teams = async (req, res) => {   
	let result = {};
	try {

 		var wherStr = ""
        if(req.query.sport_id && typeof req.query.sport_id !== undefined && req.query.sport_id  !== ""){
           
           wherStr = "and smt.sport = "+req.query.sport_id;
        }

        var wherStrid = ""
        if(req.query.id && typeof req.query.id !== undefined && req.query.id  !== ""){
           
           
           wherStrid = "and smt.subscriber_id ="+req.query.id+" ";
        }
	var query = "SELECT ps.service_name as profession,smt.profession_text, smt.experience,smt.player_name,smt.player_subscriber_id as player_subscriber_id,CASE WHEN (my_team_profile_img IS NULL or my_team_profile_img = '' or my_team_profile_img = 'null') THEN '' ELSE Concat('"+UploadFileLink+"',my_team_profile_img) END as profile_image  FROM subscriber_my_teams AS smt  LEFT JOIN profile_services AS ps ON ps.id = smt.profession where smt.status = 1"+wherStrid+""+wherStr;
        
        
        
        console.log('query;;;;;;;;;;;;;;;');  
		console.log(query);
		let dataResult = await db.query(query);
		result = dataResult.rows;

		return result;

	} catch (err) {
		console.log("err:");
		console.log(err);

		result = {};
	}

}

const athletevideos = async (req, res) => {
	let result = {};
	try {

        var wherStr = ""
        if(req.query.sport_id && typeof req.query.sport_id !== undefined && req.query.sport_id  !== ""){ 
           
           wherStr = "and sport_id = "+req.query.sport_id;
        }

        var wherStrid = ""
        if(req.query.id && typeof req.query.id !== undefined && req.query.id  !== ""){
           
           
           wherStrid = "and subscriber_id ="+req.query.id+" ";
        }

		//var query = "SELECT hv.url,hv.cover_img,s.sports_name,hv.date,e.event_name FROM subscriber_highlighted_videos as hv LEFT JOIN sports as s on s.id =hv.sport_id LEFT JOIN event as e on e.sports_id = hv.sport_id  where hv.status = 1 "+wherStrid+""+wherStr;
		
		var query = "SELECT hv.url,CASE WHEN hv.cover_img IS NULL THEN '' ELSE Concat('"+UploadFileLink+"',hv.cover_img) END as cover_img_new,hv.title as event_name,s.sports_name,hv.date FROM subscriber_highlighted_videos as hv LEFT JOIN sports as s on s.id =hv.sport_id where hv.status = 1 "+wherStrid+""+wherStr;

		console.log('listStr-----------------------------');
		console.log(query);

		let dataResult = await db.query(query);
		result = dataResult.rows;


		return result;

	} catch (err) {
		console.log("err:");
		console.log(err);

		result = {};
	}

}

const athletevideosLimit = async (req, res) => {
	let result = {};
	try {

        var wherStr = ""
        if(req.query.sport_id && typeof req.query.sport_id !== undefined && req.query.sport_id  !== ""){ 
           
           wherStr = "and sport_id = "+req.query.sport_id;
        }

        var wherStrid = ""
        if(req.query.id && typeof req.query.id !== undefined && req.query.id  !== ""){
           
           
           wherStrid = "and subscriber_id ="+req.query.id+" ";
        }

		//var query = "SELECT hv.url,hv.cover_img,s.sports_name,hv.date,e.event_name FROM subscriber_highlighted_videos as hv LEFT JOIN sports as s on s.id =hv.sport_id LEFT JOIN event as e on e.sports_id = hv.sport_id  where hv.status = 1 "+wherStrid+""+wherStr;
		
		var query = "SELECT CASE WHEN hv.cover_img IS NULL THEN '' ELSE Concat('"+UploadFileLink+"',hv.cover_img) END as cover_img_new,hv.title as event_name,s.sports_name,hv.date FROM subscriber_highlighted_videos as hv LEFT JOIN sports as s on s.id =hv.sport_id where hv.status = 1 "+wherStrid+" ORDER by hv.id ";

		console.log('listStr-----------------------------');
		console.log(query);

		let dataResult = await db.query(query);
		result = dataResult.rows;


		return result;

	} catch (err) {
		console.log("err:");
		console.log(err);

		result = {};
	}

}

const athleteImg = async (req, res) => {
	let result = {};
	try {


		var wherStr = ""
        if(req.query.sport_id && typeof req.query.sport_id !== undefined && req.query.sport_id  !== ""){
           
           
           wherStr = "and sport_id ="+req.query.sport_id+" ";
        }
        var wherStrid = ""
        if(req.query.id && typeof req.query.id !== undefined && req.query.id  !== ""){
           
           
           wherStrid = "and subscriber_id ="+req.query.id+" ";
        }

		var query = "SELECT hg.logo, hg.date,hg.title,s.sports_name,CASE WHEN logo IS NULL THEN '' ELSE Concat('"+UploadFileLink+"',logo) END as logo FROM subscriber_highlighted_gallery as hg LEFT JOIN sports as s on s.id = hg.sport_id where hg.status = 1 "+wherStrid+""+ wherStr;    

			console.log("query-------------");
		console.log(query);

		let dataResult = await db.query(query); 
		result = dataResult.rows; 

		return result;

	} catch (err) {
		console.log("err:");
		console.log(err);

		result = {};
	}

}


const clublist = async (req, res) => {
    try {
        
        let result = {};

        var wherStr = ""
        if(req.query.sport_id && typeof req.query.sport_id !== undefined && req.query.sport_id  !== ""){
           
          
           wherStr = "and sport_id ="+req.query.sport_id+" ";
        }

        var wherStrid = ""
        if(req.query.id && typeof req.query.id !== undefined && req.query.id  !== ""){
           
           
           wherStrid = "and subscriber_id ="+req.query.id+" ";
        }

        let query = await db.query("SELECT c.* ,CASE WHEN (logo IS NULL or logo ='' or logo ='null') THEN '' ELSE Concat('"+UploadFileLink+"',logo) END  as logo FROM subscriber_play_teams as c where  c.status =1 "+wherStrid +" "+wherStr);
console.log("gddddd");
      console.log(query);

		if (query.rowCount) {
            result.data = query.rows;
        } 

        return result
    }
     catch (err) {
        return {
            serverError: true,
            error: err.message
        }
    }
}

const clublistLimit = async (req, res) => {
    try {
        
        let result = {};

        var wherStr = ""
        if(req.query.sport_id && typeof req.query.sport_id !== undefined && req.query.sport_id  !== ""){
           
          
           wherStr = "and sport_id ="+req.query.sport_id+" ";
        }

        var wherStrid = ""
        if(req.query.id && typeof req.query.id !== undefined && req.query.id  !== ""){
           
           
           wherStrid = "and subscriber_id ="+req.query.id+" ";
        }

        let query = await db.query("SELECT c.* ,CASE WHEN (logo IS NULL or logo ='' or logo ='null') THEN '' ELSE Concat('"+UploadFileLink+"',logo) END  as logo FROM subscriber_play_teams as c where  c.status =1 "+wherStrid +" ORDER by c.id LIMIT 3 ");
console.log("gddddd");
      console.log(query);

		if (query.rowCount) {
            result.data = query.rows;
        } 

        return result
    }
     catch (err) {
        return {
            serverError: true,
            error: err.message
        }
    }
}


const athleteSponsor = async (req, res) => {
	let result = {};
	try {


		
		var query = "SELECT url , CASE WHEN logo IS NULL THEN '' ELSE Concat('"+UploadFileLink+"',logo) END as logo FROM subscriber_my_sponsor where subscriber_id=" + req.query.id;

		let dataResult = await db.query(query); 
		result = dataResult.rows;

		return result;

	} catch (err) {
		console.log("err:");
		console.log(err);

		result = {};
	}

}

const athleteSponsorLimit = async (req, res) => {
	let result = {};
	try {


		
		var query = "SELECT url , CASE WHEN logo IS NULL THEN '' ELSE Concat('"+UploadFileLink+"',logo) END as logo FROM subscriber_my_sponsor where subscriber_id=" + req.query.id+" ORDER BY id LIMIT 3 ";

		let dataResult = await db.query(query); 
		result = dataResult.rows;

		return result;

	} catch (err) {
		console.log("err:");
		console.log(err);

		result = {};
	}

}

const athleteAwards = async (req, res) => {
	let result = {};
	try { 

      	var wherStr = ""
      	console.log('req.query.sport_id');
      	console.log(req.query.sport_id);
        if(req.query.sport_id && typeof req.query.sport_id !== undefined && req.query.sport_id  !== ""){
           
           wherStr = "and sport_id ="+req.query.sport_id+" ";
        }

        var wherStrid = ""
        if(req.query.id && typeof req.query.id !== undefined && req.query.id  !== ""){ 
           
           
           wherStrid = "and sp.subscriber_id ="+req.query.id+" ";
        }

		var query = "SELECT t.tournament_name,sp.event_other_awards,sp.tournament_other_awards,sp.sport_id,sp.award_type_id,sp.description,e.event_name,spw.award_name,sp.award_date, CASE WHEN spw.award_logo IS NULL THEN '' ELSE Concat('"+UploadFileLink+"',spw.award_logo) END as award_logo FROM subscriber_play_awards as sp left join event as e  on sp.events:: integer = e.id left join tournament as t  on sp.tournament:: integer = t.id LEFT join subscriber_play_awards_master as spw on sp.award_type_id = spw.id:: varchar  where sp.status = 1 "+wherStrid+" "+wherStr;

		console.log('req.query.sport_id=========================');  
      	console.log(query);
		let dataResult = await db.query(query);  
		result = dataResult.rows; 

		return result;

	} catch (err) {
		console.log("err:");
		console.log(err);

		result = {};
	}

}

const athleteAwardsLimit = async (req, res) => {
	let result = {};
	try { 

      	var wherStr = ""
      	console.log('req.query.sport_id');
      	console.log(req.query.sport_id);
        if(req.query.sport_id && typeof req.query.sport_id !== undefined && req.query.sport_id  !== ""){
           
           wherStr = "and sport_id ="+req.query.sport_id+" ";
        }

        var wherStrid = ""
        if(req.query.id && typeof req.query.id !== undefined && req.query.id  !== ""){ 
           
           
           wherStrid = "and sp.subscriber_id ="+req.query.id+" ";
        }

		var query = "SELECT t.tournament_name,sp.event_other_awards,sp.tournament_other_awards,sp.sport_id,sp.award_type_id,sp.description,e.event_name,spw.award_name,sp.award_date, CASE WHEN spw.award_logo IS NULL THEN '' ELSE Concat('"+UploadFileLink+"',spw.award_logo) END as award_logo FROM subscriber_play_awards as sp left join event as e  on sp.events:: integer = e.id left join tournament as t  on sp.tournament:: integer = t.id LEFT join subscriber_play_awards_master as spw on sp.award_type_id = spw.id:: varchar  where sp.status = 1 "+wherStrid+" ORDER by sp.id LIMIT 3 ";

		console.log('req.query.sport_id=========================');  
      	console.log(query);
		let dataResult = await db.query(query);  
		result = dataResult.rows; 

		return result;

	} catch (err) {
		console.log("err:");
		console.log(err);

		result = {};
	}

}

const citylist = async(req,res) =>{

	try{ 
         
         var query = "SELECT city_name ,id FROM city ";

		let dataResult = await db.query(query); 
		result = dataResult.rows;

		return result;
	}
	catch(err){
         result = {};
	}
}




module.exports = {
	athletlist,
	athletelist_by_id,
	athleteQualification,
	athletemy_teams,
	athletevideos,
	athleteImg,
	athleteSponsor,
	athleteAwards,
	citylist,
	clublist,
	athleteQualificationLimit,
	athletemy_teamslisLimit,
	athletevideosLimit,
	clublistLimit,
	athleteSponsorLimit,
	athleteAwardsLimit
}