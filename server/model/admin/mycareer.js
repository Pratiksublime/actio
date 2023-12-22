var fs = require('fs');
var util = require('util');
var log_file = fs.createWriteStream(__dirname + '/debug.log', {flags : 'w'});
var log_stdout = process.stdout;

console.log = function(d) { //
  log_file.write(util.format(d) + '\n');
  log_stdout.write(util.format(d) + '\n');
};

const { Query } = require('pg');

const db = require('../../db');
const helper = require('../../helper/helper');


const updateMycareer = async (req, res) => {
    try {
        let id = req.body.subscriber_id;
        await db.query(`BEGIN;`);
        /*console.log('req.body.careercareer.....')
        console.log(req.body.career)
        console.log("req.body.team_name")
        console.log(req.body.team_name)*/
        if (Array.isArray(req.body.career)) {

            console.log("req.myID ");
            console.log(req.myID);

            await db.query(`DELETE FROM subscriber_play_teams WHERE subscriber_id=${id}`);

            console.log("demo1");
            let insertcareer = '';

            console.log("demo2");
            var profilePath = 'images/profile/';
           
            for (let item of req.body.career) {
                 var result = item.logo.slice(0, 15);
                console.log("demo3");
                if (item.logo && result !== profilePath) {
                    let isImage = /^data:image/.test(item.logo);
                    if (isImage ) {
                       
                        let uploaded = helper.uploadBase64(item.logo, profilePath);
                        item.logo = uploaded.path;
                    }
                }
                else{  
                
                //img = item.cover_img ;
                
                if(result === profilePath){
                    console.log("demo...........................");
                    item.logo = item.logo;
                }
            }
                if(item.team_name && typeof item.team_name !=="undefined" && item.team_name !== undefined && item.team_name !==""){
                    if(!item.coach_name || typeof item.coach_name === "undefined" || item.coach_name === undefined && item.coach_name ===""){
                        item.coach_name = null;
                    }else{
                        item.coach_name = "'"+item.coach_name+"'";
                    }
                    if(!item.logo || typeof item.logo === "undefined" || item.logo === undefined ){
                        item.logo = null;
                    }else{
                        item.logo = item.logo;
                    }
                    if(!item.joining_year || typeof item.joining_year === "undefined" || item.joining_year === undefined && item.joining_year ===""){
                        item.joining_year = null;
                    }else{
                        item.joining_year = "'"+item.joining_year+"'";
                    }
                    if(!item.till_year || typeof item.till_year === "undefined" || item.till_year === undefined && item.till_year ===""){
                        item.till_year = null;
                    }else{
                        item.till_year = "'"+item.till_year+"'";
                    }
                    if(!item.sport_id || typeof item.sport_id === "undefined" || item.sport_id === undefined && item.sport_id ===""){
                        item.sport_id = 0;
                    }
                    if(!item.coach_no || typeof item.coach_no === "undefined" || item.coach_no === undefined && item.coach_no ===""){
                        item.coach_no = null;
                    }

                    insertcareer += `INSERT INTO subscriber_play_teams(team_name,coach_name,logo,joining_year, till_year,coach_no,sport_id,subscriber_id, created_at, status )VALUES ('${item.team_name}',${item.coach_name},'${item.logo}',${item.joining_year},${item.till_year},${item.coach_no},${item.sport_id}, ${id}, now(), 1);`;    
             
                }
                
                console.log("demo5");    
            }
            console.log("demo6");
           console.log("insertcareer: ++++++");
           console.log(insertcareer);

           if(insertcareer){
            console.log("if insertcareer")
            var insertResult = await db.query(insertcareer);
            
            await db.query(`COMMIT;`);
            
            return true;

        }

        }
    } catch (err) {

        console.log("update err:");
        console.log(err);

        return false;
    }
}

const getMycareer = async (req, res) => {
    try {
        console.log('query..............')
        let result = {}; 
        let id = req.body.subscriber_id;
        let query = await db.query(`SELECT a.*, b.sports_name as sport_name_new FROM subscriber_play_teams as a left join sports as b  on a.sport_id=b.id WHERE a.subscriber_id=${id}`);
        
        console.log("query: ++++++");
        console.log(query.rowCount);
        if (query.rowCount) {
            result.data = query.rows;
        }

        if (query.rowCount > 0) {

            var career_data = true;
             console.log(career_data);
            result.career_data = career_data;
        }
        else  {
            var career_data = false;
            result.career_data = career_data;
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





module.exports = {
    updateMycareer,getMycareer
}