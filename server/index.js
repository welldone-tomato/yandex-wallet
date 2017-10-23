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


/*** Define CONST */
const PORT = process.env.NODE_PORT || 4000;
const PORT_SSL = process.env.NODE_PORT_SSL || 4001;
const MONGO = process.env.NODE_MONGO || 'mongodb://docker/test_yandex_wallet';
const HTTPS = process.env.NODE_HTTPS || false;

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

//********************** Mongo connections and server starts ***************************** */
if (process.env.NODE_ENV !== 'test') {
	const notifyStarting = port => {
		console.log(`YM Node School App listening on port ${port}!`)
		logger.log(`YM Node School App listening on port ${port}!`);
	}

	const startServer = () => {
		const options = {
			key: fs.readFileSync('./ssl/key.pem', 'utf8'),
			cert: fs.readFileSync('./ssl/cert.pem', 'utf8')
		};

		http.createServer(app.callback()).listen(PORT, notifyStarting(PORT));

		if (HTTPS)
			https.createServer(options, app.callback()).listen(PORT_SSL, notifyStarting(PORT_SSL));
	};

	mongoose.connect(MONGO, {
		useMongoClient: true,
		config: {
			autoIndex: true
		}
	});

	mongoose.connection
		.once('open', () => {
			console.log(`YM Node School APP connected to DB successfully. ADDR= ${MONGO}`)
			logger.log(`YM Node School APP connectsed to DB successfully. ADDR= ${MONGO}`);

			startServer();
		})
		.once('error', error => {
			console.error('Mongo Error: ', error);
			logger.error('Mongo error: ', error);
		});
} else
	module.exports = http.createServer(app.callback()).listen(PORT);
