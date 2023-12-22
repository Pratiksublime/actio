
//const Schema = require('');

const Schema = require('../../model/schema');

const {queryMongo,mongoose} = require('../../mongodb');

module.exports = {

    Add: async (req, res) => {
        try {
            //let todays_dt = moment().format("YYYY-MM-DD HH:mm:ss");
            // let campaignCollectionName = req.username + "campaign";
            // let campaignLeadCollectionName = req.username + 'campaign_lead';
            // let campaignParameterCollectionName = req.username + 'campaign_parameter'
            let demoCollectionName ="demo_1";
            let campaignCollection = mongoose.model(demoCollectionName, Schema.demo);

            //let dtmfCollection = connection.model(dtmfCollectionName, Schema.dtmf)

            // let campaign_lead_Collection = connection.model(campaignLeadCollectionName, Schema.campaign_lead);
            // let campaign_parameter_Collection = connection.model(campaignParameterCollectionName, Schema.campaign_parameter);

            // const _counter = await getNextCounter(
            //     campaignCollection,
            //     'id'
            // )
            // console.log('COUNTER _ :: ', _counter)

            let _insertData = {
                
               
            }
            if (req.body.id && req.body.id !== "" && req.body.id != 'undefined') {
                _insertData.id = req.body.id
            }
            if (req.body.name && req.body.name !== "" && req.body.name != 'undefined') {
                _insertData.name = req.body.name
            }
            if (req.body.username && req.body.username !== "" && req.body.username != 'undefined') {
                _insertData.username = req.body.username
            }
            

            let addCampaign = await campaignCollection.insertMany([_insertData]);

           
            if (addCampaign.length > 0) {
                res.send({
                    api_version:"v2",
                    success: true,
                    message: 'Data added successfully..!',
                    data: []
                });
            } else {
                res.send({
                    api_version:"v2",
                    success: false,
                    message: 'Data Can Not Be Added ..!',
                    data: []
                });
            }

        } catch (error) {
            console.log(error);
            res.send({
                api_version:"v2",
                success: false,
                message: 'Something Went Wrong...',
                data: error
            });
        }
    },
    list: async (req, res) => {
        try {
            let dtmfCollectionName = "demo_1"
            let dtmfCollection = mongoose.model(dtmfCollectionName,Schema.demo)

            let result = await dtmfCollection.find({
                
            })
            if (result.length > 0) {
                res.send({
                    success: true,
                    message: "DTMF list fetched...",
                    api_version:"v2",
                    data: result
                })
            } else {
                res.send({
                    success: false,
                    message: "no record found..",
                    api_version:"v2",
                    data: result
                })
            }

        } catch (error) {
            console.log(error);
            res.send({
                success: false,
                message: "something wentwrong....!",
                api_version:"v2",
                data: error.message
            })
        }
    },


    
}