const ObjectId = require('mongoose').Types.ObjectId;
const stringCrypt = require('../../libs/string-encrypt');

module.exports = [
    {
        _id: new ObjectId("59f299a4d611ad01d0115b09"),
        email: "admin@admin.net",
        password: "adminAmdin2017&",
        telegramKey: stringCrypt('admin@admin.net', 4)
    },
    {
        _id: new ObjectId("59f299a4d611ad01d0115b10"),
        email: "user@user.net",
        password: "userUser2017&",
        telegramKey: stringCrypt('user@user.net', 4)
    }
];