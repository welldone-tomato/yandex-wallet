const mongoose = require('mongoose');

const User = require('./user');
const Card = require('./card');

const Schema = mongoose.Schema;

const moneyRequestSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'userId is required'],
        index: true,
        validate: {
            validator: async value => {
                const data = await User.findById(value);
                return data;
            },
            message: 'user not found'
        }
    },
    cardId: {
        type: Schema.Types.ObjectId,
        ref: 'Card',
        required: [true, 'cardId is required'],
        index: true,
        validate: {
            validator: async value => {
                const card = await Card.findById(value);
                return card;
            },
            message: 'card with this id not found'
        }
    },
    hash: {
        type: String,
        index: true,
        unique: [true, 'non doublicated hash required'],
        match: [new RegExp('^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'), 'hash must GUID pattern matchs'],
        lowercase: true
    },
    sum: {
        type: Number,
        validate: {
            validator: value => value >= 0 && !isNaN(value),
            message: 'sum must be greater then 0 and must be a number'
        }
    }
}, {
    toObject: {
        transform: (doc, ret) => {
            ret.id = ret._id.toString();
            delete ret._id;
            delete ret.__v;
            delete ret.userId;
        }
    }
});

const guid = () => s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();

const s4 = () => Math.floor((1 + Math.random()) * 0x10000)
    .toString(16)
    .substring(1);

moneyRequestSchema.pre('save', async function(next) {
    const hash = guid();

    this.hash = hash;
    next();
});

module.exports = mongoose.model('moneyRequest', moneyRequestSchema);
