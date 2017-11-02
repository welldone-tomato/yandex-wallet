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
        validate: {
            // TODO 
            validator: value => value,
            message: 'valid hash required'
        }
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

const hashCode = object => {
    let hash = 0;

    const str = JSON.stringify(object);

    if (str.length === 0) return hash;

    for (var i = 0; i < str.length; i++) {
        hash = hash * 31 + str.charCodeAt(i);
        hash = hash & hash;
    }
    return Math.abs(hash);
};

moneyRequestSchema.pre('save', async function(next) {
    const {userId, cardId, sum} = this;

    const hash = hashCode({
        userId,
        cardId,
        sum,
        time: new Date().getTime()
    });

    this.hash = hash;
    next();
});

module.exports = mongoose.model('moneyRequest', moneyRequestSchema);
