 const { validationResult } = require('express-validator');
const commonModel = require('../../../model/v1/common');
const helper = require('../../../helper/helper');
const log = require('../../../helper/config.json').log.master;
//const calenderMod = require('../../../model/v1/website/calendar');

//const commonModel = require('../../model/common');

const payment = async (req, res) => {

try {
	console.log('grrrrrrrrr');
const Razorpay = require('razorpay');
  var instance = new Razorpay({ key_id: 'rzp_test_iP3MNFknWEk2o7', key_secret: 'EIvsDplXEzMCYKUR3LAmoanr' });

  var options = {
    amount: req.body.amount,  // amount in the smallest currency unit
    currency: req.body.currency,
    receipt: `order_rcptid_${Date.now()}`
  };

  console.log("options,..............");
  console.log(options);

  var data = await instance.orders.create(options);

  console.log("data");
  console.log(data);

  if (data) {
    res.status(process.env.STATUS_200).send({
      status: process.env.STATUS_200,
      msg: 'successfully',
      data: data
    });
  } else {
    res.status(process.env.STATUS_400).send({
      status: process.env.STATUS_400,
      msg: 'unsuccessfully'
    });
  }
} catch (err) {
  console.log(err);
  res.status(process.env.STATUS_500).send({
    status: process.env.STATUS_500,
    msg: 'An error occurred'
  });
}



}





module.exports = { payment }