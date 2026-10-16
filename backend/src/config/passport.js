import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { findOrCreateGoogleUser } from '../services/auth.services.js';
import ApiError from '../utils/ApiError.js';

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackUrl: process.env.GOOGLE_CALLBACK_URL

        },
        async (_, _, profile, done) => {
            try {
                const user = await findOrCreateGoogleUser({
                    googleId: profile.id,
                    email: profile.emails?.[0]?.value,
                    name: profile.displayName,
                    emailVerifiend: profile._json.email_verified
                });
                done(null, user);
            } catch (error) {
                done(null, false, {
                    message: error instanceof ApiError ? error.message: 'Google sign-in failed'
                });
            }
        }
    )
);

export default passport;