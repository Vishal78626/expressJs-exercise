const passport = require("passport");
const { Strategy } = require("passport-local");
const User = require("../database/schemas/user");
const { comparePassword } = require("../utils/helper");

passport.serializeUser((user, done) => {
  console.log("Serialize user");
  console.log(user);
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  console.log("Deserialize User");
  console.log(id);

  try {
    const user = await User.findById(id);
    if (!user) throw new Error("User not found");
    console.log(user);
    done(null, user);
  } catch (err) {
    console.log(err);
    done(err, null);
  }
});

passport.use(
  new Strategy(
    {
      usernameField: "email",
    },
    async (email, password, done) => {
      try {
        console.log(email);
        console.log(password);
        if (!email || !password) {
          throw new Error("Bad Request, Missing credential");
        } else {
          const userDB = await User.findOne({ email });
          if (!userDB) {
            throw new Error("User not found");
          }
          const isValid = comparePassword(password, userDB.password);
          if (isValid) {
            console.log("Authenticated Successfully");
            done(null, userDB);
          } else {
            console.log("Invalid Authentication");
            done(null, null);
          }
        }
      } catch (err) {
        console.log(err);
        done(err, null);
      }
    }
  )
);
