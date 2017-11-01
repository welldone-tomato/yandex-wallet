const axios = require('axios');
const logger = require('../libs/logger')('currency-service');

const currencyUrl = 'https://query.yahooapis.com/v1/public/yql/wallet-app/currencies?format=json&env=store://datatables.org/alltableswithkeys';

let currencyState = {
  timestamp: null,
  RUB: null,
  USD: null,
  EUR: null,
};

const getCurrencies = () => {
  return currencyState;
};

const convert = ({ sum, convertFrom, convertTo }) => {
  if (convertFrom === convertTo) return sum;
  const rateFrom = currencyState[convertFrom];
  const rateTo = currencyState[convertTo];
  if (rateFrom === null || rateTo === null) return false;
  const convertedSum = rateFrom * sum / rateTo;
  return Math.round(convertedSum * 1e4) / 1e4;
};

const receiveCurrencies = async () => {
  try {
    const { data } = await axios.get(currencyUrl);
    const { created, results } = data.query;
    
    const [USD, EUR] = ['USD', 'EUR']
      .map(val => results.rate.find(obj => obj.id === `${val}RUB`))
      .map(obj => Number(obj.Rate));
    
    currencyState = {
      timestamp: new Date(created).getTime(),
      RUB: 1,
      USD,
      EUR,
    };
    
    logger.info('Received currencies', currencyState);
  } catch (err) {
    logger.error(`Can not receive currencies: ${err.message}`);
  }
};

receiveCurrencies();

setInterval(() => receiveCurrencies(), 1000 * 30);

module.exports = {
  getCurrencies,
  convert,
};
