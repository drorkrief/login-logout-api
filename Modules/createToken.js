const jwt = require("jsonwebtoken");

async function createToken(email, isVerifaied, expiresIn) {
  
    const token = await jwt.sign({ email, isVerifaied }, process.env.TOKEN, {
      expiresIn,
    });
    return token;
 
}

module.exports = { createToken };
