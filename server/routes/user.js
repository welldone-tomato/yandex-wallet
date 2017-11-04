const router = require('koa-router')();
const stringCrypt = require('../libs/string-encrypt');

/**
 * Get user telegramKey by email
 *
 */
router.get('/telegram-key/:email', async (ctx) => {
    console.log('Email');
    const {email} = ctx.params;
	const user = await ctx.users.getOne({email: email});

	if (!user) ctx.throw(404, `user with email=${email} not found`);
    if (user.telegramKey) {
        ctx.body = user.telegramKey;
    } else {
        ctx.body = stringCrypt(email, 4);
    };
    // Mock for telegramKey
    // ctx.body = 'J0b3B0YWwuY29t';
});

module.exports = router;
