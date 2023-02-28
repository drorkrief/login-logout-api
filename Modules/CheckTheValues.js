const validator = require("email-validator");
const User = require("../models/User");

async function valuesTesting(req, res, next) {
  
  const {email} = req.body;
  const theDBUserRecord = await User.findOne({ email }).exec();

  if (theDBUserRecord) {
    console.log("the item in the DB is : ", theDBUserRecord.email);
    return res.status(404).send("the email exist in DB");
  }

  if (
    !validator.validate(req.body.email) || // check the values.
    req.body.name.length < 3 ||
    req.body.password.length < 6
  ) {
    return res.status(422).send("invalid input");
  }
  next();
}

module.exports = { valuesTesting };
