import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/User.js';
import dotenv from 'dotenv';

dotenv.config({ path: 'google-auth.env' });

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const displayName = profile.displayName || "No Name"; 
    const email = (profile.emails && profile.emails.length > 0) ? profile.emails[0].value : "No Email"; 

    let user = await User.findOne({ googleId: profile.id });
    if (!user) {
      user = await User.create({
        name: displayName,
        email: email,
        googleId: profile.id,
      });
    } else {
      user.name = displayName;
      user.email = email;
      await user.save(); 
    }
    
    done(null, user); 
  } catch (err) {
    console.error('Error during Google authentication:', err); 
    done(err, null);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user.id); 
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id); 
    done(null, user); 
  } catch (err) {
    console.error('Error during deserialization:', err); 
    done(err, null); 
  }
});

export default passport;
