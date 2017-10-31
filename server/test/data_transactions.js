const ObjectId = require('mongoose').Types.ObjectId;

module.exports = [
    {
        cardId: new ObjectId("59e9ce16131a183238cc784e"),
        type: "paymentMobile",
        data: "89214445558",
        time: 1506625528,
        sum: -1000,
        invalidInfo: {
            isInvalid: true,
            error: "ValidationError: cardNumber: valid cardNumber required"
        }
    },
    {
        cardId: new ObjectId("59e9ce16131a183238cc784e"),
        type: "paymentMobile",
        data: "8921355338",
        time: 1506626528,
        sum: -1001
    },
    {
        cardId: new ObjectId("59e9ce16131a183238cc784f"),
        type: "paymentMobile",
        data: "89214445558",
        time: 1506636528,
        sum: -1000
    },
    {
        cardId: new ObjectId("59e9ce16131a183238cc784f"),
        type: "card2Card",
        data: "5469259469067206",
        time: 1506736528,
        sum: -100
    },
    {

        cardId: new ObjectId("59e9ce16131a183238cc784e"),
        type: "prepaidCard",
        data: "4011733472066880",
        time: 1506746528,
        sum: 100
    },
    {

        cardId: new ObjectId("59e9ce16131a183238cc7850"),
        type: "paymentMobile",
        data: "89214445558",
        time: 1506756528,
        sum: -1000
    },
    {

        cardId: new ObjectId("59e9ce16131a183238cc7850"),
        type: "paymentMobile",
        data: "89214445558",
        time: 1507150264,
        sum: -300
    },
    {
        cardId: new ObjectId("59e9ce16131a183238cc7845"),
        type: "card2Card",
        data: "5100699167020335",
        time: 1506736528,
        sum: -100
    },
    {

        cardId: new ObjectId("59e9ce16131a183238cc7841"),
        type: "prepaidCard",
        data: "5290256799199944",
        time: 1506746528,
        sum: 100
    },
    {

        cardId: new ObjectId("59e9ce16131a183238cc7841"),
        type: "paymentMobile",
        data: "89214445558",
        time: 1506756528,
        sum: -1000
    },
    {

        cardId: new ObjectId("59e9ce16131a183238cc7853"),
        type: "paymentMobile",
        data: "89214445558",
        time: 1507150264,
        sum: -300
    }
];