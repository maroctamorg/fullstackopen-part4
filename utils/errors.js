const ValidationError = (message) => {
    const error = Error(message)
    error.name = 'ValidationError'
    return error
}

module.exports = { ValidationError }