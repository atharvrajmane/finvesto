const passport = require('passport');
const { Strategy: JwtStrategy } = require('passport-jwt');
const { UserModel } = require('../models/UserModel');

// Custom extractor to get the JWT from the HTTP-Only cookie
const cookieExtractor = (req) => {
    let token = null;
    if (req && req.cookies) {
        token = req.cookies['accessToken'];
    }
    // Fallback to Bearer token just in case (e.g. testing with Postman)
    if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
        token = req.headers.authorization.split(' ')[1];
    }
    return token;
};

const jwtOptions = {
    jwtFromRequest: cookieExtractor,
    secretOrKey: process.env.JWT_SECRET,
};

if (!jwtOptions.secretOrKey) {
    console.error('CRITICAL ERROR: JWT_SECRET is not defined in environment variables.');
    process.exit(1); 
}

passport.use(new JwtStrategy(jwtOptions, async (jwt_payload, done) => {
    try {
        if (jwt_payload.type !== 'access') {
            return done(null, false, { message: 'Invalid token type. Expected access token.' });
        }

        // STATELESS AUTHENTICATION
        // We trust the cryptographically signed JWT payload, eliminating the MongoDB query bottleneck!
        // We attach a minimal user object to req.user containing the ID.
        // If an endpoint needs more user data (like balance), it can query the DB itself.
        
        const user = { _id: jwt_payload.sub };
        return done(null, user);
        
    } catch (err) {
        return done(err, false);
    }
}));
