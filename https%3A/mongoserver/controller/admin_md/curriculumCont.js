const {Schema} = require('../../model/schema');
const { idCounter } = require("../../helper/counter");
const validate = require("../../helper/validate");
const moment = require('moment');
const {queryMongo,mongoose} = require('../../mongodb');
let todays_dt = moment().format("YYYY-MM-DD HH:mm:ss");

module.exports = {
    

    Add: async (req, res) => {
        try {
            const { academy_id,academy_name,level_id,level_name,skill,technique,sports,drill,video_link,description } = req.body;
        
            
            let CollectionName = "Curriculumdata";
            let CurriculumCollection = mongoose.model(CollectionName, Schema.Curriculumdata);
        
            const _counter = await idCounter(CurriculumCollection, 'id');
            console.log('COUNTER _ :: ', _counter);
        
            const _insertData = {
                id: _counter,
                status: 1,
                created_at: todays_dt
            };
            
           
            if (academy_id) _insertData.academy_id = academy_id;
            if (academy_name) _insertData.academy_name = academy_name;
            if (level_id) _insertData.level_id = level_id;
            if (level_name) _insertData.level_name = level_name;

            if (skill) _insertData.skill = skill;
            if (technique) _insertData.technique = technique;
            if (sports) _insertData.sports = sports;
            if (drill) _insertData.drill = drill;
            if (video_link) _insertData.video_link = video_link;
            if (description) _insertData.description = description;
            
            
            
            
            let addCurriculum = await CurriculumCollection.insertMany([_insertData]);
        
            if (addCurriculum.length > 0) {
                res.send({
                    api_version: "v1",
                    success: true,
                    message: 'Data added successfully..!',
                    data: []
                });
            } else {
                res.send({
                    api_version: "v1",
                    success: false,
                    message: 'Data Can Not Be Added ..!',
                    data: []
                });
            }
        } catch (error) {
            console.log(error);
            res.send({
                api_version: "v1",
                success: false,
                message: 'Something Went Wrong...',
                data: error
            });
        }
        
    },


    List: async (req, res) => {
      try {
        let CollectionName = "Curriculumdata";
        let dtmfCollection = mongoose.model(CollectionName, Schema.Curriculumdata);
        let result = await dtmfCollection.find({ status: 1 }).sort({ id: -1 });;
    
        let Collection = "sports";
        let Sport = mongoose.model(Collection, Schema.sports);
        let sports = await Sport.find({});
    
        let sportMap = {};
        sports.forEach((sport) => {
            sportMap[sport.id] = sport.sport_name;
        });
    
        result = result.map((item) => {
            // Ensure that item.sports is an array
            let sportIds = Array.isArray(item.sports) ? item.sports.map((id) => Number(id)) : [Number(item.sports)];
            let sportNames = sportIds.map((id) => sportMap[id]).join(', '); // Concatenate sport names
    
            return {
                ...item.toObject(),
                sportname: sportNames
            };
        });
    
        if (result.length > 0) {
            res.send({
                success: true,
                message: "level list fetched...",
                api_version: "v1",
                data: result
            });
        } else {
            res.send({
                success: false,
                message: "no record found..",
                api_version: "v1",
                data: result
            });
        }
    } catch (error) {
        console.log(error);
        res.send({
            success: false,
            message: "something went wrong....!",
            api_version: "v1",
            data: error.message
        });
    }
    
    
  },

  Edit: async (req, res) => {
    try {
      let CollectionName = "Curriculumdata";
      let dtmfCollection = mongoose.model(CollectionName, Schema.Curriculumdata);
      const result = await dtmfCollection.findOne({ status: 1, id: req.body.id });
  
      if (result) {
          let Collection = "sports";
          let Sport = mongoose.model(Collection, Schema.sports);
          let sports = await Sport.find({});
  
          let sportMap = {};
          sports.forEach((sport) => {
              sportMap[sport.id] = sport.sport_name;
          });
  
          // Ensure that item.sports is an array
          let sportIds = Array.isArray(result.sports) ? result.sports.map((id) => Number(id)) : [Number(result.sports)];
          let sportNames = sportIds.map((id) => sportMap[id]).join(', '); // Concatenate sport names
  
          // Modify the result object to include the sport names
          result.sportname = sportNames;
          
          
  
          res.send({
              success: true,
              message: "level fetched...",
              api_version: "v1",
              data: result
          });
      } else {
          res.send({
              success: false,
              message: "no record found..",
              api_version: "v1",
              data: null // Send null data if no record is found
          });
      }
  } catch (error) {
      console.log(error);
      res.send({
          success: false,
          message: "something went wrong....!",
          api_version: "v1",
          data: error.message
      });
  }
  
},



    
   

    Update:async(req,res)=>{
        try{
          
          
           let updatedata = {
            
            updated_at: todays_dt,
            
            
        }
           
           let CollectionName ="Curriculumdata";
           let adminCollection = mongoose.model(CollectionName, Schema.Curriculumdata);
          
           updatedata.academy_id = req.body.academy_id;
           updatedata.academy_name = req.body.academy_name;
           updatedata.skill = req.body.skill;
           updatedata.level_id = req.body.level_id;
           updatedata.technique = req.body.technique;
           updatedata.sports = req.body.sports;
           updatedata.drill = req.body.drill;
           updatedata.video_link = req.body.video_link;
           updatedata.description = req.body.description;
          
           updatedata.id = req.body.id;



           let result = await adminCollection.updateOne({id: req.body.id},updatedata);
          if (result) {
            res.send({
              success: true,
              message: "Updated Successfully....",
              data: result,
            });
          } else {
            res.send({
              success: false,
              message: "Update Not successfully...",
              data: [],
            });
          }
        } catch (error) {
          res.send({
            success: false,
            message: "something went wrong...!",
            data: error.message,
          });
        }

    },

    Delete: async (req, res) => {
        const validationRule = {
          id: "required",
        };
        validate(req.body, validationRule, {}, async (err, status) => {
          if (!status) {
            res.send({
              success: false,
              message: "Validation error....!",
              data: err,
            });
          } else {
            try {
              let oollectionname = "Curriculumdata";
              
              let collection = mongoose.model(oollectionname, Schema.Curriculumdata);
              
              let result = await collection.updateOne({id: req.body.id},{status:2});

              console.log(result)
              if (result) {
                res.send({
                  success: true,
                  message: "Deleted Successfully",
                  data: result,
                });
              } else {
                res.send({
                  success: false,
                  message: "Deleted Un successfully",
                  data: [],
                });
              }
            } catch (error) {
              res.send({
                success: false,
                message: "something went wrong...!",
                data: error.message,
              });
            }
          }
        });
      },
}