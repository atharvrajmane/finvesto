const passport = require('passport');
const { Strategy: JwtStrategy } = require('passport-jwt');
const { UserModel } = require('../models/UserModel');

const cookieExtractor = (req) => {
    let token = null;
    if (req && req.cookies) {
        token = req.cookies['accessToken'];
    }
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


                const user = { _id: jwt_payload.sub };
        return done(null, user);

            } catch (err) {
        return done(err, false);
    }
}));
