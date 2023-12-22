const {Schema} = require('../../model/schema');
const { idCounter } = require("../../helper/counter");
const validate = require("../../helper/validate");
const {queryMongo,mongoose} = require('../../mongodb');

module.exports = {
    

    Add: async (req, res) => {
        try {
            const { user_id, form_id, input_type, is_required, label_name, status, optionList, name } = req.body;
        
           
            let CollectionName = "userinfos";
            let campaignCollection = mongoose.model(CollectionName, Schema.userinfos);
        
            const _counter = await idCounter(campaignCollection, 'id');
            console.log('COUNTER _ :: ', _counter);
        
            const _insertData = {
                id: _counter,
                delete_status: 1,
            };
        
            if (user_id) _insertData.user_id = user_id;
            if (form_id) _insertData.form_id = form_id;
            if (input_type) _insertData.input_type = input_type;
            if (is_required) _insertData.is_required = is_required;
            if (label_name) _insertData.label_name = label_name;
            if (status) _insertData.status = status;
            if (optionList) _insertData.optionList = optionList;
            if (name) _insertData.name = name;
        
            let addCampaign = await campaignCollection.insertMany([_insertData]);
        
            if (addCampaign.length > 0) {
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
            const CollectionName = "userinfos"; 
            const campaignCollection = mongoose.model(CollectionName, Schema.userinfos);
        
            const formId = req.query.form_id;
            const userId = req.query.user_id;
            let _match={
                delete_status: 1
            }
            if (req.query.form_id&&formId!==""&& formId!=="undefined") {
                _match["form_id"]=Number(formId)
            }
            if (req.query.user_id&&userId!==""&& userId!=="undefined") {
                _match["user_id"]=Number(userId)
            }
        
            const aggregationPipeline = [
                {
                    $lookup: {
                        from: "inputmasters",
                        localField: "input_type",
                        foreignField: "id",
                        as: "joinedDataInput"
                    }
                },
                { $unwind: { path: "$joinedDataInput", preserveNullAndEmptyArrays: true } },
                {
                    $lookup: {
                        from: "headercollections",
                        localField: "form_id",
                        foreignField: "id",
                        as: "joinedDataHeader"
                    }
                },
                { $unwind: { path: "$joinedDataHeader", preserveNullAndEmptyArrays: true } },
                {
                    $lookup: {
                        from: "mainaccounts",
                        localField: "user_id",
                        foreignField: "id",
                        as: "joinedDatauser"
                    }
                },
                { $unwind: { path: "$joinedDatauser", preserveNullAndEmptyArrays: true } },
                {
                    $match: _match

        
                },
                
                {
                    $project: {
                        _id: 0,
                        id: 1,
                        name: 1,
                        user_id: 1,
                        form_id: 1,
                        input_type: 1,
                        is_required: 1,
                        label_name: 1,
                        status: 1,
                        optionList: 1,
                        input_name: "$joinedDataInput.name",
                        header_name: "$joinedDataHeader.name",
                        user_name: "$joinedDatauser.academy_name"
                    }
                }
            ];
        
            const result = await campaignCollection.aggregate(aggregationPipeline);
            
        
            if (result.length > 0) {
                return res.status(200).json({
                    success: true,
                    message: "User list fetched...",
                    api_version: "v1",
                    data: result
                });
            } else {
                return res.status(200).json({
                    success: false,
                    message: "No records found.",
                    api_version: "v1",
                    data: []
                });
            }
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                success: false,
                message: "Something went wrong...",
                api_version: "v1",
                data: error.message
            });
        }
        
        
    
},

Edit:async(req,res)=>{
    try {
        let CollectionName = "userinfos";
        let campaignCollection = mongoose.model(CollectionName, Schema.userinfos);
    
       
        let recordId = req.body.id; 
        let result = await campaignCollection.findOne({ id: recordId });
    
        if (result) {
            return res.status(200).json({
                success: true,
                message: "User record fetched...",
                api_version: "v1",
                data: result
            });
        } else {
            return res.status(404).json({
                success: false,
                message: "No record found.",
                api_version: "v1",
                data: []
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong...",
            api_version: "v1",
            data: error.message
        });
    }
     
},
Update: async (req, res) => {
    try {
        const { user_id, form_id, input_type, is_required, label_name, status, optionList, name, id } = req.body;
    
        let CollectionName = "userinfos";
        let campaignCollection = mongoose.model(CollectionName, Schema.userinfos);
    
        const _insertData = {
            status: 1,
        };
    
        if (user_id) _insertData.user_id = user_id;
        if (form_id) _insertData.form_id = form_id;
        if (input_type) _insertData.input_type = input_type;
        if (is_required) _insertData.is_required = is_required;
        if (label_name) _insertData.label_name = label_name;
        if (status) _insertData.status = status;
        if (optionList) _insertData.optionList = optionList;
        if (name) _insertData.name = name;
    
        let addCampaign = await campaignCollection.updateOne({ id: id }, { $set: _insertData });

        console.log(addCampaign);
        console.log('dddddddddddddddddddddd');
    
        if (addCampaign.modifiedCount > 0) {
            res.send({
                api_version: "v1",
                success: true,
                message: 'Data updated successfully..!',
                data: []
            });
        } else {
            res.send({
                api_version: "v1",
                success: false,
                message: 'Data update failed or no matching document found..!',
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
          let oollectionname = "userinfos";
          let collection = mongoose.model(oollectionname, Schema.userinfos);
        
          let result = await collection.updateOne({id: req.body.id},{delete_status:2});
          console.log('hhhhhhhhhhhhhhhhhhhhhhhhh');

          console.log(result);
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
            data: [],
          });
        }
      }
    });
  },
}