const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: String,
        index: true,
        unique: true,
        required: [true, 'email is required']
    },
    password: {
        type: String,
        required: [true, 'password is required']
    }
});

userSchema.pre('save', next => {
    var user = this;
    bcrypt.genSalt(10, (err, salt) => {
        if (err)
            return next(err);
        else
            bcrypt.hash(user.password, salt, null, (err, hash) => {
                if (err)
                    return next(err);
                else {
                    user.password = hash;
                    next();
                }
            });
    });
});

// Methods
userSchema.methods.comparePassword = (candidate, callback) => {
    bcrypt.compare(candidate, this.password, (err, isMatch) => {
        if (err)
            return callback(err);
        else
            callback(null, isMatch)
    });
}

module.exports = mongoose.model('users', userSchema);
