const ObjectId = require('mongoose').Types.ObjectId;

module.exports = [
    {
        userId: new ObjectId("59f299a4d611ad01d0115b09"),
        cardId: new ObjectId("59e9ce16131a183238cc784e"),
        sum: 100,
        goal: "Возврат денег за поездку"
    },
    {
        userId: new ObjectId("59f299a4d611ad01d0115b10"),
        cardId: new ObjectId("59e9ce16131a183238cc7845"),
        sum: 100,
        goal: "Взнос на садик"
    },
    {
        userId: new ObjectId("59f299a4d611ad01d0115b09"),
        cardId: new ObjectId("59e9ce16131a183238cc7850"),
        sum: 200,
        goal: "Обед в рестаране"
    }
];