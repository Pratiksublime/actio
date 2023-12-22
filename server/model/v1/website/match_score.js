const { Query } = require('pg');
const db = require('../../../db');
const helper = require('../../../helper/helper');




   const insert = async (req, res) => {
 try {
    if (req.body.team ) {
    	const teamId = req.body.team[0].team_id;
      console.log(teamId);
    	console.log('req.body.team.team_id');
        let checkIdQuery = "SELECT id FROM team_score WHERE team_id = '" + req.body.team[0].team_id + "'  AND match_id = " + req.body.team[0].match_id;
        console.log("checkIdQuery.......");
        console.log(checkIdQuery);
        let checkData = await db.query(checkIdQuery);

        let checkRows = checkData.rows;


       
        console.log("checkIdQuery.......-------------------------------------");
        console.log(checkRows.length);

        if (checkRows.length > 0) {

          

          let score = ''
          if(req.body.team[0].score){
             score = "score = "+req.body.team[0].score+"";
          }

          

          
            let updateQuery = "UPDATE team_score SET score = " +req.body.team[0].score+ " WHERE team_id = '" + req.body.team[0].team_id + "' AND match_id = " + req.body.team[0].match_id;
            console.log("updateQuery");
            console.log(updateQuery);
            await db.query(updateQuery); 

            let updateplayer = "UPDATE player_score SET ";

          if (req.body.team[0].player[0].player_score == false || req.body.team[0].player[0].player_score == true && req.body.team[0].player[0].fouls !== '') {
            updateplayer += `score= ${req.body.team[0].player[0].player_score}, fouls = ${req.body.team[0].player[0].fouls} `;
          } else if (req.body.team[0].player[0].player_score == false || req.body.team[0].player[0].player_score == true) {
            updateplayer += `score = ${req.body.team[0].player[0].player_score} `;
          } else if (fouls !== '') {
            updateplayer += `fouls = ${req.body.team[0].player[0].fouls} `;
          }

          updateplayer += `WHERE team_id = '${req.body.team[0].team_id}' AND match_id = ${req.body.team[0].match_id} AND player_id = ${req.body.team[0].player[0].player_id}`;
          console.log("8888888888888888888");
            console.log(updateplayer);

             await db.query(updateplayer); 

        } else {
            let insertQuery = "INSERT INTO team_score (match_id, event_id, sport_id, team_id, score) VALUES (" + req.body.team[0].match_id + ", " + req.body.team[0].event_id + ", " + req.body.team[0].sport_id + ", '" + req.body.team[0].team_id + "'," + req.body.team[0].score + ")RETURNING id";
            console.log("insertQuery");
            console.log(insertQuery);
            let teamInfo = await db.query(insertQuery);

            let teamid = teamInfo.rows[0].id;

            if (req.body.team[0].player) {


              if( typeof req.body.team[0].player[0].player_id === 'undefined'){
                req.body.team[0].player[0].player_id = null;
              }

              if( typeof req.body.team[0].player[0].score === 'undefined'){
                req.body.team[0].player[0].score = null;
              }
              if( typeof req.body.team[0].player[0].set_one === 'undefined'){
                req.body.team[0].player[0].set_one = null;
              }
              if( typeof req.body.team[0].player[0].set_two  === 'undefined'){
                req.body.team[0].player[0].set_two = null;
              }

              if(typeof req.body.team[0].player[0].set_three === 'undefined'){ 
                req.body.team[0].player[0].set_three = null;
              }
              if( typeof req.body.team[0].player[0].set_four === 'undefined'){
                req.body.team[0].player[0].set_four = null;
              }
              if( typeof req.body.team[0].player[0].set_five === 'undefined'){
                req.body.team[0].player[0].set_five = null;
              }
              if(typeof req.body.team[0].player[0].game_one === 'undefined'){
                req.body.team[0].player[0].game_one = null;
              }
              if(typeof req.body.team[0].player[0].game_two === 'undefined'){
                req.body.team[0].player[0].game_two = null;
              }
              if(typeof req.body.team[0].player[0].game_three === 'undefined'){
                req.body.team[0].player[0].game_three = null;
              }
              if(typeof req.body.team[0].player[0].game_four === 'undefined'){
                req.body.team[0].player[0].game_four = null;
              }
              if(typeof req.body.team[0].player[0].game_five === 'undefined'){ 
                req.body.team[0].player[0].game_five = null;
              }
               if(typeof req.body.team[0].player[0].player_status === 'undefined'){
                req.body.team[0].player[0].player_status = null;
              }
              if(typeof req.body.team[0].player[0].fouls === 'undefined'){
                req.body.team[0].player[0].fouls = null;
              }

              if(typeof req.body.team[0].player[0].player_score === 'undefined'){
                req.body.team[0].player[0].player_score = null;
              }

            	const player_id = req.body.team[0].player[0].player_id;
            	

                let playerInsertQuery = "INSERT INTO player_score (match_id,team_id,sports_id,team_score_id, player_id, score, set_one, set_two, set_three,set_four, set_five, game_one, game_two, game_three, game_four, game_five, player_status, fouls) VALUES (" + req.body.team[0].match_id + "," + req.body.team[0].team_id + "," + req.body.team[0].sport_id + "," + teamid + "," + req.body.team[0].player[0].player_id + ", " + req.body.team[0].player[0].player_score + ", " + req.body.team[0].player[0].set_one + ", " + req.body.team[0].player[0].set_two + ", " + req.body.team[0].player[0].set_three + "," + req.body.team[0].player[0].set_four + ", " + req.body.team[0].player[0].set_five + "," + req.body.team[0].player[0].game_one + "," + req.body.team[0].player[0].game_two + "," + req.body.team[0].player[0].game_three + "," + req.body.team[0].player[0].game_four + "," + req.body.team[0].player[0].game_five + "," + req.body.team[0].player[0].player_status + "," + req.body.team[0].player[0].fouls + ")";
                console.log("playerInsertQuery333333333333333333333333333333333333333")
                console.log(playerInsertQuery)
                let playerData = await db.query(playerInsertQuery); 
            }
        }
    }

    









    if (req.body.participant) {
    	

    	
        for (var k = 0; k < req.body.participant.length; k++) { 



           let chekdata = "select id from participant_score WHERE player_id = "+req.body.participant[k].participant+" and match_id = "+req.body.participant[k].match_id+"" ;

           let checkRows = await db.query(chekdata);

      if(checkRows.rows.length > 0){
            let updatedata = "update participant_score set time = '"+req.body.participant[k].time+"' WHERE player_id = "+req.body.participant[k].participant+" and match_id = "+req.body.participant[k].match_id+" ";

            console.log(updatedata) 

              await db.query(updatedata);
           }

        else{
          

          if(typeof req.body.participant[k].time === 'undefined'){
                          req.body.participant[k].time = null;
                        }

              if(typeof req.body.participant[k].fouls === 'undefined'){
                req.body.participant[k].fouls = null;
              }

              if(typeof req.body.participant[k].score === 'undefined'){
                req.body.participant[k].score = null;
              }

              if(typeof req.body.participant[k].set_one === 'undefined'){
                req.body.participant[k].set_one = null;
              }

              if(typeof req.body.participant[k].set_two === 'undefined'){
                req.body.participant[k].set_two = null;
              }

              if(typeof req.body.participant[k].set_three === 'undefined'){
                req.body.participant[k].set_three = null;
              }

              if(typeof req.body.participant[k].set_four === 'undefined'){
                req.body.participant[k].set_four = null;
              }
              if(typeof req.body.participant[k].set_five === 'undefined'){
                req.body.participant[k].set_five = null;
              }
              if(typeof req.body.participant[k].game_one === 'undefined'){
                req.body.participant[k].game_one = null;
              }
              if(typeof req.body.participant[k].game_two === 'undefined'){
                req.body.participant[k].game_two = null;
              }
              if(typeof req.body.participant[k].game_three === 'undefined'){
                req.body.participant[k].game_three = null;
              }
              if(typeof req.body.participant[k].game_four === 'undefined'){
                req.body.participant[k].game_four = null;
              }
              if(typeof req.body.participant[k].game_five === 'undefined'){
                req.body.participant[k].game_five = null;
              }


            let participantInsertQuery = "INSERT INTO participant_score (player_id,match_id,sport_id,event_id,time, fouls, score, set_one, set_two, set_three,set_four, set_five, game_one, game_two, game_three, game_four,game_five) VALUES (" + req.body.participant[k].participant + ",'" + req.body.participant[k].match_id + "','" + req.body.participant[k].sport_id + "','" + req.body.participant[k].event_id + "','" + req.body.participant[k].time + "', " + req.body.participant[k].fouls + ", " + req.body.participant[k].score + ", " + req.body.participant[k].set_one + ", " + req.body.participant[k].set_two + ", " + req.body.participant[k].set_three + ", "+req.body.participant[k].set_four+"," + req.body.participant[k].set_five + ", " + req.body.participant[k].game_one + ", " + req.body.participant[k].game_two + ", " + req.body.participant[k].game_three + ", " + req.body.participant[k].game_four + "," + req.body.participant[k].game_five + ")";
            console.log("participantInsertQuery");
            console.log(participantInsertQuery);
            await db.query(participantInsertQuery);  
        }
      }
    }
 
    return true;
} catch (err) {
    console.log("err:");
    console.log(err);
    return false;
}


}




const insertplayer = async (req, res) => {
   try {

	let checkid = "select id from player_score where player_id = "+req.body.player_id+" and match_id ="+req.body.match_id+"";
        let chekdata = await db.query(checkid);

       	chekdata = chekdata.rows;



 	if(chekdata.length > 0){

 		let Querydatainfo ="update player_score set score = "+req.body.score+" where player_id = "+req.body.team_id+" and match_id = "+req.body.match_id+"";

			console.log("Querydata")
			console.log(Querydatainfo)
			await db.query(Querydatainfo); 

		}


    else{     
        
		let Querydata = "insert into player_score (match_id,team_id,player_id,score,sports_id,foul,player_status) values ("+req.body.match_id+","+req.body.team_id+","+req.body.player_id+","+req.body.score+","+req.body.sports_id+","+req.body.foul+","+req.body.player_status+"') ";
			console.log("Querydata")
			console.log(Querydata) 
        await db.query(Querydata);
    }

        return true;
    } catch (err) {
        console.log("err:");
        console.log(err); 

        return false;
    }
}



const teamplayerlist = async(req,res)=>{
try {
  var result = {
    team: []
  };

  let teamdata = "select * from match_schedule_team where match_schedule_id = " + req.body.id;

  

  let team = await db.query(teamdata);

  if (team.rows.length > 0) {
    let teamone = team.rows[0].team_1;
    let teamtwo = team.rows[0].team_2;




    

    if (teamone) {
      let teamonedata = "select r.*,ts.score from registration as r left join team_score as ts on ts.team_id = r.id where r.id = " + teamone +" ORDER BY id ASC";

	 let teaminfo = await db.query(teamonedata);




      let playerinfo = "select rp.* from registration_player as rp where rp.team_id = " + teaminfo.rows[0].id+"ORDER BY rp.id ASC";
      
      console.log("playerinfo..............")
      console.log(playerinfo)
      let playerinfodata = await db.query(playerinfo); 


     console.log("playerinfoplayerinfo.rows[0].id..............") 
      console.log(playerinfodata.rows[0].id) 

      
     
     

//       let match_statuss = "SELECT DISTINCT ps.player_id, ps.player_status FROM player_score AS ps WHERE ps.team_id = " +teaminfo.rows[0].id + "";

//         var match_statussrr = await db.query(match_statuss);

//         console.log('match_statussrr.rows');
//         console.log(match_statussrr.rows);
//         array = match_statussrr.rows;
// console.log('array');
//         console.log(array);
//         for (var i = 0; i < array.length; i++) {
//           playerinfodata.rows[i]['player_status'] = array[i].player_status;  
//         } 
         



      result.team.push({
        teamone: {
          ...teaminfo.rows[0],
          teamplayer: playerinfodata.rows
        }
      });
    }

    if (teamtwo) {
      let teamtwodata = "select r.*,ts.score from registration as r left join team_score as ts on ts.team_id = r.id where r.id = " + teamtwo;

      let teaminfo = await db.query(teamtwodata);


      let playerinfo = "select rp.* from registration_player as rp where rp.team_id = " + teaminfo.rows[0].id+"ORDER BY rp.id ASC";
      
      console.log("playerinfo..............")
      console.log(playerinfo)
      let playerinfodata = await db.query(playerinfo); 


     console.log("playerinfoplayerinfo.rows[0].id..............") 
      console.log(playerinfodata.rows[0].id)

      result.team.push({
        teamtwo: {
          ...teaminfo.rows[0],
          teamplayer: playerinfodata.rows
        }
      });
    }
  }

  let participant = "select msp.*,ps.*,r.player_name from match_schedule_participant as msp  left join registration_single_player as r on r.id = msp.participant left join participant_score as ps on ps.player_id = r.id where match_schedule_id = " + req.body.id;

  console.log("participant........");
  console.log(participant);

  let participantinfo = await db.query(participant);

  result.participant = participantinfo.rows;

  return result;
} catch (err) {
  console.log(err);
  // Handle the error
}





            
}


  const insertplayerscore = async (req, res) => {
  try {
    

     let temedata = "select id from team_score where team_id = "+req.body.team_id+"";  

console.log(temedata); 
      let datainfo = await db.query(temedata);

      datainfo = datainfo.rows;

      console.log('datainfo.length'); 
console.log(datainfo); 

      if(datainfo.length === 0){


        let insertdata = "insert INTO team_score (team_id,match_id,event_id,sport_id)VALUES("+req.body.team_id+","+req.body.match_id+","+req.body.event_id+","+req.body.sport_id+")";
      console.log("insertdata................");  

      console.log(insertdata); 
      await db.query(insertdata); 
      }
      
      // console.log(teamId);
      // console.log('req.body.team.team_id');
      //   let checkIdQuery = "SELECT id FROM player_score WHERE team_id = '" + req.body.team_id + "'  AND match_id = " + req.body.match_id;
      //   console.log("checkIdQuery.......");
      //   console.log(checkIdQuery);
      //   let checkData = await db.query(checkIdQuery);

      //   let checkRows = checkData.rows;


       
      //   console.log("checkIdQuery.......-------------------------------------");
      //   console.log(checkRows.length);

      //   if (checkRows.length > 0) {

          

      //     let score = ''
      //     if(req.body.score){
      //        score = "score = "+req.body.score+"";
      //     }

          

          
             

      //       let updateplayer = "UPDATE player_score SET ";

      //     if (req.body.player_score == false || req.body.player_score == true && req.body.fouls !== '') {
      //       updateplayer += `score= ${req.body.player_score}, fouls = ${req.body.fouls} `;
      //     } else if (req.body.player_score == false || req.body.player_score == true) {
      //       updateplayer += `score = ${req.body.player_score} `;
      //     } else if (fouls !== '') {
      //       updateplayer += `fouls = ${req.body.fouls} `;
      //     }

      //     updateplayer += `WHERE team_id = '${req.body.team_id}' AND match_id = ${req.body.match_id} AND player_id = ${req.body.player_id}`;
      //     console.log("8888888888888888888");
      //       console.log(updateplayer);

      //        await db.query(updateplayer); 

      //   } else {
            
            if( typeof req.body.player_id === 'undefined'){
                req.body.player_id = null;
              }

              if( typeof req.body.score === 'undefined'){
                req.body.score = null;
              }
              if( typeof req.body.set_one === 'undefined'){
                req.body.set_one = null;
              }
              if( typeof req.body.set_two  === 'undefined'){
                req.body.set_two = null;
              }

              if(typeof req.body.set_three === 'undefined'){ 
                req.body.set_three = null;
              }
              if( typeof req.body.set_four === 'undefined'){
                req.body.set_four = null;
              }
              if( typeof req.body.set_five === 'undefined'){
                req.body.set_five = null;
              }
              if(typeof req.body.game_one === 'undefined'){
                req.body.game_one = null;
              }
              if(typeof req.body.game_two === 'undefined'){
                req.body.game_two = null;
              }
              if(typeof req.body.game_three === 'undefined'){
                req.body.game_three = null;
              }
              if(typeof req.body.game_four === 'undefined'){
                req.body.game_four = null;
              }
              if(typeof req.body.game_five === 'undefined'){ 
                req.body.game_five = null;
              }
               if(typeof req.body.player_status === 'undefined'){
                req.body.player_status = null;
              }
              if(typeof req.body.fouls === 'undefined'){
                req.body.fouls = null;
              }

              if(typeof req.body.player_score === 'undefined'){ 
                req.body.player_score = null;
              }

              const player_id = req.body.player_id;
              

                let playerInsertQuery = "INSERT INTO player_score (match_id,team_id,sports_id,player_id,event_id,score,action_id,action_name,set_one, set_two, set_three,set_four, set_five, game_one, game_two, game_three, game_four, game_five, player_status, fouls) VALUES (" + req.body.match_id + "," + req.body.team_id + "," + req.body.sport_id + "," + req.body.player_id + ","+req.body.event_id+","+req.body.player_score+","+req.body.action_id+",'"+req.body.action_name+"'," + req.body.set_one + ", " + req.body.set_two + ", " + req.body.set_three + "," + req.body.set_four + ", " + req.body.set_five + "," + req.body.game_one + "," + req.body.game_two + "," + req.body.game_three + "," + req.body.game_four + "," + req.body.game_five + "," + req.body.player_status + "," + req.body.fouls + ")";
                console.log("playerInsertQuery333333333333333333333333333333333333333")
                console.log(playerInsertQuery)
                let playerData = await db.query(playerInsertQuery); 


             

    	
    	if(req.body.action_name == 'Score' || req.body.action_name == 'Scores' || req.body.action_name == 'Goal' || req.body.action_name == 'Goals' || req.body.action_name == 'Point' || req.body.action_name == 'Points'){

    		console.log('playerData.action_name...');
		console.log(req.body.action_name);

    	let scoresum = "SELECT sum(score) from player_score WHERE team_id = "+req.body.team_id+" and action_name = '"+req.body.action_name+"'  ";

    	

    	let  scoresuminfo = await db.query(scoresum);  

    	scoresuminfo = scoresuminfo.rows; 

    	console.log(scoresuminfo);


     let updatescore = "update team_score set score = "+scoresuminfo[0].sum+" WHERE team_id = "+req.body.team_id+""; 
    	console.log("updatescore................");  

    	console.log(updatescore); 
    	await db.query(updatescore); 
    

    	
    
    }
             
        
    // }

    
          return true;
        } catch (err) {
            console.log("err:");
            console.log(err);
            return false;
        }


}


const playerscorelist = async(req,res)=>{

try{
    let query = "SELECT ps.*,r.team_name, rp.jersey_no,rp.player_name from player_score as ps left join registration_player as rp on rp.id = ps.player_id left join registration as r on rp.team_id = r.id  where ps.player_id = "+req.query.id+" ORDER by ps.id desc";

    let datainfo = await db.query(query);

    
           datainfo = datainfo.rows;   

			
  //   for (var i = 0; i < datainfo.length; i++) {

    	
  //   	if(datainfo[i].action_name == 'Score' || datainfo[i].action_name == 'Scores' || datainfo[i].action_name == 'Goal' || datainfo[i].action_name == 'Goals' || datainfo[i].action_name == 'Point' || datainfo[i].action_name == 'Points'){

  //   		console.log('datainfo.action_name...');
		// console.log(datainfo[i].action_name);

  //   	let scoresum = "SELECT sum(score) from player_score WHERE player_id = "+datainfo[i].player_id+" and team_id = "+datainfo[i].team_id+" and action_name = '"+datainfo[i].action_name+"'  ";

    	

  //   	let  scoresuminfo = await db.query(scoresum); 

  //   	scoresuminfo = scoresuminfo.rows; 

  //   	console.log("scoresum................"); 

  //   	console.log(scoresuminfo);
  //   }
  //   }

    

    return datainfo
}
catch(err){

	console.log(err);
  return false;
}



}


const palyerstatus = async(req,res)=>{


  try{

  let update = "update registration_player set player_status ="+req.body.player_status+" WHERE id = "+req.body.id+""; 

   await db.query(update);

   return true;
 }
 catch(err){
  return false;

 }

}


const playerdelete = async(req,res)=>{


  try{

  // "delete from player_score WHERE id = "+req.body.id+""; 

  let query = "WITH deleted_rows AS (DELETE FROM player_score WHERE id = "+req.body.id+" RETURNING *)SELECT * FROM deleted_rows";

  let updata = await db.query(query);

  

  console.log('update....');

  console.log(updata.rows[0].action_name);

  if(updata.rows[0].action_name == 'Score' || updata.rows[0].action_name == 'Scores' || updata.rows[0].action_name == 'Goal' || updata.rows[0].action_name == 'Goals' || updata.rows[0].action_name == 'Point' || updata.rows[0].action_name == 'Points'){

    		console.log('playerData.action_name...');
		console.log(updata.rows[0].action_name);

    	let scoresum = "SELECT sum(score) from player_score WHERE team_id = "+updata.rows[0].team_id+" and action_name = '"+updata.rows[0].action_name+"'  ";

    	

    	let  scoresuminfo = await db.query(scoresum);  

    	scoresuminfo = scoresuminfo.rows; 

    	console.log(scoresuminfo);


    	let updatescore = "update team_score set score = "+scoresuminfo[0].sum+" WHERE team_id = "+updata.rows[0].team_id+"";   
    	console.log("updatescore................");  

    	console.log(updatescore); 
    	await db.query(updatescore);   

    	
    
    }
          

   return true;
 }
 catch(err){

 	console.log(err);
  return false;

 }

}


const kpiinsert = async(req,res)=>{

	try{
          console.log('req.body.player_id..........');
          console.log(req.body.player_id)

          console.log('req.body.player_id..........'); 
          console.log(req.body.kpi_id)

		if (Array.isArray(req.body.player_id) && req.body.player_id.length > 0) {

			for (var i = 0; i < req.body.player_id.length; i++) {


                  let chekdubli = "SELECT id from kpi_score where player_id = "+req.body.player_id[i]+" and kpi_id ="+req.body.kpi_id[i]+"";

                  console.log(chekdubli);

                  let chekdata = await db.query(chekdubli);

                   chekdata = chekdata.rows;
                  if(chekdata.length>0){
                  	let updatedata = "update kpi_score set kpi_score = "+req.body.kpi_score[i]+" where player_id = "+req.body.player_id[i]+" and kpi_id = "+req.body.kpi_id[i]+"";

                  	console.log(updatedata);

                  	await db.query(updatedata);
                  }
                  else{
                  		
                  		let kpidata = "insert into kpi_score (player_id,team_id,kpi_score,sports_id,kpi_id,status,created_at) VALUES("+req.body.player_id[i]+","+req.body.team_id[i]+","+req.body.kpi_score[i]+","+req.body.sports_id[i]+","+req.body.kpi_id[i]+",1,now())";

						await db.query(kpidata);   
                  	}
				}
			}

		else{


				let chekdubli = "SELECT id from kpi_score where player_id = "+req.body.player_id+" and kpi_id ="+req.body.kpi_id+"";

					let chekdata = await db.query(chekdubli);
					chekdata = chekdata.rows;
			          	if(chekdata.length>0){

								let updatedata = "update kpi_score set kpi_score = "+req.body.kpi_score+" where player_id = "+req.body.player_id+" and kpi_id = "+req.body.kpi_id+"";

			                  	console.log(updatedata);

			                  	await db.query(updatedata); 
						}

						else{

							let kpidata = "insert into kpi_score (player_id,team_id,kpi_score,sports_id,kpi_id,status,created_at) VALUES("+req.body.player_id+","+req.body.team_id+","+req.body.kpi_score+","+req.body.sports_id+","+req.body.kpi_id+",1,now())";
							await db.query(kpidata); 
						}

			
		}
 	return true;
		
	}
	catch(err){

		console.log(err);

		return false

	}
}



const kpiscorelist = async(req,res)=>{

	try{

		let result ={};

		let data = "SELECT ks.*,kc.category_name from kpi_score as ks left join kpi_category as kc on kc.id = ks.kpi_id where ks.status =1 and ks.player_id = "+req.query.id+"";

		console.log(data);

		result = await db.query(data);
		result = result.rows; 
		return result;
	}
	catch(err){
		console.log(err);
		return false;
	}
}

module.exports = { insert,insertplayer,teamplayerlist,insertplayerscore,playerscorelist,palyerstatus ,playerdelete,kpiinsert,kpiscorelist};