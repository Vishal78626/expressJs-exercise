const passport = require("passport");
const { Strategy } = require("passport-discord");
const DiscordUser = require("../database/schemas/DiscordUser");

passport.serializeUser((user, done) => {
  console.log("Serialize user");
  console.log(user);
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  console.log("Deserialize User");
  console.log(id);

  try {
    const user = await DiscordUser.findById(id);
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
      clientID: "1160994202935627827",
      clientSecret: "CDK5lhq-8BDej8RSlfkZjeFgw4T1DSMD",
      callbackURL: "http://localhost:3001/api/v1/auth/discord/redirect",
      scope: ["identify"],
    },
    async (accessToken, refreshToken, profile, done) => {
      console.log(accessToken, refreshToken);
      console.log(profile);
      try {
        const discordUser = await DiscordUser.findOne({ discordId: profile.id });
        if (discordUser) {
          console.log(`Found User: ${discordUser}`)
          return done(null, discordUser);
        } else {
          const newUser = await DiscordUser.create({ discordId: profile.id });
          console.log(`Created User: ${newUser}`)
          return done(null, discordUser);
        }
      }
      catch(err) {
        console.log(err)
        return done(err, null)
      }
    }
  )
);
