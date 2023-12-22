const {Schema} = require('../../model/schema');
const ACTIVE_STATUS = process.env.ACTIVE_STATUS;
const {queryMongo,mongoose} = require('../../mongodb');
const { idCounter } = require("../../helper/counter");
const moment = require('moment');
const validate = require("../../helper/validate");

module.exports = {

Add: async(req,res)=>{

    try {
        let todays_dt = moment().format("YYYY-MM-DD HH:mm:ss");
        let CollectionName = "menu";
        let adminCollection = mongoose.model(CollectionName, Schema.Menu);
        console.log(req.body);
    
        for (const inputData of req.body) {
            const _counter = await idCounter(
                adminCollection,
                'id'
            );
    
            const _insertData = {
                id: _counter,
                created_at: todays_dt,
                status: 1,
                ...inputData, 
            };
    
            console.log('Inserting data:');
            console.log(_insertData);
    
            try {
                let result = await adminCollection.insertMany([_insertData]);
                
            } catch (err) {
                console.error(err);
                
            }
        }
    
        res.send({
            success: true,
            message: "Data sent...",
            api_version: "v1",
            data: req.body, 
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
    


},

Update: async(req,res)=>{

    try {
        let CollectionName = "menupermistion";
        let adminCollection = mongoose.model(CollectionName, Schema.menupermistion);
        console.log(req.body);
      
        let { level_id, role_id, academy_id } = req.body;
      
        // Create a query object with the conditions
        let query = {};
      
        if (level_id) {
          query.level_id = parseInt(level_id, 10);
        }
      
        if (role_id) {
          query.role_id = role_id;
        }
      
        if (academy_id) {
          query.academy_id = academy_id;
        }
      
        const _insertData = {
          ...req.body, // Use the entire req.body as the update data
        };
      
        console.log('Inserting data:');
        console.log(_insertData);
      
        try {
          // Update the document based on the query conditions
          let result = await adminCollection.updateOne(query, _insertData);
      
          // Handle the result if needed
          if (result.nModified > 0) {
            // The document was updated
            console.log('Document updated successfully');
          } else {
            // The document was not updated, it may not have met the conditions
            console.log('No matching document found for update');
          }
        } catch (err) {
          console.error(err);
          // Handle the error if needed
        }
      
        res.send({
          success: true,
          message: "Data sent...",
          api_version: "v1",
          data: req.body,
        });
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
      }
      

},

List: async (req, res) => {
    try {
        let CollectionName = "menus"
        let dtmfCollection = mongoose.model(CollectionName,Schema.Menu)

        let result = await dtmfCollection.find({role: { $ne: 1 }})
        if (result.length > 0) {
            res.send({
                success: true,
                message: "Sport list fetched...",
                api_version:"v1",
                data: result
            })
        } else {
            res.send({
                success: false,
                message: "no record found..",
                api_version:"v1",
                data: result
            })
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

Menupermistion: async (req, res) => {
    // try {

    //     let todays_dt = moment().format("YYYY-MM-DD HH:mm:ss");
    //     const { menu_id,sub_menu_id,role_id,academy_id,level_id } = req.body;
    
        
    //     let CollectionName = "menupermistion";
    //     let campaignCollection = mongoose.model(CollectionName, Schema.menupermistion);
    
    //     const _counter = await idCounter(campaignCollection, 'id');
    //     console.log('COUNTER _ :: ', _counter);
    
    //     const _insertData = {
    //         id: _counter,
    //         status: 1,
    //         created_at: todays_dt
    //     };
       
    //     if (menu_id) _insertData.menu_id = menu_id;
    //     if (sub_menu_id) _insertData.sub_menu_id = sub_menu_id;
    //     if (role_id) _insertData.role_id = role_id;
    //     if (level_id) _insertData.level_id = level_id;
       
    //     if (academy_id) _insertData.academy_id = academy_id;
    //    let addCampaign = await campaignCollection.insertMany([_insertData]);
    
    //     if (addCampaign.length > 0) {
    //         res.send({
    //             api_version: "v1",
    //             success: true,
    //             message: 'Data added successfully..!',
    //             data: []
    //         });
    //     } else {
    //         res.send({
    //             api_version: "v1",
    //             success: false,
    //             message: 'Data Can Not Be Added ..!',
    //             data: []
    //         });
    //     }
    // } catch (error) {
    //     console.log(error);
    //     res.send({
    //         api_version: "v1",
    //         success: false,
    //         message: 'Something Went Wrong...',
    //         data: error
    //     });
    // }
    try {
        let CollectionName = "menupermistion";
        let adminCollection = mongoose.model(CollectionName, Schema.menupermistion);
        console.log(req.body);
      
        let { level_id, role_id, academy_id } = req.body;
      
        // Create a query object with the conditions
        let query = {};
      
        if (level_id) {
          query.level_id = parseInt(level_id, 10);
        }
      
        if (role_id) {
          query.role_id = role_id;
        }
      
        if (academy_id) {
          query.academy_id = academy_id;
        }
      
        const _insertData = {
          ...req.body,
        };
      
        console.log('Inserting data:');
        console.log(_insertData); 
      
        
          // Check if a document with the specified conditions exists
          const existingDocument = await adminCollection.findOne(query);
      
          if (existingDocument) {
            // Document exists, update it
            let result = await adminCollection.updateOne(query, _insertData);
      
            // Handle the result if needed
            if (result.nModified > 0) {
              console.log('Document updated successfully');
            } else {
              console.log('No changes made to the document');
            }
          } else {
            // Document does not exist, add a new one
            let result = await adminCollection.insertMany(_insertData);
      
            // Handle the result if needed
            console.log('Document added successfully');
          }
        
      
        res.send({
          success: true,
          message: "Data sent...",
          api_version: "v1",
          data: req.body,
        });
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
      }
      
    
},
MenuList: async (req, res) => {
    
try {
  // Define collection names and models
  let CollectionName = "menupermistion";
  let Collection = mongoose.model(CollectionName, Schema.menupermistion);

  let CollectionMenu = mongoose.model("menu", Schema.Menu);

  let { level_id, role_id, academy_id } = req.body;

  let query = {};

  if (level_id) {
      query.level_id = parseInt(level_id, 10);
  }

  if (role_id) {
      query.role_id = role_id;
  }

  if (academy_id) {
      query.academy_id = academy_id;
  }

  if (role_id == 1) {
      let menuList = await CollectionMenu.find();
      res.send({
          success: true,
          message: "Menu list fetched...",
          api_version: "v1",
          data: menuList
      });
  } else {
      let levelDataResults = await Collection.find(query);

      if (levelDataResults.length > 0) {
          let allMenuData = [];

          for (const result of levelDataResults) {
              for (const menuId of result.menu_id) {
                  let menuData = await CollectionMenu.findOne({
                      id: menuId
                  });
                  if (menuData) {
                      allMenuData.push(menuData);
                  }
              }
          }

          let menuList = allMenuData.map(menuData => {
              return {
                  id: menuData.id,
                  profile_id: menuData.profile_id,
                  class: menuData.class,
                  path: menuData.path,
                  title: menuData.title,
                  iconType: menuData.iconType,
                  icon: menuData.icon,
                  role: menuData.role,
                  submenu: menuData.submenu
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