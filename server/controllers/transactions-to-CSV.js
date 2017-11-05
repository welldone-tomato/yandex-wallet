/**
 * Трансформирует поток транзакций в потом CSV строк
 * 
 * @param {any} cursor 
 * @param {any} stream 
 * @param {any} ctx 
 */
module.exports = (cursor, stream, ctx) => {
	const fieldToString = field => '"' + String(field || "").replace(/\"/g, '""') + '"';
	const formatCardNumber = number => number.substr(0, 4) + '********' + number.substr(12, 15);

	const headers = [
		'Id',
		'Time',
		'Sum',
		'Type',
		'Data'
	].map(fieldToString).join(',');

	const docToString = doc => [
		doc.id,
		doc.time,
		doc.sum,
		doc.type,
		['prepaidCard', 'card2Card'].includes(doc.type) ? formatCardNumber(doc.data) : doc.data,
	].map(fieldToString).join(',');

	let started = false;

	const start = stream => {
		stream.write(headers + '\n');
		started = true;
	}

	cursor
		.on('data', transaction => {
			if (!started)
				start(stream);
			stream.write(docToString(transaction) + '\n')
		})
		.on('close', () => ctx.res.end())
		.once('error', err => ctx.throw(500, {
			msg: "Failed to get CSV"
		}));
};
