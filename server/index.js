const http = require('http');
const https = require('https');
const fs = require('fs');

const Koa = require('koa');
const router = require('koa-router')();
const koaBody = require('koa-body')();
const compose = require('koa-compose');
const cors = require('koa2-cors');
const mongoose = require('mongoose');

const logger = require('./libs/logger')('app');
const cardsRoute = require('./routes/cards');
const CardsContext = require('./data/cards_context');
const TransactionsContext = require('./data/transactions_context');

mongoose.Promise = global.Promise;
const app = new Koa();

const port = process.env.NODE_PORT || 4000;

app.use(cors());

// Логгер работает только для нетестовых окружений
if (process.env.NODE_ENV !== 'test') {
	app.use(async (ctx, next) => {
		const start = new Date();
		await next();
		const ms = new Date() - start;
		// console.info(`${ctx.method} ${ctx.url} - ${ms}ms`);
		logger.info(`${ctx.method} ${ctx.url} - ${ms}ms`);
	});
}

// id param auto-loading
router.param('id', async (id, ctx, next) => {
	var checkForHexRegExp = new RegExp("^[0-9a-fA-F]{24}$");

	if (!checkForHexRegExp.test(id)) ctx.throw(400, 'id is invalid');
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
		if (err.isNotLogged) logger.error('Error detected', err);
		if (process.env.NODE_ENV !== 'test') console.error('Error detected', err);
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

const startCallback = port => {
	const mongo = 'mongodb://docker/test_yandex_wallet';
	mongoose.connect(mongo, {
		useMongoClient: true
	});

	mongoose.connection
		.once('open', () => {
			console.log(`YM Node School DB connection success. ${mongo}`)
			logger.log(`YM Node School DB connection success. ${mongo}`);
		})
		.once('error', error => {
			console.error('Mongo Error: ', error);
			logger.error('Mongo error: ', error);
		});

	console.log(`YM Node School App listening on port ${port}!`)
	logger.log(`YM Node School App listening on port ${port}!`);
};

const options = {
	key: fs.readFileSync('./ssl/key.pem', 'utf8'),
	cert: fs.readFileSync('./ssl/cert.pem', 'utf8')
};

const server = http.createServer(app.callback()).listen(port, startCallback(port));
https.createServer(options, app.callback()).listen(port + 1, startCallback(port + 1));

module.exports = server;
