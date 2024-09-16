const { ValidationError } = require('../../utils/errors')
const User = require('../../models/user')

const validate = async (user) => {
    if ( !user.username || user.username.length < 3 ) {
        throw ValidationError('username must be provided and at least 3 characters long')
    }
    if ( !user.password || user.password.length < 3 ) {
        throw ValidationError('password must be provided and at least 3 characters long')
    }

    const existingUser = await User.find({ username: user.username })
    if(existingUser.length > 0) {
        throw ValidationError('expected `username` to be unique')
    }
}

module.exports = { validate }