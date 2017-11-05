const assert = require('assert');
const restoreDatabase = require('../test_helper');

const MoneyRequest = require('../../models/money_request');

describe('MoneyRequest create validation tests', () => {
    after(done => restoreDatabase(done));

    it('it should not get errors with messages', async () => {
        const mr = new MoneyRequest({
            userId: '59f299a4d611ad01d0115b09',
            cardId: '59e9ce16131a183238cc784e',
            sum: 100
        });

        try {
            await mr.save();
            assert(mr.guid !== null);
            assert(mr.guid.length > 16);
        } catch (err) {}
    });
});
