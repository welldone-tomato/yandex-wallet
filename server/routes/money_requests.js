const router = require('koa-router')();

const getMoneyRequests = require('../controllers/money-requests/get-money-requests');
const getMoneyRequest = require('../controllers/money-requests/get-money-request');
const addMoneyRequest = require('../controllers/money-requests/add-money-request');

//****************************** ROUTES *************************************/
// Cards
router.get('/', getMoneyRequests);

router.get('/:guid', getMoneyRequest);

router.post('/', addMoneyRequest);

module.exports = router;