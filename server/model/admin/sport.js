const db = require('../../db');
const helper = require('../../helper/helper');

const list = async (req, res) => {
    let result = [];
    try {
        let listStr = "SELECT * FROM " + process.env.SCHEMA + ".sports where status = 1 ORDER BY id DESC";
        let dataResult = await db.query(listStr);
        
        console.log('listStr.rowCount');
        console.log(dataResult.rowCount);

       
        result = dataResult.rows;
        

        // if(dataResult.rowCount > 0){
        //     var sport_data = true;
        //     result.sport_data = sport_data;
        // }
        // else{
        //     var sport_data = false;
        //     result.sport_data = sport_data
        // }
    } catch (err) {
        console.log("err");
        console.log(err);
        result = {};
    }
    return result;
}

const info = async (req, res) => {
    let result = {};
    try {
        console.log("req.query.id: ");
        console.log(req.query.id);

        //let listStr = "SELECT * FROM " + process.env.SCHEMA + ".sports where status = 1 and id = "+req.query.id+" ORDER BY sports_name";
        let listStr = "SELECT * FROM " + process.env.SCHEMA + ".sports where status = 1 and id = "+req.body.id+" ORDER BY sports_name"; 
        let dataResult = await db.query(listStr);
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

        if (req.body.sports_name) {
            let sport = req.body.sports_name;
            let result = sport.toLowerCase();
            
            
            let query = (`SELECT LOWER(sports_name) FROM sports WHERE status = 1 and sports_name ILIKE '%${result}%'`);
            
            var querydata =  await db.query(query);
            
            
            if (querydata.rowCount) {
                return {
                    validationError: true,
                    error: 'sports already exists !'
                }
            }
        }

       //Sport logo
        var bannerPath = 'images/sport/';

        var sport_logo = req.body.sport_logo;

        var sport_logo_new = "";

        if (sport_logo && typeof sport_logo !=="undefined" && sport_logo.length> 0) {
            var sport_logo = helper.uploadBase64(sport_logo[0], bannerPath);
            sport_logo_new = sport_logo.path;
        }

        if (typeof sport_logo === "undefined" || sport_logo === " ") {
                  
                    var sport_logo_image = 'images/default/sport_logo.svg';
                       
                    sport_logo_new = sport_logo_image;
                }

        //Sport icon

        var sport_icon = req.body.sport_icon;

        var sport_icon_new = "";

        if (sport_icon && typeof sport_icon !=="undefined" && sport_icon.length >0) {
            var sport_icon = helper.uploadBase64(sport_icon[0], bannerPath);
            sport_icon_new = sport_icon.path;
        }

        if (typeof sport_icon === "undefined" || sport_icon === " ") {
                  
                    var sport_icon_image = 'images/default/sport_icon.svg';
                       
                    sport_icon_new = sport_icon_image;
                }


        let statusStr = "INSERT into " + process.env.SCHEMA + ".sports (sports_name,sport_logo,sport_icon, created_at, status) values ('"+req.body.sports_name+"','"+sport_logo_new+"','"+sport_icon_new+"',now(), 1) ";
        await db.query(statusStr);
        console.log('statusStr');
        console.log(statusStr);
        return true;
    } catch (err) {
        console.log("err.......");
        console.log(err);
        return false;
    }
}

const update = async (req, res) => {
    try {




        var bannerPath = 'images/banner_website/';

        var sport_icon = req.body.sport_icon;

        var sport_icon_new = "";

        if (sport_icon && typeof sport_icon !=="undefined" && sport_icon.length) {
            var sport_icon = helper.uploadBase64(sport_icon[0], bannerPath);
            sport_icon_new = sport_icon.path;
        }

        var iconStr = "";

        if(sport_icon_new && typeof sport_icon_new !=="undefined" && sport_icon_new!==""){
            iconStr = ", sport_icon='"+sport_icon_new+"' "
        }



        var sport_logo = req.body.sport_logo;

        var sport_logo_new = "";

        if (sport_logo && typeof sport_logo !=="undefined" && sport_logo.length) {
            var sport_logo = helper.uploadBase64(sport_logo[0], bannerPath);
            sport_logo_new = sport_logo.path;
        }

        var logoStr = "";

        if(sport_logo_new && typeof sport_logo_new !=="undefined" && sport_logo_new!==""){
            logoStr = ", sport_logo='"+sport_logo_new+"' "
        }


        if(iconStr || logoStr){
             let statusStr = "UPDATE sports SET updated_at=now() "+iconStr+" "+logoStr+" WHERE id ='"+req.body.id+"'";

            console.log("update statusStr:");
            console.log(statusStr);

            var statusStrdata = await db.query(statusStr);
            if(statusStrdata){
                let msg = "update"; 
                return msg;

            }
        }

        if (req.body.sports_name) {
            let sport = req.body.sports_name; 
            let result = sport.toLowerCase();
            


            //let query = (`SELECT LOWER(sports_name) FROM sports WHERE status=1 and sports_name ILIKE '%${result}%'`); 
            let query = (`SELECT LOWER(sports_name) FROM sports WHERE status=1 and sports_name ILIKE '%${result}%'`); 
            console.log("uuuuuuuuuuuuuuuuuuuu");
            console.log(query)
            
            var querydata =  await db.query(query);

            
            
            
            if (querydata.rowCount) {
                return {
                    validationError: true,
                    error: 'sports already exists !'
                }
            }
        }


        let statusStr = "UPDATE sports SET sports_name='" + req.body.sports_name + "',updated_at=now() "+iconStr+" "+logoStr+" WHERE id=" + req.body.id + "";

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




const deletedata = async (req, res) => {
    try {
        let statusStr = "UPDATE sports SET status= 2 ,updated_at=now() WHERE id=" + req.body.id + "";


        console.log("statusStr...");
        console.log(statusStr);
        await db.query(statusStr);
        return true;
    } catch (err) {
         console.log("err.......");
        console.log(err);
        return false;
    }
}

const checksportdublicate = async(req,res) =>{
try{
     const result = {};
      if(req.body.sport_id && req.body.sport_id !== 'undefined' && req.body.sport_id !== " "){
        var sportdata =  "SELECT id from subscriber_sports where subscriber_id = "+req.body.subscriber_id+" and status = 1 and sport_name = "+req.body.sport_id+"";  

        console.log("sportdata------------------");
       console.log(sportdata);

        var sportt =  await db.query(sportdata);
        var sportsinfo = sportt.rows;

        console.log(sportsinfo);
         

         if(sportsinfo && sportsinfo !== 'undefined' && sportsinfo !== "" && sportsinfo.length > 0){
         
         
         result.message = "please select another sport to add ..."; 
         result.type = 1;
       }
       

      else{

         
        result.message = "no sport id present";  
        result.type = 0;
       }
       
    }

    return result;
  }
  catch(err){
  console.log(err);
  }
}


const notDelete = async(req,res)=>{
    const result = [];

    try{
            
        let id = req.body.id ;
        let profile  ='';
        if (id && id!=="" && id!== "undefined") {

            
            let profiledata = "SELECT sport_name from subscriber_sports where status = 1 and sport_name = "+id+"";
            let profileinfo = await db.query(profiledata);
            profile =  profileinfo;
             
        

            let performancedata = "SELECT sport_id from individual_performance where status = 1 and sport_id  = "+id+"";
            let performanceinfo = await db.query(performancedata);
            profile =  performanceinfo;
            

           if (profile.rows.length > 0) { 

            let msg = "0";
            return msg;
           }

           else{

            let msg = "1"
            return msg;
           }

         } 
        
    } 
    catch(err){
        console.log(err);
            return false;
        }          
}

module.exports = { list, info, insert, update,deletedata ,checksportdublicate,notDelete}