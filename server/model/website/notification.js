const db = require('../../db');
const helper = require('../../helper/helper');
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
              let listdata = "select rv.*,s.full_name as visitor_name,sb.full_name as profile_name from request_visitor as rv left join subscriber as s on rv.visitor_id = s.id left join subscriber as sb on rv.profile_id = s.id  where profile_id = "+req.body.id+"";


			

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












module.exports = {
    requestnotification,list
   
}
