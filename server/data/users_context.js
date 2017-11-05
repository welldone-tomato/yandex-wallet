const Context = require('./context');
const User = require('../models/user');

/**
 * Контекст работы с пользователями
 * 
 * @class CardsContext
 * @extends {Context}
 */
class UsersContext extends Context {
    constructor() {
        super(User);
    }

// Unusible
// /**
//  * Возвращает данные из БД в [] 
//  * 
//  * @returns {[{"id":String}]} 
//  * @memberof Context
//  */
// async getOne(conditions) {
//     try {
//         const data = await this.model.findOne(conditions);
//         return data ? data.toObject() : data;
//     } catch (err) {
//         logger.error(`Loading data from ${this.model} failed `, err);
//         throw new ApplicationError(`Loading data from ${this.model} failed, ${err}`, 500, false);
//     }
// }
}

module.exports = UsersContext;
