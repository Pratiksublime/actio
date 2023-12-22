const db = require('../../db');
const helper = require('../../helper/helper');
const UploadFileLink =process.env.HOST+process.env.PORT+'/';


const updateAward = async (req, res) => {
    try {
        console.log("1234567891111.................................");
        await db.query(`BEGIN;`);
        let id = req.body.subscriber_id;
        console.log("id00000000000");
        console.log(id);
        
        console.log('req.body.awards================');
        console.log(req.body.awards)

        if (req.body.awards) {
           //await db.query(`DELETE FROM subscriber_play_awards WHERE subscriber_id=${id}`);
            let insertaward = '';
            for (let item of req.body.awards) {

                console.log('item================');
                console.log(item)
                if (item.icon) {
                    let isImage = /^data:image/.test(item.icon);
                    if (isImage) {
                        let profilePath = 'images/profile/';
                        let uploaded = helper.uploadBase64(item.icon, profilePath);
                        item.icon = uploaded.path;
                    }
                }

                 if(!item.award_name || typeof item.award_name === "undefined" || item.award_name === undefined && item.award_name ===""){
                        item.award_name = null;
                    }

                    if(!item.tournament || typeof item.tournament === "undefined" || item.tournament === undefined && item.tournament ===""){
                        item.tournament = null;
                    }

                    if(!item.description || typeof item.description === "undefined" || item.description === undefined && item.description ===""){
                        item.description = null;
                    }
                    if(!item.events || typeof item.events === "undefined" || item.events === undefined && item.events ===""){
                        item.events = null;
                    }
                 if(!item.award_data || typeof item.award_data === "undefined" || item.award_data === undefined && item.award_data ===""){
                        item.award_data = null;
                    }
                    if(!item.sport_id || typeof item.sport_id === "undefined" || item.sport_id === undefined && item.sport_id ===""){
                        item.sport_id = null;
                    }

                    if(item.tournament == 0){

                        var tournament_other_awards = item.tournament_other_awards;
                        //console.log('tournament_other_awards');
                        //console.log(tournament_other_awards);
                    }
                    else{

                        var tournament_other_awards = null;
                    }

                    if(item.events == 0){

                        var tournament_other_event = item.event_other_awards;
                    }
                    else{
                        var tournament_other_event = null;
                    } 
                       
                       console.log('item.id......................................................');
                       console.log(item.id);

                    if(item.id && item.id !=="undefined" && item.id !== ""){
                        console.log('demo,,,,,,,,,,,,,');

                           insertaward = "update subscriber_play_awards SET tournament = '"+item.tournament+"',description = '"+item.description+"',events = '"+item.events+"',sport_id = '"+item.sport_id+"',award_type_id = '"+item.award_data+"',award_date = '"+item.award_date+"',tournament_other_awards = '"+tournament_other_awards+"',event_other_awards = '"+tournament_other_event+"' WHERE id = '"+item.id+"'"; 
                    }
                    else{
                         console.log('demo2222,,,,,,,,,,,,,'); 

                        insertaward += `INSERT INTO subscriber_play_awards(award_name,tournament,icon,description,events,sport_id,award_type_id,award_date,subscriber_id,tournament_other_awards,event_other_awards, created_at, status )VALUES ('${item.award_name}','${item.tournament}',${(item.icon) ? "'" + item.icon.replace(/'/g, '\'\'') + "'" : null},'${item.description}','${item.events}',${item.sport_id},'${item.award_data}','${item.award_date}', ${id},'${tournament_other_awards}','${tournament_other_event}', now(), 1);`;
                     }

                 console.log('insertaward....////////////////'); 
                 console.log(insertaward);
            }

            

         if(insertaward){
            await db.query(insertaward);
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


const getMyAward = async (req, res) => {
    try {
    	
        let result = [];
        let id = req.body.subscriber_id;
        let query = await db.query(`SELECT a.*,a.award_type_id as award_data,c.award_name ,e.event_name,t.tournament_name ,b.sports_name as sport_name_new FROM subscriber_play_awards as a left join sports as b  on a.sport_id=b.id left join event as e  on a.events:: integer = e.id left join tournament as t  on a.tournament:: integer = t.id left join subscriber_play_awards_master as c  on a.award_type_id = c.id:: varchar WHERE a.status = 1 and a.subscriber_id=${id}`);

        console.log("demopppppppppppppppppppp-------------------------------------");
        console.log(query);

        if (query.rowCount) {
            result = query.rows;
            console.log("demopppppppppppppppppppp-------------------------------------");
        console.log(query);
        }
        return result
    }
     catch (err) {
        console.log(err);
        return {

            serverError: true,
            error: err.message
        }
    }
}

const getAward = async (req, res) => {
    try {
        
        let result = {};
        let query = await db.query("SELECT * ,Concat('"+UploadFileLink+"', CASE WHEN award_logo  != '' THEN  Concat(award_logo) end) as award_logo FROM subscriber_play_awards_master");


        console.log("query...................")


        console.log(query)
        if (query.rowCount) {
            result.data = query.rows;
        }

        if(query.rowCount > 0){
            var award_data = true;
            result.award_data = award_data;
        }
        else{
            var award_data = false;
            result.award_data = award_data;
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
const Deleteaward = async(req, res) => {
            try{

            console.log('req.body.id')
            console.log(req.body.id)
            let deleteQry = "UPDATE subscriber_play_awards SET status = 2 WHERE id = "+ req.body.id +"";

            console.log(deleteQry)
            await db.query(deleteQry);
            return true;
            }
            catch(err){
            console.log("err:");
            console.log(err);
            return false;
        }
    }




module.exports = {
    updateAward,getMyAward,getAward,Deleteaward
}