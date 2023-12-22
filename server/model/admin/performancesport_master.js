const db = require('../../db');
const helper = require('../../helper/helper');

const addperformancesport = async (req, res) => {
  try {

    const result = {};
    await db.query(`BEGIN;`);
    //console.log('req.body.sport');
    //console.log(req.body.event);


    const adddata = [];

      

    if (req.body.sport) {


      let sportdata = req.body.sport;
      

      adddata['sport_id'] = sportdata;

     }
   if(typeof req.body.is_subsport_id !== undefined){

    let subsportdata =  req.body.is_subsport_id;

      adddata['is_subsport_id'] = subsportdata;
    }
      
    if(typeof req.body.is_subsport_game_one !== undefined){
       
      let subsportgamedata = req.body.is_subsport_game_one;
      adddata['is_subsport_game_one'] = subsportgamedata;
    }

    if(typeof req.body.is_subsport_game_two !== undefined){
      let subsportdata = req.body.is_subsport_game_two;
      adddata['is_subsport_game_two'] = subsportdata;
    }

    if(typeof req.body.is_subsport_game_three !== undefined){
      let subsportdata = req.body.is_subsport_game_three;
      adddata['is_subsport_game_three'] = subsportdata;
    }
  if(typeof req.body.is_subsport_game_four !== undefined ){
      console.log("if +++++++++++++");
      let subsportdata = req.body.is_subsport_game_four;
      adddata['is_subsport_game_four'] = subsportdata;
    }else{
      console.log("else +++++++++++++");
    }

    if(typeof req.body.is_subsport_game_five !== undefined){
      let subsportdata = req.body.is_subsport_game_five;
      adddata['is_subsport_game_five'] = subsportdata;
    }

    if(typeof req.body.is_subsport_game_total !== undefined){
      let subsportdata = req.body.is_subsport_game_total;
      adddata['is_subsport_game_total'] = subsportdata;
    }

    if(typeof req.body.is_subsport_sets_one !== undefined){
      let subsportdata = req.body.is_subsport_sets_one;
      adddata['is_subsport_sets_one'] = subsportdata;
    }
    if(typeof req.body.is_subsport_sets_two !== undefined){
      let subsportdata = req.body.is_subsport_sets_two;
      adddata['is_subsport_sets_two'] = subsportdata;
    }
    if(typeof req.body.is_subsport_sets_three !==undefined ){
      let subsportdata = req.body.is_subsport_sets_three;
      adddata['is_subsport_sets_three'] = subsportdata;
    }
    if(typeof req.body.is_subsport_sets_four !==undefined){
      let subsportdata = req.body.is_subsport_sets_four;
      adddata['is_subsport_sets_four'] = subsportdata;
    }
    if(typeof req.body.is_subsport_sets_five !== undefined){
      let subsportdata = req.body.is_subsport_sets_five; 
      adddata['is_subsport_sets_five'] = subsportdata;
    }
    if(typeof req.body.is_subsport_sets_total !== undefined){
      let subsportdata = req.body.is_subsport_sets_total;
      adddata['is_subsport_sets_total'] = subsportdata;
    }
      


    if (req.body.event) {

      let eventdata = req.body.event;

      adddata['is_event'] = eventdata.is_event
      adddata['is_event_stroke'] = eventdata.is_event_stroke
      adddata['is_event_distance'] = eventdata.is_event_distance
      adddata['is_event_dicipline'] = eventdata.is_event_dicipline
      adddata['event_type'] = eventdata.event_type

    }

    if (req.body.match) {

      let eventdata = req.body.match;

      adddata['is_match_no'] = eventdata.is_match_no
      adddata['is_match_level'] = eventdata.is_match_level
      adddata['is_participant_one_logo'] = eventdata.is_participant_one_logo
      adddata['is_participant_one'] = eventdata.is_participant_one
      adddata['is_participant_one_score'] = eventdata.is_participant_one_score
      adddata['is_participant_one_game_one'] = eventdata.is_participant_one_game_one
      adddata['is_participant_one_game_two'] = eventdata.is_participant_one_game_two
      adddata['is_participant_one_game_three'] = eventdata.is_participant_one_game_three
      adddata['is_participant_one_game_four'] = eventdata.is_participant_one_game_four
      adddata['is_participant_one_game_five'] = eventdata.is_participant_one_game_five
      adddata['is_participant_one_game_total'] = eventdata.is_participant_one_game_total
      adddata['is_participant_one_sets_one'] = eventdata.is_participant_one_sets_one
      adddata['is_participant_one_description'] = eventdata.is_participant_one_description
      //adddata['match_no'] = req.body.match_no 
      adddata['is_participant_one_sets_two'] = eventdata.is_participant_one_sets_two
      adddata['is_participant_one_sets_three'] = eventdata.is_participant_one_sets_three
      adddata['is_participant_one_sets_four'] = eventdata.is_participant_one_sets_four
      adddata['is_participant_one_sets_five'] = eventdata.is_participant_one_sets_five
      adddata['is_participant_one_sets_total'] = eventdata.is_participant_one_sets_total
      adddata['is_participant_two_log'] = eventdata.is_participant_two_log
      adddata['is_participant_two'] = eventdata.is_participant_two
      adddata['is_participant_two_score'] = eventdata.is_participant_two_score
      adddata['is_participant_two_game_one'] = eventdata.is_participant_two_game_one
      adddata['is_participant_two_game_two'] = eventdata.is_participant_two_game_two
      adddata['is_participant_two_game_three'] = eventdata.is_participant_two_game_three
      adddata['is_participant_two_game_four'] = eventdata.is_participant_two_game_four
      adddata['is_participant_two_game_five'] = eventdata.is_participant_two_game_five
      adddata['is_participant_two_game_total'] = eventdata.is_participant_two_game_total
      adddata['is_participant_two_sets_one'] = eventdata.is_participant_two_sets_one
      adddata['is_participant_two_sets_two'] = eventdata.is_participant_two_sets_two
      adddata['is_participant_two_sets_three'] = eventdata.is_participant_two_sets_three
      adddata['is_participant_two_sets_four'] = eventdata.is_participant_two_sets_four
      adddata['is_participant_two_sets_five'] = eventdata.is_participant_two_sets_five
      adddata['is_participant_two_sets_total'] = eventdata.is_participant_two_sets_total
      adddata['is_participant_two_description'] = eventdata.is_participant_two_description
      adddata['is_team_name_one'] = eventdata.is_team_name_one
      adddata['is_team_one_logo'] = eventdata.is_team_one_logo
      adddata['is_team_one_score'] = eventdata.is_team_one_score
      adddata['is_team_one_description'] = eventdata.is_team_one_description
      adddata['is_team_one_game_one'] = eventdata.is_team_one_game_one
      adddata['is_team_one_game_two'] = eventdata.is_team_one_game_two
      adddata['is_team_one_game_three'] = eventdata.is_team_one_game_three
      adddata['is_team_one_game_four'] = eventdata.is_team_one_game_four
      adddata['is_team_one_game_five'] = eventdata.is_team_one_game_five
      adddata['is_team_one_game_total'] = eventdata.is_team_one_game_total
      adddata['is_team_one_sets_one'] = eventdata.is_team_one_sets_one
      adddata['is_team_one_sets_two'] = eventdata.is_team_one_sets_two
      adddata['is_team_one_sets_three'] = eventdata.is_team_one_sets_three
      adddata['is_team_one_sets_four'] = eventdata.is_team_one_sets_four
      adddata['is_team_one_sets_five'] = eventdata.is_team_one_sets_five
      adddata['is_team_one_sets_total'] = eventdata.is_team_one_sets_total
      adddata['is_team_two_name'] = eventdata.is_team_two_name
      adddata['is_team_two_logo'] = eventdata.is_team_two_logo
      adddata['is_team_two_score'] = eventdata.is_team_two_score
      adddata['is_team_two_description'] = eventdata.is_team_two_description
      adddata['is_team_two_game_one'] = eventdata.is_team_two_game_one
      adddata['is_team_two_game_two'] = eventdata.is_team_two_game_two
      adddata['is_team_two_game_three'] = eventdata.is_team_two_game_three
      adddata['is_team_two_game_four'] = eventdata.is_team_two_game_four
      adddata['is_team_two_game_five'] = eventdata.is_team_two_game_five
      adddata['is_team_two_game_total'] = eventdata.is_team_two_game_total
      adddata['is_team_two_sets_one'] = eventdata.is_team_two_sets_one
      adddata['is_team_two_sets_two'] = eventdata.is_team_two_sets_two
      adddata['is_team_two_sets_three'] = eventdata.is_team_two_sets_three
      adddata['is_team_two_sets_four'] = eventdata.is_team_two_sets_four
      adddata['is_team_two_sets_total'] = eventdata.is_team_two_sets_total
      adddata['is_team_finel_result'] = eventdata.is_team_finel_result
      adddata['is_team_finel_score'] = eventdata.is_team_finel_score
      adddata['is_win_team'] = eventdata.is_win_team






    }

    if (req.body.level) {

      let leveldata = req.body.level;
      adddata['is_level'] = leveldata.is_level
      adddata['is_level_timeing'] = leveldata.is_level_timeing
      adddata['is_level_dicipline'] = leveldata.is_level_dicipline
      adddata['is_level_parameter'] = leveldata.is_level_parameter
      adddata['is_level_value'] = leveldata.is_level_value
      adddata['is_level_point'] = leveldata.is_level_point
      adddata['is_level_position'] = leveldata.is_level_position

    }


    if (req.body.statistic) {

      let sdata = req.body.statistic;
      adddata['is_statistic_name'] = sdata.is_statistic_name
      adddata['is_statistic_logo'] = sdata.is_statistic_logo
      adddata['is_statistic_type'] = sdata.is_statistic_type
      adddata['is_statistic_val'] = sdata.is_statistic_val
      adddata['is_stac_game_one'] = sdata.is_stac_game_one
      adddata['is_stac_game_two'] = sdata.is_stac_game_two
      adddata['is_stac_game_three'] = sdata.is_stac_game_three
      adddata['is_stac_game_four'] = sdata.is_stac_game_four
      adddata['is_stac_game_five'] = sdata.is_stac_game_five
      adddata['is_stac_game_total'] = sdata.is_stac_game_total
      adddata['is_stac_sets_one'] = sdata.is_stac_sets_one
      adddata['is_stac_sets_two'] = sdata.is_stac_sets_two
      adddata['is_stac_sets_three'] = sdata.is_stac_sets_three
      adddata['is_stac_sets_four'] = sdata.is_stac_sets_four
      adddata['is_stac_sets_five'] = sdata.is_stac_sets_five
      adddata['is_stac_sets_total'] = sdata.is_stac_sets_total
      
      

      
    }
    console.log("adddata*************..............");
    console.log(adddata);


    if (Array.isArray(adddata)) {
      console.log('add');
      console.log(adddata.is_event);
      console.log('fffffffffffffff');


      let insertsportmaster = '';
      //var item = adddata.length;

      console.log("item length");
      console.log(adddata.length);

      // if(adddata['sport_id'] && adddata['sport_id' ] !== 'undefined' && adddata['sport_id'] !== " "){

        
      //   var sportdata =  "SELECT sport_id from performance_sport_master where sport_id = "+adddata['sport_id']+"";

      //   //console.log('sportdata...........');
      //   //console.log(sportdata);
        

      //    var sportt =  await db.query(sportdata);

         

      //    if(sportt && sportt !== 'undefined' && sportt !== ""){
      //    var sportsinfo = sportt.rows;
      //    console.log('+++++++++++++++++++++++++++++++++++++++ sportsinfo');
      //    console.log(sportsinfo);
      //    result.message = "select another sport to add template...";
      //  }
        

      //    if(sportsinfo && sportsinfo !== 'undefined' && sportdata !==""){
      //     return   "selsct another sport..."; 
      //    }
      // }

      console.log('demo');
      // console.log(item[1].is_event);

      // for(var i = 0; i < adddata.length; i++) {  

      console.log('demo2');
      //console.log(adddata[0].sport_id);
      insertsportmaster += `INSERT INTO performance_sport_master(
                    sport_id,is_event, is_event_stroke, is_event_distance,is_event_dicipline,event_type,is_match_no,is_match_level,is_participant_one_logo,is_participant_one,is_participant_one_score,is_participant_one_game_one,is_participant_one_game_two,is_participant_one_game_three,is_participant_one_game_four,is_participant_one_game_five,is_participant_one_game_total,is_participant_one_sets_one,is_participant_one_sets_two,is_participant_one_sets_three,is_participant_one_sets_four,is_participant_one_sets_five,is_participant_one_sets_total,is_participant_one_description,is_participant_two_log,is_participant_two,is_participant_two_score,is_participant_two_game_one,is_participant_two_game_two,is_participant_two_game_three,is_participant_two_game_four,is_participant_two_game_five,is_participant_two_game_total,is_participant_two_sets_one,is_participant_two_sets_two,is_participant_two_sets_three,is_participant_two_sets_four,is_participant_two_sets_five,is_participant_two_sets_total,is_participant_two_description,is_team_name_one,is_team_one_logo,is_team_one_score,is_team_one_description,is_team_one_game_one,is_team_one_game_two,is_team_one_game_three,is_team_one_game_four,is_team_one_game_five,is_team_one_game_total,is_team_one_sets_one,is_team_one_sets_two,is_team_one_sets_three,is_team_one_sets_four,is_team_one_sets_five,is_team_one_sets_total,is_team_two_name,is_team_two_logo,is_team_two_score,is_team_two_description,is_team_two_game_one,is_team_two_game_two,is_team_two_game_three,is_team_two_game_four,is_team_two_game_five,is_team_two_game_total,is_team_two_sets_one,is_team_two_sets_two,is_team_two_sets_three,is_team_two_sets_four,is_team_two_sets_total,is_team_finel_result,is_team_finel_score,is_win_team,is_level,is_level_timeing,is_level_dicipline,is_level_parameter,is_level_value,is_level_point,is_level_position,is_statistic_name,is_statistic_logo,is_statistic_type,is_statistic_val,is_stac_game_one,is_stac_game_two,is_stac_game_three,is_stac_game_four,is_stac_game_five,is_stac_game_total,is_stac_sets_one,is_stac_sets_two,is_stac_sets_three,is_stac_sets_four,is_stac_sets_five,is_stac_sets_total,is_subsport_id,is_subsport_game_one,is_subsport_game_two,is_subsport_game_three,is_subsport_game_four,is_subsport_game_five,is_subsport_game_total,is_subsport_sets_one,is_subsport_sets_two,is_subsport_sets_three,is_subsport_sets_four,is_subsport_sets_five,is_subsport_sets_total,created_at,status )
                    VALUES (${adddata.sport_id},${adddata.is_event},${adddata.is_event_stroke},${adddata.is_event_distance},${adddata.is_event_dicipline},'${adddata.event_type}',${adddata.is_match_no}, ${adddata.is_match_level},${adddata.is_participant_one_logo},${adddata.is_participant_one},${adddata.is_participant_one_score},${adddata.is_participant_one_game_one},${adddata.is_participant_one_game_two},${adddata.is_participant_one_game_three},${adddata.is_participant_one_game_four},${adddata.is_participant_one_game_five},${adddata.is_participant_one_game_total},${adddata.is_participant_one_sets_one},${adddata.is_participant_one_sets_two},${adddata.is_participant_one_sets_three},${adddata.is_participant_one_sets_four},${adddata.is_participant_one_sets_five},${adddata.is_participant_one_sets_total},${adddata.is_participant_one_description},${adddata.is_participant_two_log},${adddata.is_participant_two},${adddata.is_participant_two_score},${adddata.is_participant_two_game_one},${adddata.is_participant_two_game_two},${adddata.is_participant_two_game_three},${adddata.is_participant_two_game_four},${adddata.is_participant_two_game_five},${adddata.is_participant_two_game_total},${adddata.is_participant_two_sets_one},${adddata.is_participant_two_sets_two},${adddata.is_participant_two_sets_three},${adddata.is_participant_two_sets_four},${adddata.is_participant_two_sets_five},${adddata.is_participant_two_sets_total},${adddata.is_participant_two_description},${adddata.is_team_name_one},${adddata.is_team_one_logo},${adddata.is_team_one_score},${adddata.is_team_one_description},${adddata.is_team_one_game_one},${adddata.is_team_one_game_two},${adddata.is_team_one_game_three},${adddata.is_team_one_game_four},${adddata.is_team_one_game_five},${adddata.is_team_one_game_total},${adddata.is_team_one_sets_one},${adddata.is_team_one_sets_two},${adddata.is_team_one_sets_three},${adddata.is_team_one_sets_four},${adddata.is_team_one_sets_five},${adddata.is_team_one_sets_total},${adddata.is_team_two_name},${adddata.is_team_two_logo},${adddata.is_team_two_score},${adddata.is_team_two_description},${adddata.is_team_two_game_one},${adddata.is_team_two_game_two},${adddata.is_team_two_game_three},${adddata.is_team_two_game_four},${adddata.is_team_two_game_five},${adddata.is_team_two_game_total},${adddata.is_team_two_sets_one},${adddata.is_team_two_sets_two},${adddata.is_team_two_sets_three},${adddata.is_team_two_sets_four},${adddata.is_team_two_sets_total},${adddata.is_team_finel_result},${adddata.is_team_finel_score},${adddata.is_win_team},${adddata.is_level},${adddata.is_level_timeing},${adddata.is_level_dicipline},${adddata.is_level_parameter},${adddata.is_level_value},${adddata.is_level_point},${adddata.is_level_position},${adddata.is_statistic_name},${adddata.is_statistic_logo},${adddata.is_statistic_type},${adddata.is_statistic_val},${adddata.is_stac_game_one},${adddata.is_stac_game_two},${adddata.is_stac_game_three},${adddata.is_stac_game_four},${adddata.is_stac_game_five},${adddata.is_stac_game_total},${adddata.is_stac_sets_one},${adddata.is_stac_sets_two},${adddata.is_stac_sets_three},${adddata.is_stac_sets_four},${adddata.is_stac_sets_five},${adddata.is_stac_sets_total},${adddata.is_subsport_id},${adddata.is_subsport_game_one},${adddata.is_subsport_game_two},${adddata.is_subsport_game_three},${adddata.is_subsport_game_four},${adddata.is_subsport_game_five},${adddata.is_subsport_game_total},${adddata.is_subsport_sets_one},${adddata.is_subsport_sets_two},${adddata.is_subsport_sets_three},${adddata.is_subsport_sets_four},${adddata.is_subsport_sets_five},${adddata.is_subsport_sets_total},now(), 1);`;
      // }


                  console.log("insertsportmaster......");
                  console.log(insertsportmaster);
                  if (insertsportmaster) {
                    await db.query(insertsportmaster);
                  }
                }
                await db.query(`COMMIT;`);
              } catch (err) {
                console.log(err);
                await db.query(`ROLLBACK;`);
                return {
                  //result;
                  serverError: false,
                  error: err.message
                }
              }
            }


const performanceupdatedata = async (req, res) => {
  try {
     
     console.log('ggggggggggggggggggg');

    const adddata = [];

    if (req.body.id) {


      let iddata = req.body.id;
      adddata['id'] = iddata;

    }
    if (req.body.sport) {


      let sportdata = req.body.sport;
      adddata['sport_id'] = sportdata;

    }

    if(typeof req.body.is_subsport_id !== undefined){

     let subsportdata =  req.body.is_subsport_id;

      adddata['is_subsport_id'] = subsportdata;
    }

 console.log(req.body.is_subsport_game_one);
 console.log("one one one one one -------------------");

  console.log(req.body.is_subsport_game_four);
  console.log("one is_subsport_game_four is_subsport_game_four one is_subsport_game_four -------------------");

    if(typeof req.body.is_subsport_game_one !== undefined){
      let subsportgamedata = req.body.is_subsport_game_one;
      adddata['is_subsport_game_one'] = subsportgamedata;
    }

    if(typeof req.body.is_subsport_game_two !==undefined){
      let subsportdata = req.body.is_subsport_game_two;
      adddata['is_subsport_game_two'] = subsportdata;
    }

    if(typeof req.body.is_subsport_game_three !== undefined){
      let subsportdata = req.body.is_subsport_game_three;
      adddata['is_subsport_game_three'] = subsportdata;
    }

    if(typeof req.body.is_subsport_game_four !== undefined){

      console.log(req.body.is_subsport_game_four);
      let subsportdata = req.body.is_subsport_game_four;
      adddata['is_subsport_game_four'] = subsportdata;
    }

    if(typeof req.body.is_subsport_game_five !== undefined){
      let subsportdata = req.body.is_subsport_game_five;
      adddata['is_subsport_game_five'] = subsportdata;
    }

    if(typeof req.body.is_subsport_game_total !== undefined){
      let subsportdata = req.body.is_subsport_game_total;
      adddata['is_subsport_game_total'] = subsportdata;
    }

    if(typeof req.body.is_subsport_sets_one !== undefined){
      let subsportdata = req.body.is_subsport_sets_one;
      adddata['is_subsport_sets_one'] = subsportdata;
    }
    if(typeof req.body.is_subsport_sets_two !== undefined){
      let subsportdata = req.body.is_subsport_sets_two;
      adddata['is_subsport_sets_two'] = subsportdata;
    }
    if(typeof req.body.is_subsport_sets_three !== undefined){
      let subsportdata = req.body.is_subsport_sets_three;
      adddata['is_subsport_sets_three'] = subsportdata;
    }
    if( typeof req.body.is_subsport_sets_four !== undefined){
      let subsportdata = req.body.is_subsport_sets_four;
      adddata['is_subsport_sets_four'] = subsportdata;
    }
    if(typeof req.body.is_subsport_sets_five !== undefined){
      let subsportdata = req.body.is_subsport_sets_five;
      adddata['is_subsport_sets_five'] = subsportdata;
    }
    if(typeof req.body.is_subsport_sets_total !== undefined){
      let subsportdata = req.body.is_subsport_sets_total;
      adddata['is_subsport_sets_total'] = subsportdata;
    }

    console.log("ghhhhhhhhhhhhhhhrgg--------------------");
    console.log(adddata);



    if (req.body.event) {

      let eventdata = req.body.event;

      adddata['is_event'] = eventdata.is_event
      adddata['is_event_stroke'] = eventdata.is_event_stroke
      adddata['is_event_distance'] = eventdata.is_event_distance
      adddata['is_event_dicipline'] = eventdata.is_event_dicipline
      adddata['event_type'] = eventdata.event_type

    }

    if (req.body.match) {

      let eventdata = req.body.match;

      adddata['is_match_no'] = eventdata.is_match_no
      adddata['is_match_level'] = eventdata.is_match_level
      adddata['is_participant_one_logo'] = eventdata.is_participant_one_logo
      adddata['is_participant_one'] = eventdata.is_participant_one
      adddata['is_participant_one_score'] = eventdata.is_participant_one_score
      adddata['is_participant_one_game_one'] = eventdata.is_participant_one_game_one
      adddata['is_participant_one_game_two'] = eventdata.is_participant_one_game_two
      adddata['is_participant_one_game_three'] = eventdata.is_participant_one_game_three
      adddata['is_participant_one_game_four'] = eventdata.is_participant_one_game_four
      adddata['is_participant_one_game_five'] = eventdata.is_participant_one_game_five
      adddata['is_participant_one_game_total'] = eventdata.is_participant_one_game_total
      adddata['is_participant_one_sets_one'] = eventdata.is_participant_one_sets_one
      adddata['is_participant_one_sets_two'] = eventdata.is_participant_one_sets_two
      adddata['is_participant_one_sets_three'] = eventdata.is_participant_one_sets_three
      adddata['is_participant_one_sets_four'] = eventdata.is_participant_one_sets_four
      adddata['is_participant_one_sets_five'] = eventdata.is_participant_one_sets_five
      adddata['is_participant_one_sets_total'] = eventdata.is_participant_one_sets_total
      adddata['is_participant_one_description'] = eventdata.is_participant_one_description
      
      adddata['is_participant_two_log'] = eventdata.is_participant_two_log
      adddata['is_participant_two'] = eventdata.is_participant_two
      adddata['is_participant_two_score'] = eventdata.is_participant_two_score
      adddata['is_participant_two_game_one'] = eventdata.is_participant_two_game_one
      adddata['is_participant_two_game_two'] = eventdata.is_participant_two_game_two
      adddata['is_participant_two_game_three'] = eventdata.is_participant_two_game_three
      adddata['is_participant_two_game_four'] = eventdata.is_participant_two_game_four
      adddata['is_participant_two_game_five'] = eventdata.is_participant_two_game_five
      adddata['is_participant_two_game_total'] = eventdata.is_participant_two_game_total
      adddata['is_participant_two_sets_one'] = eventdata.is_participant_two_sets_one
      adddata['is_participant_two_sets_two'] = eventdata.is_participant_two_sets_two
      adddata['is_participant_two_sets_three'] = eventdata.is_participant_two_sets_three
      adddata['is_participant_two_sets_four'] = eventdata.is_participant_two_sets_four
      adddata['is_participant_two_sets_five'] = eventdata.is_participant_two_sets_five
      adddata['is_participant_two_sets_total'] = eventdata.is_participant_two_sets_total
      adddata['is_participant_two_description'] = eventdata.is_participant_two_description
      adddata['is_team_name_one'] = eventdata.is_team_name_one
      adddata['is_team_one_logo'] = eventdata.is_team_one_logo
      adddata['is_team_one_score'] = eventdata.is_team_one_score
      adddata['is_team_one_description'] = eventdata.is_team_one_description
      adddata['is_team_one_game_one'] = eventdata.is_team_one_game_one
      adddata['is_team_one_game_two'] = eventdata.is_team_one_game_two
      adddata['is_team_one_game_three'] = eventdata.is_team_one_game_three
      adddata['is_team_one_game_four'] = eventdata.is_team_one_game_four
      adddata['is_team_one_game_five'] = eventdata.is_team_one_game_five
      adddata['is_team_one_game_total'] = eventdata.is_team_one_game_total
      adddata['is_team_one_sets_one'] = eventdata.is_team_one_sets_one
      adddata['is_team_one_sets_two'] = eventdata.is_team_one_sets_two
      adddata['is_team_one_sets_three'] = eventdata.is_team_one_sets_three
      adddata['is_team_one_sets_four'] = eventdata.is_team_one_sets_four
      adddata['is_team_one_sets_five'] = eventdata.is_team_one_sets_five
      adddata['is_team_one_sets_total'] = eventdata.is_team_one_sets_total
      adddata['is_team_two_name'] = eventdata.is_team_two_name
      adddata['is_team_two_logo'] = eventdata.is_team_two_logo
      adddata['is_team_two_score'] = eventdata.is_team_two_score
      adddata['is_team_two_description'] = eventdata.is_team_two_description
      adddata['is_team_two_game_one'] = eventdata.is_team_two_game_one
      adddata['is_team_two_game_two'] = eventdata.is_team_two_game_two
      adddata['is_team_two_game_three'] = eventdata.is_team_two_game_three
      adddata['is_team_two_game_four'] = eventdata.is_team_two_game_four
      adddata['is_team_two_game_five'] = eventdata.is_team_two_game_five
      adddata['is_team_two_game_total'] = eventdata.is_team_two_game_total
      adddata['is_team_two_sets_one'] = eventdata.is_team_two_sets_one
      adddata['is_team_two_sets_two'] = eventdata.is_team_two_sets_two
      adddata['is_team_two_sets_three'] = eventdata.is_team_two_sets_three
      adddata['is_team_two_sets_four'] = eventdata.is_team_two_sets_four
      adddata['is_team_two_sets_five'] = eventdata.is_team_two_sets_five
      adddata['is_team_two_sets_total'] = eventdata.is_team_two_sets_total
      adddata['is_team_finel_result'] = eventdata.is_team_finel_result
      adddata['is_team_finel_score'] = eventdata.is_team_finel_score
      adddata['is_win_team'] = eventdata.is_win_team

    }


    if (req.body.level) {

      let leveldata = req.body.level;
      adddata['is_level'] = leveldata.is_level
      adddata['is_level_timeing'] = leveldata.is_level_timeing
      adddata['is_level_dicipline'] = leveldata.is_level_dicipline
      adddata['is_level_parameter'] = leveldata.is_level_parameter
      adddata['is_level_value'] = leveldata.is_level_value
      adddata['is_level_point'] = leveldata.is_level_point
      adddata['is_level_position'] = leveldata.is_level_position

    }


    if (req.body.statistic) {

      let sdata = req.body.statistic;
      adddata['is_statistic_name'] = sdata.is_statistic_name
      adddata['is_statistic_logo'] = sdata.is_statistic_logo
      adddata['is_statistic_type'] = sdata.is_statistic_type
      adddata['is_statistic_val'] = sdata.is_statistic_val
      adddata['is_stac_game_one'] = sdata.is_stac_game_one
      adddata['is_stac_game_two'] = sdata.is_stac_game_two
      adddata['is_stac_game_three'] = sdata.is_stac_game_three
      adddata['is_stac_game_four'] = sdata.is_stac_game_four
      adddata['is_stac_game_five'] = sdata.is_stac_game_five
      adddata['is_stac_game_total'] = sdata.is_stac_game_total
      adddata['is_stac_sets_one'] = sdata.is_stac_sets_one
      adddata['is_stac_sets_two'] = sdata.is_stac_sets_two
      adddata['is_stac_sets_three'] = sdata.is_stac_sets_three
      adddata['is_stac_sets_four'] = sdata.is_stac_sets_four
      adddata['is_stac_sets_five'] = sdata.is_stac_sets_five
      adddata['is_stac_sets_total'] = sdata.is_stac_sets_total
    }

   
    let statusStr = "UPDATE " + process.env.SCHEMA + ".performance_sport_master SET sport_id='" + adddata.sport_id + "', is_event='" + adddata.is_event + "',is_event_stroke='" + adddata.is_event_stroke + "',is_event_distance='" + adddata.is_event_distance + "',is_event_dicipline='" + adddata.is_event_dicipline + "',event_type='" + adddata.event_type + "',is_match_no='" + adddata.is_match_no + "',is_match_level='" + adddata.is_match_level + "',is_participant_one_logo='" + adddata.is_participant_one_logo + "',is_participant_one='" + adddata.is_participant_one + "',is_participant_one_score='" + adddata.is_participant_one_score + "',is_participant_one_game_one='" + adddata.is_participant_one_game_one + "',is_participant_one_game_two='" + adddata.is_participant_one_game_two + "',is_participant_one_game_three='" + adddata.is_participant_one_game_three + "',is_participant_one_game_four='" + adddata.is_participant_one_game_four + "',is_participant_one_game_five='" + adddata.is_participant_one_game_five + "',is_participant_one_game_total='" + adddata.is_participant_one_game_total + "',is_participant_one_sets_one='" + adddata.is_participant_one_sets_one + "',is_participant_one_sets_two='" + adddata.is_participant_one_sets_two + "',is_participant_one_sets_three='" + adddata.is_participant_one_sets_three + "',is_participant_one_sets_four='" + adddata.is_participant_one_sets_four + "',is_participant_one_sets_five='" + adddata.is_participant_one_sets_five + "',is_participant_one_sets_total='" + adddata.is_participant_one_sets_total + "',is_participant_one_description= '"+adddata.is_participant_one_description+"',is_participant_two_log='" + adddata.is_participant_two_log + "',is_participant_two='" + adddata.is_participant_two + "',is_participant_two_score='" + adddata.is_participant_two_score + "',is_participant_two_game_one='" + adddata.is_participant_two_game_one + "',is_participant_two_game_two='" + adddata.is_participant_two_game_two + "',is_participant_two_game_three='" + adddata.is_participant_two_game_three + "',is_participant_two_game_four='" + adddata.is_participant_two_game_four + "',is_participant_two_game_five='" + adddata.is_participant_two_game_five + "',is_participant_two_game_total='" + adddata.is_participant_two_game_total + "',is_participant_two_description= '"+adddata.is_participant_two_description+"',is_participant_two_sets_one='" + adddata.is_participant_two_sets_one + "',is_participant_two_sets_two='" + adddata.is_participant_two_sets_two + "',is_participant_two_sets_three='" + adddata.is_participant_two_sets_three + "',is_participant_two_sets_four='" + adddata.is_participant_two_sets_four + "',is_participant_two_sets_five='" + adddata.is_participant_two_sets_five + "',is_participant_two_sets_total='" + adddata.is_participant_two_sets_total + "',is_team_name_one='" + adddata.is_team_name_one + "',is_team_one_logo='" + adddata.is_team_one_logo + "',is_team_one_score='" + adddata.is_team_one_score + "',is_team_one_description='" + adddata.is_team_one_description + "',is_team_one_game_one='" + adddata.is_team_one_game_one + "',is_team_one_game_two='" + adddata.is_team_one_game_two + "',is_team_one_game_three='" + adddata.is_team_one_game_three + "',is_team_one_game_four='" + adddata.is_team_one_game_four + "',is_team_one_game_five='" + adddata.is_team_one_game_five + "',is_team_one_game_total='" + adddata.is_team_one_game_total + "',is_team_one_sets_one='" + adddata.is_team_one_sets_one + "',is_team_one_sets_two='" + adddata.is_team_one_sets_two + "',is_team_one_sets_three='" + adddata.is_team_one_sets_three + "',is_team_one_sets_four='" + adddata.is_team_one_sets_four + "',is_team_one_sets_five='" + adddata.is_team_one_sets_five + "',is_team_one_sets_total='" + adddata.is_team_one_sets_total + "',is_team_two_name='" + adddata.is_team_two_name + "',is_team_two_logo='" + adddata.is_team_two_logo + "',is_team_two_score='" + adddata.is_team_two_score + "',is_team_two_description='" + adddata.is_team_two_description + "',is_team_two_game_one='" + adddata.is_team_two_game_one + "',is_team_two_game_two='" + adddata.is_team_two_game_two + "',is_team_two_game_three='" + adddata.is_team_two_game_three + "',is_team_two_game_four='" + adddata.is_team_two_game_four + "',is_team_two_game_five='" + adddata.is_team_two_game_five + "',is_team_two_game_total='" + adddata.is_team_two_game_total + "',is_team_two_sets_one='" + adddata.is_team_two_sets_one + "',is_team_two_sets_two='" + adddata.is_team_two_sets_two + "',is_team_two_sets_three='" + adddata.is_team_two_sets_three + "',is_team_two_sets_four='" + adddata.is_team_two_sets_four + "',is_team_two_sets_five='" + adddata.is_team_two_sets_five + "',is_team_two_sets_total='" + adddata.is_team_two_sets_total + "',is_team_finel_result='" + adddata.is_team_finel_result + "',is_team_finel_score='" + adddata.is_team_finel_score + "',is_win_team='" + adddata.is_win_team + "',is_level='" + adddata.is_level + "',is_level_timeing='" + adddata.is_level_timeing + "',is_level_dicipline='" + adddata.is_level_dicipline + "',is_level_parameter='" + adddata.is_level_parameter + "',is_level_value='" + adddata.is_level_value + "',is_level_point='" + adddata.is_level_point + "',is_level_position='" + adddata.is_level_position + "',is_statistic_name='" + adddata.is_statistic_name + "',is_statistic_logo='" + adddata.is_statistic_logo + "',is_statistic_type='" + adddata.is_statistic_type + "',is_statistic_val='" + adddata.is_statistic_val + "',is_stac_game_one='" + adddata.is_stac_game_one + "',is_stac_game_two='" + adddata.is_stac_game_two + "',is_stac_game_three='" + adddata.is_stac_game_three + "',is_stac_game_four='" + adddata.is_stac_game_four + "',is_stac_game_five='" + adddata.is_stac_game_five + "',is_stac_game_total='" + adddata.is_stac_game_total + "',is_stac_sets_one='" + adddata.is_stac_sets_one + "',is_stac_sets_two='" + adddata.is_stac_sets_two + "',is_stac_sets_three='" + adddata.is_stac_sets_three + "',is_stac_sets_four='" + adddata.is_stac_sets_four + "',is_stac_sets_five='" + adddata.is_stac_sets_five + "',is_stac_sets_total='" + adddata.is_stac_sets_total + "',is_subsport_id = "+adddata.is_subsport_id+",is_subsport_game_one = '"+adddata.is_subsport_game_one+"',is_subsport_game_two = '"+adddata.is_subsport_game_two+"',is_subsport_game_three = '"+adddata.is_subsport_game_three+"',is_subsport_game_four = '"+adddata.is_subsport_game_four+"',is_subsport_game_five = '"+adddata.is_subsport_game_five+"',is_subsport_game_total = '"+adddata.is_subsport_game_total+"',is_subsport_sets_one = '"+adddata.is_subsport_sets_one+"',is_subsport_sets_two = '"+adddata.is_subsport_sets_two+"',is_subsport_sets_three = '"+adddata.is_subsport_sets_three+"',is_subsport_sets_four = '"+adddata.is_subsport_sets_four+"',is_subsport_sets_five = '"+adddata.is_subsport_sets_five+"',is_subsport_sets_total = '"+adddata.is_subsport_sets_total+"',updated_at=now() WHERE id=" + adddata.id + "";

    console.log("update statusStr.............:");
    console.log(statusStr);

    await db.query(statusStr);
    return true;
  } catch (err) {

    console.log("update err:");
    console.log(err);

    return false;
  }
}

const performancelist = async (req, res) => {
  let result = {};
  try {
    let listStr = "SELECT ps.*,s.sports_name,sp.sub_sports_name FROM performance_sport_master as ps LEFT join sports as s on ps.sport_id = s.id LEFT join sub_sports as sp on ps.is_subsport_id = sp.sub_sports_id where ps.status = 1 ORDER BY id DESC";

    let dataResult = await db.query(listStr);
    result = dataResult.rows;
  } catch (err) {
    console.log(err);
    result = {};
  }
  return result;
}

const performancelist_byid = async (req, res) => { 
  let result = {};
  try {
    let listbyStr = "SELECT ps.*,s.sports_name ,sp.sub_sports_name FROM performance_sport_master as ps LEFT join sports as s on ps.sport_id = s.id LEFT join sub_sports as sp on ps.is_subsport_id = sp.sub_sports_id where ps.status = 1 and ps.id = " + req.body.id + "";
    console.log('listbyStr');
    console.log(listbyStr);
    let dataResult = await db.query(listbyStr);
    result = dataResult.rows;
  } catch (err) {
    result = {};
  }
  return result;
}
const deleteperformancesport = async (req, res) => {
  try {
    console.log("123333");
    let statusStr = "UPDATE performance_sport_master SET status= 2 ,updated_at=now() WHERE id=" + req.body.id + "";

    console.log("statusStr....");
    console.log(statusStr);
    await db.query(statusStr);
    return true;
  } catch (err) {
    console.log(err)
    return false;
  }
}



const addindividualperformance = async (req, res) => {
  try {

    console.log("demo");
    await db.query(`BEGIN;`);
    const adddata = [];

    var insertteventmaster = '';
    var inserttmatchmaster = '';

    if (req.body.sport) {

      let sportdata = req.body.sport;
      adddata['sport_id'] = sportdata;
    }



    if (req.body.tournament) {
      let tourdata = req.body.tournament;
      adddata['tournament'] = tourdata;
    }
    if (req.body.tournament_other) {
      let tourdata_other = req.body.tournament_other;
      adddata['tournament_other'] = tourdata_other;
    }

    if (req.body.date) {
      let date = req.body.date;
      adddata['date'] = date;
    }

    if (req.body.venue) {
      let venue = req.body.venue;
      adddata['venue'] = venue;
    }

    if (req.body.city) {
      let city = req.body.city;
      adddata['city'] = city;
    }
    if (req.body.state) {
      let state = req.body.state;
      adddata['state'] = state;
    }
    if (req.body.country) {
      let country = req.body.country;
      adddata['country'] = country;
    }
    if(req.body.subscriper_id){
      let subscriper_id = req.body.subscriper_id;
      adddata['subscriber_id'] = subscriper_id;
    }

    if (req.body.tournament == 0) {

      adddata['tournament_other'] = req.body.tournament_other;
    } else {
      adddata['tournament_other'] = null;
    }

    if(req.body.venue == 0){
      
      adddata['venue_other'] = req.body.venue_other;
    }else{

      adddata['venue_other'] = null;
    }

    let inserttmaster = await db.query(`INSERT INTO individual_performance(sport_id,turnament_name,tournament_other,venue_other,tournament_date,venue_id, city_id,state_id,country_id,subscriper_id,crated_at,status )VALUES (${adddata.sport_id},'${adddata.tournament}','${adddata.tournament_other}','${adddata.venue_other}','${adddata.date}',${adddata.venue},${adddata.city},${adddata.state},${adddata.country},${adddata.subscriber_id},now(),1)RETURNING id;`);

    await db.query(`COMMIT`);
  
    if (inserttmaster.rowCount) {
      //console.log('inserttmaster[[[[[[[[[[[[[[[[[[[[[[[[[[[');
      // console.log(inserttmaster.rowCount);
      let insertedID = inserttmaster.rows[0].id;

      var evnetinfo = req.body.event_data;
      //console.log('req.body.event_data{{{{{{{{{{{{{{{{{{{{{{{{}}}}}');
      //console.log(evnetinfo);
      if (evnetinfo) {
        //console.log('req.body.event{{{{{{{{{{{{{{{{{{{{{{{{}}}}}');
        //console.log(evnetinfo);
        //console.log('demo2');

        if (Array.isArray(evnetinfo)) {

          let eventdata = evnetinfo;
          console.log('eventdata{{{{{{{{{{{{{{{{{{{{{{{{');
          console.log(eventdata);

          for (var i = 0; i < eventdata.length; i++) {

            adddata['event_name'] = eventdata[i].event_name
            adddata['stroke'] = eventdata[i].stroke
            adddata['distance'] = eventdata[i].distance
            adddata['discipline'] = eventdata[i].discipline
            adddata['event_type'] = eventdata[i].event_type

            var insertteventmaster = `INSERT INTO individual_event( 
                         event_name,master_id,stroke,distance,discipline,event_type,created_at,status ) VALUES('${adddata.event_name}',${insertedID},'${adddata.stroke}','${adddata.distance}','${adddata.discipline}','${adddata.event_type}',now(),1) RETURNING id;`;

            if (insertteventmaster) {

              var data = await db.query(insertteventmaster);

              //console.log('data==================+++++++++++++');
              //console.log(data);
            }

            if (data.rowCount && data.rowCount > 0) {
              var eventid = data.rows[0].id;
              //console.log('eventid888888888888888888888888888');
              //console.log(eventid);
              var match = eventdata[i].match_level_data;
              //console.log('eventdata');
              //console.log(eventdata[i]);
              console.log('match9999999999999999999999999999');
              console.log(match);
              //var statistic = req.body.event[i]['statistic'];

              if (match) {
                if (Array.isArray(match)) {
                  let matchdata = match;
                 // console.log('match..............');
                 // console.log(matchdata);
                  for (var j = 0; j < matchdata.length; j++) {

                  	

                    
				    adddata['participant_one_logo'] = matchdata[j].participant_one_logo
				    adddata['participant_one'] = matchdata[j].participant_one
				    adddata['participant_one_score'] = matchdata[j].participant_one_score
				    adddata['participant_one_game_one'] = matchdata[j].participant_one_game_one
				    adddata['participant_one_game_two'] = matchdata[j].participant_one_game_two
				    adddata['participant_one_game_three'] = matchdata[j].participant_one_game_three
				    adddata['participant_one_game_four'] = matchdata[j].participant_one_game_four
				    adddata['participant_one_game_five'] = matchdata[j].participant_one_game_five
				    adddata['participant_one_game_total'] = matchdata[j].participant_one_game_total
				    adddata['participant_one_sets_one'] = matchdata[j].participant_one_sets_one
				      //adddata['match_no'] = req.body.match_no 
				    adddata['participant_one_sets_two'] = matchdata[j].participant_one_sets_two
				    adddata['participant_one_sets_three'] = matchdata[j].participant_one_sets_three
				    adddata['participant_one_sets_four'] = matchdata[j].participant_one_sets_four
				    adddata['participant_one_sets_five'] = matchdata[j].participant_one_sets_five
				    adddata['participant_one_sets_total'] = matchdata[j].participant_one_sets_total
				    adddata['participant_two_log'] = matchdata[j].participant_two_log
				    adddata['participant_two'] = matchdata[j].participant_two
				    adddata['participant_two_score'] = matchdata[j].participant_two_score
				    adddata['participant_two_game_one'] = matchdata[j].participant_two_game_one
				    adddata['participant_two_game_two'] = matchdata[j].participant_two_game_two
				    adddata['participant_two_game_three'] = matchdata[j].participant_two_game_three
				    adddata['participant_two_game_four'] = matchdata[j].participant_two_game_four
				    adddata['participant_two_game_five'] = matchdata[j].participant_two_game_five
				    adddata['participant_two_game_total'] = matchdata[j].participant_two_game_total
				    adddata['participant_two_sets_one'] = matchdata[j].participant_two_sets_one
				    adddata['participant_two_sets_two'] = matchdata[j].participant_two_sets_two
				    adddata['participant_two_sets_three'] = matchdata[j].participant_two_sets_three
				    adddata['participant_two_sets_four'] = matchdata[j].participant_two_sets_four
				    adddata['participant_two_sets_five'] = matchdata[j].participant_two_sets_five
				    adddata['participant_two_sets_total'] = matchdata[j].participant_two_sets_total
				    adddata['team_name_one'] = matchdata[j].team_name_one
				    adddata['team_one_logo'] = matchdata[j].team_one_logo
				    adddata['team_one_score'] = matchdata[j].team_one_score
				    adddata['team_one_description'] = matchdata[j].team_one_description
				    adddata['team_one_game_one'] = matchdata[j].team_one_game_one
				    adddata['team_one_game_two'] = matchdata[j].team_one_game_two
				    adddata['team_one_game_three'] = matchdata[j].team_one_game_three
				    adddata['team_one_game_four'] = matchdata[j].team_one_game_four
				    adddata['team_one_game_five'] = matchdata[j].team_one_game_five
				    adddata['team_one_game_total'] = matchdata[j].team_one_game_total
				    adddata['team_one_sets_one'] = matchdata[j].team_one_sets_one
				    adddata['team_one_sets_two'] = matchdata[j].team_one_sets_two
				    adddata['team_one_sets_three'] = matchdata[j].team_one_sets_three
				    adddata['team_one_sets_four'] = matchdata[j].team_one_sets_four
				    adddata['team_one_sets_five'] = matchdata[j].team_one_sets_five
				    adddata['team_one_sets_total'] = matchdata[j].team_one_sets_total
				    adddata['team_two_name'] = matchdata[j].team_two_name
				    adddata['team_two_logo'] = matchdata[j].team_two_logo
				    adddata['team_two_score'] = matchdata[j].team_two_score
				    adddata['team_two_description'] = matchdata[j].team_two_description
				    adddata['team_two_game_one'] = matchdata[j].team_two_game_one
				    adddata['team_two_game_two'] = matchdata[j].team_two_game_two
				    adddata['team_two_game_three'] = matchdata[j].team_two_game_three
				    adddata['team_two_game_four'] = matchdata[j].team_two_game_four
				    adddata['team_two_game_five'] = matchdata[j].team_two_game_five
				    adddata['team_two_game_total'] = matchdata[j].team_two_game_total
				    adddata['team_two_sets_one'] = matchdata[j].team_two_sets_one
				    adddata['team_two_sets_two'] = matchdata[j].team_two_sets_two
				    adddata['team_two_sets_three'] = matchdata[j].team_two_sets_three
				    adddata['team_two_sets_four'] = matchdata[j].team_two_sets_four
				    adddata['team_two_sets_total'] = matchdata[j].team_two_sets_total
				    adddata['team_finel_result'] = matchdata[j].team_finel_result
				    adddata['team_finel_score'] = matchdata[j].team_finel_score
				    adddata['win_team'] = matchdata[j].win_team
				    adddata['level'] = matchdata[j].level
            adddata['level_timeing'] = matchdata[j].level_timeing
            adddata['level_discipline'] = matchdata[j].level_discipline
            adddata['level_parameter'] = matchdata[j].level_parameter
            adddata['level_value'] = matchdata[j].level_value
            adddata['level_point'] = matchdata[j].level_point
            adddata['level_position'] = matchdata[j].level_position
					  adddata['match_no'] = matchdata[j].match_no
				    adddata['match_level'] = matchdata[j].match_level

                    
                    // var bannerPath = 'images/profile/';
                    // var logo = adddata.logo;

                    // var logo_new = "";

                    // if (logo && typeof logo !=="undefined" && logo.length > 0) {
                    //   var logo = helper.uploadBase64(logo[0], bannerPath);
                    //   logo_new = logo.path;
                    // }
                    // else{
                    participant_one_logo = null;
                    //}

                    
                    // var logo_one = matchdata[j].participant_logo;

                    // var logo_new_one = "";

                    // if (logo_one && typeof logo_one !=="undefined" && logo_one.length > 0) {
                    //   var logo_one = helper.uploadBase64(logo_one[0], bannerPath);
                    //   logo_new_one = logo_one.path;
                    // }
                    // else{
                      participant_two_log = null;
                      //}

                      
                    // var logo_two = matchdata[j].participant_logo_one;

                    // var logo_new_two = "";

                    // if (logo_two && typeof logo_two !=="undefined" && logo_two.length > 0) {
                    //   var logo_two = helper.uploadBase64(logo_two[0], bannerPath);
                    //   logo_new_two = logo_two.path;
                    // }
                    // else{
                      logo_new_two = null;
                    //}

                    team_one_logo = null;
                    team_two_logo= null;

                    // var inserttmatchmaster = `INSERT INTO individual_match_level( 
                    //       level,master_id,event_id,timing,discipline,parameter,level_value,point,position,match_no,match_level,team_name, no_team,no_participant,participant,logo,score,fine_result,finel_score,game_one,game_two,game_three,game_four,game_five,game_six,sets_one,sets_two,sets_three,sets_four,sets_five,sets_six,participant_logo,pt_game_one,pt_game_two,pt_game_three,pt_game_four,pt_game_five,pt_game_six,pt_sets_one,pt_sets_two,pt_sets_three,pt_sets_four,pt_sets_five,pt_sets_six,pt_score,participant_logo_one,team_name_two,team_logo_two,team_score_two,team_description_two,win_team,win_participant,created_at,status )
                    //       VALUES ('${adddata.level}',${insertedID},${eventid},'${adddata.timing}',${adddata.discipline},'${adddata.parameter}',${adddata.level_value},${adddata.point},${adddata.position},${adddata.match_no}, '${adddata.match_level}','${adddata.team_name}',${adddata.no_team},${adddata.no_participant},'${adddata.participant}','${logo_new}',${adddata.score},'${adddata.fine_result}','${adddata.finel_score}','${adddata.game_one}','${adddata.game_two}','${adddata.game_three}','${adddata.game_four}','${adddata.game_five}','${adddata.game_six}','${adddata.sets_one}','${adddata.sets_two}','${adddata.sets_three}','${adddata.sets_four}','${adddata.sets_five}','${adddata.sets_six}','${logo_new_one}','${adddata.pt_game_one}','${adddata.pt_game_two}','${adddata.pt_game_three}','${adddata.pt_game_four}','${adddata.pt_game_five}','${adddata.pt_game_six}','${adddata.pt_sets_one}','${adddata.pt_sets_two}','${adddata.pt_sets_three}','${adddata.pt_sets_four}','${adddata.pt_sets_five}','${adddata.pt_sets_six}','${adddata.pt_score}','${logo_new_two}','${adddata.team_name_two}','${adddata.team_logo_two}','${adddata.team_score_two}','${adddata.team_description_two}','${adddata.win_team}','${adddata.win_participant}',now(),1)RETURNING id;`; 


                   var inserttmatchmaster = `INSERT INTO performance_sport_master(
                    sport_id,master_id,event_id,match_no,match_level,participant_one_logo,participant_one,participant_one_score,participant_one_game_one,participant_one_game_two,participant_one_game_three,participant_one_game_four,participant_one_game_five,participant_one_game_total,participant_one_sets_one,participant_one_sets_two,participant_one_sets_three,participant_one_sets_four,participant_one_sets_five,participant_one_sets_total,participant_two_log,participant_two,participant_two_score,participant_two_game_one,participant_two_game_two,participant_two_game_three,participant_two_game_four,participant_two_game_five,participant_two_game_total,participant_two_sets_one,participant_two_sets_two,participant_two_sets_three,participant_two_sets_four,participant_two_sets_five,participant_two_sets_total,team_name_one,team_one_logo,team_one_score,team_one_description,team_one_game_one,team_one_game_two,team_one_game_three,team_one_game_four,team_one_game_five,team_one_game_total,team_one_sets_one,team_one_sets_two,team_one_sets_three,team_one_sets_four,team_one_sets_five,team_one_sets_total,team_two_name,team_two_logo,team_two_score,team_two_description,team_two_game_one,team_two_game_two,team_two_game_three,team_two_game_four,team_two_game_five,team_two_game_total,team_two_sets_one,team_two_sets_two,team_two_sets_three,team_two_sets_four,team_two_sets_total,team_finel_result,team_finel_score,win_team,level,level_timeing,level_parameter,level_value,level_point,level_discipline,created_at,status )
                    VALUES (${adddata.sport_id},${insertedID},${eventid},${adddata.match_no}, ${adddata.match_level},${participant_one_logo},${adddata.participant_one},${adddata.participant_one_score},${adddata.participant_one_game_one},${adddata.participant_one_game_two},${adddata.participant_one_game_three},${adddata.participant_one_game_four},${adddata.participant_one_game_five},${adddata.participant_one_game_total},${adddata.participant_one_sets_one},${adddata.participant_one_sets_two},${adddata.participant_one_sets_three},${adddata.participant_one_sets_four},${adddata.participant_one_sets_five},${adddata.participant_one_sets_total},'${participant_two_logo}',${adddata.participant_two},${adddata.participant_two_score},${adddata.participant_two_game_one},${adddata.participant_two_game_two},${adddata.participant_two_game_three},${adddata.participant_two_game_four},${adddata.participant_two_game_five},${adddata.participant_two_game_total},${adddata.participant_two_sets_one},${adddata.participant_two_sets_two},${adddata.participant_two_sets_three},${adddata.participant_two_sets_four},${adddata.participant_two_sets_five},${adddata.participant_two_sets_total},${adddata.team_name_one},${team_one_logo},${adddata.team_one_score},${adddata.team_one_description},${adddata.team_one_game_one},${adddata.team_one_game_two},${adddata.team_one_game_three},${adddata.team_one_game_four},${adddata.team_one_game_five},${adddata.team_one_game_total},${adddata.team_one_sets_one},${adddata.team_one_sets_two},${adddata.team_one_sets_three},${adddata.team_one_sets_four},${adddata.team_one_sets_five},${adddata.team_one_sets_total},${adddata.team_two_name},${team_two_logo},${adddata.team_two_score},${adddata.team_two_description},${adddata.team_two_game_one},${adddata.team_two_game_two},${adddata.team_two_game_three},${adddata.team_two_game_four},${adddata.team_two_game_five},${adddata.team_two_game_total},${adddata.team_two_sets_one},${adddata.team_two_sets_two},${adddata.team_two_sets_three},${adddata.team_two_sets_four},${adddata.team_two_sets_total},${adddata.team_finel_result},${adddata.team_finel_score},${adddata.win_team},${adddata.level},'${adddata.level_timeing}',${adddata.level_parameter},${adddata.level_value},${adddata.level_point},${adddata.level_discipline},now(), 1);`;
                    //console.log('inserttmatchmasterrowCountrowCountrowCountrowCount++++++++++++++++++');
                    //console.log(inserttmatchmaster.rowCount);
                    if (inserttmatchmaster) {

                      var matchinfo = await db.query(inserttmatchmaster);
                      if (matchinfo.rowCount && matchinfo.rowCount > 0) {

                        var matchid = matchinfo.rows[0].id
                        var statistic = matchdata[j]['statistic_data'];
                        console.log('statistic00000000000000000000000000');
                        console.log(statistic);
                        if (Array.isArray(statistic)) {
                          //var insertstatistic = '';
                          var sdata = statistic;
                          for (var k = 0; k < sdata.length; k++) {

                          
                            adddata['statistic_name'] = sdata[k].statistic_name
                            adddata['statistic_val'] = sdata[k].statistic_val
                            adddata['stac_game_one'] = sdata[k].stac_game_one
                            adddata['stac_game_two'] = sdata[k].stac_game_two
                            adddata['stac_game_three'] = sdata[k].stac_game_three
                            adddata['stac_game_four'] = sdata[k].stac_game_four
                            adddata['stac_game_five'] = sdata[k].stac_game_five
                            adddata['stac_game_six'] = sdata[k].stac_game_six
                            adddata['stac_sets_one'] = sdata[k].stac_sets_one
                            adddata['stac_sets_two'] = sdata[k].stac_sets_two
                            adddata['stac_sets_three'] = sdata[k].stac_sets_three
                            adddata['stac_sets_four'] = sdata[k].stac_sets_four
                            adddata['stac_sets_five'] = sdata[k].stac_sets_five
                            adddata['stac_sets_six'] = sdata[k].stac_sets_six
                            adddata['statistic_type'] = sdata[k].statistic_type
                            adddata['statistic_logo'] = sdata[k].statistic_logo
                            adddata['stac_sets_total'] = sdata[k].stac_sets_total
                            statistic_logo = null;
  
                            var insertstatistic = `INSERT INTO individual_statistic(statistic_name,event_id,ml_id,statistic_val, stac_game_one, stac_game_two,stac_game_three,stac_game_four,stac_game_five,stac_game_six,stac_sets_one,stac_sets_two,stac_sets_three,stac_sets_four,stac_sets_five,stac_sets_six,statistic_type,statistic_logo,stac_sets_total,created_at,status )VALUES ('${adddata.statistic_name}',${eventid},${matchid},'${adddata.statistic_val}','${adddata.stac_game_one}','${adddata.stac_game_two}','${adddata.stac_game_three}', '${adddata.stac_game_four}','${adddata.stac_game_five}','${adddata.stac_game_six}','${adddata.stac_sets_one}','${adddata.stac_sets_two}','${adddata.stac_sets_three}','${adddata.stac_sets_four}' ,'${adddata.stac_sets_five}','${adddata.stac_sets_six}','${adddata.statistic_type}','${statistic_logo}','${adddata.stac_sets_total}',now(),1);`;
                            //console.log('insertstatistic.....................................');
                            //console.log(insertstatistic);
  
                            if (insertstatistic) {
                              await db.query(insertstatistic)
                            }
                          }
                        }
  
                      }
                    }

                    
                    //await db.query(`COMMIT`);

                  }


                }
              }
            }

          }
        } else {
          /*let eventdata = req.body.event;

          adddata['event_name'] = eventdata.event_name
          adddata['stroke'] = eventdata.stroke
          adddata['distance'] = eventdata.distance
          adddata['discipline'] = eventdata.discipline
          adddata['event_type'] = eventdata.event_type

          insertteventmaster += `INSERT INTO individual_event( 
                     event_name,master_id,stroke,distance,discipline,event_type,created_at,status ) VALUES('${adddata.event_name}',${insertedID},'${adddata.stroke}','${adddata.distance}','${adddata.discipline}','${adddata.event_type}',now(),1)RETURNING id;`;

          if (insertteventmaster) {

            var data = await db.query(insertteventmaster);

          }

          await db.query(`COMMIT`);*/
        }
      }
    }

return true;
  } catch (err) {

    console.log(err)
    return false;
  }
}



const individual_performancebyid = async (req, res) => {
  let result = {};
  try {
    let listStr = "SELECT ip.*,s.sports_name ,v.venue_name,c.city_name,st.state_name,ct.name FROM individual_performance as ip LEFT join venue as v on v.id = ip.venue_id LEFT join city as c on c.id = ip.city_id LEFT join state as st on st.id = ip.state_id LEFT join country as ct on ct.id = ip.country_id LEFT join sports as s on ip.sport_id = s.id where ip.status = 1 and ip.subscriber_id = " + req.body.id + "";
    console.log('listbyStr');
    console.log(listStr);
    let dataResult = await db.query(listStr);
    result = dataResult.rows;
  } catch (err) {
    result = {};
  }
  return result;
}


const performanceDelete = async(req,res)=>{
  try {
    
    let statusStr = "UPDATE individual_performance SET status= 2 ,updated_at=now() WHERE id=" + req.body.id + "";

    console.log("statusStr....");
    console.log(statusStr);
    await db.query(statusStr);
    return true;
  } catch (err) {
    console.log(err)
    return false;
  }
}




const performanceUpdate = async (req, res) => {
  try {

    console.log("demo");
    await db.query(`BEGIN;`);
    const adddata = [];

    var insertteventmaster = '';
    var inserttmatchmaster = '';

    if (req.body.sport) {

      let sportdata = req.body.sport;
      adddata['sport_id'] = sportdata;
    }

    if (req.body.tournament) {
      let tourdata = req.body.tournament;
      adddata['tournament'] = tourdata;
    }
    if (req.body.tournament_other) {
      let tourdata_other = req.body.tournament_other;
      adddata['tournament_other'] = tourdata_other;
    }

    if (req.body.date) {
      let date = req.body.date;
      adddata['date'] = date;
    }

    if (req.body.venue) {
      let venue = req.body.venue;
      adddata['venue'] = venue;
    }

    if (req.body.city) {
      let city = req.body.city;
      adddata['city'] = city;
    }
    if (req.body.state) {
      let state = req.body.state;
      adddata['state'] = state;
    }
    if (req.body.country) {
      let country = req.body.country;
      adddata['country'] = country;
    }
    if(req.body.subscriper_id){
      let subscriper_id = req.body.subscriper_id;
      adddata['subscriber_id'] = subscriper_id;
    }

    if (req.body.tournament == 0) {

      adddata['tournament_other'] = req.body.tournament_other;
    } else {
      adddata['tournament_other'] = null;
    }
   
     //let updatemaster = await db.query(`select id from individual_performance where id =${req.body.id}`);
    if(req.body.id !== 'undefind' && req.body.id !== ""){
      var inserttmaster = await db.query(`UPDATE individual_performance set sport_id=${adddata.sport_id},turnament_name='${adddata.tournament}',tournament_other='${adddata.tournament_other}',tournament_date='${adddata.date}',venue_id=${adddata.venue}, city_id=${adddata.city},state_id=${adddata.state},country_id=${adddata.country},subscriper_id=${adddata.subscriber_id},updated_at=now() WHERE id= ${req.body.id}`);
    }
    else{
    
    var inserttmaster = await db.query(`INSERT INTO individual_performance(sport_id,turnament_name,tournament_other,tournament_date,venue_id, city_id,state_id,country_id,subscriper_id,created_at,status )VALUES (${adddata.sport_id},'${adddata.tournament}','${adddata.tournament_other}','${adddata.date}',${adddata.venue},${adddata.city},${adddata.state},${adddata.country},${adddata.subscriber_id},now(),1)RETURNING id;`);
    }
    await db.query(`COMMIT`);

    if (inserttmaster.rowCount) {
      //console.log('inserttmaster[[[[[[[[[[[[[[[[[[[[[[[[[[[');
      // console.log(inserttmaster.rowCount);
      let insertedID = inserttmaster.rows[0].id;

      var evnetinfo = req.body.event_data;
      //console.log('req.body.event_data{{{{{{{{{{{{{{{{{{{{{{{{}}}}}');
      //console.log(evnetinfo);
      if (evnetinfo) {
        //console.log('req.body.event{{{{{{{{{{{{{{{{{{{{{{{{}}}}}');
        //console.log(evnetinfo);
        //console.log('demo2');

        if (Array.isArray(evnetinfo)) {

          let eventdata = evnetinfo;
          console.log('eventdata{{{{{{{{{{{{{{{{{{{{{{{{');
          console.log(eventdata);

          for (var i = 0; i < eventdata.length; i++) {

            adddata['event_name'] = eventdata[i].event_name
            adddata['stroke'] = eventdata[i].stroke
            adddata['distance'] = eventdata[i].distance
            adddata['discipline'] = eventdata[i].discipline
            adddata['event_type'] = eventdata[i].event_type
            adddata['event_id'] = eventdata[i].event_id

            if(adddata.event_id !=="" && adddata.event_id !=="undefind"){

              var insertteventmaster = await db.query(`UPDATE individual_event set event_name=${adddata.event_name},master_id='${adddata.insertedID}',stroke='${adddata.stroke}',distance='${adddata.distance}',discipline=${adddata.discipline}, event_type=${adddata.event_type},updated_at=now() WHERE id= ${adddata.event_id}`);
            
            }else{

            var insertteventmaster = `INSERT INTO individual_event( 
                         event_name,master_id,stroke,distance,discipline,event_type,created_at,status ) VALUES('${adddata.event_name}',${insertedID},'${adddata.stroke}','${adddata.distance}','${adddata.discipline}','${adddata.event_type}',now(),1) RETURNING id;`;
            }
            if (insertteventmaster) {

              var data = await db.query(insertteventmaster);

              //console.log('data==================+++++++++++++');
              //console.log(data);
            }

            if (data.rowCount && data.rowCount > 0) {
              var eventid = data.rows[0].id;
              //console.log('eventid888888888888888888888888888');
              //console.log(eventid);
              var match = eventdata[i].match_level_data;
              //console.log('eventdata');
              //console.log(eventdata[i]);
              console.log('match9999999999999999999999999999');
              console.log(match);
              //var statistic = req.body.event[i]['statistic'];

              if (match) {
                if (Array.isArray(match)) {
                  let matchdata = match;
                 // console.log('match..............');
                 // console.log(matchdata);
                  for (var j = 0; j < matchdata.length; j++) {

                    adddata['level'] = matchdata[j].level
                    adddata['timing'] = matchdata[j].timing
                    adddata['discipline'] = matchdata[j].discipline
                    adddata['parameter'] = matchdata[j].parameter
                    adddata['level_value'] = matchdata[j].level_value
                    adddata['point'] = matchdata[j].point
                    adddata['position'] = matchdata[j].position

                    adddata['match_no'] = matchdata[j].match_no
                    adddata['match_level'] = matchdata[j].match_level
                    adddata['team_name'] = matchdata[j].team_name
                    adddata['team_logo'] = matchdata[j].team_logo
                    adddata['no_team'] = matchdata[j].no_team
                    adddata['no_participant'] = matchdata[j].no_participant
                    adddata['participant'] = matchdata[j].participant
                    adddata['logo'] = matchdata[j].logo
                    adddata['score'] = matchdata[j].score
                    adddata['description'] = matchdata[j].description
                    adddata['fine_result'] = matchdata[j].fine_result
                    adddata['finel_score'] = matchdata[j].finel_score

                    adddata['game_one'] = matchdata[j].game_one
                    adddata['game_two'] = matchdata[j].game_two
                    adddata['game_three'] = matchdata[j].game_three
                    adddata['game_four'] = matchdata[j].game_four
                    adddata['game_five'] = matchdata[j].game_five
                    adddata['game_six'] = matchdata[j].game_six
                    adddata['sets_one'] = matchdata[j].sets_one
                    adddata['sets_two'] = matchdata[j].sets_two
                    adddata['sets_three'] = matchdata[j].sets_three
                    adddata['sets_four'] = matchdata[j].sets_four
                    adddata['sets_five'] = matchdata[j].sets_five
                    adddata['sets_six'] = matchdata[j].sets_six

                    adddata['participant_logo'] = matchdata[j].participant_logo
                    
                    adddata['pt_game_one'] = matchdata[j].pt_game_one
                    adddata['pt_game_two'] = matchdata[j].pt_game_two
                    adddata['pt_game_three'] = matchdata[j].pt_game_three
                    adddata['pt_game_four'] = matchdata[j].pt_game_four
                    adddata['pt_game_five'] = matchdata[j].pt_game_five
                    adddata['pt_game_six'] = matchdata[j].pt_game_six
                    adddata['pt_sets_one'] = matchdata[j].pt_sets_one
                    adddata['pt_sets_two'] = matchdata[j].pt_sets_two
                    adddata['pt_sets_three'] = matchdata[j].pt_sets_three
                    adddata['pt_sets_four'] = matchdata[j].pt_sets_four
                    adddata['pt_sets_five'] = matchdata[j].pt_sets_five
                    adddata['pt_sets_six'] = matchdata[j].pt_sets_six
                    adddata['pt_score'] = matchdata[j].pt_score
                    adddata['participant_logo_one'] = matchdata[j].participant_logo_one
                    adddata['team_name_two'] = matchdata[j].team_name_two
                    adddata['team_logo_two'] = matchdata[j].team_logo_two
                    adddata['team_score_two'] = matchdata[j].team_score_two
                    adddata['team_description_two'] = matchdata[j].team_description_two
                    adddata['win_team'] = matchdata[j].win_team
                    adddata['win_participant'] = matchdata[j].win_participant

                    adddata['match_id'] = matchdata[j].match_id

                    // var bannerPath = 'images/profile/';
                    // var logo = adddata.logo;

                    // var logo_new = "";

                    // if (logo && typeof logo !=="undefined" && logo.length > 0) {
                    //   var logo = helper.uploadBase64(logo[0], bannerPath);
                    //   logo_new = logo.path;
                    // }
                    // else{
                    logo_new = null;
                    //}

                    
                    // var logo_one = matchdata[j].participant_logo;

                    // var logo_new_one = "";

                    // if (logo_one && typeof logo_one !=="undefined" && logo_one.length > 0) {
                    //   var logo_one = helper.uploadBase64(logo_one[0], bannerPath);
                    //   logo_new_one = logo_one.path;
                    // }
                    // else{
                      logo_new_one = null;
                      //}

                      
                    // var logo_two = matchdata[j].participant_logo_one;

                    // var logo_new_two = "";

                    // if (logo_two && typeof logo_two !=="undefined" && logo_two.length > 0) {
                    //   var logo_two = helper.uploadBase64(logo_two[0], bannerPath);
                    //   logo_new_two = logo_two.path;
                    // }
                    // else{
                      logo_new_two = null;
                    //}
                  if(adddata.match_id !== "" && adddata.match_id !==" "){

                    var inserttmatchmaster = `UPDATE individual_match_level SET level='${adddata.level}',master_id=${insertedID},event_id=${eventid},timing='${adddata.timing}',discipline=${adddata.discipline},parameter='${adddata.parameter}',level_value=${adddata.level_value},point=${adddata.point},position=${adddata.position},match_no=${adddata.match_no},match_level='${adddata.match_level}',team_name='${adddata.team_name}', no_team=${adddata.no_team},no_participant=${adddata.no_participant},participant='${adddata.participant}',logo='${logo_new}',score=${adddata.score},fine_result='${adddata.fine_result}',finel_score='${adddata.finel_score}',game_one='${adddata.game_one}',game_two='${adddata.game_two}',game_three='${adddata.game_three}',game_four='${adddata.game_four}',game_five'${adddata.game_five}',game_six='${adddata.game_six}',sets_one='${adddata.sets_one}',sets_two='${adddata.sets_two}',sets_three='${adddata.sets_three}',sets_four='${adddata.sets_four}',sets_five='${adddata.sets_five}',sets_six='${adddata.sets_six}',participant_logo='${logo_new_one}',pt_game_one='${adddata.pt_game_one}',pt_game_two='${adddata.pt_game_two}',pt_game_three='${adddata.pt_game_three}',pt_game_four='${adddata.pt_game_four}',pt_game_five='${adddata.pt_game_five}',pt_game_six='${adddata.pt_game_six}',pt_sets_one='${adddata.pt_sets_one}',pt_sets_two='${adddata.pt_sets_two}',pt_sets_three='${adddata.pt_sets_three}',pt_sets_four='${adddata.pt_sets_four}',pt_sets_five='${adddata.pt_sets_five}',pt_sets_six='${adddata.pt_sets_six}',pt_score='${adddata.pt_score}',participant_logo_one='${logo_new_two}',team_name_two='${adddata.team_name_two}',team_logo_two='${adddata.team_logo_two}',team_score_two='${adddata.team_score_two}',team_description_two='${adddata.team_description_two}',win_team='${adddata.win_team}',win_participant='${adddata.win_participant}',updated_at=now() WHERE id =${adddata.match_id}`;
                      
                  }
                  else{
                    var inserttmatchmaster = `INSERT INTO individual_match_level( 
                          level,master_id,event_id,timing,discipline,parameter,level_value,point,position,match_no,match_level,team_name, no_team,no_participant,participant,logo,score,fine_result,finel_score,game_one,game_two,game_three,game_four,game_five,game_six,sets_one,sets_two,sets_three,sets_four,sets_five,sets_six,participant_logo,pt_game_one,pt_game_two,pt_game_three,pt_game_four,pt_game_five,pt_game_six,pt_sets_one,pt_sets_two,pt_sets_three,pt_sets_four,pt_sets_five,pt_sets_six,pt_score,participant_logo_one,team_name_two,team_logo_two,team_score_two,team_description_two,win_team,win_participant,created_at,status )
                          VALUES ('${adddata.level}',${insertedID},${eventid},'${adddata.timing}',${adddata.discipline},'${adddata.parameter}',${adddata.level_value},${adddata.point},${adddata.position},${adddata.match_no}, '${adddata.match_level}','${adddata.team_name}',${adddata.no_team},${adddata.no_participant},'${adddata.participant}','${logo_new}',${adddata.score},'${adddata.fine_result}','${adddata.finel_score}','${adddata.game_one}','${adddata.game_two}','${adddata.game_three}','${adddata.game_four}','${adddata.game_five}','${adddata.game_six}','${adddata.sets_one}','${adddata.sets_two}','${adddata.sets_three}','${adddata.sets_four}','${adddata.sets_five}','${adddata.sets_six}','${logo_new_one}','${adddata.pt_game_one}','${adddata.pt_game_two}','${adddata.pt_game_three}','${adddata.pt_game_four}','${adddata.pt_game_five}','${adddata.pt_game_six}','${adddata.pt_sets_one}','${adddata.pt_sets_two}','${adddata.pt_sets_three}','${adddata.pt_sets_four}','${adddata.pt_sets_five}','${adddata.pt_sets_six}','${adddata.pt_score}','${logo_new_two}','${adddata.team_name_two}','${adddata.team_logo_two}','${adddata.team_score_two}','${adddata.team_description_two}','${adddata.win_team}','${adddata.win_participant}',now(),1)RETURNING id;`;
                    console.log('inserttmatchmasterrowCountrowCountrowCountrowCount++++++++++++++++++');
                    console.log(inserttmatchmaster.rowCount);
                  }
                    if (inserttmatchmaster) {

                      var matchinfo = await db.query(inserttmatchmaster);
                      if (matchinfo.rowCount && matchinfo.rowCount > 0) {

                        var matchid = matchinfo.rows[0].id
                        var statistic = matchdata[j]['statistic_data'];
                        console.log('statistic00000000000000000000000000');
                        console.log(statistic);
                        if (Array.isArray(statistic)) {
                          //var insertstatistic = '';
                          var sdata = statistic;
                          for (var k = 0; k < sdata.length; k++) {
                            adddata['statistic'] = sdata[k].statistic
                            adddata['statistic_val'] = sdata[k].statistic_val
                            adddata['s_game_one'] = sdata[k].s_game_one
                            adddata['s_game_two'] = sdata[k].s_game_two
                            adddata['s_game_three'] = sdata[k].s_game_three
                            adddata['s_game_four'] = sdata[k].s_game_four
                            adddata['s_game_five'] = sdata[k].s_game_five
                            adddata['s_game_six'] = sdata[k].s_game_six
                            adddata['s_sets_one'] = sdata[k].s_sets_one
                            adddata['s_sets_two'] = sdata[k].s_sets_two
                            adddata['s_sets_three'] = sdata[k].s_sets_three
                            adddata['s_sets_four'] = sdata[k].s_sets_four
                            adddata['s_sets_five'] = sdata[k].s_sets_five
                            adddata['s_sets_six'] = sdata[k].s_sets_six
                            adddata['statistic_type'] = sdata[k].statistic_type
                            adddata['logo'] = sdata[k].logo
                            adddata['total'] = sdata[k].total
                            adddata['statistic_id'] = sdata[k].statistic_id
                            logo = null;
                           if(adddata.statistic_id !=="" && adddata.statistic_id !=="undefind"){

                            var insertstatistic = `UPDATE individual_statistic SET statistic='${adddata.statistic}',event_id=${eventid},ml_id=${matchid},statistic_val='${adddata.statistic_val}', s_game_one='${adddata.s_game_one}', s_game_two='${adddata.s_game_two}',s_game_three='${adddata.s_game_three}',s_game_four='${adddata.s_game_four}',s_game_five='${adddata.s_game_five}',s_game_six='${adddata.s_game_six}',s_sets_one='${adddata.s_sets_one}',s_sets_two='${adddata.s_sets_two}',s_sets_three='${adddata.s_sets_three}',s_sets_four='${adddata.s_sets_four}',s_sets_five='${adddata.s_sets_five}',s_sets_six='${adddata.s_sets_six}',statistic_type='${adddata.statistic_type}',logo='${logo}',total='${adddata.total}',updated_at=now() WHERE id =${adddata.statistic_id}`;
                            
                           }

                           else{
                            var insertstatistic = `INSERT INTO individual_statistic(statistic,event_id,ml_id,statistic_val, s_game_one, s_game_two,s_game_three,s_game_four,s_game_five,s_game_six,s_sets_one,s_sets_two,s_sets_three,s_sets_four,s_sets_five,s_sets_six,statistic_type,logo,total,created_at,status )VALUES ('${adddata.statistic}',${eventid},${matchid},'${adddata.statistic_val}','${adddata.s_game_one}','${adddata.s_game_two}','${adddata.s_game_three}', '${adddata.s_game_four}','${adddata.s_game_five}','${adddata.s_game_six}','${adddata.s_sets_one}','${adddata.s_sets_two}','${adddata.s_sets_three}','${adddata.s_sets_four}' ,'${adddata.s_sets_five}','${adddata.s_sets_six}','${adddata.statistic_type}','${logo}','${adddata.total}',now(),1);`;
                            //console.log('insertstatistic.....................................');
                           }
                            //console.log(insertstatistic);
  
                            if (insertstatistic) {
                              await db.query(insertstatistic)
                            }
                          }
                        }
  
                      }
                    }

                    
                    //await db.query(`COMMIT`);

                  }


                }
              }
            }

          }
        } 
      }
    }

return true;
  } catch (err) {

    console.log(err)
    return false;
  }
}

const individual_performanceMast = async (req, res) => {
   try {
        
     
    // if (req.body.tournament_other && typeof req.body.tournament_other !== undefined && req.body.tournament_other !=="") {
    //   var tournament_other = req.body.tournament_other;
    // } else {
    //   var tournament_other = null;
    // }

    if(req.body.tournament == 0){
      var tournament_other = req.body.tournament_other;
    }
    else{

         var tournament_other = null;
    }

    if(req.body.venue == 0){
      
     var venue_other = req.body.venue_other;
    }else{

     var venue_other = null;
    }

    console.log(req.body.tournament_date);
    console.log('req.body.tournament_date.......');

    if(req.body.tournament_date && typeof req.body.tournament_date !== undefined && req.body.tournament_date !== ""){
   
    //  let tournamentdate = req.body.tournament_date.split('-');
    //     var tournament_date = tournamentdate[2] + '-' + tournamentdate[1] + '-' + tournamentdate[0];
    //     tournamentdate[0];
        var tournament_date = req.body.tournament_date;
    }
     var end_date = null;
    if(req.body.end_date && typeof req.body.end_date !== undefined && req.body.end_date !== ""){ 
   
     let enddate = req.body.end_date.split('-');
      var end_date = enddate[2] + '-' + enddate[1] + '-' + enddate[0];
        enddate[0];
    }
    if(typeof req.body.end_date == 'undefined'){  
      var end_date = null;
    }

 
    let coursedata = null;

    if(req.body.course && req.body.course !== 'undefined' && req.body.course !== ""){ 

       coursedata = req.body.course;
     
    }

    let finaltournament  =null;

    if(req.body.final_tournament_position && req.body.final_tournament_position !== 'undefined' && req.body.final_tournament_position !==""){

      finaltournament = req.body.final_tournament_position; 
      
    }

    

    var insert_str = `INSERT INTO individual_performance(sport_id,turnament_name,tournament_other,course,venue_other,final_tournament_position,tournament_date,end_date,venue_id,city_id,state_id,country_id,subscriber_id,subsport_id,subsport_game_one,subsport_game_two,subsport_game_three,subsport_game_four,subsport_game_five,subsport_game_total,subsport_sets_one,subsport_sets_two,subsport_sets_three,subsport_sets_four,subsport_sets_five,subsport_sets_total,created_at,status )VALUES (${req.body.sport},'${req.body.tournament}','${tournament_other}',${coursedata},'${venue_other}','${finaltournament}','${tournament_date}','${end_date}',${req.body.venue},${req.body.city},${req.body.state},${req.body.country},${req.body.subscriber_id},${req.body.subsport_id},'${req.body.subsport_game_one}',${req.body.subsport_game_two},${req.body.subsport_game_three},${req.body.subsport_game_four},${req.body.subsport_game_five},${req.body.subsport_game_total},${req.body.subsport_sets_one},'${req.body.subsport_sets_two}','${req.body.subsport_sets_three}','${req.body.subsport_sets_four}','${req.body.subsport_sets_five}','${req.body.subsport_sets_total}',now(),1)RETURNING id;`;

    console.log("insert_str25: ");
    console.log(insert_str);
    
    let inserttmaster = await db.query(insert_str);

    return inserttmaster.rows[0];
    //await db.query(`COMMIT`);
        //await db.query(`COMMIT;`);
    }
    catch (err) {
        console.log("err===================");
        console.log(err);
        await db.query(`ROLLBACK;`);
        return {
            serverError: true,
            error: err.message
        }
    }
}

const individual_eventMast = async (req, res) => {
    try {

    	if(req.body.event_name == 0){
    		var event = req.body.event_other;
    	}
    	else{
    		var event = null;
    	}

      if(!req.body.event_name && req.body.event_name == "" && typeof req.body.event_name == "undefined"){
         req.body.event_name = null;
      }

      if(!req.body.master_id && req.body.master_id == "" && typeof req.body.master_id == "undefined"){
         req.body.master_id = null;
      }
      if(!req.body.stroke && req.body.stroke == "" && typeof req.body.stroke == "undefined"){
         req.body.stroke = null;
      }
      if(!req.body.distance && req.body.distance == "" && typeof req.body.distance == "undefined"){
         req.body.distance = null;
      }
      if(!req.body.discipline && req.body.discipline == "" && typeof req.body.discipline == "undefined"){
         req.body.discipline = null;
      }
      if(!req.body.event_type && req.body.event_type == "" && typeof req.body.event_type == "undefined"){
         req.body.event_type = null;
      }
      if(!req.body.start_date && req.body.start_date == "" && typeof req.body.start_date == "undefined"){
         req.body.start_date = null;
      }
      if(!req.body.from_date && req.body.from_date == "" && typeof req.body.from_date == "undefined"){
         req.body.from_date = null; 
      } 
        var event_logo_data = null; 

      if (req.body.event_logo) {
        var img = req.body.event_logo[0];
                               let isImage = /^data:image/.test(img);
                                  if (isImage) {
                                  let profilePath = 'images/awards/';
                                  let uploaded = helper.uploadBase64(img, profilePath);
                                  console.log('uploaded');
                                  console.log(uploaded);
                                  event_logo_data = uploaded.path; 
                                }
                                            
                        }
        
     	var insertteventmaster = `INSERT INTO individual_event( 
          event_name,master_id,stroke,distance,distance_val,discipline,event_type,event_other,event_logo,start_date,from_date,created_at,status ) VALUES('${req.body.event_name}',${req.body.master_id},'${req.body.stroke}','${req.body.distance}','${req.body.distance_val}','${req.body.discipline}','${req.body.event_type}','${event}','${event_logo_data}','${req.body.start_date}','${req.body.from_date}',now(),1) RETURNING id;`;

      console.log("insertteventmaster ++++");
      console.log(insertteventmaster);

         var insertteventmasterData = await db.query(insertteventmaster);

         return insertteventmasterData.rows[0];

        //await db.query(`COMMIT;`);
    }
    catch (err) {
        console.log("err===================");
        console.log(err);
        await db.query(`ROLLBACK;`);
        return {
            serverError: true,
            error: err.message
        }
    }
}

const individual_matchlevelMast = async (req, res) => {
    try {
          var bannerPath = 'images/profile/';

    	  var participant_one_logo = req.body.participant_one_logo;

                var participant_one_logo_new = "";

                    if (participant_one_logo && typeof participant_one_logo !=="undefined" && participant_one_logo.length > 0) {
                       var participant_one_logo = helper.uploadBase64(participant_one_logo[0], bannerPath);
                       participant_one_logo_new = participant_one_logo.path;
                    }
                    else{
                      participant_one_logo_new = null;
                    }


             	var participant_two_logo = req.body.participant_two_logo;

                var participant_two_logo_new = "";

                    if (participant_two_logo && typeof participant_two_logo !=="undefined" && participant_two_logo.length > 0) {
                       var participant_two_logo = helper.uploadBase64(participant_two_logo[0], bannerPath);
                       participant_two_logo_new = participant_two_logo.path;
                    }
                    else{
                      participant_two_logo_new = null;   
                    }


                var team_one_logo = req.body.team_one_logo

                var team_one_logo_new = "";

                    if (team_one_logo && typeof team_one_logo !=="undefined" && team_one_logo.length > 0) { 
                       var team_one_logo = helper.uploadBase64(team_one_logo[0], bannerPath);
                       team_one_logo_new = team_one_logo.path;
                    }
                    else{
                      team_one_logo_new = null;
                    }

                
                var team_two_logo = req.body.team_two_logo

                var team_two_logo_new = "";

                    if (team_two_logo && typeof team_two_logo !=="undefined" && team_two_logo.length > 0) {
                       var team_two_logo = helper.uploadBase64(team_two_logo[0], bannerPath);
                       team_two_logo_new = team_two_logo.path;
                    }
                    else{
                      team_two_logo_new = null;
                    }
    	

                    if(req.body.master_id && typeof req.body.master_id !== undefined && req.body.master_id !==""){

                    }else{
                      req.body.master_id = null;
                    }

                    if(req.body.event_id && typeof req.body.event_id !== undefined && req.body.event_id !==""){

                    }else{
                      req.body.event_id = null;
                    }

                    if(req.body.match_no && typeof req.body.match_no !== undefined && req.body.match_no !==""){

                    }else{
                      req.body.match_no = null;
                    }

                    if(req.body.match_level && typeof req.body.match_level !== undefined && req.body.match_level !==""){

                    }else{
                      req.body.match_level = null;
                    }

                    if(req.body.participant_finel_result && typeof req.body.participant_finel_result !== undefined && req.body.participant_finel_result !==""){

                    }else{
                      req.body.participant_finel_result = null;
                    }

                    if(req.body.participant_finel_score && typeof req.body.participant_finel_score !== undefined && req.body.participant_finel_score !==""){

                    }else{
                      req.body.participant_finel_score = null;
                    }

                    if(req.body.win_participant && typeof req.body.win_participant !== undefined && req.body.win_participant !==""){

                    }else{
                      req.body.win_participant = null;
                    }

                    if(req.body.participant_one && typeof req.body.participant_one !== undefined && req.body.participant_one !==""){

                    }else{
                      req.body.participant_one = null;
                    }

                    if(req.body.participant_one_score && typeof req.body.participant_one_score !== undefined && req.body.participant_one_score !==""){

                    }else{
                      req.body.participant_one_score = null;
                    }

                    if(req.body.participant_one_game_one && typeof req.body.participant_one_game_one !== undefined && req.body.participant_one_game_one !==""){

                    }else{
                      req.body.participant_one_game_one = null;
                    }

                    if(req.body.participant_one_game_two && typeof req.body.participant_one_game_two !== undefined && req.body.participant_one_game_two !==""){

                    }else{
                      req.body.participant_one_game_two = null;
                    }

                    if(req.body.participant_one_game_three && typeof req.body.participant_one_game_three !== undefined && req.body.participant_one_game_three !==""){

                    }else{
                      req.body.participant_one_game_three = null;
                    }

                    if(req.body.participant_one_game_four && typeof req.body.participant_one_game_four !== undefined && req.body.participant_one_game_four !==""){

                    }else{
                      req.body.participant_one_game_four = null;
                    }

                    if(req.body.participant_one_game_five && typeof req.body.participant_one_game_five !== undefined && req.body.participant_one_game_five !==""){

                    }else{
                      req.body.participant_one_game_five = null;
                    }

                    if(req.body.participant_one_game_total && typeof req.body.participant_one_game_total !== undefined && req.body.participant_one_game_total !==""){

                    }else{
                      req.body.participant_one_game_total = null;
                    }

                    if(req.body.participant_one_sets_one && typeof req.body.participant_one_sets_one !== undefined && req.body.participant_one_sets_one !==""){

                    }else{
                      req.body.participant_one_sets_one = null;
                    }

                    if(req.body.participant_one_sets_two && typeof req.body.participant_one_sets_two !== undefined && req.body.participant_one_sets_two !==""){

                    }else{
                      req.body.participant_one_sets_two = null;
                    }

                    if(req.body.participant_one_sets_three && typeof req.body.participant_one_sets_three !== undefined && req.body.participant_one_sets_three !==""){

                    }else{
                      req.body.participant_one_sets_three = null;
                    }

                    if(req.body.participant_one_sets_four && typeof req.body.participant_one_sets_four !== undefined && req.body.participant_one_sets_four !==""){

                    }else{
                      req.body.participant_one_sets_four = null;
                    }

                    if(req.body.participant_one_sets_five && typeof req.body.participant_one_sets_five !== undefined && req.body.participant_one_sets_five !==""){

                    }else{
                      req.body.participant_one_sets_five = null;
                    }

                    if(req.body.participant_one_sets_total && typeof req.body.participant_one_sets_total !== undefined && req.body.participant_one_sets_total !==""){

                    }else{
                      req.body.participant_one_sets_total = null;
                    }

                    if(req.body.participant_two && typeof req.body.participant_two !== undefined && req.body.participant_two !==""){

                    }else{
                      req.body.participant_two = null;
                    }

                    if(req.body.participant_one_sets_one && typeof req.body.participant_one_sets_one !== undefined && req.body.participant_one_sets_one !==""){

                    }else{
                      req.body.participant_one_sets_one = null;
                    }

                    if(req.body.participant_one_sets_two && typeof req.body.participant_one_sets_two !== undefined && req.body.participant_one_sets_two !==""){

                    }else{
                      req.body.participant_one_sets_two = null;
                    }

                    if(req.body.participant_one_sets_three && typeof req.body.participant_one_sets_three !== undefined && req.body.participant_one_sets_three !==""){

                    }else{
                      req.body.participant_one_sets_three = null;
                    }

                    if(req.body.participant_one_sets_four && typeof req.body.participant_one_sets_four !== undefined && req.body.participant_one_sets_four !==""){

                    }else{
                      req.body.participant_one_sets_four = null;
                    }

                    if(req.body.participant_one_sets_five && typeof req.body.participant_one_sets_five !== undefined && req.body.participant_one_sets_five !==""){

                    }else{
                      req.body.participant_one_sets_five = null;
                    }

                    if(req.body.participant_one_sets_total && typeof req.body.participant_one_sets_total !== undefined && req.body.participant_one_sets_total !==""){

                    }else{
                      req.body.participant_one_sets_total = null;
                    }

                    if(req.body.participant_two && typeof req.body.participant_two !== undefined && req.body.participant_two !==""){

                    }else{
                      req.body.participant_two = null;
                    }

                    if(req.body.participant_two_score && typeof req.body.participant_two_score !== undefined && req.body.participant_two_score !==""){

                    }else{
                      req.body.participant_two_score = null;
                    }

                    if(req.body.participant_two_game_one && typeof req.body.participant_two_game_one !== undefined && req.body.participant_two_game_one !==""){

                    }else{
                      req.body.participant_two_game_one = null;
                    }

                    if(req.body.participant_two_game_two && typeof req.body.participant_two_game_two !== undefined && req.body.participant_two_game_two !==""){

                    }else{
                      req.body.participant_two_game_two = null;
                    }

                    if(req.body.participant_two_game_three && typeof req.body.participant_two_game_three !== undefined && req.body.participant_two_game_three !==""){

                    }else{
                      req.body.participant_two_game_three = null;
                    }

                    if(req.body.participant_two_game_four && typeof req.body.participant_two_game_four !== undefined && req.body.participant_two_game_four !==""){

                    }else{
                      req.body.participant_two_game_four = null;
                    }

                    if(req.body.participant_two_game_five && typeof req.body.participant_two_game_five !== undefined && req.body.participant_two_game_five !==""){

                    }else{
                      req.body.participant_two_game_five = null;
                    }

                    if(req.body.participant_two_game_total && typeof req.body.participant_two_game_total !== undefined && req.body.participant_two_game_total !==""){

                    }else{
                      req.body.participant_two_game_total = null;
                    }

                    if(req.body.participant_two_sets_one && typeof req.body.participant_two_sets_one !== undefined && req.body.participant_two_sets_one !==""){

                    }else{
                      req.body.participant_two_sets_one = null;
                    }

                    if(req.body.participant_two_sets_two && typeof req.body.participant_two_sets_two !== undefined && req.body.participant_two_sets_two !==""){

                    }else{
                      req.body.participant_two_sets_two = null;
                    }

                    if(req.body.participant_two_sets_three && typeof req.body.participant_two_sets_three !== undefined && req.body.participant_two_sets_three !==""){

                    }else{
                      req.body.participant_two_sets_three = null;
                    }

                    if(req.body.participant_two_sets_four && typeof req.body.participant_two_sets_four !== undefined && req.body.participant_two_sets_four !==""){

                    }else{
                      req.body.participant_two_sets_four = null;
                    }

                    if(req.body.participant_two_sets_five && typeof req.body.participant_two_sets_five !== undefined && req.body.participant_two_sets_five !==""){

                    }else{
                      req.body.participant_two_sets_five = null;
                    }

                    if(req.body.participant_two_sets_total && typeof req.body.participant_two_sets_total !== undefined && req.body.participant_two_sets_total !==""){

                    }else{
                      req.body.participant_two_sets_total = null;
                    }

                    if(req.body.team_name_one && typeof req.body.team_name_one !== undefined && req.body.team_name_one !==""){

                    }else{
                      req.body.team_name_one = null;
                    }

                    if(req.body.team_one_score && typeof req.body.team_one_score !== undefined && req.body.team_one_score !==""){

                    }else{
                      req.body.team_one_score = null;
                    }

                    if(req.body.team_one_description && typeof req.body.team_one_description !== undefined && req.body.team_one_description !==""){

                    }else{
                      req.body.team_one_description = null;
                    }

                    if(req.body.team_one_game_one && typeof req.body.team_one_game_one !== undefined && req.body.team_one_game_one !==""){

                    }else{
                      req.body.team_one_game_one = null;
                    }

                    if(req.body.team_one_game_two && typeof req.body.team_one_game_two !== undefined && req.body.team_one_game_two !==""){

                    }else{
                      req.body.team_one_game_two = null;
                    }

                    if(req.body.team_one_game_three && typeof req.body.team_one_game_three !== undefined && req.body.team_one_game_three !==""){

                    }else{
                      req.body.team_one_game_three = null;
                    }

                    if(req.body.team_one_game_four && typeof req.body.team_one_game_four !== undefined && req.body.team_one_game_four !==""){

                    }else{
                      req.body.team_one_game_four = null;
                    }

                    if(req.body.team_one_game_five && typeof req.body.team_one_game_five !== undefined && req.body.team_one_game_five !==""){

                    }else{
                      req.body.team_one_game_five = null;
                    }

                    if(req.body.team_one_game_total && typeof req.body.team_one_game_total !== undefined && req.body.team_one_game_total !==""){

                    }else{
                      req.body.team_one_game_total = null;
                    }

                    if(req.body.team_one_sets_one && typeof req.body.team_one_sets_one !== undefined && req.body.team_one_sets_one !==""){

                    }else{
                      req.body.team_one_sets_one = null;
                    }

                    if(req.body.team_one_sets_two && typeof req.body.team_one_sets_two !== undefined && req.body.team_one_sets_two !==""){

                    }else{
                      req.body.team_one_sets_two = null;
                    }

                    if(req.body.team_one_sets_three && typeof req.body.team_one_sets_three !== undefined && req.body.team_one_sets_three !==""){

                    }else{
                      req.body.team_one_sets_three = null;
                    }

                    if(req.body.team_one_sets_four && typeof req.body.team_one_sets_four !== undefined && req.body.team_one_sets_four !==""){

                    }else{
                      req.body.team_one_sets_four = null;
                    }

                    if(req.body.team_one_sets_five && typeof req.body.team_one_sets_five !== undefined && req.body.team_one_sets_five !==""){

                    }else{
                      req.body.team_one_sets_five = null;
                    }

                    if(req.body.team_one_sets_total && typeof req.body.team_one_sets_total !== undefined && req.body.team_one_sets_total !==""){

                    }else{
                      req.body.team_one_sets_total = null;
                    }

                    if(req.body.team_two_name && typeof req.body.team_two_name !== undefined && req.body.team_two_name !==""){

                    }else{
                      req.body.team_two_name = null;
                    }

                    if(req.body.team_two_score && typeof req.body.team_two_score !== undefined && req.body.team_two_score !==""){

                    }else{
                      req.body.team_two_score = null;
                    }

                    if(req.body.team_two_description && typeof req.body.team_two_description !== undefined && req.body.team_two_description !==""){

                    }else{
                      req.body.team_two_description = null;
                    }

                    if(req.body.team_two_game_one && typeof req.body.team_two_game_one !== undefined && req.body.team_two_game_one !==""){

                    }else{
                      req.body.team_two_game_one = null;
                    }

                    if(req.body.team_two_game_two && typeof req.body.team_two_game_two !== undefined && req.body.team_two_game_two !==""){

                    }else{
                      req.body.team_two_game_two = null;
                    }

                    if(req.body.team_two_game_three && typeof req.body.team_two_game_three !== undefined && req.body.team_two_game_three !==""){

                    }else{
                      req.body.team_two_game_three = null;
                    }

                    if(req.body.team_two_game_four && typeof req.body.team_two_game_four !== undefined && req.body.team_two_game_four !==""){

                    }else{
                      req.body.team_two_game_four = null;
                    }

                    if(req.body.team_two_game_five && typeof req.body.team_two_game_five !== undefined && req.body.team_two_game_five !==""){

                    }else{
                      req.body.team_two_game_five = null;
                    }

                    if(req.body.team_two_game_total && typeof req.body.team_two_game_total !== undefined && req.body.team_two_game_total !==""){

                    }else{
                      req.body.team_two_game_total = null;
                    }

                    if(req.body.team_two_sets_one && typeof req.body.team_two_sets_one !== undefined && req.body.team_two_sets_one !==""){

                    }else{
                      req.body.team_two_sets_one = null;
                    }

                    if(req.body.team_two_sets_two && typeof req.body.team_two_sets_two !== undefined && req.body.team_two_sets_two !==""){

                    }else{
                      req.body.team_two_sets_two = null;
                    }

                    if(req.body.team_two_sets_three && typeof req.body.team_two_sets_three !== undefined && req.body.team_two_sets_three !==""){

                    }else{
                      req.body.team_two_sets_three = null;
                    }

                    if(req.body.team_two_sets_four && typeof req.body.team_two_sets_four !== undefined && req.body.team_two_sets_four !==""){

                    }else{
                      req.body.team_two_sets_four = null;
                    }

                    if(req.body.team_two_sets_total && typeof req.body.team_two_sets_total !== undefined && req.body.team_two_sets_total !==""){

                    }else{
                      req.body.team_two_sets_total = null;
                    }

                    if(req.body.team_finel_result && typeof req.body.team_finel_result !== undefined && req.body.team_finel_result !==""){

                    }else{
                      req.body.team_finel_result = null;
                    }

                    if(req.body.team_finel_score && typeof req.body.team_finel_score !== undefined && req.body.team_finel_score !==""){

                    }else{
                      req.body.team_finel_score = null;
                    }

                    if(req.body.win_team && typeof req.body.win_team !== undefined && req.body.win_team !==""){

                    }else{
                      req.body.win_team = null;
                    }

                    if(req.body.level && typeof req.body.level !== undefined && req.body.level !==""){

                    }else{
                      req.body.level = null;
                    }

                    if(req.body.level_timeing && typeof req.body.level_timeing !== undefined && req.body.level_timeing !==""){

                    }else{
                      req.body.level_timeing = null;
                    }

                    if(req.body.level_discipline && typeof req.body.level_discipline !== undefined && req.body.level_discipline !==""){

                    }else{
                      req.body.level_discipline = null;
                    }

                    if(req.body.level_parameter && typeof req.body.level_parameter !== undefined && req.body.level_parameter !==""){

                    }else{
                      req.body.level_parameter = null;
                    }

                    if(req.body.level_value && typeof req.body.level_value !== undefined && req.body.level_value !==""){

                    }else{
                      req.body.level_value = null;
                    }

                    if(req.body.level_position && typeof req.body.level_position !== undefined && req.body.level_position !==""){

                    }else{
                      req.body.level_position = null;
                    }

                    if(req.body.level_point && typeof req.body.level_point !== undefined && req.body.level_point !==""){

                    }else{
                      req.body.level_point = null;
                    }

                    

		var inserttmatchmaster = `INSERT INTO individual_match_level(master_id,event_id,match_no,match_level,participant_finel_result,participant_finel_score,win_participant,participant_one_logo,participant_one,participant_one_score,participant_one_game_one,participant_one_game_two,participant_one_game_three,participant_one_game_four,participant_one_game_five,participant_one_game_total,participant_one_sets_one,participant_one_sets_two,participant_one_sets_three,participant_one_sets_four,participant_one_sets_five,participant_one_sets_total,participant_one_description,participant_two_logo,participant_two,participant_two_score,participant_two_game_one,participant_two_game_two,participant_two_game_three,participant_two_game_four,participant_two_game_five,participant_two_game_total,participant_two_sets_one,participant_two_sets_two,participant_two_sets_three,participant_two_sets_four,participant_two_sets_five,participant_two_sets_total,participant_two_description,team_name_one,team_one_logo,team_one_score,team_one_description,team_one_game_one,team_one_game_two,team_one_game_three,team_one_game_four,team_one_game_five,team_one_game_total,team_one_sets_one,team_one_sets_two,team_one_sets_three,team_one_sets_four,team_one_sets_five,team_one_sets_total,team_two_name,team_two_logo,team_two_score,team_two_description,team_two_game_one,team_two_game_two,team_two_game_three,team_two_game_four,team_two_game_five,team_two_game_total,team_two_sets_one,team_two_sets_two,team_two_sets_three,team_two_sets_four,team_two_sets_total,team_finel_result,team_finel_score,win_team,level,level_timeing,level_discipline,level_parameter,level_value,level_position,level_point,created_at,status )
         VALUES (${req.body.master_id},${req.body.event_id},${req.body.match_no},'${req.body.match_level}','${req.body.participant_finel_result}','${req.body.participant_finel_score}','${req.body.win_participant}','${participant_one_logo_new}','${req.body.participant_one}',${req.body.participant_one_score},${req.body.participant_one_game_one},${req.body.participant_one_game_two},${req.body.participant_one_game_three},${req.body.participant_one_game_four},${req.body.participant_one_game_five},${req.body.participant_one_game_total},${req.body.participant_one_sets_one},${req.body.participant_one_sets_two},${req.body.participant_one_sets_three},${req.body.participant_one_sets_four},${req.body.participant_one_sets_five},${req.body.participant_one_sets_total},'${req.body.participant_one_description}','${participant_two_logo_new}','${req.body.participant_two}',${req.body.participant_two_score},${req.body.participant_two_game_one},${req.body.participant_two_game_two},${req.body.participant_two_game_three},${req.body.participant_two_game_four},${req.body.participant_two_game_five},${req.body.participant_two_game_total},${req.body.participant_two_sets_one},${req.body.participant_two_sets_two},${req.body.participant_two_sets_three},${req.body.participant_two_sets_four},${req.body.participant_two_sets_five},${req.body.participant_two_sets_total},'${req.body.participant_two_description}','${req.body.team_name_one}','${team_one_logo_new}',${req.body.team_one_score},'${req.body.team_one_description}',${req.body.team_one_game_one},${req.body.team_one_game_two},${req.body.team_one_game_three},${req.body.team_one_game_four},${req.body.team_one_game_five},${req.body.team_one_game_total},${req.body.team_one_sets_one},${req.body.team_one_sets_two},${req.body.team_one_sets_three},${req.body.team_one_sets_four},${req.body.team_one_sets_five},${req.body.team_one_sets_total},'${req.body.team_two_name}','${team_two_logo_new}',${req.body.team_two_score},'${req.body.team_two_description}',${req.body.team_two_game_one},${req.body.team_two_game_two},${req.body.team_two_game_three},${req.body.team_two_game_four},${req.body.team_two_game_five},${req.body.team_two_game_total},${req.body.team_two_sets_one},${req.body.team_two_sets_two},${req.body.team_two_sets_three},${req.body.team_two_sets_four},${req.body.team_two_sets_total},'${req.body.team_finel_result}','${req.body.team_finel_score}','${req.body.win_team}','${req.body.level}','${req.body.level_timeing}','${req.body.level_discipline}','${req.body.level_parameter}','${req.body.level_value}','${req.body.level_position}','${req.body.level_point}',now(),1)RETURNING id;`;

         console.log('inserttmatchmaster_inserttmatchmaster_inserttmatchmaster_inserttmatchmaster_-----');
         console.log(inserttmatchmaster)
           await db.query(inserttmatchmaster);

    
        //await db.query(`COMMIT;`);
    }
    catch (err) {
        console.log("err===================");
        console.log(err);
        await db.query(`ROLLBACK;`);
        return {
            serverError: true,
            error: err.message
        }
    }
}

const individual_stacMast = async (req, res) => {
   try {
        
    var stacinfo = req.body.stacinfo;
    

    var masterid = req.body.master_id;
    var eventid = req.body.event_id;
    var matchid = req.body.ml_id;

    if (stacinfo) {
    if (Array.isArray(stacinfo)) {
    	 
    	for (var i = 0; i < stacinfo.length; i++) {
           var bannerPath = 'images/profile/';
           console.log('stacinfo name');
         console.log(eventid);
    		// var statistic_logo = stacinfo[i].statistic_logo

      //           var statistic_logo_new = "";

      //               if (statistic_logo && typeof statistic_logo !=="undefined" && statistic_logo.length > 0) {
      //                  var statistic_logo = helper.uploadBase64(statistic_logo[0], bannerPath);
      //                  statistic_logo_new = statistic_logo.path;
      //               }
      //               else{
                      statistic_logo_new = null;
                    // }
    		
    			var insertstatistic = `INSERT INTO individual_statistic(statistic_name,event_id,ml_id,statistic_val, stac_game_one, stac_game_two,stac_game_three,stac_game_four,stac_game_five,stac_game_total,stac_sets_one,stac_sets_two,stac_sets_three,stac_sets_four,stac_sets_five,statistic_type,statistic_logo,stac_sets_total,created_at,status )VALUES ('${stacinfo[i].statistic_name}',${eventid},${matchid},'${stacinfo[i].statistic_val}',${stacinfo[i].stac_game_one},${stacinfo[i].stac_game_two},${stacinfo[i].stac_game_three}, ${stacinfo[i].stac_game_four},${stacinfo[i].stac_game_five},${stacinfo[i].stac_game_total},${stacinfo[i].stac_sets_one},${stacinfo[i].stac_sets_two},${stacinfo[i].stac_sets_three},${stacinfo[i].stac_sets_four},${stacinfo[i].stac_sets_five},'${stacinfo[i].statistic_type}','${statistic_logo_new}',${stacinfo[i].stac_sets_total},now(),1);`;

    			console.log('insertstatistic');
    			console.log(insertstatistic);

    			 await db.query(insertstatistic);
				}
			}
		}
	}
    

    //await db.query(`COMMIT`);
        //await db.query(`COMMIT;`);
    
    catch (err) {
        //console.log("err===================");
        //console.log(err);
        await db.query(`ROLLBACK;`);
        return {
            serverError: true,
            error: err.message
        }
    }
}


const eventlist = async (req, res) => {
    let result = {};
    try {
        let listStr = "SELECT i.*,i.event_name as event_id,e.event_name FROM individual_event as i LEFT join event as e on e.id = i.event_name::integer WHERE i.status = 1  and master_id = '"+req.body.id+"'";

      console.log('listStr==============');
        console.log(listStr); 
        let dataResult = await db.query(listStr);
        result = dataResult.rows;
    } catch (err) {
        console.log("err: ");
        console.log(err);
        result = {};
    }
    return result;
}

const individual_performancelist = async (req, res) => {
    let result = {};
    try {
        let listStr = "SELECT ip.*,s.sports_name ,sb.sub_sport_name,v.venue_name,c.city_name,st.state_name,ct.name FROM individual_performance as ip LEFT join venue as v on v.id = ip.venue_id LEFT join sub_sport as sb on sb.id = ip.subsport_id LEFT join city as c on c.id = ip.city_id LEFT join state as st on st.id = ip.state_id LEFT join country as ct on ct.id = ip.country_id LEFT join sports as s on ip.sport_id = s.id where ip.status = 1 and ip.sport_id = '"+req.body.id+"'";
        let dataResult = await db.query(listStr);
        result = dataResult.rows;
    } catch (err) {
        console.log("err: ");
        console.log(err);
        result = {};
    }
    return result;
}

const indimatchlevelMastlist = async (req, res) => {
    let result = {};
    try {
        
        
    	var where_Mast = "";
      var masterid = req.body.master_id ;
    	
		if(masterid && typeof masterid !== undefined && masterid !== ''){

         where_Mast = "and master_id ="+masterid+" ";
    	}
         
         //var eventid = req.body.event_id;

    	/*if(eventid && typeof eventid === "undefined" && eventid < 0){

    		req.body.event_id = null;
    	}*/
      var where_str = "";
      if(req.body.event_id && typeof req.body.event_id !== undefined && req.body.event_id !==""){
        where_str = " and event_id = "+req.body.event_id+""
      }
        let listStr = "SELECT iml.*, l.level_name FROM individual_match_level as iml left join level as l on l.id = iml.level::integer WHERE iml.status = 1 "+where_Mast+""+where_str ;

        console.log('listStr');
        console.log(listStr);

        let dataResult = await db.query(listStr);
        result = dataResult.rows;
    } catch (err) {
        console.log("err: ");
        console.log(err);
        result = {};
    }
    return result;
}


const indistacMastlist = async (req, res) => {
    let result = {};
    try {
        
        
    	var ml_id = req.body.ml_id ;
    	
		if(typeof ml_id === "undefined" ){

         ml_id = null;
    	}
         
      var where_str = "";
      if(req.body.event_id && typeof req.body.event_id !== undefined && req.body.event_id !==""){
        where_str = " and event_id = "+req.body.event_id+""
      }


        let listStr = "SELECT * FROM individual_statistic WHERE status = 1  and ml_id = "+ml_id+""+where_str ;

        console.log('listStr');
        console.log(listStr);

        let dataResult = await db.query(listStr);
        result = dataResult.rows;
    } catch (err) {
        console.log("err: ");
        console.log(err);
        result = {};
    }
    return result;
}


const indimatchlevelInfo = async (req, res) => {
    let result = {};
    try {
        
        let matchlavelinfo = "SELECT * FROM individual_match_level WHERE status = 1  and id = "+req.body.id+" " ;

        console.log('listStr');
        console.log(matchlavelinfo);

        let dataResult = await db.query(matchlavelinfo);
        result = dataResult.rows;
    } catch (err) {
        console.log("err: ");
        console.log(err);
        result = {};
    }
    return result;
}


const indieventInfo = async (req, res) => {
    let result = {};
    try {

        //let eventinfo = "SELECT * FROM individual_event WHERE status = 1  and id = "+req.body.id+" " ;

        //console.log('listStr');
        //console.log(eventinfo);

        //let dataResult = await db.query(eventinfo);
        //sresult = dataResult.rows;
        var eventinfo = [];
        //var matchlaveldata =[];
        // var statisticdatainfo=[];

        if (req.body.id && req.body.id !== "undefined" && req.body.id !== "") {
            console.log("id.................");
            console.log(req.body.id);
            var performance = "SELECT ip.*,to_char(ip.tournament_date,'DD-MM-YYYY') tournament_date,v.venue_name,st.state_name,ct.name as country_name,c.city_name,s.sports_name FROM individual_performance as ip left join sports as s on s.id = ip.sport_id left join venue as v on v.id = ip.venue_id left join city as c on c.id = ip.city_id left join country as ct on ct.id = ip.country_id left join state as st on st.id = ip.state_id where ip.status = 1 and ip.id = " + req.body.id + "";


            var performacedata = await db.query(performance);



            result['performacinfo'] = performacedata.rows;

            console.log(result['performacinfo']);
            var prid = " ";
            if (result['performacinfo'] == "") {
                prid = 0;
            } else {
                prid = performacedata.rows[0].id;;
            }

            if (prid && prid !== "undefined" && prid !== "") {

                var event = "SELECT ie.*,e.event_name from individual_event as ie left join event as e on e.id:: varchar = ie.event_name where ie.status = 1 and ie.master_id = " + prid + "";

                var eventdata = await db.query(event);

                result['eventinfo'] = eventdata.rows;
            } else {

                result['eventinfo'] = [];
            }
            // result['eventinfo'] = [];
            //console.log("eventdata==============");
            //console.log(result);

            if (eventdata && eventdata !== 'undefined' && eventdata !== "") {
                console.log("event_id------------------------------------------------------------------------------------");
                //console.log(eventdata.rows[0].id);
                var event_id = eventdata.rows[0].master_id;

                if (event_id && event_id !== "undefined" && event_id !== "") {

                    var match_lavel = "SELECT * from individual_match_level where status = 1 and master_id = " + event_id + "";

                    console.log("match_lavel..................................................................................");
                    console.log(match_lavel);


                    var matchlavel = await db.query(match_lavel);
                    var matchlaveldata = matchlavel.rows;
                    result['matchlavelinfo'] = matchlaveldata;
                    //result['matchlavelinfodata'] = []

                }



                } else {
                    console.log("no data found");
                    result['matchlavelinfo'] = [];
                }

              var ml_id = "";
            if (matchlaveldata && matchlaveldata !== " " && matchlaveldata.length > 0) {


                console.log("uuuuuuuuuuuuuuuuuu");
                //ml_id = matchlaveldata[0].id;

                var ml_id_arry = [];
                for (var i = 0; i < matchlaveldata.length; i++) {
                  ml_id_arry.push(matchlaveldata[i].id);
                };

                //var statistic = "select * from individual_statistic where status = 1  and ml_id = " + ml_id + "";
                var statistic = "select * from individual_statistic where status = 1  and ml_id in (" + ml_id_arry.toString() + ") ";



                var statisticdata = await db.query(statistic);
                var statisticdatainfo = statisticdata.rows;
                result['statisticinfo'] = statisticdatainfo;



                //console.log(result);
                //console.log('statisticinfo------------------');
              } 
              else {
                console.log("no data found");
                result['statisticinfo'] = [];
              }

            // var event_id = eventinfo[0].result;
        }
    } catch (err) {
        console.log("err: ");
        console.log(err);
        result = {};
    }
    return result;
}


const indistatisticInfo = async (req, res) => {
    let result = {};
    try {
        
        let statisticinfo = "SELECT * FROM individual_statistic WHERE status = 1  and id = "+req.body.id+" " ;

        console.log('listStr');
        console.log(statisticinfo);

        let dataResult = await db.query(statisticinfo);
        result = dataResult.rows;
    } catch (err) {
        console.log("err: ");
        console.log(err);
        result = {};
    }
    return result;
}

const indiperformanceInfo = async (req, res) => {
    let result = {};
    try {
        

        //let statisticinfo = "SELECT * FROM individual_performance WHERE status = 1 and id = "+req.body.id+" " ;

       let statisticinfo = "SELECT ip.*,s.sports_name,v.venue_name,c.city_name,st.state_name,ct.name FROM individual_performance as ip LEFT join venue as v on v.id = ip.venue_id LEFT join city as c on c.id = ip.city_id LEFT join state as st on st.id = ip.state_id LEFT join country as ct on ct.id = ip.country_id LEFT join sports as s on ip.sport_id = s.id where ip.status = 1 and ip.id = '"+req.body.id+"'" 

        console.log('listStr');
        console.log(statisticinfo);

        let dataResult = await db.query(statisticinfo);
        result = dataResult.rows;
    } catch (err) {
        console.log("err: ");
        console.log(err);
        result = {};
    }
    return result;
}


const updatePerformance = async (req,res) => {
  let result = {};
  try{
    

    if(req.body.tournament == 0){

       var tournament_other = req.body.tournament_other;
      
       console.log(tournament_other);
    }
    else{
      var tournament_other = null;
    }

    if(req.body.venue_id == 0){
      var venue_other = req.body.venue_other;
      
       console.log(venue_other);
    }
    else{
      var venue_other = null;
    }

    if(typeof req.body.subsport_game_one === "undefined"){
      req.body.subsport_game_one = null;
    }
    if(typeof req.body.subsport_game_two === "undefined" ){
      req.body.subsport_game_two = null;
    }
    if(typeof req.body.subsport_game_three === "undefined" ){
      req.body.subsport_game_three = null;
    }
    if(typeof req.body.subsport_game_four === "undefined" ){
      req.body.subsport_game_four = null;
    }
    if(typeof req.body.subsport_game_five == "undefined" ){
      req.body.subsport_game_five = null;
    }
    if(typeof req.body.subsport_game_total == "undefined"){ 
      req.body.subsport_game_total = null;
    }
    if(typeof req.body.subsport_sets_one == "undefined" ){
      req.body.subsport_sets_one = null;
    }
    if(typeof req.body.subsport_sets_two == "undefined" ){
      req.body.subsport_sets_two = null;
    }
    if(typeof req.body.subsport_sets_three == "undefined" ){
      req.body.subsport_sets_three = null;
    }
    if(typeof req.body.subsport_sets_four == "undefined" ){
      req.body.subsport_sets_four = null;
    }
     if(typeof req.body.subsport_sets_five == "undefined" ){
      req.body.subsport_sets_five = null;
    }
    if(typeof req.body.subsport_sets_total == "undefined"){
      req.body.subsport_sets_total = null;
    }
    


       
       let updatedata = "update individual_performance SET turnament_name ='"+req.body.tournament+"',tournament_other = '"+tournament_other+"',sport_id ="+req.body.sport_id+",course = "+req.body.course+", final_tournament_position = '"+req.body.final_tournament_position+"',end_date ='"+req.body.end_date+"',tournament_date = '"+req.body.tournament_date+"',venue_other = '"+venue_other+"',venue_id = "+req.body.venue_id+",city_id = "+req.body.city_id+",state_id = "+req.body.state_id+",country_id = "+req.body.country_id+",subsport_id = "+req.body.subsport_id+",subsport_game_one = '"+req.body.subsport_game_one+"',subsport_game_two = '"+req.body.subsport_game_two+"',subsport_game_three = '"+req.body.subsport_game_three+"',subsport_game_four = '"+req.body.subsport_game_four+"',subsport_game_five ='"+req.body.subsport_game_five+"',subsport_game_total = '"+req.body.subsport_game_total+"',subsport_sets_one = '"+req.body.subsport_sets_one+"',subsport_sets_two = '"+req.body.subsport_sets_two+"',subsport_sets_three = '"+req.body.subsport_sets_three+"',subsport_sets_four = '"+req.body.subsport_sets_four+"',subsport_sets_five = '"+req.body.subsport_sets_five+"',subsport_sets_total = '"+req.body.subsport_sets_total+"',updated_at = now() WHERE id = "+req.body.id+" "
      
      console.log('updatedata000000000000000000000');
       console.log(updatedata);
       await db.query(updatedata);
       
    
  }
  catch(err){
    console.log('err');
    console.log(err);
    result = {};

  }
}

const updateEvent = async (req,res) => {
  let result = {};
  try{

    if(req.body.event_name == 0){
       var event_other = req.body.event_other;
    }
    else{
      var event_other = null;
    }

    var event_logo_data = null;
    console.log('one0000000000000000000000000000');
    console.log(req.body.event_logo)
    if (req.body.event_logo[0]){
      console.log('one04444444444444444444444444444444');
    console.log(req.body.event_logo)
                               let isImage = /^data:image/.test(req.body.event_logo[0]);
                                  if (isImage) {
                                  let profilePath = 'images/award/';
                                  let uploaded = helper.uploadBase64(req.body.event_logo[0], profilePath);
                                  console.log('uploaded');
                                  console.log(uploaded);
                                  event_logo_data = uploaded.path;  
                                }
                                            
                      }
                      else{
                        //let profilePath ='images/award';
                        event_logo_data = 'images/award/images.jpg';
                      }

       if(req.body.id && req.body.id !== "undefined" && req.body.id !==""){
       var updatedata = "update individual_event SET event_name ='"+req.body.event_name+"',event_logo = '"+event_logo_data+"',discipline = "+req.body.discipline+",stroke ="+req.body.stroke+",distance = "+req.body.distance+",distance_val = '"+req.body.distance_val+"',event_type = '"+req.body.event_type+"',event_other = '"+event_other+"',start_date = '"+req.body.start_date+"',from_date = '"+req.body.from_date+"',updated_at = now() WHERE id = "+req.body.id+" "
        }
        else{
          var updatedata ="INSERT into individual_event (event_name,master_id,event_logo,discipline,stroke,distance,distance_val,event_type,event_other,start_date,from_date,created_at,status) VALUES('"+req.body.event_name+"',"+req.body.master_id+",'"+event_logo_data+"','"+req.body.discipline+"','"+req.body.stroke+"','"+req.body.distance+"','"+req.body.distance_val+"','"+req.body.event_type+"','"+req.body.event_other+"','"+req.body.start_date+"','"+req.body.from_date+"',now(),1)"
        }

        console.log("ffffffffffff");
       console.log(updatedata);

       await db.query(updatedata);
       console.log('updatedata');
       console.log(updatedata);
    
  }
  catch(err){
    console.log('err');
    console.log(err);
    result = {}; 

  }
}

const updateMatchlavel = async (req,res) => {
  let result = {};
  try{

   

            var bannerPath = 'images/performance/';

            var par_onelogo = req.body.participant_one_logo; 

            var participant_one_logo = ' ';

            if (par_onelogo && typeof par_onelogo !=="undefined" && par_onelogo.length > 0) {
                

            var logo_data = helper.uploadBase64(par_onelogo[0], bannerPath);
            console.log('participant_one_logo---------------------');
            console.log(logo_data);
                  participant_one_logo = logo_data.path;

            }

            var par_twologo = req.body.participant_two_logo; 

            var participant_two_logo = ' ';

            if (par_twologo && typeof par_twologo !=="undefined" && par_twologo.length > 0) {
                

            var logo_data = helper.uploadBase64(par_twologo[0], bannerPath);
            
                  participant_two_logo = logo_data.path;
              
            }

            var team_one_logo = ' ';

            var team_onelogo = req.body.team_one_logo[0]; 

              console.log("team_onelogo..................");
              console.log(team_onelogo);

            if (team_onelogo && typeof team_onelogo !=="undefined" && team_onelogo.length > 0) {
                

            var logo_data = helper.uploadBase64(team_onelogo, bannerPath);
                team_one_logo = logo_data.path;
              
            }
              
            var team_two_logo = ' ';

              var team_twologo = req.body.team_two_logo[0]; 
              console.log("team_twologo...................");
              console.log(team_twologo);

            if (team_twologo && typeof team_twologo !=="undefined" && team_twologo.length > 0) {
                

            var logo_data = helper.uploadBase64(team_twologo, bannerPath);
                team_two_logo = logo_data.path;
              
            }


            if(typeof req.body.participant_finel_result == "undefined" ){

              req.body.participant_finel_result = null;
            }
            if(typeof req.body.participant_finel_score == "undefined" ){
              
              req.body.participant_finel_score = null;
            }
            if(typeof req.body.win_participant == "undefined" ){
              
              req.body.win_participant = null;
            }
            if(typeof req.body.participant_one == "undefined" ){
              
              req.body.participant_one = null;
            }
            if(typeof req.body.participant_one_score == "undefined" ){
              
              req.body.participant_one_score = null;
            }
            if(typeof req.body.participant_one_game_one == "undefined" ){
              
              req.body.participant_one_game_one = null;
            }
            if(typeof req.body.participant_one_game_two == "undefined" ){
              
              req.body.participant_one_game_two = null;
            }
            if(typeof req.body.participant_one_game_three == "undefined" ){
              
              req.body.participant_one_game_three = null;
            }
            if(typeof req.body.participant_one_game_four == "undefined" ){
              
              req.body.participant_one_game_four = null;
            }
            if(typeof req.body.participant_one_game_five == "undefined" ){
              
              req.body.participant_one_game_five = null;
            }
            if(typeof req.body.participant_one_game_total == "undefined" ){
               
              req.body.participant_one_game_total = null;
            }
            if(typeof req.body.participant_one_sets_one == "undefined" ){
              
              req.body.participant_one_sets_one = null;
            }
            if(typeof req.body.participant_one_sets_two == "undefined" ){
              
              req.body.participant_one_sets_two = null;
            }
            if(typeof req.body.participant_one_sets_three == "undefined" ){
              
              req.body.participant_one_sets_three = null;
            }
            if(typeof req.body.participant_one_sets_four == "undefined" ){
              
              req.body.participant_one_sets_four = null;
            }
            if(typeof req.body.participant_one_sets_five == "undefined" ){
              
              req.body.participant_one_sets_five = null;
            }
            if(typeof req.body.participant_one_sets_total == "undefined" ){
              
              req.body.participant_one_sets_total = null;
            }
            if(typeof req.body.participant_two == "undefined" ){
              
              req.body.participant_two = null;
            }
            if(typeof req.body.participant_two_score == "undefined" ){
              
              req.body.participant_two_score = null;
            }
            if(typeof req.body.participant_two_game_one == "undefined" ){
              
              req.body.participant_two_game_one = null;
            }
            if(typeof req.body.participant_two_game_two == "undefined" ){
              
              req.body.participant_two_game_two = null;
            }
            if(typeof req.body.participant_two_game_three == "undefined" ){
              
              req.body.participant_two_game_three = null;
            }
            if(typeof req.body.participant_two_game_four == "undefined" ){
              
              req.body.participant_two_game_four = null;
            }

            if(typeof req.body.participant_two_game_five == "undefined" ){
              
              req.body.participant_two_game_five = null;
            }

            if(typeof req.body.participant_two_game_total == "undefined" ){
              
              req.body.participant_two_game_total = null;
            }

            if(typeof req.body.participant_two_sets_one == "undefined" ){
              
              req.body.participant_two_sets_one = null;
            }

            if(typeof req.body.participant_two_sets_two == "undefined" ){
              
              req.body.participant_two_sets_two = null;
            }

            if(typeof req.body.participant_two_sets_three == "undefined" ){
              
              req.body.participant_two_sets_three = null;
            }

            if(typeof req.body.participant_two_sets_four == "undefined" ){
              
              req.body.participant_two_sets_four = null;
            }

            if(typeof req.body.participant_two_sets_five == "undefined" ){
              
              req.body.participant_two_sets_five = null;
            }

            if(typeof req.body.participant_two_sets_total == "undefined" ){
              
              req.body.participant_two_sets_total = null;
            }
            if(typeof req.body.team_name_one == "undefined" ){
              
              req.body.team_name_one = null;
            }
            if(typeof req.body.team_one_score == "undefined" ){
              
              req.body.team_one_score = null;
            }
            if(typeof req.body.team_one_description == "undefined" ){
              
              req.body.team_one_description = null;
            }
            if(typeof req.body.team_one_game_one == "undefined" ){
              
              req.body.team_one_game_one = null;
            }
            if(typeof req.body.team_one_game_two == "undefined" ){
              
              req.body.team_one_game_two = null;
            }
            if(typeof req.body.team_one_game_three == "undefined" ){
              
              req.body.team_one_game_three = null;
            }
            if(typeof req.body.team_one_game_four == "undefined" ){
              
              req.body.team_one_game_four = null;
            }
            if(typeof req.body.team_one_game_four == "undefined" ){
              
              req.body.team_one_game_four = null;
            }
            if(typeof req.body.team_one_game_five == "undefined" ){
              
              req.body.team_one_game_five = null;
            }
            if(typeof req.body.team_one_game_total == "undefined" ){
              
              req.body.team_one_game_total = null;
            }
            if(typeof req.body.team_one_sets_one == "undefined" ){
              
              req.body.team_one_sets_one = null;
            }
            if(typeof req.body.team_one_sets_two == "undefined" ){
              
              req.body.team_one_sets_two = null;
            }
            if(typeof req.body.team_one_sets_three == "undefined"){
              
              req.body.team_one_sets_three = null;
            }
            if(typeof req.body.team_one_sets_four == "undefined" ){
              
              req.body.team_one_sets_four = null;
            }
            if(typeof req.body.team_one_sets_five == "undefined" ){
              
              req.body.team_one_sets_five = null;
            }
            if(typeof req.body.team_one_sets_total == "undefined" ){
              
              req.body.team_one_sets_total = null;
            }
            if(typeof req.body.team_two_name == "undefined" ){
              
              req.body.team_two_name = null;
            }

            if(typeof req.body.team_two_score == "undefined" ){
              
              req.body.team_two_score = null;
            }
            if(typeof req.body.team_two_description == "undefined" ){
              
              req.body.team_two_description = null;
            }
            if(typeof req.body.team_two_game_one == "undefined"){
              
              req.body.team_two_game_one = null;
            }
            if(typeof req.body.team_two_game_two == "undefined" ){
              
              req.body.team_two_game_two = null;
            }
            if(typeof req.body.team_two_game_three == "undefined" ){
              
              req.body.team_two_game_three = null;
            }
            if(typeof req.body.team_two_game_four == "undefined" ){
              
              req.body.team_two_game_four = null;
            }
            if(typeof req.body.team_two_game_five == "undefined" ){
              
              req.body.team_two_game_five = null;
            }
            if(typeof req.body.team_two_game_total == "undefined"){
              
              req.body.team_two_game_total = null;
            }
            if(typeof req.body.team_two_sets_one == "undefined" ){
              
              req.body.team_two_sets_one = null;
            }
            if(typeof req.body.team_two_sets_two == "undefined" ){
              
              req.body.team_two_sets_two = null;
            }
            if(typeof req.body.team_two_sets_three == "undefined" ){
              
              req.body.team_two_sets_three = null;
            }
            if(typeof req.body.team_two_sets_four == "undefined" ){
              
              req.body.team_two_sets_four = null;
            }
            if(typeof req.body.team_two_sets_total == "undefined"){
              
              req.body.team_two_sets_total = null;
            }
            if(typeof req.body.team_finel_result == "undefined" ){
              
              req.body.team_finel_result = null;
            }
            if(typeof req.body.team_finel_score == "undefined" ){
              
              req.body.team_finel_score = null;
            }

            if(typeof req.body.win_team == "undefined" ){
              
              req.body.win_team = null;
            }

            if(typeof req.body.level == "undefined" ){
              
              req.body.level = null;
            }

            if(typeof req.body.level_timeing == "undefined" ){
              
              req.body.level_timeing = null;
            }

            if(typeof req.body.level_discipline == "undefined" ){
              
              req.body.level_discipline = null;
            }

            if(typeof req.body.level_parameter == "undefined" ){
              
              req.body.level_parameter = null;
            }


          if(typeof req.body.level_value == "undefined" ){
              
              req.body.level_value = null;
            }


            if(typeof req.body.level_point == "undefined" ){
              
              req.body.level_point = null;
            }
            if(typeof req.body.level_position == "undefined" ){
              
              req.body.level_position = null;
            }

            if(typeof req.body.master_id == "undefined" || req.body.master_id ==""){
              
              req.body.master_id = null;
            }
             if(typeof req.body.id == "undefined" || req.body.id ==""){
              
              req.body.id = null;
            }

            if(typeof req.body.participant_one_description =='undefined' || req.body.participant_one_description == ""){

             req.body.participant_one_description = null;

            }

            if(typeof req.body.participant_two_description =='undefined' || req.body.participant_two_description == ""){

             req.body.participant_two_description = null;
             
            }

            
if(req.body.id && req.body.id !== "undefined" && req.body.id !==""){ 

  var updatedata = "UPDATE individual_match_level SET match_no ="+req.body.match_no+",match_level ='"+req.body.match_level+"',participant_finel_result ='"+req.body.participant_finel_result+"',participant_finel_score = '"+req.body.participant_finel_score+"',win_participant = '"+req.body.win_participant+"',participant_one_logo ='"+participant_one_logo+"',participant_one ='"+req.body.participant_one+"',participant_one_score ="+req.body.participant_one_score+",participant_one_game_one ="+req.body.participant_one_game_one+",participant_one_game_two ="+req.body.participant_one_game_two+",participant_one_game_three ="+req.body.participant_one_game_three+",participant_one_game_four ="+req.body.participant_one_game_four+",participant_one_game_five ="+req.body.participant_one_game_five+",participant_one_game_total ="+req.body.participant_one_game_total+",participant_one_sets_one ="+req.body.participant_one_sets_one+",participant_one_sets_two ="+req.body.participant_one_sets_two+",participant_one_sets_three ="+req.body.participant_one_sets_three+",participant_one_sets_four ="+req.body.participant_one_sets_four+",participant_one_sets_five ="+req.body.participant_one_sets_five+",participant_one_sets_total ="+req.body.participant_one_sets_total+",participant_one_description = '"+req.body.participant_one_description+"',participant_two_logo ='"+participant_two_logo+"',participant_two ='"+req.body.participant_two+"',participant_two_score ="+req.body.participant_two_score+",participant_two_game_one ="+req.body.participant_two_game_one+",participant_two_game_two ="+req.body.participant_two_game_two+",participant_two_game_three ="+req.body.participant_two_game_three+",participant_two_game_four ="+req.body.participant_two_game_four+",participant_two_game_five ="+req.body.participant_two_game_five+",participant_two_game_total ="+req.body.participant_two_game_total+",participant_two_sets_one ="+req.body.participant_two_sets_one+",participant_two_sets_two ="+req.body.participant_two_sets_two+",participant_two_sets_three ="+req.body.participant_two_sets_three+",participant_two_sets_four ="+req.body.participant_two_sets_four+",participant_two_sets_five ="+req.body.participant_two_sets_five+",participant_two_sets_total ="+req.body.participant_two_sets_total+",participant_two_description = '"+req.body.participant_two_description+"',team_name_one ='"+req.body.team_name_one+"',team_one_logo ='"+team_one_logo+"',team_one_score ="+req.body.team_one_score+",team_one_description ='"+req.body.team_one_description+"',team_one_game_one ="+req.body.team_one_game_one+",team_one_game_two ="+req.body.team_one_game_two+",team_one_game_three ="+req.body.team_one_game_three+",team_one_game_four ="+req.body.team_one_game_four+",team_one_game_five ="+req.body.team_one_game_five+",team_one_game_total ="+req.body.team_one_game_total+",team_one_sets_one ="+req.body.team_one_sets_one+",team_one_sets_two ="+req.body.team_one_sets_two+",team_one_sets_three ="+req.body.team_one_sets_three+",team_one_sets_four ="+req.body.team_one_sets_four+",team_one_sets_five ="+req.body.team_one_sets_five+",team_one_sets_total ="+req.body.team_one_sets_total+",team_two_name ='"+req.body.team_two_name+"',team_two_logo ='"+team_two_logo+"',team_two_score ="+req.body.team_two_score+",team_two_description ='"+req.body.team_two_description+"',team_two_game_one ="+req.body.team_two_game_one+",team_two_game_two ="+req.body.team_two_game_two+",team_two_game_three ="+req.body.team_two_game_three+",team_two_game_four ="+req.body.team_two_game_four+",team_two_game_five ="+req.body.team_two_game_five+",team_two_game_total ="+req.body.team_two_game_total+",team_two_sets_one ="+req.body.team_two_sets_one+",team_two_sets_two ="+req.body.team_two_sets_two+",team_two_sets_three ="+req.body.team_two_sets_three+",team_two_sets_four ="+req.body.team_two_sets_four+",team_two_sets_total ="+req.body.team_two_sets_total+",team_finel_result ='"+req.body.team_finel_result+"',team_finel_score ='"+req.body.team_finel_score+"',win_team ='"+req.body.win_team+"',level ='"+req.body.level+"',level_timeing ='"+req.body.level_timeing+"' ,level_discipline ="+req.body.level_discipline+",level_parameter ="+req.body.level_parameter+",level_value ="+req.body.level_value+",level_point ="+req.body.level_point+",level_position ="+req.body.level_position+" ,updated_at = now() WHERE id = "+req.body.id+" ";

} 

else{
  var updatedata = `INSERT INTO individual_match_level(master_id,event_id,match_no,match_level,participant_finel_result,participant_finel_score,win_participant,participant_one_logo,participant_one,participant_one_score,participant_one_game_one,participant_one_game_two,participant_one_game_three,participant_one_game_four,participant_one_game_five,participant_one_game_total,participant_one_description,participant_one_sets_one,participant_one_sets_two,participant_one_sets_three,participant_one_sets_four,participant_one_sets_five,participant_one_sets_total,participant_two_logo,participant_two,participant_two_score,participant_two_game_one,participant_two_game_two,participant_two_game_three,participant_two_game_four,participant_two_game_five,participant_two_game_total,participant_two_sets_one,participant_two_sets_two,participant_two_sets_three,participant_two_sets_four,participant_two_sets_five,participant_two_sets_total,participant_two_description,team_name_one,team_one_logo,team_one_score,team_one_description,team_one_game_one,team_one_game_two,team_one_game_three,team_one_game_four,team_one_game_five,team_one_game_total,team_one_sets_one,team_one_sets_two,team_one_sets_three,team_one_sets_four,team_one_sets_five,team_one_sets_total,team_two_name,team_two_logo,team_two_score,team_two_description,team_two_game_one,team_two_game_two,team_two_game_three,team_two_game_four,team_two_game_five,team_two_game_total,team_two_sets_one,team_two_sets_two,team_two_sets_three,team_two_sets_four,team_two_sets_total,team_finel_result,team_finel_score,win_team,level,level_timeing,level_discipline,level_parameter,level_value,level_position,level_point,created_at,status )
         VALUES (${req.body.master_id},${req.body.event_id},${req.body.match_no},'${req.body.match_level}','${req.body.participant_finel_result}','${req.body.participant_finel_score}','${req.body.win_participant}','${participant_one_logo}','${req.body.participant_one}',${req.body.participant_one_score},${req.body.participant_one_game_one},${req.body.participant_one_game_two},${req.body.participant_one_game_three},${req.body.participant_one_game_four},${req.body.participant_one_game_five},${req.body.participant_one_game_total},'${req.body.participant_one_description}',${req.body.participant_one_sets_one},${req.body.participant_one_sets_two},${req.body.participant_one_sets_three},${req.body.participant_one_sets_four},${req.body.participant_one_sets_five},${req.body.participant_one_sets_total},'${participant_two_logo}','${req.body.participant_two}',${req.body.participant_two_score},${req.body.participant_two_game_one},${req.body.participant_two_game_two},${req.body.participant_two_game_three},${req.body.participant_two_game_four},${req.body.participant_two_game_five},${req.body.participant_two_game_total},${req.body.participant_two_sets_one},${req.body.participant_two_sets_two},${req.body.participant_two_sets_three},${req.body.participant_two_sets_four},${req.body.participant_two_sets_five},${req.body.participant_two_sets_total},'${req.body.participant_two_description}','${req.body.team_name_one}','${team_one_logo}',${req.body.team_one_score},'${req.body.team_one_description}',${req.body.team_one_game_one},${req.body.team_one_game_two},${req.body.team_one_game_three},${req.body.team_one_game_four},${req.body.team_one_game_five},${req.body.team_one_game_total},${req.body.team_one_sets_one},${req.body.team_one_sets_two},${req.body.team_one_sets_three},${req.body.team_one_sets_four},${req.body.team_one_sets_five},${req.body.team_one_sets_total},'${req.body.team_two_name}','${team_two_logo}',${req.body.team_two_score},'${req.body.team_two_description}',${req.body.team_two_game_one},${req.body.team_two_game_two},${req.body.team_two_game_three},${req.body.team_two_game_four},${req.body.team_two_game_five},${req.body.team_two_game_total},${req.body.team_two_sets_one},${req.body.team_two_sets_two},${req.body.team_two_sets_three},${req.body.team_two_sets_four},${req.body.team_two_sets_total},'${req.body.team_finel_result}','${req.body.team_finel_score}','${req.body.win_team}','${req.body.level}','${req.body.level_timeing}','${req.body.level_discipline}','${req.body.level_parameter}','${req.body.level_value}','${req.body.level_position}','${req.body.level_point}',now(),1)RETURNING id;`;
    }

       console.log('cccccccccccccccccccccccc');
       console.log(updatedata); 

       await db.query(updatedata);
       console.log('updatedata.......................');
       console.log(updatedata);
    
  }
  catch(err){
    console.log('err');
    console.log(err);
    result = {}; 

  }
}

const updatestatastic = async (req,res) => {
  let result = {};
  try{
        console.log("dfffffffffffffffffffffffff");

        var bannerPath = 'images/performance/';
        
        //if(typeof req.body.statistic_logo !=='undefined' && req.body.statistic_logo !=="")
        var stac_log = req.body.statistic_logo; 
        var statistic_logo = '';

            if (stac_log && typeof stac_log !=="undefined" && stac_log.length > 0) {
            var logo_data = helper.uploadBase64(stac_log, bannerPath);

              statistic_logo = logo_data.path;
              
            }
            // else{
            //   statistic_logo = null;
            // }

            if(typeof req.body.statistic_name == "undefined" && req.body.statistic_name == ""){

              req.body.statistic_name = null;
            }

            if( typeof req.body.statistic_val == "undefined" && req.body.statistic_val == ""){

              req.body.statistic_val = null;
            }

            if( typeof req.body.stac_game_one == "undefined" && req.body.stac_game_one == ""){

              req.body.stac_game_one = null;
            }

            if(typeof req.body.stac_game_two == "undefined" && req.body.stac_game_two == ""){

              req.body.stac_game_two = null;
            }

            if( typeof req.body.stac_game_three == "undefined" && req.body.stac_game_three == ""){

              req.body.stac_game_three = null;
            }

            if(typeof req.body.stac_game_four == "undefined" && req.body.stac_game_four == ""){

              req.body.stac_game_four = null;
            }

            if( typeof req.body.stac_game_five == "undefined" && req.body.stac_game_five == ""){

              req.body.stac_game_five = null;
            }

            if( typeof req.body.stac_game_total == "undefined" && req.body.stac_game_total == ""){

              req.body.stac_game_total = null;
            }

            if( typeof req.body.stac_sets_one == "undefined" && req.body.stac_sets_one == ""){

              req.body.stac_sets_one = null;
            }
            if( typeof req.body.stac_sets_two == "undefined" && req.body.stac_sets_two == ""){

              req.body.stac_sets_two = null;
            }
            if( typeof req.body.stac_sets_three == "undefined" && req.body.stac_sets_three == ""){

              req.body.stac_sets_three = null;
            }
            if( typeof req.body.stac_sets_four == "undefined" && req.body.stac_sets_four == ""){

              req.body.stac_sets_four = null;
            }
            if( typeof req.body.stac_sets_five == "undefined" && req.body.stac_sets_five == ""){

              req.body.stac_sets_five = null;
            }
            if( typeof req.body.statistic_type == "undefined" && req.body.statistic_type == ""){

              req.body.statistic_type = null;
            }
            if(typeof req.body.stac_sets_total == "undefined" && req.body.stac_sets_total == ""){

              req.body.stac_sets_total = null;
            }

      if(req.body.id  && req.body.id !== "undefined" && req.body.id !==""){
        
      var updatedata = "update individual_statistic SET event_id = "+req.body.event_id+",statistic_name ='"+req.body.statistic_name+"',statistic_val = '"+req.body.statistic_val+"',stac_game_one ='"+req.body.stac_game_one+"',stac_game_two = '"+req.body.stac_game_two+"',stac_game_three = '"+req.body.stac_game_three+"',stac_game_four = '"+req.body.stac_game_four+"',stac_game_five = '"+req.body.stac_game_five+"',stac_game_total = '"+req.body.stac_game_total+"',stac_sets_one = '"+req.body.stac_sets_one+"',stac_sets_two = '"+req.body.stac_sets_two+"',stac_sets_three = '"+req.body.stac_sets_three+"',stac_sets_four = '"+req.body.stac_sets_four+"',stac_sets_five = '"+req.body.stac_sets_five+"',statistic_type = '"+req.body.statistic_type+"',statistic_logo = '"+statistic_logo+"',stac_sets_total = '"+req.body.stac_sets_total+"',updated_at = now() WHERE id = "+req.body.id+" ";
      
      }
      else{
      
      var updatedata = `INSERT INTO individual_statistic(statistic_name,event_id,ml_id,statistic_val,stac_game_one,stac_game_two,stac_game_three,stac_game_four,stac_game_five,stac_game_total,stac_sets_one,stac_sets_two,stac_sets_three,stac_sets_four,stac_sets_five,statistic_type,statistic_logo,stac_sets_total,created_at,status )VALUES ('${req.body.statistic_name}',${req.body.event_id},${req.body.ml_id},'${req.body.statistic_val}','${req.body.stac_game_one}','${req.body.stac_game_two}','${req.body.stac_game_three}', '${req.body.stac_game_four}','${req.body.stac_game_five}','${req.body.stac_game_total}','${req.body.stac_sets_one}','${req.body.stac_sets_two}','${req.body.stac_sets_three}','${req.body.stac_sets_four}','${req.body.stac_sets_five}','${req.body.statistic_type}','${statistic_logo}','${req.body.stac_sets_total}',now(),1);`;

      }
        console.log('updatedata.........................');
       console.log(updatedata);

       await db.query(updatedata);


       console.log('updatedata.........................');
       console.log(updatedata);
    
  }
  catch(err){
    console.log('err');
    console.log(err);
    result = {};

  }
}

const deleteperformance = async (req, res)=>{
 let result = {};
try{

  let deletedata = "UPDATE individual_performance SET status = 2 ,updated_at = now() WHERE id = "+req.body.id+" " 

  await db.query(deletedata);

}
catch(err){

  result = {};

}
}

const deletevent = async (req, res)=>{
 let result = {};
try{

  let deletedata = "UPDATE individual_event SET status = 2 ,updated_at = now() WHERE id = "+req.body.id+" " ;

   console.log('deletedata');
  console.log(deletedata);

  await db.query(deletedata);

}
catch(err){
  console.log('err');
console.log(err);
  result = {};

}
}

const deletmatchlevel = async (req, res)=>{
 let result = {};
try{

  let deletedata = "UPDATE individual_match_level SET status = 2 ,updated_at = now() WHERE id = "+req.body.id+" " ;

console.log("ggggggggg");
  console.log(deletedata);

  await db.query(deletedata);

}
catch(err){
 console.log('err');
console.log(err);
  result = {};

}
}

const deletstatistic = async (req, res)=>{
 let result = {};
try{

  let deletedata = "UPDATE individual_statistic SET status = 2 ,updated_at = now() WHERE id = "+req.body.id+" " 

  console.log(deletedata);

  await db.query(deletedata);

}
catch(err){
 console.log('err');
console.log(err);
  result = {};

}
}

 
const listbysubscriberid = async (req, res) => {
    let result = {};
    try {
        let listStr = "SELECT ip.*,s.sports_name ,sb.sub_sports_name,v.venue_name,c.city_name,st.state_name,ct.name FROM individual_performance as ip LEFT join venue as v on v.id = ip.venue_id LEFT join sub_sports as sb on sb.sub_sports_id = ip.subsport_id LEFT join city as c on c.id = ip.city_id LEFT join state as st on st.id = ip.state_id LEFT join country as ct on ct.id = ip.country_id LEFT join sports as s on ip.sport_id = s.id where ip.status = 1 and ip.subscriber_id = '"+req.body.subscriber_id+"'";
        let dataResult = await db.query(listStr); 
        result = dataResult.rows;
    } catch (err) {
        console.log("err: ");
        console.log(err);
        result = {};
    }
    return result;
}


const checksportdublicate = async(req,res) =>{
try{
     const result = {};
      if(req.body.sport_id && req.body.sport_id !== 'undefined' && req.body.sport_id !== " "){
        var sportdata =  "SELECT sport_id from performance_sport_master where status = 1 and sport_id = "+req.body.sport_id+"";  

        var sportt =  await db.query(sportdata);
        var sportsinfo = sportt.rows;

        console.log(sportsinfo);
         

         if(sportsinfo && sportsinfo !== 'undefined' && sportsinfo !== "" && sportsinfo.length > 0){
         
         
         result.message = "please select another sport to add template..."; 
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


const performanceedit = async(req,res) =>{
  try{
           const result  = {};
           if(req.body.id && req.body.id !=="undefined" && req.body.id !==""){

             var performance ="SELECT * FROM individual_performance where status = 1";
             var performacedata = await db.query(performance);
              result[0]['performacinfo'] =  (performacedata.rows);

             var prid = performacinfo.rows[0].id;

             var  event = "SELECT * from individual_event where status = 1 and "+prid+" = master_id";

             var  eventdata = await db.query(event);
               result['eventinfo'] = (eventdata.rowCount);

             var event_id = eventinfo[0].result;

           }
  }
  catch(err){

  }
}

 

module.exports = {
  addperformancesport,  
  performancelist,
  performancelist_byid,
  deleteperformancesport,
  performanceupdatedata,
  addindividualperformance,
  individual_performancebyid,
  performanceDelete,
  performanceUpdate,
  individual_performanceMast,
  individual_eventMast,
  individual_matchlevelMast,
  individual_stacMast,
  eventlist,
  individual_performancelist,
  indimatchlevelMastlist,
  indistacMastlist,
  indimatchlevelInfo,
  indieventInfo,
  indistatisticInfo,
  indiperformanceInfo,
  updatePerformance,
  updateEvent,
  updateMatchlavel,
  updatestatastic,
  deleteperformance,
  deletevent,
  deletmatchlevel,
  deletstatistic,
  listbysubscriberid,
  checksportdublicate,
  performanceedit

}