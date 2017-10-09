const Koa = require('koa');
const router = require('koa-router')();
const koaBody = require('koa-body')();
const compose = require('koa-compose');
const cors = require('koa2-cors');

const logger = require('./libs/logger')('app');
const cardsRoute = require('./routes/cards');
const CardsContext = require('./data/cards_context');
const TransactionsContext = require('./data/transactions_context');

const app = new Koa();

app.use(cors());

// Логгер работает только для нетестовых окружений
if (process.env.NODE_ENV !== 'test') {
	app.use(async (ctx, next) => {
		const start = new Date();
		await next();
		const ms = new Date() - start;
		console.info(`${ctx.method} ${ctx.url} - ${ms}ms`);
		logger.info(`${ctx.method} ${ctx.url} - ${ms}ms`);
	});
}

// id param auto-loading
router.param('id', async (id, ctx, next) => {
	id = Number(id);
	if (id < 0 || isNaN(id)) ctx.throw(400, 'id is invalid');
	ctx.params.id = id;

	await next();
});

// Обработчик ошибок
app.use(async (ctx, next) => {
	try {
		await next();
	} catch (err) {
		ctx.status = err.statusCode || err.status || 500;
		ctx.body = {
			message: err.message
		};
		logger.error('Error detected', err);
	}
});

// inject Context
const contextInjector = async (ctx, next) => {
	ctx.cards = new CardsContext();
	ctx.transactions = new TransactionsContext();
	await next();
};

router.use('/cards', compose([koaBody, contextInjector]), cardsRoute.routes());

app.use(router.routes());
app.use(router.allowedMethods());

const server = app.listen(4000, () => {
	console.log('YM Node School App listening on port 4000!')
	logger.log('YM Node School App listening on port 4000!');
});

module.exports = server;
