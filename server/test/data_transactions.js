const ObjectId = require('mongoose').Types.ObjectId;

module.exports = [
    {
        cardId: new ObjectId("59e9ce16131a183238cc784e"),
        type: "prepaidCard",
        data: "yandex money 33222335",
        time: 1506605528,
        sum: 10
    },
    {

        cardId: new ObjectId("59e9ce16131a183238cc784e"),
        type: "paymentMobile",
        data: "89214445558",
        time: 1506625528,
        sum: -1000
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
        data: "546925000000000",
        time: 1506736528,
        sum: -100
    },
    {

        cardId: new ObjectId("59e9ce16131a183238cc784e"),
        type: "prepaidCard",
        data: "405870000000000",
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
        type: "prepaidCard",
        data: "cash 6665325",
        time: 1507150264,
        sum: 300
    }
];