const {Schema} = require('../../model/schema');
const { idCounter } = require("../../helper/counter");
const validate = require("../../helper/validate");
const moment = require('moment');
const {queryMongo,mongoose} = require('../../mongodb');
let todays_dt = moment().format("YYYY-MM-DD HH:mm:ss");

module.exports = {
    

    Add: async (req, res) => {
        try {
            const { academy_id,role_id, academy_name,centre_name, location, sports, person_incharge,designation,identification_id,contact_no,is_coach,email_id,forms, status } = req.body;
        
            
            let CollectionName = "leveldata";
            let campaignCollection = mongoose.model(CollectionName, Schema.leveldata);
        
            const _counter = await idCounter(campaignCollection, 'id');
            console.log('COUNTER _ :: ', _counter);
        
            const _insertData = {
                id: _counter,
                delete_status: 1,
                created_at: todays_dt
            };
            const lastInsertedId = _insertData.id;

            console.log('Inserted IDs:', lastInsertedId);
            if (is_coach) _insertData.is_coach = is_coach;
            if (role_id) _insertData.role_id = role_id;
            if (academy_id) _insertData.academy_id = academy_id;
            if (academy_name) _insertData.academy_name = academy_name;
            if (centre_name) _insertData.centre_name = centre_name;
            if (location) _insertData.location = location;
            if (sports) _insertData.sports = sports;
            if (person_incharge) _insertData.person_incharge = person_incharge;
            if (status) _insertData.status = status;
            if (designation) _insertData.designation = designation;
            if (identification_id) _insertData.identification_id = identification_id;
            if (contact_no) _insertData.contact_no = contact_no;
            if (email_id) _insertData.email_id = email_id;` `
            if (forms) _insertData.forms = forms;


            
            let addCampaign = await campaignCollection.insertMany([_insertData]);

           
        
        
            if (addCampaign.length > 0) {
                res.send({
                    api_version: "v1",
                    success: true,
                    message: 'Data added successfully..!',
                    id:lastInsertedId
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
            let CollectionName = "leveldata";
            let dtmfCollection = mongoose.model(CollectionName, Schema.leveldata);
            let result = await dtmfCollection.find({status:1}).sort({ id: -1 });
            
            let Collection = "sports";
            let Sport = mongoose.model(Collection, Schema.sports);
            let sports = await Sport.find({});
            
            let sportMap = {};
            sports.forEach((sport) => {
                sportMap[sport.id] = sport.sport_name;
            });
            
            result = result.map((item) => {
                let sportIds = item.sports.split(',').map((id) => Number(id));
                let sportNames = sportIds.map((id) => sportMap[id]);
                return {
                    ...item.toObject(),
                    sportNames: sportNames
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
                message: "something wentwrong....!",
                api_version:"v1",
                data: error.message
            })
        } 
    },

    Edit: async (req, res) => {
        try {
            let CollectionName = "leveldata";
            let dtmfCollection = mongoose.model(CollectionName, Schema.leveldata);
            let result = await dtmfCollection.findOne({ status: 1, id: req.body.id });
        
            if (result) {
                let Collection = "sports";
                let Sport = mongoose.model(Collection, Schema.sports);
                let sports = await Sport.find({});
        
                let sportMap = {};
                sports.forEach((sport) => {
                    sportMap[sport.id] = sport.sport_name;
                });
        
                // Assuming result is an array of documents, if not, you can create an array like [result]
                result = [result].map((item) => {
                    let sportIds = item.sports.split(',').map((id) => Number(id));
                    let sportNames = sportIds.map((id) => sportMap[id]);
                    return {
                        ...item.toObject(),
                        sportNames: sportNames
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
            } else {
                
                res.send({
                    success: false,
                    message: "No record found for the given ID.",
                    api_version: "v1",
                    data: []
                });
            }
        } catch (error) {
            console.log(error);
            res.send({
                success: false,
                message: "something went wrong....!",
                api_version: "v1",
                data: error.message
            })
        }
        
    },

    Update:async(req,res)=>{
        try{
          
          
           let updatedata = {
            
            updated_at: todays_dt,
            
            
        }
        
           let CollectionName ="leveldata";
           let adminCollection = mongoose.model(CollectionName, Schema.leveldata);
           updatedata.id = req.body.id;
           updatedata.academy_id = req.body.academy_id;
          updatedata.academy_name = req.body.academy_name;
           updatedata.centre_name = req.body.centre_name;
           updatedata.is_coach = req.body.is_coach;
           updatedata.location = req.body.location;
           updatedata.person_incharge = req.body.person_incharge;
           updatedata.designation = req.body.designation;
           updatedata.identification_id = req.body.identification_id;
           updatedata.contact_no = req.body.contact_no;
           updatedata.email_id = req.body.email_id;
           updatedata.forms = req.body.forms;
          
           updatedata.sports = req.body.sports;
            const lastInsertedId = req.body.id;


           let result = await adminCollection.updateOne({id: req.body.id},updatedata);
          if (result) {
            res.send({
              success: true,
              message: "Updated Successfully....",
              id: lastInsertedId,
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

    delete: async (req, res) => {
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
              let oollectionname = "leveldata";
              
              let collection = mongoose.model(oollectionname, Schema.leveldata);
              
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


      MenuList: async (req, res) => {
      //   try {
      //     let CollectionName = "leveldata";
      //     let Collection = mongoose.model(CollectionName, Schema.leveldata);
          
      //     let results = await Collection.find({
      //         status: 1,
      //         id: req.body.id,
      //         role_id: req.body.role_id,
      //         academy_id: req.body.academy_id
      //     });
          
      //     if (results.length > 0) {
      //         for (const result of results) {
      //             console.log(result.forms);
                  
      //         }
              
      //         res.send({
      //             success: true,
      //             message: "Menu list fetched...",
      //             api_version: "v1",
      //             data: results.map(result => result.forms)
      //         });
      //     } else {
      //         res.send({
      //             success: true,
      //             message: "no record found..",
      //             api_version: "v1",
      //             data: []
      //         });
      //     }
      
      // } catch (error) {
      //     console.log(error);
      //     res.send({
      //         success: false,
      //         message: "something went wrong....!",
      //         api_version: "v1",
      //         data: error.message
      //     });
      // }

      try {
        // Define collection names and models
        let CollectionName = "leveldata";
        let Collection = mongoose.model(CollectionName, Schema.leveldata);
        
        let CollectionMenu = mongoose.model("menu", Schema.Menu);
        
        // Find documents in the leveldata collection matching the given criteria
        let { level_id, role_id, academy_id } = req.body;

       

            let query = {
                status: 1
            };

            if (level_id) {
                query.id = level_id;
            }

            if (role_id) {
                query.role_id = role_id;
            }

            if (academy_id) {
                
                query.academy_id = academy_id;
            }

        let levelDataResults = await Collection.find(query);
        
        if (levelDataResults.length > 0) {
           
            let allMenuData = [];
            
            for (const result of levelDataResults) {
                // Loop through each menu ID in the forms field and fetch corresponding menu data
                for (const menuId of result.forms) {
                    let menuData = await CollectionMenu.findOne({
                        
                        id: menuId
                    });
                    console.log("menuData................")
                    console.log(menuData);
                    if (menuData) {
                        allMenuData.push(menuData);
                    }
                }
            }
            
            // Map the allMenuData array to get the required menu list
                let menuList = allMenuData.map(menuData => {
                // Map the menuData to get the required fields
                // Adjust the mapping according to the actual structure of your menu documents
                return {
                  id:menuData.id,
                  profile_id:menuData.profile_id,
                  class:menuData.class,
                  path:menuData.path,
                  title: menuData.title,
                  iconType:menuData.iconType,
                  icon:menuData.icon,
                  role:menuData.role,
                  submenu:menuData.submenu

                    
                    // Add other fields as needed
                };
            });
            
            res.send({
                success: true,
                message: "Menu list fetched...",
                api_version: "v1",
                data: menuList
            });
        } else {
            res.send({
                success: true,
                message: "No record found..",
                api_version: "v1",
                data: []
            });
        }
    
    } catch (error) {
        console.log(error);
        res.send({
            success: false,
            message: "Something went wrong....!",
            api_version: "v1",
            data: error.message
        });
    }
    
      
    },

}