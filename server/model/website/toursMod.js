const db = require('../../db');
const helper = require('../../helper/helper');
const UploadFileLink = process.env.HOST + process.env.PORT + '/';
const UploadFileLinknew = process.env.HOST + process.env.PORT + '/images/tours/';


const list = async (req, res) => { 
    let result = {};
    try {

        var where_str = " ";
        if(req.query.page_record && typeof req.query.page_record !=="undefined" && typeof req.query.page_record !=="" && req.query.page_record>0){   
            where_str = " limit "+req.query.page_record;
        }

         let sports_id = '';
       
         if (req.query.sports_id) {
              
            var a = req.query.sports_id;

               //var demo2 = JSON.stringify(a);

            var demo =  a.split(/:|,/)


			demo = JSON.stringify(demo);

			var result123 = demo.replace(/"/g, "'"); 

			sports_id = `and string_to_array(sport_id, ',') && array${result123}`;  
 				console.log("demo----------12");
               console.log(sports_id);
             
           
            //sports_id = `and t.sport_id in (${a.split(/:|,/)})`;   
             //sports_id = `and CAST(t.sport_id as varchar) in ('${req.query.sports_id}')`;    
            //sports_id = `and CAST(t.sport_id as varchar) ILIKE ('%${req.query.sports_id}%')`;   
            
        }

        let tours_type =''
        if(req.query.tours_type){
            tours_type = ` AND t.tour_type in (${req.query.tours_type})`;  
        }

        let location ='' 
        if(req.query.country){
            location = ` AND t.country_id in (${req.query.country})`;   
        }

        let tour_name =''
        if(req.query.tour_name){
            tour_name = ` AND t.tour_name ILIKE ('%${req.query.tour_name}%')`;     
        }
        
    	//let listStr = "SELECT t.id,t.sport_id,t.tour_name,t.no_of_day,c.name as country_name,CASE WHEN tour_tile_img IS NULL THEN '' ELSE Concat('"+UploadFileLink+"',tour_tile_img)END as tour_tile_img FROM tours as t left join country as c on c.id = t.country_id WHERE t.status = 1 " ;

        let listStr = "SELECT t.*, t.id,tt.tour_type as tour_type_name, t.sport_id,t.tour_name,t.no_of_day,t.country_id, c.name as country_name FROM tours as t left join country as c on c.id = t.country_id left join tours_type tt on t.tour_type = tt.id WHERE t.status = 1 "+sports_id+tours_type+location+tour_name;

            console.log("listStr: +++++");
            console.log(listStr);

            let dataResult = await db.query(listStr);

            //if(dataResult && typeof dataResult !== undefined && dataResult.rows>0){
                result = dataResult.rows;

                for (var i = 0; i < result.length; i++) {
                        //data[i]
                        var query = "SELECT sports_name FROM sports where id in ("+result[i].sport_id+")";    

                        
                        console.log(query);
                        const listdata  = await db.query(query);
                        result[i].sport_data = listdata.rows;

//CASE WHEN (ie.event_logo IS NULL or ie.event_logo = '' or ie.event_logo ='null') THEN '' ELSE Concat('"+UploadFileLink+"',ie.event_logo) END  as event_logo
//Concat('"+UploadFileLink+"', CASE WHEN (attachment  != '' or attachment ='null' or attachment = '') THEN '' else Concat(attachment) end) as attachment

                    var tourquery = "SELECT type,CASE WHEN (attachment IS NULL or attachment = '' or attachment ='null') THEN '' ELSE Concat('"+UploadFileLink+"',attachment) END  as attachment FROM tour_attachment where status = 1 and tour_id = "+result[i].id;

                    var tourqueryData = await db.query(tourquery);

                    tourqueryData = tourqueryData.rows;

                   

                var bannerData = [];
                var tiledData = [];
                var logoData = [];
               

                if(tourqueryData && typeof tourqueryData !=="undefined" && tourqueryData.length>0){
                    for (var k = 0; k < tourqueryData.length; k++) {
                        if(tourqueryData[k].type==="logo"){
                            logoData.push(tourqueryData[k].attachment);
                        }else{
                            if(tourqueryData[k].type==="banner"){
                                bannerData.push(tourqueryData[k].attachment);
                            }else{
                                if(tourqueryData[k].type==="tile"){
                                    tiledData.push(tourqueryData[k].attachment);
                                }  
                            }    
                        }
                    }
                }
                
                result[i]['bannerData'] = bannerData;
                result[i]['tiledData'] = tiledData;
                result[i]['logoData'] = logoData;
               
                }
            //}
            

        } catch (err) {
        console.log("err: ");
        console.log(err);
        result = {};
    }
    return result;
}


const tourtype = async (req,res) => {
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

const ToursInfo = async (req,res) => {
    var result ={};
    try{
        if(req.query.tour_id && typeof req.query.tour_id !== undefined && req.query.tour_id!==""){
            //var tourtypeadd = "SELECT t.*, t.id,tt.tour_type as tour_type_name, t.sport_id,t.tour_name,t.no_of_day,t.country_id, c.name as country_name,(CASE WHEN tour_tile_img IS NOT NULL THEN Concat('"+UploadFileLink+"',tour_tile_img) WHEN tour_tile_img = '' THEN '' ELSE '' END) as tour_tile_img,(CASE WHEN tour_logo IS NOT NULL THEN Concat('"+UploadFileLink+"',tour_logo) WHEN tour_logo = '' THEN '' ELSE '' END) as tour_logo,(CASE WHEN banner IS NOT NULL THEN Concat('"+UploadFileLink+"',banner) WHEN banner = '' THEN '' ELSE '' END) as banner FROM tours as t left join country as c on c.id = t.country_id left join tours_type tt on t.tour_type = tt.id WHERE t.status = 1 and t.id ="+req.query.tour_id; 

            var tourtypeadd = "SELECT t.*, t.id,tt.tour_type as tour_type_name, t.sport_id,t.tour_name,t.no_of_day,t.country_id, c.name as country_name FROM tours as t left join country as c on c.id = t.country_id left join tours_type tt on t.tour_type = tt.id WHERE t.status = 1 and t.id ="+req.query.tour_id; 
            console.log(tourtypeadd);
            let data = await db.query(tourtypeadd);
            result = data.rows; 

            if(result && result !==undefined && result !==""){

                for (var i = 0; i < result.length; i++) {
                    
                var sportdata = "SELECT sports_name,id from sports where id in ("+result[i].sport_id+")"; 
                var sportsinfo = await db.query(sportdata);
                var sportcont = sportsinfo.rows;

               result[i]['sports'] = sportcont; 

               var tourquery = "SELECT type,CASE WHEN (attachment IS NULL or attachment = '' or attachment ='null') THEN '' ELSE Concat('"+UploadFileLink+"',attachment) END  as attachment FROM tour_attachment where status = 1 and tour_id = "+result[i].id;

                    var tourqueryData = await db.query(tourquery);

                    tourqueryData = tourqueryData.rows;

                   

                var bannerData = [];
                var tiledData = [];
                //var logoData = [];
               

                if(tourqueryData && typeof tourqueryData !=="undefined" && tourqueryData.length>0){
                    for (var k = 0; k < tourqueryData.length; k++) {
                        // if(tourqueryData[k].type==="logo"){
                        //     logoData.push(tourqueryData[k].attachment);
                        // }
                        // else{
                            if(tourqueryData[k].type==="banner"){
                                bannerData.push(tourqueryData[k].attachment);
                            }else{
                                if(tourqueryData[k].type==="tile"){
                                    tiledData.push(tourqueryData[k].attachment);
                                }  
                            }    
                       // }
                    }
                }
                
                result[i]['bannerData'] = bannerData;
                result[i]['tiledData'] = tiledData;
                //result[i]['logoData'] = logoData;

            }


            for (var j = 0; j < result.length; j++) {
                    
                var inclutionsdata = "SELECT inclutions,(CASE WHEN image IS NOT NULL THEN Concat('"+UploadFileLink+"',image) WHEN image = '' THEN '' ELSE '' END) as image,id from tours_inclutions where id in ("+result[j].inclusion+")"; 
                var inclutionsinfo = await db.query(inclutionsdata);
                var inclutionscont = inclutionsinfo.rows;

               result[j]['inclutions'] = inclutionscont;
            }

            for (var k = 0; k < result.length; k++) {
                    
                var inclutionsdata = "SELECT (CASE WHEN image IS NOT NULL THEN Concat('"+UploadFileLink+"',image) WHEN image = '' THEN '' ELSE '' END) as image,exclusions,id from tours_exclustions where id in ("+result[k].exclusion+")"; 
                var inclutionsinfo = await db.query(inclutionsdata);
                var inclutionscont = inclutionsinfo.rows;

               result[k]['exclusions'] = inclutionscont;
            }
        }   
    }


        
    }
    catch(err){
        console.log(err);
        return false;
    }
    return result ;
}

const ToursDocumentsInfo = async (req,res) => {
    var result ={};
    try{
        if(req.query.tour_id && typeof req.query.tour_id !== undefined && req.query.tour_id!==""){
            var tourtypeadd = "SELECT * FROM tours_documents WHERE status = 1 and tour_id ="+req.query.tour_id; 
            console.log(tourtypeadd);
            let data = await db.query(tourtypeadd);
            result = data.rows;    
        }
        
    }
    catch(err){
        console.log(err);
        return false;
    }
    return result ;
}


const ToursDownloadsInfo = async (req,res) => {
    var result ={};
    try{///images/tours/


        if(req.query.tour_id && typeof req.query.tour_id !== undefined && req.query.tour_id!==""){
            var tourtypeadd = "SELECT a.*, (CASE WHEN image IS NOT NULL THEN Concat('"+UploadFileLinknew+"',image) WHEN image = '' THEN '' ELSE '' END) as image FROM tours_downloads a WHERE a.status = 1 and a.tour_id ="+req.query.tour_id; 
            console.log(tourtypeadd);
            let data = await db.query(tourtypeadd);
            result = data.rows;    
        }
        
    }
    catch(err){
        console.log(err);
        return false;
    }
    return result ;
}

const ToursExclustionsInfo = async (req,res) => {
    var result ={};
    try{
        if(req.query.tour_id && typeof req.query.tour_id !== undefined && req.query.tour_id!==""){
            var tourtypeadd = "SELECT a.*, (CASE WHEN image IS NOT NULL THEN Concat('"+UploadFileLink+"',image) WHEN image = '' THEN '' ELSE '' END) as image FROM tours_exclustions a WHERE a.status = 1 and a.tour_id ="+req.query.tour_id; 
            console.log(tourtypeadd);
            let data = await db.query(tourtypeadd);
            result = data.rows;    
        }
        
    }
    catch(err){
        console.log(err);
        return false;
    }
    return result ;
}


const ToursGalleryInfo = async (req,res) => {
    var result ={};
    try{
        if(req.query.tour_id && typeof req.query.tour_id !== undefined && req.query.tour_id!==""){
            var tourtypeadd = "SELECT a.media_type,a.title,a.date, (CASE WHEN image IS NOT NULL THEN Concat('"+UploadFileLink+"',image) WHEN image = '' THEN '' ELSE '' END) as image, b.sports_name FROM tours_gallery a left join sports b on a.sport_id:: int = b.id WHERE a.media_type = 'image' and a.status = 1 and a.tour_id ="+req.query.tour_id; 
            console.log(tourtypeadd);
            let data = await db.query(tourtypeadd);
            result = data.rows;    
        }
        
    }
    catch(err){
        console.log(err);
        return false;
    }
    return result ;
}

const ToursvideoInfo = async (req,res) => {
    var result ={};
    try{
        if(req.query.tour_id && typeof req.query.tour_id !== undefined && req.query.tour_id!==""){
            var tourtypeadd = "SELECT a.media_type,a.video_url,a.title,a.date, b.sports_name FROM tours_gallery a left join sports b on a.sport_id:: int = b.id WHERE a.media_type = 'video' and a.status = 1 and a.tour_id ="+req.query.tour_id; 
            console.log(tourtypeadd);
            let data = await db.query(tourtypeadd);
            result = data.rows;    
        }
        
    }
    catch(err){
        console.log(err);
        return false;
    }
    return result ;
}


const ToursInclutionsInfo = async (req,res) => {
    var result ={};
    try{
        if(req.query.tour_id && typeof req.query.tour_id !== undefined && req.query.tour_id!==""){
            var tourtypeadd = "SELECT a.*, (CASE WHEN image IS NOT NULL THEN Concat('"+UploadFileLink+"',image) WHEN image = '' THEN '' ELSE '' END) as image FROM tours_inclutions a WHERE a.status = 1 and a.tour_id ="+req.query.tour_id; 
            console.log(tourtypeadd);
            let data = await db.query(tourtypeadd);
            result = data.rows;    
        }
        
    }
    catch(err){ 
        console.log(err);
        return false;
    }
    return result ;
}


const ToursIternaryInfo = async (req,res) => {
    var result ={};
    try{
        if(req.query.tour_id && typeof req.query.tour_id !== undefined && req.query.tour_id!==""){
            var tourtypeadd = "SELECT a.* FROM tours_iternary a WHERE a.status = 1 and a.tour_id ="+req.query.tour_id; 
            console.log(tourtypeadd);
            let data = await db.query(tourtypeadd);
            result = data.rows;    
        }
        
    }
    catch(err){
        console.log(err);
        return false;
    }
    return result ;
}


const ToursPresentationInfo = async (req,res) => {
    var result ={};
    try{
        if(req.query.tour_id && typeof req.query.tour_id !== undefined && req.query.tour_id!==""){ 
            var tourtypeadd = "SELECT a.*, (CASE WHEN brochure IS NOT NULL THEN Concat('"+UploadFileLinknew+"',brochure) WHEN brochure = '' THEN '' ELSE '' END) as brochure FROM tours_presentation a WHERE a.status = 1 and a.tour_id ="+req.query.tour_id;   
            
console.log("tourtypeadd===============");
            console.log(tourtypeadd);
            let data = await db.query(tourtypeadd);
            result = data.rows;    
        }
        
    }
    catch(err){
        console.log(err);
        return false;
    }
    return result ;
}

const locationList = async (req,res) => {
    var result ={};
    try{
       
            var tourtypeadd = "SELECT id,name FROM country "; 
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

const tourtypeList = async (req,res) => {
    var result ={};
    try{
       
            var tourtypeadd = "SELECT id,tours_type FROM tours_type ORDER BY id ASC ";  
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


module.exports = { list,tourtype, ToursInfo, ToursDocumentsInfo, ToursDownloadsInfo, ToursExclustionsInfo, ToursGalleryInfo,ToursvideoInfo, ToursInclutionsInfo, ToursIternaryInfo, ToursPresentationInfo,locationList,tourtypeList}