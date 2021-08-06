const { model, Schema } = require('mongoose');

const userSchema = Schema({
    name: {
        type: String,
        require: true,
    },
    email: {
        type: String,
        require: true,
        unique: true,
    },
    password: {
        type: String,
        require: true,
    },
});
const User = model('User', userSchema);
module.exports = User;
