const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const userModel = require('../models/user.model');
require('dotenv').config();

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK_URL,
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                // Check if user already exists
                let user = await userModel.findOne({ googleId: profile.id });

                if (user) {
                    return done(null, user);
                }

                // If not, see if email exists (maybe registered with password earlier)
                const email = profile.emails[0].value;
                user = await userModel.findOne({ email });

                if (user) {
                    // Link google account to existing email
                    user.googleId = profile.id;
                    await user.save();
                    return done(null, user);
                }

                // Create new user
                // Generate a unique username from email
                let baseUsername = email.split('@')[0];
                let uniqueUsername = baseUsername;
                let userExists = true;
                let counter = 1;

                while (userExists) {
                    const existingUser = await userModel.findOne({ username: uniqueUsername });
                    if (existingUser) {
                        uniqueUsername = `${baseUsername}${counter}`;
                        counter++;
                    } else {
                        userExists = false;
                    }
                }

                const newUser = await userModel.create({
                    username: uniqueUsername,
                    email: email,
                    googleId: profile.id,
                });

                return done(null, newUser);
            } catch (error) {
                return done(error, null);
            }
        }
    )
);

module.exports = passport;
