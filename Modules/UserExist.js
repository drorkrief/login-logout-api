const User = require("../models/User");
const validator = require("email-validator");

async function userToFind (req, res, next) {
  const email = req.body.email;
  const item1 = await User.findOne({ email }).exec();
  if (!item1) {
    console.log(`${email} is not exist in DB`);
    return res.status(504).send("the email is not exist in DB");
  }

  if (
    !validator.validate(req.body?.email) || // check the values.
    // req.body.name.length < 3 ||
    req.body.password.length < 6
  ) {
    return res.status(422).send("invalid input");
  }
  req.DBpassword = item1.password;
  req.isVerifaied = item1.isVerifaied;

  if (!item1.isVerifaied) {
    return res.status(421).send("go to your email to verify your account");
  }
  // console.log("valuesTesting - - ");
  next();
};

module.exports = { userToFind }