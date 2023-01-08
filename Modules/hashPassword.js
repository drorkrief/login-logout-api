const bcrypt = require("bcrypt");

async function hashPassword(passToHash) {
    // console.log(`password: ${passToHash}`);
  const salt = await bcrypt.genSaltSync(10);
  const hash = await bcrypt.hashSync(passToHash, salt);
  return hash;
}

module.exports = { hashPassword };
