/**
 * Класс всплываемой ошибки
 * 
 * @class ApplicationError
 * @extends {Error}
 */
class ApplicationError extends Error {
    /**
     * Creates an instance of ApplicationError.
     * @param {any} message 
     * @param {any} status 
     * @param {any} isLogged Признак, что транзакция уже логгирована
     * @memberof ApplicationError
     */
    constructor(message, status = 500, isNotLogged = true) {
        super(message);
        this._status = status;
        this._isNotLogged = isNotLogged;
    }

    /**
     * Возвращает статус ошибки
     * 
     * @readonly
     * @memberof ApplicationError
     */
    get status() {
        return this._status;
    }

    /**
     * Возвращает признак логгирования
     * 
     * @readonly
     * @memberof ApplicationError
     */
    get isNotLogged() {
        return this._isNotLogged;
    }
}

module.exports = ApplicationError;
