const CustomError = (name, statusCode) =>
    (message) => {
        const error = new Error(message)
        error.name = name
        error.type = 'custom'
        error.statusCode = statusCode
        return error
    }

module.exports = {
    ValidationError: CustomError('ValidationError', 400),
    AuthenticationError: CustomError('AuthenticationError', 401),
    AuthorizationError: CustomError('AuthorizationError', 403),
}