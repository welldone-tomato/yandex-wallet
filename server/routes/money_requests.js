const router = require('koa-router')();

const getMoneyRequests = require('../controllers/money-requests/get-money-requests');

//****************************** ROUTES *************************************/
// Cards
router.get('/', getMoneyRequests);

// router.get('/:id', getMoneyRequest);

// router.post('/', addMoneyRequest);

// router.delete('/:id', deleteMoneyRequest);

module.exports = router;