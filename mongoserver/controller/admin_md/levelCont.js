const {Schema} = require('../../model/schema');
const { idCounter } = require("../../helper/counter");
const validate = require("../../helper/validate");
const moment = require('moment');
const {queryMongo,mongoose} = require('../../mongodb');
// const db = require('/var/www/code/play_actio_api/server/db');
const db = require('../../../server/db');


let todays_dt = moment().format("YYYY-MM-DD HH:mm:ss");
const { sendEmail } = require('../../helper/sendmail');
const async = require('async');

module.exports = {
    

    Add: async (req, res) => {

                try {
                    const dataToInsert = req.body; // Assuming req.body is an array of data documents

                    const CollectionName = "leveldata";
                    const campaignCollection = mongoose.model(CollectionName, Schema.leveldata);



                    let tasksCompleted = 0; // Counter to track completed tasks
                    const totalTasks = dataToInsert.length; // Total number of tasks

                    // Create an async queue to process data records
                    const queue = async.queue(async (data, callback) => {
                    const {
                     academy_id,role_id,centre_name, location, sports, person_incharge,designation,identification_id,contact_no,is_coach,email_id,forms,subscriberID,add_by,status
                    } = data;

                    console.log('Email to send:');
                    console.log(email_id);

                    const Checkemail = "select id,email_id from subscriber where email_id = $1 and status = 1";
                    const queryResult = await db.query(Checkemail, [email_id]);
                    console.log('Query result:', queryResult.rowCount);

                    console.log(queryResult);
                    //console.log(queryResult.rows[0].id);

                    console.log("queryResultiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii"); 


                    
                    // await campaignCollection.update(
                    //     { email_id: email_id }, 
                    //     { $set: { subscriberID: queryResult.rows[0].id } }
                    // );

                    let academyname = mongoose.model("Mainaccounts",Schema.Mainaccounts);
                    let academy_name = await academyname.findOne({id:academy_id});


                    if (queryResult.rowCount > 0) {
                      // If email exists in the subscriber collection, send an "Account Created" email
                      const emailData = {
                        to: email_id,
                        subject: `Account Created at ${academy_name.academy_name}`,
                        text: `You have been added to the staff of ${academy_name.academy_name}. If you wish to log in, please use the following link.http://18.117.233.92/AcademyAdmin/authentication/signin`,
                        //text: `Your account at ${academy_name} has been successfully created`,
                      };

                      sendEmail(emailData.to, emailData.subject, emailData.text);
                    } else {
                      // If email does not exist in the subscriber collection, send a "Welcome" email
                      const emailData = {
                        to: email_id,
                        subject: `Account Created at ${academy_name.academy_name}`,
                        text: `If you dont have Actio Sport account First you have  to register from here http://18.117.233.92/AcademyAdmin/authentication/signin
                        Please make sure that your mobile number and email id is same as you have provided`,
                        text: `Thank you for joining ${academy_name.academy_name}. Your account will be created shortly..`,
                      };

                      sendEmail(emailData.to, emailData.subject, emailData.text);
                    }

                    const _counter = await idCounter(campaignCollection, 'id');
                    console.log('COUNTER _ :: ', _counter);

                    const _insertData = {
                      id: _counter,
                      status: 1,
                      created_at: todays_dt,
                      // Rest of your data fields
                    };

                    // Merge _insertData with the current data document 
                    const finalInsertData = { ..._insertData, ...data };   

                    const menudata={
                        level_id:_counter,
                        menu_id:forms,
                        academy_id:academy_id,
                        role_id:3
                    }

                    let CollectionName = "menupermissions";
                    let adminCollection = mongoose.model(CollectionName, Schema.menupermissions);

                    await adminCollection.insertMany(menudata);

                    const addCampaign = await campaignCollection.insertMany(finalInsertData);

                    if (queryResult.rows[0] !== undefined) {
                      await campaignCollection.updateOne(
                        { email_id: email_id },
                        { $set: { subscriberID: queryResult.rows[0].id } }
                      );
                    } 

                    if (addCampaign.insertedCount === 1) {
                      console.log('Data added successfully for email:', email_id);
                    } else {
                      console.error('Data could not be added for email:', email_id);
                    }

                    tasksCompleted++; // Increment the counter for completed tasks
                    callback(); // Signal that this task is complete

                    // Check if all tasks are completed and send the response
                    if (tasksCompleted === totalTasks) {
                      res.send({
                        api_version: "v1",
                        success: true,
                        message: 'Data added successfully..!',
                        level_id: _counter 
                      });
                    }
                  }, 1); // Limit concurrency to 1 task at a time (adjust as needed)

                  // Enqueue data records for processing
                  dataToInsert.forEach((data) => {
                    queue.push(data);
                  });
                } catch (error) {
                  console.error(error);
                  res.send({
                    api_version: "v1",
                    success: false,
                    message: 'Something Went Wrong...',
                    data: error,
                  });
                }

       
        
    },

    List: async (req, res) => {

      console.log()
        try {
            let CollectionName = "leveldata";
            let levelCollection = mongoose.model(CollectionName, Schema.leveldata);
            let result = {};

            if(req.query.id && req.query.id!== null && req.query.id !== 'undefined')
            {
                result = await levelCollection.find({status:1,add_by:req.myID,academy_id:req.query.id}).sort({ id: -1 });
            }

            else
            {
                 result = await levelCollection.find({status:1,add_by:req.myID}).sort({ id: -1 });
            }

            let Collection = "sports";
            let Sport = mongoose.model(Collection, Schema.sports);
            let sports = await Sport.find({});

            console.log(result);
            console.log("result---------------------------");

            const uniqueCoachIds = [...new Set(result.flatMap((document) => document.person_incharge))];

            console.log(uniqueCoachIds);
            console.log("uniqueCoachIds...............")

            const staffCollection = mongoose.model("staffdatas", Schema.staffdatas);
            const staffList = await staffCollection.find({ id: { $in: uniqueCoachIds } });

            console.log(staffList);
            console.log("staffList-----------------------...............")

            const staffMap = {};
            // staffList.forEach(level => {
            //     staffMap[level.id] = level.staff_name;
            //     staffMap[level.id] = level.staff_last_name;
            // });

            staffList.forEach(level => {
              // Create an object to hold both staff_name and staff_last_name
              staffMap[level.id] = {
                staff_name: level.staff_name,
                staff_last_name: level.staff_last_name
              };
            }); 
            

            console.log(staffMap);
            console.log("staffMap-----------------------...............")

            let sportMap = {};
            sports.forEach((sport) => {
                sportMap[sport.id] = sport.sport_name;
            });

            result = result.map((item) => {
                let sportIds = item.sports.split(',').map((id) => Number(id));
                let sportNames = sportIds.map((id) => sportMap[id]);
                let inchargeName = staffMap[item.person_incharge]; // Get the staff_name for person_incharge

                console.log(inchargeName);
                console.log("inchargeName.............."); 
                return {
                    ...item.toObject(),
                    sportNames: sportNames,
                    
                    staff_name: inchargeName?.staff_name ?? null,
                    staff_last_name: inchargeName?.staff_last_name ?? null, // Add the staff_name to the result
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
            }) 
        }

    },

    Edit: async (req, res) => {
        try {
            let CollectionName = "leveldata";
            let levelCollection = mongoose.model(CollectionName, Schema.leveldata);
            let result = await levelCollection.findOne({ status: 1, id: req.body.id });
        
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
           let menuCollection = mongoose.model('menupermission', Schema.menupermissions);
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


            await menuCollection.updateOne(
              { id: req.body.id },
              { $set: { menupermissions: updatedata.forms } }
          );
          
           let result = await adminCollection.updateOne({id: req.body.id},updatedata);
          if (result) {
            res.send({
              success: true,
              message: "Updated Successfully....",
              level_id: lastInsertedId,
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