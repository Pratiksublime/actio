const db = require('../../../db');
const helper = require('../../../helper/helper');


const insert = async (req, res) => {
	const result = {};
	try {


		if (typeof(req.body.champ_add) == "undefined" || req.body.champ_add == '' || req.body.champ_add == null) {
			req.body.champ_add = false;
		}
		if (typeof(req.body.champ_edit) == "undefined" || req.body.champ_edit == '' || req.body.champ_edit == null) {
			req.body.champ_edit = false;
		}
		if (typeof(req.body.champ_delete) == "undefined" || req.body.champ_delete == '' || req.body.champ_delete == null) {
			req.body.champ_delete = false;
		}
		if (typeof(req.body.performance_add) == "undefined" || req.body.performance_add == '' || req.body.performance_add == null) {
			req.body.performance_add = false;
		}
		if (typeof(req.body.performance_delete) == "undefined" || req.body.performance_delete == '' || req.body.performance_delete == null) {
			req.body.performance_delete = false;
		}

		if (typeof(req.body.sports_add) == "undefined" || req.body.sports_add == '' || req.body.sports_add == null) {
			req.body.sports_add = false;
		}
		if (typeof(req.body.sports_edit) == "undefined" || req.body.sports_edit == '' || req.body.sports_edit == null) {
			req.body.sports_edit = false;
		}
		if (typeof(req.body.sports_delete) == "undefined" || req.body.sports_delete == '' || req.body.sports_delete == null) {
			req.body.sports_delete = false;
		}
		if (typeof(req.body.subsports_add) == "undefined" || req.body.subsports_add == '' || req.body.subsports_add == null) {
			req.body.subsports_add = false;
		}
		if (typeof(req.body.subsports_edit) == "undefined" || req.body.subsports_edit == '' || req.body.subsports_edit == null) {
			req.body.subsports_edit = false;
		}
		if (typeof(req.body.subsports_delete) == "undefined" || req.body.subsports_delete == '' || req.body.subsports_delete == null) {
			req.body.subsports_delete = false;
		}
		if (typeof(req.body.tournament_add) == "undefined" || req.body.tournament_add == '' || req.body.tournament_add == null) {
			req.body.tournament_add = false;
		}if (typeof(req.body.tournament_edit) == "undefined" || req.body.tournament_edit == '' || req.body.tournament_edit == null) {
			req.body.tournament_edit = false;
		}
		if (typeof(req.body.tournament_delete) == "undefined" || req.body.tournament_delete == '' || req.body.tournament_delete == null) {
			req.body.tournament_delete = false;
		}
		if (typeof(req.body.tourstype_add) == "undefined" || req.body.tourstype_add == '' || req.body.tourstype_add == null) {
			req.body.tourstype_add = false;
		}
		if (typeof(req.body.tourstype_edit) == "undefined" || req.body.tourstype_edit == '' || req.body.tourstype_edit == null) {
			req.body.tourstype_edit = false;
		}if (typeof(req.body.tourstype_delete) == "undefined" || req.body.tourstype_delete == '' || req.body.tourstype_delete == null) {
			req.body.tourstype_delete = false;
		}
		if (typeof(req.body.tours_add) == "undefined" || req.body.tours_add == '' || req.body.tours_add == null) {
			req.body.tours_add = false;
		}if (typeof(req.body.tours_edit) == "undefined" || req.body.tours_edit == '' || req.body.tours_edit == '') {
			req.body.tours_edit = false;
		}
		if (typeof(req.body.tours_delete) == "undefined" || req.body.tours_delete == '' || req.body.tours_delete == null) {
			req.body.tours_delete = false;
		}if (typeof(req.body.inclusions_add) == "undefined" || req.body.inclusions_add == '' || req.body.inclusions_add == null) {
			req.body.inclusions_add = false;
		}
		if (typeof(req.body.inclusions_edit) == "undefined" || req.body.inclusions_edit == '' || req.body.inclusions_edit == null) {
			req.body.inclusions_edit = false;
		}
		if (typeof(req.body.inclusions_delete) == "undefined" || req.body.inclusions_delete == '' || req.body.inclusions_delete == null) {
			req.body.inclusions_delete = false;
		}
		if (typeof(req.body.exclusions_add) == "undefined" || req.body.exclusions_add == '' || req.body.exclusions_add == null) {
			req.body.exclusions_add = false;
		}
		if (typeof(req.body.exclusions_edit) == "undefined" || req.body.exclusions_edit == '' || req.body.exclusions_edit == null) {
			req.body.exclusions_edit = false;
		}
		if (typeof(req.body.exclusions_delete) == "undefined" || req.body.exclusions_delete == '' || req.body.exclusions_delete == null) {
			req.body.exclusions_delete = false;
		}
		if (typeof(req.body.venue_add) == "undefined" || req.body.venue_add == '' || req.body.venue_add == null) {
			req.body.venue_add = false;

		}
		if (typeof(req.body.venue_edit) == "undefined" || req.body.venue_edit == '' || req.body.venue_edit == null) {
			req.body.venue_edit = false;
		}
		if (typeof(req.body.venue_delete) == "undefined" || req.body.venue_delete == '' || req.body.venue_delete == null) {
			req.body.venue_delete = false;
		}
		if (typeof(req.body.banner_add) == "undefined" || req.body.banner_add == '' || req.body.banner_add == null) {
			req.body.banner_add = false;
		}
		if (typeof(req.body.banner_edit) == "undefined" || req.body.banner_edit == '' || req.body.banner_edit == null) {
			req.body.banner_edit = false;
		}
		if (typeof(req.body.banner_delete) == "undefined" || req.body.banner_delete == '' || req.body.banner_delete == null) {
			req.body.banner_delete = false;
		}
		if (typeof(req.body.testimonial_add) == "undefined" || req.body.testimonial_add == '' || req.body.testimonial_add == null) {
			req.body.testimonial_add = false;
		}
		if (typeof(req.body.testimonial_edit) == "undefined" || req.body.testimonial_edit == '' || req.body.testimonial_edit == null) {
			req.body.testimonial_edit = false;
		}
		if (typeof(req.body.testimonial_delete) == "undefined" || req.body.testimonial_delete == '' || req.body.testimonial_delete == null) {
			req.body.testimonial_delete = false;
		}
		if (typeof(req.body.event_add) == "undefined" || req.body.event_add == '' || req.body.event_add == null) {
			req.body.event_add = false;
		}
		if (typeof(req.body.event_edit) == "undefined" || req.body.event_edit == '' || req.body.event_edit == null) {
			req.body.event_edit = false;
		}if (typeof(req.body.event_delete) == "undefined" || req.body.event_delete == '' || req.body.event_delete == null) {
			req.body.event_delete = false;
		}
		if (typeof(req.body.match_add) == "undefined" || req.body.match_add == '' || req.body.match_add == null) {
			req.body.match_add = false;
		}
		if (typeof(req.body.match_edit) == "undefined" || req.body.match_edit == '' || req.body.match_edit == null) {
			req.body.match_edit = false;
		}
		if (typeof(req.body.match_delete) == "undefined" || req.body.match_delete == '' || req.body.match_delete == null) {  
			req.body.match_delete = false;
		}



		const moment = require('moment');

		console.log('req.body.role_id')
			console.log(req.body.role_id)
		if(req.body.role_id){

			const addsStr = `update master_permission set champ_add = '${req.body.champ_add}',champ_edit = '${req.body.champ_edit}',champ_delete ='${req.body.champ_delete}' ,performance_add = '${req.body.performance_add}',performance_edit = '${req.body.performance_edit}',performance_delete = '${req.body.performance_delete}',sports_add = '${req.body.sports_add}',sports_edit = '${req.body.sports_edit}',sports_delete = '${req.body.sports_delete}',subsports_add = '${req.body.subsports_add}',subsports_edit = '${req.body.subsports_edit}',subsports_delete = '${req.body.subsports_delete}',tournament_add = '${req.body.tournament_add}',tournament_edit = '${req.body.tournament_edit}',tournament_delete ='${req.body.tournament_delete}',tourstype_add = '${req.body.tourstype_add}',tourstype_edit ='${req.body.tourstype_edit}',tourstype_delete ='${req.body.tourstype_delete}',tours_add = '${req.body.tours_add}',tours_edit ='${req.body.tours_edit}',tours_delete = '${req.body.tours_delete}',inclusions_add ='${req.body.inclusions_add}',inclusions_edit = '${req.body.inclusions_edit}',inclusions_delete = '${req.body.inclusions_delete}',exclusions_add = '${req.body.exclusions_add}',exclusions_edit = '${req.body.exclusions_edit}',exclusions_delete = '${req.body.exclusions_delete}',venue_add = '${req.body.venue_add}',venue_edit = '${req.body.venue_edit}',venue_delete= '${req.body.venue_delete}',banner_add = '${req.body.banner_add}',banner_edit = '${req.body.banner_edit}',banner_delete = '${req.body.banner_delete}',testimonial_add = '${req.body.testimonial_add}',testimonial_edit = '${req.body.testimonial_edit}',testimonial_delete = '${req.body.testimonial_delete}',event_add = '${req.body.event_add}',event_edit = '${req.body.event_edit}',event_delete = '${req.body.event_delete}',match_add = '${req.body.match_add}',match_edit = '${req.body.match_edit}',match_delete ='${req.body.match_delete}',sub_menu_id = '${req.body.sub_menu_id}',update_at =now() where role ='${req.body.role_id}' and sub_id='${req.body.sub_id}'`; 

			console.log('111111111111111111111111111111');  
		console.log(addsStr);    
		const adddata = await db.query(addsStr);
		}else{

		const addsStr = `INSERT INTO master_permission (champ_add,champ_edit,champ_delete,performance_add,performance_edit,performance_delete,sports_add,sports_edit,sports_delete,subsports_add,subsports_edit,subsports_delete,tournament_add,tournament_edit,tournament_delete,tourstype_add,tourstype_edit,tourstype_delete,tours_add,tours_edit,tours_delete,inclusions_add,inclusions_edit,inclusions_delete,exclusions_add,exclusions_edit,exclusions_delete,venue_add,venue_edit,venue_delete,banner_add,banner_edit,banner_delete,testimonial_add,testimonial_edit,testimonial_delete,event_add,event_edit,event_delete,match_add,match_edit,match_delete,sub_id,sub_menu_id,role,status,created_at) VALUES('${req.body.champ_add}','${req.body.champ_edit}','${req.body.champ_delete}','${req.body.performance_add}','${req.body.performance_edit}','${req.body.performance_delete}','${req.body.sports_add}','${req.body.sports_edit}','${req.body.sports_delete}','${req.body.subsports_add}','${req.body.subsports_edit}','${req.body.subsports_delete}','${req.body.tournament_add}','${req.body.tournament_edit}','${req.body.tournament_delete}','${req.body.tourstype_add}','${req.body.tourstype_edit}','${req.body.tourstype_delete}','${req.body.tours_add}','${req.body.tours_edit}','${req.body.tours_delete}','${req.body.inclusions_add}','${req.body.inclusions_edit}','${req.body.inclusions_delete}','${req.body.exclusions_add}','${req.body.exclusions_edit}','${req.body.exclusions_delete}','${req.body.venue_add}','${req.body.venue_edit}','${req.body.venue_delete}','${req.body.banner_add}','${req.body.banner_edit}','${req.body.banner_delete}','${req.body.testimonial_add}','${req.body.testimonial_edit}','${req.body.testimonial_delete}','${req.body.event_add}','${req.body.event_edit}','${req.body.event_delete}','${req.body.match_add}','${req.body.match_edit}','${req.body.match_delete}','${req.body.sub_id}','${req.body.sub_menu_id}','${req.body.role}',1,now())RETURNING id`;  


		
		console.log('addsStrooooooooooooooooooooooooooooo');  
		console.log(addsStr);   

		const adddata = await db.query(addsStr);
	}

		

		


	}
		catch (err) {
		console.log('err////');
		console.log(err);
		result.id = false;
	}
	//return result;
	return result.message = true;
}

const list = async(req,res) =>{
	var result ={};
    try{
       
            var tourtypeadd = "SELECT * FROM master_permission WHERE status = 1 and sub_id:: int  = "+req.query.id+" and role:: int ="+req.query.role; 
           console.log(tourtypeadd);
            let data = await db.query(tourtypeadd);
            result = data.rows;  
 console.log(result);
            for (var i = 0; i < result.length; i++) {

            	console.log(result[i].sub_menu_id);
            	console.log(result.sub_menu_id)

            	let submenu = "SELECT sub_menu_name from sub_menu WHERE id in ("+result[i].sub_menu_id+")";  

            	console.log(submenu)

              	let submenuifo = await db.query(submenu);
					submenuifo = submenuifo.rows;

					result[i]['sub_menu'] = submenuifo;

              }  
       
        
    }
    catch(err){
        console.log(err);
        return false;
    }
    return result ;
}


const submenu = async(req,res)=>{
	try{  
		let result ={};

		var submenu = req.body.sub_menu_id;
		

		var array = submenu.split(',');
		 	array = array.map(Number);
		
		

				let deletedata = "delete from menu_permission WHERE role = "+req.body.role+" and subscriber_id = "+req.body.subscriber_id+"";
				console.log(deletedata); 
				await db.query(deletedata)
	

		for (var i = 0; i < array.length; i++) {

		var insertmenu = `INSERT INTO menu_permission (sub_menu_id,subscriber_id,role,status,validity_date,created_at,created_by)VALUES(${array[i]},${req.body.subscriber_id},${req.body.role},1,now(),now(),1)`;
			
			

		console.log(insertmenu); 
          await db.query(insertmenu)

          
		}

          
          

	}
	catch(err){
		console.log(err);

	}
}

const role = async(req,res)=>{
	try{  
		let result ={};

		
		let insertmenu = `INSERT INTO user_role (role,created_at,created_by)VALUES('${req.body.role}',now(),1)`;

		console.log(insertmenu); 
         await db.query(insertmenu)
		
          
          

	}
	catch(err){
		console.log(err);

	}
}

const submenulist = async(req,res) =>{
	var result ={};
    try{
       
            var tourtypeadd = "SELECT * FROM sub_menu WHERE status = 1 order by sub_menu_name ASC ";  
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

const rolelistbyid = async(req,res) =>{
	var result =[];
    try{
       
            var menusubs = "SELECT DISTINCT mp.role,ur.role as role_name FROM menu_permission as mp left join user_role as ur on mp.role = ur.id WHERE subscriber_id ="+req.body.id+"";  
            console.log(menusubs);
            let data = await db.query(menusubs);
            resultst = data.rows;

            for (var i = 0; i < resultst.length; i++) {

            	result.push(resultst[i]); 
            	
            }

            var subs = "SELECT  s.role,ur.role as role_name FROM subscriber as s left join user_role as ur on s.role = ur.id WHERE s.id ="+req.body.id+"";   
            
            let datastr = await db.query(subs);
            subsresult = datastr.rows;   

            

            for (var j = 0; j < subsresult.length; j++) {
            	result.push(subsresult[j]);
            }
       
        
    }
    catch(err){
        console.log(err);
        return false;
    }
    return result ;
}









module.exports = {
	insert,list,submenu,submenulist,role,rolelistbyid
}