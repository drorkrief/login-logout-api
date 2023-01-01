const validator = require("email-validator");
const User = require("../User");

module.exports = async (req, res, next) => {
  const email = req.body.email;

  const item1 = await User.findOne({ email }).exec()
  if (item1) {
    console.log("the item in the DB is : ", item1.email);
    return res.status(404).send("the email exist in DB");
  }

  if (
    !validator.validate(req.body.email) || // check the values.
    req.body.name.length < 3 ||
    req.body.password.length < 6
  ) {
    return res.status(422).send("invalid input");
  }
  
  // console.log("valuesTesting - - ");
  next();
};
