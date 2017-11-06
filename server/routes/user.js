const router = require('koa-router')();
const passport = require('koa-passport');
const stringCrypt = require('../libs/string-encrypt');

/**
 * Get user telegramKey by email
 *
 */
//TODO remove double jwt auth
router.get('/telegram-key', async (ctx, next) => await passport.authenticate('jwt', async (err, user) => {
        if (!user)
            ctx.throw(401, err || 'auth is required');

        if (user.telegramKey) {
            ctx.body = user.telegramKey;
        } else {
            ctx.body = stringCrypt(user.email, 4);
        }
    })(ctx, next));

module.exports = router;
