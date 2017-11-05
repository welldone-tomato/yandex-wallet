const passport = require('koa-passport');
const router = require('koa-router')();
const jwt = require('jwt-simple');
const {JWT_SECRET} = require('../config-env');

const getExp = () => {
    let exp = new Date();
    exp = exp.setDate(exp.getDate() + 7);
    return exp;
}

const getExpDate = () => {
    let exp = new Date();
    exp.setDate(exp.getDate() + 7);
    return exp;
}

/**
 * Create token for user information
 *
 * @param {Object} payload
 * @returns {String}
 */
const getTokenForUser = payload => {
    return jwt.encode({
        id: payload.id,
        exp: getExp()
    }, JWT_SECRET);
}

const signinMiddleware = provider => async (ctx, next) => passport.authenticate(provider, (err, user) => {
    if (err || !user)
        ctx.throw(401, err || 'signin failed')

    const payload = {
        id: user.id,
        email: user.email
    };

    const token = getTokenForUser(payload);

    ctx.cookies.set('jwt', token, {
        expires: getExpDate(),
        httpOnly: false
    });

    ctx.body = {
        user: user.email,
        token
    };
})(ctx, next);

router.get('/google', passport.authenticate('google'));

router.get('/google/callback', signinMiddleware('google'));

router.get('/verify', async (ctx, next) => await passport.authenticate('jwt', async (err, user) => {
        if (!user)
            ctx.throw(401, err || 'auth is required');

        ctx.body = {
            user: user.email
        };
    })(ctx, next));

/**
 * Main signin route
 *
 */
router.post('/signin', signinMiddleware('local'));

/**
 * Main signup route
 *
 */
router.post('/signup', async ctx => {
    const {email, password} = ctx.request.body;

    if (!email || !password)
        ctx.throw(400, 'email and password is required');

    try {
        await ctx.users.validate({
            email,
            password
        });
    } catch (err) {
        ctx.throw(400, err || 'signup failed');
    }

    const addedUser = await ctx.users.add({
        email,
        password
    });

    ctx.body = {
        user: addedUser.email,
        token: getTokenForUser(addedUser)
    };
});

module.exports = router;
