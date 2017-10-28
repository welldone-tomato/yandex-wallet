const passport = require('koa-passport');
const router = require('koa-router')();
const jwt = require('jwt-simple');
const config = require('../config');

/**
 * Create token for user information
 *
 * @param {Object} payload
 * @returns {String}
 */
const getTokenForUser = payload => {
    const timestamp = new Date().getTime();

    return jwt.encode({
        id: payload.id,
        iat: timestamp
    }, config.secret);
}

/**
 * Main signin route
 *
 */
router.post('/signin', async (ctx, next) => await passport.authenticate('local', (err, user) => {
        if (err || !user)
            ctx.throw(401, `signin failed`)

        const payload = {
            id: user.id,
            email: user.email
        };

        ctx.body = {
            user: user.email,
            token: getTokenForUser(payload)
        };
    })(ctx, next));

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
        ctx.throw(400, err);
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
