const db = require('../../../db');
const helper = require('../../../helper/helper');
//const subscriberModel = require('./admin/subscriber');


const requestnotification = async (req,res) => {
    try {
 			const result= {};
    	if(req.body.request_status){

    		

    		let updatdata  = "update request_visitor set request_status = "+req.body.request_status+" where  profile_id  = "+req.body.profile_id+" and visitor_id = "+req.body.visitor_id+"";
			console.log("fhgftuifjuhnui11111111111111111");
    		console.log(updatdata);

             
            if(req.body.request_status == 1){

    		 let requestdata = `INSERT INTO request_visitor(visitor_id,profile_id,request_status,add_at) VALUES(${req.body.profile_id},${req.body.visitor_id},3,now())`; 
				console.log("33333333333333333333333333333333");
    		 	console.log(requestdata);

    		await db.query(requestdata); 
    		}
    	    else{
				let requestdata = `INSERT INTO request_visitor(visitor_id,profile_id,request_status,add_at) VALUES(${req.body.profile_id},${req.body.visitor_id},4,now())`;  
				console.log("4444444444444444444444444444444444444");
    		 	console.log(requestdata);
				await db.query(requestdata);
    		}

			

        	

			
			await db.query(updatdata);
			

    		

           return {
            msg:'data added successfully ...',
            sataus_msg:true,
            access:1,
            status: process.env.STATUS_200
        };
    }



    else{

console.log("fhgftuifjuhnuiqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq"); 

    	console.log(req.body.request);

        let requestdata = `INSERT INTO request_visitor(visitor_id,profile_id,request,add_at) VALUES(${req.body.visitor_id},${req.body.profile_id},${req.body.request},now())`;  



		console.log("fhgftuifjuhnui");

        console.log(requestdata);
        
        await db.query(requestdata);
         return {
            msg:'data added successfully ...',
            sataus_msg:true,
            status: process.env.STATUS_200
        };
    }
    }
    catch (err) {
    	
        console.log(err)
        return false;
    }
    return result;
}

const  list = async(req,res)=>{
	try{
		let result = {};
              let listdata = "select rv.*,s.full_name as visitor_name,sb.full_name as profile_name from request_visitor as rv left join subscriber as s on rv.visitor_id = s.id left join subscriber as sb on rv.profile_id = s.id  where profile_id = "+req.body.id+" ORDER BY rv.id DESC";


			

            let resultdata =   await db.query(listdata);

            result = resultdata.rows;

            console.log("listdata----------------");

              console.log(result);

            return result;


	}
	catch(err){
		
		console.log(err);
		return false;


	}
}

const  allnotification = async(req,res)=>{
    try{
        let result = [];
              let listdata = "select rv.*,s.full_name as visitor_name,sb.full_name as profile_name from request_visitor as rv left join subscriber as s on rv.visitor_id = s.id left join subscriber as sb on rv.profile_id = s.id  where profile_id = "+req.body.id+" ORDER BY rv.id DESC";


            console.log(listdata)

            let resultdata =   await db.query(listdata);

            var visitor = resultdata.rows;

            for (var i = 0; i < visitor.length; i++) {
                visitor[i].type = "visitor";

                result.push(visitor[i]);
                
            }


            let controllerdata = "select msc.*,ms.event_id ,e.event_name from match_schedule_controllers as msc left join match_schedule as ms on ms.id = msc.match_schedule_id left join event as e on e.id = ms.event_id where msc.status = 1 and subscriber_display_id ="+req.body.id+"";
            let controllerdatainfo =   await db.query(controllerdata);

            var controllers = controllerdatainfo.rows;

            for (var j = 0; j < controllers.length; j++) {
                controllers[j].type = "controllers";

                result.push(controllers[j]);
                
            }

            console.log("listdata----------------");

              console.log(result);

            return result;


    }
    catch(err){
        
        console.log(err);
        return false;


    }
}


const accesscodedata = async(req,res)=>{

    try{

    let querystr = "select msc.*,ms.event_id,ms.sport,s.sports_name from match_schedule_controllers as msc left join match_schedule as ms on ms.id = msc.match_schedule_id left join sports as s on s.id = ms.sport where subscriber_display_id = "+req.body.id+" and accesscode = "+req.body.accesscode+""; 


    console.log("querystr.......");

    console.log(querystr);

    var querystrdata = await db.query(querystr);

   


    let rowcount = querystrdata.rows;

    console.log(rowcount);

     console.log("querystr.......");

    //console.log(rowcount);

    // if(rowcount > 0){


        return rowcount
//     }
//     else{
//     return false;
// }

}
catch(err){
    console.log(err)
    return false;
}
}








const  seennotification = async(req,res)=>{
    try{
        
              let listdata = "update request_visitor set seen_status = "+req.body.seen_status+" where profile_id = "+req.body.id+"";

              console.log(listdata)

               await db.query(listdata);

               let controller = "update match_schedule_controllers set seen_status = "+req.body.seen_status+" where subscriber_display_id = "+req.body.id+"";
               console.log(controller)

               await db.query(controller);

           

            console.log("listdata----------------");

              

            return true;


    }
    catch(err){
        
        console.log(err);
        return false;


    }
}





module.exports = {
    requestnotification,list,allnotification,accesscodedata,seennotification 
   
}
