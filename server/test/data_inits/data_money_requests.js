const ObjectId = require('mongoose').Types.ObjectId;

module.exports = [
    {
        userId: new ObjectId("59f299a4d611ad01d0115b09"),
        cardId: new ObjectId("59e9ce16131a183238cc784e"),
        sum: 100,
        hash: "b61cada1-77be-6b4a-d26d-f15abd334550"
    },
    {
        userId: new ObjectId("59f299a4d611ad01d0115b10"),
        cardId: new ObjectId("59e9ce16131a183238cc7845"),
        sum: 100,
        hash: "b61cada1-77b4-6b4a-d26d-f15abd334550"

    },
    {
        userId: new ObjectId("59f299a4d611ad01d0115b09"),
        cardId: new ObjectId("59e9ce16131a183238cc7850"),
        sum: 200,
        hash: "b61cada1-77b5-6b4a-d26d-f15abd334550"
    }
];