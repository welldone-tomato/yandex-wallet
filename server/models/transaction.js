const mongoose = require('mongoose');

const Card = require('./card');

const Schema = mongoose.Schema;

const transactionSchema = new Schema({
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
    type: {
        type: String,
        required: [true, 'type of transaction is required'],
        enum: ['prepaidCard', 'paymentMobile', 'card2Card'],
        validate: {
            validator: async function (value) {
                if (value === 'card2Card') {
                    const card = await Card.findOne({
                        cardNumber: this.data
                    });
                    return card;
                } else return true;
            },
            message: 'receiver card not found'
        }
    },
    data: {
        type: String,
        required: [true, 'data for transaction is required']
    },
    time: {
        type: Number,
        default: Date.now()
    },
    sum: {
        type: Number,
        required: [true, 'sum of transaction is required'],
        validate: {
            validator: async function(value) {
                if (this.type === 'prepaidCard' && value <= 0) return false;

                if (this.type !== 'prepaidCard') {
                    const card = await Card.findById(this.cardId);

                    if (card.balance + value < 0) return false;
                    if ((this.type === 'paymentMobile' || this.type === 'card2Card') && value >= 0) return false;
                }

                return true;
            },
            message: 'invalid transaction sum'
        }
    }
},
    {
        toObject: {
            transform: (doc, ret) => {
                ret.id = ret._id.toString();
                delete ret._id;
                delete ret.__v;
            }
        }
    });

module.exports = mongoose.model('transaction', transactionSchema);
