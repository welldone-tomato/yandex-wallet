const Koa = require('koa');
const router = require('koa-router')();
const koaBody = require('koa-body')();

const cardsRoute = require('./routes/cards');

const app = new Koa();

// if (process.env.NODE_ENV !== 'test') {
// }

// Обработчик ошибок
app.use(async (ctx, next) => {
	try {
		await next();
	} catch (err) {
		ctx.status = err.statusCode || err.status || 500;
		ctx.body = {
			message: err.message
		};
	}
});

router.use('/cards', koaBody, cardsRoute.routes());

app.use(router.routes());
app.use(router.allowedMethods());

// app.get('/transfer', (req, res) => {
// 	const {amount, from, to} = req.query;
// 	res.json({
// 		result: 'success',
// 		amount,
// 		from,
// 		to
// 	});
// });

const server = app.listen(3000, () => console.log('YM Node School App listening on port 3000!'))
	.on("error", err => console.error(err));

module.exports = server;
