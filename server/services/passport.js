const passport = require('koa-passport');
const JwtStrategy = require('passport-jwt').Strategy;
const GoogleStrategy = require('passport-google-auth').Strategy;
const YandexStrategy = require('passport-yandex').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local');

const {JWT_SECRET, HOST} = require('../config-env');
const User = require('../models/user');

// JWT strategy
const cookieExtractor = ctx => {
    let token = null;
    if (ctx && ctx.cookies)
        token = ctx.cookies.get('jwt');

    return token;
};

const jwtOptions = {
    secretOrKey: JWT_SECRET,
    jwtFromRequest: ExtractJwt.fromExtractors([ExtractJwt.fromAuthHeaderWithScheme('JWT'), cookieExtractor])
};

const jwtLogin = new JwtStrategy(jwtOptions, async (payload, done) => {
    const {id, exp} = payload;

    if (!id || !exp)
        return done({
            message: 'invalid token'
        }, false);

    const date = new Date().getTime();
    if (date >= payload.date)
        return done({
            message: 'token was expired'
        }, false);

    try {
        const user = await User.findById(payload.id);
        if (user)
            return done(null, user.toObject());

        done({
            message: 'invalid token'
        }, false);
    } catch (err) {
        done(err, false)
    };
});

// Local strategy
const localOptions = {
    usernameField: 'email',
    passwordField: 'password',
    session: false
};

const localLogin = new LocalStrategy(localOptions, async (email, password, done) => {
    try {
        const user = await User.findOne({
            email
        });

        if (!user)
            return done({
                message: 'Нет такого пользователя'
            }, false)
        else
            user.comparePassword(password, (err, isMatch) => {
                if (err)
                    return done(err, false);

                if (!isMatch)
                    return done({
                        message: 'Нет такого пользователя или пароль неверен'
                    }, false);

                done(null, user.toObject());
            });
    } catch (err) {
        done(err, false)
    }
});

const oauth2Callback = async (token, tokenSecret, profile, done) => {
    const {emails} = profile;

    if (!token || !emails[0])
        return done({
            message: 'invalid login'
        }, false);

    const email = emails[0].value;

    try {
        const user = await User.findOne({
            email
        });

        if (user) return done(null, user.toObject());
        else {
            const newUser = new User({
                email,
                password: token
            });

            await newUser.save();

            return done(null, newUser.toObject());
        }
    } catch (err) {
        done(err, false)
    };
};

const yandexOption = {
    clientID: '8d36707d898147158df97e7f17d79349',
    clientSecret: 'dbca634e00a74dffbbe1ac77a37c8cfc',
    callbackURL: 'http://' + HOST + '/api/auth/yandex/callback'
}

const yandexLogin = new YandexStrategy(yandexOption, oauth2Callback);

const googleOptions = {
    clientId: '492605406290-8s77uuohdk13433ejh0ih446bbemod3e.apps.googleusercontent.com',
    clientSecret: '70wYuryto3tYOCCHmQ3PFI5D',
    callbackURL: 'http://' + HOST + '/api/auth/google/callback'
};

const googleLogin = new GoogleStrategy(googleOptions, oauth2Callback);

// Use strategies
passport.use(jwtLogin);
passport.use(localLogin);
passport.use('google', googleLogin);
passport.use('yandex', yandexLogin);
