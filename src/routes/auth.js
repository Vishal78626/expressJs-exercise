const { Router } = require("express");
const User = require("../database/schemas/user");
const { hashPassword, comparePassword } = require("../utils/helper");
const passport = require('passport');
const route = Router();


// route.post("/login", async (req, res) => {
//   const { email, password } = req.body;
//   if (!email || !password) {
//     return res.sendStatus(400);
//   } else {
//     const userDB = await User.findOne({ email });
//     if (!userDB) {
//       return res.sendStatus(401);
//     } else {
//       const isValid = comparePassword(password, userDB.password);
//       if (isValid) {
//         req.session.user = userDB;
//         console.log("Successful");
//         res.sendStatus(200);
//       } else {
//         console.log("Unsuccessful");
//         res.sendStatus(401);
//       }
//     }
//   }
// });

route.post('/login', passport.authenticate('local'), (req, res) => {
  console.log('logged in');
  res.sendStatus(200);
})

route.post("/register", async (req, res) => {
  const { email } = req.body;
  const userDB = await User.findOne({ email });
  if (userDB) {
    res.status(400).send({ msg: "User already exits" });
  } else {
    const password = hashPassword(req.body.password);
    console.log(password);
    const newUser = await User.create({
      email,
      password,
    });
    res.sendStatus(201);
  }
});

route.get('/discord', passport.authenticate('discord') ,(req, res) => {
  res.sendStatus(200);
})

route.get('/discord/redirect', passport.authenticate('discord'), (req, res) => {
  res.sendStatus(200);
})
module.exports = route;
