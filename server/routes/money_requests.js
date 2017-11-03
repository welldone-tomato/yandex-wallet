const router = require('koa-router')();

const getMoneyRequests = require('../controllers/money-requests/get-money-requests');
const addMoneyRequest = require('../controllers/money-requests/add-money-request');

//****************************** ROUTES *************************************/
// Cards
router.get('/', getMoneyRequests);

// router.get('/:id', getMoneyRequest);

router.post('/', addMoneyRequest);

// router.delete('/:id', deleteMoneyRequest);

module.exports = router;