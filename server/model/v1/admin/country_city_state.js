const db = require('../../../db');
const helper = require('../../../helper/helper');

const add = async (req, res) => {

	try{

        console.log('jjjjjjjjjjjjjjjjjjjjjjjjj...........>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');

        console.log(req.body.id);
          
        if(req.body.name && req.body.name !== 'undefind' && req.body.name !== " "){
        	var name = req.body.name ; 
        }

        if(req.body.iso2 && req.body.iso2 !=='undefind' && req.body.iso2 !==" ")  {
        	var iso2 = req.body.iso2;
        }
        console.log("fffffffffffffff");
        console.log(req.body.name);
        for (var i = 0; i < name.length; i++) { 


        	 var countrydata = "INSERT into country_new (name,alias,created_at) value('"+name[i]+"','"+iso2[i]+"',now()) RETURNING id";

        	 var finalcounrty = await db.query(countrydata);

             console.log(finalcounrty);
             console.log('finalcounrty...pppppppppppppp');

        	 if(finalcounrty.rowCount){

        	 	let insertedID = inserttmaster.rows[0].id;

        	 	var stateinfo = req.body.states;

        	 	for (var j = 0; j < stateinfo.length; j++) {

        	 		var statedata = "INSERT into state_new (country_id,state_name,created_at) value("+insertedID+",'"+stateinfo.name[j]+"',now()) RETURNING id";

        	 		var sate = await db.query(statedata);

        	 		if(sate.rowCount){

        	 			stateid = sate.rows[0].id;

        	 			var citydata = req.body.cities;

       	 			for (var  k= 0; k < citydata.length; k++) {
        	 				
        	 				var cityadd = "INSERT into city_new (state_id,city_name,created_at) value("+stateid+",'"+citydata.name[k]+"',now()) RETURNING id";


        	 				var cityinfo = await db.query(cityadd);


        	 			}
        	 		}

        	}

        	 	

        }
    }
        return true;

       


	}

	catch (err){
      
      console.log(err);
      return false ;
	}


}


module.exports = { add }