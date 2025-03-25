const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20");
const GithubStrategy = require("passport-github2");
const LocalStrategy = require("passport-local").Strategy;
require("dotenv").config();
const validatePw = require("../config/password-utils").validatePw;

const {
  getEmailExist,
  getUserIdExist,
  existingGoogle,
  createGoogleUser,
} = require("../db/authQueries");

//passport configs for strategies

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (req, email, password, done) => {
      console.log(req.body);
      try {
        const user = await getEmailExist(email);
        if (!user) {
          return done(null, false, { error: "Invalid Email or Password" });
        }
        const validPw = await validatePw(user.password, password);
        if (!validPw) {
          return done(null, false, { error: "Invalid Email or Password" });
        }
        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.SERVER_URL}/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const existing = await existingGoogle(profile.id);
        if (existing) {
          done(null, existing);
        } else {
          const create = await createGoogleUser(
            profile,
            accessToken,
            refreshToken
          );
          done(null, create);
        }
      } catch (error) {
        console.error(`Error in Google Strategy ${error}`);
        return done(error, null);
      }
    }
  )
);

// serialize and deserialize user
passport.serializeUser((user, done) => {
  if (!user || !user.id) {
    return done(new Error("Invalid user object during serialization"));
  }
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    if (!id) {
      return done(new Error("No user id provided in deserialization"));
    }
    const user = await existingUserId(id);
    if (!user) {
      return done(new Error("User was not found during deserialization"));
    }
    done(null, user);
  } catch (err) {
    done(err);
  }
});
