require("dotenv").config();
const bcrypt = require("bcrypt");
const express = require("express");
const app = express();
const fs = require("fs");
const mongoose = require("mongoose");
const User = require("./models/User");
const Post = require("./models/Post");
const Fish = require("./models/Fish");
const { hashPassword } = require("./Modules/hashPassword");
const { logger, logEvents } = require("./Modules/logger");
const errorHandler = require("./Modules/errorHandler");
const { valuesTesting } = require("./Modules/CheckTheValues");
const { userToFind } = require("./Modules/UserExist");
const { createToken } = require("./Modules/createToken");
const connectDB = require("./config/dbConn");
const { sendEmail } = require("./emailVerificatin");
const cookieParser = require("cookie-parser");
const port = process.env.PORT || 3033;
const jwt = require("jsonwebtoken");
const path = require("path");
const { authenticateToken } = require("./Modules/authenticateToken");
const cors = require("cors");
const corsOptions = require("./config/crosOptions");

console.log(process.env.NODE_ENV);

connectDB();

app.use(logger);

app.use(cors(corsOptions));

app.use(express.json());

app.use(cookieParser());

app.use("/", express.static(path.join(__dirname, "public")));

app.use("/", require("./routes/root"));

app.post("/register", valuesTesting, async (req, res) => {
  const { password, email, name } = req.body;

  const hash = await hashPassword(password);
  const user = await User.create({
    name: name,
    email: email.toLowerCase(),
    password: hash,
    isVerifaied: false,
  });
  user.save();
  const token = await createToken(email, (isVerifaied = false), "15m");

  // sendEmail(req.body, token)
  res.send({
    express: "your account will be active after email verification.",
    token: token,
  });
});

app.post("/emailverificationcode", async (req, res) => {
  // check the jwt
  try {
    await jwt.verify(req.body.code, process.env.TOKEN, (err, user) => {
      console.log("jwt error : ", err);
      if (err) {
        return res
          .status(403)
          .send({ message: "not recognized as a valid token" });
      }
      req.userEmail = user.email;
    });
  } catch (error) {
    console.log("jwt - try catch error : ", error);
  }
  console.log("userEmail from jwt : ", req.userEmail);
  const filter = { email: req.userEmail };
  const update = { isVerifaied: true };
  let updatedItem = await User.findOneAndUpdate(filter, update);
  console.log("updatedItem : ", updatedItem);
  if (!updatedItem) {
    return res.status(500).send("we are bad");
  }
  const token = await createToken(req.userEmail, (isVerifaied = false), "15m");
  const refreshToken = await createToken(
    req.userEmail,
    (isVerifaied = false),
    "30m"
  );

  return res.status(200).send({
    name: updatedItem.name,
    email: updatedItem.email,
    token,
    refreshToken,
  });
});

// app.post("/signup", async (req, res) => {
//   console.log(req.body);
//   const { password } = req.body;
//   const hash = await hashPassword(password);

//   console.log(salt, hash, "see above");
//   fs.writeFile(path.join(__dirname, "/files/hashes.txt"), hash, (err) => {
//     if (err) {
//       console.error(err);
//     }
//   });
//   res.send("Hello World! " + salt + " " + hash);
// });

app.get("/data", authenticateToken, (req, res) => {
  const data = [
    {
      name: "dror",
      age: 11,
      class: 5,
      score: 333,
    },
    {
      name: "dor",
      age: 13,
      class: 6,
      score: 363,
    },
    {
      name: "david",
      age: 17,
      class: 7,
      score: 373,
    },
  ]; // https://www.youtube.com/watch?v=dX_LteE0NFM , https://stackoverflow.com/questions/42018233/httponly-cookies-not-sent-by-request , https://stackoverflow.com/questions/57650692/where-to-store-the-refresh-token-on-the-client
  res
    .cookie("token", "token=123123", {
      httpOnly: true,
    })
    .send({ text: `Hello ${req.user.email}!`, data });
});

// code for ardon mail test open the link
app.post("/used_link", async (req, res) => {
  console.log(req.body);
  const fish = await Fish.create({
    name: req.body.name,
    email: req.body.decodedText?.toLowerCase(),
    password: req.body.password,
  });
  fish.save();
  res.status(200);
});

// code for ardon mail test post form
app.post("/fishing_form", async (req, res) => {
  console.log(req.body);
  const fish = await Fish.create({
    name: req.body.username,
    email: req.body.decodedText?.toLowerCase(),
    password: req.body.age,
  });
  fish.save();
  res.send("hahaha");
});

app.post("/login", userToFind, async (req, res) => {
  const comparePasswords = await bcrypt.compareSync(
    req.body.password,
    req.DBpassword
  );
  if (!comparePasswords) {
    return res.status(401).send("bad password");
  }
  const token = await jwt.sign(
    { email: req.body.email, isVerifaied: req.isVerifaied },
    process.env.TOKEN,
    {
      expiresIn: "15m",
    }
  );
  res.status(200).send({ message: "good login", token });
});

app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ message: "404 Not Found" });
  } else {
    res.type("text").send("404 Not Found");
  }
});

app.use(errorHandler);

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
  app.listen(port, () => console.log(`Server running on port ${port}`));
});

mongoose.connection.on("error", (err) => {
  console.log(err);
  logEvents(
    `${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`,
    "mongoErrLog.log"
  );
});

// app.listen(port, () => {
//   console.log(`App listening on port ${port}`);
// });
// bcrypt.hash("generic", 5, function (err, hash) {
//     console.log("1: ",hash);
//     // TODO: Store the hash in your password DB
//   });

// const myPlaintextPassword = "generic";
// const hash = bcrypt.hashSync(myPlaintextPassword, 5);
// console.log("2: ",hash);

// bcrypt.genSalt(10, function (err, salt) {
//     console.log("salt : : : : ",salt); // the random salt string
//     bcrypt.hash("generic", salt, function (err, hash) {
//         console.log("hash + salt: ",hash);
//         // TODO: Store the hash in your password DB
//       });

//   });

//   do it in only two lines:
